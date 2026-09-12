/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-11 18:48:00 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (DOCK50..DOCK72 ids, re-verified live)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled appointments (today)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (today)
 *     - /mdm/organization/search — customer names (ORG-655875, ORG-585450)
 *
 * SNAPSHOT INSTANT: 2026-09-11 18:48:00 PDT (America/Los_Angeles).
 * UTC QUERY WINDOW: 2026-09-12T01:48:00Z → 2026-09-12T01:49:47Z
 * (all-time rollup re-derived 2026-09-12T01:50:30Z → 2026-09-12T01:50:52Z).
 * API timestamps are UTC; elapsed durations aged UTC → snapshot instant.
 *
 * DELTA vs 2026-09-11 ~11:44 PDT snapshot: Bay-4 open task set 9 → 14 (4 LOAD + 10 RECEIVE).
 * Door map: Occupied 6 / Reserved 0 / Available 17 → Occupied 7 / Reserved 2 / Available 14.
 * DOCK51, DOCK55, DOCK62, DOCK68 newly engaged; DOCK72 and DOCK63 now hold NEW-only
 * (reserved) tasks; DOCK53/54/56/57/63 turned over. All 4 LOAD tasks are PRE_LOAD.
 *
 *   API NOTE: the WMS BAM search-by-paging endpoints repeat page-1 rows for pageNum > 1; every
 *   pull used a single large page (pageSize 500 / 2000) and was de-duplicated by task id. The
 *   `status` filter accepts a single TaskStatus value; the `statuses` array filter also binds.
 *   `dockId` binds on both task searches (string ids for both task types: DOCK50=570 … DOCK72=587).
 *   No rows were fabricated; every value below is a live count. All 23 per-door closed counts
 *   verified rows == totalCount, and the whole pull was reproduced 2/2 passes with identical totals.
 *
 *   FILTER NOTE (correction vs the 09-11 11:44 snapshot): the customer filter on the load/receive
 *   task searches binds ONLY as the ARRAY parameter `customerIds`. The singular `customerId`
 *   parameter is silently IGNORED by the API — a control query with `customerId=ORG-000000`
 *   returns the same count as no customer filter at all (both 1,156 rows for assignee 89). The
 *   previously published GURUNANDA→Arnulfo figure (921) was built on the non-binding singular
 *   parameter and therefore included non-Gurunanda loads. Re-derived with `customerIds`:
 *   uid 89 + {CLOSED,FORCE_CLOSED} + customerIds=[ORG-655875] = 1,115 rows facility-wide, of which
 *   912 sit on Bay-4 doors. The 8 excluded rows (920 − 912) are 7 KARAKA, LLC + 1 ORG-436686.
 *
 *   SCHEDULE NOTE: today's (Fri 2026-09-11) facility-wide schedule at the 18:48 PDT snapshot —
 *   38 scheduled inbound receipts (1 CLOSED-received: 21 IMPORTED + 14 IN_PROGRESS + 1 CLOSED +
 *   1 TASK_COMPLETED + 1 EXCEPTION) and 114 scheduled outbound loads (90 LOADED/SHIPPED: the day's
 *   status split sums exactly to the 114 denominator). Receipt window uses appointmentTime From/To =
 *   2026-09-11T00:00:00 → 23:59:59. The loads set honours only appointmentTimeFrom, so today's
 *   load denominator was taken as the 2026-09-11 vs 2026-09-12 from-population difference
 *   (424 − 310 = 114) and today's loaded count likewise (LOADED 0−0 + SHIPPED 92−2 = 90).
 *
 *   RECONCILIATION NOTE (all-time GURUNANDA → Arnulfo):
 *   The WMS BAM search-by-paging AGGREGATE (totalCount) is NON-DETERMINISTIC when filtered per
 *   door: individual dockId queries intermittently return 0/null, and whole-set counts drift. Any
 *   figure built by summing per-door totalCount can silently lose a door, so the per-door pass
 *   used here fetches ROWS (not counts) and asserts rows == totalCount for all 23 doors.
 *   The authoritative GURUNANDA→Arnulfo figures use a SINGLE facility-wide query per task type,
 *   then a client-side dockId ∈ Bay-4 filter:
 *     LOAD    : customerIds=[ORG-655875], assigneeUserId=89, statuses CLOSED+FORCE_CLOSED
 *               → 1,115 rows facility-wide, of which 912 sit on Bay-4 doors.
 *     RECEIVE : same filters → 2 rows facility-wide, 1 on a Bay-4 door (TASK-5197246, DOCK69).
 *   Reproduced 2/2 passes. Supersedes the published 921 (see FILTER NOTE).
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
export const refreshStamp = "Sep 11 ~18:48 PDT";
export const refreshDateLong = "September 11, 2026";
// UTC query window for this snapshot
export const snapshotUtc = "2026-09-12T01:48:00Z";
export const windowUtc = "2026-09-12T01:48:00Z → 2026-09-12T01:49:47Z";

