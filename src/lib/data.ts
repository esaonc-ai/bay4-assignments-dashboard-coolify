/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-17 ~15:04 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (swept per door with the singular dockId)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (swept per door with the singular dockId)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod window)
 *     - /wms-bam/user/search-by-paging — assignee names for the open task set AND the all-time closed set
 *     - /mdm/organization/search-by-paging — customer names for the referenced org ids
 *
 * SNAPSHOT INSTANT: 2026-09-17 15:04 PDT (America/Los_Angeles), Thursday.
 * UTC QUERY WINDOW: 2026-09-17T22:01:00Z → 2026-09-17T22:05:00Z.
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * API NOTE: on this endpoint family the door filter binds ONLY as the singular `dockId` — the plural
 *   `dockIds` (array) is silently IGNORED and the search then returns the facility-wide population,
 *   and a comma-separated `dockId` string is rejected with HTTP 400 ("Invalid arguments: For input
 *   string"). Re-verified live this refresh (load-task facility-wide = 45 open; dockIds=[564] also
 *   returned 45 → plural ignored; dockId="564,560" → HTTP 400). Every Bay-4 door below was therefore
 *   swept individually with the singular `dockId`. The `statuses` array binds on BOTH load-task and
 *   receive-task (DOCK54 load-task: 376 total with no status filter vs 2 with the open statuses).
 *   Door ids are NOT sequential and are NOT derivable from the name — live-verified this refresh
 *   (23/23): DOCK50=570, 51=554, 52=556, 53=552, 54=564, 55=560, 56=575, 57=563, 58=572, 59=571,
 *   60=565, 61=567, 62=566, 63=568, 64=559, 65=573, 66=576, 67=577, 68=574, 69=578, 70=579,
 *   71=580, 72=587.
 *
 *   INTEGRITY: the open population was read exhaustively this refresh — all 23 Bay-4 doors were
 *   swept individually for open load tasks AND open receive tasks (statuses NEW, IN_PROGRESS,
 *   EXCEPTION), and every per-door totalCount equalled the returned row count (no truncation).
 *   The location lookup returned totalCount = 23 for the 23 requested door names.
 *   No rows were fabricated; every value below is a live count returned by WISE/WMS.
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant,
 *   so durations are aged startTime → 2026-09-17T22:04:27Z.
 *
 * SCOPE NOTE (all-time cumulative block): the "All-Time Assignments" totals, the per-assignee
 * top-10, and the GURUNANDA → Arnulfo cumulative figure WERE fully recomputed this refresh from a
 * complete row-level rescan of every closed task across 23 doors × 2 task types (rows == totalCount
 * asserted on every door/type pair). They are therefore presented as fresh, not carried forward.
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
export const refreshStamp = "Sep 17 ~15:04 PDT";
export const refreshDateLong = "September 17, 2026";
// UTC query window for this snapshot
export const snapshotUtc = "2026-09-17T22:04:27Z";
export const windowUtc = "2026-09-17T22:01:00Z → 2026-09-17T22:05:00Z";

