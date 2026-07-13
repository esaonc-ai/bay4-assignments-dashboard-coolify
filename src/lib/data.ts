/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-07-13 ~13:26 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/outbound/load-task/search — active load tasks
 *     - /wms-bam/inbound/receive-task/search — active receive tasks (incl. assigneeUserName)
 *     - Assignee mapping resolved per-task via load-task + receive-task APIs
 *
 * Do NOT fabricate, estimate, or guess any metric.
 */

export type DoorStatus = "Occupied" | "Reserved" | "Available";

export interface DoorRecord {
  door: string;
  status: DoorStatus;
  assignee: string | null;
  customer: string | null;
  taskIds: string[];
  duration: string | null;
  anomaly: boolean;
}

export interface KpiMetric {
  label: string;
  value: string;
  numerator: number;
  denominator: number;
  percentage: number;
}

export interface AssigneeSummary {
  name: string;
  taskCount: number;
}

export interface MixMetric {
  label: string;
  count: number;
  total: number;
}

export interface TaskRecord {
  taskId: string;
  dns: string;
  customer: string;
  pieces: string;
  assignee: string;
  door: string;
}

export const TOTAL_DOORS = 23;

export const doors: DoorRecord[] = [
  // ═══════════════════════════════════════════════════════════════
  // OCCUPIED — doors with IN_PROGRESS tasks (5 doors)
  // ═══════════════════════════════════════════════════════════════
  {
    door: "DOCK50",
    status: "Occupied",
    assignee: "daira gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5090739"],
    duration: "~266d",
    anomaly: true,
  },
  {
    door: "DOCK51",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA / Nanci Viviana Rosas",
    customer: "KARAKA, LLC / GURUNANDA, LLC",
    taskIds: ["TASK-5313444", "TASK-5312023", "TASK-5314679"],
    duration: "~4.1d",
    anomaly: false,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA / JEROME ARANDA",
    customer: "KARAKA, LLC / GURUNANDA, LLC",
    taskIds: ["TASK-5314706", "TASK-5314922"],
    duration: "<1d",
    anomaly: false,
  },
  {
    door: "DOCK56",
    status: "Occupied",
    assignee: "RUFINO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5314912"],
    duration: "<1d",
    anomaly: false,
  },
  {
    door: "DOCK60",
    status: "Occupied",
    assignee: "DANIEL BELTRAN",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5314879"],
    duration: "<1d",
    anomaly: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // RESERVED — doors with only NEW tasks (3 doors)
  // ═══════════════════════════════════════════════════════════════
  {
    door: "DOCK55",
    status: "Reserved",
    assignee: "Nanci Viviana Rosas",
    customer: "KARAKA, LLC",
    taskIds: ["TASK-5314391"],
    duration: "<1d",
    anomaly: false,
  },
  {
    door: "DOCK57",
    status: "Reserved",
    assignee: "RUFINO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5314517"],
    duration: "<1d",
    anomaly: false,
  },
  {
    door: "DOCK59",
    status: "Reserved",
    assignee: "RUFINO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5314897"],
    duration: "<1d",
    anomaly: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // AVAILABLE — no active tasks (15 doors)
  // ═══════════════════════════════════════════════════════════════
  { door: "DOCK52", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK53", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK62", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK63", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK64", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK65", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK66", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK67", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK68", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK69", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK70", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK71", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK72", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
];

const occupied = doors.filter((d) => d.status === "Occupied").length;
const reserved = doors.filter((d) => d.status === "Reserved").length;
const available = doors.filter((d) => d.status === "Available").length;
const doorsWithTasks = doors.filter((d) => d.taskIds.length > 0).length;

export const kpiMetrics: KpiMetric[] = [
  {
    label: "Doors w/ Active Tasks",
    value: `${doorsWithTasks}/23`,
    numerator: doorsWithTasks,
    denominator: TOTAL_DOORS,
    percentage: (doorsWithTasks / TOTAL_DOORS) * 100,
  },
  {
    label: "In Progress (Occupied)",
    value: `${occupied}`,
    numerator: occupied,
    denominator: TOTAL_DOORS,
    percentage: (occupied / TOTAL_DOORS) * 100,
  },
  {
    label: "Doors Available",
    value: `${available}`,
    numerator: available,
    denominator: TOTAL_DOORS,
    percentage: (available / TOTAL_DOORS) * 100,
  },
  {
    label: "Task Occupancy Rate",
    value: `${((doorsWithTasks / TOTAL_DOORS) * 100).toFixed(1)}%`,
    numerator: doorsWithTasks,
    denominator: TOTAL_DOORS,
    percentage: (doorsWithTasks / TOTAL_DOORS) * 100,
  },
];

