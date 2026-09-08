/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-08 ~12:26–12:35 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations + dock/space status
 *     - /wms-bam/outbound/load-task/search-by-paging — open + closed load tasks
 *     - /wms-bam/inbound/receive-task/search-by-paging — open + closed receive tasks
 *     - /wms-bam/appointment/search-by-paging + /wms-bam/inbound/receipt/search-by-paging
 *       + /wms-bam/outbound/load/search-by-paging — scheduled appointments (today, facility-wide)
 *
 * SNAPSHOT INSTANT: 2026-09-08 12:27:00 PDT (America/Los_Angeles; clock-verified 12:27:33 PDT).
 * DELTA vs 2026-09-07 ~18:40 PDT snapshot (~17h47m window):
 *   Bay-4 open task set changed: 8 → 9 (6 LOAD + 3 RECEIVE). CLOSED in window (3 prior Bay-4 opens,
 *   all ARNULFO MUNGUIA / GURUNANDA): TASK-5359541 (LOAD, DOCK51, ended 09-08 09:53:09),
 *   TASK-5360934 (LOAD, DOCK54, ended 09:59:48), TASK-5361270 (LOAD, DOCK53, ended 12:18:54).
 *   OPENED since: TASK-5362385 (LOAD IN_PROGRESS, DOCK51, ARNULFO, 12:14), TASK-5361994 (LOAD
 *   IN_PROGRESS, DOCK52, ARNULFO, 09:40), TASK-5362362 (LOAD IN_PROGRESS, DOCK56, DANIEL BELTRAN,
 *   12:00), TASK-5362261 (RECEIVE IN_PROGRESS, DOCK58, Fatima Ponce, 11:01). Door map changed:
 *   DOCK51/52/56/58 newly occupied; DOCK53 flipped Occupied→Reserved (its IN_PROGRESS task closed);
 *   DOCK67 still reserved. Also 5 additional Bay-4 closures in window (not previously open in the
 *   09-07 18:40 open set): TASK-5361773 (RECEIVE FORCE_CLOSED, Fatima Ponce, 08:37:57), TASK-5361841
 *   (LOAD, DANIEL BELTRAN, 09:06:54), TASK-5361925 (LOAD, DANIEL BELTRAN, 09:57:35), TASK-5362062
 *   (LOAD, JULIO CESAR ALVARADO, 11:58:56), TASK-5362193 (LOAD, DANIEL BELTRAN, 12:00:06) → all-time
 *   Bay-4 closed rollup 3,639 → 3,647 (+8: 2,725 LOAD + 922 RECEIVE; 3,408 CLOSED + 239 FORCE_CLOSED;
 *   80 assignees). GURUNANDA → Arnulfo closed: 1,104 → 1,107 facility-wide (1,105 LOAD + 2 RECEIVE);
 *   901 → 904 Bay-4 (903 LOAD + 1 RECEIVE). Newest closed Bay-4 task: TASK-5361270, endTime local
 *   2026-09-08T12:18:54 = 19:18:54Z (LOAD, DOCK53).
 *   ⚠ LIVE TRANSITION DURING REFRESH (post-snapshot, next refresh will show it): at ~12:29:37 PDT
 *   TASK-5359531 (DOCK67, JEROME ARANDA, LOAD-5037833) was CANCELLED and its load re-created as NEW
 *   task TASK-5362409 at DOCK57 (DANIEL BELTRAN) — i.e., the DOCK67 trailer moved to DOCK57 seconds
 *   after the 12:27 snapshot.
 *   Schedule/context (09-08, facility-wide, queried live ~12:30–12:36 PDT): 34 scheduled inbound
 *   receipts (3 CLOSED-received → 8.8%); 138 scheduled outbound loads (48 LOADED/SHIPPED → 34.8%);
 *   receipts created today 42 (40 by the 12:27 snapshot: RN-5010135 @12:27:43 and RN-5010136
 *   @12:31:27 arrived during the refresh); receipts received today 15 (13 by 12:27: RN-5010094
 *   GURUNANDA @12:27:41 and RN-191511 COME READY FOODS @12:29:08 came in after snapshot); loads
 *   created today 63 (all ≤ 12:16:11); loads LOADED/SHIPPED with endTime today 55 (52 by 12:27;
 *   +LOAD-5037951 @12:31:10, LOAD-5037857 @12:32:31, LOAD-5037787 @12:35:58). No outbound appointment
 *   entity today is stranded (unlike 09-07): every outbound appointment entity's load carries an
 *   appointmentTime in today's window → clean denominator of 138.
 *   Timestamps: BAM APIs return task startTime/endTime/createdTime and receipt times as facility-local
 *   naive (America/Los_Angeles, UTC-7) when item-time-zone=America/Los_Angeles — durations computed
 *   against the 2026-09-08 12:27:00 PDT snapshot instant, same convention as prior snapshots.
 *   Facility "today" windows use item-time-zone America/Los_Angeles (local-day) semantics.
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
export const refreshStamp = "Sep 08 ~12:27 PDT";
export const refreshDateLong = "September 8, 2026";

