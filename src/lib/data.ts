/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-08-15 ~19:21 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search — door locations
 *     - /wms-bam/outbound/load-task/search — active load tasks (per door)
 *     - /wms-bam/inbound/receive-task/search — active receive tasks (per door)
 *     - /wms-bam/appointment/search-by-paging — scheduled appointments
 *     - /wms-bam/outbound/load-task/search-by-paging + receive-task/search-by-paging
 *       (CLOSED/FORCE_CLOSED) — Bay 4 all-time assignment history
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
  // OCCUPIED — doors with IN_PROGRESS tasks (10 doors)
  // ═══════════════════════════════════════════════════════════════
  {
    door: "DOCK50",
    status: "Occupied",
    assignee: "daira gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5090739"],
    duration: "~298d",
    anomaly: true,
  },
  {
    door: "DOCK51",
    status: "Occupied",
    assignee: "EDUARDO MEJIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5340823"],
    duration: "~4.2d",
    anomaly: false,
  },
  {
    door: "DOCK52",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA / EDUARDO MEJIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5342396", "TASK-5344130"],
    duration: "~2.3d",
    anomaly: false,
  },
  {
    door: "DOCK53",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5340789", "TASK-5341961", "TASK-5343649"],
    duration: "~4.2d",
    anomaly: false,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5338695", "TASK-5341920"],
    duration: "~8.1d",
    anomaly: false,
  },
  {
    door: "DOCK55",
    status: "Occupied",
    assignee: "EDUARDO MEJIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5344158"],
    duration: "<1d",
    anomaly: false,
  },
  {
    door: "DOCK58",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5341442"],
    duration: "~3.4d",
    anomaly: false,
  },
  {
    door: "DOCK62",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5344066"],
    duration: "~1.1d",
    anomaly: false,
  },
  {
    door: "DOCK63",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5343800"],
    duration: "~1.1d",
    anomaly: false,
  },
  {
    door: "DOCK65",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5343460"],
    duration: "~1.1d",
    anomaly: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // AVAILABLE — no active tasks (13 doors)
  // ═══════════════════════════════════════════════════════════════
  { door: "DOCK56", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK57", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK64", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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
  { name: "ARNULFO MUNGUIA", taskCount: 7 },
  { name: "EDUARDO MEJIA", taskCount: 3 },
  { name: "DANIELA GONZALEZ", taskCount: 3 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED/FORCE_CLOSED) for Bay 4 DOCK50–DOCK72
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

// Mix: 10 LOAD (outbound) + 4 RECEIVE (inbound) = 14 active tasks at Bay 4 doors
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 10, total: 14 },
  { label: "Inbound", count: 4, total: 14 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 10, total: 14 },
  { label: "Inbound", count: 4, total: 14 },
];

// Schedule: Appointment API now available via /wms-bam/appointment/search-by-paging
// Rolling 7-day window (Aug 9–15, 2026), facility-wide
export const scheduleAvailable = true;
export const scheduledInboundOrders = 154;
export const scheduledOutboundOrders = 489;
export const scheduledInboundReceived = 72;
export const scheduledOutboundLoaded = 452;
export const pctScheduledInboundReceived = 46.8;
export const pctScheduledOutboundLoaded = 92.4;

// Facility-wide appointment context — rolling 7-day (Aug 9–15, 2026)
export const facilityWideReceiptsCreated = 154;
export const facilityWideReceiptsReceived = 72;
export const facilityWideLoadsCreated = 489;
export const facilityWideLoadsShipped = 452;

// Door occupancy duration: available from task startTime
export const doorDurationsAvailable = true;

// Active task records from fresh WISE data (Aug 15, 2026 ~19:21 PDT)
// 14 active tasks: 10 LOAD (outbound) + 4 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  // ────── OUTBOUND / LOAD — IN_PROGRESS (10) ──────
  {
    taskId: "TASK-5340823",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~4.2d)",
    assignee: "EDUARDO MEJIA",
    door: "DOCK51",
  },
  {
    taskId: "TASK-5342396",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~2.3d)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK52",
  },
  {
    taskId: "TASK-5344130",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~1.1d)",
    assignee: "EDUARDO MEJIA",
    door: "DOCK52",
  },
  {
    taskId: "TASK-5340789",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~4.2d)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5341961",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~3.2d)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5343649",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~1.2d)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5338695",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~8.1d)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5341920",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~3.2d)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5344158",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (<1d)",
    assignee: "EDUARDO MEJIA",
    door: "DOCK55",
  },
  {
    taskId: "TASK-5341442",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~3.4d)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK58",
  },

  // ────── INBOUND / RECEIVE — IN_PROGRESS (4) ──────
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~298d) ⚠ STALE",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },
  {
    taskId: "TASK-5344066",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~1.1d)",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK62",
  },
  {
    taskId: "TASK-5343800",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~1.1d)",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK63",
  },
  {
    taskId: "TASK-5343460",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~1.1d)",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK65",
  },
];
