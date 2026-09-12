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
              DOCK50–DOCK72 &nbsp;|&nbsp; September 12, 2026 &nbsp;|&nbsp; Last refreshed: Sep 12 ~11:16 PDT
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
                All-Time Assignments (DOCK50–DOCK72) — recomputed live 09/12 ~11:16 PDT (3,710 closed / 81 assignees)
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
                ARNULFO MUNGUIA (userId=89) has 3 open tasks at Bay 4 DOCK50–DOCK72 — 2 LOAD outbound (both GURUNANDA) + 1 NEW receive (KARAKA). All-time (GURUNANDA → Arnulfo): <strong className="text-[#f4f4f6]">913</strong> closed transactions at Bay-4 doors (912 LOAD + 1 RECEIVE) — re-derived live 2026-09-12 ~11:16 PDT with the binding <code>customerIds</code> array filter (rows == totalCount, reproduced 2/2 passes). This supersedes the previously published 921, which used the non-binding singular <code>customerId</code> parameter. Below is the current snapshot.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (3)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK51:</strong> TASK-5365623 (LOAD, IN_PROGRESS, 21h 56m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5338695 (LOAD, ⚠ STALE, 35d 18h 46m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5364490 (RECEIVE, NEW — not started — KARAKA)
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: 3 tasks (2 LOAD + 1 RECEIVE). 2 GURUNANDA + 1 KARAKA. All-time: 913 at Bay-4 doors (912 LOAD + 1 RECEIVE, customerIds-filtered, reproduced 2/2 ~11:16 PDT). No other open Bay-4 task is assigned to Arnulfo.
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
                  <span className="text-[#22c55e] font-semibold">JEROME ARANDA:</span> 2 open (RECEIVE — DOCK55, 22h 08m; RECEIVE NEW — DOCK55)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">EDUARDO MEJIA:</span> 1 open (LOAD — DOCK51, 17h 00m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">BARTOLO RAMIREZ:</span> 1 open (LOAD — DOCK53, 21h 17m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">JULIO CESAR ALVARADO:</span> 1 open (LOAD — DOCK55, 43d 23h 42m ⚠)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">DANIELA GONZALEZ:</span> 1 open (RECEIVE — DOCK72, 14h 08m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">RUFINO MUNGUIA:</span> 1 open (RECEIVE — DOCK62, 20h 59m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">JORGE ANTONIO FRANCO:</span> 1 open (RECEIVE NEW — DOCK62)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">CANDY MENDEZ:</span> 1 open (RECEIVE — DOCK53, 19h 52m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, 325d 21h 55m ⚠)
                </span>
              </div>

              {/* Column 3: Customer Mix */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Customer Mix &amp; Status
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">GURUNANDA, LLC (ORG-655875):</span> 12 tasks (92.3% of open)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">KARAKA, LLC:</span> 1 task (7.7%)
                </span>
                <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Task Status</span>
                  <span className="text-xs text-[#a1a1aa] block mt-0.5">
                    10 IN_PROGRESS + 3 NEW
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
              <li><strong className="text-[#f4f4f6]">7 Occupied / 0 Reserved / 16 Available</strong> — door utilization is task-derived at the 2026-09-12 11:16:21 PDT snapshot: 7 doors with an in-progress task (DOCK50, DOCK51, DOCK53, DOCK54, DOCK55, DOCK62, DOCK72), no NEW-only reservations, 16 doors with no open load/receive task. 7 doors carry an active assignment (30.4%). Change vs 09-11 18:48 PDT (7/2/14): DOCK63 and DOCK68 released to Available, DOCK72 moved to Occupied, and DOCK55 gained TASK-5331094. (Location API dockStatus remains unreliable — it reports 17 of 23 Bay-4 doors OCCUPIED; task-derived status is authoritative.)</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">5 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">8 inbound (RECEIVE)</strong> = 13 at 11:16 PDT (was 4+10=14 at 09-11 18:48). 38.5% outbound / 61.5% inbound.</li>
              <li><strong className="text-[#7c3aed]">Customer mix:</strong> 12 of the 13 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 92.3%; the other is KARAKA, LLC (DOCK54 TASK-5364490, RECEIVE NEW). Task status: 10 IN_PROGRESS + 3 NEW.</li>
              <li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 325d 21h 55m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set — stuck/stale, unchanged condition and still aging. Assigned to daira gonzalez. Investigate immediately.</li>
              <li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 35d 18h 46m):</strong> TASK-5338695 (LOAD) remains IN_PROGRESS with endTime already set — stale — while the same door also carries ARNULFO MUNGUIA&apos;s NEW receive TASK-5364490 (KARAKA) — two open tasks on one door.</li>
              <li><strong className="text-[#f59e0b]">NEW ANOMALY this snapshot — DOCK55 (aging 43d 23h 42m):</strong> TASK-5331094 (LOAD) is IN_PROGRESS with endTime already set — stale. DOCK55 now carries three open tasks (TASK-5331094, TASK-5365675, TASK-5365676) across two assignees.</li>
              <li><strong className="text-[#f59e0b]">Duplicate open task:</strong> DOCK55 carries TASK-5365675 (RECEIVE IN_PROGRESS, 22h 08m) and TASK-5365676 (RECEIVE NEW) against the SAME receipt RN-5010237 — one receipt with two open dock tasks, both assigned to JEROME ARANDA.</li>
              <li><strong className="text-[#22c55e]">Schedule % (today, 2026-09-12 — Saturday, facility-wide, ~11:16 PDT):</strong> scheduled inbounds <strong className="text-[#f4f4f6]">2 → 0.0%</strong> (0 CLOSED-received; both receipts still IMPORTED). Scheduled outbound loads <strong className="text-[#f4f4f6]">0 today → n/a</strong>: there is no Sat-2026-09-12 load appointment population at all (both the appointmentTimePeriod binding and the consecutive-day from-population difference return 0), so no percentage is shown rather than a fabricated one.</li>
              <li><strong className="text-[#a1a1aa]">All-time rollup RE-DERIVED LIVE this refresh (row-based, reproduced 2/2 passes)</strong>: <strong className="text-[#f4f4f6]">3,710</strong> closed (CLOSED + FORCE_CLOSED) Bay-4 transactions across 81 display names (91 user ids) — 2,763 LOAD + 947 RECEIVE. Top assignee ARNULFO MUNGUIA 955. GURUNANDA → Arnulfo at Bay-4 doors: <strong className="text-[#f4f4f6]">913</strong> (912 LOAD + 1 RECEIVE).</li>
              <li><strong className="text-[#ef4444]">FILTER CORRECTION — all-time GURUNANDA → Arnulfo is 913, not 921:</strong> the WMS task searches bind the customer filter ONLY as the array parameter <code>customerIds</code>; the singular <code>customerId</code> is silently IGNORED. The previously published 921 was derived with the non-binding singular form and therefore counted 8 non-Gurunanda Bay-4 loads assigned to uid 89. With <code>customerIds=[ORG-655875]</code>: uid-89 closed loads = 1,115 facility-wide → 912 on Bay-4 doors. The receive side is 1 (TASK-5197246, DOCK69). Reproduced 2/2 passes.</li>
              <li><strong className="text-[#f59e0b]">TIMESTAMP CORRECTION — durations are facility-local:</strong> the WMS API returns facility-local wall-clock timestamps, not UTC as the earlier source comment assumed (verified against a task that closed between snapshots). Durations in this snapshot are aged local → 2026-09-12 11:16:21 PDT, which is why DOCK50 (325d 21h 55m), DOCK54 (35d 18h 46m) and DOCK55 (43d 23h 42m) read ~16h longer than the 09-11 18:48 PDT snapshot.</li>
              <li><strong className="text-[#f59e0b]">Door-ID correction:</strong> Bay-4 dock ids are NOT sequential. Live-verified: DOCK50=570, 51=554, 52=556, 53=552, 54=564, 55=560, 56=575, 57=563, 58=572, 59=571, 60=565, 61=567, 62=566, 63=568, 64=559, 65=573, 66=576, 67=577, 68=574, 69=578, 70=579, 71=580, 72=587. dockId ↔ dockName agreed on 100% of Bay-4 rows.</li>
              <li><strong className="text-[#f59e0b]">Arnulfo identity caveat (corrected):</strong> uid <strong>89</strong> (amunguia, employee code 229G) is the id on every Bay-4 task row. A <em>different</em> employee, uid <strong>1948070158297014318</strong> (employee code 0669), shares the name and adds 7 Bay-4 GURUNANDA closed LOADs — including him would give 920 (919 LOAD + 1 RECEIVE). uid 1948070158297014384 does not resolve, and uid 1948070158297014344 is DANIEL BELTRAN, a separate person (the earlier &quot;migrated duplicate of 229G&quot; note was wrong). The headline figure uses uid 89.</li>
              <li><strong className="text-[#7c3aed]">&quot;Guru live out / in assign to Arnulfo&quot; re-verified:</strong> still NO exact literal match. Load-task and receive-task records expose no task-name field; the interpretation holds: GURUNANDA, LLC (ORG-655875) dock transactions assigned to Arnulfo Munguia (assigneeUserId=89). All core metrics sourced from live WISE/WMS queries — Saturday 2026-09-12 11:16:21 PDT (UTC window 2026-09-12T18:14:07Z → 18:16:21Z).</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: September 12, 2026 ~11:16 PDT</span>
        </div>
      </footer>
    </div>
  );
}
