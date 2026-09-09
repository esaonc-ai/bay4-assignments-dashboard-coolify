/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-09 ~07:53–07:58 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations + dock/space status
 *     - /wms-bam/outbound/load-task/search-by-paging — open + closed load tasks
 *     - /wms-bam/inbound/receive-task/search-by-paging — open + closed receive tasks
 *     - /wms-bam/appointment/search-by-paging + /wms-bam/inbound/receipt/search-by-paging
 *       + /wms-bam/outbound/load/search-by-paging — scheduled appointments (today, facility-wide)
 *
 * SNAPSHOT INSTANT: 2026-09-09 07:47:00 PDT (America/Los_Angeles; clock-verified 07:47:31 PDT;
 * task/context states verified live 07:53–07:58 PDT, durations aged to the 07:47:00 instant).
 * DELTA vs 2026-09-08 ~12:27 PDT snapshot (~19h20m window):
 *   Bay-4 open task set: 9 → 9 (7 LOAD + 2 RECEIVE). Door map: Occupied 6 / Reserved 0 /
 *   Available 17 (was 6/2/15). CLOSED in window (11 total Bay-4 closures): TASK-5362261
 *   (RECEIVE FORCE_CLOSED, DOCK58, Fatima Ponce, 09-08 13:02:24), TASK-5361994 (LOAD, DOCK52,
 *   ARNULFO MUNGUIA, 13:54:15), TASK-5362409 (LOAD, DOCK57, JULIO CESAR ALVARADO, 13:58:29 —
 *   the post-snapshot DOCK67→DOCK57 trailer-move task created 12:29:37; closed same afternoon),
 *   TASK-5362405 (LOAD, DOCK60, DANIEL BELTRAN, 14:07:39), TASK-5362362 (LOAD, DOCK56, DANIEL
 *   BELTRAN, 14:26:08), TASK-5360206 (LOAD, DOCK50, ARNULFO MUNGUIA, 14:31:23), TASK-5362519
 *   (LOAD, DOCK57, DANIEL BELTRAN, 14:43:56), TASK-5362469 (LOAD, DOCK58, LUIS VELAZQUEZ,
 *   15:04:05), TASK-5362574 (LOAD, DOCK56, DANIEL BELTRAN, 15:31:35), TASK-5362231 (RECEIVE
 *   CLOSED, DOCK66, DANIELA GONZALEZ, 18:43:45), TASK-5361455 (RECEIVE CLOSED, DOCK64, DANIELA
 *   GONZALEZ, 19:23:51). TASK-5359531 (DOCK67) CANCELLED 09-08 ~12:29:37 (as flagged live last
 *   refresh) — DOCK67 freed. Doors changed: DOCK62 Available→Occupied (RECEIVE TASK-5360939
 *   moved DOCK53→DOCK62, IN_PROGRESS since 09-08 13:06 — the RN-191921 receive finally started);
 *   DOCK53 Reserved→Occupied (TASK-5360939 left; LOAD TASK-5362444 IN_PROGRESS since 13:52 +
 *   NEW TASK-5363039 created 09-09 07:33); DOCK56 Occupied→Available; DOCK58 Occupied→Available;
 *   DOCK67 Reserved→Available; DOCK50/51/52/54 remain Occupied but with task changes: DOCK50's
 *   LOAD TASK-5360206 closed 14:31 → NEW LOAD TASK-5363070 created 09-09 07:45 (co-located with
 *   the stale 322d RECEIVE); DOCK52's TASK-5361994 closed 13:54 → TASK-5362731 IN_PROGRESS since
 *   16:19; DOCK51 now hosts TWO IN_PROGRESS LOAD tasks (ARNULFO's TASK-5362385 never closed +
 *   EDUARDO MEJIA's TASK-5362728 since 15:30); DOCK54 unchanged (TASK-5338695 stale).
 *   ⚠ LIVE TRANSITIONS DURING THIS REFRESH (post-snapshot, next refresh will show them): first
 *   loads of the 09-09 wave created from 07:55:28 PDT — LOAD-5038251..LOAD-5038257 (7 by
 *   07:57:53, all ORG-655875 GURUNANDA, loadNos 50040541–50040547, NEW, no appointmentTime yet);
 *   RN-5009459 GURUNANDA CLOSED at 07:50:24 (receipts received today 3 → 4).
 *   Schedule/context (09-09, facility-wide, queried live ~07:54–07:58 PDT): 63 scheduled inbound
 *   receipts (0 CLOSED-received → 0.0%; 23 OPEN + 40 IMPORTED — incl. overnight 00:00 Mars Food
 *   ×3 and 03:00–04:00 CMPC USA ×11 still unreceived at 07:47, 08:00 KING'S HAWAIIAN / LENNOX /
 *   ORGAIN / ALL MARKET-VITA COCO, 10:00 GURUNANDA will-calls RN-5010150 / RN-5010134); 95
 *   scheduled outbound loads (1 LOADED/SHIPPED → 1.1%: LOAD-5038183 NILO BRANDS SHIPPED 07:14:50;
 *   84 NEW, 9 WINDOW_CHECKIN_DONE, 1 LOADING); receipts created today 12 (all ≤ 07:45:07 — first
 *   RN-192080 KARAKA 02:04:21, last LIFEPRO batch RN-5010167..70 07:45:06–07; RN-90545 SOUTHERN
 *   GLAZER'S CLOSED 07:31); receipts CLOSED/FORCE_CLOSED with receivedTime today 4 (3 by 07:47:
 *   RN-191519 BABYARK 06:52:51, RN-190217 COME READY 06:53:26, RN-5009978 KING'S HAWAIIAN
 *   FORCE_CLOSED 07:10:46; +RN-5009459 GURUNANDA 07:50:24 after snapshot); loads created today 0
 *   at snapshot → 7 by 07:57:53 (wave started 07:55:28); loads LOADED/SHIPPED with endTime today
 *   1 (LOAD-5038183 07:14:50). Outbound appointment-entity check: 161 appointment entities / 160
 *   actions today; outbound actions (93 LIVE_LOAD + 4 PICKUP_PRELOAD = 97) currently expose NO
 *   embedded load references (Sep-8 shape had them), so the per-entity load-strand check cannot
 *   be reproduced identically; load-side cross-check is clean — 0 appointment-referenced load ids
 *   missing from the 95-load appointmentTime-today set (0 references exist), denominator of 95
 *   stands (vs 97 outbound appointment actions).
 *   Timestamps: BAM APIs return task startTime/endTime/createdTime and receipt times as
 *   facility-local naive (America/Los_Angeles, UTC-7) when item-time-zone=America/Los_Angeles —
 *   durations computed against the 2026-09-09 07:47:00 PDT snapshot instant, same convention as
 *   prior snapshots. Facility "today" windows use item-time-zone America/Los_Angeles (local-day).
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
export const refreshStamp = "Sep 09 ~07:47 PDT";
export const refreshDateLong = "September 9, 2026";

export const doors: DoorRecord[] = [
  // ══════════════════════════════════════════════════════════════════════════════════════
  // OCCUPIED — door has an active IN_PROGRESS load/receive task (6 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK50",
    status: "Occupied",
    assignee: "JEROME ARANDA / daira gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5090739", "TASK-5363070"],
    duration: "~323d",
    anomaly: true,
  },
  {
    door: "DOCK51",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA / EDUARDO MEJIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5362385", "TASK-5362728"],
    duration: "19h 30m",
    anomaly: true,
  },
  {
    door: "DOCK52",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5362731"],
    duration: "15h 27m",
    anomaly: false,
  },
  {
    door: "DOCK53",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA / JEROME ARANDA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5362444", "TASK-5363039"],
    duration: "17h 54m",
    anomaly: true,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5338695"],
    duration: "32d 15h",
    anomaly: true,
  },
  {
    door: "DOCK62",
    status: "Occupied",
    assignee: "RUFINO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360939"],
    duration: "18h 40m",
    anomaly: false,
  },

  // ══════════════════════════════════════════════════════════════════════════════════════
  // RESERVED — NEW (assigned, not started) load/receive task (0 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════

  // ══════════════════════════════════════════════════════════════════════════════════════
  // AVAILABLE — no open load/receive task (17 doors)
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
    door: "DOCK56",
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
    door: "DOCK58",
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
    door: "DOCK67",
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
// the 2026-09-09 07:47 PDT snapshot: 7 LOAD + 2 RECEIVE on 6 occupied doors; no reserved doors)

