import { unstable_cache } from "next/cache";
import {
  getDayDifference,
  getTodayDashboardDate,
  parseSheetDateAsLocalDate,
} from "@/lib/format";
import { mockControlCenterData } from "@/lib/mockData";
import { readGoogleSheetTab } from "@/lib/googleSheets";
import type {
  ConfigEntry,
  ControlCenterData,
  Counter,
  DailyCheckin,
  DashboardState,
  Project,
  UpdateLogEntry,
} from "@/lib/types";

const TAB_NAMES = [
  "dashboard_state",
  "projects",
  "counters",
  "updates_log",
  "daily_checkins",
  "config",
] as const;

type SheetMatrix = string[][];

function toCell(value: string | undefined) {
  return (value ?? "").trim();
}

function toNumber(value: string | undefined) {
  const normalized = toCell(value).replace(",", ".");
  if (!normalized) return 0;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toNullableNumber(value: string | undefined) {
  const normalized = toCell(value).replace(",", ".");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function toBoolean(value: string | undefined) {
  const normalized = toCell(value).toLowerCase();
  return ["true", "1", "yes", "si", "sí", "x"].includes(normalized);
}

export function mapRowsToObjects(rows: SheetMatrix) {
  const [headerRow = [], ...bodyRows] = rows;
  const headers = headerRow.map((header) => toCell(header));

  return bodyRows
    .filter((row) => row.some((value) => toCell(value) !== ""))
    .map((row) =>
      headers.reduce<Record<string, string>>((acc, header, index) => {
        if (header) {
          acc[header] = toCell(row[index]);
        }
        return acc;
      }, {}),
    );
}

function sortLogs(logs: UpdateLogEntry[]) {
  return [...logs].sort(
    (a, b) =>
      parseSheetDateAsLocalDate(b.timestamp, {
        dateOnlyTime: "endOfDay",
      }).getTime() -
      parseSheetDateAsLocalDate(a.timestamp, {
        dateOnlyTime: "endOfDay",
      }).getTime(),
  );
}

function mapDashboardState(rows: SheetMatrix): DashboardState {
  const record = mapRowsToObjects(rows)[0] ?? {};

  return {
    date: record.date?.trim() ?? "",
    main_focus: record.main_focus ?? "",
    energy_physical: record.energy_physical ?? "",
    energy_mental: record.energy_mental ?? "",
    current_pressure: record.current_pressure ?? record.anxiety_level ?? "",
    today_main_action: record.today_main_action ?? "",
    do_not_touch_today: record.do_not_touch_today ?? "",
    notes: record.notes ?? "",
  };
}

export function mapProjects(rows: SheetMatrix): Project[] {
  return sortProjects(
    mapRowsToObjects(rows).map((record) => ({
      project_id: record.project_id ?? "",
      name: record.name ?? "",
      status: record.status ?? "",
      priority: record.priority ?? "",
      current_state: record.current_state ?? "",
      next_action: record.next_action ?? "",
      blocker: record.blocker ?? "",
      last_updated: record.last_updated ?? "",
      notes: record.notes ?? "",
      category: record.category ?? "",
      counter_id: record.counter_id ?? "",
      accent: record.accent ?? "",
      archived: toBoolean(record.archived),
      archived_at: record.archived_at ?? "",
      archived_reason: record.archived_reason ?? "",
    })),
  );
}

export function getActiveProjects(projects: Project[]) {
  return projects.filter((project) => !project.archived);
}

export function getArchivedProjects(projects: Project[]) {
  return projects.filter((project) => project.archived);
}

function getPriorityScore(priority: string) {
  const normalized = priority.toLowerCase();

  if (normalized.includes("máxima") || normalized.includes("maxima")) return 100;
  if (normalized.includes("urgente")) return 90;
  if (normalized.includes("alta")) return 75;
  if (normalized.includes("media")) return 50;
  if (normalized.includes("baja")) return 20;

  return 0;
}

function getStatusScore(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("urgente")) return 30;
  if (normalized.includes("activo")) return 20;
  if (normalized.includes("intención") || normalized.includes("intencion")) return 10;
  if (normalized.includes("mantenimiento")) return 5;
  if (normalized.includes("espera")) return 0;

  return 0;
}

export function sortProjects(projects: Project[]) {
  return [...projects].sort((a, b) => {
    const priorityDiff = getPriorityScore(b.priority) - getPriorityScore(a.priority);
    if (priorityDiff !== 0) return priorityDiff;

    const statusDiff = getStatusScore(b.status) - getStatusScore(a.status);
    if (statusDiff !== 0) return statusDiff;

    const dateDiff =
      parseSheetDateAsLocalDate(b.last_updated, { dateOnlyTime: "endOfDay" }).getTime() -
      parseSheetDateAsLocalDate(a.last_updated, { dateOnlyTime: "endOfDay" }).getTime();
    if (dateDiff !== 0) return dateDiff;

    return a.name.localeCompare(b.name, "es");
  });
}

function calculateCounterValue(counter: {
  current_value: number;
  type: string;
  start_date: string;
  reset_date: string;
  auto_calculate: boolean;
}) {
  if (counter.type !== "date_based" || !counter.auto_calculate) {
    return {
      current_value: counter.current_value,
      derived_from: "current_value" as const,
    };
  }

  if (counter.reset_date) {
    return {
      current_value: Math.max(0, getDayDifference(counter.reset_date, getTodayDashboardDate()) + 1),
      derived_from: "reset_date" as const,
    };
  }

  if (counter.start_date) {
    return {
      current_value: Math.max(0, getDayDifference(counter.start_date, getTodayDashboardDate())),
      derived_from: "start_date" as const,
    };
  }

  return {
    current_value: counter.current_value,
    derived_from: "current_value" as const,
  };
}

function calculateCounters(counters: Counter[]) {
  return counters.map((counter) => {
    const computed = calculateCounterValue(counter);
    return {
      ...counter,
      current_value: computed.current_value,
      derived_from: computed.derived_from,
    };
  });
}

function mapCounters(rows: SheetMatrix): Counter[] {
  const counters = mapRowsToObjects(rows).map((record) => {
    const type: Counter["type"] =
      record.type === "date_based" || record.auto_calculate === "true"
        ? "date_based"
        : "manual";
    const auto_calculate =
      record.auto_calculate === "true" || record.auto_calculate === "TRUE";

    return {
      counter_id: record.counter_id ?? "",
      label: record.label ?? "",
      current_value: toNumber(record.current_value),
      target_value: toNullableNumber(record.target_value),
      unit: record.unit ?? "",
      last_updated:
        record.last_updated ??
        record.reset_date ??
        record.start_date ??
        "",
      notes: record.notes ?? "",
      type,
      start_date: record.start_date ?? "",
      reset_date: record.reset_date ?? "",
      auto_calculate,
      derived_from: "current_value" as const,
      project_id: record.project_id ?? "",
      accent: record.accent ?? "",
    };
  });

  return calculateCounters(counters);
}

function mapUpdatesLog(rows: SheetMatrix): UpdateLogEntry[] {
  return sortLogs(
    mapRowsToObjects(rows).map((record) => ({
      timestamp: record.timestamp ?? "",
      project_id: record.project_id ?? "",
      type: record.type ?? "",
      summary: record.summary ?? "",
      details: record.details ?? "",
      mood: record.mood ?? "",
      energy: record.energy ?? "",
      source: record.source ?? "",
    })),
  );
}

function mapDailyCheckins(rows: SheetMatrix): DailyCheckin[] {
  return mapRowsToObjects(rows)
    .map((record) => ({
      date: record.date ?? "",
      type: record.type ?? "",
      physical_energy: record.physical_energy ?? "",
      mental_energy: record.mental_energy ?? "",
      summary: record.summary ?? "",
      main_action: record.main_action ?? "",
      tomorrow_action: record.tomorrow_action ?? "",
      notes: record.notes ?? "",
    }))
    .sort(
      (a, b) =>
        parseSheetDateAsLocalDate(b.date).getTime() -
        parseSheetDateAsLocalDate(a.date).getTime(),
    );
}

function mapConfig(rows: SheetMatrix): ConfigEntry[] {
  return mapRowsToObjects(rows).map((record) => ({
    key: record.key ?? "",
    value: record.value ?? "",
    notes: record.notes ?? "",
  }));
}

async function fetchSheetsData(): Promise<ControlCenterData> {
  const [dashboardRows, projectsRows, countersRows, updatesRows, checkinsRows, configRows] =
    await Promise.all(TAB_NAMES.map((tabName) => readGoogleSheetTab(tabName)));
  const projects = mapProjects(projectsRows);

  return {
    dashboardState: mapDashboardState(dashboardRows),
    projects: getActiveProjects(projects),
    archivedProjects: getArchivedProjects(projects),
    counters: mapCounters(countersRows),
    updatesLog: mapUpdatesLog(updatesRows),
    dailyCheckins: mapDailyCheckins(checkinsRows),
    config: mapConfig(configRows),
    source: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
      ? "google-sheets"
      : "api-key",
    generatedAt: new Date().toISOString(),
  };
}

export async function getControlCenterDataUncached(): Promise<ControlCenterData> {
  try {
    const data = await fetchSheetsData();
    return {
      ...data,
      warning: undefined,
    };
  } catch {
    return {
      ...mockControlCenterData,
      projects: getActiveProjects(mockControlCenterData.projects),
      archivedProjects: getArchivedProjects([
        ...mockControlCenterData.projects,
        ...mockControlCenterData.archivedProjects,
      ]),
      counters: calculateCounters(mockControlCenterData.counters),
      generatedAt: new Date().toISOString(),
      warning: "Modo demo activo / configurá Google Sheets para usar tus datos",
    };
  }
}

export const getControlCenterData = unstable_cache(
  async () => getControlCenterDataUncached(),
  ["control-center-data"],
  { revalidate: 60 },
);

export function getProjectUpdates(
  updates: UpdateLogEntry[],
  projectId: string,
) {
  return updates.filter((entry) => entry.project_id === projectId);
}

export function getProjectCheckins(
  checkins: DailyCheckin[],
  projectId: string,
  projectName: string,
) {
  const needles = [projectId.toLowerCase(), projectName.toLowerCase()];
  return checkins.filter((entry) => {
    const haystack = `${entry.summary} ${entry.main_action} ${entry.tomorrow_action} ${entry.notes}`.toLowerCase();
    return needles.some((needle) => haystack.includes(needle));
  });
}

export function getLatestCheckinByType(
  checkins: DailyCheckin[],
  type: string,
) {
  return checkins.find((entry) => entry.type.toLowerCase() === type.toLowerCase()) ?? null;
}

export function getLatestCheckin(checkins: DailyCheckin[]) {
  return checkins[0] ?? null;
}

export function getLatestClosure(checkins: DailyCheckin[]) {
  return (
    checkins.find((entry) => {
      const normalized = entry.type.toLowerCase();
      return normalized.includes("cierre") || normalized.includes("close");
    }) ?? null
  );
}

export function getRelatedCounter(
  counters: Counter[],
  project: Project,
) {
  return (
    counters.find((counter) => counter.counter_id === project.counter_id) ??
    counters.find((counter) => counter.project_id === project.project_id) ??
    null
  );
}
