export type ProjectStatus =
  | "activo"
  | "mantenimiento"
  | "bloqueado"
  | "pausa"
  | "urgente"
  | "salud"
  | "vivo";

export type ProjectPriority = "alta" | "media" | "baja";

export type ProjectCategory =
  | "creativo"
  | "estrategico"
  | "institucional"
  | "biologico"
  | "autonomia"
  | "general";

export interface DashboardState {
  date: string;
  main_focus: string;
  energy_physical: string;
  energy_mental: string;
  current_pressure: string;
  today_main_action: string;
  do_not_touch_today: string;
  notes: string;
}

export interface Project {
  project_id: string;
  name: string;
  status: string;
  priority: string;
  current_state: string;
  next_action: string;
  blocker: string;
  last_updated: string;
  notes: string;
  category: string;
  counter_id: string;
  accent: string;
}

export interface Counter {
  counter_id: string;
  label: string;
  current_value: number;
  target_value: number | null;
  unit: string;
  last_updated: string;
  notes: string;
  type: "manual" | "date_based";
  start_date: string;
  reset_date: string;
  auto_calculate: boolean;
  derived_from: "current_value" | "start_date" | "reset_date";
  project_id: string;
  accent: string;
}

export interface UpdateLogEntry {
  timestamp: string;
  project_id: string;
  type: string;
  summary: string;
  details: string;
  mood: string;
  energy: string;
  source: string;
}

export interface DailyCheckin {
  date: string;
  type: string;
  physical_energy: string;
  mental_energy: string;
  summary: string;
  main_action: string;
  tomorrow_action: string;
  notes: string;
}

export interface ConfigEntry {
  key: string;
  value: string;
  notes: string;
}

export interface ControlCenterData {
  dashboardState: DashboardState;
  projects: Project[];
  counters: Counter[];
  updatesLog: UpdateLogEntry[];
  dailyCheckins: DailyCheckin[];
  config: ConfigEntry[];
  source: "google-sheets" | "api-key" | "mock";
  warning?: string;
  generatedAt: string;
}
