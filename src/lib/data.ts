/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-18 ~09:55 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (swept per door with the singular dockId)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (swept per door with the singular dockId)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod window)
 *     - row-level rescan of CLOSED / FORCE_CLOSED load + receive tasks across all 23 doors (all-time block)
 *
 * SNAPSHOT INSTANT: 2026-09-18 09:55 PDT (America/Los_Angeles), Friday.
 * UTC QUERY WINDOW: 2026-09-18T16:55:01Z → 2026-09-18T16:55:10Z (snapshot instant 2026-09-18T16:55:05Z).
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * API NOTE: on this endpoint family the door filter binds ONLY as the singular `dockId` — the plural
 *   `dockIds` (array) is silently IGNORED and the search then returns the facility-wide population
 *   (re-verified live this refresh: facility-wide open load = 44, dockIds=[564] also = 44), and a
 *   comma-separated `dockId` string is rejected with HTTP 400 ("Invalid arguments: For input string:
 *   \"564,560\""). Every Bay-4 door below was therefore swept individually with the singular `dockId`.
 *   Door ids are NOT sequential and are NOT derivable from the name — live-verified this refresh
 *   (23/23, totalCount = 23): DOCK50=570, 51=554, 52=556, 53=552, 54=564, 55=560, 56=575, 57=563,
 *   58=572, 59=571, 60=565, 61=567, 62=566, 63=568, 64=559, 65=573, 66=576, 67=577, 68=574, 69=578,
 *   70=579, 71=580, 72=587.
 *
 *   INTEGRITY: the open population was read exhaustively this refresh — all 23 Bay-4 doors were
 *   swept individually for open load tasks AND open receive tasks (statuses NEW, IN_PROGRESS,
 *   EXCEPTION), and every per-door rows count equalled the returned totalCount (no truncation).
 *   The all-time block was likewise re-scanned row-by-row across all 23 doors × 2 task types with
 *   rows == totalCount asserted on every door/type pair. No rows were fabricated; every value below
 *   is a live count returned by WISE/WMS.
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant,
 *   so durations are aged startTime → 2026-09-18T16:55:05Z.
 *
 *   LIVE CHURN NOTE: the open population moved during this pull — DOCK70 RECEIVE TASK-5370705
 *   (Fatima Ponce) closed at 2026-09-18T16:51:38Z and DOCK54 LOAD TASK-5370878 closed at
 *   2026-09-18T16:42:09Z, while DOCK51 LOAD TASK-5371661 and DOCK54 LOAD TASK-5365421 surfaced as
 *   open. All values below come from one tight, self-consistent final sweep.
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
export const refreshStamp = "Sep 18 ~09:55 PDT";
export const refreshDateLong = "September 18, 2026";
// UTC query window for this snapshot
export const snapshotUtc = "2026-09-18T16:55:05Z";
export const windowUtc = "2026-09-18T16:55:01Z → 2026-09-18T16:55:10Z";

export const doors: DoorRecord[] = [
  // OCCUPIED — door has at least one in-progress open task (9 doors)
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez", customer: "GURUNANDA, LLC", taskIds: ["TASK-5090739"], duration: "331d 20h 33m", anomaly: true },
  { door: "DOCK51", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5371661"], duration: "1h 8m", anomaly: false },
  { door: "DOCK52", status: "Occupied", assignee: "SILVANO SERTORIO HERNANDEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5371172"], duration: "18h 30m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "SILVANO SERTORIO HERNANDEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5371016"], duration: "20h 27m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA / CANDY MENDEZ", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5365421", "TASK-5338695", "TASK-5369031", "TASK-5364490"], duration: "41d 17h 25m", anomaly: true },
  { door: "DOCK55", status: "Occupied", assignee: "DANIELA GONZALEZ / JEROME ARANDA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5369975", "TASK-5368665"], duration: "18h 12m", anomaly: false },
  { door: "DOCK57", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5371291"], duration: "13h 44m", anomaly: false },
  { door: "DOCK62", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365814"], duration: "3d 19h 10m", anomaly: false },
  { door: "DOCK64", status: "Occupied", assignee: "RUFINO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5371702"], duration: "25m", anomaly: false },

  // RESERVED — door has only a not-started (NEW) open task (1 door)
  { door: "DOCK56", status: "Reserved", assignee: "CANDY MENDEZ / ARNULFO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5369057", "TASK-5369120"], duration: null, anomaly: false },

  // AVAILABLE — no open load/receive task (13 doors)
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK63", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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

