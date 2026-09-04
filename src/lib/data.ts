/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-04 ~09:38 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations + dock/space status
 *     - /wms-bam/outbound/load-task/search-by-paging — open + closed load tasks
 *     - /wms-bam/inbound/receive-task/search-by-paging — open + closed receive tasks
 *     - /wms-bam/appointment/search-by-paging + /wms-bam/inbound/receipt/search-by-paging
 *       + /wms-bam/outbound/load/search-by-paging — scheduled appointments (today, facility-wide)
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
export const refreshStamp = "Sep 04 09:38 PDT";
export const refreshDateLong = "September 4, 2026";

export const doors: DoorRecord[] = [
  // ══════════════════════════════════════════════════════════════════════════════════════
  // OCCUPIED — door has an active IN_PROGRESS load/receive task (10 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK50",
    status: "Occupied",
    assignee: "daira gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5090739", "TASK-5360206"],
    duration: "~318d",
    anomaly: true,
  },
  {
    door: "DOCK51",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5359541"],
    duration: "23h 9m",
    anomaly: false,
  },
  {
    door: "DOCK52",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360107"],
    duration: "18h 13m",
    anomaly: false,
  },
  {
    door: "DOCK53",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5359905"],
    duration: "19h 13m",
    anomaly: false,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5338695"],
    duration: "27d 17h",
    anomaly: true,
  },
  {
    door: "DOCK56",
    status: "Occupied",
    assignee: "DANIEL BELTRAN",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360634"],
    duration: "0h 3m",
    anomaly: false,
  },
  {
    door: "DOCK57",
    status: "Occupied",
    assignee: "SEBASTIAN GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360600"],
    duration: "0h 15m",
    anomaly: false,
  },
  {
    door: "DOCK58",
    status: "Occupied",
    assignee: "DANIEL BELTRAN",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360629"],
    duration: "0h 16m",
    anomaly: false,
  },
  {
    door: "DOCK66",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360266"],
    duration: "12h 59m",
    anomaly: false,
  },
  {
    door: "DOCK72",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360230"],
    duration: "11h 52m",
    anomaly: false,
  },

  // ══════════════════════════════════════════════════════════════════════════════════════
  // RESERVED — NEW (assigned, not started) load/receive task (1 door)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK67",
    status: "Reserved",
    assignee: "JEROME ARANDA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5359531"],
    duration: null,
    anomaly: false,
  },

  // ══════════════════════════════════════════════════════════════════════════════════════
  // AVAILABLE — no open load/receive task (12 doors)
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
    door: "DOCK62",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK63",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK64",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK65",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK68",
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks (12 open tasks)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 5 },
  { name: "DANIEL BELTRAN", taskCount: 2 },
  { name: "DANIELA GONZALEZ", taskCount: 2 },
  { name: "SEBASTIAN GONZALEZ", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED/FORCE_CLOSED) for Bay 4 DOCK50–DOCK72
// FRESH rollup 2026-09-04 09:38 PDT — scanned CLOSED/FORCE_CLOSED load + receive tasks
// across all 23 Bay-4 door IDs (3,612 closed tasks total: 2,701 LOAD + 911 RECEIVE, 80 assignees)
export const allTimeClosedTotal = 3612;
export const allTimeDistinctAssignees = 80;
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 941 },
  { name: "DANIEL BELTRAN", taskCount: 906 },
  { name: "DANIELA GONZALEZ", taskCount: 362 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR Alvarado", taskCount: 111 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "Fatima Ponce", taskCount: 85 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// Mix: 9 LOAD (outbound) + 3 RECEIVE (inbound) = 12 open tasks at Bay 4 doors
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 9, total: 12 },
  { label: "Inbound", count: 3, total: 12 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 9, total: 12 },
  { label: "Inbound", count: 3, total: 12 },
];

// Schedule: today’s (2026-09-04) facility-wide — receipts/loads whose appointment time is today.
// Source: /wms-bam/inbound/receipt/search-by-paging (appointmentTimeFrom/To) and
// /wms-bam/outbound/load/search-by-paging (appointmentTimePeriod). Completed = receipt status
// CLOSED (received) / load status LOADED+SHIPPED (loaded). Facility-wide scope (appointments do
// not carry a clean dockId for Bay 4 scoping). Prior snapshot (Sep 3 18:42 PDT): 9/39 (23.1%), 90/98 (91.8%).
export const scheduleAvailable = true;
export const scheduledInboundOrders = 32;
export const scheduledOutboundOrders = 109;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 9;
export const pctScheduledInboundReceived = (0 / 32) * 100; // 0.0% — 0 of 32 scheduled inbounds received (as of 09:38 PDT)
export const pctScheduledOutboundLoaded = (9 / 109) * 100; // 8.3% — 9 of 109 scheduled outbounds loaded

// Today’s facility-wide context (2026-09-04, ~09:38 PDT)
// receipts created today: 13 (12 IMPORTED + 1 OPEN); receipts CLOSED with receivedTime today: 8
// loads with appointment today: 109 (9 LOADED/SHIPPED: 8 SHIPPED + 1 LOADED)
export const facilityWideReceiptsCreated = 13;
export const facilityWideReceiptsReceived = 8;
export const facilityWideLoadsCreated = 109;
export const facilityWideLoadsShipped = 9;

// Door occupancy duration: available from task start timestamps
export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 04, 2026 ~09:38 PDT)
// 12 open tasks: 9 LOAD (outbound) + 3 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  // ────── DOCK50 — inbound severe anomaly + active outbound co-located ──────
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~318d) ⚠ STALE",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },
  {
    taskId: "TASK-5360206",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (17h 39m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK50",
  },

  // ────── OUTBOUND / LOAD ──────
  {
    taskId: "TASK-5359541",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (23h 9m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK51",
  },
  {
    taskId: "TASK-5360107",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (18h 13m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK52",
  },
  {
    taskId: "TASK-5359905",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (19h 13m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5338695",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (27d 17h) ⚠ STALE",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5360634",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (0h 3m)",
    assignee: "DANIEL BELTRAN",
    door: "DOCK56",
  },
  {
    taskId: "TASK-5360600",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (0h 15m)",
    assignee: "SEBASTIAN GONZALEZ",
    door: "DOCK57",
  },
  {
    taskId: "TASK-5360629",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (0h 16m)",
    assignee: "DANIEL BELTRAN",
    door: "DOCK58",
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
    taskId: "TASK-5360266",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (12h 59m)",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK66",
  },
  {
    taskId: "TASK-5360230",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (11h 52m)",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK72",
  },
];
