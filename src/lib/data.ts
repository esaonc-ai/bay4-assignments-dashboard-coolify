/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-10-07 ~10:16 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (facility-wide sweep, statuses NEW/IN_PROGRESS/EXCEPTION, totalCount = 48; Bay-4 subset on dockId)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (facility-wide sweep, same statuses, totalCount = 97; Bay-4 subset on dockId)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod BETWEEN window, totalCount = 96)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window, totalCount = 44)
 *     - all-time block — RECOMPUTED this refresh by full row-level rescan (23 doors × 2 task types)
 *
 * SNAPSHOT INSTANT: 2026-10-07T17:16:07Z (2026-10-07 ~10:16 PDT)
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * SCHEDULE NOTE: the current facility-local day is 2026-10-07 (Wednesday) — an OPERATING day carrying
 *   96 load appointments and 44 receipt appointments in its day window, so the schedule adherence
 *   tiles are reported (0.0% inbounds received, 11.5% outbounds loaded) rather than n/a.
 *
 * ALL-TIME NOTE: the all-time block was RECOMPUTED this refresh by a full row-level rescan of every
 *   Bay-4 door (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED). The closed population grew from
 *   the prior 2026-10-06 ~08:39 PDT rescan (3,958 → 3,971 closed transactions; 2,903 → 2,914 LOAD;
 *   1,055 → 1,057 RECEIVE), so the cumulative figures below are fresh, not carried forward.
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
 *   task id; the 23-door roll-up reconciles to 2,914 LOAD + 1,057 RECEIVE = 3,971 closed Bay-4 transactions.
 *
 *   INTEGRITY: every live value below is a count returned by WISE/WMS this refresh. No rows were fabricated;
 *   nothing was carried forward where a fresh read was possible.
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant, so durations
 *   are aged startTime -> 2026-10-07T17:16:07Z.
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
export const refreshStamp = "Oct 07 ~10:16 PDT";
export const refreshDateLong = "October 07, 2026";
// UTC snapshot instant for this refresh
export const snapshotUtc = "2026-10-07T17:16:07Z";
export const windowUtc = "2026-10-07T17:16:07Z";

