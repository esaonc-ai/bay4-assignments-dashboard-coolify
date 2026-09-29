/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-28 ~23:50 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (facility-wide sweep, statuses NEW/IN_PROGRESS/EXCEPTION, totalCount = 29)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (facility-wide sweep, same statuses, totalCount = 114)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod BETWEEN window, totalCount = 131)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window, totalCount = 37)
 *     - row-level rescan of CLOSED / FORCE_CLOSED load + receive tasks across all 23 doors (all-time block)
 *
 * SNAPSHOT INSTANT: 2026-09-29T06:49:28Z (2026-09-28 ~23:50 PDT)
 * UTC QUERY WINDOW: 2026-09-29T06:49:28Z -> 2026-09-29T06:49:28Z.
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * SCHEDULE NOTE: the current facility-local day is 2026-09-28 (Monday) — a scheduled operating day carrying
 *   131 load appointments and 37 receipt appointments in its day window. Outbound: 114 of 131 loads have finished
 *   loading (111 SHIPPED + 3 LOADED), 17 remain NEW. Inbound: 14 of 37 receipts have a receivedTime set
 *   (12 CLOSED + 2 TASK_COMPLETED); 14 are IN_PROGRESS and 9 are still IMPORTED.
 *
 * FILTER NOTE: on the task-search family the status filter binds as the plural `statuses` (array); `statusList`
 *   is silently IGNORED. The door filter binds ONLY as the singular `dockId`; a plural `dockIds` (array) is
 *   silently IGNORED and a comma-separated `dockId` string is rejected (HTTP 400). The open Bay-4 population was
 *   therefore taken from a full facility-wide open sweep and filtered on each row's `dockId`; the all-time block
 *   used a per-door read on the binding singular `dockId`. 23/23 doors live-verified (totalCount = 23).
 *
 *   PAGING: the task-search family pages on `currentPage` (1-based) and a single page is capped at 200 rows.
 *   `pageNum` is silently IGNORED (page 2 repeats page 1), so a naive pageNum loop both over-counts rows and
 *   truncates large result sets. The all-time block was therefore read by paging `currentPage` and de-duplicating
 *   on task id; the 23-door roll-up reconciles to 2,872 LOAD + 1,032 RECEIVE = 3,904 closed Bay-4 transactions.
 *
 *   INTEGRITY: every value below is a live count returned by WISE/WMS. No rows were fabricated; nothing was
 *   carried forward where a fresh read was possible. The all-time block was fully re-scanned this refresh.
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant, so durations
 *   are aged startTime -> 2026-09-29T06:49:28Z.
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
export const refreshStamp = "Sep 28 ~23:50 PDT";
export const refreshDateLong = "September 28, 2026";
// UTC snapshot instant for this refresh
export const snapshotUtc = "2026-09-29T06:49:28Z";
export const windowUtc = "2026-09-29T06:49:28Z";

