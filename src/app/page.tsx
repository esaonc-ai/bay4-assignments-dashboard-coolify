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
              DOCK50–DOCK72 &nbsp;|&nbsp; September 11, 2026 &nbsp;|&nbsp; Last refreshed: Sep 11 ~11:45 PDT
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
                All-Time Assignments (DOCK50–DOCK72) — recomputed live 09/11 ~11:47 PDT (3,699 closed / 81 assignees)
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
                ARNULFO MUNGUIA (userId=89) has 2 open tasks at Bay 4 DOCK50–DOCK72 — 1 LOAD outbound (GURUNANDA) + 1 NEW receive (KARAKA, ORG-585450), both at DOCK54. All-time (GURUNANDA → Arnulfo): 871 closed transactions at Bay-4 doors (870 LOAD + 1 RECEIVE) — re-derived live 2026-09-11 ~11:48 PDT. Below is the current snapshot.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (2)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK54:</strong> TASK-5338695 (LOAD, STALE, 35d 2h — LOAD-5035487 SHIPPED)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5364490 (RECEIVE, NEW — RN-191995 IMPORTED)
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: 2 tasks (1 LOAD + 1 RECEIVE). 1 GURUNANDA + 1 KARAKA. All-time: 871 at Bay-4 doors (870 LOAD + 1 RECEIVE, re-derived live ~11:48 PDT). Facility-wide, Arnulfo holds 3 open tasks (1 LOAD + 2 RECEIVE); the third, TASK-5351470 (RECEIVE IN_PROGRESS, KARAKA), sits at dock 541 — outside Bay 4 and therefore out of scope here.
                </span>
              </div>

              {/* Column 2: Full Bay 4 Assignee Breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Open Assignee Breakdown
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#22c55e] font-semibold">JEROME ARANDA:</span> 3 open (2 RECEIVE — DOCK56; 1 RECEIVE NEW — DOCK53)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#f59e0b] font-semibold">ARNULFO MUNGUIA:</span> 2 open (1 LOAD — DOCK54 STALE; 1 RECEIVE NEW — DOCK54)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">JOSE ROSAS:</span> 1 open (LOAD LIVE_LOAD — DOCK53, 7h 20m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">DANIELA GONZALEZ:</span> 1 open (RECEIVE — DOCK63, 20h 23m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">Fatima Ponce:</span> 1 open (RECEIVE — DOCK57, 2d 2h 24m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, 325d 5h ⚠)
                </span>
              </div>

              {/* Column 3: Customer Mix */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Customer Mix &amp; Status
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">GURUNANDA, LLC (ORG-655875):</span> 8 tasks (88.9% of open)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">KARAKA, LLC (ORG-585450):</span> 1 task (11.1%)
                </span>
                <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Task Status</span>
                  <span className="text-xs text-[#a1a1aa] block mt-0.5">
                    7 IN_PROGRESS + 2 NEW
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
              <li><strong className="text-[#f4f4f6]">6 Occupied / 0 Reserved / 17 Available</strong> — door utilization is task-derived at the 2026-09-11 11:44:41 PDT snapshot: 6 doors with an in-progress task (DOCK50, DOCK53, DOCK54, DOCK56, DOCK57, DOCK63), 0 doors whose only open task is NEW/not-started, 17 doors with no open load/receive task. 6 doors carry an active assignment (26.1%). Change vs 09-11 09:55 PDT (4/1/18): DOCK53 and DOCK56 newly engaged; DOCK52 freed when its NEW load closed. (Location API dockStatus remains unreliable — it reported 17 of 23 Bay-4 doors OCCUPIED; task-derived status is authoritative.)</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">2 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">7 inbound (RECEIVE)</strong> = 9 at 11:44 PDT (was 3+4=7 at 09:55). 22.2% outbound / 77.8% inbound.</li>
              <li><strong className="text-[#7c3aed]">Customer mix:</strong> 8 of the 9 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 88.9%; the 9th is the DOCK54 NEW receive for KARAKA, LLC (ORG-585450, RN-191995 IMPORTED). Task status: 7 IN_PROGRESS + 2 NEW.</li>
              <li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (unchanged condition, now aging 325d 5h):</strong> TASK-5090739 (started 2025-10-21T13:21:14Z) RECEIVE remains IN_PROGRESS with endTime set (2025-10-22T10:42:01Z) and its receipt RN-5002143 already CLOSED. Assigned to daira gonzalez. Stuck/stale — investigate immediately.</li>
              <li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 35d 2h):</strong> TASK-5338695 (started 2026-08-07T16:29:29Z, PRE_LOAD) remains IN_PROGRESS with endTime set (2026-08-10T09:27:26Z) and its load LOAD-5035487 already SHIPPED, while the same door also carries ARNULFO MUNGUIA&apos;s NEW receive TASK-5364490 (RN-191995 IMPORTED, KARAKA) — two open tasks on one door.</li>
              <li><strong className="text-[#f59e0b]">LOADED/SHIPPED-but-open watch:</strong> TASK-5338695 (DOCK54) is open with its load LOAD-5035487 already SHIPPED. Monitor for stalled close-out.</li>
              <li><strong className="text-[#f59e0b]">Long-running watch (not flagged as anomaly):</strong> DOCK57 TASK-5364028 has aged 2d 2h 24m (started 2026-09-09T16:20:24Z) with RN-5010136 still IN_PROGRESS — it is a scheduled 09-09 appointment that has drifted two days.</li>
              <li><strong className="text-[#f59e0b]">Freshness note:</strong> DOCK56 TASK-5365578 started at 2026-09-11T11:43:50Z, only ~51 seconds before the snapshot instant; it appeared as NEW in an earlier probe and IN_PROGRESS in the final snapshot.</li>
              <li><strong className="text-[#22c55e]">Schedule % (today, 2026-09-11 — Friday, facility-wide, ~11:44 PDT):</strong> scheduled inbounds 32 → 3.1% (1 CLOSED-received; the remaining day is 25 IMPORTED + 6 IN_PROGRESS); scheduled outbound loads 119 → 18.5% (22 LOADED/SHIPPED). The outbound load search honours only a date-boundary appointmentTimeFrom filter, so today&apos;s denominator is the 2026-09-11 vs 2026-09-12 from-population difference (389 − 270 = 119); the status split for the day (NEW 67 + WINDOW_CHECKIN_DONE 19 + LOADING 11 + LOADED 1 + SHIPPED 21) sums exactly to 119, and the loaded count is LOADED (1−0) + SHIPPED (23−2) = 22.</li>
              <li><strong className="text-[#a1a1aa]">All-time rollup RE-DERIVED LIVE this refresh</strong> (18:46:43Z–18:47:41Z): <strong className="text-[#f4f4f6]">3,699</strong> closed (CLOSED + FORCE_CLOSED) Bay-4 transactions across 81 assignees — per-door totalCount summed for load-task + receive-task over all 23 doors. Top assignee ARNULFO MUNGUIA 955 (was 954). GURUNANDA → Arnulfo at Bay-4 doors likewise re-derived live: <strong className="text-[#f4f4f6]">871</strong> (870 LOAD + 1 RECEIVE).</li>
              <li><strong className="text-[#7c3aed]">&quot;Guru live out / in assign to Arnulfo&quot; re-verified:</strong> still NO exact literal match. Load-task and receive-task records expose no task-name/title/subject field at all (only assigneeUserName, dockName, driverName); note/sysNote/tags were empty on these rows, and a keyword probe against the general-task search ignored the keyword (returned an identical 113 rows for three different keyword strings), so it is not usable as a name-search. Interpretation holds: GURUNANDA, LLC (ORG-655875) dock transactions assigned to Arnulfo Munguia (assigneeUserId=89). All core metrics sourced from live WISE/WMS queries, Friday 2026-09-11 11:44:41 PDT (UTC window 18:43:11Z → 18:44:53Z). API timestamps are UTC; durations aged UTC → 11:44:41 PDT.</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: September 11, 2026 ~11:45 PDT</span>
        </div>
      </footer>
    </div>
  );
}