export const doors: DoorRecord[] = [
  // ══════════════════════════════════════════════════════════════════════════════════════
  // OCCUPIED — door has an active IN_PROGRESS load/receive task (6 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK50",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA / daira gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5090739", "TASK-5360206"],
    duration: "~322d",
    anomaly: true,
  },
  {
    door: "DOCK51",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5362385"],
    duration: "~10m",
    anomaly: false,
  },
  {
    door: "DOCK52",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5361994"],
    duration: "2h 39m",
    anomaly: false,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5338695"],
    duration: "31d 20h",
    anomaly: true,
  },
  {
    door: "DOCK56",
    status: "Occupied",
    assignee: "DANIEL BELTRAN",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5362362"],
    duration: "~4m",
    anomaly: false,
  },
  {
    door: "DOCK58",
    status: "Occupied",
    assignee: "Fatima Ponce",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5362261"],
    duration: "~49m",
    anomaly: false,
  },

  // ══════════════════════════════════════════════════════════════════════════════════════
  // RESERVED — NEW (assigned, not started) load/receive task (2 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK53",
    status: "Reserved",
    assignee: "RUFINO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360939"],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK67",
    status: "Reserved",
    assignee: "JEROME ARANDA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5359531"],
    duration: null,
    anomaly: false,
  },

  // ══════════════════════════════════════════════════════════════════════════════════════
  // AVAILABLE — no open load/receive task (15 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK55",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK57",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK59",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK60",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK61",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK62",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK63",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK64",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK65",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK66",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK68",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK69",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK70",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK71",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK72",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
];

const occupied = doors.filter((d) => d.status === "Occupied").length;
const reserved = doors.filter((d) => d.status === "Reserved").length;
const available = doors.filter((d) => d.status === "Available").length;
const doorsWithTasks = doors.filter((d) => d.taskIds.length > 0).length;

export const kpiMetrics: KpiMetric[] = [
  {
    label: "Doors Occupied",
    value: `${occupied}`,
    numerator: occupied,
    denominator: TOTAL_DOORS,
    percentage: (occupied / TOTAL_DOORS) * 100,
  },
  {
    label: "Doors w/ Active Tasks",
    value: `${doorsWithTasks}`,
    numerator: doorsWithTasks,
    denominator: TOTAL_DOORS,
    percentage: (doorsWithTasks / TOTAL_DOORS) * 100,
  },
  {
    label: "Doors Available",
    value: `${available}`,
    numerator: available,
    denominator: TOTAL_DOORS,
    percentage: (available / TOTAL_DOORS) * 100,
  },
  {
    label: "Task Occupancy Rate",
    value: `${((doorsWithTasks / TOTAL_DOORS) * 100).toFixed(1)}%`,
    numerator: doorsWithTasks,
    denominator: TOTAL_DOORS,
    percentage: (doorsWithTasks / TOTAL_DOORS) * 100,
  },
];

// Open assignee task counts - Bay 4 DOCK50-DOCK72, open load/receive dock tasks (9 open tasks at
// the 2026-09-08 12:27 PDT snapshot: 4 new since 09-07 18:40; 3 prior opens closed in window)