export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 4 },
  { name: "JEROME ARANDA", taskCount: 2 },
  { name: "EDUARDO MEJIA", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
];

// All-time assignment counts (CLOSED/FORCE_CLOSED) for Bay 4 DOCK50–DOCK72
// FRESH rollup 2026-09-09 ~07:54 PDT — rescanned CLOSED/FORCE_CLOSED load + receive tasks at all
// 23 Bay-4 door IDs with retry (0 dropped pages): 3,658 closed tasks total (2,733 LOAD CLOSED +
// 685 RECEIVE CLOSED + 240 RECEIVE FORCE_CLOSED; no LOAD FORCE_CLOSED), 80 assignees. +11 vs the
// 09-08 12:27 PDT rollup (3,647) — eleven Bay-4 closures in the window (listed in the file
// header); newest closed task endTime now 2026-09-08T19:23:51 local = 2026-09-09T02:23:51Z
// (TASK-5361455, RECEIVE, DOCK64, DANIELA GONZALEZ — previously TASK-5361270 09-08T12:18:54).
export const allTimeClosedTotal = 3658;
export const allTimeDistinctAssignees = 80;
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 948 },
  { name: "DANIEL BELTRAN", taskCount: 922 },
  { name: "DANIELA GONZALEZ", taskCount: 368 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR ALVARADO", taskCount: 113 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "Fatima Ponce", taskCount: 90 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// Mix: 7 LOAD (outbound) + 2 RECEIVE (inbound) = 9 open tasks at Bay 4 doors (2026-09-09 07:47 PDT
// snapshot). Prior 09-08 12:27 PDT snapshot was 6 LOAD + 3 RECEIVE = 9 (6 doors then vs 6 now).
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 7, total: 9 },
  { label: "Inbound", count: 2, total: 9 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 7, total: 9 },
  { label: "Inbound", count: 2, total: 9 },
];

