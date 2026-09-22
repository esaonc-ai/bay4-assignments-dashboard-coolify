/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-22 ~10:09 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (facility-wide sweep, statuses NEW/IN_PROGRESS/EXCEPTION)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (facility-wide sweep, same statuses)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod BETWEEN window)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window)
 *     - row-level rescan of CLOSED / FORCE_CLOSED load + receive tasks across all 23 doors (all-time block)
 *
 * SNAPSHOT INSTANT: 2026-09-22 10:08:53 PDT (America/Los_Angeles), Tuesday.
 * UTC QUERY WINDOW: 2026-09-22T17:08:53Z → 2026-09-22T17:08:53Z.
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * SCHEDULE NOTE: today (2026-09-22) carries appointments — 110 loads and 31 receipts in the
 *   facility-local day window, so both schedule percentages are reported.
 *
 * FILTER NOTE: on the task-search family the status filter binds as the plural `statuses` (array);
 *   `statusList` is silently IGNORED. The door filter binds ONLY as the singular `dockId`; a plural
 *   `dockIds` (array) is silently IGNORED and a comma-separated `dockId` string is rejected (HTTP 400).
 *   The Bay-4 population was therefore taken from a full facility-wide open sweep and filtered on each
 *   row's `dockId`. 23/23 doors live-verified (totalCount = 23): DOCK50=570, DOCK51=554, DOCK52=556, DOCK53=552, DOCK54=564, DOCK55=560, DOCK56=575, DOCK57=563, DOCK58=572, DOCK59=571, DOCK60=565, DOCK61=567, DOCK62=566, DOCK63=568, DOCK64=559, DOCK65=573, DOCK66=576, DOCK67=577, DOCK68=574, DOCK69=578, DOCK70=579, DOCK71=580, DOCK72=587.
 *
 *   INTEGRITY: every value below is a live count returned by WISE/WMS. No rows were fabricated; nothing
 *   was carried forward where a fresh read was possible. The all-time block was fully re-scanned this
 *   refresh (de-duplicated single-page-per-door read; unique rows == server totalCount).
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant, so
 *   durations are aged startTime → 2026-09-22T17:08:53Z.
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
export const refreshStamp = "Sep 22 ~10:09 PDT";
export const refreshDateLong = "September 22, 2026";
// UTC query window for this snapshot
export const snapshotUtc = "2026-09-22T17:08:53Z";
export const windowUtc = "2026-09-22T17:08:53Z";

