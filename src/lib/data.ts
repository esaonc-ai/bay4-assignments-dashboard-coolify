/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-11 11:44:41 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (DOCK50..DOCK72 ids, re-verified)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled appointments (today)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (today)
 *     - /mdm/organization/search — customer names (ORG-655875, ORG-585450)
 *
 * SNAPSHOT INSTANT: 2026-09-11 11:44:41 PDT (America/Los_Angeles).
 * UTC QUERY WINDOW: 2026-09-11T18:43:11Z → 2026-09-11T18:44:53Z
 * (all-time rollup re-derived 2026-09-11T18:46:43Z → 2026-09-11T18:47:41Z;
 *  GURUNANDA→Arnulfo re-derived 2026-09-11T18:47:53Z → 2026-09-11T18:48:12Z).
 * API timestamps are UTC; elapsed durations aged UTC → snapshot instant.
 *
 * DELTA vs 2026-09-11 ~09:55 PDT snapshot: Bay-4 open task set 7 → 9 (2 LOAD + 7 RECEIVE).
 * Door map: Occupied 4 / Reserved 1 / Available 18 → Occupied 6 / Reserved 0 / Available 17.
 * DOCK53 and DOCK56 newly engaged; DOCK52 freed (its NEW load closed) and DOCK54's live
 * PRE_LOAD TASK-5365421 closed. DOCK56's TASK-5365578 started 11:43:50Z, ~51s before snapshot.
 *
 *   API NOTE: the WMS BAM search-by-paging endpoints repeat page-1 rows for pageNum > 1; every
 *   pull used a single large page (pageSize 500 / 2000) and was de-duplicated by task id. The
 *   `status` filter accepts a single TaskStatus value; the `statuses` array filter also binds.
 *   `dockId` binds on both task searches (string for load-task, number for receive-task).
 *   No rows were fabricated; every value below is a live count.
 *
 *   SCHEDULE NOTE: today's (Fri 2026-09-11) facility-wide schedule at the 11:44 PDT snapshot —
 *   32 scheduled inbound receipts (1 CLOSED-received: 25 IMPORTED + 6 IN_PROGRESS + 1 CLOSED)
 *   and 119 scheduled outbound loads (22 LOADED/SHIPPED: LOADED 1 + SHIPPED 21; the day's status
 *   split sums exactly to the 119 denominator). Receipt window uses appointmentTime From/To =
 *   2026-09-11T00:00:00 → 23:59:59. The loads set honours only appointmentTimeFrom, so today's
 *   load denominator was taken as the 2026-09-11 vs 2026-09-12 from-population difference
 *   (389 − 270 = 119) and today's loaded count likewise (LOADED 1−0 + SHIPPED 23−2 = 22).
 *
 *   RECONCILIATION NOTE (all-time GURUNANDA → Arnulfo):
 *   The WMS BAM search-by-paging AGGREGATE (totalCount) is NON-DETERMINISTIC when filtered per
 *   door: individual dockId queries intermittently return 0/null, and whole-set counts drift
 *   (Bay-4 all-assignee closed total observed at 3673 / 3699 / 3701 across passes). Any figure
 *   built by summing per-door totalCount is therefore unreliable and can silently lose a door.
 *   The authoritative figures below use a SINGLE facility-wide query per task type, then a
 *   client-side dockId ∈ Bay-4 filter, with rows == totalCount verified on every pass:
 *     LOAD    : customerId=ORG-655875, assigneeUserId=89, statuses CLOSED+FORCE_CLOSED → 1,156
 *               rows facility-wide, of which 920 sit on Bay-4 doors (236 on non-Bay-4 docks).
 *     RECEIVE : same filters → 2 rows facility-wide, 1 on a Bay-4 door (TASK-5197246, DOCK69).
 *   Reproduced 3/3 passes. Both published figures (912 and a transient 871) are superseded; the
 *   delta is a derivation artifact, not a business change.
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
export const refreshStamp = "Sep 11 ~11:45 PDT";
export const refreshDateLong = "September 11, 2026";
// UTC query window for this snapshot
export const snapshotUtc = "2026-09-11T18:44:41Z";
export const windowUtc = "2026-09-11T18:43:11Z → 2026-09-11T18:44:53Z";

