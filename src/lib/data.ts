/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-10-01 ~11:34 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (facility-wide sweep, statuses NEW/IN_PROGRESS/EXCEPTION, totalCount = 47; Bay-4 subset on dockId)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (facility-wide sweep, same statuses, totalCount = 107; Bay-4 subset on dockId)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod BETWEEN window, totalCount = 129)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window, totalCount = 21)
 *     - row-level rescan of CLOSED / FORCE_CLOSED load + receive tasks across all 23 doors (all-time block)
 *
 * SNAPSHOT INSTANT: 2026-10-01T18:34:42Z (2026-10-01 ~11:34 PDT)
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * SCHEDULE NOTE: the current facility-local day is 2026-10-01 (Thursday) — a scheduled operating day carrying
 *   129 load appointments and 21 receipt appointments in its day window. Outbound loading: 49 of 129 have finished
 *   loading (30 SHIPPED + 19 LOADED). Inbound: 0 of 21 receipts have a receivedTime set (8 are receiving, i.e.
 *   have a receivedStartTime; 11 IMPORTED, 1 OPEN, 1 EXCEPTION).
 *
 * FILTER NOTE: on the task-search family the status filter binds as the plural `statuses` (array); `statusList`
 *   is silently IGNORED. The door filter binds ONLY as the singular `dockId` (int or numeric string both bind);
 *   a plural `dockIds` (array) is silently IGNORED and a comma-separated `dockId` string is rejected (HTTP 400).
 *   NOTE: the RECEIVE-task `dockId` may also be a non-numeric location code (e.g. "LOC-9"); filter by string
 *   comparison. The open Bay-4 population was taken from a full facility-wide open sweep and filtered on each
 *   row's `dockId`; the all-time block used a per-door read on the singular `dockId`. 23/23 doors live-verified.
 *
 *   PAGING: the task-search family pages on `currentPage` (1-based) and a single page is capped at 200 rows.
 *   `pageNum` is silently IGNORED. The all-time block was read by paging `currentPage` and de-duplicating on
 *   task id; the 23-door roll-up reconciles to 2,890 LOAD + 1,039 RECEIVE = 3,929 closed Bay-4 transactions.
 *
 *   INTEGRITY: every value below is a live count returned by WISE/WMS. No rows were fabricated; nothing was
 *   carried forward where a fresh read was possible. The all-time block was fully re-scanned this refresh.
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant, so durations
 *   are aged startTime -> 2026-10-01T18:34:42Z.
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
export const refreshStamp = "Oct 01 ~11:34 PDT";
export const refreshDateLong = "October 01, 2026";
// UTC snapshot instant for this refresh
export const snapshotUtc = "2026-10-01T18:34:42Z";
export const windowUtc = "2026-10-01T18:34:42Z";

