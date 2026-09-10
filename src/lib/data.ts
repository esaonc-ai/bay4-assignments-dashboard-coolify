/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-09 ~18:06–18:15 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (DOCK50..DOCK72 ids)
 *     - /wms-bam/outbound/load-task/search-by-paging — open + closed load tasks
 *     - /wms-bam/inbound/receive-task/search-by-paging — open + closed receive tasks
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled appointments (today)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (today)
 *
 * SNAPSHOT INSTANT: 2026-09-09 18:15:00 PDT (America/Los_Angeles; clock-verified 18:12:35 PDT;
 * durations aged to the 18:15:00 PDT instant).
 *
 * DELTA vs 2026-09-09 ~07:47 PDT snapshot (~10h28m window):
 *   Bay-4 open task set: 9 → 13 (5 LOAD + 8 RECEIVE). Door map: Occupied 6 / Reserved 0 /
 *   Available 17 → Occupied 10 / Reserved 0 / Available 13.
 *   Newly occupied doors: DOCK52, DOCK57, DOCK58, DOCK60, DOCK63, DOCK64, DOCK68, DOCK69.
 *   Freed doors: DOCK62. Opened since last snapshot (all 09-09, facility-local):
 *   TASK-5363420 (LOAD D54, LORENZO RODRIGUEZ), TASK-5363171 (LOAD D50, ARNULFO — replaces the
 *   closed TASK-5363070), TASK-5363938 (LOAD D52, DANIEL BELTRAN, 8 loads LOADING), TASK-5363798
 *   (LOAD D54, ARNULFO), TASK-5363794 (RECV D63, JORGE ANTONIO FRANCO), TASK-5363940 (RECV D64,
 *   JORGE ARMANDO DUENAS), TASK-5363942 (RECV D68, DANIELA GONZALEZ), TASK-5363943 (RECV D69,
 *   DANIELA GONZALEZ), TASK-5364028 (RECV D57, DANIELA GONZALEZ), TASK-5364030 (RECV D58,
 *   DANIELA GONZALEZ), TASK-5364032 (RECV D60, DANIELA GONZALEZ).
 *   Still-open carry-overs: TASK-5090739 (D50 RECEIVE, ~323d stale), TASK-5338695 (D54 LOAD, 33d
 *   stale) — both flagged anomalies.
 *   Schedule/context (09-09, facility-wide, queried live ~18:07–18:15 PDT): 69 scheduled inbound
 *   receipts (7 CLOSED-received → 10.1%); 116 scheduled outbound loads (95 LOADED/SHIPPED →
 *   81.9%). Facility-wide today: receipts created 57, loads created 141.
 *   All-time Bay-4 closed rollup rescanned: 3,675 closed transactions across 80 assignees
 *   (2,747 LOAD CLOSED + 688 RECEIVE CLOSED + 240 RECEIVE FORCE_CLOSED), top assignee ARNULFO
 *   MUNGUIA 951. GURUNANDA → Arnulfo: 1,112 closed facility-wide (1,110 LOAD + 2 RECEIVE);
 *   909 at Bay-4 doors (908 LOAD + 1 RECEIVE).
 *   Timestamps: BAM task/receipt times read with the facility timezone applied
 *   (item-time-zone=America/Los_Angeles); durations computed against the 2026-09-09 18:15:00 PDT
 *   snapshot instant. Facility "today" windows use the facility-local day.
 *
 *   ⚠ API NOTE (this refresh): the outbound load search currently accepts only a date-boundary
 *   `appointmentTimeFrom` filter (the previous `appointmentTimePeriod` parameter now returns 400).
 *   Today's outbound denominator was therefore taken as the difference between the
 *   appointmentTimeFrom=2026-09-09 and appointmentTimeFrom=2026-09-10 populations and confirmed
 *   by a client-side appointment-date filter. The appointment-entity cross-check used previously
 *   is not reproducible in the current shape.
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
export const refreshStamp = "Sep 09 ~18:15 PDT";
export const refreshDateLong = "September 9, 2026";

