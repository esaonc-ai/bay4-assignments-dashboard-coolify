/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-11 ~07:45 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (DOCK50..DOCK72 ids)
 *     - /wms-bam/outbound/load-task/search-by-paging — open + closed load tasks
 *     - /wms-bam/inbound/receive-task/search-by-paging — open + closed receive tasks
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled appointments (today)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (today)
 *
 * SNAPSHOT INSTANT: 2026-09-11 07:45:00 PDT (America/Los_Angeles; queried live 07:45 PDT;
 * durations aged to the 07:45:00 PDT instant).
 *
 * DELTA vs 2026-09-09 ~18:15 PDT snapshot: Bay-4 open task set 13 → 6 (2 LOAD + 4 RECEIVE).
 * Door map: Occupied 10 / Reserved 0 / Available 13 → Occupied 5 / Reserved 0 / Available 18.
 * Freed doors: DOCK52, DOCK58, DOCK60, DOCK64, DOCK68, DOCK69. Remaining occupied: DOCK50,
 * DOCK53, DOCK54, DOCK57, DOCK63. Recovered/active loads: TASK-5338695 (DOCK54, 33d stale)
 * and TASK-5090739 (DOCK50, ~324d stale) both remain open — unchanged anomalies. TASK-5363171
 * (DOCK50) and TASK-5363798 / TASK-5363420 (DOCK54) have since CLOSED; TASK-5090739 receipt
 * (RN-5002143) is CLOSED.
 *
 *   ⚠ API NOTE (this refresh): the WMS BAM search-by-paging endpoints repeat page-1 rows for
 *   pageNum > 1 (e.g. a DOCK54 CLOSED load query with pageSize 200 returned 400 rows but only
 *   200 distinct). All pulls therefore used a SINGLE large page (pageSize ≥ population) and
 *   were de-duplicated by task id. No rows were fabricated; every value below is a live count.
 *
 *   ⚠ SCHEDULE NOTE: today's (Fri 2026-09-11) facility-wide schedule is still early-morning at
 *   the 07:45 PDT snapshot — 33 scheduled inbound receipts (0 CLOSED-received yet) and 117
 *   scheduled outbound loads (0 LOADED/SHIPPED yet). Receipt window uses appointmentTime
 *   From/To = 2026-09-11T00:00:00 → 23:59:59; the loads set honours only appointmentTimeFrom,
 *   so today's load denominator was taken as the 2026-09-11 vs 2026-09-12 from-population
 *   difference (345 − 228 = 117) and confirmed by a client-side appointment-date filter.
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
export const refreshStamp = "Sep 11 ~07:45 PDT";
export const refreshDateLong = "September 11, 2026";

export const doors: DoorRecord[] = [
  // ══════════════════════════════════════════════════════════════════════════════════════
  // OCCUPIED — door has an open LOAD/RECEIVE task (5 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK50",
    status: "Occupied",
    assignee: "daira gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5090739"],
    duration: "~324d",
    anomaly: true,
  },
  {
    door: "DOCK53",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5364572"],
    duration: "13h 17m",
    anomaly: false,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC / KARAKA, LLC",
    taskIds: ["TASK-5338695", "TASK-5364490"],
    duration: "34d 8h",
    anomaly: true,
  },
  {
    door: "DOCK57",
    status: "Occupied",
    assignee: "Fatima Ponce",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5364028"],
    duration: "1d 8h 25m",
    anomaly: false,
  },
  {
    door: "DOCK63",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5365145"],
    duration: "2h 24m",
    anomaly: false,
  },

  // ══════════════════════════════════════════════════════════════════════════════════════
  // RESERVED — NEW (assigned, not started) task with no in-progress task (0 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════

  // ══════════════════════════════════════════════════════════════════════════════════════
  // AVAILABLE — no open load/receive task (18 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK51",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK52",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
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
    door: "DOCK62",
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
    door: "DOCK66",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK67",
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
  {
    door: "DOCK72",
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

// Open assignee task counts - Bay 4 DOCK50-DOCK72, open load/receive dock tasks (6 open tasks at
// the 2026-09-11 07:45 PDT snapshot: 2 LOAD + 4 RECEIVE on 5 occupied doors; no reserved doors)

export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 3 },
  { name: "DANIELA GONZALEZ", taskCount: 1 },
  { name: "Fatima Ponce", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED/FORCE_CLOSED) for Bay 4 DOCK50–DOCK72