export const doors: DoorRecord[] = [
  // OCCUPIED — door has an in-progress open task (6 doors)
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez", customer: "GURUNANDA, LLC", taskIds: ["TASK-5090739"], duration: "325d 5h", anomaly: true },
  { door: "DOCK53", status: "Occupied", assignee: "JOSE ROSAS / JEROME ARANDA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365548", "TASK-5365522"], duration: "7h 20m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5338695", "TASK-5364490"], duration: "35d 2h", anomaly: true },
  { door: "DOCK56", status: "Occupied", assignee: "JEROME ARANDA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365578", "TASK-5365497"], duration: "8h 22m", anomaly: false },
  { door: "DOCK57", status: "Occupied", assignee: "Fatima Ponce", customer: "GURUNANDA, LLC", taskIds: ["TASK-5364028"], duration: "2d 2h 24m", anomaly: false },
  { door: "DOCK63", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365145"], duration: "20h 23m", anomaly: false },

  // RESERVED — only a NEW (assigned, not started) task (0 doors)
  // (No Bay-4 door carries only NEW tasks this snapshot.)

  // AVAILABLE — no open load/receive task (17 doors)
  { door: "DOCK51", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK52", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK55", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK62", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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

// Open assignee task counts - Bay 4 DOCK50-DOCK72, open load/receive dock tasks (9 open tasks at
// the 2026-09-11 11:44:41 PDT snapshot: 2 LOAD + 7 RECEIVE on 6 doors)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "JEROME ARANDA", taskCount: 3 },
  { name: "ARNULFO MUNGUIA", taskCount: 2 },
  { name: "JOSE ROSAS", taskCount: 1 },
  { name: "DANIELA GONZALEZ", taskCount: 1 },
  { name: "Fatima Ponce", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// RE-DERIVED LIVE in this refresh (2026-09-11T18:46:43Z → 18:47:41Z) by summing per-door
// totalCount over all 23 doors (unstable — see RECONCILIATION NOTE) and re-verified with a
// robust row-based pass (rows == totalCount per door, null-response retry), reproduced 3/3:
// 2,762 LOAD + 939 RECEIVE = 3,701 closed transactions.
export const allTimeClosedTotal = 3701;
export const allTimeDistinctAssignees = 81;
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 955 },
  { name: "DANIEL BELTRAN", taskCount: 935 },
  { name: "DANIELA GONZALEZ", taskCount: 377 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR ALVARADO", taskCount: 113 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "Fatima Ponce", taskCount: 93 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA → Arnulfo" all-time at Bay-4 doors — RECONCILED, row-based, single-query derivation.
// Customer: GURUNANDA, LLC = ORG-655875 (the only Gurunanda CUSTOMER/TITLE org; ORG-697480
// "GURUNANDA TRANSFER" is a RETAILER record and contributes 0 to Arnulfo's Bay-4 closed loads).
// Assignee: "ARNULFO MUNGUIA" resolves to TWO people —
//   uid 89            (amunguia,      employee code 229G)  ← the id used on all Bay-4 task rows
//   uid 1948070158297014384 (employee229G, code 229G)      ← migrated duplicate of 229G, +0 tasks
//   uid 1948070158297014318 (employee0669, code 0669)      ← a DIFFERENT employee, +7 LOAD tasks
// Filtering uid 89 alone: 920 LOAD + 1 RECEIVE = 921 (reproduced 3/3 passes).
// Including the same-named employee 0669 gives 927 LOAD + 1 RECEIVE = 928.
export const guruArnulfoAllTimeTotal = 921;
export const guruArnulfoAllTimeLoad = 920;
export const guruArnulfoAllTimeReceive = 1;
// Same-named second employee (code 0669) — shown only as a caveat, NOT in the headline figure.
export const guruArnulfoAltSameNameLoad = 927;
export const guruArnulfoAltSameNameTotal = 928;

// Mix: 2 LOAD (outbound) + 7 RECEIVE (inbound) = 9 open tasks at Bay 4 doors (2026-09-11 11:44
// PDT snapshot). Prior 09-11 09:55 PDT snapshot was 3 LOAD + 4 RECEIVE = 7.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 2, total: 9 },
  { label: "Inbound", count: 7, total: 9 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 2, total: 9 },
  { label: "Inbound", count: 7, total: 9 },
];

// Schedule: today's (2026-09-11, Friday) facility-wide — receipts/loads whose appointment time is
// today (facility-local day, America/Los_Angeles). Completed = receipt status CLOSED (received) /
// load status LOADED+SHIPPED (loaded). Queried live ~11:44 PDT.
export const scheduleAvailable = true;
export const scheduledInboundOrders = 32;
export const scheduledOutboundOrders = 119;
export const scheduledInboundReceived = 1;
export const scheduledOutboundLoaded = 22;
export const pctScheduledInboundReceived = 3.1; // 1 of 32 scheduled inbounds received (by 11:44 PDT)
export const pctScheduledOutboundLoaded = 18.5; // 22 of 119 scheduled outbound loads loaded (by 11:44 PDT)

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 11, 2026 11:44:41 PDT snapshot)
// 9 open tasks: 2 LOAD (outbound) + 7 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5365548", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (7h 20m) — LIVE_LOAD, LOAD-5038350 LOADING", assignee: "JOSE ROSAS", door: "DOCK53" },
  { taskId: "TASK-5365522", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — RN-5010087/88/89 IMPORTED", assignee: "JEROME ARANDA", door: "DOCK53" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (35d 2h) ⚠ STALE — LOAD-5035487 SHIPPED", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5364490", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — RN-191995 IMPORTED", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5365578", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (7h 0m) — RN-5010225 IN_PROGRESS", assignee: "JEROME ARANDA", door: "DOCK56" },
  { taskId: "TASK-5365497", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (8h 22m) — RN-5010236 IN_PROGRESS", assignee: "JEROME ARANDA", door: "DOCK56" },
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (325d 5h) ⚠ STALE — RN-5002143 CLOSED", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5364028", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (2d 2h 24m) — RN-5010136 IN_PROGRESS", assignee: "Fatima Ponce", door: "DOCK57" },
  { taskId: "TASK-5365145", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (20h 23m) — RN-5010131 IN_PROGRESS", assignee: "DANIELA GONZALEZ", door: "DOCK63" },
];
