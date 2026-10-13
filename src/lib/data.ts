/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-10-13 ~10:18 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (facility-wide sweep, statuses NEW/IN_PROGRESS/EXCEPTION, totalCount = 46; Bay-4 subset on dockId)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (facility-wide sweep, same statuses, totalCount = 88; Bay-4 subset on dockId)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod BETWEEN window, totalCount = 88)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window, totalCount = 25)
 *     - all-time block — RECOMPUTED this refresh by full row-level rescan (23 doors × 2 task types)
 *
 * SNAPSHOT INSTANT: 2026-10-13T17:18:36Z (2026-10-13 ~10:18 PDT)
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * SCHEDULE NOTE: the current facility-local day is 2026-10-13 (Tuesday) — an OPERATING day: the day
 *   window carries 88 load appointments and 25 inbound receipt appointments. Both adherence figures have a
 *   denominator this day: % Scheduled Inbounds Received = 8.0% (2 of 25 receipts received) and
 *   % Scheduled Outbounds Loaded = 19.3% (17 of 88 loads loaded/shipped).
 *
 * ALL-TIME NOTE: the all-time block was RECOMPUTED this refresh by a full row-level rescan of every
 *   Bay-4 door (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED). The closed population grew from the
 *   prior 2026-10-12 ~12:52 PDT rescan (4,017 closed transactions; 2,950 LOAD; 1,067 RECEIVE) to 4,037
 *   closed transactions (2,963 LOAD; 1,074 RECEIVE) — fresh, not carried forward.
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
 *   task id; the 23-door roll-up reconciles to 2,963 LOAD + 1,074 RECEIVE = 4,037 closed Bay-4 transactions.
 *
 *   INTEGRITY: every live value below is a count returned by WISE/WMS this refresh. No rows were fabricated;
 *   nothing was carried forward where a fresh read was possible.
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant, so durations
 *   are aged startTime -> 2026-10-13T17:18:36Z.
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
export const refreshStamp = "Oct 13 ~10:18 PDT";
export const refreshDateLong = "October 13, 2026";
// UTC snapshot instant for this refresh
export const snapshotUtc = "2026-10-13T17:18:36Z";
export const windowUtc = "2026-10-13T17:18:36Z";

