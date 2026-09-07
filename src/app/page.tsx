import {
  doors,
  kpiMetrics,
  assigneeSummaries,
  allTimeAssigneeSummaries,
  inboundOutboundMix,
  scheduleAvailable,
  scheduledInboundReceived,
  scheduledInboundOrders,
  scheduledOutboundLoaded,
  scheduledOutboundOrders,
  pctScheduledInboundReceived,
  pctScheduledOutboundLoaded,
  assignments,
} from "@/lib/data";
import KpiCard from "@/components/KpiCard";
import DoorGrid from "@/components/DoorGrid";
import AssigneeSummaryList from "@/components/AssigneeSummary";
import OperationalMetrics from "@/components/OperationalMetrics";
import AssignmentHistory from "@/components/AssignmentHistory";

const ACCENT_CLASSES = [
  "text-[#ef4444]",
  "text-[#22c55e]",
  "text-[#f59e0b]",
  "text-[#7c3aed]",
];

const GAUGE_CLASSES = [
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#7c3aed",
];

const occupied = doors.filter((d) => d.status === "Occupied").length;
const reserved = doors.filter((d) => d.status === "Reserved").length;
const available = doors.filter((d) => d.status === "Available").length;
const anomalous = doors.filter((d) => d.anomaly).length;

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-[#1e1e2a] bg-[#0a0a0f] sticky top-0 z-10">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-bold text-[#f4f4f6] tracking-tight leading-tight">
              Bay 4 Assignments — Valley View
            </h1>
            <p className="text-xs text-[#71717a] tracking-wide">
              DOCK50–DOCK72 &nbsp;|&nbsp; September 7, 2026 &nbsp;|&nbsp; Last refreshed: Sep 07 ~15:53 PDT
            </p>
          </div>
          {/* Facility badge */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
            <span className="text-xs text-[#a1a1aa] font-medium tracking-wide">
              LT_F1
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col gap-6">
        {/* ── Section: KPI Cards ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-5 w-1 rounded-full bg-[#7c3aed]" />
            <h2 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-widest">
              Summary
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiMetrics.map((metric, i) => (
              <KpiCard
                key={metric.label}
                metric={metric}
                accentClass={ACCENT_CLASSES[i]}
                gaugeClass={GAUGE_CLASSES[i]}
              />
            ))}
          </div>
        </section>

        {/* ── Section: Door Utilization Grid ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-5 w-1 rounded-full bg-[#7c3aed]" />
            <h2 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-widest">
              Door Utilization
            </h2>
            <span className="text-xs text-[#71717a] ml-auto">
              23 doors &nbsp;|&nbsp; {occupied} occupied / {reserved} reserved / {available} available / {anomalous} anomalies
            </span>
          </div>
          <DoorGrid doors={doors} />
        </section>

        {/* ── Section: Operational Metrics ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-5 w-1 rounded-full bg-[#7c3aed]" />
            <h2 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-widest">
              Operational Metrics
            </h2>
          </div>
          <OperationalMetrics
            mix={inboundOutboundMix}
            scheduleAvailable={scheduleAvailable}
            scheduledInboundReceived={scheduledInboundReceived}
            scheduledInboundOrders={scheduledInboundOrders}
            scheduledOutboundLoaded={scheduledOutboundLoaded}
            scheduledOutboundOrders={scheduledOutboundOrders}
            pctInboundReceived={pctScheduledInboundReceived}
            pctOutboundLoaded={pctScheduledOutboundLoaded}
          />
        </section>

        {/* ── Section: Assignments by Assignee ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-5 w-1 rounded-full bg-[#7c3aed]" />
            <h2 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-widest">
              Assignments by Assignee
            </h2>
            <span className="text-xs text-[#71717a] ml-auto">
              {assigneeSummaries.reduce((sum, a) => sum + a.taskCount, 0)} active tasks
            </span>
          </div>
          <AssigneeSummaryList summaries={assigneeSummaries} />

          {/* All-time counts */}
          <div className="mt-3 bg-[#141419] border border-[#1e1e2a] rounded-xl overflow-hidden">
            <div className="px-5 py-2.5 bg-[#0a0a0f] border-b border-[#1e1e2a]">
              <span className="text-xs font-semibold text-[#71717a] uppercase tracking-wider">
                All-Time Assignments (DOCK50–DOCK72) — recomputed 09/07 ~15:53 PDT
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 py-3">
              {allTimeAssigneeSummaries.map((a) => (
                <div key={a.name} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#a1a1aa] truncate" title={a.name}>{a.name}</span>
                  <span className="text-sm font-bold text-[#7c3aed] tabular-nums">{a.taskCount}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section: Assignment History ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-5 w-1 rounded-full bg-[#7c3aed]" />
            <h2 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-widest">
              Assignment History
            </h2>
            <span className="text-xs text-[#71717a] ml-auto">
              {assignments.length} active transactions
            </span>
          </div>
          <AssignmentHistory assignments={assignments} />
        </section>

        {/* ── Section: "Guru live out / in assign to Arnulfo" ── */}
        <section>
          <div className="bg-[#141419] border border-[#1e1e2a] rounded-xl p-5 flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
              Assigned Activity — Bay 4 (GURUNANDA / Live Out &amp; In → Arnulfo)
            </span>

            {/* Interpretation banner */}
            <div className="bg-[#7c3aed10] border border-[#7c3aed33] rounded-lg px-4 py-3 mt-1">
              <span className="text-xs text-[#7c3aed] font-semibold">
                ★ No exact literal match for &quot;Guru live out / in assign to Arnulfo&quot; — interpreted as GURUNANDA dock load/receive transactions assigned to Arnulfo
              </span>
              <span className="text-xs text-[#a1a1aa] block mt-0.5">
                ARNULFO MUNGUIA (userId=89) has 5 open tasks in Bay 4 DOCK50–DOCK72 — all LOAD
                outbound (GURUNANDA). All-time (GURUNANDA → Arnulfo): 1,104 closed transactions facility-wide
                (901 at Bay 4 doors) — fresh rollup, 2026-09-07 ~15:53 PDT. Below is the current snapshot.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (5)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK50:</strong> TASK-5360206 (LOAD, IN_PROGRESS, 3d 23h)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK51:</strong> TASK-5359541 (LOAD, IN_PROGRESS, 4d 5h)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK53:</strong> TASK-5361270 (LOAD, IN_PROGRESS, 2d 23h)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5360934 (LOAD, IN_PROGRESS, 3d 2h)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5338695 (LOAD, STALE, 30d 23h)
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: 5 tasks (5 LOAD + 0 RECEIVE). All GURUNANDA. All-time: 1,104 (fresh).
                </span>
              </div>

              {/* Column 2: Full Bay 4 Assignee Breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Open Assignee Breakdown
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">ARNULFO MUNGUIA:</span> 5 open (5 LOAD — DOCK50,51,53,54, DOCK54 ×2)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, ~321d ⚠)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">RUFINO MUNGUIA:</span> 1 open (RECEIVE NEW — DOCK53, reserved)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#f59e0b] font-semibold">JEROME ARANDA:</span> 1 open (LOAD NEW — DOCK67, reserved)
                </span>
              </div>

              {/* Column 3: Customer Mix */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Customer Mix &amp; Status
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">GURUNANDA, LLC (ORG-655875):</span> 8 tasks (100% of open)
                </span>
                <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Task Status</span>
                  <span className="text-xs text-[#a1a1aa] block mt-0.5">
                    6 IN_PROGRESS + 2 NEW (75.0% / 25.0%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Data Notes ── */}
        <section>
          <div className="bg-[#141419] border border-[#1e1e2a] rounded-xl p-5 flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
              Data Notes
            </span>
            <ul className="text-xs text-[#71717a] space-y-1 list-disc list-inside">
              <li><strong className="text-[#f4f4f6]">4 Occupied / 1 Reserved / 18 Available</strong> — door utilization sourced from open load/receive tasks: 4 doors with an active IN_PROGRESS task (DOCK50,51,53,54), 1 door with a NEW not-yet-started task (DOCK67), 18 doors with no open load/receive task. <strong className="text-[#a1a1aa]">Unchanged since the 09-07 12:27 PDT snapshot</strong> — no door opened, freed, or moved tasks in the window (~3h 26m). (Note: the location API still reports a stale dockStatus=OCCUPIED for several task-free doors — now DOCK52/55/59/61/65/66/68/69/70/71; task-derived status is authoritative, consistent with prior snapshots.)</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">6 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">2 inbound (RECEIVE)</strong> = 8 total (same set as 09-07 12:27 PDT — identical task IDs, doors, statuses and assignees). 75% outbound / 25% inbound. 5 doors carry at least one open task (21.7% task occupancy). No task opened, closed, or moved doors since the prior snapshot — only ages advanced (~3h 26m).</li>
              <li><strong className="text-[#7c3aed]">★ Customer mix:</strong> all 8 open Bay 4 tasks are GURUNANDA, LLC (ORG-655875). No other customer currently holds an open Bay 4 dock task.</li>
              <li><strong className="text-[#ef4444]">⚠ SEVERE ANOMALY — DOCK50 (unchanged):</strong> TASK-5090739 ~321d old (started Oct 21 2025, 13:21 PDT) RECEIVE task remains IN_PROGRESS with endTime set (2025-10-22) and its receipt RN-5002143 CLOSED. Assigned to daira gonzalez. Stuck/stale — investigate immediately. DOCK50 also hosts Arnulfo&apos;s LOAD TASK-5360206 (3d 23h, both loads LOADED) — two open tasks co-located.</li>
              <li><strong className="text-[#f59e0b]">⚠ Aged/Stale (unchanged):</strong> TASK-5338695 (DOCK54, Arnulfo) 30d 23h with endTime set (2026-08-10) and its load SHIPPED, yet task IN_PROGRESS.</li>
              <li><strong className="text-[#ef4444]">⚠ Co-location anomalies (unchanged):</strong> DOCK53 hosts two open tasks (TASK-5361270 LOAD IN_PROGRESS 2d 23h with 1 LOADED + 4 LOADING loads, and TASK-5360939 RECEIVE NEW — RUFINO MUNGUIA, receipt RN-191921 IMPORTED, not yet started); DOCK54 hosts two open LOAD tasks (TASK-5360934 IN_PROGRESS 3d 2h with all 8 loads LOADED + stale TASK-5338695).</li>
              <li><strong className="text-[#f59e0b]">ℹ LOADED-but-open watch:</strong> TASK-5360206 (DOCK50, 3d 23h), TASK-5359541 (DOCK51, 4d 5h) and TASK-5360934 (DOCK54, 3d 2h) are IN_PROGRESS with their loads already LOADED — not flagged under the endTime anomaly rule, but monitor for stalled dispatch/close-out. DOCK67&apos;s reserved task TASK-5359531 (LOAD NEW — JEROME ARANDA) still awaits its trailer: load LOAD-5037833 is WINDOW_CHECKIN_DONE with appointment 2026-09-08T09:00:00 (Tue) — scheduling, not an anomaly.</li>
              <li><strong className="text-[#22c55e]">★ Schedule % (today, 2026-09-07 — Monday, Labor Day, facility-wide):</strong> scheduled inbounds <strong>1 → 0%</strong> (RN-5009857, KING&apos;S HAWAIIAN, appointment 09-07 08:00, CHECKED_IN / in-yard 07:36:02 — OPEN, not yet received (receive task TASK-5361525 NEW — DOCK152, ERICK OLMEDO — created 07:29 PDT, outside Bay 4); verified live on 09-07 ~15:53 PDT); scheduled outbound loads <strong>0 → n/a</strong> (an OUTBOUND appointment entity 256422 — ORGAIN, LLC (ORG-655338), 13:00, CHECKED_IN, Amazon Logistics, Inc. — exists today but its load record LOAD-5037118 has appointmentTime 09-02 (already SHIPPED), so per the load-search convention it does not create a denominator). Facility-wide context: 9 receipts created today (RN-5010117/5010118 CANCELLED — TikTok Inc.; RN-191981/191983/191984/191985/191986/191987 IMPORTED — VAONIS; RN-191995 EXCEPTION — KARAKA, LLC), 0 receipts CLOSED/FORCE_CLOSED with receivedTime today, 0 loads created today (newest load facility-wide remains LOAD-5038142, WOODY FLAW CREST INC, NEW — created 09-06 00:37:59 PDT), 0 loads LOADED/SHIPPED with endTime today. Facility-wide scope (appointments carry no clean dockId for Bay 4 scoping).</li>
              <li><strong className="text-[#7c3aed]">★ All-time rollup rescanned:</strong> full CLOSED/FORCE_CLOSED load + receive scan at all 23 Bay-4 door IDs at ~15:53 PDT — 3,639 closed transactions (2,718 LOAD + 921 RECEIVE; 3,401 CLOSED + 238 FORCE_CLOSED) across 80 assignees, top assignee ARNULFO MUNGUIA 943. Identical to every rollup since 09-05 19:04 PDT (incl. 09-07 07:57/12:27 PDT) — no Bay-4 closures in the window (newest closed task endTime still 2026-09-05T06:13:25Z = 09-04 23:13 PDT). (DANIEL BELTRAN 915, DANIELA GONZALEZ 366, GEORGE LC BROWN 151, RENATO ROSALES GARCIA 149, Caren Cubides 147, JULIO CESAR ALVARADO 111, MARTIN MUNGUIA 106, Fatima Del Rosario Ponce 88, David Ramirez Selva 76).</li>
              <li><strong className="text-[#7c3aed]">★ GuruNanda → Arnulfo rollup recomputed:</strong> 1,104 closed transactions facility-wide (1,102 LOAD + 2 RECEIVE); 901 at Bay 4 doors (900 LOAD + 1 RECEIVE) — identical to the 09-07 12:27 PDT snapshot (+0 in the window). Open: 5 LOAD IN_PROGRESS at DOCK50/51/53/54 (4 doors), ages advanced ~3h 26m (TASK-5360206 3d 23h, TASK-5359541 4d 5h, TASK-5361270 2d 23h, TASK-5360934 3d 2h, TASK-5338695 30d 23h ⚠STALE). Full pagination under assigneeUserId=89 + customerIds=[ORG-655875] + CLOSED/FORCE_CLOSED.</li>
              <li>All core metrics sourced from live WISE/WMS queries, Monday, September 7, 2026 ~15:53 PDT (all endpoints live — schedule metrics available). Assignee names via task assigneeUserName (exact API forms: ARNULFO MUNGUIA, RUFINO MUNGUIA, JEROME ARANDA, daira gonzalez); customers via task customer records (GURUNANDA, LLC per receipt/organization records). Durations: API startTime treated as UTC, converted to America/Los_Angeles (UTC-7) — same convention as the Sep 4/5/6/7 snapshots.</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: September 7, 2026 ~15:53 PDT</span>
        </div>
      </footer>
    </div>
  );
}
