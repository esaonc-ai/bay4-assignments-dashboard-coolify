import {
  doors,
  kpiMetrics,
  assigneeSummaries,
  allTimeAssigneeSummaries,
  allTimeClosedTotal,
  allTimeDistinctAssignees,
  allTimeLastRecomputed,
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
              DOCK50–DOCK72 &nbsp;|&nbsp; September 16, 2026 &nbsp;|&nbsp; Last refreshed: Sep 16 ~19:20 PDT
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
                All-Time Assignments (DOCK50–DOCK72) — last full recomputation {allTimeLastRecomputed} ({allTimeClosedTotal.toLocaleString()} closed / {allTimeDistinctAssignees} assignees); not re-scanned in this refresh
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
                ARNULFO MUNGUIA (userId=89) has 5 open tasks at Bay 4 DOCK50–DOCK72 — 2 LOAD outbound (both GURUNANDA) + 3 RECEIVE inbound (all KARAKA). All-time (GURUNANDA → Arnulfo): <strong className="text-[#f4f4f6]">913</strong> closed transactions at Bay-4 doors (912 LOAD + 1 RECEIVE) — that cumulative figure is carried from the last full recomputation (2026-09-13 ~09:45 PDT) and was <strong className="text-[#f4f4f6]">not</strong> re-scanned in this refresh. Below is the current live snapshot (2026-09-16 ~19:20 PDT).
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (5)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK53:</strong> TASK-5369859 (LOAD, IN_PROGRESS, 4h 30m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5338695 (LOAD, ⚠ STALE, 40d 2h 50m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK50:</strong> TASK-5368207 (RECEIVE, ⚠ STALE, 1d 7h 55m — KARAKA)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5364490 (RECEIVE, IN_PROGRESS, 1d 2h 57m — KARAKA)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK56:</strong> TASK-5369120 (RECEIVE, NEW — KARAKA)
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: 5 tasks (2 LOAD + 3 RECEIVE). 2 GURUNANDA + 3 KARAKA. No other open Bay-4 task is assigned to Arnulfo. All-time (carried): 913 at Bay-4 doors (912 LOAD + 1 RECEIVE).
                </span>
              </div>

              {/* Column 2: Full Bay 4 Assignee Breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Open Assignee Breakdown
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#f59e0b] font-semibold">DANIELA GONZALEZ:</span> 5 open (RECEIVE — DOCK55, DOCK56, DOCK71 NEW; DOCK66, DOCK70 IN_PROGRESS)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">ARNULFO MUNGUIA:</span> 5 open (2 LOAD — DOCK53, DOCK54 STALE; 3 RECEIVE — DOCK50, DOCK54, DOCK56)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">CANDY MENDEZ:</span> 5 open (RECEIVE, all NEW — DOCK54 ×2, DOCK56, DOCK57, DOCK58)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">JORGE ANTONIO FRANCO:</span> 1 open (RECEIVE — DOCK62, 2d 4h 35m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">JEROME ARANDA:</span> 1 open (RECEIVE — DOCK55, NEW)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, 330d 5h 59m ⚠)
                </span>
              </div>

              {/* Column 3: Customer Mix */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Customer Mix &amp; Status
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">GURUNANDA, LLC (ORG-655875):</span> 14 tasks (77.8% of open)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">KARAKA, LLC (ORG-585450):</span> 4 tasks (22.2%)
                </span>
                <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Task Status</span>
                  <span className="text-xs text-[#a1a1aa] block mt-0.5">
                    8 IN_PROGRESS + 10 NEW
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
              <li><strong className="text-[#f4f4f6]">6 Occupied / 5 Reserved / 12 Available</strong> — door utilization is task-derived at the 2026-09-16 ~19:20 PDT snapshot: 6 doors with an in-progress open task (DOCK50, DOCK53, DOCK54, DOCK62, DOCK66, DOCK70), 5 doors holding only a not-started NEW task (DOCK55, DOCK56, DOCK57, DOCK58, DOCK71), 12 doors with no open load/receive task. 11 doors carry an active assignment (47.8%). (Location API dockStatus remains unreliable — it reports far more Bay-4 doors OCCUPIED; task-derived status is authoritative.)</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">2 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">16 inbound (RECEIVE)</strong> = 18 at ~19:20 PDT. 11.1% outbound / 88.9% inbound. All 18 are on Bay-4 doors; the open population was read exhaustively (every one of the 23 Bay-4 doors swept individually for open load tasks and open receive tasks, rows == totalCount on every door).</li>
              <li><strong className="text-[#7c3aed]">Customer mix:</strong> 14 of the 18 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 77.8%; the other 4 are KARAKA, LLC (ORG-585450) — DOCK50 TASK-5368207, DOCK54 TASK-5364490, DOCK55 TASK-5368665, DOCK56 TASK-5369120. Task status: 8 IN_PROGRESS + 10 NEW.</li>
              <li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 330d 5h 59m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. Investigate immediately.</li>
              <li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 40d 2h 50m):</strong> TASK-5338695 (LOAD) remains IN_PROGRESS with endTime already set (2026-08-10) — stale — while the same door also carries ARNULFO MUNGUIA&apos;s live KARAKA RECEIVE TASK-5364490 plus two NEW GURUNANDA receives (TASK-5369404, TASK-5369031) — four open tasks on one door.</li>
              <li><strong className="text-[#f59e0b]">Two open receive tasks on DOCK50:</strong> TASK-5368207 (RECEIVE IN_PROGRESS, 1d 7h 55m, KARAKA — now also showing an endTime while still IN_PROGRESS) and TASK-5090739 (RECEIVE IN_PROGRESS, 330d 5h 59m, GURUNANDA) — different receipts, two assignees, one door.</li>
              <li><strong className="text-[#22c55e]">Schedule % (today, 2026-09-16 — Wednesday, facility-wide, ~19:20 PDT):</strong> scheduled inbounds received <strong className="text-[#f4f4f6]">{scheduledInboundReceived} of {scheduledInboundOrders} = {pctScheduledInboundReceived.toFixed(1)}%</strong> (receipts whose binding appointmentTimeFrom/To window falls on 2026-09-16; 14 CLOSED + 20 IMPORTED + 15 IN_PROGRESS); scheduled outbound loads loaded <strong className="text-[#f4f4f6]">{scheduledOutboundLoaded} of {scheduledOutboundOrders} = {pctScheduledOutboundLoaded.toFixed(1)}%</strong> (loads whose binding appointmentTimePeriod falls on 2026-09-16; 102 SHIPPED + 1 LOADING + 27 NEW). Both denominators are non-zero this refresh, so both percentages are reported live. Control: the 2026-09-15 receipt window returns 58, matching the prior snapshot.</li>
              <li><strong className="text-[#a1a1aa]">All-time cumulative figure NOT re-scanned this refresh:</strong> the <strong className="text-[#f4f4f6]">{allTimeClosedTotal.toLocaleString()}</strong> closed Bay-4 transactions across <strong className="text-[#f4f4f6]">{allTimeDistinctAssignees}</strong> assignees (top-10 list above) and the GURUNANDA → Arnulfo cumulative <strong className="text-[#f4f4f6]">913</strong> (912 LOAD + 1 RECEIVE) are carried from the last full row-level recomputation ({allTimeLastRecomputed}). That rescan reads several thousand closed task rows across 23 doors × 2 task types and is outside this refresh; those figures keep their recomputation stamp rather than being presented as fresh.</li>
              <li><strong className="text-[#ef4444]">FILTER CORRECTION — door filter binds only in the singular:</strong> the WMS task searches bind the door filter ONLY as the singular <code>dockId</code>; the plural <code>dockIds</code> (array) is silently IGNORED and the search then returns the facility-wide population, and a comma-separated <code>dockId</code> string is rejected (HTTP 400 &quot;Invalid arguments&quot;). Re-verified live this refresh. The customer filter binds ONLY as the array parameter <code>customerIds</code> (singular <code>customerId</code> is ignored), and the assignee filter as <code>assigneeUserIds</code>/<code>userIds</code>.</li>
              <li><strong className="text-[#f59e0b]">TIMESTAMP BASIS — durations aged task startTime → snapshot instant:</strong> task timestamps are read on the same UTC frame as the snapshot instant (2026-09-17T02:20:28Z), exactly as in every prior snapshot, so the aged durations stay comparable across refreshes.</li>
              <li><strong className="text-[#f59e0b]">Door-ID correction:</strong> Bay-4 dock ids are NOT sequential. Live-verified this refresh (23/23): DOCK50=570, 51=554, 52=556, 53=552, 54=564, 55=560, 56=575, 57=563, 58=572, 59=571, 60=565, 61=567, 62=566, 63=568, 64=559, 65=573, 66=576, 67=577, 68=574, 69=578, 70=579, 71=580, 72=587.</li>
              <li><strong className="text-[#f59e0b]">Arnulfo identity caveat:</strong> uid <strong>89</strong> (amunguia, employee code 229G, default facility LT_F1) is the id on the Bay-4 task rows for this name. A <em>different</em> employee, uid <strong>1948070158297014318</strong> (employee code 0669), shares the name and was previously found to add 7 Bay-4 GURUNANDA closed LOADs (would give 920) — the carried headline uses uid 89. This refresh separately surfaced uid 1948070158297014498 (&quot;JORGE ANTONIO FRANCO&quot;, DOCK62), uid 2000820354010531889 (&quot;JEROME ARANDA&quot;, DOCK55), uid 1948070158297014492 (&quot;daira gonzalez&quot;, DOCK50 stale receive), uid 11769 (&quot;DANIELA GONZALEZ&quot;, 5 Bay-4 receives) and uid 10200 (&quot;CANDY MENDEZ&quot;, 5 Bay-4 receives) — distinct employees, not Aliases of Arnulfo.</li>
              <li><strong className="text-[#7c3aed]">&quot;Guru live out / in assign to Arnulfo&quot; re-verified:</strong> still NO exact literal match. Load-task and receive-task records expose no task-name field; the interpretation holds: GURUNANDA, LLC (ORG-655875) dock transactions assigned to Arnulfo Munguia (assigneeUserId=89). Core live metrics sourced from live WISE/WMS queries — Wednesday 2026-09-16 ~19:20 PDT (UTC window 2026-09-17T02:19:00Z → 2026-09-17T02:20:30Z).</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: September 16, 2026 ~19:20 PDT</span>
        </div>
      </footer>
    </div>
  );
}