// Active assignee task counts — based on Bay 4 DOCK50-DOCK72 task-level assignee mapping
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 3 },
  { name: "RUFINO MUNGUIA", taskCount: 3 },
  { name: "Nanci Viviana Rosas", taskCount: 2 },
  { name: "DANIEL BELTRAN", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
];

// All-time assignment counts — updated with new assignees
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "Arnulfo Munguia (89)", taskCount: 112 },
  { name: "Daniel Beltran", taskCount: 91 },
  { name: "Rufino Munguia", taskCount: 6 },
  { name: "Caren Cubides", taskCount: 3 },
  { name: "Nanci Viviana Rosas", taskCount: 3 },
  { name: "Daniela Gonzalez", taskCount: 1 },
  { name: "Fatima Ponce", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
  { name: "Jerome Aranda", taskCount: 1 },
];

// Mix: 3 LOAD (outbound) + 8 RECEIVE (inbound) = 11 active tasks at Bay 4 doors
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 3, total: 11 },
  { label: "Inbound", count: 8, total: 11 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 3, total: 11 },
  { label: "Inbound", count: 8, total: 11 },
];

// Schedule: Appointment API unavailable — returned "Invalid arguments: No query condition found"
export const scheduleAvailable = false;
export const scheduledInboundOrders = 0;
export const scheduledOutboundOrders = 0;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 0;
export const pctScheduledInboundReceived = 0;
export const pctScheduledOutboundLoaded = 0;

// Facility-wide appointment context — unavailable
export const facilityWideReceiptsCreated = 0;
export const facilityWideReceiptsReceived = 0;
export const facilityWideLoadsCreated = 0;
export const facilityWideLoadsShipped = 0;

// Door occupancy duration: available from task startTime
export const doorDurationsAvailable = true;

// Active task records from fresh WISE data (July 13, 2026 ~13:26 PDT)
// 11 active tasks: 3 LOAD (outbound) + 8 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  // ────── OUTBOUND / LOAD — IN_PROGRESS (1) ──────
  {
    taskId: "TASK-5314879",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (<1d)",
    assignee: "DANIEL BELTRAN",
    door: "DOCK60",
  },

  // ────── OUTBOUND / LOAD — NEW (2) ──────
  {
    taskId: "TASK-5314391",
    dns: "LOAD NEW",
    customer: "KARAKA, LLC",
    pieces: "NEW (<1d)",
    assignee: "Nanci Viviana Rosas",
    door: "DOCK55",
  },
  {
    taskId: "TASK-5314679",
    dns: "LOAD NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW (<1d)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK51",
  },

  // ────── INBOUND / RECEIVE — IN_PROGRESS (5) ──────
  {
    taskId: "TASK-5314912",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (<1d)",
    assignee: "RUFINO MUNGUIA",
    door: "DOCK56",
  },
  {
    taskId: "TASK-5314706",
    dns: "RECEIVE IN_PROGRESS",
    customer: "KARAKA, LLC",
    pieces: "IN_PROGRESS (<1d)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5313444",
    dns: "RECEIVE IN_PROGRESS",
    customer: "KARAKA, LLC",
    pieces: "IN_PROGRESS (<1d)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK51",
  },
  {
    taskId: "TASK-5312023",
    dns: "RECEIVE IN_PROGRESS",
    customer: "KARAKA, LLC",
    pieces: "IN_PROGRESS (~4.1d)",
    assignee: "Nanci Viviana Rosas",
    door: "DOCK51",
  },
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~266d) ⚠ STALE",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },

  // ────── INBOUND / RECEIVE — NEW (3) ──────
  {
    taskId: "TASK-5314922",
    dns: "RECEIVE NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW (<1d)",
    assignee: "JEROME ARANDA",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5314897",
    dns: "RECEIVE NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW (<1d)",
    assignee: "RUFINO MUNGUIA",
    door: "DOCK59",
  },
  {
    taskId: "TASK-5314517",
    dns: "RECEIVE NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW (<1d)",
    assignee: "RUFINO MUNGUIA",
    door: "DOCK57",
  },
];
