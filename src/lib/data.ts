/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-15 ~18:08 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (DOCK50..DOCK72 ids, re-verified live 23/23)
 *     - /wms-bam/outbound/load-task/search-by-paging — load tasks per door
 *     - /wms-bam/inbound/receive-task/search-by-paging — receive tasks per door
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled appointments (appointmentTimeFrom/To)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod)
 *
 * SNAPSHOT INSTANT: 2026-09-15 18:08 PDT (America/Los_Angeles), Tuesday.
 * UTC QUERY WINDOW: 2026-09-16T01:06:50Z → 2026-09-16T01:08:10Z.
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * API NOTE: on this endpoint family `dockId` (singular) is the only binding door filter —
 *   the plural `dockIds` (array or comma list) is silently IGNORED and the search returns the
 *   facility-wide population. Every Bay-4 door below was therefore swept individually with the
 *   singular `dockId`. The `statuses` array binds on BOTH load-task and receive-task. The
 *   customer filter binds as the array parameter `customerIds` (singular `customerId` is
 *   ignored) and the assignee filter as `assigneeUserIds`/`userIds`. Door ids are NOT sequential —
 *   live-verified this refresh: DOCK50=570, 51=554, 52=556, 53=552, 54=564, 55=560, 56=575,
 *   57=563, 58=572, 59=571, 60=565, 61=567, 62=566, 63=568, 64=559, 65=573, 66=576, 67=577,
 *   68=574, 69=578, 70=579, 71=580, 72=587.
 *
 *   INTEGRITY: the open population was read exhaustively this refresh — all 23 Bay-4 doors were
 *   swept individually for open load tasks AND open receive tasks (statuses NEW, IN_PROGRESS,
 *   EXCEPTION). No rows were fabricated; every value below is a live count returned by WISE/WMS.
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant,
 *   so durations are aged startTime → 2026-09-16T01:08:00Z — identical to every prior snapshot,
 *   keeping the values comparable across refreshes.
 *
 * SCOPE NOTE (all-time cumulative block): the "All-Time Assignments" totals and the
 * GURUNANDA → Arnulfo cumulative figure are derived from a full row-level rescan of every closed
 * task across 23 doors × 2 task types (several thousand rows). That rescan is NOT part of this
 * refresh, so those cumulative figures keep their last full recomputation stamp
 * (2026-09-13 ~09:45 PDT) and are NOT presented as freshly recomputed. Every live/operational
 * metric in this file was re-pulled from WISE/WMS for the 2026-09-15 snapshot.
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
export const refreshStamp = "Sep 15 ~18:08 PDT";
export const refreshDateLong = "September 15, 2026";
// UTC query window for this snapshot
export const snapshotUtc = "2026-09-16T01:08:00Z";
export const windowUtc = "2026-09-16T01:06:50Z → 2026-09-16T01:08:10Z";

export const doors: DoorRecord[] = [
  // OCCUPIED — door has an in-progress open task (7 doors)
  { door: "DOCK50", status: "Occupied", assignee: "ARNULFO MUNGUIA / daira gonzalez", customer: "KARAKA, LLC / GURUNANDA, LLC", taskIds: ["TASK-5368207", "TASK-5090739"], duration: "329d 04h 46m", anomaly: true },
  { door: "DOCK53", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5368697", "TASK-5368035"], duration: "8h 00m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5368331", "TASK-5338695", "TASK-5364490"], duration: "39d 01h 38m", anomaly: true },
  { door: "DOCK58", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5368714"], duration: "0h 15m", anomaly: false },
  { door: "DOCK59", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5368729"], duration: "0h 13m", anomaly: false },
  { door: "DOCK60", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5368731"], duration: "0h 11m", anomaly: false },
  { door: "DOCK62", status: "Occupied", assignee: "JORGE ANTONIO FRANCO", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365814"], duration: "27h 23m", anomaly: false },

  // RESERVED — door has only a not-started (NEW) open task (3 doors)
  { door: "DOCK55", status: "Reserved", assignee: "JEROME ARANDA", customer: "KARAKA, LLC", taskIds: ["TASK-5368665"], duration: null, anomaly: false },
  { door: "DOCK56", status: "Reserved", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5368737"], duration: null, anomaly: false },
  { door: "DOCK57", status: "Reserved", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5368733"], duration: null, anomaly: false },

  // AVAILABLE — no open load/receive task (13 doors)
  { door: "DOCK51", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK52", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK63", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK64", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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

// Open assignee task counts - Bay 4 DOCK50-DOCK72, open load/receive dock tasks (14 open tasks at
// the 2026-09-15 ~18:08 PDT snapshot: 3 LOAD + 11 RECEIVE on 10 doors, 5 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 6 },
  { name: "DANIELA GONZALEZ", taskCount: 5 },
  { name: "JORGE ANTONIO FRANCO", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
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

// Mix: 3 LOAD (outbound) + 11 RECEIVE (inbound) = 14 open tasks at Bay 4 doors (2026-09-15
// ~18:08 PDT snapshot).
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 3, total: 14 },
  { label: "Inbound", count: 11, total: 14 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 3, total: 14 },
  { label: "Inbound", count: 11, total: 14 },
];

// Schedule: today's (2026-09-15, Tuesday) facility-wide — receipts/loads whose appointment time is
// today (facility-local day, America/Los_Angeles). Completed = receipt status CLOSED (received) /
// load status LOADED+SHIPPED (loaded). Queried live ~18:08 PDT.
// Inbounds: binding receipt appointmentTimeFrom/To window for the 2026-09-15 local day returns
// 58 scheduled receipts, of which 5 are CLOSED (received) ⇒ 8.6%.
// Outbounds: binding load appointmentTimePeriod array filter returns 137 loads scheduled for
// 2026-09-15, of which 109 are completed (104 SHIPPED + 5 LOADED) ⇒ 79.6%.
export const scheduleAvailable = true;
export const scheduledInboundOrders = 58;
export const scheduledOutboundOrders = 137;
export const scheduledInboundReceived = 5;
export const scheduledOutboundLoaded = 109;
export const pctScheduledInboundReceived = (5 / 58) * 100; // 5 of 58 scheduled inbounds received
export const pctScheduledOutboundLoaded = (109 / 137) * 100; // 109 of 137 scheduled loads loaded

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 15, 2026 ~18:08 PDT snapshot)
// 14 open tasks: 3 LOAD (outbound) + 11 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5368207", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (6h 42m)", assignee: "ARNULFO MUNGUIA", door: "DOCK50" },
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (329d 04h 46m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5368697", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (2h 46m)", assignee: "ARNULFO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5368035", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (8h 00m)", assignee: "ARNULFO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5368331", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (4h 55m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (39d 01h 38m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5364490", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (1h 44m)", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5368665", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "JEROME ARANDA", door: "DOCK55" },
  { taskId: "TASK-5368737", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "DANIELA GONZALEZ", door: "DOCK56" },
  { taskId: "TASK-5368733", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "DANIELA GONZALEZ", door: "DOCK57" },
  { taskId: "TASK-5368714", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0h 15m)", assignee: "DANIELA GONZALEZ", door: "DOCK58" },
  { taskId: "TASK-5368729", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0h 13m)", assignee: "DANIELA GONZALEZ", door: "DOCK59" },
  { taskId: "TASK-5368731", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (0h 11m)", assignee: "DANIELA GONZALEZ", door: "DOCK60" },
  { taskId: "TASK-5365814", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (27h 23m)", assignee: "JORGE ANTONIO FRANCO", door: "DOCK62" },
];
