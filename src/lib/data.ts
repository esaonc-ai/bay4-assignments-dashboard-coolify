/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed Oct 13 ~18:01 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (facility-wide sweep, statuses NEW/IN_PROGRESS/EXCEPTION, totalCount = 40; Bay-4 subset on dockId)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (facility-wide sweep, same statuses, totalCount = 83; Bay-4 subset on dockId)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod BETWEEN window, totalCount = 93)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window, totalCount = 28)
 *     - all-time block — RECOMPUTED this refresh by full row-level rescan (23 doors × 2 task types)
 *
 * SNAPSHOT INSTANT: 2026-10-14T01:01:42Z (Oct 13 ~18:01 PDT)
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * SCHEDULE NOTE: the current facility-local day is 2026-10-13 (Tuesday) — an OPERATING day: the day
 *   window carries 93 load appointments and 28 inbound receipt appointments. Both adherence figures have a
 *   denominator this day: % Scheduled Inbounds Received = 35.7% (10 of 28 receipts received) and
 *   % Scheduled Outbounds Loaded = 86.0% (80 of 93 loads loaded/shipped).
 *
 * ALL-TIME NOTE: the all-time block was RECOMPUTED this refresh by a full row-level rescan of every
 *   Bay-4 door (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED): 2,970 LOAD + 1,076 RECEIVE =
 *   4,046 closed Bay-4 transactions across 84 distinct display names — fresh, not carried forward.
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
export const refreshStamp = "Oct 13 ~18:01 PDT";
export const refreshDateLong = "October 13, 2026";
// UTC snapshot instant for this refresh
export const snapshotUtc = "2026-10-14T01:01:42Z";
export const windowUtc = "2026-10-14T01:01:42Z";

