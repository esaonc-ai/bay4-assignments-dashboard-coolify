/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-07 ~12:27 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations + dock/space status
 *     - /wms-bam/outbound/load-task/search-by-paging — open + closed load tasks
 *     - /wms-bam/inbound/receive-task/search-by-paging — open + closed receive tasks
 *     - /wms-bam/appointment/search-by-paging + /wms-bam/inbound/receipt/search-by-paging
 *       + /wms-bam/outbound/load/search-by-paging — scheduled appointments (today, facility-wide)
 *
 * DELTA vs 2026-09-07 ~07:57 PDT snapshot: NO task opened, closed, or moved doors; NO schedule or
 * facility-context change (receipts created today still 9; loads created today still 0; 1 scheduled
 * inbound RN-5009857 still OPEN → 0 received; 0 scheduled outbound loads). Only task ages advanced
 * (~4h 30m). All-time Bay-4 closed rollup unchanged: 3,639 (2,718 LOAD + 921 RECEIVE) / 80 assignees;
 * GURUNANDA → Arnulfo closed: 1,104 facility-wide (1,102 LOAD + 2 RECEIVE) / 901 Bay-4 (900 + 1).
 *
 * Do NOT fabricate, estimate, or guess any metric.
 * Timestamps: task startTime values are API-naive-UTC, converted to facility local (America/Los_Angeles,
 * UTC-7) for durations — same convention as the Sep 4/5/6/7 snapshots. Facility "today" windows use
 * item-time-zone America/Los_Angeles (local-day) semantics, matching prior refreshes.
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
export const refreshStamp = "Sep 07 ~12:27 PDT";
export const refreshDateLong = "September 7, 2026";

export const doors: DoorRecord[] = [
  // ══════════════════════════════════════════════════════════════════════════════════════
  // OCCUPIED — door has an active IN_PROGRESS load/receive task (4 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK50",
    status: "Occupied",
    assignee: "daira gonzalez",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5090739", "TASK-5360206"],
    duration: "~320d",
    anomaly: true,
  },
  {
    door: "DOCK51",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5359541"],
    duration: "4d 1h",
    anomaly: false,
  },
  {
    door: "DOCK53",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5361270", "TASK-5360939"],
    duration: "2d 20h",
    anomaly: true,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360934", "TASK-5338695"],
    duration: "30d 19h",
    anomaly: true,
  },

  // ══════════════════════════════════════════════════════════════════════════════════════
  // RESERVED — NEW (assigned, not started) load/receive task (1 door)
  // ══════════════════════════════════════════════════════════════════════════════════════
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
  // AVAILABLE — no open load/receive task (18 doors)
  // ══════════════════════════════════════════════════════════════════════════════════════
  {
    door: "DOCK52",
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks (8 open tasks —
// identical set to the 09-07 07:57 PDT snapshot: no task opened, closed, or moved doors in the
// window; ages advanced ~4h 30m)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 5 },
  { name: "daira gonzalez", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
];

// All-time assignment counts (CLOSED/FORCE_CLOSED) for Bay 4 DOCK50–DOCK72
// FRESH rollup 2026-09-07 ~12:27 PDT — rescanned CLOSED/FORCE_CLOSED load + receive tasks
// across all 23 Bay-4 door IDs (3,639 closed tasks total: 2,718 LOAD + 921 RECEIVE, 80 assignees)
// — identical to every rollup since 09-05 19:04 PDT (09-06 11:30/12:20/13:20/14:45/18:45 PDT,
// 09-07 07:57 PDT): no Bay-4 closures in the window; newest closed task endTime =
// 2026-09-05T06:13:25Z = 09-04 23:13 PDT — re-verified at ~12:27 PDT
export const allTimeClosedTotal = 3639;
export const allTimeDistinctAssignees = 80;
export const allTimeAssigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 943 },
  { name: "DANIEL BELTRAN", taskCount: 915 },
  { name: "DANIELA GONZALEZ", taskCount: 366 },
  { name: "GEORGE LC BROWN", taskCount: 151 },
  { name: "RENATO ROSALES GARCIA", taskCount: 149 },
  { name: "Caren Cubides", taskCount: 147 },
  { name: "JULIO CESAR ALVARADO", taskCount: 111 },
  { name: "MARTIN MUNGUIA", taskCount: 106 },
  { name: "Fatima Del Rosario Ponce", taskCount: 88 },
  { name: "David Ramirez Selva", taskCount: 76 },
];

