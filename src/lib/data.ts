/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-10-09 ~07:46 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (facility-wide sweep, statuses NEW/IN_PROGRESS/EXCEPTION, totalCount = 45; Bay-4 subset on dockId)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (facility-wide sweep, same statuses, totalCount = 84; Bay-4 subset on dockId)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod BETWEEN window, totalCount = 107)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window, totalCount = 33)
 *     - /wms-bam/organization/search-by-paging — customer name resolution for the open Bay-4 rows (ORG-40858 → CMPC USA (Cut Paper and Rolls); ORG-585450 → KARAKA, LLC)
 *     - all-time block — RECOMPUTED this refresh by full row-level rescan (23 doors × 2 task types)
 *
 * SNAPSHOT INSTANT: 2026-10-09T14:46:45Z (2026-10-09 ~07:46 PDT)
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * SCHEDULE NOTE: the current facility-local day is 2026-10-09 (Friday) — an OPERATING day carrying
 *   107 load appointments and 33 receipt appointments in its day window, so the schedule adherence
 *   tiles are reported (0.0% inbounds received, 0.9% outbounds loaded) rather than n/a. This is an
 *   early-morning snapshot, so most of the day's appointments have not yet started.
 *
 * ALL-TIME NOTE: the all-time block was RECOMPUTED this refresh by a full row-level rescan of every
 *   Bay-4 door (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED). The closed population grew from
 *   the prior 2026-10-08 ~10:39 PDT rescan (3,987 → 3,993 closed transactions; 2,926 → 2,929 LOAD;
 *   1,061 → 1,064 RECEIVE), so the cumulative figures below are fresh, not carried forward.
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
 *   task id; the 23-door roll-up reconciles to 2,929 LOAD + 1,064 RECEIVE = 3,993 closed Bay-4 transactions.
 *
 *   INTEGRITY: every live value below is a count returned by WISE/WMS this refresh. No rows were fabricated;
 *   nothing was carried forward where a fresh read was possible.
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant, so durations
 *   are aged startTime -> 2026-10-09T14:46:45Z.
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
export const refreshStamp = "Oct 09 ~07:46 PDT";
export const refreshDateLong = "October 09, 2026";
// UTC snapshot instant for this refresh
export const snapshotUtc = "2026-10-09T14:46:45Z";
export const windowUtc = "2026-10-09T14:46:45Z";