export const doors: DoorRecord[] = [
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez, ARNULFO MUNGUIA", customer: "GURUNANDA, LLC, KARAKA, LLC", taskIds: ["TASK-5090739", "TASK-5391985", "TASK-5393541"], duration: "357d 4h 40m", anomaly: true },
  { door: "DOCK51", status: "Occupied", assignee: "DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5393782"], duration: "2h 27m", anomaly: false },
  { door: "DOCK52", status: "Occupied", assignee: "JESUS ESPINOZA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392751"], duration: "20h 56m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "RUFINO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5389637"], duration: "5d 7h 7m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA, EDUARDO MEJIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5338695", "TASK-5393866"], duration: "67d 1h 32m", anomaly: true },
  { door: "DOCK55", status: "Reserved", assignee: "ARNULFO MUNGUIA", customer: "KARAKA, LLC", taskIds: ["TASK-5393281"], duration: null, anomaly: false },
  { door: "DOCK56", status: "Occupied", assignee: "JESUS ESPINOZA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392752"], duration: "20h 15m", anomaly: false },
  { door: "DOCK57", status: "Occupied", assignee: "EDUARDO MEJIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5392753"], duration: "20h 13m", anomaly: false },
  { door: "DOCK58", status: "Reserved", assignee: "EDUARDO MEJIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5393812"], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Reserved", assignee: "EDUARDO MEJIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5393915"], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK62", status: "Occupied", assignee: "JORGE ARMANDO DUENAS", customer: "GURUNANDA, LLC", taskIds: ["TASK-5393820"], duration: "2h 0m", anomaly: false },
  { door: "DOCK63", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK64", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK65", status: "Reserved", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5393821"], duration: null, anomaly: false },
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks at the
// 2026-10-14T01:01:42Z snapshot (9 LOAD + 7 RECEIVE on 13 doors, 9 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "EDUARDO MEJIA", taskCount: 4 },
  { name: "ARNULFO MUNGUIA", taskCount: 4 },
  { name: "JESUS ESPINOZA", taskCount: 2 },
  { name: "DANIEL BELTRAN", taskCount: 1 },
  { name: "DANIELA GONZALEZ", taskCount: 1 },
  { name: "JORGE ARMANDO DUENAS", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "Jorge Antonio Franco", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// RECOMPUTED this refresh by full row-level rescan: 4,046 closed transactions rolled up by display
// name across 84 distinct names (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED).
export const allTimeClosedTotal = 4046;
export const allTimeDistinctAssignees = 84;
export const allTimeLastRecomputed = "Oct 13 ~18:01 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "DANIEL BELTRAN", taskCount: 1050 },
  { name: "ARNULFO MUNGUIA", taskCount: 1036 },
  { name: "DANIELA GONZALEZ", taskCount: 429 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 151 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "Fatima Ponce", taskCount: 131 },
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

// Mix: 9 LOAD (outbound) + 7 RECEIVE (inbound) = 16 open tasks at Bay 4 doors.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 9, total: 16 },
  { label: "Inbound", count: 7, total: 16 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 9, total: 16 },
  { label: "Inbound", count: 7, total: 16 },
];

// Schedule: facility-wide appointment adherence for the current facility-local day (2026-10-13, Tuesday).
// Binding filters verified: loads = appointmentTimePeriod (2-element BETWEEN), receipts =
// appointmentTimeFrom/To. The window returns 93 loads / 28 receipts (operating day).
export const scheduleAvailable = true;
export const scheduleUnavailableReason = "Reported — 2026-10-13 (Tuesday) operating day: 93 loads / 28 receipts scheduled";
export const scheduledInboundOrders = 28;
export const scheduledOutboundOrders = 93;
export const scheduledInboundReceived = 10;
export const scheduledOutboundLoaded = 80;
export const pctScheduledInboundReceived = 35.714285714285715; // 10/28 — receipts received in the 2026-10-13 window
export const pctScheduledOutboundLoaded = 86.02150537634408; // 80/93 — loads loaded/shipped in the window

// Live status composition of the 2026-10-13 scheduled day.
export const scheduleLoadStatus: Record<string, number> = {"SHIPPED": 73, "NEW": 12, "LOADING": 1, "LOADED": 7};
export const scheduleReceiptStatus: Record<string, number> = {"IN_PROGRESS": 8, "IMPORTED": 5, "CLOSED": 8, "EXCEPTION": 2, "OPEN": 4, "REOPENED": 1};

// Facility-wide open population swept to isolate the Bay-4 subset (fresh this refresh).
export const facilityOpenLoad = 40;
export const facilityOpenReceive = 83;
export const bay4DockIdMap: Record<string, string> = {"DOCK50": "570", "DOCK51": "554", "DOCK52": "556", "DOCK53": "552", "DOCK54": "564", "DOCK55": "560", "DOCK56": "575", "DOCK57": "563", "DOCK58": "572", "DOCK59": "571", "DOCK60": "565", "DOCK61": "567", "DOCK62": "566", "DOCK63": "568", "DOCK64": "559", "DOCK65": "573", "DOCK66": "576", "DOCK67": "577", "DOCK68": "574", "DOCK69": "578", "DOCK70": "579", "DOCK71": "580", "DOCK72": "587"};

// Customer mix of the open Bay-4 population this snapshot.
export const openCustomerMix: AssigneeSummary[] = [
  { name: "GURUNANDA, LLC", taskCount: 14 },
  { name: "KARAKA, LLC", taskCount: 2 },
];
export const openStatusCounts: AssigneeSummary[] = [
  { name: "IN_PROGRESS", taskCount: 11 },
  { name: "NEW", taskCount: 5 },
];

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (2026-10-14T01:01:42Z snapshot)
// 16 open tasks: 9 LOAD (outbound) + 7 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5389637", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (5d 7h 7m)", assignee: "RUFINO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5393782", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (2h 27m)", assignee: "DANIEL BELTRAN", door: "DOCK51" },
  { taskId: "TASK-5392751", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (20h 56m)", assignee: "JESUS ESPINOZA", door: "DOCK52" },
  { taskId: "TASK-5393281", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5392753", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (20h 13m)", assignee: "EDUARDO MEJIA", door: "DOCK57" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (67d 1h 32m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5393866", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1h 21m)", assignee: "EDUARDO MEJIA", door: "DOCK54" },
  { taskId: "TASK-5393915", dns: "LOAD NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "EDUARDO MEJIA", door: "DOCK60" },
  { taskId: "TASK-5393820", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (2h 0m)", assignee: "JORGE ARMANDO DUENAS", door: "DOCK62" },
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (357d 4h 40m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5391985", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (1d 6h 42m)", assignee: "ARNULFO MUNGUIA", door: "DOCK50" },
  { taskId: "TASK-5393541", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (4h 46m)", assignee: "ARNULFO MUNGUIA", door: "DOCK50" },
  { taskId: "TASK-5393812", dns: "LOAD NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "EDUARDO MEJIA", door: "DOCK58" },
  { taskId: "TASK-5393821", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "DANIELA GONZALEZ", door: "DOCK65" },
  { taskId: "TASK-5392752", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (20h 15m)", assignee: "JESUS ESPINOZA", door: "DOCK56" },
  { taskId: "TASK-5381972", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "Jorge Antonio Franco", door: "DOCK69" },
];

// ── Assigned Activity — Bay 4 (GURUNANDA / Live Out & In → Arnulfo) section ──
// Arnulfo Munguia (assigneeUserId 89) open tasks at Bay-4 doors this snapshot (4 tasks: 2 LOAD + 2 RECEIVE).
export const arnulfoOpenTasks: { door: string; taskId: string; kind: string; status: string; customer: string; note: string }[] = [
  { door: "DOCK55", taskId: "TASK-5393281", kind: "RECEIVE", status: "NEW", customer: "KARAKA, LLC", note: "NEW — not started" },
  { door: "DOCK54", taskId: "TASK-5338695", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "STALE — 67d 1h 32m (endTime set 2026-08-10)" },
  { door: "DOCK50", taskId: "TASK-5391985", kind: "RECEIVE", status: "IN_PROGRESS", customer: "KARAKA, LLC", note: "IN_PROGRESS — 1d 6h 42m" },
  { door: "DOCK50", taskId: "TASK-5393541", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 4h 46m" },
];

export const arnulfoOpenCount = 4;
export const arnulfoOpenLoad = 2;
export const arnulfoOpenReceive = 2;
export const arnulfoOpenGuru = 2;
export const arnulfoOpenKaraka = 2;
export const arnulfoOpenGuruLoad = 2;
export const arnulfoOpenGuruReceive = 0;
