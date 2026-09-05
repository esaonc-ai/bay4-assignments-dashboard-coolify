/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed 2026-09-05 ~10:22 PDT (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations + dock/space status
 *     - /wms-bam/outbound/load-task/search-by-paging — open + closed load tasks
 *     - /wms-bam/inbound/receive-task/search-by-paging — open + closed receive tasks
 *     - /wms-bam/appointment/search-by-paging + /wms-bam/inbound/receipt/search-by-paging
 *       + /wms-bam/outbound/load/search-by-paging — scheduled appointments (today, facility-wide)
 *
 * Do NOT fabricate, estimate, or guess any metric.
 * Timestamps: API values treated as naive-UTC, converted to facility local (America/Los_Angeles,
 * UTC-7) for durations — same convention as the Sep 4 snapshot (verified against known task ages).
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
export const refreshStamp = "Sep 05 10:22 PDT";
export const refreshDateLong = "September 5, 2026";

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
    duration: "~318d",
    anomaly: true,
  },
  {
    door: "DOCK51",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5359541"],
    duration: "1d 23h",
    anomaly: false,
  },
  {
    door: "DOCK53",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5361270", "TASK-5360939"],
    duration: "18h 4m",
    anomaly: true,
  },
  {
    door: "DOCK54",
    status: "Occupied",
    assignee: "ARNULFO MUNGUIA",
    customer: "GURUNANDA, LLC",
    taskIds: ["TASK-5360934", "TASK-5338695"],
    duration: "28d 17h",
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

// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks (8 open tasks)
export const assigneeSummaries: AssigneeSummary[] = [
  { name: "ARNULFO MUNGUIA", taskCount: 5 },
  { name: "daira gonzalez", taskCount: 1 },
  { name: "RUFINO MUNGUIA", taskCount: 1 },
  { name: "JEROME ARANDA", taskCount: 1 },
];

// All-time assignment counts (CLOSED/FORCE_CLOSED) for Bay 4 DOCK50–DOCK72
// FRESH rollup 2026-09-05 10:22 PDT — scanned CLOSED/FORCE_CLOSED load + receive tasks
// across all 23 Bay-4 door IDs (3,639 closed tasks total: 2,718 LOAD + 921 RECEIVE, 80 assignees)
// — identical to the 07:14 PDT rollup (no Bay-4 closures in the window)
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

// Mix: 6 LOAD (outbound) + 2 RECEIVE (inbound) = 8 open tasks at Bay 4 doors
export const inboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 8 },
  { label: "Inbound", count: 2, total: 8 },
];

export const activeInboundOutboundMix: MixMetric[] = [
  { label: "Outbound", count: 6, total: 8 },
  { label: "Inbound", count: 2, total: 8 },
];

// Schedule: today’s (2026-09-05) facility-wide — receipts/loads whose appointment time is today
// (same naive-day window as the Sep 4 snapshot: appointmentTimeFrom/To = 2026-09-05T00:00:00 →
// 23:59:59 on receipt search; appointmentTimePeriod on load search). Completed = receipt status
// CLOSED (received) / load status LOADED+SHIPPED (loaded). Facility-wide scope (appointments do
// not carry a clean dockId for Bay 4 scoping). Saturday Sep 5: only 3 inbound appointments exist
// (all IMPORTED, none received); ZERO outbound loads have an appointment today → outbound % n/a.
// No change since the 07:14 PDT snapshot.
export const scheduleAvailable = true;
export const scheduledInboundOrders = 3;
export const scheduledOutboundOrders = 0;
export const scheduledInboundReceived = 0;
export const scheduledOutboundLoaded = 0;
export const pctScheduledInboundReceived = (0 / 3) * 100; // 0.0% — 0 of 3 scheduled inbounds received (as of 10:22 PDT)
export const pctScheduledOutboundLoaded = 0; // n/a — 0 scheduled outbound loads today (no denominator)

// Today’s facility-wide context (2026-09-05, ~10:22 PDT)
// receipts created today (createdTime naive-date 09-05): 1 (RN-112654, DELTA ELECTRONICS, CLOSED)
// receipts CLOSED/FORCE_CLOSED with receivedTime today: 10 (8 CLOSED + 2 FORCE_CLOSED)
// loads created today (createdTime naive-date 09-05): 1 (LOAD-5038141, LIFEPRO FITNESS, NEW —
//   createdTime 00:00:16Z = 17:00:16 PDT Sep 4; prior 07:14 snapshot recorded 0 under a PDT-day window)
// loads LOADED/SHIPPED with endTime today: 1 (LOAD-5037180 SHIPPED 00:07, Mars Food)
export const facilityWideReceiptsCreated = 1;
export const facilityWideReceiptsReceived = 10;
export const facilityWideLoadsCreated = 1;
export const facilityWideLoadsShipped = 1;

// Door occupancy duration: available from task start timestamps
export const doorDurationsAvailable = true;

// Open task records from fresh WISE data (Sep 05, 2026 ~10:22 PDT)
// 8 open tasks: 6 LOAD (outbound) + 2 RECEIVE (inbound) — same set as the 07:14 PDT snapshot
export const assignments: TaskRecord[] = [
  // ────── DOCK50 — inbound severe anomaly + active outbound co-located ──────
  {
    taskId: "TASK-5090739",
    dns: "RECEIVE IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (~318d) ⚠ STALE",
    assignee: "daira gonzalez",
    door: "DOCK50",
  },
  {
    taskId: "TASK-5360206",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (1d 18h)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK50",
  },

  // ────── OUTBOUND / LOAD ──────
  {
    taskId: "TASK-5359541",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (1d 23h)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK51",
  },
  {
    taskId: "TASK-5361270",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (18h 4m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK53",
  },
  {
    taskId: "TASK-5360934",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (21h 5m)",
    assignee: "ARNULFO MUNGUIA",
    door: "DOCK54",
  },
  {
    taskId: "TASK-5338695",
    dns: "LOAD IN_PROGRESS",
    customer: "GURUNANDA, LLC",
    pieces: "IN_PROGRESS (28d 17h) ⚠ STALE",
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
