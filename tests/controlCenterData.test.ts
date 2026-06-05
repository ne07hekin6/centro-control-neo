import { describe, expect, it } from "vitest";
import {
  getControlCenterDataUncached,
  mapProjects,
  mapRowsToObjects,
} from "@/lib/controlCenterData";
import { getDashboardFreshness, getDayDifference } from "@/lib/format";

describe("date-based counters", () => {
  it("calculates reset-based counters inclusively", () => {
    const today = new Date(2026, 4, 14, 12);
    expect(getDayDifference("2026-05-11", today) + 1).toBe(4);
  });
});

describe("dashboard freshness", () => {
  const today = new Date(2026, 4, 25, 12);

  it("does not warn when the dashboard state is from today", () => {
    expect(getDashboardFreshness("2026-05-25", { today, currentHour: 9 }).status).toBe("current");
  });

  it("keeps older data in a neutral grace state before midday", () => {
    expect(getDashboardFreshness("2026-05-24", { today, currentHour: 11 })).toMatchObject({
      status: "grace",
      differenceDays: 1,
    });
  });

  it("reports data older than yesterday as stale even before midday", () => {
    expect(getDashboardFreshness("2026-05-22", { today, currentHour: 9 })).toMatchObject({
      status: "stale",
      differenceDays: 3,
    });
  });

  it("reports stale data with the elapsed number of days after midday", () => {
    expect(getDashboardFreshness("2026-05-22", { today, currentHour: 12 })).toMatchObject({
      status: "stale",
      differenceDays: 3,
    });
  });

  it("reports missing dates as unknown state", () => {
    expect(getDashboardFreshness("", { today, currentHour: 9 }).status).toBe("unknown");
  });

  it("reports future dates as inconsistent", () => {
    expect(getDashboardFreshness("2026-05-27", { today, currentHour: 9 })).toMatchObject({
      status: "future",
      differenceDays: 2,
    });
  });
});

describe("mapRowsToObjects", () => {
  it("maps header rows into typed plain objects", () => {
    const rows = [
      ["project_id", "name", "status"],
      ["contenido", "Contenido", "mantenimiento"],
      ["producto", "Producto principal", "activo"],
    ];

    expect(mapRowsToObjects(rows)).toEqual([
      { project_id: "contenido", name: "Contenido", status: "mantenimiento" },
      { project_id: "producto", name: "Producto principal", status: "activo" },
    ]);
  });
});

describe("project ordering", () => {
  it("treats expressive priority labels as sortable urgency", () => {
    const rows = [
      ["project_id", "name", "status", "priority", "current_state", "next_action", "blocker", "last_updated", "notes"],
      ["a", "Ingresos", "urgente", "máxima", "", "", "", "2026-05-22", ""],
      ["b", "Operación", "activo urgente", "urgente", "", "", "", "2026-05-22", ""],
      ["c", "Producto", "activo", "alta", "", "", "", "2026-05-22", ""],
      ["d", "Archivo", "espera pasiva", "baja", "", "", "", "2026-05-22", ""],
    ];

    const projects = mapProjects(rows);

    expect(projects.map((project) => project.project_id)).toEqual(["a", "b", "c", "d"]);
  });
});

describe("getControlCenterDataUncached", () => {
  it("returns data with counters available", async () => {
    const data = await getControlCenterDataUncached();

    expect(["mock", "google-sheets", "api-key"]).toContain(data.source);
    expect(data.counters.length).toBeGreaterThan(0);
    expect(data.projects.length).toBeGreaterThan(0);
    expect(data.updatesLog[0].timestamp >= data.updatesLog[data.updatesLog.length - 1].timestamp).toBe(true);
  });
});
