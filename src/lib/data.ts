/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-20 ~10:27 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (facility-wide sweep, statuses NEW/IN_PROGRESS/EXCEPTION)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (facility-wide sweep, same statuses)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod BETWEEN window)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window)
 *     - row-level rescan of CLOSED / FORCE_CLOSED load + receive tasks across all 23 doors (all-time block)
 *
 * SNAPSHOT INSTANT: 2026-09-20 10:27 PDT (America/Los_Angeles), Sunday.
 * UTC QUERY WINDOW: 2026-09-20T17:24:37Z → 2026-09-20T17:27:26Z (snapshot instant 2026-09-20T17:27:26Z).
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * SCHEDULE-FILTER CORRECTION (this refresh, resolved authoritatively):
 *   - LOADS: the only binding appointment filter is `appointmentTimePeriod`, a BETWEEN that requires
 *     EXACTLY TWO date-time elements, e.g. ["2026-09-20T00:00:00","2026-09-20T23:59:59"]. A single
 *     element is rejected (HTTP 400 "Invalid format: Request body format error."), and a one-element
 *     array is rejected (HTTP 400 "The BETWEEN operator requires a collection with two elements").
 *     There is NO `appointmentTimeTo` field on the load search — passing it is silently ignored and the
 *     search then binds `appointmentTimeFrom` alone (which is why an "appointmentTimeFrom/To" attempt
 *     returned 337 rows spanning 2026-09-21..2026-09-24). Use `appointmentTimePeriod` for loads.
 *   - RECEIPTS: `appointmentTimeFrom` / `appointmentTimeTo` are both real and bind as an inclusive
 *     window (verified: 2026-09-01..2026-10-01 → 600; a single day → that day's population only).
 *   - Result for the 2026-09-20 local day: 0 loads and 0 receipts carry an appointment time on this
 *     day, so the two schedule percentages have a ZERO denominator and are NOT reported (see below).
 *
 * API NOTE: on the task-search family the door filter binds ONLY as the singular `dockId`; a plural
 *   `dockIds` (array) is silently IGNORED (returns the facility-wide population) and a comma-separated
 *   `dockId` string is rejected (HTTP 400). The Bay-4 population was therefore taken from a full
 *   facility-wide open sweep and filtered on each row's `dockId`. Door ids are NOT sequential:
 *   23/23 live-verified this refresh (totalCount = 23): DOCK50=570, 51=554, 52=556, 53=552, 54=564,
 *   55=560, 56=575, 57=563, 58=572, 59=571, 60=565, 61=567, 62=566, 63=568, 64=559, 65=573, 66=576,
 *   67=577, 68=574, 69=578, 70=579, 71=580, 72=587.
 *
 *   INTEGRITY: every value below is a live count returned by WISE/WMS. No rows were fabricated; nothing
 *   was carried forward where a fresh read was possible.
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant, so
 *   durations are aged startTime → 2026-09-20T17:27:26Z.
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
export const refreshStamp = "Sep 20 ~10:27 PDT";
export const refreshDateLong = "September 20, 2026";
// UTC query window for this snapshot
export const snapshotUtc = "2026-09-20T17:27:26Z";
export const windowUtc = "2026-09-20T17:24:37Z → 2026-09-20T17:27:26Z";

export const doors: DoorRecord[] = [
  // OCCUPIED — door has at least one in-progress open task (5 doors)
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez / DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5090739", "TASK-5372145"], duration: "333d 21h 6m", anomaly: true },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA / CANDY MENDEZ", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5372101", "TASK-5365421", "TASK-5338695", "TASK-5369031", "TASK-5364490"], duration: "43d 17h 57m", anomaly: true },
  { door: "DOCK57", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5371291", "TASK-5371234"], duration: "2d 14h 16m", anomaly: false },
  { door: "DOCK60", status: "Occupied", assignee: "RUFINO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5371839", "TASK-5371932"], duration: "1d 20h 17m", anomaly: false },
  { door: "DOCK62", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365814"], duration: "5d 19h 42m", anomaly: false },

  // RESERVED — door has only not-started (NEW) open tasks (2 doors)
  { door: "DOCK55", status: "Reserved", assignee: "RUFINO MUNGUIA / JEROME ARANDA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5371830", "TASK-5368665"], duration: null, anomaly: false },
  { door: "DOCK56", status: "Reserved", assignee: "ARNULFO MUNGUIA", customer: "KARAKA, LLC", taskIds: ["TASK-5369120"], duration: null, anomaly: false },

  // AVAILABLE — no open load/receive task (16 doors)
  { door: "DOCK51", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK52", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK53", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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
  { label: "Doors Occupied", value: `${occupied}`, numerator: occupied, denominator: TOTAL_DOORS, percentage: (occupied / TOTAL_DOORS) * 100 },
  { label: "Doors w/ Active Tasks", value: `${doorsWithTasks}`, numerator: doorsWithTasks, denominator: TOTAL_DOORS, percentage: (doorsWithTasks / TOTAL_DOORS) * 100 },
  { label: "Doors Available", value: `${available}`, numerator: available, denominator: TOTAL_DOORS, percentage: (available / TOTAL_DOORS) * 100 },
  { label: "Task Occupancy Rate", value: `${((doorsWithTasks / TOTAL_DOORS) * 100).toFixed(1)}%`, numerator: doorsWithTasks, denominator: TOTAL_DOORS, percentage: (doorsWithTasks / TOTAL_DOORS) * 100 },
];

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks (15 open tasks at
// the 2026-09-20 ~10:27 PDT snapshot: 4 LOAD + 11 RECEIVE on 7 doors, 7 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 6 },
  { name: "RUFINO MUNGUIA", taskCount: 3 },
  { name: "DANIELA GONZALEZ", taskCount: 2 },
  { name: "CANDY MENDEZ", taskCount: 1 },
  { name: "DANIEL BELTRAN", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// FULLY RECOMPUTED this refresh (2026-09-20 ~10:27 PDT) from a complete row-level rescan of all
// closed load/receive tasks across the 23 doors (2,816 LOAD + 993 RECEIVE = 3,809 closed
// transactions rolled up by display name, 83 distinct names).
export const allTimeClosedTotal = 3809;
export const allTimeDistinctAssignees = 83;
export const allTimeLastRecomputed = "2026-09-20 ~10:27 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 971 },
  { name: "DANIEL BELTRAN", taskCount: 965 },
  { name: "DANIELA GONZALEZ", taskCount: 399 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR ALVARADO", taskCount: 113 },
  { name: "Fatima ponce", taskCount: 108 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA → Arnulfo" all-time at Bay-4 doors — RECOMPUTED this refresh from the same full
// row-level rescan (uid 89, customerIds=[ORG-655875]): 923 LOAD + 2 RECEIVE = 925.
// Caveat: other employees also carry this display name on different ids (see Data Notes); the
// headline uses uid 89 only, which is the id present on the Bay-4 task rows for this name.
export const guruArnulfoAllTimeTotal = 925;
export const guruArnulfoAllTimeLoad = 923;
export const guruArnulfoAllTimeReceive = 2;

// Mix: 4 LOAD (outbound) + 11 RECEIVE (inbound) = 15 open tasks at Bay 4 doors (2026-09-20
// ~10:27 PDT snapshot).
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 4, total: 15 },
  { label: "Inbound", count: 11, total: 15 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 4, total: 15 },
  { label: "Inbound", count: 11, total: 15 },
];

// Schedule: facility-wide appointment adherence for the current facility-local day (2026-09-20).
// Binding filters verified this refresh: loads = appointmentTimePeriod (2-element BETWEEN),
// receipts = appointmentTimeFrom/To. Both bind correctly and BOTH return 0 for 2026-09-20 — there are
// no loads and no receipts carrying an appointment time on this day, so the two percentages have a
// zero denominator and are reported as UNAVAILABLE rather than estimated.
export const scheduleAvailable = false;
export const scheduleUnavailableReason =
  "UNAVAILABLE — 0 appointments on 2026-09-20 (zero denominator); filter binds";
export const scheduledInboundOrders = 0;
export const scheduledOutboundOrders = 0;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 0;
export const pctScheduledInboundReceived = 0; // 0 of 0 — denominator zero, not reported
export const pctScheduledOutboundLoaded = 0; // 0 of 0 — denominator zero, not reported

// Nearest scheduled operating day, provided as read-only context (NOT this dashboard day).
export const nextOperatingDay = "2026-09-21";
export const nextDayScheduledLoads = 126;
export const nextDayScheduledReceipts = 46;
export const nextDayLoadsLoaded = 1; // SHIPPED (of 126)
export const nextDayReceiptsReceived = 0; // CLOSED + TASK_COMPLETED (of 46)

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 20, 2026 ~10:27 PDT snapshot)
// 15 open tasks: 4 LOAD (outbound) + 11 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (333d 21h 6m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5372145", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 19h 24m)", assignee: "DANIEL BELTRAN", door: "DOCK50" },
  { taskId: "TASK-5372101", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 19h 58m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5365421", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (9d 0h 54m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (43d 17h 57m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5369031", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 19h 56m)", assignee: "CANDY MENDEZ", door: "DOCK54" },
  { taskId: "TASK-5364490", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (4d 18h 4m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5371830", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "RUFINO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5368665", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "JEROME ARANDA", door: "DOCK55" },
  { taskId: "TASK-5369120", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK56" },
  { taskId: "TASK-5371291", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (2d 14h 16m)", assignee: "DANIELA GONZALEZ", door: "DOCK57" },
  { taskId: "TASK-5371234", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 18h 52m)", assignee: "DANIELA GONZALEZ", door: "DOCK57" },
  { taskId: "TASK-5371839", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 20h 17m)", assignee: "RUFINO MUNGUIA", door: "DOCK60" },
  { taskId: "TASK-5371932", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "RUFINO MUNGUIA", door: "DOCK60" },
  { taskId: "TASK-5365814", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (5d 19h 42m)", assignee: "ARNULFO MUNGUIA", door: "DOCK62" },
];
