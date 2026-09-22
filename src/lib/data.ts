/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-21 ~18:15 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (facility-wide sweep, statuses NEW/IN_PROGRESS/EXCEPTION)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (facility-wide sweep, same statuses)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod BETWEEN window)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window)
 *     - row-level rescan of CLOSED / FORCE_CLOSED load + receive tasks across all 23 doors (all-time block)
 *
 * SNAPSHOT INSTANT: 2026-09-21 18:15 PDT (America/Los_Angeles), Monday.
 * UTC QUERY WINDOW: 2026-09-22T01:14:57Z → 2026-09-22T01:14:57Z.
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * SCHEDULE NOTE: today (2026-09-21) DOES carry appointments — 127 loads and 53 receipts in the
 *   facility-local day window, so both schedule percentages are reported (no longer a zero denominator).
 *
 * FILTER NOTE: on the task-search family the status filter binds as the plural `statuses` (array);
 *   `statusList` is silently IGNORED. The door filter binds ONLY as the singular `dockId`; a plural
 *   `dockIds` (array) is silently IGNORED and a comma-separated `dockId` string is rejected (HTTP 400).
 *   The Bay-4 population was therefore taken from a full facility-wide open sweep and filtered on each
 *   row's `dockId`. 23/23 doors live-verified (totalCount = 23): DOCK50=570, DOCK51=554, DOCK52=556, DOCK53=552, DOCK54=564, DOCK55=560, DOCK56=575, DOCK57=563, DOCK58=572, DOCK59=571, DOCK60=565, DOCK61=567, DOCK62=566, DOCK63=568, DOCK64=559, DOCK65=573, DOCK66=576, DOCK67=577, DOCK68=574, DOCK69=578, DOCK70=579, DOCK71=580, DOCK72=587.
 *
 *   INTEGRITY: every value below is a live count returned by WISE/WMS. No rows were fabricated; nothing
 *   was carried forward where a fresh read was possible.
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant, so
 *   durations are aged startTime → 2026-09-22T01:14:57Z.
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
export const refreshStamp = "Sep 21 ~18:15 PDT";
export const refreshDateLong = "September 21, 2026";
// UTC query window for this snapshot
export const snapshotUtc = "2026-09-22T01:14:57Z";
export const windowUtc = "2026-09-22T01:14:57Z";