export const doors: DoorRecord[] = [
  // ══════════════════════════════════════════════════════════════════════════════════════
  // OCCUPIED — door has an active IN_PROGRESS load/receive task (10 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK50",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA / daira gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5363171", "TASK-5090739"],
    duration: "~323d",
    anomaly: true,
  },
  {
    door: "DOCK52",
    status: "Occupied",
    assignee: "DANIEL BELTRAN",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5363938"],
    duration: "2h 47m",
    anomaly: false,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA / LORENZO RODRIGUEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5363798", "TASK-5363420", "TASK-5338695"],
    duration: "33d 1h",
    anomaly: true,
  },
  {
    door: "DOCK57",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5364028"],
    duration: "4h 54m",
    anomaly: false,
  },
  {
    door: "DOCK58",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5364030"],
    duration: "4h 54m",
    anomaly: false,
  },
  {
    door: "DOCK60",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5364032"],
    duration: "4h 53m",
    anomaly: false,
  },
  {
    door: "DOCK63",
    status: "Occupied",
    assignee: "JORGE ANTONIO FRANCO",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5363794"],
    duration: "8h 00m",
    anomaly: false,
  },
  {
    door: "DOCK64",
    status: "Occupied",
    assignee: "JORGE ARMANDO DUENAS",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5363940"],
    duration: "17m",
    anomaly: false,
  },
  {
    door: "DOCK68",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5363942"],
    duration: "6h 41m",
    anomaly: false,
  },
  {
    door: "DOCK69",
    status: "Occupied",
    assignee: "DANIELA GONZALEZ",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5363943"],
    duration: "3h 43m",
    anomaly: false,
  },

  // ══════════════════════════════════════════════════════════════════════════════════════
  // RESERVED — NEW (assigned, not started) load/receive task (0 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════

  // ══════════════════════════════════════════════════════════════════════════════════════
  // AVAILABLE — no open load/receive task (13 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK51",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
  {
    door: "DOCK53",
    status: "Available",
    assignee: null,
    customer: null,
    taskIds: [],
    duration: null,
    anomaly: false,
  },
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
    door: "DOCK59",
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

// Open assignee task counts - Bay 4 DOCK50-DOCK72, open load/receive dock tasks (13 open tasks at
// the 2026-09-09 18:15 PDT snapshot: 5 LOAD + 8 RECEIVE on 10 occupied doors; no reserved doors)

export const assigneeSummaries: AssigneeSummary[] = [
  { name: "DANIELA GONZALEZ", taskCount: 5 },
  { name: "ARNULFO MUNGUIA", taskCount: 3 },
  { name: "DANIEL BELTRAN", taskCount: 1 },
  { name: "JORGE ANTONIO FRANCO", taskCount: 1 },
  { name: "JORGE ARMANDO DUENAS", taskCount: 1 },
  { name: "LORENZO RODRIGUEZ", taskCount: 1 },
  { name: "daira gonzalez", taskCount: 1 },
];

// All-time assignment counts (CLOSED/FORCE_CLOSED) for Bay 4 DOCK50–DOCK72
// FRESH rollup 2026-09-09 ~18:10 PDT — rescanned CLOSED/FORCE_CLOSED load + receive tasks at all
// 23 Bay-4 door IDs with de-duplicated pagination (0 dropped pages, 0 duplicates): 3,675 closed
// tasks total (2,747 LOAD CLOSED + 688 RECEIVE CLOSED + 240 RECEIVE FORCE_CLOSED; no LOAD
// FORCE_CLOSED), 80 assignees. +17 vs the 09-09 07:47 PDT rollup (3,658).
export const allTimeClosedTotal = 3675;
export const allTimeDistinctAssignees = 80;
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 951 },
  { name: "DANIEL BELTRAN", taskCount: 930 },
  { name: "DANIELA GONZALEZ", taskCount: 370 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR ALVARADO", taskCount: 113 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "Fatima Ponce", taskCount: 90 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// Mix: 5 LOAD (outbound) + 8 RECEIVE (inbound) = 13 open tasks at Bay 4 doors (2026-09-09 18:15
// PDT snapshot). Prior 09-09 07:47 PDT snapshot was 7 LOAD + 2 RECEIVE = 9.
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 13 },
  { label: "Inbound", count: 8, total: 13 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 5, total: 13 },
  { label: "Inbound", count: 8, total: 13 },
];