export const doors: DoorRecord[] = [
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez, ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5090739", "TASK-5389467"], duration: "352d 18h 25m", anomaly: true },
  { door: "DOCK51", status: "Occupied", assignee: "ARNULFO MUNGUIA, DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5381268", "TASK-5389973"], duration: "9d 16h 20m", anomaly: false },
  { door: "DOCK52", status: "Occupied", assignee: "ARNULFO MUNGUIA, JULIO CESAR ALVARADO", customer: "GURUNANDA, LLC, CMPC USA (Cut Paper and Rolls)", taskIds: ["TASK-5389880", "TASK-5389140"], duration: "17h 40m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "ARNULFO MUNGUIA, RUFINO MUNGUIA, EDUARDO MEJIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5382457", "TASK-5389422", "TASK-5389637", "TASK-5390119"], duration: "8d 15h 58m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5338695", "TASK-5382462", "TASK-5389875"], duration: "62d 15h 17m", anomaly: true },
  { door: "DOCK55", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK56", status: "Occupied", assignee: "ARNULFO MUNGUIA, EDUARDO MEJIA, JULIO CESAR ALVARADO", customer: "KARAKA, LLC, GURUNANDA, LLC, CMPC USA (Cut Paper and Rolls)", taskIds: ["TASK-5389635", "TASK-5390124", "TASK-5389143"], duration: "20h 37m", anomaly: false },
  { door: "DOCK57", status: "Occupied", assignee: "PEDRO AVILA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5390129"], duration: "11h 24m", anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5390038"], duration: "13h 17m", anomaly: false },
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks (19 open tasks at
// the 2026-10-09T14:46:45Z snapshot: 12 LOAD + 7 RECEIVE on 9 doors, 9 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 9 },
  { name: "EDUARDO MEJIA", taskCount: 2 },
  { name: "JULIO CESAR ALVARADO", taskCount: 2 },
  { name: "PEDRO AVILA", taskCount: 1 },
  { name: "DANIEL BELTRAN", taskCount: 1 },
  { name: "DANIELA GONZALEZ", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "Jorge Antonio Franco", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// RECOMPUTED this refresh by full row-level rescan: 3,993 closed transactions rolled up by display
// name across 83 distinct names (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED).
export const allTimeClosedTotal = 3993;
export const allTimeDistinctAssignees = 83;
export const allTimeLastRecomputed = "Oct 09 ~07:46 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "DANIEL BELTRAN", taskCount: 1034 },
  { name: "ARNULFO MUNGUIA", taskCount: 1014 },
  { name: "DANIELA GONZALEZ", taskCount: 427 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "Renato Rosales Garcia", taskCount: 151 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "Fatima Ponce", taskCount: 125 },
  { name: "JULIO CESAR ALVARADO", taskCount: 113 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA -> Arnulfo" all-time at Bay-4 doors — RECOMPUTED this refresh (uid 89, customerId = ORG-655875):
// 959 LOAD + 2 RECEIVE = 961.
// Caveat: other employees also carry this display name on different ids; the headline uses uid 89 only,
// which is the id present on the Bay-4 task rows for this name.
export const guruArnulfoAllTimeTotal = 961;
export const guruArnulfoAllTimeLoad = 959;
export const guruArnulfoAllTimeReceive = 2;

// Mix: 12 LOAD (outbound) + 7 RECEIVE (inbound) = 19 open tasks at Bay 4 doors.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 12, total: 19 },
  { label: "Inbound", count: 7, total: 19 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 12, total: 19 },
  { label: "Inbound", count: 7, total: 19 },
];

// Schedule: facility-wide appointment adherence for the current facility-local day (2026-10-09, Friday).
// Binding filters verified: loads = appointmentTimePeriod (2-element BETWEEN), receipts =
// appointmentTimeFrom/To. The 2026-10-09 window returns 107 loads / 33 receipts (operating day).
export const scheduleAvailable = true;
export const scheduleUnavailableReason =
  "Reported — 2026-10-09 (Friday) is an operating day (107 loads / 33 receipts scheduled)";
export const scheduledInboundOrders = 33;
export const scheduledOutboundOrders = 107;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 1;
export const pctScheduledInboundReceived = (0 / 33) * 100; // 0.0% — 0 of 33 receipts received (today)
export const pctScheduledOutboundLoaded = (1 / 107) * 100; // 0.9% — 1 of 107 loads loaded/shipped (today)

// Live status composition of the 2026-10-09 scheduled day.
export const scheduleLoadStatus: Record<string, number> = { NEW: 101, WINDOW_CHECKIN_DONE: 3, LOADING: 2, SHIPPED: 1 };
export const scheduleReceiptStatus: Record<string, number> = { IMPORTED: 22, OPEN: 11 };

// Facility-wide open population swept to isolate the Bay-4 subset (fresh this refresh).
export const facilityOpenLoad = 45;
export const facilityOpenReceive = 84;
export const bay4DockIdMap: Record<string, string> = { "DOCK50": "570", "DOCK51": "554", "DOCK52": "556", "DOCK53": "552", "DOCK54": "564", "DOCK55": "560", "DOCK56": "575", "DOCK57": "563", "DOCK58": "572", "DOCK59": "571", "DOCK60": "565", "DOCK61": "567", "DOCK62": "566", "DOCK63": "568", "DOCK64": "559", "DOCK65": "573", "DOCK66": "576", "DOCK67": "577", "DOCK68": "574", "DOCK69": "578", "DOCK70": "579", "DOCK71": "580", "DOCK72": "587" };

// Customer mix of the open Bay-4 population this snapshot.
export const openCustomerMix: AssigneeSummary[] = [
  { name: "GURUNANDA, LLC", taskCount: 16 },
  { name: "CMPC USA (Cut Paper and Rolls)", taskCount: 2 },
  { name: "KARAKA, LLC", taskCount: 1 },
];
export const openStatusCounts: AssigneeSummary[] = [
  { name: "IN_PROGRESS", taskCount: 16 },
  { name: "NEW", taskCount: 3 },
];

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (2026-10-09T14:46:45Z snapshot)
// 19 open tasks: 12 LOAD (outbound) + 7 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (352d 18h 25m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5389467", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (22h 38m)", assignee: "ARNULFO MUNGUIA", door: "DOCK50" },
  { taskId: "TASK-5381268", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (9d 16h 20m)", assignee: "ARNULFO MUNGUIA", door: "DOCK51" },
  { taskId: "TASK-5389973", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (16h 56m)", assignee: "DANIEL BELTRAN", door: "DOCK51" },
  { taskId: "TASK-5389140", dns: "RECEIVE NEW", customer: "CMPC USA (Cut Paper and Rolls)", pieces: "NEW — not started", assignee: "JULIO CESAR ALVARADO", door: "DOCK52" },
  { taskId: "TASK-5389880", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (17h 40m)", assignee: "ARNULFO MUNGUIA", door: "DOCK52" },
  { taskId: "TASK-5382457", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (8d 15h 58m)", assignee: "ARNULFO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5389422", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (23h 9m)", assignee: "ARNULFO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5389637", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (20h 52m)", assignee: "RUFINO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5390119", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (11h 30m)", assignee: "EDUARDO MEJIA", door: "DOCK53" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (62d 15h 17m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5382462", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (7d 22h 23m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5389875", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (18h 6m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5389143", dns: "RECEIVE NEW", customer: "CMPC USA (Cut Paper and Rolls)", pieces: "NEW — not started", assignee: "JULIO CESAR ALVARADO", door: "DOCK56" },
  { taskId: "TASK-5389635", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (20h 37m)", assignee: "ARNULFO MUNGUIA", door: "DOCK56" },
  { taskId: "TASK-5390124", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (11h 38m)", assignee: "EDUARDO MEJIA", door: "DOCK56" },
  { taskId: "TASK-5390129", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (11h 24m)", assignee: "PEDRO AVILA", door: "DOCK57" },
  { taskId: "TASK-5390038", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (13h 17m)", assignee: "DANIELA GONZALEZ", door: "DOCK61" },
  { taskId: "TASK-5381972", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "Jorge Antonio Franco", door: "DOCK69" },
];

// ── Assigned Activity — Bay 4 (GURUNANDA / Live Out & In → Arnulfo) section ──
// Arnulfo Munguia (assigneeUserId 89) open tasks at Bay-4 doors this snapshot (9 tasks: 8 LOAD + 1 RECEIVE).
export const arnulfoOpenTasks: { door: string; taskId: string; kind: string; status: string; customer: string; note: string }[] = [
  { door: "DOCK50", taskId: "TASK-5389467", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 22h 38m" },
  { door: "DOCK51", taskId: "TASK-5381268", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 9d 16h 20m" },
  { door: "DOCK52", taskId: "TASK-5389880", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 17h 40m" },
  { door: "DOCK53", taskId: "TASK-5382457", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 8d 15h 58m" },
  { door: "DOCK53", taskId: "TASK-5389422", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 23h 9m" },
  { door: "DOCK54", taskId: "TASK-5338695", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "STALE — 62d 15h 17m (endTime set 2026-08-10)" },
  { door: "DOCK54", taskId: "TASK-5382462", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 7d 22h 23m" },
  { door: "DOCK54", taskId: "TASK-5389875", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 18h 6m" },
  { door: "DOCK56", taskId: "TASK-5389635", kind: "RECEIVE", status: "IN_PROGRESS", customer: "KARAKA, LLC", note: "IN_PROGRESS — 20h 37m" },
];

export const arnulfoOpenCount = 9;
export const arnulfoOpenLoad = 8;
export const arnulfoOpenReceive = 1;
export const arnulfoOpenGuru = 8;
export const arnulfoOpenKaraka = 1;
export const arnulfoOpenGuruLoad = 8;
export const arnulfoOpenGuruReceive = 0;
