import type { Counter, Project } from "@/lib/types";
import { appConfig } from "@/lib/appConfig";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "full",
  timeZone: appConfig.timezone,
});

const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: appConfig.timezone,
});

const shortDateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeZone: appConfig.timezone,
});

type DateOnlyTimeStrategy = "midday" | "endOfDay" | "startOfDay";

export type DashboardFreshnessStatus = "current" | "stale" | "unknown" | "future";

export interface DashboardFreshness {
  status: DashboardFreshnessStatus;
  currentDate: Date;
  registeredDate: Date | null;
  differenceDays: number | null;
}

export function hasExplicitTime(value: string) {
  return /^\d{4}-\d{2}-\d{2}[ T]\d{1,2}:\d{2}(?::\d{2})?$/.test(value.trim());
}

export function parseSheetDateAsLocalDate(
  value: string,
  options?: { dateOnlyTime?: DateOnlyTimeStrategy },
) {
  const normalized = value.trim();
  const dateOnlyTime = options?.dateOnlyTime ?? "midday";

  const dateOnlyMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const hour =
      dateOnlyTime === "startOfDay"
        ? 0
        : dateOnlyTime === "endOfDay"
          ? 23
          : 12;
    const minutes = dateOnlyTime === "endOfDay" ? 59 : 0;
    const seconds = dateOnlyTime === "endOfDay" ? 59 : 0;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      hour,
      minutes,
      seconds,
    );
  }

  const dateTimeMatch = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?$/,
  );
  if (dateTimeMatch) {
    const [, year, month, day, hours, minutes, seconds] = dateTimeMatch;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds ?? 0),
    );
  }

  return new Date(normalized);
}

export function getTodayDashboardDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: appConfig.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(Number(year), Number(month) - 1, Number(day), 12);
}

export function getDayDifference(from: string, toDate = getTodayDashboardDate()) {
  const fromDate = parseSheetDateAsLocalDate(from, { dateOnlyTime: "midday" });
  const diffMs = toDate.getTime() - fromDate.getTime();
  return Math.floor(diffMs / 86_400_000);
}

export function getDashboardFreshness(
  stateDate: string,
  today = getTodayDashboardDate(),
): DashboardFreshness {
  if (!stateDate.trim()) {
    return {
      status: "unknown",
      currentDate: today,
      registeredDate: null,
      differenceDays: null,
    };
  }

  const registeredDate = parseSheetDateAsLocalDate(stateDate, {
    dateOnlyTime: "midday",
  });

  if (Number.isNaN(registeredDate.getTime())) {
    return {
      status: "unknown",
      currentDate: today,
      registeredDate: null,
      differenceDays: null,
    };
  }

  const differenceDays = Math.floor(
    (today.getTime() - registeredDate.getTime()) / 86_400_000,
  );

  return {
    status:
      differenceDays > 0
        ? "stale"
        : differenceDays < 0
          ? "future"
          : "current",
    currentDate: today,
    registeredDate,
    differenceDays: Math.abs(differenceDays),
  };
}

export function formatDate(date: string) {
  return dateFormatter.format(parseSheetDateAsLocalDate(date));
}

export function formatDateValue(date: Date) {
  return dateFormatter.format(date);
}

export function formatDateTime(date: string) {
  if (!hasExplicitTime(date)) {
    return shortDateFormatter.format(parseSheetDateAsLocalDate(date));
  }

  return dateTimeFormatter.format(parseSheetDateAsLocalDate(date));
}

export function formatPercent(value: number) {
  return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
}

export function getCounterProgress(counter: Counter) {
  if (!counter.target_value || counter.target_value <= 0) {
    return null;
  }

  return Math.max(
    0,
    Math.min(100, (counter.current_value / counter.target_value) * 100),
  );
}

export function getProjectCategory(project: Project): {
  label: string;
  tone: string;
} {
  return {
    label: project.category || "Frente operativo",
    tone: project.accent || "slate",
  };
}

export function getStatusTone(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("bloq")) return "red";
  if (normalized.includes("urg")) return "amber";
  if (normalized.includes("vivo")) return "green";
  if (normalized.includes("salud")) return "violet";
  if (normalized.includes("mant")) return "slate";
  if (normalized.includes("pausa")) return "zinc";
  return "cyan";
}

export function getPriorityTone(priority: string) {
  const normalized = priority.toLowerCase();
  if (normalized.includes("máxima") || normalized.includes("maxima")) return "red";
  if (normalized.includes("urgente") || normalized.includes("alta")) return "amber";
  if (normalized.includes("baja")) return "slate";
  return "cyan";
}

export function getProjectDisplayHints(project: Project) {
  return project.notes;
}

function toTitleCaseWords(value: string) {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function formatProjectTag(projectId: string) {
  return toTitleCaseWords(projectId);
}

export function formatUpdateTypeTag(type: string) {
  const normalized = type.toLowerCase();

  const labels: Record<string, string> = {
    checkin: "Check-in",
    daily_close: "Cierre diario",
    daily_note: "Nota diaria",
    priority_cleanup: "Limpieza de prioridades",
    signal: "Señal",
    maintenance: "Mantenimiento",
    insight: "Insight",
    next_action: "Próxima acción",
    counter_update: "Actualización de contador",
    milestone: "Hito",
    health: "Salud",
    bug: "Bug",
    progress: "Avance",
  };

  return labels[normalized] ?? toTitleCaseWords(type);
}