// FRESH rollup 2026-09-11 ~07:45 PDT — rescanned CLOSED load + CLOSED/FORCE_CLOSED receive tasks
// at all 23 Bay-4 door IDs with single-page fetches (0 dropped rows, 0 duplicates after
// de-dup): 3,695 closed tasks total (2,757 LOAD CLOSED + 696 RECEIVE CLOSED + 242 RECEIVE
// FORCE_CLOSED; no LOAD FORCE_CLOSED), 81 distinct assignees.
// +20 vs the 09-09 18:15 PDT rollup (3,675).
export const allTimeClosedTotal = 3695;
export const allTimeDistinctAssignees = 81;
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 954 },
  { name: "DANIEL BELTRAN", taskCount: 935 },
  { name: "DANIELA GONZALEZ", taskCount: 377 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR ALVARADO", taskCount: 113 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "Fatima Ponce", taskCount: 92 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// Mix: 2 LOAD (outbound) + 4 RECEIVE (inbound) = 6 open tasks at Bay 4 doors (2026-09-11 07:45
// PDT snapshot). Prior 09-09 18:15 PDT snapshot was 5 LOAD + 8 RECEIVE = 13.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 2, total: 6 },
  { label: "Inbound", count: 4, total: 6 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 2, total: 6 },
  { label: "Inbound", count: 4, total: 6 },
];

// Schedule: today's (2026-09-11, Friday) facility-wide — receipts/loads whose appointment time
// is today (facility-local day, America/Los_Angeles). Completed = receipt status CLOSED
// (received) / load status LOADED+SHIPPED (loaded). Facility-wide scope (appointments do not
// carry a clean dockId for Bay 4 scoping). Queried live ~07:45 PDT.
// Friday Sep 11 (early morning snapshot): 33 scheduled inbound receipts → 0 received
// (CLOSED; 30 IMPORTED + 3 OPEN remain) = 0.0%. 117 scheduled outbound loads → 0 LOADED/SHIPPED
// (111 NEW + 4 WINDOW_CHECKIN_DONE + 2 LOADING remain) = 0.0%. Load denominator note: the load
// search honours only appointmentTimeFrom (date boundary) — today's set was taken as the
// difference between the 2026-09-11 and 2026-09-12 from-populations (345 − 228 = 117) and
// confirmed by a client-side appointment-date filter over the returned set.
export const scheduleAvailable = true;
export const scheduledInboundOrders = 33;
export const scheduledOutboundOrders = 117;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 0;
export const pctScheduledInboundReceived = 0.0; // 0 of 33 scheduled inbounds received (by 07:45 PDT)
export const pctScheduledOutboundLoaded = 0.0; // 0 of 117 scheduled outbound loads loaded (by 07:45 PDT)

// Door occupancy duration: available from task start timestamps
export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 11, 2026 ~07:45 PDT snapshot)
// 6 open tasks: 2 LOAD (outbound) + 4 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  // ────── DOCK50 — stale ~324d RECEIVE (receipt already closed) ──────
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~324d) ⚠ STALE — RN-5002143 CLOSED",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },

  // ────── DOCK53 — live load ──────
  {
    taskId: "TASK-5364572",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (13h 17m) — LOAD-5038408 LOADED",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK53",
  },

  // ────── DOCK54 — stale 34d LOAD + NEW receive (KARAKA) co-located ──────
  {
    taskId: "TASK-5338695",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (34d 8h) ⚠ STALE — LOAD-5035487 SHIPPED",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5364490",
    dns: "RECEIVE NEW",
    customer: "KARAKA, LLC",
    pieces: "NEW — RN-191995 IMPORTED",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },

  // ────── DOCK57 ──────
  {
    taskId: "TASK-5364028",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (1d 8h 25m) — RN-5010136 IN_PROGRESS",
    assignee: "Fatima Ponce",
    door: "DOCK57",
  },

  // ────── DOCK63 ──────
  {
    taskId: "TASK-5365145",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (2h 24m) — RN-5010131 IN_PROGRESS",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK63",
  },
];
