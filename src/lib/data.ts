/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-13 09:45:00 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (DOCK50..DOCK72 ids, re-verified live 23/23)
 *     - /wms-bam/outbound/load-task/search-by-paging — load tasks per door
 *     - /wms-bam/inbound/receive-task/search-by-paging — receive tasks per door
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled appointments (appointmentTime)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod)
 *     - /wms-bam/user/search-by-paging — assignee display names (userIds array filter)
 *     - /wms-bam/organization/search-by-paging — customer names (keyword)
 *
 * SNAPSHOT INSTANT: 2026-09-13 09:45:00 PDT (America/Los_Angeles), Sunday.
 * UTC QUERY WINDOW: 2026-09-13T16:43:36Z → 2026-09-13T16:46:30Z.
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * API NOTE: the WMS BAM search-by-paging endpoints repeat page-1 rows for pageNum > 1; every pull
 *   used a single large page (pageSize 5000) and asserted rows == totalCount for all 46 door × type
 *   queries (open AND all-time closed). `dockId` binds as a string id on load-task and as a number
 *   on receive-task. Door ids are NOT sequential — live-verified this refresh: DOCK50=570, 51=554,
 *   52=556, 53=552, 54=564, 55=560, 56=575, 57=563, 58=572, 59=571, 60=565, 61=567, 62=566, 63=568,
 *   64=559, 65=573, 66=576, 67=577, 68=574, 69=578, 70=579, 71=580, 72=587.
 *
 *   INTEGRITY: open population 13/13, closed population 3,710/3,710 asserted rows == totalCount and
 *   de-duplicated by task id (0 duplicate ids observed). No rows were fabricated; every value below
 *   is a live count.
 *
 *   FILTER NOTE: the customer filter on the load/receive task searches binds ONLY as the ARRAY
 *   parameter `customerIds`. The singular `customerId` is silently IGNORED by the API. Likewise the
 *   assignee filter binds as `assigneeUserIds` / `userIds`, not the singular form.
 *
 *   TIMESTAMP NOTE: task startTime values are facility-local wall clock (America/Los_Angeles), and
 *   durations are aged startTime → snapshot instant on that same wall-clock basis — identical to
 *   every prior snapshot, so the values stay comparable across refreshes.
 *
 * DELTA vs 2026-09-13 07:07 PDT snapshot: NO population change in any figure — doors 7 occupied /
 *   0 reserved / 16 available, 13 open Bay-4 tasks (5 LOAD + 8 RECEIVE) on the same 7 doors, same 10
 *   assignees, all-time closed 3,710 across 81 assignees, GURUNANDA → Arnulfo 913. The only movement
 *   is elapsed time: durations aged ~2h38m (e.g. DOCK72 1d 09h 59m → 1d 12h 37m; DOCK50 326d 17h 45m
 *   → 326d 20h 23m). Today (Sun 2026-09-13) has no scheduled receipt/load appointment population.
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
export const refreshStamp = "Sep 13 ~09:45 PDT";
export const refreshDateLong = "September 13, 2026";
// UTC query window for this snapshot
export const snapshotUtc = "2026-09-13T16:43:36Z";
export const windowUtc = "2026-09-13T16:43:36Z → 2026-09-13T16:46:30Z";

export const doors: DoorRecord[] = [
  // OCCUPIED — door has an in-progress open task (7 doors)
  { door: "DOCK50", status: "Occupied", assignee: "daira gonzalez", customer: "GURUNANDA, LLC", taskIds: ["TASK-5090739"], duration: "326d 20h 23m", anomaly: true },
  { door: "DOCK51", status: "Occupied", assignee: "ARNULFO MUNGUIA / EDUARDO MEJIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5366005", "TASK-5365623"], duration: "1d 20h 25m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "BARTOLO RAMIREZ / CANDY MENDEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365768", "TASK-5365522"], duration: "1d 19h 46m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5338695", "TASK-5364490"], duration: "36d 17h 15m", anomaly: true },
  { door: "DOCK55", status: "Occupied", assignee: "JULIO CESAR ALVARADO / JEROME ARANDA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5331094", "TASK-5365675", "TASK-5365676"], duration: "44d 22h 11m", anomaly: true },
  { door: "DOCK62", status: "Occupied", assignee: "RUFINO MUNGUIA / JORGE ANTONIO FRANCO", customer: "GURUNANDA, LLC", taskIds: ["TASK-5365827", "TASK-5365814"], duration: "1d 19h 27m", anomaly: false },
  { door: "DOCK72", status: "Occupied", assignee: "DANIELA GONZALEZ", customer: "GURUNANDA, LLC", taskIds: ["TASK-5366063"], duration: "1d 12h 37m", anomaly: false },

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
// the 2026-09-13 09:45:00 PDT snapshot: 5 LOAD + 8 RECEIVE on 7 doors, 10 distinct assignees)
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
// RE-VERIFIED LIVE in this refresh (2026-09-13T16:43:36Z → 16:46:30Z) — rows == totalCount asserted
// on all 23 doors, both task types; 2,763 LOAD + 947 RECEIVE = 3,710 closed transactions. Rolled up
// by display name (81 names / 91 user ids). Unchanged vs the 2026-09-13 07:07 PDT snapshot.
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
// Customer: GURUNANDA, LLC = ORG-655875 (live-resolved by keyword). Assignee: ARNULFO MUNGUIA,
// uid 89 (userName amunguia, employee code 229G) — the id on every Bay-4 task row for this name.
// Filtering uid 89 with the BINDING array filter customerIds=[ORG-655875]: 912 LOAD + 1 RECEIVE =
// 913 at Bay-4 doors — unchanged this refresh (2026-09-13 09:45:00 PDT). (The receive row on a
// Bay-4 door is TASK-5197246, DOCK69.)
export const guruArnulfoAllTimeTotal = 913;
export const guruArnulfoAllTimeLoad = 912;
export const guruArnulfoAllTimeReceive = 1;
// A DIFFERENT employee who shares the name — uid 1948070158297014318 adds 7 Bay-4 GURUNANDA closed
// LOADs; including him would give 920. Shown only as a caveat, NOT in the headline figure.
export const guruArnulfoAltSameNameLoad = 919;
export const guruArnulfoAltSameNameTotal = 920;

