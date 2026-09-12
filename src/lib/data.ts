/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-12 11:16:21 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (DOCK50..DOCK72 ids, re-verified live)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled appointments (today)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (today)
 *     - /mdm/organization/search — customer names (ORG-655875)
 *
 * SNAPSHOT INSTANT: 2026-09-12 11:16:21 PDT (America/Los_Angeles), Saturday.
 * UTC QUERY WINDOW: 2026-09-12T18:14:07Z → 2026-09-12T18:16:21Z.
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 *
 * API NOTE: the WMS BAM search-by-paging endpoints repeat page-1 rows for pageNum > 1; every pull
 *   used a single large page and was de-duplicated by task id. `dockId` binds as a string id on both
 *   task searches. Door ids are NOT sequential — live-verified: DOCK50=570, 51=554, 52=556, 53=552,
 *   54=564, 55=560, 56=575, 57=563, 58=572, 59=571, 60=565, 61=567, 62=566, 63=568, 64=559, 65=573,
 *   66=576, 67=577, 68=574, 69=578, 70=579, 71=580, 72=587 (dockId ↔ dockName agreed on 100% of
 *   Bay-4 rows).
 *
 *   INTEGRITY: every closed-population pull asserted rows == totalCount (load-task 18,427/18,427;
 *   receive-task 15,385/15,385; open sets 33/33 and 81/81) and was reproduced twice with identical
 *   totals. No rows were fabricated; every value below is a live count.
 *
 *   FILTER NOTE: the customer filter on the load/receive task searches binds ONLY as the ARRAY
 *   parameter `customerIds`. The singular `customerId` parameter is silently IGNORED by the API.
 *
 *   TIMESTAMP NOTE (correction vs prior snapshots): the API returns FACILITY-LOCAL wall-clock
 *   timestamps, not UTC. Durations below are aged local → the 2026-09-12 11:16:21 PDT snapshot
 *   instant. (Previously published durations aged UTC; three figures lengthened by ~16h vs the
 *   09-11 18:48 PDT snapshot for that reason.)
 *
 * DELTA vs 2026-09-11 18:48 PDT snapshot: Bay-4 open task set 14 → 13 (5 LOAD + 8 RECEIVE).
 *   Door map: Occupied 7 / Reserved 2 / Available 14 → Occupied 7 / Reserved 0 / Available 16
 *   (DOCK63 and DOCK68 released; DOCK72 became Occupied; DOCK55 gained TASK-5331094).
 *   All-time closed 3,708 → 3,710. GURUNANDA → Arnulfo unchanged at 913.
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
export const refreshStamp = "Sep 12 ~11:16 PDT";
export const refreshDateLong = "September 12, 2026";
// UTC query window for this snapshot
export const snapshotUtc = "2026-09-12T18:14:07Z";
export const windowUtc = "2026-09-12T18:14:07Z → 2026-09-12T18:16:21Z";