export const doors: DoorRecord[] = [
  { door: "DOCK50", status: "Occupied", assignee: "JOSE MORALES / daira gonzalez", customer: "GURUNANDA, LLC / ORG-798965", taskIds: ["TASK-5373019", "TASK-5090739"], duration: "335d 4h 53m", anomaly: true },
  { door: "DOCK51", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5373035"], duration: "0d 4h 52m", anomaly: false },
  { door: "DOCK52", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5372912"], duration: "0d 7h 20m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5373472"], duration: "0d 2h 18m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365421", "TASK-5338695"], duration: "45d 1h 45m", anomaly: true },
  { door: "DOCK61", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5373632"], duration: "0d 0h 2m", anomaly: false },
  { door: "DOCK62", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365814"], duration: "7d 3h 30m", anomaly: false },
  { door: "DOCK72", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5373531"], duration: "0d 0h 13m", anomaly: false },
  { door: "DOCK55", status: "Reserved", assignee: "ARNULFO MUNGUIA / RUFINO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5373122", "TASK-5371830", "TASK-5368665"], duration: null, anomaly: false },
  { door: "DOCK56", status: "Reserved", assignee: "ARNULFO MUNGUIA", customer: "KARAKA, LLC", taskIds: ["TASK-5369120"], duration: null, anomaly: false },
  { door: "DOCK59", status: "Reserved", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5373519"], duration: null, anomaly: false },
  { door: "DOCK64", status: "Reserved", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5369900"], duration: null, anomaly: false },
  { door: "DOCK57", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK63", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK65", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK66", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK67", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK68", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK69", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK70", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK71", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks (16 open tasks at
// the 2026-09-21 ~18:15 PDT snapshot: 6 LOAD + 10 RECEIVE on 12 doors, 6 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 8 },
  { name: "DANIELA GONZALEZ", taskCount: 4 },
  { name: "DANIEL BELTRAN", taskCount: 1 },
  { name: "JOSE MORALES", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// FULLY RECOMPUTED this refresh (2026-09-21 ~18:15 PDT) from a complete row-level rescan of all
// closed load/receive tasks across the 23 doors (2826 LOAD + 1000 RECEIVE = 3,826 closed
// transactions rolled up by display name, 83 distinct names).
export const allTimeClosedTotal = 3826;
export const allTimeDistinctAssignees = 83;
export const allTimeLastRecomputed = "2026-09-21 ~18:15 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "DANIEL BELTRAN", taskCount: 973 },
  { name: "ARNULFO MUNGUIA", taskCount: 972 },
  { name: "DANIELA GONZALEZ", taskCount: 399 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR Alvarado", taskCount: 113 },
  { name: "Fatima Ponce", taskCount: 110 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA → Arnulfo" all-time at Bay-4 doors — RECOMPUTED this refresh from the same full
// row-level rescan (uid 89, customerId OR customerIds=ORG-655875): 923 LOAD + 2 RECEIVE = 925.
// Caveat: other employees also carry this display name on different ids (see Data Notes); the
// headline uses uid 89 only, which is the id present on the Bay-4 task rows for this name.
export const guruArnulfoAllTimeTotal = 925;
export const guruArnulfoAllTimeLoad = 923;
export const guruArnulfoAllTimeReceive = 2;

// Mix: 6 LOAD (outbound) + 10 RECEIVE (inbound) = 16 open tasks at Bay 4 doors (2026-09-21
// ~18:15 PDT snapshot).
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 16 },
  { label: "Inbound", count: 10, total: 16 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 16 },
  { label: "Inbound", count: 10, total: 16 },
];

// Schedule: facility-wide appointment adherence for the current facility-local day (2026-09-21).
// Binding filters verified: loads = appointmentTimePeriod (2-element BETWEEN), receipts =
// appointmentTimeFrom/To. Both return live rows for 2026-09-21.
export const scheduleAvailable = true;
export const scheduleUnavailableReason =
  "Reported from live 2026-09-21 appointment windows.";
export const scheduledInboundOrders = 53;
export const scheduledOutboundOrders = 127;
export const scheduledInboundReceived = 8;
export const scheduledOutboundLoaded = 103;
export const pctScheduledInboundReceived = 15.1; // 8 of 53
export const pctScheduledOutboundLoaded = 81.1; // 103 of 127

// Live status composition of the 2026-09-21 scheduled day (for the Data Notes audit trail).
export const scheduleLoadStatus: Record<string, number> = { "SHIPPED": 97, "NEW": 23, "LOADED": 6, "LOADING": 1 };
export const scheduleReceiptStatus: Record<string, number> = { "IMPORTED": 22, "IN_PROGRESS": 15, "OPEN": 8, "CLOSED": 5, "FORCE_CLOSED": 3 };

// Facility-wide open population swept to isolate the Bay-4 subset (fresh this refresh).
export const facilityOpenLoad = 38;
export const facilityOpenReceive = 143;
export const bay4DockIdMap: Record<string, string> = { "DOCK50": "570", "DOCK51": "554", "DOCK52": "556", "DOCK53": "552", "DOCK54": "564", "DOCK55": "560", "DOCK56": "575", "DOCK57": "563", "DOCK58": "572", "DOCK59": "571", "DOCK60": "565", "DOCK61": "567", "DOCK62": "566", "DOCK63": "568", "DOCK64": "559", "DOCK65": "573", "DOCK66": "576", "DOCK67": "577", "DOCK68": "574", "DOCK69": "578", "DOCK70": "579", "DOCK71": "580", "DOCK72": "587" };

// Customer mix of the open Bay-4 population this snapshot.
export const openCustomerMix: AssigneeSummary[] = [
  { name: "GURUNANDA, LLC", taskCount: 12 },
  { name: "KARAKA, LLC", taskCount: 3 },
  { name: "ORG-798965", taskCount: 1 },
];
export const openStatusCounts: AssigneeSummary[] = [
  { name: "IN_PROGRESS", taskCount: 10 },
  { name: "NEW", taskCount: 6 },
];

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 21, 2026 ~18:15 PDT snapshot)
// 16 open tasks: 6 LOAD (outbound) + 10 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5373019", dns: "LOAD IN_PROGRESS", customer: "ORG-798965", pieces: "IN_PROGRESS (0d 6h 53m)", assignee: "JOSE MORALES", door: "DOCK50" },
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (335d 4h 53m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5373035", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0d 4h 52m)", assignee: "ARNULFO MUNGUIA", door: "DOCK51" },
  { taskId: "TASK-5372912", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0d 7h 20m)", assignee: "ARNULFO MUNGUIA", door: "DOCK52" },
  { taskId: "TASK-5373472", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0d 2h 18m)", assignee: "DANIEL BELTRAN", door: "DOCK53" },
  { taskId: "TASK-5365421", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (10d 8h 42m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (45d 1h 45m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5373632", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0d 0h 2m)", assignee: "DANIELA GONZALEZ", door: "DOCK61" },
  { taskId: "TASK-5365814", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (7d 3h 30m)", assignee: "ARNULFO MUNGUIA", door: "DOCK62" },
  { taskId: "TASK-5373531", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0d 0h 13m)", assignee: "DANIELA GONZALEZ", door: "DOCK72" },
  { taskId: "TASK-5373122", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5371830", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "RUFINO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5368665", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK55" },
  { taskId: "TASK-5369120", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK56" },
  { taskId: "TASK-5373519", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "DANIELA GONZALEZ", door: "DOCK59" },
  { taskId: "TASK-5369900", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "DANIELA GONZALEZ", door: "DOCK64" },
];

// ── Assigned Activity — Bay 4 (GURUNANDA / Live Out & In → Arnulfo) section ──
// Arnulfo Munguia (assigneeUserId 89) open tasks at Bay-4 doors this snapshot.
export const arnulfoOpenTasks: { door: string; taskId: string; kind: string; status: string; customer: string; note: string }[] = [
  { door: "DOCK51", taskId: "TASK-5373035", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 0d 4h 52m" },
  { door: "DOCK52", taskId: "TASK-5372912", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 0d 7h 20m" },
  { door: "DOCK54", taskId: "TASK-5365421", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "STALE — endTime set" },
  { door: "DOCK54", taskId: "TASK-5338695", kind: "LOAD", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "STALE — endTime set" },
  { door: "DOCK55", taskId: "TASK-5373122", kind: "RECEIVE", status: "NEW", customer: "KARAKA, LLC", note: "NEW — not started" },
  { door: "DOCK56", taskId: "TASK-5369120", kind: "RECEIVE", status: "NEW", customer: "KARAKA, LLC", note: "NEW — not started" },
  { door: "DOCK55", taskId: "TASK-5368665", kind: "RECEIVE", status: "NEW", customer: "KARAKA, LLC", note: "NEW — not started" },
  { door: "DOCK62", taskId: "TASK-5365814", kind: "RECEIVE", status: "IN_PROGRESS", customer: "GURUNANDA, LLC", note: "IN_PROGRESS — 7d 3h 30m" },
];

export const arnulfoOpenCount = 8;
export const arnulfoOpenLoad = 4;
export const arnulfoOpenReceive = 4;
export const arnulfoOpenGuru = 5;
export const arnulfoOpenKaraka = 3;
