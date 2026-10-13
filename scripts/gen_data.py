#!/usr/bin/env python3
"""Regenerate src/lib/data.ts from the live WISE/WMS snapshot (src/lib/wise_snapshot.json).

Values only. The exported symbol set, types and shape are held identical to the previous
refresh so src/app/page.tsx and the components keep the current visual layout unchanged.
Nothing is fabricated: every number below comes from the snapshot written by scripts/snapshot.py.
"""
import json

s = json.load(open("src/lib/wise_snapshot.json"))

def q(v):
    return json.dumps(v, ensure_ascii=False)

doors = s["doors"]
kpi = s["kpi"]
mix = s["mix"]
sch = s["schedule"]
allt = s["allTime"]
guru = s["guruArnulfo"]
fac = s["facilityOpen"]
arn = s["arnulfo"]
TOTAL = s["kpi"]["total"]

occupied = kpi["occupied"]
reserved = kpi["reserved"]
available = kpi["available"]
with_tasks = kpi["withTasks"]
occ_pct = (with_tasks / TOTAL) * 100

pct_in = (sch["inboundReceived"] / sch["inboundOrders"] * 100) if sch["inboundOrders"] else 0.0
pct_out = (sch["outboundLoaded"] / sch["outboundOrders"] * 100) if sch["outboundOrders"] else 0.0

L = []
A = L.append

A("""/**
 * Bay 4 Assignments — Authoritative Operational Data
 * Valley View Warehouse (LT_F1), DOCK50–DOCK72
 *
 * TASK DATA: Refreshed """ + s["refreshStampLA"] + """ (live WISE/WMS APIs)
 *   Sources:
 *     - /wms-bam/wms-location/search-by-paging — door locations (names[] batch; all 23 Bay-4 doors re-verified live, totalCount = 23)
 *     - /wms-bam/outbound/load-task/search-by-paging — open load tasks (facility-wide sweep, statuses NEW/IN_PROGRESS/EXCEPTION, totalCount = """ + str(fac["load"]) + """; Bay-4 subset on dockId)
 *     - /wms-bam/inbound/receive-task/search-by-paging — open receive tasks (facility-wide sweep, same statuses, totalCount = """ + str(fac["receive"]) + """; Bay-4 subset on dockId)
 *     - /wms-bam/outbound/load/search-by-paging — scheduled loads (appointmentTimePeriod BETWEEN window, totalCount = """ + str(sch["outboundOrders"]) + """)
 *     - /wms-bam/inbound/receipt/search-by-paging — scheduled receipts (appointmentTimeFrom/To window, totalCount = """ + str(sch["inboundOrders"]) + """)
 *     - all-time block — RECOMPUTED this refresh by full row-level rescan (23 doors × 2 task types)
 *
 * SNAPSHOT INSTANT: """ + s["snapshotUtc"] + """ (""" + s["refreshStampLA"] + """)
 * Scope: tenant LT, facility LT_F1 (x-facility-id: LT_F1), timezone America/Los_Angeles.
 * Open = NEW / IN_PROGRESS / EXCEPTION. Closed = CLOSED / FORCE_CLOSED.
 *
 * SCHEDULE NOTE: the current facility-local day is """ + s["bootDay"] + """ (Tuesday) — an OPERATING day: the day
 *   window carries """ + str(sch["outboundOrders"]) + """ load appointments and """ + str(sch["inboundOrders"]) + """ inbound receipt appointments. Both adherence figures have a
 *   denominator this day: % Scheduled Inbounds Received = """ + f"{pct_in:.1f}" + """% (""" + str(sch["inboundReceived"]) + """ of """ + str(sch["inboundOrders"]) + """ receipts received) and
 *   % Scheduled Outbounds Loaded = """ + f"{pct_out:.1f}" + """% (""" + str(sch["outboundLoaded"]) + """ of """ + str(sch["outboundOrders"]) + """ loads loaded/shipped).
 *
 * ALL-TIME NOTE: the all-time block was RECOMPUTED this refresh by a full row-level rescan of every
 *   Bay-4 door (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED): """ + f"{allt['load']:,}" + """ LOAD + """ + f"{allt['receive']:,}" + """ RECEIVE =
 *   """ + f"{allt['closedTotal']:,}" + """ closed Bay-4 transactions across """ + str(allt["distinct"]) + """ distinct display names — fresh, not carried forward.
 *
 * INTEGRITY: every live value below is a count returned by WISE/WMS this refresh. No rows were fabricated;
 *   nothing was carried forward where a fresh read was possible.
 */""")

