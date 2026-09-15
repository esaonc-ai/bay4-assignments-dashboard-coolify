/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-14 ~18:31 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (DOCK50..DOCK72 ids, re-verified live 23/23)
 *     - /wms-bam/outbound/load-task/search-by-paging — load tasks per door
 *     - /wms-bam/inbound/receive-task/search-by-paging — receive tasks per door
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled appointments (appointmentTimeFrom/To)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod)
 *     - /wms-bam/user/search-by-paging — assignee display names (userIds array filter)
 *     - /wms-bam/organization/search-by-paging — customer names (keyword)
 *
 * SNAPSHOT INSTANT: 2026-09-14 18:31 PDT (America/Los_Angeles), Monday.
 * UTC QUERY WINDOW: 2026-09-15T01:26:33Z → 2026-09-15T01:31:00Z.
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * API NOTE: on this endpoint family `dockId` (singular) binds on both load-task and receive-task;
 *   the plural `dockIds` is silently IGNORED and a comma list / array for `dockId` is rejected.
 *   load-task binds a single `status` string; receive-task binds a `statuses` array. The customer
 *   filter binds ONLY as the array parameter `customerIds` (singular `customerId` is ignored) and
 *   the assignee filter as `assigneeUserIds`. Door ids are NOT sequential — live-verified this
 *   refresh: DOCK50=570, 51=554, 52=556, 53=552, 54=564, 55=560, 56=575, 57=563, 58=572, 59=571,
 *   60=565, 61=567, 62=566, 63=568, 64=559, 65=573, 66=576, 67=577, 68=574, 69=578, 70=579, 71=580, 72=587.
 *
 *   INTEGRITY: the open population was read exhaustively — facility-wide open load tasks
 *   (IN_PROGRESS 16 / NEW 10 / EXCEPTION 0) filtered to Bay-4 dock ids, and every one of the 23
 *   Bay-4 doors was swept individually for open receive tasks (statuses NEW, IN_PROGRESS,
 *   EXCEPTION). No rows were fabricated; every value below is a live count.
 *
 *   TIMESTAMP NOTE: task startTime values are read on the same UTC frame as the snapshot instant,
 *   so durations are aged startTime → 2026-09-15T01:31:00Z — identical to every prior snapshot,
 *   keeping the values comparable across refreshes.
 *
 * SCOPE NOTE (all-time cumulative block): the "All-Time Assignments" totals and the
 * GURUNANDA → Arnulfo cumulative figure are derived from a full row-level rescan of every closed
 * task across 23 doors × 2 task types (several thousand rows). That rescan is not part of this
 * refresh, so those cumulative figures keep their last full recomputation stamp
 * (2026-09-13 ~09:45 PDT) and are NOT presented as freshly recomputed. Every live/operational
 * metric in this file was re-pulled from WISE/WMS for the 2026-09-14 snapshot.
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
export const refreshStamp = "Sep 14 ~18:31 PDT";
export const refreshDateLong = "September 14, 2026";
// UTC query window for this snapshot
export const snapshotUtc = "2026-09-15T01:31:00Z";
export const windowUtc = "2026-09-15T01:26:33Z → 2026-09-15T01:31:00Z";