export const doors: DoorRecord[] = [
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez, ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5090739", "TASK-5381269"], duration: "344d 22h 13m", anomaly: true },
  { door: "DOCK51", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5381268"], duration: "1d 20h 8m", anomaly: false },
  { door: "DOCK52", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5382457"], duration: "19h 46m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA, DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5338695", "TASK-5380820", "TASK-5382462"], duration: "54d 19h 5m", anomaly: true },
  { door: "DOCK55", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "KARAKA, LLC", taskIds: ["TASK-5378787", "TASK-5380438"], duration: "3d 2h 43m", anomaly: false },
  { door: "DOCK56", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK57", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5383255"], duration: "0h 25m", anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK62", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK63", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5382200"], duration: "18h 11m", anomaly: false },
  { door: "DOCK64", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK65", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK66", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK67", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK68", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK69", status: "Occupied", assignee: "Jorge Antonio Franco", customer: "GURUNANDA, LLC", taskIds: ["TASK-5377286", "TASK-5381972"], duration: "6d 2h 56m", anomaly: false },
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks (13 open tasks at
// the 2026-10-01T18:34:42Z snapshot: 7 LOAD + 6 RECEIVE on 8 doors, 5 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 7 },
  { name: "DANIEL BELTRAN", taskCount: 2 },
  { name: "Jorge Antonio Franco", taskCount: 2 },
  { name: "DANIELA GONZALEZ", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// FULLY RECOMPUTED this refresh from a per-door closed rescan on the binding singular `dockId` filter
// (3,929 closed transactions rolled up by display name, 83 distinct names).
export const allTimeClosedTotal = 3929;
export const allTimeDistinctAssignees = 83;
export const allTimeLastRecomputed = "Oct 01 ~11:34 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "DANIEL BELTRAN", taskCount: 1007 },
  { name: "ARNULFO MUNGUIA", taskCount: 999 },
  { name: "DANIELA GONZALEZ", taskCount: 418 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 151 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "Fatima Ponce", taskCount: 120 },
  { name: "JULIO CESAR Alvarado", taskCount: 113 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA -> Arnulfo" all-time at Bay-4 doors — RECOMPUTED this refresh from the same per-door closed
// rescan (uid 89, customerId = ORG-655875): 948 LOAD + 2 RECEIVE = 950.
// Caveat: other employees also carry this display name on different ids; the headline uses uid 89 only,
// which is the id present on the Bay-4 task rows for this name.
export const guruArnulfoAllTimeTotal = 950;
export const guruArnulfoAllTimeLoad = 948;
export const guruArnulfoAllTimeReceive = 2;

// Mix: 7 LOAD (outbound) + 6 RECEIVE (inbound) = 13 open tasks at Bay 4 doors.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 7, total: 13 },
  { label: "Inbound", count: 6, total: 13 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 7, total: 13 },
  { label: "Inbound", count: 6, total: 13 },
];

// Schedule: facility-wide appointment adherence for the current facility-local day (2026-10-01, Thursday).
// Binding filters verified: loads = appointmentTimePeriod (2-element BETWEEN), receipts =
// appointmentTimeFrom/To. The 2026-10-01 window returns 129 loads and 21 receipts.
// Outbound = loads whose loading has finished (status SHIPPED or LOADED). Inbound = receipts with receivedTime.
export const scheduleAvailable = true;
export const scheduleUnavailableReason =
  "Reported from live 2026-10-01 appointment windows (129 loads / 21 receipts).";
export const scheduledInboundOrders = 21;
export const scheduledOutboundOrders = 129;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 49;
export const pctScheduledInboundReceived = (0 / 21) * 100; // 0.0% — 0 of 21 receipts received (8 in progress)
export const pctScheduledOutboundLoaded = (49 / 129) * 100; // 38.0% — 49 of 129 loads finished loading

// Live status composition of the 2026-10-01 scheduled day (for the Data Notes audit trail).
export const scheduleLoadStatus: Record<string, number> = { SHIPPED: 30, LOADED: 19, LOADING: 26, WINDOW_CHECKIN_DONE: 5, NEW: 49 };
export const scheduleReceiptStatus: Record<string, number> = { IMPORTED: 11, IN_PROGRESS: 8, OPEN: 1, EXCEPTION: 1 };

// Facility-wide open population swept to isolate the Bay-4 subset (fresh this refresh).
export const facilityOpenLoad = 47;
export const facilityOpenReceive = 107;
export const bay4DockIdMap: Record<string, string> = { "DOCK50": "570", "DOCK51": "554", "DOCK52": "556", "DOCK53": "552", "DOCK54": "564", "DOCK55": "560", "DOCK56": "575", "DOCK57": "563", "DOCK58": "572", "DOCK59": "571", "DOCK60": "565", "DOCK61": "567", "DOCK62": "566", "DOCK63": "568", "DOCK64": "559", "DOCK65": "573", "DOCK66": "576", "DOCK67": "577", "DOCK68": "574", "DOCK69": "578", "DOCK70": "579", "DOCK71": "580", "DOCK72": "587" };

// Customer mix of the open Bay-4 population this snapshot.
export const openCustomerMix: AssigneeSummary[] = [
  { name: "GURUNANDA, LLC", taskCount: 11 },
  { name: "KARAKA, LLC", taskCount: 2 },
];
export const openStatusCounts: AssigneeSummary[] = [
  { name: "IN_PROGRESS", taskCount: 12 },
  { name: "NEW", taskCount: 1 },
];

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (2026-10-01T18:34:42Z snapshot)
// 13 open tasks: 7 LOAD (outbound) + 6 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (344d 22h 13m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5381269", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 20h 5m)", assignee: "ARNULFO MUNGUIA", door: "DOCK50" },
  { taskId: "TASK-5381268", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 20h 8m)", assignee: "ARNULFO MUNGUIA", door: "DOCK51" },
  { taskId: "TASK-5382457", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (19h 46m)", assignee: "DANIEL BELTRAN", door: "DOCK53" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (54d 19h 5m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5380820", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 23h 26m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5382462", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (2h 11m)", assignee: "DANIEL BELTRAN", door: "DOCK54" },
  { taskId: "TASK-5378787", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (3d 2h 43m)", assignee: "ARNULFO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5380438", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (1d 21h 51m)", assignee: "ARNULFO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5383255", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0h 25m)", assignee: "ARNULFO MUNGUIA", door: "DOCK59" },
  { taskId: "TASK-5382200", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (18h 11m)", assignee: "DANIELA GONZALEZ", door: "DOCK63" },
  { taskId: "TASK-5377286", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (6d 2h 56m)", assignee: "Jorge Antonio Franco", door: "DOCK69" },
  { taskId: "TASK-5381972", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "Jorge Antonio Franco", door: "DOCK69" },
];

// ── Assigned Activity — Bay 4 (GURUNANDA / Live Out & In → Arnulfo) section ──
// Arnulfo Munguia (assigneeUserId 89) open tasks at Bay-4 doors this snapshot.
export const arnulfoOpenTasks: { door: string; taskId: string; kind: string; status: string; customer: string; note: string }[] = [
  { door: "DOCK50", taskId: "TASK-5381269", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 1d 20h 5m" },
  { door: "DOCK51", taskId: "TASK-5381268", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 1d 20h 8m" },
  { door: "DOCK54", taskId: "TASK-5338695", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "STALE — 54d 19h 5m (endTime set 2026-08-10)" },
  { door: "DOCK54", taskId: "TASK-5380820", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 1d 23h 26m" },
  { door: "DOCK55", taskId: "TASK-5378787", kind: "RECEIVE", status: "IN_PROGRESS", customer: "KARAKA, LLC", note: "IN_PROGRESS — 3d 2h 43m" },
  { door: "DOCK55", taskId: "TASK-5380438", kind: "RECEIVE", status: "IN_PROGRESS", customer: "KARAKA, LLC", note: "IN_PROGRESS — 1d 21h 51m" },
  { door: "DOCK59", taskId: "TASK-5383255", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 0h 25m" },
];

export const arnulfoOpenCount = 7;
export const arnulfoOpenLoad = 5;
export const arnulfoOpenReceive = 2;
export const arnulfoOpenGuru = 5;
export const arnulfoOpenKaraka = 2;
export const arnulfoOpenGuruLoad = 5;
export const arnulfoOpenGuruReceive = 0;
