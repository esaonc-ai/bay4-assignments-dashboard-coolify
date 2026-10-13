/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed Oct 13 ~12:23 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (facility-wide sweep, statuses NEW/IN_PROGRESS/EXCEPTION, totalCount = 41; Bay-4 subset on dockId)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (facility-wide sweep, same statuses, totalCount = 87; Bay-4 subset on dockId)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod BETWEEN window, totalCount = 94)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window, totalCount = 28)
 *     - all-time block — RECOMPUTED this refresh by full row-level rescan (23 doors × 2 task types)
 *
 * SNAPSHOT INSTANT: 2026-10-13T19:23:47Z (Oct 13 ~12:23 PDT)
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * SCHEDULE NOTE: the current facility-local day is 2026-10-13 (Tuesday) — an OPERATING day: the day
 *   window carries 94 load appointments and 28 inbound receipt appointments. Both adherence figures have a
 *   denominator this day: % Scheduled Inbounds Received = 14.3% (4 of 28 receipts received) and
 *   % Scheduled Outbounds Loaded = 33.0% (31 of 94 loads loaded/shipped).
 *
 * ALL-TIME NOTE: the all-time block was RECOMPUTED this refresh by a full row-level rescan of every
 *   Bay-4 door (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED): 2,968 LOAD + 1,074 RECEIVE =
 *   4,042 closed Bay-4 transactions across 84 distinct display names — fresh, not carried forward.
 *
 * INTEGRITY: every live value below is a count returned by WISE/WMS this refresh. No rows were fabricated;
 *   nothing was carried forward where a fresh read was possible.
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
export const refreshStamp = "Oct 13 ~12:23 PDT";
export const refreshDateLong = "October 13, 2026";
// UTC snapshot instant for this refresh
export const snapshotUtc = "2026-10-13T19:23:47Z";
export const windowUtc = "2026-10-13T19:23:47Z";

