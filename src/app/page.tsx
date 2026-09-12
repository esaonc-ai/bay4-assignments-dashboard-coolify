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
              DOCK50–DOCK72 &nbsp;|&nbsp; September 11, 2026 &nbsp;|&nbsp; Last refreshed: Sep 11 ~18:48 PDT
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
                All-Time Assignments (DOCK50–DOCK72) — recomputed live 09/12 ~01:51 UTC (3,708 closed / 81 assignees)
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
                ARNULFO MUNGUIA (userId=89) has 3 open tasks at Bay 4 DOCK50–DOCK72 — 2 LOAD outbound (both GURUNANDA) + 1 NEW receive (KARAKA, ORG-585450). All-time (GURUNANDA → Arnulfo): <strong className="text-[#f4f4f6]">913</strong> closed transactions at Bay-4 doors (912 LOAD + 1 RECEIVE) — re-derived live 2026-09-11 ~18:48 PDT with the binding <code>customerIds</code> array filter, reproduced 2/2 passes. This corrects the previously published 921, which used the non-binding singular <code>customerId</code> parameter and therefore included 8 non-Gurunanda Bay-4 loads (7 KARAKA + 1 ORG-436686). Below is the current snapshot.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (3)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK51:</strong> TASK-5365623 (LOAD, PRE_LOAD, 5h 28m — 4 LOADED + 1 LOADING)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5338695 (LOAD, STALE, 35d 2h 18m — LOAD-5035487 SHIPPED)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5364490 (RECEIVE, NEW — RN-191995 IMPORTED)
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: 3 tasks (2 LOAD + 1 RECEIVE). 2 GURUNANDA + 1 KARAKA. All-time: 913 at Bay-4 doors (912 LOAD + 1 RECEIVE, `customerIds`-filtered, reproduced 2/2 ~18:48 PDT). Facility-wide, Arnulfo (uid 89) holds 4 open tasks (2 LOAD + 2 RECEIVE); the fourth, TASK-5351470 (RECEIVE IN_PROGRESS, KARAKA), sits at DOCK36 — outside Bay 4 and therefore out of scope here.
                </span>
              </div>

              {/* Column 2: Full Bay 4 Assignee Breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Open Assignee Breakdown
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#f59e0b] font-semibold">ARNULFO MUNGUIA:</span> 3 open (2 LOAD — DOCK51 + DOCK54 STALE; 1 RECEIVE NEW — DOCK54)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">DANIELA GONZALEZ:</span> 3 open (RECEIVE — DOCK68, 52m; RECEIVE NEW — DOCK63; RECEIVE NEW — DOCK72)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">JEROME ARANDA:</span> 2 open (RECEIVE — DOCK55, 5h 40m; RECEIVE NEW — DOCK55)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">EDUARDO MEJIA:</span> 1 open (LOAD PRE_LOAD — DOCK51, 31m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">BARTOLO RAMIREZ:</span> 1 open (LOAD PRE_LOAD — DOCK53, 4h 49m, 6 loads LOADED)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">RUFINO MUNGUIA:</span> 1 open (RECEIVE — DOCK62, 4h 30m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">JORGE ANTONIO FRANCO:</span> 1 open (RECEIVE NEW — DOCK62)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">CANDY MENDEZ:</span> 1 open (RECEIVE — DOCK53, 3h 24m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, 325d 5h 26m ⚠)
                </span>
              </div>

              {/* Column 3: Customer Mix */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Customer Mix &amp; Status
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">GURUNANDA, LLC (ORG-655875):</span> 12 tasks (85.7% of open)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">KARAKA, LLC (ORG-585450):</span> 1 task (7.1%)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#f59e0b] font-semibold">SIMPLE MODERN (ORG-214099):</span> 1 task (7.1%)
                </span>
                <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Task Status</span>
                  <span className="text-xs text-[#a1a1aa] block mt-0.5">
                    9 IN_PROGRESS + 5 NEW
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
              <li><strong className="text-[#f4f4f6]">7 Occupied / 2 Reserved / 14 Available</strong> — door utilization is task-derived at the 2026-09-11 18:48:00 PDT snapshot: 7 doors with an in-progress task (DOCK50, DOCK51, DOCK53, DOCK54, DOCK55, DOCK62, DOCK68), 2 doors whose only open task is NEW/not-started (DOCK63, DOCK72), 14 doors with no open load/receive task. 9 doors carry an active assignment (39.1%). Change vs 11:44 PDT (6/0/17): DOCK51, DOCK55, DOCK62 and DOCK68 newly engaged; DOCK63 and DOCK72 now hold NEW-only reservations; DOCK56 and DOCK57 released to Available. (Location API dockStatus remains unreliable — it reports 17 of 23 Bay-4 doors OCCUPIED; task-derived status is authoritative.)</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">4 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">10 inbound (RECEIVE)</strong> = 14 at 18:48 PDT (was 2+7=9 at 11:44). 28.6% outbound / 71.4% inbound. All 4 LOAD tasks are PRE_LOAD.</li>
              <li><strong className="text-[#7c3aed]">Customer mix:</strong> 12 of the 14 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 85.7%; the others are KARAKA, LLC (ORG-585450, DOCK54 RN-191995 IMPORTED) and SIMPLE MODERN (ORG-214099, DOCK63 RN-191943 IN_PROGRESS). Task status: 9 IN_PROGRESS + 5 NEW.</li>
              <li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (unchanged condition, now aging 325d 5h 26m):</strong> TASK-5090739 (started 2025-10-21T20:21:14Z) RECEIVE remains IN_PROGRESS with endTime set (2025-10-22T17:42:01Z) and its receipt RN-5002143 already CLOSED. Assigned to daira gonzalez. Stuck/stale — investigate immediately.</li>
              <li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 35d 2h 18m):</strong> TASK-5338695 (started 2026-08-07T23:29:29Z, PRE_LOAD) remains IN_PROGRESS with endTime set (2026-08-10T16:27:26Z) and its load LOAD-5035487 already SHIPPED, while the same door also carries ARNULFO MUNGUIA&apos;s NEW receive TASK-5364490 (RN-191995 IMPORTED, KARAKA) — two open tasks on one door.</li>
              <li><strong className="text-[#f59e0b]">LOADED/SHIPPED-but-open watch:</strong> TASK-5338695 (DOCK54) is open with its load LOAD-5035487 already SHIPPED; DOCK53 TASK-5365768 (4h 49m) is IN_PROGRESS with all 6 of its loads already LOADED; DOCK51 TASK-5365623 has 4 of 5 loads LOADED (LOAD-5038570 still LOADING). Monitor all three for stalled close-out.</li>
              <li><strong className="text-[#f59e0b]">Duplicate open task:</strong> DOCK55 carries TASK-5365675 (RECEIVE IN_PROGRESS, 5h 40m) and TASK-5365676 (RECEIVE NEW) against the SAME receipt RN-5010237 — one receipt with two open dock tasks, both assigned to JEROME ARANDA.</li>
              <li><strong className="text-[#f59e0b]">Freshness note:</strong> DOCK68 TASK-5366062 started 2026-09-12T00:55:43Z (52m) and DOCK51 TASK-5366005 started 2026-09-12T01:16:08Z (31m) — both under an hour old at the snapshot instant.</li>
              <li><strong className="text-[#22c55e]">Schedule % (today, 2026-09-11 — Friday, facility-wide, ~18:48 PDT):</strong> scheduled inbounds 38 → 2.6% (1 CLOSED-received; the remaining day is 21 IMPORTED + 14 IN_PROGRESS + 1 TASK_COMPLETED + 1 EXCEPTION); scheduled outbound loads 114 → 78.9% (90 LOADED/SHIPPED). The outbound load search honours only a date-boundary appointmentTimeFrom filter, so today&apos;s denominator is the 2026-09-11 vs 2026-09-12 from-population difference (424 − 310 = 114); the status split for the day (NEW 19 + WINDOW_CHECKIN_DONE 2 + LOADING 4 + LOADED 0 + SHIPPED 90) sums exactly to 114, and the loaded count is LOADED (0−0) + SHIPPED (92−2) = 90.</li>
              <li><strong className="text-[#a1a1aa]">All-time rollup RE-DERIVED LIVE this refresh (row-based, reproduced 2/2 passes)</strong>: <strong className="text-[#f4f4f6]">3,708</strong> closed (CLOSED + FORCE_CLOSED) Bay-4 transactions across 81 assignees — 2,764 LOAD + 944 RECEIVE. Top assignee ARNULFO MUNGUIA 955. GURUNANDA → Arnulfo at Bay-4 doors: <strong className="text-[#f4f4f6]">913</strong> (912 LOAD + 1 RECEIVE).</li>
              <li><strong className="text-[#ef4444]">FILTER CORRECTION — all-time GURUNANDA → Arnulfo is 913, not 921:</strong> the WMS task searches bind the customer filter ONLY as the array parameter <code>customerIds</code>; the singular <code>customerId</code> is silently IGNORED — a control query with <code>customerId=ORG-000000</code> returns the same 1,156 rows as no customer filter at all. The previously published 921 was derived with the non-binding singular form and therefore counted 8 non-Gurunanda Bay-4 loads assigned to uid 89. With <code>customerIds=[ORG-655875]</code>: uid-89 closed loads = 1,115 facility-wide → 912 on Bay-4 doors; the 8 excluded rows are 7 KARAKA, LLC (ORG-585450) + 1 ORG-436686. The receive side is unchanged at 1 (TASK-5197246, DOCK69). Reproduced 2/2 passes.</li>
              <li><strong className="text-[#f59e0b]">RECONCILIATION — per-door derivation reliability:</strong> the BAM search-by-paging <em>aggregate</em> totalCount is non-deterministic when filtered per door — individual dockId queries intermittently return 0/null and whole-set counts drift (the Bay-4 all-assignee closed total has read 3,673 / 3,699 / 3,701 in earlier passes and 3,708 twice in this one, the drift tracking both real task closes and the instability). Every figure above therefore comes from a pass that fetches ROWS and asserts rows == totalCount; that held for all 23 doors on both task types, twice.</li>
              <li><strong className="text-[#f59e0b]">Arnulfo identity caveat:</strong> &quot;ARNULFO MUNGUIA&quot; matches two employees. uid <strong>89</strong> (amunguia, employee code 229G) is the id on every Bay-4 task row; its migrated duplicate uid <strong>1948070158297014384</strong> (employee229G, same code 229G) adds 0 tasks, so matching both id forms is safe and changes nothing. A <em>different</em> employee, uid <strong>1948070158297014318</strong> (employee0669), shares the same name and adds 7 Bay-4 GURUNANDA closed LOADs — including it would give 920 (919 LOAD + 1 RECEIVE). The headline figure uses uid 89.</li>
              <li><strong className="text-[#7c3aed]">&quot;Guru live out / in assign to Arnulfo&quot; re-verified:</strong> still NO exact literal match. Load-task and receive-task records expose no task-name/title/subject field at all (only assigneeUserName, dockName, driverName); note/sysNote/tags were empty on these rows, and a keyword probe against the general-task search ignored the keyword, so it is not usable as a name-search. Interpretation holds: GURUNANDA, LLC (ORG-655875) dock transactions assigned to Arnulfo Munguia (assigneeUserId=89). All core metrics sourced from live WISE/WMS queries, Friday 2026-09-11 18:48:00 PDT (UTC window 2026-09-12T01:48:00Z → 2026-09-12T01:49:47Z). API timestamps are UTC; durations aged UTC → 18:48:00 PDT.</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: September 11, 2026 ~18:48 PDT</span>
        </div>
      </footer>
    </div>
  );
}
