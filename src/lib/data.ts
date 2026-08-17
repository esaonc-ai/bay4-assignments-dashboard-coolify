/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-08-17 ~16:17 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/location/dock/search-by-paging — door locations + dockStatus
 *     - /wms-bam/tasks/search — active IN_PROGRESS dock tasks (per door)
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
  // OCCUPIED — with active IN_PROGRESS tasks (7 doors)
  // ═══════════════════════════════════════════════════════════════
  {
    door: "DOCK50",
    status: "Occupied",
    assignee: "Daniel Beltran, daira gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5344717", "TASK-5090739"],
    duration: "~6.4h",
    anomaly: true,
  },
  {
    door: "DOCK52",
    status: "Occupied",
    assignee: "Arnulfo Munguia, Eduardo Mejia",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5342396", "TASK-5344130"],
    duration: "~4.2d",
    anomaly: false,
  },
  {
    door: "DOCK53",
    status: "Occupied",
    assignee: "Arnulfo Munguia, Daniel Beltran",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5343649", "TASK-5341961", "TASK-5344883"],
    duration: "~5.0d",
    anomaly: false,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "Arnulfo Munguia",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5341920", "TASK-5338695"],
    duration: "~10.0d ⚠",
    anomaly: true,
  },
  {
    door: "DOCK55",
    status: "Occupied",
    assignee: "Julio Cesar Alvarado",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5344158"],
    duration: "~2.8d",
    anomaly: false,
  },
  {
    door: "DOCK62",
    status: "Occupied",
    assignee: "Daniela Gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5345207", "TASK-5344066"],
    duration: "~3.0d",
    anomaly: false,
  },
  {
    door: "DOCK63",
    status: "Occupied",
    assignee: "Daniela Gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5343800"],
    duration: "~3.0d",
    anomaly: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // OCCUPIED — dockStatus=OCCUPIED but no active IN_PROGRESS task (11 doors)
  // (stuck / closed / ghost occupancy — flagged for dock audit)
  // ═══════════════════════════════════════════════════════════════
  { door: "DOCK56", status: "Occupied", assignee: null, customer: null, taskIds: [], duration: null, anomaly: true },
  { door: "DOCK59", status: "Occupied", assignee: null, customer: null, taskIds: [], duration: null, anomaly: true },
  { door: "DOCK61", status: "Occupied", assignee: null, customer: null, taskIds: [], duration: null, anomaly: true },
  { door: "DOCK64", status: "Occupied", assignee: null, customer: null, taskIds: [], duration: null, anomaly: true },
  { door: "DOCK65", status: "Occupied", assignee: null, customer: null, taskIds: [], duration: null, anomaly: true },
  { door: "DOCK66", status: "Occupied", assignee: null, customer: null, taskIds: [], duration: null, anomaly: true },
  { door: "DOCK67", status: "Occupied", assignee: null, customer: null, taskIds: [], duration: null, anomaly: true },
  { door: "DOCK68", status: "Occupied", assignee: null, customer: null, taskIds: [], duration: null, anomaly: true },
  { door: "DOCK69", status: "Occupied", assignee: null, customer: null, taskIds: [], duration: null, anomaly: true },
  { door: "DOCK71", status: "Occupied", assignee: null, customer: null, taskIds: [], duration: null, anomaly: true },
  { door: "DOCK72", status: "Occupied", assignee: null, customer: null, taskIds: [], duration: null, anomaly: true },

  // ═══════════════════════════════════════════════════════════════
  // AVAILABLE — no active task (3 doors)
  // ═══════════════════════════════════════════════════════════════
  { door: "DOCK51", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK70", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },

  // ═══════════════════════════════════════════════════════════════
  // AVAILABLE (dockStatus) but carrying an active task — status drift (2 doors)
  // ═══════════════════════════════════════════════════════════════
  {
    door: "DOCK57",
    status: "Available",
    assignee: "Daniel Beltran",
    customer: "NILO BRANDS",
    taskIds: ["TASK-5345057"],
    duration: "1h24m",
    anomaly: true,
  },
  {
    door: "DOCK58",
    status: "Available",
    assignee: "Arnulfo Munguia",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5341442"],
    duration: "~5.3d",
    anomaly: true,
  },
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

// Active assignee task counts — Bay 4 DOCK50-DOCK72, IN_PROGRESS dock tasks
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "Arnulfo Munguia", taskCount: 6 },
  { name: "Daniel Beltran", taskCount: 3 },
  { name: "Daniela Gonzalez", taskCount: 3 },
  { name: "daira gonzalez", taskCount: 1 },
  { name: "Eduardo Mejia", taskCount: 1 },
  { name: "Julio Cesar Alvarado", taskCount: 1 },
];

