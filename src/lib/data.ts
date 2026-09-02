/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-02 ~07:54 PDT (live WISE/WMS APIs)
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
  // OCCUPIED — active IN_PROGRESS load/receive tasks (6 doors)
  // ═══════════════════════════════════════════════════════════════
  {
    door: "DOCK50",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA, LORENZO RODRIGUEZ, daira gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5356244", "TASK-5357865", "TASK-5090739"],
    duration: "44h 06m",
    anomaly: true,
  },
  {
    door: "DOCK51",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5355188"],
    duration: "113h 48m",
    anomaly: true,
  },
  {
    door: "DOCK52",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5356717"],
    duration: "40h 53m",
    anomaly: false,
  },
  {
    door: "DOCK53",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5357541"],
    duration: "19h 43m",
    anomaly: false,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA, LORENZO RODRIGUEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5356139", "TASK-5357678", "TASK-5338695"],
    duration: "45h 43m",
    anomaly: true,
  },
  {
    door: "DOCK58",
    status: "Occupied",
    assignee: "RUFINO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5348637"],
    duration: "12d 11h",
    anomaly: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // RESERVED — NEW (assigned, not started) load tasks (0 doors)
  // ═══════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════
  // AVAILABLE — no open load/receive task (17 doors)
  // ═══════════════════════════════════════════════════════════════
  { door: "DOCK55", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK56", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK57", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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
  { name: "ARNULFO MUNGUIA", taskCount: 6 },
  { name: "LORENZO RODRIGUEZ", taskCount: 2 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED/FORCE_CLOSED) for Bay 4 DOCK50–DOCK72
// (unchanged snapshot — no fresh all-time rollup in this pull)
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 878 },
  { name: "DANIEL BELTRAN", taskCount: 830 },
  { name: "DANIELA GONZALEZ", taskCount: 327 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 148 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "JULIO CESAR ALVARADO", taskCount: 99 },
  { name: "David Ramirez Selva", taskCount: 76 },
  { name: "Fatima Del Rosario Ponce", taskCount: 58 },
];

// Mix: 8 LOAD (outbound) + 2 RECEIVE (inbound) = 10 open tasks at Bay 4 doors
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 8, total: 10 },
  { label: "Inbound", count: 2, total: 10 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 8, total: 10 },
  { label: "Inbound", count: 2, total: 10 },
];

// Schedule: today's appointments (2026-09-02) via /wms-bam/appointment/search-by-paging
// (facility-wide scope — appointments do not carry a clean dockId for Bay 4 scoping)
export const scheduleAvailable = true;
export const scheduledInboundOrders = 34;
export const scheduledOutboundOrders = 84;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 2;
export const pctScheduledInboundReceived = 0.0;
export const pctScheduledOutboundLoaded = (2 / 84) * 100; // 2.4% — 2 of 84 scheduled outbounds loaded

// Today's appointment context (2026-09-02, facility-wide)
export const facilityWideReceiptsCreated = 34;
export const facilityWideReceiptsReceived = 0;
export const facilityWideLoadsCreated = 84;
export const facilityWideLoadsShipped = 2;

// Door occupancy duration: available from task start timestamps
export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 02, 2026 ~07:54 PDT)
// 10 open tasks: 8 LOAD (outbound) + 2 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  // ────── OUTBOUND / LOAD (8) ──────
  {
    taskId: "TASK-5356244",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (44h06m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK50",
  },
  {
    taskId: "TASK-5357865",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (16h03m)",
    assignee: "LORENZO RODRIGUEZ",
    door: "DOCK50",
  },
  {
    taskId: "TASK-5355188",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (113h48m) ⚠ STALE",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK51",
  },
  {
    taskId: "TASK-5356717",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (40h53m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK52",
  },
  {
    taskId: "TASK-5357541",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (19h43m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5356139",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (45h43m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5357678",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (18h20m)",
    assignee: "LORENZO RODRIGUEZ",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5338695",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (25d) ⚠ STALE",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },

  // ────── INBOUND / RECEIVE (2) ──────
  {
    taskId: "TASK-5348637",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (12d11h) ⚠ STALE",
    assignee: "RUFINO MUNGUIA",
    door: "DOCK58",
  },
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~315d) ⚠ STALE",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },
];
