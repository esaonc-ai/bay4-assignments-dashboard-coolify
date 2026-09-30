/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-30 ~13:45 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (facility-wide sweep, statuses NEW/IN_PROGRESS/EXCEPTION, totalCount = 51)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (facility-wide sweep, same statuses, totalCount = 119)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod BETWEEN window, totalCount = 121)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window, totalCount = 44)
 *     - row-level rescan of CLOSED / FORCE_CLOSED load + receive tasks across all 23 doors (all-time block)
 *
 * SNAPSHOT INSTANT: 2026-09-30T20:45:54Z (2026-09-30 ~13:45 PDT)
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * SCHEDULE NOTE: the current facility-local day is 2026-09-30 (Wednesday) — a scheduled operating day carrying
 *   121 load appointments and 44 receipt appointments in its day window. Outbound: 63 of 121 loads have finished
 *   loading (53 SHIPPED + 10 LOADED), 44 remain NEW. Inbound: 2 of 44 receipts have a receivedTime set
 *   (2 CLOSED); 15 are IN_PROGRESS and 27 are still IMPORTED.
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
 *   task id; the 23-door roll-up reconciles to 2,883 LOAD + 1,035 RECEIVE = 3,918 closed Bay-4 transactions.
 *
 *   INTEGRITY: every value below is a live count returned by WISE/WMS. No rows were fabricated; nothing was
 *   carried forward where a fresh read was possible. The all-time block was fully re-scanned this refresh.
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant, so durations
 *   are aged startTime -> 2026-09-30T20:45:54Z.
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
export const refreshStamp = "Sep 30 ~13:45 PDT";
export const refreshDateLong = "September 30, 2026";
// UTC snapshot instant for this refresh
export const snapshotUtc = "2026-09-30T20:45:54Z";
export const windowUtc = "2026-09-30T20:45:54Z";