export const doors: DoorRecord[] = [
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez, ARNULFO MUNGUIA", customer: "GURUNANDA, LLC, KARAKA, LLC", taskIds: ["TASK-5090739", "TASK-5391985"], duration: "356d 23h 2m", anomaly: true },
  { door: "DOCK51", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK52", status: "Occupied", assignee: "JESUS ESPINOZA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392751"], duration: "15h 18m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "RUFINO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5389637"], duration: "5d 1h 29m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5338695"], duration: "66d 19h 54m", anomaly: true },
  { door: "DOCK55", status: "Reserved", assignee: "ARNULFO MUNGUIA", customer: "KARAKA, LLC", taskIds: ["TASK-5393281"], duration: null, anomaly: false },
  { door: "DOCK56", status: "Occupied", assignee: "JESUS ESPINOZA, DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392752", "TASK-5393377"], duration: "14h 37m", anomaly: false },
  { door: "DOCK57", status: "Occupied", assignee: "EDUARDO MEJIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392753"], duration: "14h 35m", anomaly: false },
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
  { door: "DOCK68", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392303"], duration: "15h 28m", anomaly: false },
  { door: "DOCK69", status: "Occupied", assignee: "ASTRID NOEMI AGUILAR, Jorge Antonio Franco", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392733", "TASK-5381972"], duration: "18h 19m", anomaly: false },
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks at the
// 2026-10-13T19:23:47Z snapshot (5 LOAD + 7 RECEIVE on 9 doors, 9 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 3 },
  { name: "JESUS ESPINOZA", taskCount: 2 },
  { name: "DANIEL BELTRAN", taskCount: 1 },
  { name: "EDUARDO MEJIA", taskCount: 1 },
  { name: "ASTRID NOEMI AGUILAR", taskCount: 1 },
  { name: "DANIELA GONZALEZ", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "Jorge Antonio Franco", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// RECOMPUTED this refresh by full row-level rescan: 4,042 closed transactions rolled up by display
// name across 84 distinct names (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED).
export const allTimeClosedTotal = 4042;
export const allTimeDistinctAssignees = 84;
export const allTimeLastRecomputed = "Oct 13 ~12:23 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "DANIEL BELTRAN", taskCount: 1048 },
  { name: "ARNULFO MUNGUIA", taskCount: 1036 },
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
// 978 LOAD + 2 RECEIVE = 980.
// Caveat: other employees also carry this display name on different ids; the headline uses uid 89 only,
// which is the id present on the Bay-4 task rows for this name.
export const guruArnulfoAllTimeTotal = 980;
export const guruArnulfoAllTimeLoad = 978;
export const guruArnulfoAllTimeReceive = 2;

// Mix: 5 LOAD (outbound) + 7 RECEIVE (inbound) = 12 open tasks at Bay 4 doors.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 12 },
  { label: "Inbound", count: 7, total: 12 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 12 },
  { label: "Inbound", count: 7, total: 12 },
];

// Schedule: facility-wide appointment adherence for the current facility-local day (2026-10-13, Tuesday).
// Binding filters verified: loads = appointmentTimePeriod (2-element BETWEEN), receipts =
// appointmentTimeFrom/To. The window returns 94 loads / 28 receipts (operating day).
export const scheduleAvailable = true;
export const scheduleUnavailableReason = "Reported — 2026-10-13 (Tuesday) operating day: 94 loads / 28 receipts scheduled";
export const scheduledInboundOrders = 28;
export const scheduledOutboundOrders = 94;
export const scheduledInboundReceived = 4;
export const scheduledOutboundLoaded = 31;
export const pctScheduledInboundReceived = 14.285714285714285; // 4/28 — receipts received in the 2026-10-13 window
export const pctScheduledOutboundLoaded = 32.97872340425532; // 31/94 — loads loaded/shipped in the window

// Live status composition of the 2026-10-13 scheduled day.
export const scheduleLoadStatus: Record<string, number> = {"NEW": 42, "LOADING": 9, "SHIPPED": 25, "LOADED": 6, "WINDOW_CHECKIN_DONE": 12};
export const scheduleReceiptStatus: Record<string, number> = {"IMPORTED": 9, "OPEN": 7, "IN_PROGRESS": 7, "EXCEPTION": 1, "CLOSED": 4};

// Facility-wide open population swept to isolate the Bay-4 subset (fresh this refresh).
export const facilityOpenLoad = 41;
export const facilityOpenReceive = 87;
export const bay4DockIdMap: Record<string, string> = {"DOCK50": "570", "DOCK51": "554", "DOCK52": "556", "DOCK53": "552", "DOCK54": "564", "DOCK55": "560", "DOCK56": "575", "DOCK57": "563", "DOCK58": "572", "DOCK59": "571", "DOCK60": "565", "DOCK61": "567", "DOCK62": "566", "DOCK63": "568", "DOCK64": "559", "DOCK65": "573", "DOCK66": "576", "DOCK67": "577", "DOCK68": "574", "DOCK69": "578", "DOCK70": "579", "DOCK71": "580", "DOCK72": "587"};

// Customer mix of the open Bay-4 population this snapshot.
export const openCustomerMix: AssigneeSummary[] = [
  { name: "GURUNANDA, LLC", taskCount: 10 },
  { name: "KARAKA, LLC", taskCount: 2 },
];
export const openStatusCounts: AssigneeSummary[] = [
  { name: "IN_PROGRESS", taskCount: 10 },
  { name: "NEW", taskCount: 2 },
];

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (2026-10-13T19:23:47Z snapshot)
// 12 open tasks: 5 LOAD (outbound) + 7 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5389637", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (5d 1h 29m)", assignee: "RUFINO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5392751", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (15h 18m)", assignee: "JESUS ESPINOZA", door: "DOCK52" },
  { taskId: "TASK-5393281", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5392753", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (14h 35m)", assignee: "EDUARDO MEJIA", door: "DOCK57" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (66d 19h 54m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (356d 23h 2m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5391985", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (1d 1h 4m)", assignee: "ARNULFO MUNGUIA", door: "DOCK50" },
  { taskId: "TASK-5392303", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (15h 28m)", assignee: "DANIELA GONZALEZ", door: "DOCK68" },
  { taskId: "TASK-5392752", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (14h 37m)", assignee: "JESUS ESPINOZA", door: "DOCK56" },
  { taskId: "TASK-5393377", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0h 8m)", assignee: "DANIEL BELTRAN", door: "DOCK56" },
  { taskId: "TASK-5381972", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "Jorge Antonio Franco", door: "DOCK69" },
  { taskId: "TASK-5392733", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (18h 19m)", assignee: "ASTRID NOEMI AGUILAR", door: "DOCK69" },
];

// ── Assigned Activity — Bay 4 (GURUNANDA / Live Out & In → Arnulfo) section ──
// Arnulfo Munguia (assigneeUserId 89) open tasks at Bay-4 doors this snapshot (3 tasks: 1 LOAD + 2 RECEIVE).
export const arnulfoOpenTasks: { door: string; taskId: string; kind: string; status: string; customer: string; note: string }[] = [
  { door: "DOCK55", taskId: "TASK-5393281", kind: "RECEIVE", status: "NEW", customer: "KARAKA, LLC", note: "NEW — not started" },
  { door: "DOCK54", taskId: "TASK-5338695", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "STALE — 66d 19h 54m (endTime set 2026-08-10)" },
  { door: "DOCK50", taskId: "TASK-5391985", kind: "RECEIVE", status: "IN_PROGRESS", customer: "KARAKA, LLC", note: "IN_PROGRESS — 1d 1h 4m" },
];

export const arnulfoOpenCount = 3;
export const arnulfoOpenLoad = 1;
export const arnulfoOpenReceive = 2;
export const arnulfoOpenGuru = 1;
export const arnulfoOpenKaraka = 2;
export const arnulfoOpenGuruLoad = 1;
export const arnulfoOpenGuruReceive = 0;