export const doors: DoorRecord[] = [
  // OCCUPIED — door has an in-progress open task (6 doors)
  { door: "DOCK50", status: "Occupied", assignee: "ARNULFO MUNGUIA / daira gonzalez", customer: "GURUNANDA, LLC", taskIds: ["TASK-5367310", "TASK-5090739"], duration: "328d 05h 10m", anomaly: true },
  { door: "DOCK52", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5366883"], duration: "8h 14m", anomaly: false },
  { door: "DOCK53", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5367120"], duration: "6h 06m", anomaly: false },
  { door: "DOCK54", status: "Occupied", assignee: "ARNULFO MUNGUIA", customer: "GURUNANDA, LLC / KARAKA, LLC", taskIds: ["TASK-5338695", "TASK-5364490"], duration: "38d 02h 02m", anomaly: true },
  { door: "DOCK62", status: "Occupied", assignee: "ARNULFO MUNGUIA / JORGE ANTONIO FRANCO", customer: "KARAKA, LLC / GURUNANDA, LLC", taskIds: ["TASK-5366937", "TASK-5365814"], duration: "6h 53m", anomaly: false },
  { door: "DOCK63", status: "Occupied", assignee: "RUFINO MUNGUIA", customer: "GURUNANDA, LLC", taskIds: ["TASK-5366471"], duration: "10h 56m", anomaly: false },

  // AVAILABLE — no open load/receive task (17 doors)
  { door: "DOCK51", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
  { door: "DOCK55", status: "Available", assignee: null, customer: null, taskIds: [], duration: null, anomaly: false },
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
// the 2026-09-14 ~18:31 PDT snapshot: 4 LOAD + 5 RECEIVE on 6 doors, 4 distinct assignees)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 6 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "JORGE ANTONIO FRANCO", taskCount: 1 },
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
// cumulative figure is not re-scanned in this refresh.
// LIVE SPOT CHECK (this refresh): DOCK50–DOCK60 GURUNANDA → Arnulfo closed LOAD tasks were
// re-verified door-by-door (DOCK50 67, DOCK51 96, DOCK52 122, DOCK53 152, DOCK54 144, DOCK55 71,
// DOCK56 57, DOCK57 58, DOCK58 50, DOCK59 34, DOCK60 29 = 880 across those 11 doors), confirming
// the carried figure is still in the right range; the full 23-door cumulative is not recomputed here.
export const guruArnulfoAllTimeTotal = 913;
export const guruArnulfoAllTimeLoad = 912;
export const guruArnulfoAllTimeReceive = 1;
export const guruArnulfoVerifiedLoadDock50to60 = 880;

// Mix: 4 LOAD (outbound) + 5 RECEIVE (inbound) = 9 open tasks at Bay 4 doors (2026-09-14
// ~18:31 PDT snapshot).
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 4, total: 9 },
  { label: "Inbound", count: 5, total: 9 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 4, total: 9 },
  { label: "Inbound", count: 5, total: 9 },
];

// Schedule: today's (2026-09-14, Monday) facility-wide — receipts/loads whose appointment time is
// today (facility-local day, America/Los_Angeles). Completed = receipt status CLOSED (received) /
// load status LOADED+SHIPPED (loaded). Queried live ~18:31 PDT.
// Inbounds: binding receipt appointmentTimeFrom/To window for the 2026-09-14 local day returns
// 42 scheduled receipts, of which 7 are CLOSED (received) ⇒ 16.7%.
// Outbounds: binding load appointmentTimePeriod array filter returns 123 loads scheduled for
// 2026-09-14, of which 103 are SHIPPED (0 LOADED) ⇒ 83.7%.
export const scheduleAvailable = true;
export const scheduledInboundOrders = 42;
export const scheduledOutboundOrders = 123;
export const scheduledInboundReceived = 7;
export const scheduledOutboundLoaded = 103;
export const pctScheduledInboundReceived = (7 / 42) * 100; // 7 of 42 scheduled inbounds received
export const pctScheduledOutboundLoaded = (103 / 123) * 100; // 103 of 123 scheduled loads loaded

export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 14, 2026 ~18:31 PDT snapshot)
// 9 open tasks: 4 LOAD (outbound) + 5 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  { taskId: "TASK-5367310", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (4h 14m)", assignee: "ARNULFO MUNGUIA", door: "DOCK50" },
  { taskId: "TASK-5366883", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (8h 14m)", assignee: "ARNULFO MUNGUIA", door: "DOCK52" },
  { taskId: "TASK-5367120", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (6h 06m)", assignee: "ARNULFO MUNGUIA", door: "DOCK53" },
  { taskId: "TASK-5338695", dns: "LOAD IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (38d 02h 02m) ⚠ STALE", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5364490", dns: "RECEIVE NEW", customer: "KARAKA, LLC", pieces: "NEW — not started", assignee: "ARNULFO MUNGUIA", door: "DOCK54" },
  { taskId: "TASK-5090739", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (328d 05h 10m) ⚠ STALE", assignee: "daira gonzalez", door: "DOCK50" },
  { taskId: "TASK-5365814", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (3h 46m)", assignee: "JORGE ANTONIO FRANCO", door: "DOCK62" },
  { taskId: "TASK-5366937", dns: "RECEIVE IN_PROGRESS", customer: "KARAKA, LLC", pieces: "IN_PROGRESS (6h 53m)", assignee: "ARNULFO MUNGUIA", door: "DOCK62" },
  { taskId: "TASK-5366471", dns: "RECEIVE IN_PROGRESS", customer: "GURUNANDA, LLC", pieces: "IN_PROGRESS (10h 56m)", assignee: "RUFINO MUNGUIA", door: "DOCK63" },
];