// Open assignee task counts - Bay 4 DOCK50-DOCK72, open load/receive dock tasks (15 open tasks at
// the 2026-09-18 ~09:55 PDT snapshot: 5 LOAD + 10 RECEIVE on 10 doors, 7 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 6 },
  { name: "CANDY MENDEZ", taskCount: 2 },
  { name: "DANIELA GONZALEZ", taskCount: 2 },
  { name: "SILVANO SERTORIO HERNANDEZ", taskCount: 2 },
  { name: "daira gonzalez", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// FULLY RECOMPUTED this refresh (2026-09-18 ~09:55 PDT) from a complete row-level rescan of all
// closed load/receive tasks across the 23 doors (rows == totalCount asserted on all 23 doors,
// both task types; 2,811 LOAD + 987 RECEIVE = 3,798 closed transactions rolled up by display name,
// 83 names / 94 user ids).
export const allTimeClosedTotal = 3798;
export const allTimeDistinctAssignees = 83;
export const allTimeLastRecomputed = "2026-09-18 ~09:55 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 970 },
  { name: "DANIEL BELTRAN", taskCount: 960 },
  { name: "DANIELA GONZALEZ", taskCount: 395 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR ALVARADO", taskCount: 113 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "Fatima Ponce", taskCount: 106 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA → Arnulfo" all-time at Bay-4 doors — RECOMPUTED this refresh from the same full
// row-level rescan (uid 89, customerIds=[ORG-655875]): 922 LOAD + 2 RECEIVE = 924.
// Caveat: a second employee also named ARNULFO MUNGUIA (uid 1948070158297014318) carries 7 more
// Bay-4 GURUNANDA closed LOADs; the headline uses uid 89 only, so 924 (931 if both were merged).
export const guruArnulfoAllTimeTotal = 924;
export const guruArnulfoAllTimeLoad = 922;
export const guruArnulfoAllTimeReceive = 2;

// Mix: 5 LOAD (outbound) + 10 RECEIVE (inbound) = 15 open tasks at Bay 4 doors (2026-09-18
// ~09:55 PDT snapshot).
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 15 },
  { label: "Inbound", count: 10, total: 15 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 15 },
  { label: "Inbound", count: 10, total: 15 },
];

// Schedule: today's (2026-09-18, Friday) facility-wide — receipts/loads whose appointment time is
// today (facility-local day, America/Los_Angeles). Completed = receipt status CLOSED (received) /
// load status LOADED+SHIPPED (loaded). Queried live ~09:55 PDT.
// Inbounds: binding receipt appointmentTimeFrom/To window for the 2026-09-18 local day returns
// 24 scheduled receipts (10 IMPORTED + 9 OPEN + 4 IN_PROGRESS + 1 CLOSED), of which 1 is CLOSED
// (received) ⇒ 4.2%.
//   (Control: the 2026-09-17 window returns 22 receipts and the 2026-09-19 window returns 7 —
//   the window binds.)
// Outbounds: binding load appointmentTimePeriod array filter returns 114 loads scheduled for
// 2026-09-18 (73 NEW + 16 LOADING + 12 WINDOW_CHECKIN_DONE + 11 SHIPPED + 2 LOADED), of which 13
// are loaded (11 SHIPPED + 2 LOADED) ⇒ 11.4%. (SHIPPED-only would read 11 of 114 = 9.6%.)
//   (Control: the 2026-09-17 window returns 138 loads; the load population for a past appointment
//   day drifts as loads are cancelled/re-appointed.)
export const scheduleAvailable = true;
export const scheduledInboundOrders = 24;
export const scheduledOutboundOrders = 114;
export const scheduledInboundReceived = 1;
export const scheduledOutboundLoaded = 13;
export const pctScheduledInboundReceived = (1 / 24) * 100; // 1 of 24 scheduled inbounds received
export const pctScheduledOutboundLoaded = (13 / 114) * 100; // 13 of 114 scheduled loads loaded

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 18, 2026 ~09:55 PDT snapshot)
// 15 open tasks: 5 LOAD (outbound) + 10 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (331d 20h 33m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5371661", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1h 8m)", assignee: "ARNULFO MUNGUIA", door: "DOCK51" },
  { taskId: "TASK-5371172", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (18h 30m)", assignee: "SILVANO SERTORIO HERNANDEZ", door: "DOCK52" },
  { taskId: "TASK-5371016", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (20h 27m)", assignee: "SILVANO SERTORIO HERNANDEZ", door: "DOCK53" },
  { taskId: "TASK-5365421", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (7d 0h 22m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (41d 17h 25m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5369031", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "CANDY MENDEZ", door: "DOCK54" },
  { taskId: "TASK-5364490", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (2d 17h 31m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5369975", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (18h 12m)", assignee: "DANIELA GONZALEZ", door: "DOCK55" },
  { taskId: "TASK-5368665", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "JEROME ARANDA", door: "DOCK55" },
  { taskId: "TASK-5369057", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "CANDY MENDEZ", door: "DOCK56" },
  { taskId: "TASK-5369120", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK56" },
  { taskId: "TASK-5371291", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (13h 44m)", assignee: "DANIELA GONZALEZ", door: "DOCK57" },
  { taskId: "TASK-5365814", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (3d 19h 10m)", assignee: "ARNULFO MUNGUIA", door: "DOCK62" },
  { taskId: "TASK-5371702", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (25m)", assignee: "RUFINO MUNGUIA", door: "DOCK64" },
];
