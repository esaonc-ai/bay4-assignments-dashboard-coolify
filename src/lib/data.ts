/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-08-23 ~18:27 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms/wms-location/search — door locations + dock/space status
 *     - /wms-bam/tasks/search — open dock tasks (per door)
 *     - /wms-bam/appointment/search-by-paging — scheduled appointments (today)
 *     - /wms-bam/inbound/receive-task/search — receipt completion (status=CLOSED)
 *     - /wms-bam/outbound/load-task/search — load completion (status=CLOSED)
 *     - /wms-bam/user/search-by-paging — assignee name resolution
 *     - /mdm/customer/search — customer name resolution
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
  // OCCUPIED — with active IN_PROGRESS load/receive tasks (8 doors)
  // ═══════════════════════════════════════════════════════════════
  {
    door: "DOCK50",
    status: "Occupied",
    assignee: "Arnulfo Munguia, daira gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5349533", "TASK-5090739"],
    duration: "52h 22m",
    anomaly: true,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "Arnulfo Munguia",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5348668", "TASK-5338695"],
    duration: "74h 36m",
    anomaly: true,
  },
  {
    door: "DOCK55",
    status: "Occupied",
    assignee: "Ricardo Tapia",
    customer: "KARAKA, LLC",
    taskIds: ["TASK-5348581"],
    duration: "75h 51m",
    anomaly: false,
  },
  {
    door: "DOCK58",
    status: "Occupied",
    assignee: "Daniela Gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5348637"],
    duration: "69h 46m",
    anomaly: false,
  },
  {
    door: "DOCK63",
    status: "Occupied",
    assignee: "Daniela Gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5349676"],
    duration: "50h 51m",
    anomaly: false,
  },
  {
    door: "DOCK64",
    status: "Occupied",
    assignee: "Daniela Gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5345747"],
    duration: "95h 57m",
    anomaly: false,
  },
  {
    door: "DOCK65",
    status: "Occupied",
    assignee: "Jorge Antonio Franco",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5349252"],
    duration: "54h 48m",
    anomaly: false,
  },
  {
    door: "DOCK66",
    status: "Occupied",
    assignee: "Daniela Gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5349678"],
    duration: "50h 45m",
    anomaly: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // RESERVED — NEW load tasks assigned, not yet started (2 doors)
  // ═══════════════════════════════════════════════════════════════
  {
    door: "DOCK51",
    status: "Reserved",
    assignee: "Eduardo Mejia",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5349627"],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK53",
    status: "Reserved",
    assignee: "Arnulfo Munguia",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5349697"],
    duration: null,
    anomaly: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // AVAILABLE — no open load/receive task (13 doors)
  // ═══════════════════════════════════════════════════════════════
  { door: "DOCK52", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK56", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK57", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK62", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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
  { name: "Arnulfo Munguia", taskCount: 4 },
  { name: "Daniela Gonzalez", taskCount: 4 },
  { name: "Ricardo Tapia", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
  { name: "Jorge Antonio Franco", taskCount: 1 },
  { name: "Eduardo Mejia", taskCount: 1 },
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

// Mix: 5 LOAD (outbound) + 7 RECEIVE (inbound) = 12 open tasks at Bay 4 doors
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 12 },
  { label: "Inbound", count: 7, total: 12 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 12 },
  { label: "Inbound", count: 7, total: 12 },
];

// Schedule: today's appointments (2026-08-23) via /wms-bam/appointment/search-by-paging
// (facility-wide scope — appointments do not carry a clean dockId for Bay 4 scoping)
export const scheduleAvailable = true;
export const scheduledInboundOrders = 2;
export const scheduledOutboundOrders = 0;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 0;
export const pctScheduledInboundReceived = 0.0;
export const pctScheduledOutboundLoaded = 0.0; // 0 scheduled outbound today → n/a (rendered as "n/a")

// Today's appointment context (2026-08-23, facility-wide)
export const facilityWideReceiptsCreated = 2;
export const facilityWideReceiptsReceived = 0;
export const facilityWideLoadsCreated = 0;
export const facilityWideLoadsShipped = 0;

// Door occupancy duration: available from task check-in timestamps
export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Aug 23, 2026 ~18:27 PDT)
// 12 open tasks: 5 LOAD (outbound) + 7 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  // ────── OUTBOUND / LOAD (5) ──────
  {
    taskId: "TASK-5349533",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (52h22m)",
    assignee: "Arnulfo Munguia",
    door: "DOCK50",
  },
  {
    taskId: "TASK-5349627",
    dns: "LOAD NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW",
    assignee: "Eduardo Mejia",
    door: "DOCK51",
  },
  {
    taskId: "TASK-5349697",
    dns: "LOAD NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW",
    assignee: "Arnulfo Munguia",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5348668",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (74h36m)",
    assignee: "Arnulfo Munguia",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5338695",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (endTime set) ⚠ STALE",
    assignee: "Arnulfo Munguia",
    door: "DOCK54",
  },

  // ────── INBOUND / RECEIVE (7) ──────
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~306d) ⚠ STALE",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },
  {
    taskId: "TASK-5348581",
    dns: "RECEIVE IN_PROGRESS",
    customer: "KARAKA, LLC",
    pieces: "IN_PROGRESS (75h51m)",
    assignee: "Ricardo Tapia",
    door: "DOCK55",
  },
  {
    taskId: "TASK-5348637",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (69h46m)",
    assignee: "Daniela Gonzalez",
    door: "DOCK58",
  },
  {
    taskId: "TASK-5349676",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (50h51m)",
    assignee: "Daniela Gonzalez",
    door: "DOCK63",
  },
  {
    taskId: "TASK-5345747",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (95h57m)",
    assignee: "Daniela Gonzalez",
    door: "DOCK64",
  },
  {
    taskId: "TASK-5349252",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (54h48m)",
    assignee: "Jorge Antonio Franco",
    door: "DOCK65",
  },
  {
    taskId: "TASK-5349678",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (50h45m)",
    assignee: "Daniela Gonzalez",
    door: "DOCK66",
  },
];