// Mix: 6 LOAD (outbound) + 2 RECEIVE (inbound) = 8 open tasks at Bay 4 doors (same set as the
// 09-07 07:57 PDT snapshot; ages advanced ~4h 30m)
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 8 },
  { label: "Inbound", count: 2, total: 8 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 8 },
  { label: "Inbound", count: 2, total: 8 },
];

// Schedule: today’s (2026-09-07, Monday — Labor Day) facility-wide — receipts/loads whose
// appointment time is today (facility-local day, item-time-zone America/Los_Angeles; same window
// convention as prior snapshots: appointmentTimeFrom/To = 2026-09-07T00:00:00 → 23:59:59 on receipt
// search; appointmentTimePeriod on load search).
// Completed = receipt status CLOSED (received) / load status LOADED+SHIPPED (loaded).
// Facility-wide scope (appointments do not carry a clean dockId for Bay 4 scoping).
// Monday Sep 7: 1 scheduled inbound (RN-5009857, KING’S HAWAIIAN, appointment 2026-09-07T08:00:00 PDT
// = 15:00:00Z, appointment entity 255079 / APPT-6037605 CHECKED_IN, inYard 07:36:02 PDT — OPEN, not
// yet received → 0/1); 0 scheduled outbound loads (no load carries an appointmentTime in the 09-07
// window) → outbound % n/a. (An OUTBOUND appointment entity exists — 256422, ORGAIN, LLC (ORG-655338),
// 13:00 PDT, CHECKED_IN, Amazon Logistics, Inc. — but its load record LOAD-5037118 has
// appointmentTime 09-02 (already SHIPPED), so per the load-search convention it does not create a
// denominator.) Endpoints verified live on 09-07 ~12:27 PDT.
export const scheduleAvailable = true;
export const scheduledInboundOrders = 1;
export const scheduledOutboundOrders = 0;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 0;
export const pctScheduledInboundReceived = 0; // 0 of 1 scheduled inbound received today
export const pctScheduledOutboundLoaded = 0; // n/a — 0 scheduled outbound loads today (no denominator)

// Today’s facility-wide context (2026-09-07, ~12:27 PDT)
// receipts created today (facility-local day 09-07): 9 — RN-5010117 CANCELLED (TikTok Inc.,
//   00:09:53), RN-5010118 CANCELLED (TikTok Inc., 00:13:02), RN-191981/191983/191984/191985/
//   191986/191987 IMPORTED (VAONIS, 01:53–02:33), RN-191995 EXCEPTION (KARAKA, LLC, 03:17:14)
//   — identical list to the 07:57 PDT snapshot (no receipts created 07:57→12:27 PDT)
// receipts CLOSED/FORCE_CLOSED with receivedTime today: 0
// loads created today (createdTime local-day 09-07): 0 — newest load facility-wide remains
//   LOAD-5038142 (NEW, created 2026-09-06T07:37:59Z = 09-06 00:37:59 PDT)
// loads LOADED/SHIPPED with endTime today: 0
export const facilityWideReceiptsCreated = 9;
export const facilityWideReceiptsReceived = 0;
export const facilityWideLoadsCreated = 0;
export const facilityWideLoadsShipped = 0;

// Door occupancy duration: available from task start timestamps
export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 07, 2026 ~12:27 PDT)
// 8 open tasks: 6 LOAD (outbound) + 2 RECEIVE (inbound) — identical set to the 09-07 07:57 PDT
// snapshot (no task opened, closed, or moved doors in the window; ages advanced ~4h 30m)
export const assignments: TaskRecord[] = [
  // ────── DOCK50 — inbound severe anomaly + active outbound co-located ──────
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~320d) ⚠ STALE",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },
  {
    taskId: "TASK-5360206",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (3d 20h)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK50",
  },

  // ────── OUTBOUND / LOAD ──────
  {
    taskId: "TASK-5359541",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (4d 1h)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK51",
  },
  {
    taskId: "TASK-5361270",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (2d 20h)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5360934",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (2d 23h)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5338695",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (30d 19h) ⚠ STALE",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
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
    taskId: "TASK-5360939",
    dns: "RECEIVE NEW",
    customer: "GURUNANDA, LLC",
    pieces: "NEW",
    assignee: "RUFINO MUNGUIA",
    door: "DOCK53",
  },
];