export const doors: DoorRecord[] = [
  // OCCUPIED — door has an in-progress open task (7 doors)
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez / ARNULFO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5090739", "TASK-5368207"], duration: "331d 1h 43m", anomaly: true },
  { door: "DOCK53", status: "Occupied", assignee: "SILVANO SERTORIO HERNANDEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5371016"], duration: "1h 37m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA / SILVANO SERTORIO HERNANDEZ / CANDY MENDEZ", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5338695", "TASK-5370878", "TASK-5364490", "TASK-5369031"], duration: "40d 22h 34m", anomaly: true },
  { door: "DOCK57", status: "Occupied", assignee: "Fatima Ponce / DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5369084", "TASK-5371093"], duration: "3h 4m", anomaly: false },
  { door: "DOCK58", status: "Occupied", assignee: "EFREN SALVADOR", customer: "GURUNANDA, LLC", taskIds: ["TASK-5371111"], duration: "0h 5m", anomaly: false },
  { door: "DOCK62", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365814"], duration: "3d 0h 19m", anomaly: false },
  { door: "DOCK70", status: "Occupied", assignee: "RUFINO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5370705"], duration: "3h 28m", anomaly: false },

  // RESERVED — door has only a not-started (NEW) open task (3 doors)
  { door: "DOCK55", status: "Reserved", assignee: "DANIELA GONZALEZ / JEROME ARANDA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5369975", "TASK-5368665"], duration: null, anomaly: false },
  { door: "DOCK56", status: "Reserved", assignee: "DANIELA GONZALEZ / CANDY MENDEZ / ARNULFO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5370012", "TASK-5369057", "TASK-5369120"], duration: null, anomaly: false },
  { door: "DOCK59", status: "Reserved", assignee: "DANIEL BELTRAN", customer: "GURUNANDA, LLC", taskIds: ["TASK-5371143"], duration: null, anomaly: false },

  // AVAILABLE — no open load/receive task (13 doors)
  { door: "DOCK51", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK52", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK63", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK64", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK65", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK66", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK67", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK68", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK69", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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

// Open assignee task counts - Bay 4 DOCK50-DOCK72, open load/receive dock tasks (18 open tasks at
// the 2026-09-17 ~15:04 PDT snapshot: 6 LOAD + 12 RECEIVE on 10 doors, 10 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 5 },
  { name: "CANDY MENDEZ", taskCount: 2 },
  { name: "DANIEL BELTRAN", taskCount: 2 },
  { name: "DANIELA GONZALEZ", taskCount: 2 },
  { name: "SILVANO SERTORIO HERNANDEZ", taskCount: 2 },
  { name: "Fatima Ponce", taskCount: 1 },
  { name: "EFREN SALVADOR", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// FULLY RECOMPUTED this refresh (2026-09-17 ~15:04 PDT) from a complete row-level rescan of all
// closed load/receive tasks across the 23 doors (rows == totalCount asserted on all 23 doors,
// both task types; 2,807 LOAD + 980 RECEIVE = 3,787 closed transactions rolled up by display name,
// 83 names / 94 user ids).
export const allTimeClosedTotal = 3787;
export const allTimeDistinctAssignees = 83;
export const allTimeLastRecomputed = "2026-09-17 ~15:04 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 968 },
  { name: "DANIEL BELTRAN", taskCount: 958 },
  { name: "DANIELA GONZALEZ", taskCount: 391 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR ALVARADO", taskCount: 113 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "Fatima Ponce", taskCount: 104 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA → Arnulfo" all-time at Bay-4 doors — RECOMPUTED this refresh from the same full
// row-level rescan (uid 89, customerIds=[ORG-655875]): 921 LOAD + 2 RECEIVE = 923.
// Caveat: a second employee also named ARNULFO MUNGUIA (uid 1948070158297014318) carries 7 more
// Bay-4 GURUNANDA closed LOADs; the headline uses uid 89 only, so 923 (930 if both were merged).
export const guruArnulfoAllTimeTotal = 923;
export const guruArnulfoAllTimeLoad = 921;
export const guruArnulfoAllTimeReceive = 2;

// Mix: 6 LOAD (outbound) + 12 RECEIVE (inbound) = 18 open tasks at Bay 4 doors (2026-09-17
// ~15:04 PDT snapshot).
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 18 },
  { label: "Inbound", count: 12, total: 18 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 18 },
  { label: "Inbound", count: 12, total: 18 },
];

// Schedule: today's (2026-09-17, Thursday) facility-wide — receipts/loads whose appointment time is
// today (facility-local day, America/Los_Angeles). Completed = receipt status CLOSED (received) /
// load status LOADED+SHIPPED (loaded). Queried live ~15:04 PDT.
// Inbounds: binding receipt appointmentTimeFrom/To window for the 2026-09-17 local day returns
// 22 scheduled receipts (11 IMPORTED + 9 IN_PROGRESS + 1 OPEN + 1 CLOSED), of which 1 is CLOSED
// (received) ⇒ 4.5%.
//   (Control: the 2026-09-16 window returns 49 receipts, matching the prior snapshot — the window binds.)
// Outbounds: binding load appointmentTimePeriod array filter returns 141 loads scheduled for
// 2026-09-17 (88 SHIPPED + 20 LOADING + 17 NEW + 13 WINDOW_CHECKIN_DONE + 3 LOADED), of which 91 are
// completed (88 SHIPPED + 3 LOADED) ⇒ 64.5%.
//   (Control: the 2026-09-16 window returns 120 loads; the prior snapshot recorded 130 for that day —
//   the load population for a past appointment day drifts as loads are cancelled/re-appointed.)
export const scheduleAvailable = true;
export const scheduledInboundOrders = 22;
export const scheduledOutboundOrders = 141;
export const scheduledInboundReceived = 1;
export const scheduledOutboundLoaded = 91;
export const pctScheduledInboundReceived = (1 / 22) * 100; // 1 of 22 scheduled inbounds received
export const pctScheduledOutboundLoaded = (91 / 141) * 100; // 91 of 141 scheduled loads loaded

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 17, 2026 ~15:04 PDT snapshot)
// 18 open tasks: 6 LOAD (outbound) + 12 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (331d 1h 43m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5368207", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (2d 3h 39m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK50" },
  { taskId: "TASK-5371016", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1h 37m)", assignee: "SILVANO SERTORIO HERNANDEZ", door: "DOCK53" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (40d 22h 34m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5370878", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1h 55m)", assignee: "SILVANO SERTORIO HERNANDEZ", door: "DOCK54" },
  { taskId: "TASK-5364490", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (1d 22h 41m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5369031", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "CANDY MENDEZ", door: "DOCK54" },
  { taskId: "TASK-5369975", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "DANIELA GONZALEZ", door: "DOCK55" },
  { taskId: "TASK-5368665", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "JEROME ARANDA", door: "DOCK55" },
  { taskId: "TASK-5370012", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "DANIELA GONZALEZ", door: "DOCK56" },
  { taskId: "TASK-5369057", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "CANDY MENDEZ", door: "DOCK56" },
  { taskId: "TASK-5369120", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK56" },
  { taskId: "TASK-5369084", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (3h 4m)", assignee: "Fatima Ponce", door: "DOCK57" },
  { taskId: "TASK-5371093", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0h 13m)", assignee: "DANIEL BELTRAN", door: "DOCK57" },
  { taskId: "TASK-5371111", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0h 5m)", assignee: "EFREN SALVADOR", door: "DOCK58" },
  { taskId: "TASK-5371143", dns: "LOAD NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "DANIEL BELTRAN", door: "DOCK59" },
  { taskId: "TASK-5365814", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (3d 0h 19m)", assignee: "ARNULFO MUNGUIA", door: "DOCK62" },
  { taskId: "TASK-5370705", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (3h 28m)", assignee: "RUFINO MUNGUIA", door: "DOCK70" },
];
