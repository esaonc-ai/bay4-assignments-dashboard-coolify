/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-24 ~09:07 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (facility-wide sweep, statuses NEW/IN_PROGRESS/EXCEPTION, totalCount = 43)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (facility-wide sweep, same statuses, totalCount = 113)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod BETWEEN window)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window)
 *     - row-level rescan of CLOSED / FORCE_CLOSED load + receive tasks across all 23 doors (all-time block)
 *     - /wms-bam/user/search-by-paging — assigneeUserId → display name (94/94 resolved live)
 *     - /wms-bam/organization/search-by-paging — customerId → name (31/31 resolved live)
 *
 * SNAPSHOT INSTANT: 2026-09-24T16:07:16Z
 * UTC QUERY WINDOW: 2026-09-24T16:07:16Z -> 2026-09-24T16:07:16Z.
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * SCHEDULE NOTE: the current facility-local day (2026-09-24) carries appointments —
 *   156 loads and 31 receipts in the facility-local day window, so both schedule percentages are reported.
 *
 * FILTER NOTE: on the task-search family the status filter binds as the plural `statuses` (array);
 *   `statusList` is silently IGNORED. The door filter binds ONLY as the singular `dockId`; a plural
 *   `dockIds` (array) is silently IGNORED and a comma-separated `dockId` string is rejected (HTTP 400).
 *   The open Bay-4 population was therefore taken from a full facility-wide open sweep and filtered on each
 *   row's `dockId`; the all-time block used a per-door read on the binding singular `dockId`.
 *   23/23 doors live-verified (totalCount = 23): DOCK50=570, DOCK51=554, DOCK52=556, DOCK53=552, DOCK54=564, DOCK55=560, DOCK56=575, DOCK57=563, DOCK58=572, DOCK59=571, DOCK60=565, DOCK61=567, DOCK62=566, DOCK63=568, DOCK64=559, DOCK65=573, DOCK66=576, DOCK67=577, DOCK68=574, DOCK69=578, DOCK70=579, DOCK71=580, DOCK72=587.
 *
 *   INTEGRITY: every value below is a live count returned by WISE/WMS. No rows were fabricated; nothing
 *   was carried forward where a fresh read was possible. The all-time block was fully re-scanned this
 *   refresh (per-door closed read on the binding `dockId` filter).
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant, so
 *   durations are aged startTime -> 2026-09-24T16:07:16Z.
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
export const refreshStamp = "Sep 24 ~09:07 PDT";
export const refreshDateLong = "September 24, 2026";
// UTC snapshot instant for this refresh
export const snapshotUtc = "2026-09-24T16:07:16Z";
export const windowUtc = "2026-09-24T16:07:16Z";