export const doors: DoorRecord[] = [
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez, ARNULFO MUNGUIA", customer: "GURUNANDA, LLC, KARAKA, LLC", taskIds: ["TASK-5090739", "TASK-5391985"], duration: "356d 20h 57m", anomaly: true },
  { door: "DOCK51", status: "Occupied", assignee: "ENRIQUE HIGAREDA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392392"], duration: "20h 2m", anomaly: false },
  { door: "DOCK52", status: "Occupied", assignee: "JESUS ESPINOZA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392751"], duration: "13h 13m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "RUFINO MUNGUIA, EDUARDO MEJIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5389637", "TASK-5392750"], duration: "4d 23h 24m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA, DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5338695", "TASK-5392484"], duration: "66d 17h 49m", anomaly: true },
  { door: "DOCK55", status: "Reserved", assignee: "Nanci Viviana Rosas", customer: "KARAKA, LLC", taskIds: ["TASK-5392591"], duration: null, anomaly: false },
  { door: "DOCK56", status: "Occupied", assignee: "JESUS ESPINOZA, DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392752", "TASK-5393135"], duration: "12h 32m", anomaly: false },
  { door: "DOCK57", status: "Occupied", assignee: "EDUARDO MEJIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392753"], duration: "12h 30m", anomaly: false },
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
  { door: "DOCK68", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392303"], duration: "13h 23m", anomaly: false },
  { door: "DOCK69", status: "Occupied", assignee: "ASTRID NOEMI AGUILAR, Jorge Antonio Franco", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392733", "TASK-5381972"], duration: "16h 13m", anomaly: false },
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
// the 2026-10-13T17:18:36Z snapshot: 9 LOAD + 6 RECEIVE on 10 doors, 11 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "DANIEL BELTRAN", taskCount: 2 },
  { name: "EDUARDO MEJIA", taskCount: 2 },
  { name: "JESUS ESPINOZA", taskCount: 2 },
  { name: "ARNULFO MUNGUIA", taskCount: 2 },
  { name: "Nanci Viviana Rosas", taskCount: 1 },
  { name: "ENRIQUE HIGAREDA", taskCount: 1 },
  { name: "ASTRID NOEMI AGUILAR", taskCount: 1 },
  { name: "DANIELA GONZALEZ", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "Jorge Antonio Franco", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// RECOMPUTED this refresh by full row-level rescan: 4,037 closed transactions rolled up by display
// name across 84 distinct names (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED).
export const allTimeClosedTotal = 4037;
export const allTimeDistinctAssignees = 84;
export const allTimeLastRecomputed = "Oct 13 ~10:18 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "DANIEL BELTRAN", taskCount: 1046 },
  { name: "ARNULFO MUNGUIA", taskCount: 1033 },
  { name: "DANIELA GONZALEZ", taskCount: 429 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 151 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "Fatima Ponce", taskCount: 129 },
  { name: "JULIO CESAR ALVARADO", taskCount: 113 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA -> Arnulfo" all-time at Bay-4 doors — RECOMPUTED this refresh (uid 89, customerId = ORG-655875):
// 975 LOAD + 2 RECEIVE = 977.
// Caveat: other employees also carry this display name on different ids; the headline uses uid 89 only,
// which is the id present on the Bay-4 task rows for this name.
export const guruArnulfoAllTimeTotal = 977;
export const guruArnulfoAllTimeLoad = 975;
export const guruArnulfoAllTimeReceive = 2;

// Mix: 9 LOAD (outbound) + 6 RECEIVE (inbound) = 15 open tasks at Bay 4 doors.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 9, total: 15 },
  { label: "Inbound", count: 6, total: 15 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 9, total: 15 },
  { label: "Inbound", count: 6, total: 15 },
];

// Schedule: facility-wide appointment adherence for the current facility-local day (2026-10-13, Tuesday).
// Binding filters verified: loads = appointmentTimePeriod (2-element BETWEEN), receipts =
// appointmentTimeFrom/To. The 2026-10-13 window returns 88 loads / 25 receipts (operating day).
export const scheduleAvailable = true;
export const scheduleUnavailableReason =
  "Reported — 2026-10-13 (Tuesday) operating day: 88 loads / 25 receipts scheduled";
export const scheduledInboundOrders = 25;
export const scheduledOutboundOrders = 88;
export const scheduledInboundReceived = 2;
export const scheduledOutboundLoaded = 17;
export const pctScheduledInboundReceived = 8; // 2/25 — receipts received in the 2026-10-13 window
export const pctScheduledOutboundLoaded = 19.318181818181817; // 17/88 — loads loaded/shipped in the window

// Live status composition of the 2026-10-13 scheduled day.
export const scheduleLoadStatus: Record<string, number> = { NEW: 52, WINDOW_CHECKIN_DONE: 15, LOADING: 4, LOADED: 4, SHIPPED: 13 };
export const scheduleReceiptStatus: Record<string, number> = { IMPORTED: 9, OPEN: 9, IN_PROGRESS: 4, EXCEPTION: 1, CLOSED: 2 };

// Facility-wide open population swept to isolate the Bay-4 subset (fresh this refresh).
export const facilityOpenLoad = 46;
export const facilityOpenReceive = 88;
export const bay4DockIdMap: Record<string, string> = { "DOCK50": "570", "DOCK51": "554", "DOCK52": "556", "DOCK53": "552", "DOCK54": "564", "DOCK55": "560", "DOCK56": "575", "DOCK57": "563", "DOCK58": "572", "DOCK59": "571", "DOCK60": "565", "DOCK61": "567", "DOCK62": "566", "DOCK63": "568", "DOCK64": "559", "DOCK65": "573", "DOCK66": "576", "DOCK67": "577", "DOCK68": "574", "DOCK69": "578", "DOCK70": "579", "DOCK71": "580", "DOCK72": "587" };

// Customer mix of the open Bay-4 population this snapshot.
export const openCustomerMix: AssigneeSummary[] = [
  { name: "GURUNANDA, LLC", taskCount: 13 },
  { name: "KARAKA, LLC", taskCount: 2 },
];
export const openStatusCounts: AssigneeSummary[] = [
  { name: "IN_PROGRESS", taskCount: 12 },
  { name: "NEW", taskCount: 3 },
];

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (2026-10-13T17:18:36Z snapshot)
// 15 open tasks: 9 LOAD (outbound) + 6 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5389637", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (4d 23h 24m)", assignee: "RUFINO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5392750", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (13h 16m)", assignee: "EDUARDO MEJIA", door: "DOCK53" },
  { taskId: "TASK-5392392", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (20h 2m)", assignee: "ENRIQUE HIGAREDA", door: "DOCK51" },
  { taskId: "TASK-5392751", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (13h 13m)", assignee: "JESUS ESPINOZA", door: "DOCK52" },
  { taskId: "TASK-5392591", dns: "LOAD NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "Nanci Viviana Rosas", door: "DOCK55" },
  { taskId: "TASK-5392753", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (12h 30m)", assignee: "EDUARDO MEJIA", door: "DOCK57" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (66d 17h 49m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5392484", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (19h 10m)", assignee: "DANIEL BELTRAN", door: "DOCK54" },
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (356d 20h 57m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5391985", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (22h 59m)", assignee: "ARNULFO MUNGUIA", door: "DOCK50" },
  { taskId: "TASK-5392303", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (13h 23m)", assignee: "DANIELA GONZALEZ", door: "DOCK68" },
  { taskId: "TASK-5392752", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (12h 32m)", assignee: "JESUS ESPINOZA", door: "DOCK56" },
  { taskId: "TASK-5393135", dns: "LOAD NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "DANIEL BELTRAN", door: "DOCK56" },
  { taskId: "TASK-5381972", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "Jorge Antonio Franco", door: "DOCK69" },
  { taskId: "TASK-5392733", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (16h 13m)", assignee: "ASTRID NOEMI AGUILAR", door: "DOCK69" },
];

// ── Assigned Activity — Bay 4 (GURUNANDA / Live Out & In → Arnulfo) section ──
// Arnulfo Munguia (assigneeUserId 89) open tasks at Bay-4 doors this snapshot (2 tasks: 1 LOAD + 1 RECEIVE).
export const arnulfoOpenTasks: { door: string; taskId: string; kind: string; status: string; customer: string; note: string }[] = [
  { door: "DOCK54", taskId: "TASK-5338695", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "STALE — 66d 17h 49m (endTime set 2026-08-10)" },
  { door: "DOCK50", taskId: "TASK-5391985", kind: "RECEIVE", status: "IN_PROGRESS", customer: "KARAKA, LLC", note: "IN_PROGRESS — 22h 59m" },
];

export const arnulfoOpenCount = 2;
export const arnulfoOpenLoad = 1;
export const arnulfoOpenReceive = 1;
export const arnulfoOpenGuru = 1;
export const arnulfoOpenKaraka = 1;
export const arnulfoOpenGuruLoad = 1;
export const arnulfoOpenGuruReceive = 0;