// Schedule: today's (2026-09-09, Wednesday) facility-wide — receipts/loads whose appointment time
// is today (facility-local day, item-time-zone America/Los_Angeles; same window convention as prior
// snapshots: appointmentTimeFrom/To = 2026-09-09T00:00:00 → 23:59:59 on receipt search;
// appointmentTimePeriod on load search). Completed = receipt status CLOSED (received) / load status
// LOADED+SHIPPED (loaded). Facility-wide scope (appointments do not carry a clean dockId for Bay 4
// scoping). Queried live ~07:54–07:58 PDT (early morning — rates will climb through the day).
// Wednesday Sep 9: 63 scheduled inbound receipts → 0 received (0 CLOSED; 23 OPEN + 40 IMPORTED —
// overnight 00:00 Mars Food RN-5010040/44/50 and 03:00–04:00 CMPC USA ×11 still unreceived at
// 07:47; 08:00 KING'S HAWAIIAN RN-5010164/RN-5009807, LENNOX RN-5009989, ORGAIN RN-5009602,
// ALL MARKET/VITA COCO RN-5010070; 09:00 LENNOX RN-5009985, SMEG RN-191410; 10:00 GURUNANDA
// will-calls RN-5010150 / RN-5010134, BOUNDLESS RN-192046) = 0.0%. 95 scheduled outbound loads →
// 1 LOADED/SHIPPED (LOAD-5038183 SHIPPED 07:14:50; 84 NEW, 9 WINDOW_CHECKIN_DONE, 1 LOADING) =
// 1.1%. Outbound denominator check: 161 appointment entities / 160 actions today (97 outbound:
// 93 LIVE_LOAD + 4 PICKUP_PRELOAD — none expose embedded load refs yet, so the Sep-8 per-entity
// strand check isn't reproducible; load side clean: 0 referenced load ids missing from the 95).
export const scheduleAvailable = true;
export const scheduledInboundOrders = 63;
export const scheduledOutboundOrders = 95;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 1;
export const pctScheduledInboundReceived = 0.0; // 0 of 63 scheduled inbounds received (by 07:47 PDT)
export const pctScheduledOutboundLoaded = 1.1; // 1 of 95 scheduled outbound loads loaded (by 07:47 PDT)