// Schedule: today's (2026-09-09, Wednesday) facility-wide — receipts/loads whose appointment time
// is today (facility-local day, America/Los_Angeles; same window convention as prior snapshots:
// appointmentTimeFrom/To = 2026-09-09T00:00:00 → 23:59:59 on receipt search). Completed = receipt
// status CLOSED (received) / load status LOADED+SHIPPED (loaded). Facility-wide scope
// (appointments do not carry a clean dockId for Bay 4 scoping). Queried live ~18:07–18:15 PDT.
// Wednesday Sep 9: 69 scheduled inbound receipts → 7 received (CLOSED; 26 IMPORTED + 28
// IN_PROGRESS + 8 OPEN remain) = 10.1%. 116 scheduled outbound loads → 95 LOADED/SHIPPED (86
// SHIPPED + 9 LOADED; 15 NEW + 6 WINDOW_CHECKIN_DONE remain) = 81.9%. Outbound denominator note:
// the load search currently honours only appointmentTimeFrom (date boundary) — today's set was
// taken as the difference between the 2026-09-09 and 2026-09-10 from-populations (406 − 290 = 116)
// and confirmed by a client-side appointment-date filter over the returned set.
export const scheduleAvailable = true;
export const scheduledInboundOrders = 69;
export const scheduledOutboundOrders = 116;
export const scheduledInboundReceived = 7;
export const scheduledOutboundLoaded = 95;
export const pctScheduledInboundReceived = 10.1; // 7 of 69 scheduled inbounds received (by 18:15 PDT)
export const pctScheduledOutboundLoaded = 81.9; // 95 of 116 scheduled outbound loads loaded (by 18:15 PDT)

// Today's facility-wide context (2026-09-09, facility-local day; queried live ~18:07–18:15 PDT)
// receipts created today: 57; loads created today: 141; scheduled inbounds 69 (7 CLOSED-received);
// scheduled outbound loads 116 (95 LOADED/SHIPPED).
export const facilityWideReceiptsCreated = 57;
export const facilityWideReceiptsReceived = 7;
export const facilityWideLoadsCreated = 141;
export const facilityWideLoadsShipped = 95;

// Door occupancy duration: available from task start timestamps
export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 09, 2026 ~18:15 PDT snapshot)
// 13 open tasks: 5 LOAD (outbound) + 8 RECEIVE (inbound)
export const assignments: TaskRecord[] = [
  // ────── DOCK50 — stale 323d RECEIVE + live load co-located ──────
  {
    taskId: "TASK-5363171",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (9h 10m) — LOAD-5038172 LOADED",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK50",
  },
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~323d) ⚠ STALE",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },

  // ────── DOCK52 ──────
  {
    taskId: "TASK-5363938",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (2h 47m) — 8 loads LOADING",
    assignee: "DANIEL BELTRAN",
    door: "DOCK52",
  },

  // ────── DOCK54 — stale 33d LOAD + two live loads co-located ──────
  {
    taskId: "TASK-5363798",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (6h 7m) — 2 loads LOADED",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5363420",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (8h 30m) — LOAD-5038160 LOADED",
    assignee: "LORENZO RODRIGUEZ",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5338695",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (33d 1h) ⚠ STALE",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },

  // ────── DOCK57 ──────
  {
    taskId: "TASK-5364028",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (4h 54m)",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK57",
  },

  // ────── DOCK58 ──────
  {
    taskId: "TASK-5364030",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (4h 54m)",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK58",
  },

  // ────── DOCK60 ──────
  {
    taskId: "TASK-5364032",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (4h 53m)",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK60",
  },

  // ────── DOCK63 ──────
  {
    taskId: "TASK-5363794",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (8h 00m)",
    assignee: "JORGE ANTONIO FRANCO",
    door: "DOCK63",
  },

  // ────── DOCK64 ──────
  {
    taskId: "TASK-5363940",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (17m)",
    assignee: "JORGE ARMANDO DUENAS",
    door: "DOCK64",
  },

  // ────── DOCK68 ──────
  {
    taskId: "TASK-5363942",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (6h 41m)",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK68",
  },

  // ────── DOCK69 ──────
  {
    taskId: "TASK-5363943",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (3h 43m)",
    assignee: "DANIELA GONZALEZ",
    door: "DOCK69",
  },
];
