/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-03 ~12:14 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search — door locations + dock/space status
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (NEW/IN_PROGRESS)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (NEW/IN_PROGRESS)
 *     - /wms-bam/appointment/search-by-paging — scheduled appointments (today, facility-wide)
 *     - assignee names resolved via task assigneeUserName; customers via /mdm/customer/search
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
  // OCCUPIED — active IN_PROGRESS load/receive tasks (7 doors)
  // ═══════════════════════════════════════════════════════════════
  {
    door: "DOCK50",
    status: "Occupied",
    assignee: "daira gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5090739"],
    duration: "~316d",
    anomaly: true,
  },
  {
    door: "DOCK51",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5359541"],
    duration: "1h 45m",
    anomaly: false,
  },
  {
    door: "DOCK52",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5358466"],
    duration: "1d 1h",
    anomaly: false,
  },
  {
    door: "DOCK53",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5358865"],
    duration: "21h 58m",
    anomaly: false,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5338695"],
    duration: "26d 19h",
    anomaly: true,
  },
  {
    door: "DOCK55",
    status: "Occupied",
    assignee: "Fatima Ponce",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5359273"],
    duration: "4h 20m",
    anomaly: false,
  },
  {
    door: "DOCK56",
    status: "Occupied",
    assignee: "DANIEL BELTRAN",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5359711"],
    duration: "0h 11m",
    anomaly: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // RESERVED — NEW (assigned, not started) load tasks (1 door)
  // ═══════════════════════════════════════════════════════════════
  {
    door: "DOCK67",
    status: "Reserved",
    assignee: "JEROME ARANDA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5359531"],
    duration: null,
    anomaly: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // AVAILABLE — no open load/receive task (15 doors)
  // ═══════════════════════════════════════════════════════════════
  { door: "DOCK57", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK62", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK63", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK64", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK65", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK66", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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
    label: "Doors Occupied",
    value: `${occupied}`,
    numerator: occupied,
    denominator: TOTAL_DOORS,
    percentage: (occupied / TOTAL_DOORS) * 100,
  },
  {
    label: "Doors w/ Active Tasks",
    value: `${doorsWithTasks}`,
    numerator: doorsWithTasks,
    denominator: TOTAL_DOORS,
    percentage: (doorsWithTasks / TOTAL_DOORS) * 100,
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 4 },
  { name: "DANIEL BELTRAN", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
  { name: "Fatima Ponce", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED/FORCE_CLOSED) for Bay 4 DOCK50–DOCK72
// FRESH rollup 2026-09-03 12:14 PDT — scanned CLOSED/FORCE_CLOSED load + receive tasks
// across all 23 Bay-4 door IDs (3,600 closed tasks total, 80 assignees)
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 937 },
  { name: "DANIEL BELTRAN", taskCount: 903 },
  { name: "DANIELA GONZALEZ", taskCount: 358 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR Alvarado", taskCount: 111 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "Fatima Ponce", taskCount: 84 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// Mix: 6 LOAD (outbound) + 2 RECEIVE (inbound) = 8 open tasks at Bay 4 doors
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 8 },
  { label: "Inbound", count: 2, total: 8 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 8 },
  { label: "Inbound", count: 2, total: 8 },
];

// Schedule: today's appointments (2026-09-03) via /wms-bam/appointment/search-by-paging
// (facility-wide scope — appointments do not carry a clean dockId for Bay 4 scoping)
export const scheduleAvailable = true;
export const scheduledInboundOrders = 37;
export const scheduledOutboundOrders = 102;
export const scheduledInboundReceived = 2;
export const scheduledOutboundLoaded = 42;
export const pctScheduledInboundReceived = (2 / 37) * 100; // 5.4% — 2 of 37 scheduled inbounds received
export const pctScheduledOutboundLoaded = (42 / 102) * 100; // 41.2% — 42 of 102 scheduled outbounds loaded

// Today's appointment context (2026-09-03, facility-wide)
export const facilityWideReceiptsCreated = 37;
export const facilityWideReceiptsReceived = 2;
export const facilityWideLoadsCreated = 102;
export const facilityWideLoadsShipped = 42;

// Door occupancy duration: available from task start timestamps
export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 03, 2026 ~12:14 PDT)
// 8 open tasks: 6 LOAD (outbound) + 2 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  // ────── DOCK50 — inbound severe anomaly ──────
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~316d) ⚠ STALE",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },

  // ────── OUTBOUND / LOAD (5) ──────
  {
    taskId: "TASK-5359541",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (1h 45m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK51",
  },
  {
    taskId: "TASK-5358466",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (1d 1h)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK52",
  },
  {
    taskId: "TASK-5358865",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (21h 58m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5338695",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (26d 19h) ⚠ STALE",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5359711",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (0h 11m)",
    assignee: "DANIEL BELTRAN",
    door: "DOCK56",
  },

  // ────── INBOUND / RECEIVE (2nd) ──────
  {
    taskId: "TASK-5359273",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (4h 20m)",
    assignee: "Fatima Ponce",
    door: "DOCK55",
  },

  // ────── RESERVED — NEW load ──────
  {
    taskId: "TASK-5359531",
    dns: "LOAD NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW (2h 47m)",
    assignee: "JEROME ARANDA",
    door: "DOCK67",
  },
];
