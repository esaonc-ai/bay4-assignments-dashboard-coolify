/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-17 ~18:24 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (swept per door with the singular dockId)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (swept per door with the singular dockId)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod window)
 *     - row-level rescan of CLOSED / FORCE_CLOSED load + receive tasks across all 23 doors (all-time block)
 *
 * SNAPSHOT INSTANT: 2026-09-17 18:24 PDT (America/Los_Angeles), Thursday.
 * UTC QUERY WINDOW: 2026-09-18T01:22:00Z → 2026-09-18T01:25:00Z.
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * API NOTE: on this endpoint family the door filter binds ONLY as the singular `dockId` — the plural
 *   `dockIds` (array) is silently IGNORED and the search then returns the facility-wide population,
 *   and a comma-separated `dockId` string is rejected with HTTP 400 ("Invalid arguments: For input
 *   string"). Every Bay-4 door below was therefore swept individually with the singular `dockId`.
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
 *   so durations are aged startTime → 2026-09-18T01:24:36Z.
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
export const refreshStamp = "Sep 17 ~18:24 PDT";
export const refreshDateLong = "September 17, 2026";
// UTC query window for this snapshot
export const snapshotUtc = "2026-09-18T01:24:36Z";
export const windowUtc = "2026-09-18T01:22:00Z → 2026-09-18T01:25:00Z";

export const doors: DoorRecord[] = [
  // OCCUPIED — door has at least one in-progress open task (10 doors)
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez / ARNULFO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5090739", "TASK-5368207"], duration: "331d 5h 3m", anomaly: true },
  { door: "DOCK52", status: "Occupied", assignee: "SILVANO SERTORIO HERNANDEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5371172"], duration: "3h 0m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "SILVANO SERTORIO HERNANDEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5371016"], duration: "4h 57m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA / SILVANO SERTORIO HERNANDEZ / CANDY MENDEZ", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5338695", "TASK-5370878", "TASK-5364490", "TASK-5369031"], duration: "41d 1h 55m", anomaly: true },
  { door: "DOCK55", status: "Occupied", assignee: "DANIELA GONZALEZ / JEROME ARANDA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5369975", "TASK-5368665"], duration: "2h 42m", anomaly: false },
  { door: "DOCK56", status: "Occupied", assignee: "DANIELA GONZALEZ / CANDY MENDEZ / ARNULFO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5370012", "TASK-5369057", "TASK-5369120"], duration: "2h 47m", anomaly: false },
  { door: "DOCK57", status: "Occupied", assignee: "Fatima Ponce", customer: "GURUNANDA, LLC", taskIds: ["TASK-5369084"], duration: "6h 24m", anomaly: false },
  { door: "DOCK60", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5370048"], duration: "2h 9m", anomaly: false },
  { door: "DOCK62", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365814"], duration: "3d 3h 39m", anomaly: false },
  { door: "DOCK70", status: "Occupied", assignee: "RUFINO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5370705"], duration: "6h 49m", anomaly: false },

  // RESERVED — door has only a not-started (NEW) open task (0 doors this refresh)
  // (DOCK55 and DOCK56 each hold a NEW task but also an IN_PROGRESS task, so they are OCCUPIED.)

  // AVAILABLE — no open load/receive task (13 doors)
  { door: "DOCK51", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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

// Open assignee task counts - Bay 4 DOCK50-DOCK72, open load/receive dock tasks (17 open tasks at
// the 2026-09-17 ~18:24 PDT snapshot: 4 LOAD + 13 RECEIVE on 10 doors, 8 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 5 },
  { name: "DANIELA GONZALEZ", taskCount: 3 },
  { name: "SILVANO SERTORIO HERNANDEZ", taskCount: 3 },
  { name: "CANDY MENDEZ", taskCount: 2 },
  { name: "Fatima Ponce", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// FULLY RECOMPUTED this refresh (2026-09-17 ~18:24 PDT) from a complete row-level rescan of all
// closed load/receive tasks across the 23 doors (rows == totalCount asserted on all 23 doors,
// both task types; 2,810 LOAD + 980 RECEIVE = 3,790 closed transactions rolled up by display name,
// 83 names / 94 user ids).
export const allTimeClosedTotal = 3790;
export const allTimeDistinctAssignees = 83;
export const allTimeLastRecomputed = "2026-09-17 ~18:24 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 968 },
  { name: "DANIEL BELTRAN", taskCount: 960 },
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

// Mix: 4 LOAD (outbound) + 13 RECEIVE (inbound) = 17 open tasks at Bay 4 doors (2026-09-17
// ~18:24 PDT snapshot).
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 4, total: 17 },
  { label: "Inbound", count: 13, total: 17 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 4, total: 17 },
  { label: "Inbound", count: 13, total: 17 },
];

// Schedule: today's (2026-09-17, Thursday) facility-wide — receipts/loads whose appointment time is
// today (facility-local day, America/Los_Angeles). Completed = receipt status CLOSED (received) /
// load status LOADED+SHIPPED (loaded). Queried live ~18:24 PDT.
// Inbounds: binding receipt appointmentTimeFrom/To window for the 2026-09-17 local day returns
// 22 scheduled receipts (11 IMPORTED + 10 IN_PROGRESS + 1 CLOSED), of which 1 is CLOSED
// (received) ⇒ 4.5%.
//   (Control: the 2026-09-16 window returns 49 receipts — the window binds.)
// Outbounds: binding load appointmentTimePeriod array filter returns 141 loads scheduled for
// 2026-09-17 (124 SHIPPED + 15 NEW + 2 LOADING), of which 124 are completed (SHIPPED) ⇒ 87.9%.
//   (Control: the 2026-09-16 window returns 119 loads; the load population for a past appointment
//   day drifts as loads are cancelled/re-appointed.)
export const scheduleAvailable = true;
export const scheduledInboundOrders = 22;
export const scheduledOutboundOrders = 141;
export const scheduledInboundReceived = 1;
export const scheduledOutboundLoaded = 124;
export const pctScheduledInboundReceived = (1 / 22) * 100; // 1 of 22 scheduled inbounds received
export const pctScheduledOutboundLoaded = (124 / 141) * 100; // 124 of 141 scheduled loads loaded

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 17, 2026 ~18:24 PDT snapshot)
// 17 open tasks: 4 LOAD (outbound) + 13 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (331d 5h 3m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5368207", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (2d 6h 59m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK50" },
  { taskId: "TASK-5371172", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (3h 0m)", assignee: "SILVANO SERTORIO HERNANDEZ", door: "DOCK52" },
  { taskId: "TASK-5371016", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (4h 57m)", assignee: "SILVANO SERTORIO HERNANDEZ", door: "DOCK53" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (41d 1h 55m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5370878", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (5h 15m)", assignee: "SILVANO SERTORIO HERNANDEZ", door: "DOCK54" },
  { taskId: "TASK-5364490", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (2d 2h 1m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5369031", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "CANDY MENDEZ", door: "DOCK54" },
  { taskId: "TASK-5369975", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (2h 42m)", assignee: "DANIELA GONZALEZ", door: "DOCK55" },
  { taskId: "TASK-5368665", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "JEROME ARANDA", door: "DOCK55" },
  { taskId: "TASK-5370012", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (2h 47m)", assignee: "DANIELA GONZALEZ", door: "DOCK56" },
  { taskId: "TASK-5369057", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "CANDY MENDEZ", door: "DOCK56" },
  { taskId: "TASK-5369120", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK56" },
  { taskId: "TASK-5369084", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (6h 24m)", assignee: "Fatima Ponce", door: "DOCK57" },
  { taskId: "TASK-5370048", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (2h 9m)", assignee: "DANIELA GONZALEZ", door: "DOCK60" },
  { taskId: "TASK-5365814", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (3d 3h 39m)", assignee: "ARNULFO MUNGUIA", door: "DOCK62" },
  { taskId: "TASK-5370705", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (6h 49m)", assignee: "RUFINO MUNGUIA", door: "DOCK70" },
];
