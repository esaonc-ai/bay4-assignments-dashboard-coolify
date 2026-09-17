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
              DOCK50–DOCK72 &nbsp;|&nbsp; September 17, 2026 &nbsp;|&nbsp; Last refreshed: Sep 17 ~15:04 PDT
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
                All-Time Assignments (DOCK50–DOCK72) — full recomputation {allTimeLastRecomputed} ({allTimeClosedTotal.toLocaleString()} closed / {allTimeDistinctAssignees} assignees); re-scanned in this refresh
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
                ARNULFO MUNGUIA (userId=89) has 5 open tasks at Bay 4 DOCK50–DOCK72 — 1 LOAD outbound + 4 RECEIVE inbound. 2 of those 5 are GURUNANDA (1 LOAD + 1 RECEIVE). All-time (GURUNANDA → Arnulfo): <strong className="text-[#f4f4f6]">923</strong> closed transactions at Bay-4 doors (921 LOAD + 2 RECEIVE) — <strong className="text-[#f4f4f6]">recomputed in this refresh</strong> from a full row-level rescan (2026-09-17 ~15:04 PDT). Below is the current live snapshot (2026-09-17 ~15:04 PDT).
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (5)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK54:</strong> TASK-5338695 (LOAD, ⚠ STALE, 40d 22h 34m — GURUNANDA)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK62:</strong> TASK-5365814 (RECEIVE, IN_PROGRESS, 3d 0h 19m — GURUNANDA)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK50:</strong> TASK-5368207 (RECEIVE, ⚠ STALE, 2d 3h 39m — KARAKA)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5364490 (RECEIVE, IN_PROGRESS, 1d 22h 41m — KARAKA)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK56:</strong> TASK-5369120 (RECEIVE, NEW — KARAKA)
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: 5 tasks (1 LOAD + 4 RECEIVE). 2 GURUNANDA + 3 KARAKA. No other open Bay-4 task is assigned to Arnulfo. All-time (fresh): 923 at Bay-4 doors (921 LOAD + 2 RECEIVE).
                </span>
              </div>

              {/* Column 2: Full Bay 4 Assignee Breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Open Assignee Breakdown
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#22c55e] font-semibold">ARNULFO MUNGUIA:</span> 5 open (1 LOAD — DOCK54 STALE; 4 RECEIVE — DOCK50, DOCK54, DOCK56, DOCK62)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">CANDY MENDEZ:</span> 2 open (RECEIVE, all NEW — DOCK54, DOCK56)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">DANIEL BELTRAN:</span> 2 open (LOAD — DOCK57 IN_PROGRESS, DOCK59 NEW)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#f59e0b] font-semibold">DANIELA GONZALEZ:</span> 2 open (RECEIVE, all NEW — DOCK55, DOCK56)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">SILVANO SERTORIO HERNANDEZ:</span> 2 open (LOAD IN_PROGRESS — DOCK53, DOCK54)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">Fatima Ponce:</span> 1 open (RECEIVE — DOCK57, 3h 4m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">EFREN SALVADOR:</span> 1 open (LOAD — DOCK58, 0h 5m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">JEROME ARANDA:</span> 1 open (RECEIVE — DOCK55, NEW)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#f59e0b] font-semibold">RUFINO MUNGUIA:</span> 1 open (RECEIVE — DOCK70, 3h 28m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, 331d 1h 43m ⚠)
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
                    11 IN_PROGRESS + 7 NEW
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
              <li><strong className="text-[#f4f4f6]">7 Occupied / 3 Reserved / 13 Available</strong> — door utilization is task-derived at the 2026-09-17 ~15:04 PDT snapshot: 7 doors with an in-progress open task (DOCK50, DOCK53, DOCK54, DOCK57, DOCK58, DOCK62, DOCK70), 3 doors holding only a not-started NEW task (DOCK55, DOCK56, DOCK59), 13 doors with no open load/receive task. 10 doors carry an active assignment (43.5%). (The Location API&apos;s own <code>dockStatus</code> field remains unreliable as an occupancy signal — read live this refresh it reports 18 Bay-4 doors OCCUPIED / 1 RESERVED / 4 AVAILABLE, driven by trailer check-in state rather than by open dock work; task-derived status is the authoritative basis for this dashboard and is used unchanged.)</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">6 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">12 inbound (RECEIVE)</strong> = 18 at ~15:04 PDT. 33.3% outbound / 66.7% inbound. All 18 are on Bay-4 doors; the open population was read exhaustively (every one of the 23 Bay-4 doors swept individually for open load tasks and open receive tasks, rows == totalCount on every door).</li>
              <li><strong className="text-[#7c3aed]">Customer mix:</strong> 14 of the 18 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 77.8%; the other 4 are KARAKA, LLC (ORG-585450) — DOCK50 TASK-5368207, DOCK54 TASK-5364490, DOCK55 TASK-5368665, DOCK56 TASK-5369120. Task status: 11 IN_PROGRESS + 7 NEW.</li>
              <li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 331d 1h 43m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. Investigate immediately.</li>
              <li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 40d 22h 34m):</strong> TASK-5338695 (LOAD) remains IN_PROGRESS with endTime already set (2026-08-10) — stale — while the same door also carries ARNULFO MUNGUIA&apos;s KARAKA RECEIVE TASK-5364490, a second live GURUNANDA LOAD (TASK-5370878) and a NEW GURUNANDA receive (TASK-5369031) — four open tasks on one door.</li>
              <li><strong className="text-[#f59e0b]">Two open receive tasks on DOCK50:</strong> TASK-5368207 (RECEIVE IN_PROGRESS, 2d 3h 39m, KARAKA — now also showing an endTime while still IN_PROGRESS) and TASK-5090739 (RECEIVE IN_PROGRESS, 331d 1h 43m, GURUNANDA) — different receipts, two assignees, one door.</li>
              <li><strong className="text-[#22c55e]">Schedule % (today, 2026-09-17 — Thursday, facility-wide, ~15:04 PDT):</strong> scheduled inbounds received <strong className="text-[#f4f4f6]">{scheduledInboundReceived} of {scheduledInboundOrders} = {pctScheduledInboundReceived.toFixed(1)}%</strong> (receipts whose binding appointmentTimeFrom/To window falls on 2026-09-17; 11 IMPORTED + 9 IN_PROGRESS + 1 OPEN + 1 CLOSED); scheduled outbound loads loaded <strong className="text-[#f4f4f6]">{scheduledOutboundLoaded} of {scheduledOutboundOrders} = {pctScheduledOutboundLoaded.toFixed(1)}%</strong> (loads whose binding appointmentTimePeriod falls on 2026-09-17; 88 SHIPPED + 20 LOADING + 17 NEW + 13 WINDOW_CHECKIN_DONE + 3 LOADED). Both denominators are non-zero this refresh, so both percentages are reported live. Control: the 2026-09-16 receipt window returns 49, matching the prior snapshot. (The 2026-09-16 load window now returns 120 vs the 130 recorded for that day in the prior snapshot — a past appointment day&apos;s load population drifts as loads are cancelled or re-appointed.)</li>
              <li><strong className="text-[#22c55e]">All-time cumulative figure RECOMPUTED this refresh:</strong> the <strong className="text-[#f4f4f6]">{allTimeClosedTotal.toLocaleString()}</strong> closed Bay-4 transactions across <strong className="text-[#f4f4f6]">{allTimeDistinctAssignees}</strong> display names (top-10 list above) and the GURUNANDA → Arnulfo cumulative <strong className="text-[#f4f4f6]">923</strong> (921 LOAD + 2 RECEIVE) come from a full row-level rescan performed in this refresh — 23 doors × 2 task types, 2,807 LOAD + 980 RECEIVE rows, with rows == totalCount asserted on every door/type pair. They are fresh, not carried forward.</li>
              <li><strong className="text-[#ef4444]">FILTER CORRECTION — door filter binds only in the singular:</strong> the WMS task searches bind the door filter ONLY as the singular <code>dockId</code>; the plural <code>dockIds</code> (array) is silently IGNORED and the search then returns the facility-wide population, and a comma-separated <code>dockId</code> string is rejected (HTTP 400 &quot;Invalid arguments&quot;). Re-verified live this refresh (load-task facility-wide = 45 open; <code>dockIds=[564]</code> also returned 45; <code>dockId=&quot;564,560&quot;</code> → HTTP 400). The customer filter binds ONLY as the array parameter <code>customerIds</code> (singular <code>customerId</code> is ignored), and the assignee filter as <code>assigneeUserIds</code>/<code>userIds</code>. The <code>statuses</code> array binds on both task types (DOCK54 load-task: 376 rows with no status filter vs 2 with the open statuses).</li>
              <li><strong className="text-[#f59e0b]">TIMESTAMP BASIS — durations aged task startTime → snapshot instant:</strong> task timestamps are read on the same UTC frame as the snapshot instant (2026-09-17T22:04:27Z). Query window 2026-09-17T22:01:00Z → 2026-09-17T22:05:00Z.</li>
              <li><strong className="text-[#f59e0b]">Door-ID correction:</strong> Bay-4 dock ids are NOT sequential. Live-verified this refresh (23/23, totalCount = 23): DOCK50=570, 51=554, 52=556, 53=552, 54=564, 55=560, 56=575, 57=563, 58=572, 59=571, 60=565, 61=567, 62=566, 63=568, 64=559, 65=573, 66=576, 67=577, 68=574, 69=578, 70=579, 71=580, 72=587.</li>
              <li><strong className="text-[#f59e0b]">Arnulfo identity caveat:</strong> uid <strong>89</strong> (amunguia, employee code 229G, default facility LT_F1) is the id on the Bay-4 task rows for this name and the basis of the 923 all-time figure. A <em>different</em> employee also named ARNULFO MUNGUIA (uid <strong>1948070158297014318</strong>) carries 7 more Bay-4 GURUNANDA closed LOADs, so a merged figure would read 930 — the headline uses uid 89 only. This refresh separately surfaced distinct employees, not aliases: uid 1932077596691410945 (&quot;DANIEL BELTRAN&quot;), uid 1932077629981601793 (&quot;EFREN SALVADOR&quot;), uid 1932554285585764354 (&quot;SILVANO SERTORIO HERNANDEZ&quot;), uid 2053885581368619009 (&quot;Fatima Ponce&quot;), uid 686 (&quot;RUFINO MUNGUIA&quot;), plus 2000820354010531889 (&quot;JEROME ARANDA&quot;, DOCK55), 1948070158297014492 (&quot;daira gonzalez&quot;, DOCK50 stale receive), 11769 (&quot;DANIELA GONZALEZ&quot;) and 10200 (&quot;CANDY MENDEZ&quot;).</li>
              <li><strong className="text-[#7c3aed]">&quot;Guru live out / in assign to Arnulfo&quot; re-verified:</strong> still NO exact literal match. Load-task and receive-task records expose no task-name field; the interpretation holds: GURUNANDA, LLC (ORG-655875) dock transactions assigned to Arnulfo Munguia (assigneeUserId=89). Core live metrics sourced from live WISE/WMS queries — Thursday 2026-09-17 ~15:04 PDT (UTC window 2026-09-17T22:01:00Z → 2026-09-17T22:05:00Z).</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: September 17, 2026 ~15:04 PDT</span>
        </div>
      </footer>
    </div>
  );
}