export const doors: DoorRecord[] = [
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez", customer: "GURUNANDA, LLC", taskIds: ["TASK-5090739"], duration: "335d 20h 47m", anomaly: true },
  { door: "DOCK51", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5373035"], duration: "0d 20h 45m", anomaly: false },
  { door: "DOCK52", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5373472"], duration: "0d 18h 12m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365421", "TASK-5338695"], duration: "45d 17h 39m", anomaly: true },
  { door: "DOCK55", status: "Reserved", assignee: "ARNULFO MUNGUIA / RUFINO MUNGUIA", customer: "KARAKA, LLC / GURUNANDA, LLC", taskIds: ["TASK-5373122", "TASK-5371830", "TASK-5368665"], duration: null, anomaly: false },
  { door: "DOCK56", status: "Reserved", assignee: "ARNULFO MUNGUIA", customer: "KARAKA, LLC", taskIds: ["TASK-5369120"], duration: null, anomaly: false },
  { door: "DOCK57", status: "Occupied", assignee: "DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5374025"], duration: "0d 0h 21m", anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Reserved", assignee: "JEROME ARANDA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5374092"], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK62", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365814"], duration: "7d 19h 24m", anomaly: false },
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks (12 open tasks at
// the 2026-09-22 ~10:09 PDT snapshot: 5 LOAD + 7 RECEIVE on 9 doors, 5 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 7 },
  { name: "DANIEL BELTRAN", taskCount: 2 },
  { name: "JEROME ARANDA", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// FULLY RECOMPUTED this refresh (2026-09-22 ~10:09 PDT) from a complete row-level rescan of all
// closed load/receive tasks across the 23 doors (2827 LOAD + 1005 RECEIVE = 3,832 closed
// transactions rolled up by display name, 83 distinct names).
export const allTimeClosedTotal = 3832;
export const allTimeDistinctAssignees = 83;
export const allTimeLastRecomputed = "2026-09-22 ~10:09 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "DANIEL BELTRAN", taskCount: 973 },
  { name: "ARNULFO MUNGUIA", taskCount: 973 },
  { name: "DANIELA GONZALEZ", taskCount: 403 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR Alvarado", taskCount: 113 },
  { name: "Fatima ponce", taskCount: 111 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA → Arnulfo" all-time at Bay-4 doors — RECOMPUTED this refresh from the same full
// row-level rescan (uid 89, customerId OR customerIds=ORG-655875): 924 LOAD + 2 RECEIVE = 926.
// Caveat: other employees also carry this display name on different ids (see Data Notes); the
// headline uses uid 89 only, which is the id present on the Bay-4 task rows for this name.
export const guruArnulfoAllTimeTotal = 926;
export const guruArnulfoAllTimeLoad = 924;
export const guruArnulfoAllTimeReceive = 2;

// Mix: 5 LOAD (outbound) + 7 RECEIVE (inbound) = 12 open tasks at Bay 4 doors (2026-09-22
// ~10:09 PDT snapshot).
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 12 },
  { label: "Inbound", count: 7, total: 12 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 12 },
  { label: "Inbound", count: 7, total: 12 },
];

// Schedule: facility-wide appointment adherence for the current facility-local day (2026-09-22).
// Binding filters verified: loads = appointmentTimePeriod (2-element BETWEEN), receipts =
// appointmentTimeFrom/To. Both return live rows for 2026-09-22.
export const scheduleAvailable = true;
export const scheduleUnavailableReason =
  "Reported from live 2026-09-22 appointment windows.";
export const scheduledInboundOrders = 31;
export const scheduledOutboundOrders = 110;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 24;
export const pctScheduledInboundReceived = 0.0; // 0 of 31
export const pctScheduledOutboundLoaded = 21.8; // 24 of 110

// Live status composition of the 2026-09-22 scheduled day (for the Data Notes audit trail).
export const scheduleLoadStatus: Record<string, number> = { "NEW": 68, "SHIPPED": 17, "WINDOW_CHECKIN_DONE": 13, "LOADED": 7, "LOADING": 5 };
export const scheduleReceiptStatus: Record<string, number> = { "IMPORTED": 14, "OPEN": 10, "IN_PROGRESS": 7 };

// Facility-wide open population swept to isolate the Bay-4 subset (fresh this refresh).
export const facilityOpenLoad = 52;
export const facilityOpenReceive = 135;
export const bay4DockIdMap: Record<string, string> = { "DOCK50": "570", "DOCK51": "554", "DOCK52": "556", "DOCK53": "552", "DOCK54": "564", "DOCK55": "560", "DOCK56": "575", "DOCK57": "563", "DOCK58": "572", "DOCK59": "571", "DOCK60": "565", "DOCK61": "567", "DOCK62": "566", "DOCK63": "568", "DOCK64": "559", "DOCK65": "573", "DOCK66": "576", "DOCK67": "577", "DOCK68": "574", "DOCK69": "578", "DOCK70": "579", "DOCK71": "580", "DOCK72": "587" };

// Customer mix of the open Bay-4 population this snapshot.
export const openCustomerMix: AssigneeSummary[] = [
  { name: "GURUNANDA, LLC", taskCount: 9 },
  { name: "KARAKA, LLC", taskCount: 3 },
];
export const openStatusCounts: AssigneeSummary[] = [
  { name: "IN_PROGRESS", taskCount: 7 },
  { name: "NEW", taskCount: 5 },
];

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 22, 2026 ~10:09 PDT snapshot)
// 12 open tasks: 5 LOAD (outbound) + 7 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (335d 20h 47m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5373035", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0d 20h 45m)", assignee: "ARNULFO MUNGUIA", door: "DOCK51" },
  { taskId: "TASK-5373472", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0d 18h 12m)", assignee: "DANIEL BELTRAN", door: "DOCK53" },
  { taskId: "TASK-5365421", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (11d 0h 36m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (45d 17h 39m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5373122", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5371830", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "RUFINO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5368665", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5369120", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK56" },
  { taskId: "TASK-5374025", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0d 0h 21m)", assignee: "DANIEL BELTRAN", door: "DOCK57" },
  { taskId: "TASK-5374092", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "JEROME ARANDA", door: "DOCK59" },
  { taskId: "TASK-5365814", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (7d 19h 24m)", assignee: "ARNULFO MUNGUIA", door: "DOCK62" },
];

// ── Assigned Activity — Bay 4 (GURUNANDA / Live Out & In → Arnulfo) section ──
// Arnulfo Munguia (assigneeUserId 89) open tasks at Bay-4 doors this snapshot.
export const arnulfoOpenTasks: { door: string; taskId: string; kind: string; status: string; customer: string; note: string }[] = [
  { door: "DOCK51", taskId: "TASK-5373035", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 0d 20h 45m" },
  { door: "DOCK54", taskId: "TASK-5365421", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "STALE — endTime set" },
  { door: "DOCK54", taskId: "TASK-5338695", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "STALE — endTime set" },
  { door: "DOCK55", taskId: "TASK-5373122", kind: "RECEIVE", status: "NEW", customer: "KARAKA, LLC", note: "NEW — not started" },
  { door: "DOCK55", taskId: "TASK-5368665", kind: "RECEIVE", status: "NEW", customer: "KARAKA, LLC", note: "NEW — not started" },
  { door: "DOCK56", taskId: "TASK-5369120", kind: "RECEIVE", status: "NEW", customer: "KARAKA, LLC", note: "NEW — not started" },
  { door: "DOCK62", taskId: "TASK-5365814", kind: "RECEIVE", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 7d 19h 24m" },
];

export const arnulfoOpenCount = 7;
export const arnulfoOpenLoad = 3;
export const arnulfoOpenReceive = 4;
export const arnulfoOpenGuru = 4;
export const arnulfoOpenKaraka = 3;
export const arnulfoOpenGuruLoad = 3;
export const arnulfoOpenGuruReceive = 1;
