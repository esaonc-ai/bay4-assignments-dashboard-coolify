/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-16 ~11:44 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (swept per door with the singular dockId)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (swept per door with the singular dockId)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod window)
 *
 * SNAPSHOT INSTANT: 2026-09-16 11:44 PDT (America/Los_Angeles), Wednesday.
 * UTC QUERY WINDOW: 2026-09-16T18:42:50Z → 2026-09-16T18:44:30Z.
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * API NOTE: on this endpoint family the door filter binds ONLY as the singular `dockId` — the plural
 *   `dockIds` (array) is silently IGNORED and the search then returns the facility-wide population,
 *   and a comma-separated `dockId` string is rejected with HTTP 400 ("Invalid arguments: For input
 *   string"). Re-verified live this refresh. Every Bay-4 door below was therefore swept individually
 *   with the singular `dockId`. The `statuses` array binds on BOTH load-task and receive-task.
 *   Door ids are NOT sequential and are NOT derivable from the name — live-verified this refresh
 *   (23/23): DOCK50=570, 51=554, 52=556, 53=552, 54=564, 55=560, 56=575, 57=563, 58=572, 59=571,
 *   60=565, 61=567, 62=566, 63=568, 64=559, 65=573, 66=576, 67=577, 68=574, 69=578, 70=579,
 *   71=580, 72=587.
 *
 *   INTEGRITY: the open population was read exhaustively this refresh — all 23 Bay-4 doors were
 *   swept individually for open load tasks AND open receive tasks (statuses NEW, IN_PROGRESS,
 *   EXCEPTION). No rows were fabricated; every value below is a live count returned by WISE/WMS.
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant,
 *   so durations are aged startTime → 2026-09-16T18:44:00Z — identical to every prior snapshot,
 *   keeping the values comparable across refreshes.
 *
 * SCOPE NOTE (all-time cumulative block): the "All-Time Assignments" totals and the
 * GURUNANDA → Arnulfo cumulative figure are derived from a full row-level rescan of every closed
 * task across 23 doors × 2 task types (several thousand rows). That rescan is NOT part of this
 * refresh, so those cumulative figures keep their last full recomputation stamp
 * (2026-09-13 ~09:45 PDT) and are NOT presented as freshly recomputed. Every live/operational
 * metric in this file was re-pulled from WISE/WMS for the 2026-09-16 snapshot.
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
export const refreshStamp = "Sep 16 ~11:44 PDT";
export const refreshDateLong = "September 16, 2026";
// UTC query window for this snapshot
export const snapshotUtc = "2026-09-16T18:44:00Z";
export const windowUtc = "2026-09-16T18:42:50Z → 2026-09-16T18:44:30Z";

export const doors: DoorRecord[] = [
  // OCCUPIED — door has an in-progress open task (8 doors)
  { door: "DOCK50", status: "Occupied", assignee: "ARNULFO MUNGUIA / daira gonzalez", customer: "KARAKA, LLC / GURUNANDA, LLC", taskIds: ["TASK-5368207", "TASK-5090739"], duration: "329d 22h 23m", anomaly: true },
  { door: "DOCK53", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5368697"], duration: "20h 23m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA / CANDY MENDEZ", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5338695", "TASK-5364490", "TASK-5369404", "TASK-5369031"], duration: "39d 19h 15m", anomaly: true },
  { door: "DOCK56", status: "Occupied", assignee: "ARNULFO MUNGUIA / CANDY MENDEZ", customer: "KARAKA, LLC / GURUNANDA, LLC", taskIds: ["TASK-5369422", "TASK-5369120", "TASK-5369057"], duration: "0h 22m", anomaly: false },
  { door: "DOCK57", status: "Occupied", assignee: "DANIEL BELTRAN / CANDY MENDEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5369479", "TASK-5369084"], duration: "0h 20m", anomaly: false },
  { door: "DOCK58", status: "Occupied", assignee: "EFREN SALVADOR / CANDY MENDEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5369489", "TASK-5369091"], duration: "0h 16m", anomaly: false },
  { door: "DOCK62", status: "Occupied", assignee: "JORGE ANTONIO FRANCO", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365814"], duration: "1d 20h 59m", anomaly: false },
  { door: "DOCK71", status: "Occupied", assignee: "RUFINO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5369311"], duration: "1h 25m", anomaly: false },

  // RESERVED — door has only a not-started (NEW) open task (2 doors)
  { door: "DOCK55", status: "Reserved", assignee: "JEROME ARANDA", customer: "KARAKA, LLC", taskIds: ["TASK-5368665"], duration: null, anomaly: false },
  { door: "DOCK59", status: "Reserved", assignee: "CANDY MENDEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5369510"], duration: null, anomaly: false },

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
  { door: "DOCK70", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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
// the 2026-09-16 ~11:44 PDT snapshot: 4 LOAD + 14 RECEIVE on 10 doors, 8 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 6 },
  { name: "CANDY MENDEZ", taskCount: 6 },
  { name: "DANIEL BELTRAN", taskCount: 1 },
  { name: "EFREN SALVADOR", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
  { name: "JORGE ANTONIO FRANCO", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// CARRIED FORWARD — last full row-level recomputation 2026-09-13 ~09:45 PDT (rows == totalCount
// asserted on all 23 doors, both task types; 2,763 LOAD + 947 RECEIVE = 3,710 closed transactions
// rolled up by display name, 81 names / 91 user ids). NOT re-scanned in this refresh.
export const allTimeClosedTotal = 3710;
export const allTimeDistinctAssignees = 81;
export const allTimeLastRecomputed = "2026-09-13 ~09:45 PDT";
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 955 },
  { name: "DANIEL BELTRAN", taskCount: 935 },
  { name: "DANIELA GONZALEZ", taskCount: 381 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR ALVARADO", taskCount: 112 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "Fatima ponce", taskCount: 95 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA → Arnulfo" all-time at Bay-4 doors — CARRIED FORWARD from the 2026-09-13 ~09:45 PDT
// full recomputation (uid 89, customerIds=[ORG-655875]): 912 LOAD + 1 RECEIVE = 913. The
// cumulative figure is NOT re-scanned in this refresh; only the live open-task snapshot below is.
export const guruArnulfoAllTimeTotal = 913;
export const guruArnulfoAllTimeLoad = 912;
export const guruArnulfoAllTimeReceive = 1;

// Mix: 4 LOAD (outbound) + 14 RECEIVE (inbound) = 18 open tasks at Bay 4 doors (2026-09-16
// ~11:44 PDT snapshot).
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 4, total: 18 },
  { label: "Inbound", count: 14, total: 18 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 4, total: 18 },
  { label: "Inbound", count: 14, total: 18 },
];

// Schedule: today's (2026-09-16, Wednesday) facility-wide — receipts/loads whose appointment time is
// today (facility-local day, America/Los_Angeles). Completed = receipt status CLOSED (received) /
// load status LOADED+SHIPPED (loaded). Queried live ~11:44 PDT.
// Inbounds: binding receipt appointmentTimeFrom/To window for the 2026-09-16 local day returns
// 46 scheduled receipts, of which 1 is CLOSED (received) ⇒ 2.2%.
//   (Control: the 2026-09-15 window returns 58 receipts, matching the prior snapshot — the window binds.)
// Outbounds: binding load appointmentTimePeriod array filter returns 135 loads scheduled for
// 2026-09-16, of which 26 are completed (25 SHIPPED + 1 LOADED) ⇒ 19.3%.
export const scheduleAvailable = true;
export const scheduledInboundOrders = 46;
export const scheduledOutboundOrders = 135;
export const scheduledInboundReceived = 1;
export const scheduledOutboundLoaded = 26;
export const pctScheduledInboundReceived = (1 / 46) * 100; // 1 of 46 scheduled inbounds received
export const pctScheduledOutboundLoaded = (26 / 135) * 100; // 26 of 135 scheduled loads loaded

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 16, 2026 ~11:44 PDT snapshot)
// 18 open tasks: 4 LOAD (outbound) + 14 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5368207", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (24h 19m)", assignee: "ARNULFO MUNGUIA", door: "DOCK50" },
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (329d 22h 23m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5368697", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (20h 23m)", assignee: "ARNULFO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (39d 19h 15m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5364490", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (19h 21m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5369404", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "CANDY MENDEZ", door: "DOCK54" },
  { taskId: "TASK-5369031", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "CANDY MENDEZ", door: "DOCK54" },
  { taskId: "TASK-5368665", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "JEROME ARANDA", door: "DOCK55" },
  { taskId: "TASK-5369422", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (0h 22m)", assignee: "ARNULFO MUNGUIA", door: "DOCK56" },
  { taskId: "TASK-5369120", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK56" },
  { taskId: "TASK-5369057", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "CANDY MENDEZ", door: "DOCK56" },
  { taskId: "TASK-5369479", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0h 20m)", assignee: "DANIEL BELTRAN", door: "DOCK57" },
  { taskId: "TASK-5369084", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "CANDY MENDEZ", door: "DOCK57" },
  { taskId: "TASK-5369489", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0h 16m)", assignee: "EFREN SALVADOR", door: "DOCK58" },
  { taskId: "TASK-5369091", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "CANDY MENDEZ", door: "DOCK58" },
  { taskId: "TASK-5369510", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "CANDY MENDEZ", door: "DOCK59" },
  { taskId: "TASK-5365814", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 20h 59m)", assignee: "JORGE ANTONIO FRANCO", door: "DOCK62" },
  { taskId: "TASK-5369311", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1h 25m)", assignee: "RUFINO MUNGUIA", door: "DOCK71" },
];