export const doors: DoorRecord[] = [
  { door: "DOCK50", status: "Occupied", assignee: "DANIEL BELTRAN, daira gonzalez", customer: "GURUNANDA, LLC", taskIds: ["TASK-5381269", "TASK-5090739"], duration: "344d 7h 24m", anomaly: true },
  { door: "DOCK51", status: "Occupied", assignee: "DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5381268"], duration: "1d 5h 19m", anomaly: false },
  { door: "DOCK52", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5381106"], duration: "1d 6h 28m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5379622"], duration: "2d 4h 46m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5338695", "TASK-5380820"], duration: "54d 4h 16m", anomaly: true },
  { door: "DOCK55", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "KARAKA, LLC", taskIds: ["TASK-5378787", "TASK-5380438"], duration: "2d 11h 54m", anomaly: false },
  { door: "DOCK56", status: "Occupied", assignee: "Fatima Ponce", customer: "GURUNANDA, LLC", taskIds: ["TASK-5377454"], duration: "10h 14m", anomaly: false },
  { door: "DOCK57", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Occupied", assignee: "DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5382277"], duration: "7h 2m", anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK62", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK63", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK64", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK65", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK66", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK67", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK68", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK69", status: "Occupied", assignee: "Jorge Antonio Franco", customer: "GURUNANDA, LLC", taskIds: ["TASK-5377286", "TASK-5381972"], duration: "5d 12h 7m", anomaly: false },
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
// the 2026-09-30T20:45:54Z snapshot: 7 LOAD + 6 RECEIVE on 9 doors, 5 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 6 },
  { name: "DANIEL BELTRAN", taskCount: 3 },
  { name: "Jorge Antonio Franco", taskCount: 2 },
  { name: "daira gonzalez", taskCount: 1 },
  { name: "Fatima Ponce", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// FULLY RECOMPUTED this refresh from a per-door closed rescan on the binding singular `dockId` filter
// (3,918 closed transactions rolled up by display name, 83 distinct names).
export const allTimeClosedTotal = 3918;
export const allTimeDistinctAssignees = 83;
export const allTimeLastRecomputed = "Sep 30 ~13:45 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "DANIEL BELTRAN", taskCount: 1002 },
  { name: "ARNULFO MUNGUIA", taskCount: 997 },
  { name: "DANIELA GONZALEZ", taskCount: 415 },
  { name: "Renato Rosales Garcia", taskCount: 151 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "Fatima Ponce", taskCount: 119 },
  { name: "JULIO CESAR Alvarado", taskCount: 113 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA -> Arnulfo" all-time at Bay-4 doors — RECOMPUTED this refresh from the same per-door closed
// rescan (uid 89, customerId = ORG-655875): 946 LOAD + 2 RECEIVE = 948.
// Caveat: other employees also carry this display name on different ids; the headline uses uid 89 only,
// which is the id present on the Bay-4 task rows for this name.
export const guruArnulfoAllTimeTotal = 948;
export const guruArnulfoAllTimeLoad = 946;
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

// Schedule: facility-wide appointment adherence for the current facility-local day (2026-09-30, Wednesday).
// Binding filters verified: loads = appointmentTimePeriod (2-element BETWEEN), receipts =
// appointmentTimeFrom/To. The 2026-09-30 window returns 121 loads and 44 receipts.
// Outbound = loads whose loading finished (status SHIPPED 53 + LOADED 10). Inbound = receipts with receivedTime.
export const scheduleAvailable = true;
export const scheduleUnavailableReason =
  "Reported from live 2026-09-30 appointment windows (121 loads / 44 receipts).";
export const scheduledInboundOrders = 44;
export const scheduledOutboundOrders = 121;
export const scheduledInboundReceived = 2;
export const scheduledOutboundLoaded = 63;
export const pctScheduledInboundReceived = (2 / 44) * 100; // 4.5% — 2 of 44 receipts received
export const pctScheduledOutboundLoaded = (63 / 121) * 100; // 52.1% — 63 of 121 loads finished loading

// Live status composition of the 2026-09-30 scheduled day (for the Data Notes audit trail).
export const scheduleLoadStatus: Record<string, number> = { SHIPPED: 53, LOADED: 10, NEW: 44, LOADING: 8, WINDOW_CHECKIN_DONE: 6 };
export const scheduleReceiptStatus: Record<string, number> = { IMPORTED: 27, IN_PROGRESS: 15, CLOSED: 2 };

// Facility-wide open population swept to isolate the Bay-4 subset (fresh this refresh).
export const facilityOpenLoad = 51;
export const facilityOpenReceive = 119;
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

// Open task records from fresh WISE data (2026-09-30T20:45:54Z snapshot)
// 13 open tasks: 7 LOAD (outbound) + 6 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5381269", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 5h 16m)", assignee: "DANIEL BELTRAN", door: "DOCK50" },
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (344d 7h 24m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5381268", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 5h 19m)", assignee: "DANIEL BELTRAN", door: "DOCK51" },
  { taskId: "TASK-5381106", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 6h 28m)", assignee: "ARNULFO MUNGUIA", door: "DOCK52" },
  { taskId: "TASK-5379622", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (2d 4h 46m)", assignee: "ARNULFO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (54d 4h 16m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5380820", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 8h 37m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5378787", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (2d 11h 54m)", assignee: "ARNULFO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5380438", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (1d 7h 2m)", assignee: "ARNULFO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5377454", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (10h 14m)", assignee: "Fatima Ponce", door: "DOCK56" },
  { taskId: "TASK-5382277", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (7h 2m)", assignee: "DANIEL BELTRAN", door: "DOCK59" },
  { taskId: "TASK-5377286", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (5d 12h 7m)", assignee: "Jorge Antonio Franco", door: "DOCK69" },
  { taskId: "TASK-5381972", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "Jorge Antonio Franco", door: "DOCK69" },
];

// ── Assigned Activity — Bay 4 (GURUNANDA / Live Out & In → Arnulfo) section ──
// Arnulfo Munguia (assigneeUserId 89) open tasks at Bay-4 doors this snapshot.
export const arnulfoOpenTasks: { door: string; taskId: string; kind: string; status: string; customer: string; note: string }[] = [
  { door: "DOCK52", taskId: "TASK-5381106", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 1d 6h 28m" },
  { door: "DOCK53", taskId: "TASK-5379622", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 2d 4h 46m" },
  { door: "DOCK54", taskId: "TASK-5380820", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 1d 8h 37m" },
  { door: "DOCK54", taskId: "TASK-5338695", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "STALE — 54d 4h 16m (endTime set 2026-08-10)" },
  { door: "DOCK55", taskId: "TASK-5378787", kind: "RECEIVE", status: "IN_PROGRESS", customer: "KARAKA, LLC", note: "IN_PROGRESS — 2d 11h 54m" },
  { door: "DOCK55", taskId: "TASK-5380438", kind: "RECEIVE", status: "IN_PROGRESS", customer: "KARAKA, LLC", note: "IN_PROGRESS — 1d 7h 2m" },
];

export const arnulfoOpenCount = 6;
export const arnulfoOpenLoad = 4;
export const arnulfoOpenReceive = 2;
export const arnulfoOpenGuru = 4;
export const arnulfoOpenKaraka = 2;
export const arnulfoOpenGuruLoad = 4;
export const arnulfoOpenGuruReceive = 0;