export const doors: DoorRecord[] = [
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez, ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5090739", "TASK-5381269"], duration: "350d 20h 54m", anomaly: true },
  { door: "DOCK51", status: "Occupied", assignee: "ARNULFO MUNGUIA, JEROME ARANDA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5381268", "TASK-5388576"], duration: "7d 18h 49m", anomaly: false },
  { door: "DOCK52", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5387899"], duration: "18h 36m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5382457", "TASK-5387787"], duration: "6d 18h 27m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5338695", "TASK-5382462", "TASK-5387292"], duration: "60d 17h 46m", anomaly: true },
  { door: "DOCK55", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK56", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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
  { door: "DOCK69", status: "Reserved", assignee: "Jorge Antonio Franco", customer: "GURUNANDA, LLC", taskIds: ["TASK-5381972"], duration: null, anomaly: false },
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks (11 open tasks at
// the 2026-10-07T17:16:07Z snapshot: 9 LOAD + 2 RECEIVE on 6 doors, 4 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 8 },
  { name: "JEROME ARANDA", taskCount: 1 },
  { name: "Jorge Antonio Franco", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// RECOMPUTED this refresh by full row-level rescan: 3,971 closed transactions rolled up by display
// name across 83 distinct names (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED).
export const allTimeClosedTotal = 3971;
export const allTimeDistinctAssignees = 83;
export const allTimeLastRecomputed = "Oct 07 ~10:16 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "DANIEL BELTRAN", taskCount: 1025 },
  { name: "ARNULFO MUNGUIA", taskCount: 1007 },
  { name: "DANIELA GONZALEZ", taskCount: 424 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "renato rosales", taskCount: 151 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "Fatima Ponce", taskCount: 122 },
  { name: "JULIO CESAR ALVARADO", taskCount: 113 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA -> Arnulfo" all-time at Bay-4 doors — RECOMPUTED this refresh (uid 89, customerId = ORG-655875):
// 953 LOAD + 2 RECEIVE = 955.
// Caveat: other employees also carry this display name on different ids; the headline uses uid 89 only,
// which is the id present on the Bay-4 task rows for this name.
export const guruArnulfoAllTimeTotal = 955;
export const guruArnulfoAllTimeLoad = 953;
export const guruArnulfoAllTimeReceive = 2;

// Mix: 9 LOAD (outbound) + 2 RECEIVE (inbound) = 11 open tasks at Bay 4 doors.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 9, total: 11 },
  { label: "Inbound", count: 2, total: 11 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 9, total: 11 },
  { label: "Inbound", count: 2, total: 11 },
];

// Schedule: facility-wide appointment adherence for the current facility-local day (2026-10-07, Wednesday).
// Binding filters verified: loads = appointmentTimePeriod (2-element BETWEEN), receipts =
// appointmentTimeFrom/To. The 2026-10-07 window returns 96 loads / 44 receipts (operating day).
export const scheduleAvailable = true;
export const scheduleUnavailableReason =
  "Reported — 2026-10-07 (Wednesday) is an operating day (96 loads / 44 receipts scheduled)";
export const scheduledInboundOrders = 44;
export const scheduledOutboundOrders = 96;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 11;
export const pctScheduledInboundReceived = (0 / 44) * 100; // 0.0% — 0 of 44 receipts received (today)
export const pctScheduledOutboundLoaded = (11 / 96) * 100; // 11.5% — 11 of 96 loads loaded/shipped (today)

// Live status composition of the 2026-10-07 scheduled day.
export const scheduleLoadStatus: Record<string, number> = { NEW: 62, WINDOW_CHECKIN_DONE: 15, LOADING: 8, LOADED: 5, SHIPPED: 6 };
export const scheduleReceiptStatus: Record<string, number> = { IMPORTED: 31, OPEN: 8, IN_PROGRESS: 5 };

// Facility-wide open population swept to isolate the Bay-4 subset (fresh this refresh).
export const facilityOpenLoad = 48;
export const facilityOpenReceive = 97;
export const bay4DockIdMap: Record<string, string> = { "DOCK50": "570", "DOCK51": "554", "DOCK52": "556", "DOCK53": "552", "DOCK54": "564", "DOCK55": "560", "DOCK56": "575", "DOCK57": "563", "DOCK58": "572", "DOCK59": "571", "DOCK60": "565", "DOCK61": "567", "DOCK62": "566", "DOCK63": "568", "DOCK64": "559", "DOCK65": "573", "DOCK66": "576", "DOCK67": "577", "DOCK68": "574", "DOCK69": "578", "DOCK70": "579", "DOCK71": "580", "DOCK72": "587" };

// Customer mix of the open Bay-4 population this snapshot.
export const openCustomerMix: AssigneeSummary[] = [
  { name: "GURUNANDA, LLC", taskCount: 11 },
];
export const openStatusCounts: AssigneeSummary[] = [
  { name: "IN_PROGRESS", taskCount: 9 },
  { name: "NEW", taskCount: 2 },
];

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (2026-10-07T17:16:07Z snapshot)
// 11 open tasks: 9 LOAD (outbound) + 2 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5382457", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (6d 18h 27m)", assignee: "ARNULFO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5387787", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (19h 47m)", assignee: "ARNULFO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5381268", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (7d 18h 49m)", assignee: "ARNULFO MUNGUIA", door: "DOCK51" },
  { taskId: "TASK-5388576", dns: "LOAD NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "JEROME ARANDA", door: "DOCK51" },
  { taskId: "TASK-5387899", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (18h 36m)", assignee: "ARNULFO MUNGUIA", door: "DOCK52" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (60d 17h 46m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5382462", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (6d 0h 53m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5387292", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 0h 3m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (350d 20h 54m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5381269", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (7d 18h 46m)", assignee: "ARNULFO MUNGUIA", door: "DOCK50" },
  { taskId: "TASK-5381972", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "Jorge Antonio Franco", door: "DOCK69" },
];

// ── Assigned Activity — Bay 4 (GURUNANDA / Live Out & In → Arnulfo) section ──
// Arnulfo Munguia (assigneeUserId 89) open tasks at Bay-4 doors this snapshot.
export const arnulfoOpenTasks: { door: string; taskId: string; kind: string; status: string; customer: string; note: string }[] = [
  { door: "DOCK53", taskId: "TASK-5382457", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 6d 18h 27m" },
  { door: "DOCK53", taskId: "TASK-5387787", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 19h 47m" },
  { door: "DOCK51", taskId: "TASK-5381268", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 7d 18h 49m" },
  { door: "DOCK52", taskId: "TASK-5387899", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 18h 36m" },
  { door: "DOCK54", taskId: "TASK-5338695", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "STALE — 60d 17h 46m (endTime set 2026-08-10)" },
  { door: "DOCK54", taskId: "TASK-5382462", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 6d 0h 53m" },
  { door: "DOCK54", taskId: "TASK-5387292", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 1d 0h 3m" },
  { door: "DOCK50", taskId: "TASK-5381269", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 7d 18h 46m" },
];

export const arnulfoOpenCount = 8;
export const arnulfoOpenLoad = 8;
export const arnulfoOpenReceive = 0;
export const arnulfoOpenGuru = 8;
export const arnulfoOpenKaraka = 0;
export const arnulfoOpenGuruLoad = 8;
export const arnulfoOpenGuruReceive = 0;
