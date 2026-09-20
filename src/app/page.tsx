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
  scheduleUnavailableReason,
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
              DOCK50–DOCK72 &nbsp;|&nbsp; September 20, 2026 &nbsp;|&nbsp; Last refreshed: Sep 20 ~10:27 PDT
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
            scheduleNote={scheduleUnavailableReason}
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
                ARNULFO MUNGUIA (userId=89) has 6 open tasks at Bay 4 DOCK50–DOCK72 — 3 LOAD outbound + 3 RECEIVE inbound. 4 of those 6 are GURUNANDA (3 LOAD + 1 RECEIVE). All-time (GURUNANDA → Arnulfo): <strong className="text-[#f4f4f6]">925</strong> closed transactions at Bay-4 doors (923 LOAD + 2 RECEIVE) — <strong className="text-[#f4f4f6]">recomputed in this refresh</strong> from a full row-level rescan (2026-09-20 ~10:27 PDT). Below is the current live snapshot (2026-09-20 ~10:27 PDT).
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (6)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK54:</strong> TASK-5372101 (LOAD, IN_PROGRESS, 1d 19h 58m — GURUNANDA)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5365421 (LOAD, ⚠ STALE, 9d 0h 54m — GURUNANDA)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5338695 (LOAD, ⚠ STALE, 43d 17h 57m — GURUNANDA)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5364490 (RECEIVE, IN_PROGRESS, 4d 18h 4m — KARAKA)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK62:</strong> TASK-5365814 (RECEIVE, IN_PROGRESS, 5d 19h 42m — GURUNANDA)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK56:</strong> TASK-5369120 (RECEIVE, NEW — KARAKA)
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: 6 tasks (3 LOAD + 3 RECEIVE). 4 GURUNANDA + 2 KARAKA. No other open Bay-4 task is assigned to Arnulfo. All-time (fresh): 925 at Bay-4 doors (923 LOAD + 2 RECEIVE).
                </span>
              </div>

              {/* Column 2: Full Bay 4 Assignee Breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Open Assignee Breakdown
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#22c55e] font-semibold">ARNULFO MUNGUIA:</span> 6 open (3 LOAD — DOCK54 ×3, 2 STALE; 3 RECEIVE — DOCK54, DOCK56, DOCK62)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">RUFINO MUNGUIA:</span> 3 open (RECEIVE — DOCK55 NEW; DOCK60 IN_PROGRESS + NEW)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">DANIELA GONZALEZ:</span> 2 open (RECEIVE IN_PROGRESS — DOCK57 ×2)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">CANDY MENDEZ:</span> 1 open (RECEIVE IN_PROGRESS — DOCK54)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">DANIEL BELTRAN:</span> 1 open (LOAD IN_PROGRESS — DOCK50)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, 333d 21h 6m ⚠)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">JEROME ARANDA:</span> 1 open (RECEIVE — DOCK55, NEW)
                </span>
              </div>

              {/* Column 3: Customer Mix */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Customer Mix &amp; Status
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">GURUNANDA, LLC (ORG-655875):</span> 12 tasks (80.0% of open)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">KARAKA, LLC (ORG-585450):</span> 3 tasks (20.0%)
                </span>
                <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Task Status</span>
                  <span className="text-xs text-[#a1a1aa] block mt-0.5">
                    11 IN_PROGRESS + 4 NEW
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
              <li><strong className="text-[#f4f4f6]">5 Occupied / 2 Reserved / 16 Available</strong> — door utilization is task-derived at the 2026-09-20 ~10:27 PDT snapshot: 5 doors with an in-progress open task (DOCK50, DOCK54, DOCK57, DOCK60, DOCK62), 2 doors holding only not-started NEW tasks (DOCK55, DOCK56 — Reserved rather than Occupied), 16 doors with no open load/receive task. 7 doors carry an active assignment (30.4% of the bay). <strong className="text-[#f4f4f6]">Cross-check / correction candidate:</strong> the Location API&apos;s own <code>dockStatus</code> field reports 17 Bay-4 doors OCCUPIED / 0 RESERVED / 6 AVAILABLE (DOCK52, 55, 56, 59, 60, 72 available). It is driven by trailer check-in state rather than by open dock work and <strong className="text-[#f4f4f6]">diverges materially</strong> from task-derived status (5 vs 17). Task-derived status is retained as the authoritative basis for this dashboard, consistent with the door-duration metric.</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">4 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">11 inbound (RECEIVE)</strong> = 15 at ~10:27 PDT. 26.7% outbound / 73.3% inbound. The open population was read exhaustively — a full facility-wide sweep (34 open load + 132 open receive tasks, statuses NEW/IN_PROGRESS/EXCEPTION) filtered on each row&apos;s <code>dockId</code> to the 23 Bay-4 doors.</li>
              <li><strong className="text-[#7c3aed]">Customer mix:</strong> 12 of the 15 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 80.0%; the other 3 are KARAKA, LLC (ORG-585450) — DOCK54 TASK-5364490, DOCK55 TASK-5368665, DOCK56 TASK-5369120. Task status: 11 IN_PROGRESS + 4 NEW.</li>
              <li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 333d 21h 6m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. Investigate immediately.</li>
              <li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 43d 17h 57m and 9d 0h 54m):</strong> TASK-5338695 (LOAD) and TASK-5365421 (LOAD) both remain IN_PROGRESS with endTime already set (2026-08-10 and 2026-09-11) — stale — on a door that also carries two live receive tasks (TASK-5369031 GURUNANDA, TASK-5364490 KARAKA) for five open tasks on one door.</li>
              <li><strong className="text-[#22c55e]">Live churn during this pull:</strong> none observed — the open population was stable across the whole window (facility-wide 34 load / 132 receive and Bay-4 15 tasks on both the opening read at 2026-09-20T17:24:37Z and the closing sweep at 2026-09-20T17:27:26Z). All figures on this page come from that one tight, self-consistent final sweep.</li>
              <li><strong className="text-[#f59e0b]">Schedule % NOT reported this refresh (metric unavailable):</strong> today is <strong className="text-[#f4f4f6]">Sunday 2026-09-20</strong>, and the appointment windows for this facility-local day return <strong className="text-[#f4f4f6]">0 scheduled loads and 0 scheduled receipts</strong> — a zero denominator on both. The percentages are therefore shown as UNAVAILABLE rather than estimated. The binding filters are now confirmed: <strong className="text-[#f4f4f6]">loads</strong> use <code>appointmentTimePeriod</code> — a BETWEEN that requires exactly two date-time elements, e.g. [&quot;2026-09-20T00:00:00&quot;,&quot;2026-09-20T23:59:59&quot;]; a single element is rejected (&quot;Invalid format: Request body format error.&quot;) and a one-element array is rejected (&quot;The BETWEEN operator requires a collection with two elements&quot;). Significantly, <strong className="text-[#f4f4f6]">the load search has no <code>appointmentTimeTo</code> field</strong> — passing it is silently ignored and the search binds <code>appointmentTimeFrom</code> alone (the earlier &quot;337 rows spanning 2026-09-21..24&quot; artefact). <strong className="text-[#f4f4f6]">Receipts</strong> use <code>appointmentTimeFrom</code>/<code>appointmentTimeTo</code>, which both bind (verified: 2026-09-01..2026-10-01 → 600; single day → that day only). Context only — nearest scheduled operating day 2026-09-21: 126 loads scheduled (1 SHIPPED → 0.8%), 46 receipts scheduled (0 received → 0%).</li>
              <li><strong className="text-[#22c55e]">All-time cumulative figures RECOMPUTED this refresh:</strong> the <strong className="text-[#f4f4f6]">{allTimeClosedTotal.toLocaleString()}</strong> closed Bay-4 transactions across <strong className="text-[#f4f4f6]">{allTimeDistinctAssignees}</strong> display names (top-10 list above) and the GURUNANDA → Arnulfo cumulative <strong className="text-[#f4f4f6]">925</strong> (923 LOAD + 2 RECEIVE) come from a full row-level rescan performed in this refresh — 23 doors × 2 task types (2,816 LOAD + 993 RECEIVE). They are fresh, not carried forward.</li>
              <li><strong className="text-[#ef4444]">FILTER CORRECTION — door filter binds only in the singular:</strong> the WMS task searches bind the door filter ONLY as the singular <code>dockId</code>; a plural <code>dockIds</code> (array) is silently IGNORED, and a comma-separated <code>dockId</code> string is rejected (HTTP 400). Bay-4 doors were therefore resolved from a facility-wide sweep filtered on each row&apos;s <code>dockId</code>. The customer filter binds as <code>customerIds</code> and the assignee filter as <code>assigneeUserIds</code>.</li>
              <li><strong className="text-[#f59e0b]">TIMESTAMP BASIS — durations aged task startTime → snapshot instant:</strong> task timestamps are read on the same UTC frame as the snapshot instant (2026-09-20T17:27:26Z). Query window 2026-09-20T17:24:37Z → 2026-09-20T17:27:26Z.</li>
              <li><strong className="text-[#f59e0b]">Door-ID correction:</strong> Bay-4 dock ids are NOT sequential. Live-verified this refresh (23/23, totalCount = 23): DOCK50=570, 51=554, 52=556, 53=552, 54=564, 55=560, 56=575, 57=563, 58=572, 59=571, 60=565, 61=567, 62=566, 63=568, 64=559, 65=573, 66=576, 67=577, 68=574, 69=578, 70=579, 71=580, 72=587.</li>
              <li><strong className="text-[#f59e0b]">Arnulfo identity caveat:</strong> uid <strong>89</strong> (amunguia, employee code 229G, default facility LT_F1) is the id on the live Bay-4 task rows for this name and the basis of the 925 all-time figure. Other employees share the display name &quot;ARNULFO MUNGUIA&quot; on different ids — notably uid <strong>1948070158297014384</strong> (employee229G — the <em>same</em> employee code 229G, i.e. a duplicate identity) and uid <strong>1948070158297014318</strong> (employee0669). Merging those into the all-time GURUNANDA figure would inflate it; the headline uses uid 89 only.</li>
              <li><strong className="text-[#7c3aed]">&quot;Guru live out / in assign to Arnulfo&quot; re-verified:</strong> still NO exact literal match — load-task and receive-task records expose no task-name field, so the interpretation holds: GURUNANDA, LLC (ORG-655875) dock transactions assigned to Arnulfo Munguia (assigneeUserId=89). Core live metrics sourced from live WISE/WMS queries — Sunday 2026-09-20 ~10:27 PDT (UTC window 2026-09-20T17:24:37Z → 2026-09-20T17:27:26Z).</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: September 20, 2026 ~10:27 PDT</span>
        </div>
      </footer>
    </div>
  );
}