export const doors: DoorRecord[] = [
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez", customer: "GURUNANDA, LLC", taskIds: ["TASK-5090739"], duration: "342d 10h 28m", anomaly: true },
  { door: "DOCK51", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK52", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5379177"], duration: "11h 52m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5379622"], duration: "7h 50m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5378836", "TASK-5338695"], duration: "52d 7h 19m", anomaly: true },
  { door: "DOCK55", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "KARAKA, LLC", taskIds: ["TASK-5378787"], duration: "14h 58m", anomaly: false },
  { door: "DOCK56", status: "Reserved", assignee: "RUFINO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5377454"], duration: null, anomaly: false },
  { door: "DOCK57", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK62", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK63", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK64", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK65", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK66", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK67", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK68", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK69", status: "Occupied", assignee: "Jorge Antonio Franco", customer: "GURUNANDA, LLC", taskIds: ["TASK-5377286"], duration: "3d 15h 11m", anomaly: false },
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks (8 open tasks at
// the 2026-09-29T06:49:28Z snapshot: 4 LOAD + 4 RECEIVE on 6 doors, 4 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 5 },
  { name: "daira gonzalez", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "Jorge Antonio Franco", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// FULLY RECOMPUTED this refresh from a per-door closed rescan on the binding singular `dockId` filter
// (3,904 closed transactions rolled up by display name, 83 distinct names).
export const allTimeClosedTotal = 3904;
export const allTimeDistinctAssignees = 83;
export const allTimeLastRecomputed = "Sep 28 ~23:50 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "DANIEL BELTRAN", taskCount: 997 },
  { name: "ARNULFO MUNGUIA", taskCount: 994 },
  { name: "DANIELA GONZALEZ", taskCount: 414 },
  { name: "RENATO ROSALES GARCIA", taskCount: 151 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "Fatima Ponce", taskCount: 118 },
  { name: "JULIO CESAR ALVARADO", taskCount: 113 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA -> Arnulfo" all-time at Bay-4 doors — RECOMPUTED this refresh from the same per-door closed
// rescan (uid 89, customerId = ORG-655875): 943 LOAD + 2 RECEIVE = 945.
// Caveat: other employees also carry this display name on different ids; the headline uses uid 89 only,
// which is the id present on the Bay-4 task rows for this name.
export const guruArnulfoAllTimeTotal = 945;
export const guruArnulfoAllTimeLoad = 943;
export const guruArnulfoAllTimeReceive = 2;

// Mix: 4 LOAD (outbound) + 4 RECEIVE (inbound) = 8 open tasks at Bay 4 doors.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 4, total: 8 },
  { label: "Inbound", count: 4, total: 8 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 4, total: 8 },
  { label: "Inbound", count: 4, total: 8 },
];

// Schedule: facility-wide appointment adherence for the current facility-local day (2026-09-28, Monday).
// Binding filters verified: loads = appointmentTimePeriod (2-element BETWEEN), receipts =
// appointmentTimeFrom/To. The 2026-09-28 window returns 131 loads and 37 receipts.
// Outbound = loads whose loading finished (status SHIPPED 111 + LOADED 3). Inbound = receipts with receivedTime.
export const scheduleAvailable = true;
export const scheduleUnavailableReason =
  "Reported from live 2026-09-28 appointment windows (131 loads / 37 receipts).";
export const scheduledInboundOrders = 37;
export const scheduledOutboundOrders = 131;
export const scheduledInboundReceived = 14;
export const scheduledOutboundLoaded = 114;
export const pctScheduledInboundReceived = (14 / 37) * 100; // 37.8% — 14 of 37 receipts received
export const pctScheduledOutboundLoaded = (114 / 131) * 100; // 87.0% — 114 of 131 loads finished loading

// Live status composition of the 2026-09-28 scheduled day (for the Data Notes audit trail).
export const scheduleLoadStatus: Record<string, number> = { SHIPPED: 111, LOADED: 3, NEW: 17 };
export const scheduleReceiptStatus: Record<string, number> = { IMPORTED: 9, IN_PROGRESS: 14, CLOSED: 12, TASK_COMPLETED: 2 };

// Facility-wide open population swept to isolate the Bay-4 subset (fresh this refresh).
export const facilityOpenLoad = 29;
export const facilityOpenReceive = 114;
export const bay4DockIdMap: Record<string, string> = { "DOCK50": "570", "DOCK51": "554", "DOCK52": "556", "DOCK53": "552", "DOCK54": "564", "DOCK55": "560", "DOCK56": "575", "DOCK57": "563", "DOCK58": "572", "DOCK59": "571", "DOCK60": "565", "DOCK61": "567", "DOCK62": "566", "DOCK63": "568", "DOCK64": "559", "DOCK65": "573", "DOCK66": "576", "DOCK67": "577", "DOCK68": "574", "DOCK69": "578", "DOCK70": "579", "DOCK71": "580", "DOCK72": "587" };

// Customer mix of the open Bay-4 population this snapshot.
export const openCustomerMix: AssigneeSummary[] = [
  { name: "GURUNANDA, LLC", taskCount: 7 },
  { name: "KARAKA, LLC", taskCount: 1 },
];
export const openStatusCounts: AssigneeSummary[] = [
  { name: "IN_PROGRESS", taskCount: 7 },
  { name: "NEW", taskCount: 1 },
];

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (2026-09-29T06:49:28Z snapshot)
// 8 open tasks: 4 LOAD (outbound) + 4 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5379622", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (7h 50m)", assignee: "ARNULFO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5379177", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (11h 52m)", assignee: "ARNULFO MUNGUIA", door: "DOCK52" },
  { taskId: "TASK-5378836", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (14h 42m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (52d 7h 19m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5378787", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (14h 58m)", assignee: "ARNULFO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5377454", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "RUFINO MUNGUIA", door: "DOCK56" },
  { taskId: "TASK-5377286", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (3d 15h 11m)", assignee: "Jorge Antonio Franco", door: "DOCK69" },
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (342d 10h 28m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
];

// ── Assigned Activity — Bay 4 (GURUNANDA / Live Out & In → Arnulfo) section ──
// Arnulfo Munguia (assigneeUserId 89) open tasks at Bay-4 doors this snapshot.
export const arnulfoOpenTasks: { door: string; taskId: string; kind: string; status: string; customer: string; note: string }[] = [
  { door: "DOCK52", taskId: "TASK-5379177", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 11h 52m" },
  { door: "DOCK53", taskId: "TASK-5379622", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 7h 50m" },
  { door: "DOCK54", taskId: "TASK-5378836", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 14h 42m" },
  { door: "DOCK54", taskId: "TASK-5338695", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "STALE — endTime set (2026-08-10)" },
  { door: "DOCK55", taskId: "TASK-5378787", kind: "RECEIVE", status: "IN_PROGRESS", customer: "KARAKA, LLC", note: "IN_PROGRESS — 14h 58m" },
];

export const arnulfoOpenCount = 5;
export const arnulfoOpenLoad = 4;
export const arnulfoOpenReceive = 1;
export const arnulfoOpenGuru = 4;
export const arnulfoOpenKaraka = 1;
export const arnulfoOpenGuruLoad = 4;
export const arnulfoOpenGuruReceive = 0;