// Mix: 5 LOAD (outbound) + 8 RECEIVE (inbound) = 13 open tasks at Bay 4 doors (2026-09-13 09:45:00
// PDT snapshot) — unchanged vs the 2026-09-13 07:07 PDT snapshot (13 open, 5 LOAD + 8 RECEIVE).
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 13 },
  { label: "Inbound", count: 8, total: 13 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 13 },
  { label: "Inbound", count: 8, total: 13 },
];

// Schedule: today's (2026-09-13, Sunday) facility-wide — receipts/loads whose appointment time is
// today (facility-local day, America/Los_Angeles). Completed = receipt status CLOSED (received) /
// load status LOADED+SHIPPED (loaded). Queried live ~09:45 PDT.
// Inbounds: the binding receipt appointmentTime window for the 2026-09-13 local day returns 0
// receipts (the appointment population runs 2026-09-11 → 2026-09-12 → 2026-09-14 with a Sunday gap),
// so the inbound denominator is 0 ⇒ n/a rather than a fabricated percentage.
// Outbounds: the binding appointmentTimePeriod array filter likewise returns 0 loads for 2026-09-13,
// so the outbound denominator is 0 ⇒ n/a.
// Reference windows verified live this refresh: 2026-09-11 = 34 scheduled receipts (1 CLOSED) and
// 115 scheduled loads (91 SHIPPED); 2026-09-14 = 28 scheduled receipts (0 received) and 122 loads
// (0 loaded).
export const scheduleAvailable = true;
export const scheduledInboundOrders = 0;
export const scheduledOutboundOrders = 0;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 0;
export const pctScheduledInboundReceived = 0; // 0 of 0 scheduled inbounds — no population today (n/a)
export const pctScheduledOutboundLoaded = 0; // 0 of 0 scheduled outbound loads — no population today (n/a)

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 13, 2026 09:45:00 PDT snapshot)
// 13 open tasks: 5 LOAD (outbound) + 8 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (326d 20h 23m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5366005", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 15h 28m)", assignee: "EDUARDO MEJIA", door: "DOCK51" },
  { taskId: "TASK-5365623", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 20h 25m)", assignee: "ARNULFO MUNGUIA", door: "DOCK51" },
  { taskId: "TASK-5365768", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 19h 46m)", assignee: "BARTOLO RAMIREZ", door: "DOCK53" },
  { taskId: "TASK-5365522", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 18h 21m)", assignee: "CANDY MENDEZ", door: "DOCK53" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (36d 17h 15m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5364490", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5331094", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (44d 22h 11m) ⚠ STALE", assignee: "JULIO CESAR ALVARADO", door: "DOCK55" },
  { taskId: "TASK-5365675", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 20h 37m) — RN-5010237", assignee: "JEROME ARANDA", door: "DOCK55" },
  { taskId: "TASK-5365676", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started ⚠ duplicate open task on the same receipt as TASK-5365675 (RN-5010237)", assignee: "JEROME ARANDA", door: "DOCK55" },
  { taskId: "TASK-5365827", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 19h 27m)", assignee: "RUFINO MUNGUIA", door: "DOCK62" },
  { taskId: "TASK-5365814", dns: "RECEIVE NEW", customer: "GURUNANDA, LLC", pieces: "NEW — not started", assignee: "JORGE ANTONIO FRANCO", door: "DOCK62" },
  { taskId: "TASK-5366063", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (1d 12h 37m)", assignee: "DANIELA GONZALEZ", door: "DOCK72" },
];