// All-time assignment counts (CLOSED/FORCE_CLOSED) for Bay 4 DOCK50–DOCK72
// (unchanged from Aug 15 snapshot — no fresh all-time rollup in this pull)
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

// Mix: 11 LOAD (outbound) + 4 RECEIVE (inbound) = 15 active tasks at Bay 4 doors
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 11, total: 15 },
  { label: "Inbound", count: 4, total: 15 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 11, total: 15 },
  { label: "Inbound", count: 4, total: 15 },
];

// Schedule: today's appointments (2026-08-17) via /wms-bam/appointment/search-by-paging
export const scheduleAvailable = true;
export const scheduledInboundOrders = 35;
export const scheduledOutboundOrders = 180;
export const scheduledInboundReceived = 4;
export const scheduledOutboundLoaded = 96;
export const pctScheduledInboundReceived = 11.4;
export const pctScheduledOutboundLoaded = 53.3;

// Today's appointment context (2026-08-17)
export const facilityWideReceiptsCreated = 35;
export const facilityWideReceiptsReceived = 4;
export const facilityWideLoadsCreated = 180;
export const facilityWideLoadsShipped = 96;

// Door occupancy duration: available from task check-in timestamps
export const doorDurationsAvailable = true;

// Active task records from fresh WISE data (Aug 17, 2026 ~16:17 PDT)
// 15 active tasks: 11 LOAD (outbound) + 4 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  // ────── OUTBOUND / LOAD — IN_PROGRESS (11) ──────
  {
    taskId: "TASK-5342396",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~4.2d)",
    assignee: "Arnulfo Munguia",
    door: "DOCK52",
  },
  {
    taskId: "TASK-5343649",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~3.1d)",
    assignee: "Arnulfo Munguia",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5341961",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~5.0d)",
    assignee: "Arnulfo Munguia",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5341920",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~5.0d)",
    assignee: "Arnulfo Munguia",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5338695",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~10.0d) ⚠",
    assignee: "Arnulfo Munguia",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5341442",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~5.3d)",
    assignee: "Arnulfo Munguia",
    door: "DOCK58",
  },
  {
    taskId: "TASK-5344717",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (6h24m)",
    assignee: "Daniel Beltran",
    door: "DOCK50",
  },
  {
    taskId: "TASK-5344883",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (5h14m)",
    assignee: "Daniel Beltran",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5345057",
    dns: "LIVE LOAD IN_PROGRESS",
    customer: "NILO BRANDS",
    pieces: "IN_PROGRESS (LIVE 1h24m)",
    assignee: "Daniel Beltran",
    door: "DOCK57",
  },
  {
    taskId: "TASK-5344130",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~3.0d)",
    assignee: "Eduardo Mejia",
    door: "DOCK52",
  },
  {
    taskId: "TASK-5344158",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~2.8d)",
    assignee: "Julio Cesar Alvarado",
    door: "DOCK55",
  },

  // ────── INBOUND / RECEIVE — IN_PROGRESS (4) ──────
  {
    taskId: "TASK-5345207",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (42m)",
    assignee: "Daniela Gonzalez",
    door: "DOCK62",
  },
  {
    taskId: "TASK-5344066",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~3.0d)",
    assignee: "Daniela Gonzalez",
    door: "DOCK62",
  },
  {
    taskId: "TASK-5343800",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~3.0d)",
    assignee: "Daniela Gonzalez",
    door: "DOCK63",
  },
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~299d) ⚠ STALE",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },
];