export const doors: DoorRecord[] = [
  // OCCUPIED — door has an in-progress open task (7 doors)
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez", customer: "GURUNANDA, LLC", taskIds: ["TASK-5090739"], duration: "325d 5h 26m", anomaly: true },
  { door: "DOCK51", status: "Occupied", assignee: "EDUARDO MEJIA / ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5366005", "TASK-5365623"], duration: "5h 28m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "BARTOLO RAMIREZ / CANDY MENDEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365768", "TASK-5365522"], duration: "4h 49m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5338695", "TASK-5364490"], duration: "35d 2h 18m", anomaly: true },
  { door: "DOCK55", status: "Occupied", assignee: "JEROME ARANDA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365675", "TASK-5365676"], duration: "5h 40m", anomaly: false },
  { door: "DOCK62", status: "Occupied", assignee: "RUFINO MUNGUIA / JORGE ANTONIO FRANCO", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365827", "TASK-5365814"], duration: "4h 30m", anomaly: false },
  { door: "DOCK68", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5366062"], duration: "52m", anomaly: false },

  // RESERVED — only NEW (assigned, not started) tasks (2 doors)
  { door: "DOCK63", status: "Reserved", assignee: "DANIELA GONZALEZ", customer: "SIMPLE MODERN", taskIds: ["TASK-5366014"], duration: null, anomaly: false },
  { door: "DOCK72", status: "Reserved", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5366063"], duration: null, anomaly: false },

  // AVAILABLE — no open load/receive task (14 doors)
  { door: "DOCK52", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK56", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK57", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK58", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK59", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK60", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK61", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK64", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK65", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK66", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK67", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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

// Open assignee task counts - Bay 4 DOCK50-DOCK72, open load/receive dock tasks (14 open tasks at
// the 2026-09-11 18:48:00 PDT snapshot: 4 LOAD + 10 RECEIVE on 9 doors)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 3 },
  { name: "DANIELA GONZALEZ", taskCount: 3 },
  { name: "JEROME ARANDA", taskCount: 2 },
  { name: "EDUARDO MEJIA", taskCount: 1 },
  { name: "BARTOLO RAMIREZ", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "JORGE ANTONIO FRANCO", taskCount: 1 },
  { name: "CANDY MENDEZ", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.
// RE-DERIVED LIVE in this refresh (2026-09-12T01:50:30Z → 01:50:52Z) with a robust row-based pass
// (rows == totalCount verified on all 23 doors, both task types), reproduced 2/2:
// 2,764 LOAD + 944 RECEIVE = 3,708 closed transactions.
export const allTimeClosedTotal = 3708;
export const allTimeDistinctAssignees = 81;
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 955 },
  { name: "DANIEL BELTRAN", taskCount: 935 },
  { name: "DANIELA GONZALEZ", taskCount: 378 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR ALVARADO", taskCount: 113 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "Fatima ponce", taskCount: 95 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// "GURUNANDA → Arnulfo" all-time at Bay-4 doors — RECONCILED, row-based, single-query derivation.
// Customer: GURUNANDA, LLC = ORG-655875 (the only Gurunanda CUSTOMER/TITLE org).
// Assignee: "ARNULFO MUNGUIA" resolves to TWO people —
//   uid 89            (amunguia,      employee code 229G)  ← the id used on all Bay-4 task rows
//   uid 1948070158297014384 (employee229G, code 229G)      ← migrated duplicate of 229G, +0 tasks
//   uid 1948070158297014318 (employee0669, code 0669)      ← a DIFFERENT employee, +7 LOAD tasks
// Filtering uid 89 with the BINDING array filter customerIds=[ORG-655875]: 912 LOAD + 1 RECEIVE
// = 913 at Bay-4 doors (reproduced 2/2 passes). NOTE: the earlier published 921 was derived with
// the non-binding singular `customerId` parameter and over-counted by 8 (7 KARAKA + 1 ORG-436686).
export const guruArnulfoAllTimeTotal = 913;
export const guruArnulfoAllTimeLoad = 912;
export const guruArnulfoAllTimeReceive = 1;
// Same-named second employee (code 0669) — shown only as a caveat, NOT in the headline figure.
export const guruArnulfoAltSameNameLoad = 919;
export const guruArnulfoAltSameNameTotal = 920;

// Mix: 4 LOAD (outbound) + 10 RECEIVE (inbound) = 14 open tasks at Bay 4 doors (2026-09-11 18:48
// PDT snapshot). Prior 11:44 PDT snapshot was 2 LOAD + 7 RECEIVE = 9.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 4, total: 14 },
  { label: "Inbound", count: 10, total: 14 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 4, total: 14 },
  { label: "Inbound", count: 10, total: 14 },
];

// Schedule: today's (2026-09-11, Friday) facility-wide — receipts/loads whose appointment time is
// today (facility-local day, America/Los_Angeles). Completed = receipt status CLOSED (received) /
// load status LOADED+SHIPPED (loaded). Queried live ~18:48 PDT.
export const scheduleAvailable = true;
export const scheduledInboundOrders = 38;
export const scheduledOutboundOrders = 114;
export const scheduledInboundReceived = 1;
export const scheduledOutboundLoaded = 90;
export const pctScheduledInboundReceived = 2.6; // 1 of 38 scheduled inbounds received (by 18:48 PDT)
export const pctScheduledOutboundLoaded = 78.9; // 90 of 114 scheduled outbound loads loaded (by 18:48 PDT)

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 11, 2026 18:48:00 PDT snapshot)
// 14 open tasks: 4 LOAD (outbound) + 10 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (325d 5h 26m) ⚠ STALE — RN-5002143 CLOSED", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5366005", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (31m) — PRE_LOAD, 5 loads LOADING (LOAD-5038645/46/47, LOAD-5038572, LOAD-5038574)", assignee: "EDUARDO MEJIA", door: "DOCK51" },
  { taskId: "TASK-5365623", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (5h 28m) — PRE_LOAD, 4 LOADED + 1 LOADING (LOAD-5038393/94, LOAD-5038411, LOAD-5038253 LOADED; LOAD-5038570 LOADING)", assignee: "ARNULFO MUNGUIA", door: "DOCK51" },
  { taskId: "TASK-5365768", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (4h 49m) — PRE_LOAD, 6 loads LOADED (LOAD-5038409/10, LOAD-5038575/76/78, LOAD-5038580)", assignee: "BARTOLO RAMIREZ", door: "DOCK53" },
  { taskId: "TASK-5365522", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (3h 24m) — RN-5010087/88/89 IN_PROGRESS", assignee: "CANDY MENDEZ", door: "DOCK53" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (35d 2h 18m) ⚠ STALE — LOAD-5035487 SHIPPED", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5364490", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — RN-191995 IMPORTED", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5365675", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (5h 40m) — RN-5010237 IN_PROGRESS", assignee: "JEROME ARANDA", door: "DOCK55" },
  { taskId: "TASK-5365676", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — RN-5010237 IN_PROGRESS ⚠ duplicate open task on the same receipt as TASK-5365675", assignee: "JEROME ARANDA", door: "DOCK55" },
  { taskId: "TASK-5365827", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (4h 30m) — RN-192207 IN_PROGRESS", assignee: "RUFINO MUNGUIA", door: "DOCK62" },
  { taskId: "TASK-5365814", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — RN-5009964 IMPORTED", assignee: "JORGE ANTONIO FRANCO", door: "DOCK62" },
  { taskId: "TASK-5366014", dns: "RECEIVE NEW", customer: "SIMPLE MODERN", pieces: "NEW — RN-191943 IN_PROGRESS", assignee: "DANIELA GONZALEZ", door: "DOCK63" },
  { taskId: "TASK-5366062", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (52m) — RN-5010146 IN_PROGRESS", assignee: "DANIELA GONZALEZ", door: "DOCK68" },
  { taskId: "TASK-5366063", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — RN-5010224 IMPORTED", assignee: "DANIELA GONZALEZ", door: "DOCK72" },
];