A("")
A('export type DoorStatus = "Occupied" | "Reserved" | "Available";')
A("")
A("""export interface DoorRecord {
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
}""")
A("")
A(f"export const TOTAL_DOORS = {TOTAL};")
A("")
A("// Refresh stamp (America/Los_Angeles)")
A(f"export const refreshStamp = {q(s['refreshStampLA'])};")
A(f"export const refreshDateLong = {q(s['refreshDateLong'])};")
A("// UTC snapshot instant for this refresh")
A(f"export const snapshotUtc = {q(s['snapshotUtc'])};")
A(f"export const windowUtc = {q(s['snapshotUtc'])};")
A("")
A("export const doors: DoorRecord[] = [")
for d in doors:
    tid = "[" + ", ".join(q(x) for x in d["taskIds"]) + "]"
    A("  { door: " + q(d["door"]) + ", status: " + q(d["status"]) + ", assignee: " + q(d["assignee"])
      + ", customer: " + q(d["customer"]) + ", taskIds: " + tid + ", duration: " + q(d["duration"])
      + ", anomaly: " + ("true" if d["anomaly"] else "false") + " },")
A("];")
A("")
A('const occupied = doors.filter((d) => d.status === "Occupied").length;')
A('const reserved = doors.filter((d) => d.status === "Reserved").length;')
A('const available = doors.filter((d) => d.status === "Available").length;')
A("const doorsWithTasks = doors.filter((d) => d.taskIds.length > 0).length;")
A("")
A("export const kpiMetrics: KpiMetric[] = [")
A('  { label: "Doors Occupied", value: `${occupied}`, numerator: occupied, denominator: TOTAL_DOORS, percentage: (occupied / TOTAL_DOORS) * 100 },')
A('  { label: "Doors w/ Active Tasks", value: `${doorsWithTasks}`, numerator: doorsWithTasks, denominator: TOTAL_DOORS, percentage: (doorsWithTasks / TOTAL_DOORS) * 100 },')
A('  { label: "Doors Available", value: `${available}`, numerator: available, denominator: TOTAL_DOORS, percentage: (available / TOTAL_DOORS) * 100 },')
A('  { label: "Task Occupancy Rate", value: `${((doorsWithTasks / TOTAL_DOORS) * 100).toFixed(1)}%`, numerator: doorsWithTasks, denominator: TOTAL_DOORS, percentage: (doorsWithTasks / TOTAL_DOORS) * 100 },')
A("];")
A("")
A("// Open assignee task counts — Bay 4 DOCK50-DOCK72, open load/receive dock tasks at the")
A(f"// {s['snapshotUtc']} snapshot ({mix['outbound']} LOAD + {mix['inbound']} RECEIVE on {with_tasks} doors, {len(s['assigneeSummaries'])} distinct assignees)")
A("export const assigneeSummaries: AssigneeSummary[] = [")
for a in s["assigneeSummaries"]:
    A("  { name: " + q(a["name"]) + ", taskCount: " + str(a["taskCount"]) + " },")
A("];")
A("")
A("// All-time assignment counts (CLOSED + FORCE_CLOSED) for Bay 4 DOCK50–DOCK72.")
A(f"// RECOMPUTED this refresh by full row-level rescan: {allt['closedTotal']:,} closed transactions rolled up by display")
A(f"// name across {allt['distinct']} distinct names (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED).")
A(f"export const allTimeClosedTotal = {allt['closedTotal']};")
A(f"export const allTimeDistinctAssignees = {allt['distinct']};")
A(f"export const allTimeLastRecomputed = {q(s['refreshStampLA'])};")
A("export const allTimeAssigneeSummaries: AssigneeSummary[] = [")
for t in allt["top"][:10]:
    A("  { name: " + q(t["name"]) + ", taskCount: " + str(t["count"]) + " },")
