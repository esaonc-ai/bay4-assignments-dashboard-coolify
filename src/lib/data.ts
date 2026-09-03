/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-03 ~16:42 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search — door locations + dock/space status
 *     - /wms-bam/outbound/load-task/search-by-paging — open + closed load tasks
 *     - /wms-bam/inbound/receive-task/search-by-paging — open + closed receive tasks
 *     - /wms-bam/appointment/search-by-paging — scheduled appointments (today, facility-wide)
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

// Refresh stamp (America/Los_Angeles)
export const refreshStamp = "Sep 03 16:42 PDT";
export const refreshDateLong = "September 3, 2026";

export const doors: DoorRecord[] = [
  // ══════════════════════════════════════════════════════════════════════════════════════
  // OCCUPIED — door has an active IN_PROGRESS load/receive task (8 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK50",
    status: "Occupied",
    assignee: "daira gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5090739", "TASK-5360206"],
    duration: "~317d",
    anomaly: true,
  },
  {
    door: "DOCK51",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5359541"],
    duration: "6h 13m",
    anomaly: false,
  },
  {
    door: "DOCK52",
    status: "Occupied",
    assignee: "DANIEL BELTRAN",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360107"],
    duration: "1h 17m",
    anomaly: false,
  },
  {
    door: "DOCK53",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5359905"],
    duration: "2h 17m",
    anomaly: false,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5338695"],
    duration: "27d 0h",
    anomaly: true,
  },
  {
    door: "DOCK62",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360141"],
    duration: "1h 6m",
    anomaly: false,
  },
  {
    door: "DOCK64",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360159"],
    duration: "1h 1m",
    anomaly: false,
  },
  {
    door: "DOCK65",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360194"],
    duration: "0h 54m",
    anomaly: false,
  },

  // ══════════════════════════════════════════════════════════════════════════════════════
  // RESERVED — NEW (assigned, not started) load/receive task (4 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK63",
    status: "Reserved",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360232"],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK67",
    status: "Reserved",
    assignee: "JEROME ARANDA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5359531"],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK68",
    status: "Reserved",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360233"],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK72",
    status: "Reserved",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360230"],
    duration: null,
    anomaly: false,
  },

  // ══════════════════════════════════════════════════════════════════════════════════════
  // AVAILABLE — no open load/receive task (11 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK55",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK56",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK57",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK58",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK59",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK60",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK61",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK66",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK69",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK70",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK71",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks (13 open tasks)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "DANIELA GONZALEZ", taskCount: 6 },
  { name: "ARNULFO MUNGUIA", taskCount: 4 },
  { name: "DANIEL BELTRAN", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED/FORCE_CLOSED) for Bay 4 DOCK50–DOCK72
// FRESH rollup 2026-09-03 16:42 PDT — scanned CLOSED/FORCE_CLOSED load + receive tasks
// across all 23 Bay-4 door IDs (3,608 closed tasks total, 80 assignees)
export const allTimeClosedTotal = 3608;
export const allTimeDistinctAssignees = 80;
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 941 },
  { name: "DANIEL BELTRAN", taskCount: 906 },
  { name: "DANIELA GONZALEZ", taskCount: 358 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR Alvarado", taskCount: 111 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "Fatima Ponce", taskCount: 85 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// Mix: 6 LOAD (outbound) + 7 RECEIVE (inbound) = 13 open tasks at Bay 4 doors
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 13 },
  { label: "Inbound", count: 7, total: 13 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 13 },
  { label: "Inbound", count: 7, total: 13 },
];

// Schedule: today’s appointments (2026-09-03) via /wms-bam/appointment/search-by-paging
// (facility-wide scope — appointments do not carry a clean dockId for Bay 4 scoping)
export const scheduleAvailable = true;
export const scheduledInboundOrders = 38;
export const scheduledOutboundOrders = 100;
export const scheduledInboundReceived = 8;
export const scheduledOutboundLoaded = 87;
export const pctScheduledInboundReceived = (8 / 38) * 100; // 21.1% — 8 of 38 scheduled inbounds received
export const pctScheduledOutboundLoaded = (87 / 100) * 100; // 87.0% — 87 of 100 scheduled outbounds loaded

// Today’s appointment context (2026-09-03, facility-wide)
export const facilityWideReceiptsCreated = 38;
export const facilityWideReceiptsReceived = 8;
export const facilityWideLoadsCreated = 100;
export const facilityWideLoadsShipped = 87;

// Door occupancy duration: available from task start timestamps
export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 03, 2026 ~16:42 PDT)
// 13 open tasks: 6 LOAD (outbound) + 7 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  // ────── DOCK50 — inbound severe anomaly + new outbound co-located ──────
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~317d) ⚠ STALE",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },
  {
    taskId: "TASK-5360206",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (0h 43m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK50",
  },

  // ────── OUTBOUND / LOAD ──────
  {
    taskId: "TASK-5359541",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (6h 13m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK51",
  },
  {
    taskId: "TASK-5360107",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (1h 17m)",
    assignee: "DANIEL BELTRAN",
    door: "DOCK52",
  },
  {
    taskId: "TASK-5359905",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (2h 17m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5338695",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (27d 0h) ⚠ STALE",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5359531",
    dns: "LOAD NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW",
    assignee: "JEROME ARANDA",
    door: "DOCK67",
  },

  // ────── INBOUND / RECEIVE ──────
  {
    taskId: "TASK-5360141",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (1h 6m)",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK62",
  },
  {
    taskId: "TASK-5360232",
    dns: "RECEIVE NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK63",
  },
  {
    taskId: "TASK-5360159",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (1h 1m)",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK64",
  },
  {
    taskId: "TASK-5360194",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (0h 54m)",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK65",
  },
  {
    taskId: "TASK-5360233",
    dns: "RECEIVE NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK68",
  },
  {
    taskId: "TASK-5360230",
    dns: "RECEIVE NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK72",
  },
];