// Today's facility-wide context (2026-09-09, facility-local day; queried live ~07:54–07:58 PDT)
// receipts created today: 12 (all by 07:45:07 — none after the 07:47:00 snapshot instant):
//   RN-192080 KARAKA EXCEPTION 02:04:21; RN-192081 VAONIS IMPORTED 03:07:03; RN-192099/192100/192101
//   KARAKA IMPORTED 05:20:33–34; RN-192105 ALL MARKET/VITA COCO IMPORTED 07:19:19; RN-192106 FLAG &
//   ANTHEM EXCEPTION 07:22:33; RN-90545 SOUTHERN GLAZER'S WINE AND SPIRITS CLOSED 07:31:50;
//   RN-5010167..RN-5010170 LIFEPRO FITNESS IMPORTED 07:45:06–07
// receipts CLOSED/FORCE_CLOSED with receivedTime today: 4 by query end (3 by 07:47:00; RN-5009459
//   GURUNANDA @07:50:24 after snapshot) — RN-191519 BABYARK INC CLOSED 06:52:51; RN-190217 COME
//   READY FOODS LLC CLOSED 06:53:26; RN-5009978 KING'S HAWAIIAN FORCE_CLOSED 07:10:46; RN-5009459
//   GURUNANDA CLOSED 07:50:24
// loads created today (createdTime local-day 09-09): 0 by the 07:47:00 snapshot; 7 by 07:57:53 —
//   first LOAD-5038251 @07:55:28 (wave started during this refresh; LOAD-5038251..5038257 through
//   07:57:34, all ORG-655875 GURUNANDA, loadNos 50040541–50040547, NEW, no appointmentTime yet;
//   newest load facility-wide before the wave was LOAD-5038250, NEW, created 09-08 17:01:36)
// loads LOADED/SHIPPED with endTime today: 1 — LOAD-5038183 NILO BRANDS SHIPPED 07:14:50 (appt
//   07:00; loadNo W-2682226_SP BOL; task TASK-5363026 CLOSED)
export const facilityWideReceiptsCreated = 12; // unchanged at snapshot (all ≤ 07:45:07)
export const facilityWideReceiptsReceived = 4; // 3 by 07:47:00 snapshot; +RN-5009459 @07:50:24 during refresh
export const facilityWideLoadsCreated = 7; // 0 by 07:47:00 snapshot; wave started 07:55:28 (7 by 07:57:53)
export const facilityWideLoadsShipped = 1; // LOAD-5038183 @07:14:50 (unchanged at snapshot)

// Door occupancy duration: available from task start timestamps
export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 09, 2026 ~07:47 PDT snapshot)
// 9 open tasks: 7 LOAD (outbound) + 2 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  // ────── DOCK50 — stale 322d RECEIVE + NEW live-load co-located ──────
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~323d) ⚠ STALE",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },
  {
    taskId: "TASK-5363070",
    dns: "LOAD NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW",
    assignee: "JEROME ARANDA",
    door: "DOCK50",
  },

  // ────── DOCK51 — two IN_PROGRESS LOAD tasks co-located ──────
  {
    taskId: "TASK-5362385",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (19h 30m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK51",
  },
  {
    taskId: "TASK-5362728",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (16h 16m)",
    assignee: "EDUARDO MEJIA",
    door: "DOCK51",
  },

  // ────── DOCK52 ──────
  {
    taskId: "TASK-5362731",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (15h 27m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK52",
  },

  // ────── DOCK53 — IN_PROGRESS + NEW co-located ──────
  {
    taskId: "TASK-5362444",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (17h 54m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5363039",
    dns: "LOAD NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW",
    assignee: "JEROME ARANDA",
    door: "DOCK53",
  },

  // ────── DOCK54 ──────
  {
    taskId: "TASK-5338695",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (32d 15h) ⚠ STALE",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },

  // ────── DOCK62 ──────
  {
    taskId: "TASK-5360939",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (18h 40m)",
    assignee: "RUFINO MUNGUIA",
    door: "DOCK62",
  },
];