export const doors: DoorRecord[] = [
  // OCCUPIED — door has an in-progress open task (7 doors)
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez", customer: "GURUNANDA, LLC", taskIds: ["TASK-5090739"], duration: "325d 21h 55m", anomaly: true },
  { door: "DOCK51", status: "Occupied", assignee: "EDUARDO MEJIA / ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5366005", "TASK-5365623"], duration: "21h 56m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "BARTOLO RAMIREZ / CANDY MENDEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365768", "TASK-5365522"], duration: "21h 17m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5338695", "TASK-5364490"], duration: "35d 18h 46m", anomaly: true },
  { door: "DOCK55", status: "Occupied", assignee: "JULIO CESAR ALVARADO / JEROME ARANDA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5331094", "TASK-5365675", "TASK-5365676"], duration: "43d 23h 42m", anomaly: true },
  { door: "DOCK62", status: "Occupied", assignee: "RUFINO MUNGUIA / JORGE ANTONIO FRANCO", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365827", "TASK-5365814"], duration: "20h 59m", anomaly: false },
  { door: "DOCK72", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5366063"], duration: "14h 08m", anomaly: false },

  // AVAILABLE — no open load/receive task (16 doors)
  { door: "DOCK52", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK56", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK57", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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

// Open assignee task counts - Bay 4 DOCK50-DOCK72, open load/receive dock tasks (13 open tasks at
// the 2026-09-12 11:16:21 PDT snapshot: 5 LOAD + 8 RECEIVE on 7 doors, 10 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 3 },
  { name: "JEROME ARANDA", taskCount: 2 },
  { name: "EDUARDO MEJIA", taskCount: 1 },
  { name: "BARTOLO RAMIREZ", taskCount: 1 },
  { name: "JULIO CESAR ALVARADO", taskCount: 1 },
  { name: "DANIELA GONZALEZ", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "JORGE ANTONIO FRANCO", taskCount: 1 },
  { name: "CANDY MENDEZ", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// RE-DERIVED LIVE in this refresh (2026-09-12T18:14:07Z → 18:16:21Z) with a robust row-based pass
// (rows == totalCount verified on all 23 doors, both task types), reproduced 2/2:
// 2,763 LOAD + 947 RECEIVE = 3,710 closed transactions.
export const allTimeClosedTotal = 3710;
export const allTimeDistinctAssignees = 81;
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

// "GURUNANDA → Arnulfo" all-time at Bay-4 doors — row-based, single-query derivation.
// Customer: GURUNANDA, LLC = ORG-655875. Assignee: ARNULFO MUNGUIA, uid 89 (userName amunguia,
// employee code 229G) — the id on every Bay-4 task row. Filtering uid 89 with the BINDING array
// filter customerIds=[ORG-655875]: 912 LOAD + 1 RECEIVE = 913 at Bay-4 doors.
// (Facility-wide: 1,115 LOAD + 2 RECEIVE; the receive row on a Bay-4 door is TASK-5197246, DOCK69.)
export const guruArnulfoAllTimeTotal = 913;
export const guruArnulfoAllTimeLoad = 912;
export const guruArnulfoAllTimeReceive = 1;
// A DIFFERENT employee who shares the name — uid 1948070158297014318 (employee code 0669) adds 7
// Bay-4 GURUNANDA closed LOADs; including him would give 920. Shown only as a caveat, NOT in the
// headline figure. (uid 1948070158297014384 does not resolve; uid 1948070158297014344 = DANIEL
// BELTRAN, a separate person — corrected vs the earlier "migrated duplicate" note.)
export const guruArnulfoAltSameNameLoad = 919;
export const guruArnulfoAltSameNameTotal = 920;

// Mix: 5 LOAD (outbound) + 8 RECEIVE (inbound) = 13 open tasks at Bay 4 doors (2026-09-12 11:16:21
// PDT snapshot). Prior 09-11 18:48 PDT snapshot was 4 LOAD + 10 RECEIVE = 14.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 13 },
  { label: "Inbound", count: 8, total: 13 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 13 },
  { label: "Inbound", count: 8, total: 13 },
];

// Schedule: today's (2026-09-12, Saturday) facility-wide — receipts/loads whose appointment time is
// today (facility-local day, America/Los_Angeles). Completed = receipt status CLOSED (received) /
// load status LOADED+SHIPPED (loaded). Queried live ~11:16 PDT.
// Inbounds: appointmentTime 2026-09-12T00:00:00 → 23:59:59 ⇒ 2 scheduled receipts, 0 CLOSED (both
// IMPORTED) ⇒ 0.0%. Outbounds: no Sat-2026-09-12 load appointment population at all (both the
// appointmentTimePeriod binding and the consecutive-day from-population difference give 0), so the
// outbound denominator is 0 and the metric renders as n/a rather than a fabricated percentage.
export const scheduleAvailable = true;
export const scheduledInboundOrders = 2;
export const scheduledOutboundOrders = 0;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 0;
export const pctScheduledInboundReceived = 0; // 0 of 2 scheduled inbounds received (both still IMPORTED)
export const pctScheduledOutboundLoaded = 0; // 0 of 0 scheduled outbound loads — no population today (n/a)

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 12, 2026 11:16:21 PDT snapshot)
// 13 open tasks: 5 LOAD (outbound) + 8 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (325d 21h 55m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5366005", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (17h 00m)", assignee: "EDUARDO MEJIA", door: "DOCK51" },
  { taskId: "TASK-5365623", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (21h 56m)", assignee: "ARNULFO MUNGUIA", door: "DOCK51" },
  { taskId: "TASK-5365768", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (21h 17m)", assignee: "BARTOLO RAMIREZ", door: "DOCK53" },
  { taskId: "TASK-5365522", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (19h 52m)", assignee: "CANDY MENDEZ", door: "DOCK53" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (35d 18h 46m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5364490", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5331094", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (43d 23h 42m) ⚠ STALE", assignee: "JULIO CESAR ALVARADO", door: "DOCK55" },
  { taskId: "TASK-5365675", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (22h 08m) — RN-5010237", assignee: "JEROME ARANDA", door: "DOCK55" },
  { taskId: "TASK-5365676", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started ⚠ duplicate open task on the same receipt as TASK-5365675 (RN-5010237)", assignee: "JEROME ARANDA", door: "DOCK55" },
  { taskId: "TASK-5365827", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (20h 59m)", assignee: "RUFINO MUNGUIA", door: "DOCK62" },
  { taskId: "TASK-5365814", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "JORGE ANTONIO FRANCO", door: "DOCK62" },
  { taskId: "TASK-5366063", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (14h 08m)", assignee: "DANIELA GONZALEZ", door: "DOCK72" },
];