export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 4 },
  { name: "DANIEL BELTRAN", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
  { name: "Fatima Ponce", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
];

// All-time assignment counts (CLOSED/FORCE_CLOSED) for Bay 4 DOCK50–DOCK72
// FRESH rollup 2026-09-08 ~12:27 PDT — rescanned CLOSED/FORCE_CLOSED load + receive tasks at all
// 23 Bay-4 door IDs with retry (0 dropped pages): 3,647 closed tasks total (2,725 LOAD + 922 RECEIVE;
// 3,408 CLOSED + 239 FORCE_CLOSED), 80 assignees. +8 vs the 09-07 18:40 PDT rollup (3,639) — eight
// Bay-4 closures in the window (listed in the file header); newest closed task endTime now
// 2026-09-08T12:18:54 local = 19:18:54Z (TASK-5361270, LOAD, DOCK53, ARNULFO MUNGUIA — previously
// 09-04T23:13:25 local / TASK-5361283).
export const allTimeClosedTotal = 3647;
export const allTimeDistinctAssignees = 80;
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 946 },
  { name: "DANIEL BELTRAN", taskCount: 918 },
  { name: "DANIELA GONZALEZ", taskCount: 366 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR ALVARADO", taskCount: 112 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "Fatima Ponce", taskCount: 89 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// Mix: 6 LOAD (outbound) + 3 RECEIVE (inbound) = 9 open tasks at Bay 4 doors (2026-09-08 12:27 PDT
// snapshot). Prior 09-07 18:40 PDT snapshot was 6 LOAD + 2 RECEIVE = 8.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 9 },
  { label: "Inbound", count: 3, total: 9 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 9 },
  { label: "Inbound", count: 3, total: 9 },
];

// Schedule: today's (2026-09-08, Tuesday) facility-wide — receipts/loads whose appointment time is
// today (facility-local day, item-time-zone America/Los_Angeles; same window convention as prior
// snapshots: appointmentTimeFrom/To = 2026-09-08T00:00:00 → 23:59:59 on receipt search;
// appointmentTimePeriod on load search). Completed = receipt status CLOSED (received) / load status
// LOADED+SHIPPED (loaded). Facility-wide scope (appointments do not carry a clean dockId for Bay 4
// scoping). Queried live ~12:30–12:36 PDT.
// Tuesday Sep 8: 34 scheduled inbound receipts → 3 received (RN-5010014 / RN-5009995 / RN-5009993,
// all LENNOX INDUSTRIES INC., received 09:21:58–11:42:29) = 8.8%. Remaining: 10 IN_PROGRESS,
// 7 OPEN, 14 IMPORTED (incl. GURUNANDA will-call RN-5010129 12:00 / RN-191971 13:00 / RN-5010128
// 21:30 / RN-5010127 23:30 and midnight-slot RN-192044 / RN-192045). 138 scheduled outbound loads →
// 48 LOADED/SHIPPED (38 SHIPPED + 10 LOADED; 69 NEW, 14 LOADING, 7 WINDOW_CHECKIN_DONE) = 34.8%.
// Unlike 09-07, no outbound appointment entity today is stranded: all outbound appointment-entity
// loads carry an appointmentTime in today's window (clean denominator of 138).
export const scheduleAvailable = true;
export const scheduledInboundOrders = 34;
export const scheduledOutboundOrders = 138;
export const scheduledInboundReceived = 3;
export const scheduledOutboundLoaded = 48;
export const pctScheduledInboundReceived = 8.8; // 3 of 34 scheduled inbounds received today
export const pctScheduledOutboundLoaded = 34.8; // 48 of 138 scheduled outbound loads loaded today

