/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-11 ~09:55 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (DOCK50..DOCK72 ids)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled appointments (today)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (today)
 *
 * SNAPSHOT INSTANT: 2026-09-11 09:55:00 PDT (America/Los_Angeles; queried live 09:53–09:57 PDT).
 * API timestamps are UTC; elapsed durations aged UTC → snapshot instant.
 *
 * DELTA vs 2026-09-11 ~07:45 PDT snapshot: Bay-4 open task set 6 → 7 (3 LOAD + 4 RECEIVE).
 * Door map: Occupied 5 / Reserved 0 / Available 18 → Occupied 4 / Reserved 1 / Available 18.
 * DOCK53 freed (its load closed); DOCK52 newly engaged by a NEW load task (assigned, not started
 * → Reserved); DOCK54 gained a live PRE_LOAD task (TASK-5365421, BARTOLO RAMIREZ).
 *
 *   API NOTE: the WMS BAM search-by-paging endpoints repeat page-1 rows for pageNum > 1; every
 *   pull used a single large page and was de-duplicated by task id. The `status` filter accepts a
 *   single TaskStatus value. No rows were fabricated; every value below is a live count.
 *
 *   SCHEDULE NOTE: today's (Fri 2026-09-11) facility-wide schedule at the 09:55 PDT snapshot —
 *   35 scheduled inbound receipts (0 CLOSED-received yet) and 119 scheduled outbound loads
 *   (10 LOADED/SHIPPED). Receipt window uses appointmentTime From/To = 2026-09-11T00:00:00 →
 *   23:59:59. The loads set honours only appointmentTimeFrom, so today's load denominator was taken
 *   as the 2026-09-11 vs 2026-09-12 from-population difference (372 − 253 = 119) and today's
 *   loaded count likewise (LOADED 1−0 + SHIPPED 11−2 = 10).
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
export const refreshStamp = "Sep 11 ~09:55 PDT";
export const refreshDateLong = "September 11, 2026";

export const doors: DoorRecord[] = [
  // OCCUPIED — door has an in-progress open task (4 doors)
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez", customer: "GURUNANDA, LLC", taskIds: ["TASK-5090739"], duration: "~325d", anomaly: true },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA / BARTOLO RAMIREZ", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5338695", "TASK-5365421", "TASK-5364490"], duration: "34d 17h", anomaly: true },
  { door: "DOCK57", status: "Occupied", assignee: "Fatima Ponce", customer: "GURUNANDA, LLC", taskIds: ["TASK-5364028"], duration: "1d 17h 35m", anomaly: false },
  { door: "DOCK63", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365145"], duration: "11h 33m", anomaly: false },

  // RESERVED — only a NEW (assigned, not started) task (1 door)
  { door: "DOCK52", status: "Reserved", assignee: "JEROME ARANDA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365448"], duration: null, anomaly: false },

  // AVAILABLE — no open load/receive task (18 doors)
  { door: "DOCK51", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK53", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK55", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK56", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK62", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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
  { label: "Doors Occupied", value: `${occupied}`, numerator: occupied, denominator: TOTAL_DOORS, percentage: (occupied / TOTAL_DOORS) * 100 },
  { label: "Doors w/ Active Tasks", value: `${doorsWithTasks}`, numerator: doorsWithTasks, denominator: TOTAL_DOORS, percentage: (doorsWithTasks / TOTAL_DOORS) * 100 },
  { label: "Doors Available", value: `${available}`, numerator: available, denominator: TOTAL_DOORS, percentage: (available / TOTAL_DOORS) * 100 },
  { label: "Task Occupancy Rate", value: `${((doorsWithTasks / TOTAL_DOORS) * 100).toFixed(1)}%`, numerator: doorsWithTasks, denominator: TOTAL_DOORS, percentage: (doorsWithTasks / TOTAL_DOORS) * 100 },
];

// Open assignee task counts - Bay 4 DOCK50-DOCK72, open load/receive dock tasks (7 open tasks at
// the 2026-09-11 09:55 PDT snapshot: 3 LOAD + 4 RECEIVE on 5 doors)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 2 },
  { name: "BARTOLO RAMIREZ", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
  { name: "DANIELA GONZALEZ", taskCount: 1 },
  { name: "Fatima Ponce", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED/FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// CARRIED FORWARD from the 2026-09-11 ~07:45 PDT rollup (not recomputed in this refresh).
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

// Mix: 3 LOAD (outbound) + 4 RECEIVE (inbound) = 7 open tasks at Bay 4 doors (2026-09-11 09:55
// PDT snapshot). Prior 09-11 07:45 PDT snapshot was 2 LOAD + 4 RECEIVE = 6.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 3, total: 7 },
  { label: "Inbound", count: 4, total: 7 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 3, total: 7 },
  { label: "Inbound", count: 4, total: 7 },
];

// Schedule: today's (2026-09-11, Friday) facility-wide — receipts/loads whose appointment time is
// today (facility-local day, America/Los_Angeles). Completed = receipt status CLOSED (received) /
// load status LOADED+SHIPPED (loaded). Queried live ~09:55 PDT.
export const scheduleAvailable = true;
export const scheduledInboundOrders = 35;
export const scheduledOutboundOrders = 119;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 10;
export const pctScheduledInboundReceived = 0.0; // 0 of 35 scheduled inbounds received (by 09:55 PDT)
export const pctScheduledOutboundLoaded = 8.4; // 10 of 119 scheduled outbound loads loaded (by 09:55 PDT)

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 11, 2026 ~09:55 PDT snapshot)
// 7 open tasks: 3 LOAD (outbound) + 4 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5365448", dns: "LOAD NEW", customer: "GURUNANDA, LLC", pieces: "NEW — LOAD-5038339 WINDOW_CHECKIN_DONE (appt 16:00Z)", assignee: "JEROME ARANDA", door: "DOCK52" },
  { taskId: "TASK-5365421", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (~22m) — PRE_LOAD, LOAD-5038393/94/95/96/98 LOADING", assignee: "BARTOLO RAMIREZ", door: "DOCK54" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (34d 17h) ⚠ STALE — LOAD-5035487 SHIPPED", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (~325d) ⚠ STALE — RN-5002143 CLOSED", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5364490", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — RN-191995 IMPORTED", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5364028", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 17h 35m) — RN-5010136 IN_PROGRESS", assignee: "Fatima Ponce", door: "DOCK57" },
  { taskId: "TASK-5365145", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (11h 33m) — RN-5010131 IN_PROGRESS", assignee: "DANIELA GONZALEZ", door: "DOCK63" },
];