export const doors: DoorRecord[] = [
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez", customer: "GURUNANDA, LLC", taskIds: ["TASK-5090739"], duration: "338d 2h 46m", anomaly: true },
  { door: "DOCK51", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5375752"], duration: "1d 1h 42m", anomaly: false },
  { door: "DOCK52", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5375561"], duration: "1d 2h 39m", anomaly: false },
  { door: "DOCK53", status: "Reserved", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5375880"], duration: null, anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5338695", "TASK-5375520"], duration: "47d 23h 37m", anomaly: true },
  { door: "DOCK55", status: "Occupied", assignee: "DANIELA GONZALEZ / ARNULFO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5375909", "TASK-5368665", "TASK-5373122"], duration: "0d 23h 15m", anomaly: false },
  { door: "DOCK56", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK57", status: "Occupied", assignee: "Fatima Ponce / DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5369922", "TASK-5376158"], duration: "2d 8h 2m", anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Reserved", assignee: "DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5376189"], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK62", status: "Occupied", assignee: "ARNULFO MUNGUIA / DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365814", "TASK-5375927"], duration: "10d 1h 22m", anomaly: false },
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks (14 open tasks at
// the 2026-09-24T16:07:16Z snapshot: 7 LOAD + 7 RECEIVE on 9 doors, 5 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 8 },
  { name: "DANIEL BELTRAN", taskCount: 2 },
  { name: "DANIELA GONZALEZ", taskCount: 2 },
  { name: "Fatima Ponce", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// FULLY RECOMPUTED this refresh from a per-door closed rescan on the binding singular `dockId` filter
// (3,860 closed transactions rolled up by display name, 83 distinct names).
export const allTimeClosedTotal = 3860;
export const allTimeDistinctAssignees = 83;
export const allTimeLastRecomputed = "Sep 24 ~09:07 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 982 },
  { name: "DANIEL BELTRAN", taskCount: 979 },
  { name: "DANIELA GONZALEZ", taskCount: 410 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR ALVARADO", taskCount: 113 },
  { name: "Fatima Ponce", taskCount: 112 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA -> Arnulfo" all-time at Bay-4 doors — RECOMPUTED this refresh from the same per-door closed
// rescan (uid 89, customerId = ORG-655875): 932 LOAD + 2 RECEIVE = 934.
// Caveat: other employees also carry this display name on different ids; the headline uses uid 89 only,
// which is the id present on the Bay-4 task rows for this name.
export const guruArnulfoAllTimeTotal = 934;
export const guruArnulfoAllTimeLoad = 932;
export const guruArnulfoAllTimeReceive = 2;

// Mix: 7 LOAD (outbound) + 7 RECEIVE (inbound) = 14 open tasks at Bay 4 doors.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 7, total: 14 },
  { label: "Inbound", count: 7, total: 14 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 7, total: 14 },
  { label: "Inbound", count: 7, total: 14 },
];

// Schedule: facility-wide appointment adherence for the current facility-local day (2026-09-24).
// Binding filters verified: loads = appointmentTimePeriod (2-element BETWEEN), receipts =
// appointmentTimeFrom/To. Both return live rows for 2026-09-24.
export const scheduleAvailable = true;
export const scheduleUnavailableReason =
  "Reported from live 2026-09-24 appointment windows.";
export const scheduledInboundOrders = 31;
export const scheduledOutboundOrders = 156;
export const scheduledInboundReceived = 3;
export const scheduledOutboundLoaded = 10;
export const pctScheduledInboundReceived = 9.7; // 3 of 31 receipts closed/received
export const pctScheduledOutboundLoaded = 6.4; // 10 of 156 loads LOADED/SHIPPED

// Live status composition of the 2026-09-24 scheduled day (for the Data Notes audit trail).
export const scheduleLoadStatus: Record<string, number> = {"NEW": 135, "LOADING": 7, "SHIPPED": 7, "WINDOW_CHECKIN_DONE": 4, "LOADED": 3};
export const scheduleReceiptStatus: Record<string, number> = {"IMPORTED": 16, "OPEN": 10, "FORCE_CLOSED": 3, "IN_PROGRESS": 2};

// Facility-wide open population swept to isolate the Bay-4 subset (fresh this refresh).
export const facilityOpenLoad = 43;
export const facilityOpenReceive = 113;
export const bay4DockIdMap: Record<string, string> = { "DOCK50": "570", "DOCK51": "554", "DOCK52": "556", "DOCK53": "552", "DOCK54": "564", "DOCK55": "560", "DOCK56": "575", "DOCK57": "563", "DOCK58": "572", "DOCK59": "571", "DOCK60": "565", "DOCK61": "567", "DOCK62": "566", "DOCK63": "568", "DOCK64": "559", "DOCK65": "573", "DOCK66": "576", "DOCK67": "577", "DOCK68": "574", "DOCK69": "578", "DOCK70": "579", "DOCK71": "580", "DOCK72": "587" };

// Customer mix of the open Bay-4 population this snapshot.
export const openCustomerMix: AssigneeSummary[] = [
  { name: "GURUNANDA, LLC", taskCount: 12 },
  { name: "KARAKA, LLC", taskCount: 2 },
];
export const openStatusCounts: AssigneeSummary[] = [
  { name: "IN_PROGRESS", taskCount: 10 },
  { name: "NEW", taskCount: 4 },
];

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (2026-09-24T16:07:16Z snapshot)
// 14 open tasks: 7 LOAD (outbound) + 7 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (338d 2h 46m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5375752", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 1h 42m)", assignee: "ARNULFO MUNGUIA", door: "DOCK51" },
  { taskId: "TASK-5375561", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 2h 39m)", assignee: "ARNULFO MUNGUIA", door: "DOCK52" },
  { taskId: "TASK-5375880", dns: "LOAD NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5375520", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 4h 21m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (47d 23h 37m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5375909", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0d 23h 15m)", assignee: "DANIELA GONZALEZ", door: "DOCK55" },
  { taskId: "TASK-5368665", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5373122", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5369922", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (2d 8h 2m)", assignee: "Fatima Ponce", door: "DOCK57" },
  { taskId: "TASK-5376158", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0d 7h 41m)", assignee: "DANIEL BELTRAN", door: "DOCK57" },
  { taskId: "TASK-5376189", dns: "LOAD NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "DANIEL BELTRAN", door: "DOCK59" },
  { taskId: "TASK-5365814", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (10d 1h 22m)", assignee: "ARNULFO MUNGUIA", door: "DOCK62" },
  { taskId: "TASK-5375927", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0d 21h 34m)", assignee: "DANIELA GONZALEZ", door: "DOCK62" },
];

// ── Assigned Activity — Bay 4 (GURUNANDA / Live Out & In → Arnulfo) section ──
// Arnulfo Munguia (assigneeUserId 89) open tasks at Bay-4 doors this snapshot.
export const arnulfoOpenTasks: { door: string; taskId: string; kind: string; status: string; customer: string; note: string }[] = [
  { door: "DOCK51", taskId: "TASK-5375752", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 1d 1h 42m" },
  { door: "DOCK52", taskId: "TASK-5375561", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 1d 2h 39m" },
  { door: "DOCK53", taskId: "TASK-5375880", kind: "LOAD", status: "NEW", customer: "GURUNANDA, LLC", note: "NEW — not started" },
  { door: "DOCK54", taskId: "TASK-5375520", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 1d 4h 21m" },
  { door: "DOCK54", taskId: "TASK-5338695", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "STALE — endTime set (2026-08-10)" },
  { door: "DOCK55", taskId: "TASK-5368665", kind: "RECEIVE", status: "NEW", customer: "KARAKA, LLC", note: "NEW — not started" },
  { door: "DOCK55", taskId: "TASK-5373122", kind: "RECEIVE", status: "NEW", customer: "KARAKA, LLC", note: "NEW — not started" },
  { door: "DOCK62", taskId: "TASK-5365814", kind: "RECEIVE", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 10d 1h 22m" },
];

export const arnulfoOpenCount = 8;
export const arnulfoOpenLoad = 5;
export const arnulfoOpenReceive = 3;
export const arnulfoOpenGuru = 6;
export const arnulfoOpenKaraka = 2;
export const arnulfoOpenGuruLoad = 5;
export const arnulfoOpenGuruReceive = 1;