// Today's facility-wide context (2026-09-08, facility-local day; queried live ~12:30–12:36 PDT)
// receipts created today: 42 by query end (40 by the 12:27:00 snapshot instant; RN-5010135 @12:27:43
//   and RN-5010136 @12:31:27 arrived during the refresh) — VAONIS RN-192025 IMPORTED 05:08; ELEVATE
//   BRANDS RN-192026 CLOSED 05:11 / RN-192041 IMPORTED 08:58; THE OUAI RN-5010119 OPEN 09:14; COME
//   READY FOODS RN-192042 IMPORTED 10:15 / RN-192047 IMPORTED 12:11; Mars Food RN-5010120 OPEN 10:39;
//   GURUNANDA RN-192043 10:54 + RN-192044/192045 11:12/11:18 + RN-5010127..RN-5010136 11:45–12:31
//   (IMPORTED, appointments 09-08 21:30/23:30/00:00/12:00 and 09-09) ; BOUNDLESS EC RN-192046 11:29;
//   ORGAIN RN-5010121 OPEN 11:21; ALL MARKET / VITA COCO batch RN-192048..RN-192066 (19 receipts,
//   IMPORTED, 12:18:20–12:18:42); EMBER RN-192067 IMPORTED 12:26:44
// receipts CLOSED/FORCE_CLOSED with receivedTime today: 15 by query end (13 by 12:27:00; RN-5010094
//   GURUNANDA @12:27:41 and RN-191511 COME READY FOODS @12:29:08 after snapshot) — ELEVATE RN-192026
//   06:54; GURUNANDA RN-5010021 08:43, RN-5009326 11:56, RN-5010081 12:10; VITA COCO RN-189443/189452
//   09:09/09:13, RN-189769 09:52, RN-189836 11:14; LENNOX RN-5009995/5009993/5010014 09:21/10:19/11:42;
//   AMIEE LYNN RN-5010092 FORCE_CLOSED 09:49, RN-5010091 FORCE_CLOSED 12:11
// loads created today (createdTime local-day 09-08): 63 — first LOAD-5038143 @07:50:34 (was 0 on
//   09-07; newest load facility-wide is now LOAD-5038205, NEW, created 12:16:11 PDT; GURUNANDA SP BOL
//   and WILL CALL wave 09:02–09:08, VITA COCO/MAMMA CHIA/ALL MARKET waves through 12:16)
// loads LOADED/SHIPPED with endTime today: 55 by query end (52 by 12:27:00; +LOAD-5037951 @12:31:10,
//   LOAD-5037857 @12:32:31, LOAD-5037787 @12:35:58) — first LOAD-5037878 ORGAIN @07:48; 8 loads of
//   TASK-5360934 shipped 09:59:48, 6 loads of TASK-5361270 shipped 12:18:54, 1 load of TASK-5359541
//   shipped 09:53:09 (the three Bay-4 task closures)
export const facilityWideReceiptsCreated = 42; // 40 by 12:27:00 snapshot; 2 more during refresh
export const facilityWideReceiptsReceived = 15; // 13 by 12:27:00 snapshot; 2 more during refresh
export const facilityWideLoadsCreated = 63;
export const facilityWideLoadsShipped = 55; // 52 by 12:27:00 snapshot; 3 more by 12:36

// Door occupancy duration: available from task start timestamps
export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 08, 2026 ~12:27 PDT snapshot)
// 9 open tasks: 6 LOAD (outbound) + 3 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  // ────── DOCK50 — inbound severe anomaly + active outbound co-located ──────
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~322d) ⚠ STALE",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },
  {
    taskId: "TASK-5360206",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (4d 20h)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK50",
  },

  // ────── OUTBOUND / LOAD ──────
  {
    taskId: "TASK-5362385",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~10m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK51",
  },
  {
    taskId: "TASK-5361994",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (2h 39m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK52",
  },
  {
    taskId: "TASK-5338695",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (31d 20h) ⚠ STALE",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5362362",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~4m)",
    assignee: "DANIEL BELTRAN",
    door: "DOCK56",
  },
  {
    taskId: "TASK-5359531",
    dns: "LOAD NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW",
    assignee: "JEROME ARANDA",
    door: "DOCK67",
  },

  // ────── INBOUND / RECEIVE ──────
  {
    taskId: "TASK-5362261",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~49m)",
    assignee: "Fatima Ponce",
    door: "DOCK58",
  },
  {
    taskId: "TASK-5360939",
    dns: "RECEIVE NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW",
    assignee: "RUFINO MUNGUIA",
    door: "DOCK53",
  },
];