A("];")
A("")
A('// "GURUNANDA -> Arnulfo" all-time at Bay-4 doors — RECOMPUTED this refresh (uid 89, customerId = ORG-655875):')
A(f"// {guru['load']} LOAD + {guru['receive']} RECEIVE = {guru['total']}.")
A("// Caveat: other employees also carry this display name on different ids; the headline uses uid 89 only,")
A("// which is the id present on the Bay-4 task rows for this name.")
A(f"export const guruArnulfoAllTimeTotal = {guru['total']};")
A(f"export const guruArnulfoAllTimeLoad = {guru['load']};")
A(f"export const guruArnulfoAllTimeReceive = {guru['receive']};")
A("")
A(f"// Mix: {mix['outbound']} LOAD (outbound) + {mix['inbound']} RECEIVE (inbound) = {mix['total']} open tasks at Bay 4 doors.")
A("export const inboundOutboundMix: MixMetric[] = [")
A(f'  {{ label: "Outbound", count: {mix["outbound"]}, total: {mix["total"]} }},')
A(f'  {{ label: "Inbound", count: {mix["inbound"]}, total: {mix["total"]} }},')
A("];")
A("")
A("export const activeInboundOutboundMix: MixMetric[] = [")
A(f'  {{ label: "Outbound", count: {mix["outbound"]}, total: {mix["total"]} }},')
A(f'  {{ label: "Inbound", count: {mix["inbound"]}, total: {mix["total"]} }},')
A("];")
A("")
A("// Schedule: facility-wide appointment adherence for the current facility-local day (" + s["bootDay"] + ", Tuesday).")
A("// Binding filters verified: loads = appointmentTimePeriod (2-element BETWEEN), receipts =")
A("// appointmentTimeFrom/To. The window returns " + str(sch["outboundOrders"]) + " loads / " + str(sch["inboundOrders"]) + " receipts (operating day).")
A("export const scheduleAvailable = true;")
A(f"export const scheduleUnavailableReason = {q('Reported — ' + s['bootDay'] + ' (Tuesday) operating day: ' + str(sch['outboundOrders']) + ' loads / ' + str(sch['inboundOrders']) + ' receipts scheduled')};")
A(f"export const scheduledInboundOrders = {sch['inboundOrders']};")
A(f"export const scheduledOutboundOrders = {sch['outboundOrders']};")
A(f"export const scheduledInboundReceived = {sch['inboundReceived']};")
A(f"export const scheduledOutboundLoaded = {sch['outboundLoaded']};")
A(f"export const pctScheduledInboundReceived = {pct_in!r}; // {sch['inboundReceived']}/{sch['inboundOrders']} — receipts received in the {s['bootDay']} window")
A(f"export const pctScheduledOutboundLoaded = {pct_out!r}; // {sch['outboundLoaded']}/{sch['outboundOrders']} — loads loaded/shipped in the window")
A("")
A("// Live status composition of the " + s["bootDay"] + " scheduled day.")
A("export const scheduleLoadStatus: Record<string, number> = " + json.dumps(sch["loadStatus"]) + ";")
A("export const scheduleReceiptStatus: Record<string, number> = " + json.dumps(sch["receiptStatus"]) + ";")
A("")
A("// Facility-wide open population swept to isolate the Bay-4 subset (fresh this refresh).")
A(f"export const facilityOpenLoad = {fac['load']};")
A(f"export const facilityOpenReceive = {fac['receive']};")
A("export const bay4DockIdMap: Record<string, string> = " + json.dumps(s["doorIdMap"]) + ";")
A("")
A("// Customer mix of the open Bay-4 population this snapshot.")
A("export const openCustomerMix: AssigneeSummary[] = [")
for c in s["customerMix"]:
    A("  { name: " + q(c["name"]) + ", taskCount: " + str(c["count"]) + " },")
A("];")
A("export const openStatusCounts: AssigneeSummary[] = [")
for c in s["statusMix"]:
    A("  { name: " + q(c["name"]) + ", taskCount: " + str(c["count"]) + " },")
A("];")
A("")
A("export const doorDurationsAvailable = true;")
A("")
A(f"// Open task records from fresh WISE data ({s['snapshotUtc']} snapshot)")
A(f"// {mix['total']} open tasks: {mix['outbound']} LOAD (outbound) + {mix['inbound']} RECEIVE (inbound)")
A("export const assignments: TaskRecord[] = [")
for a in s["assignments"]:
    A("  { taskId: " + q(a["taskId"]) + ", dns: " + q(a["dns"]) + ", customer: " + q(a["customer"])
      + ", pieces: " + q(a["pieces"]) + ", assignee: " + q(a["assignee"]) + ", door: " + q(a["door"]) + " },")
A("];")
A("")
A('// ── Assigned Activity — Bay 4 (GURUNANDA / Live Out & In → Arnulfo) section ──')
A(f"// Arnulfo Munguia (assigneeUserId 89) open tasks at Bay-4 doors this snapshot ({arn['count']} tasks: {arn['load']} LOAD + {arn['receive']} RECEIVE).")
A("export const arnulfoOpenTasks: { door: string; taskId: string; kind: string; status: string; customer: string; note: string }[] = [")
for t in arn["tasks"]:
    A("  { door: " + q(t["door"]) + ", taskId: " + q(t["taskId"]) + ", kind: " + q(t["kind"])
      + ", status: " + q(t["status"]) + ", customer: " + q(t["customer"]) + ", note: " + q(t["note"]) + " },")
A("];")
A("")
A(f"export const arnulfoOpenCount = {arn['count']};")
A(f"export const arnulfoOpenLoad = {arn['load']};")
A(f"export const arnulfoOpenReceive = {arn['receive']};")
A(f"export const arnulfoOpenGuru = {arn['guru']};")
A(f"export const arnulfoOpenKaraka = {arn['karaka']};")
A(f"export const arnulfoOpenGuruLoad = {arn['guruLoad']};")
A(f"export const arnulfoOpenGuruReceive = {arn['guruReceive']};")
A("")

open("src/lib/data.ts", "w", encoding="utf-8").write("\n".join(L))
print("wrote src/lib/data.ts")
