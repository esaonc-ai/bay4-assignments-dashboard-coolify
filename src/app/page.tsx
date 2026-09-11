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
              DOCK50–DOCK72 &nbsp;|&nbsp; September 11, 2026 &nbsp;|&nbsp; Last refreshed: Sep 11 ~09:55 PDT
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
                All-Time Assignments (DOCK50–DOCK72) — last recomputed 09/11 ~07:45 PDT (carried forward)
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
                ARNULFO MUNGUIA (userId=89) has 2 open tasks at Bay 4 DOCK50–DOCK72 — 1 LOAD outbound (GURUNANDA) + 1 NEW receive (KARAKA, ORG-585450), both at DOCK54. All-time (GURUNANDA → Arnulfo): 912 closed transactions at Bay-4 doors (911 LOAD + 1 RECEIVE) — last recomputed 2026-09-11 ~07:45 PDT (carried forward). Below is the current snapshot.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (2)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK54:</strong> TASK-5338695 (LOAD, STALE, 34d 17h — LOAD-5035487 SHIPPED)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5364490 (RECEIVE, NEW — RN-191995 IMPORTED)
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: 2 tasks (1 LOAD + 1 RECEIVE). 1 GURUNANDA + 1 KARAKA. All-time: 912 at Bay-4 doors (911 LOAD + 1 RECEIVE, carried forward). (Arnulfo&apos;s facility-wide open across all customers may exceed Bay 4; only Bay-4 doors DOCK50–DOCK72 are in scope here.)
                </span>
              </div>

              {/* Column 2: Full Bay 4 Assignee Breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Open Assignee Breakdown
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#f59e0b] font-semibold">ARNULFO MUNGUIA:</span> 2 open (1 LOAD — DOCK54; 1 RECEIVE — DOCK54 NEW)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">BARTOLO RAMIREZ:</span> 1 open (LOAD — DOCK54 PRE_LOAD, ~22m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">JEROME ARANDA:</span> 1 open (LOAD NEW — DOCK52)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">DANIELA GONZALEZ:</span> 1 open (RECEIVE — DOCK63, 11h 33m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">Fatima Ponce:</span> 1 open (RECEIVE — DOCK57, 1d 17h 35m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, ~325d ⚠)
                </span>
              </div>

              {/* Column 3: Customer Mix */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Customer Mix &amp; Status
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">GURUNANDA, LLC (ORG-655875):</span> 6 tasks (85.7% of open)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">KARAKA, LLC (ORG-585450):</span> 1 task (14.3%)
                </span>
                <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Task Status</span>
                  <span className="text-xs text-[#a1a1aa] block mt-0.5">
                    5 IN_PROGRESS + 2 NEW
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
              <li><strong className="text-[#f4f4f6]">4 Occupied / 1 Reserved / 18 Available</strong> — door utilization is task-derived at the 2026-09-11 09:55 PDT snapshot: 4 doors with an in-progress task (DOCK50, DOCK54, DOCK57, DOCK63), 1 door whose only open task is NEW/not-started (DOCK52 → Reserved), 18 doors with no open load/receive task. 5 doors carry an active assignment (21.7%). Change vs 09-11 07:45 PDT (5/0/18): DOCK53 freed when its load closed; DOCK52 newly engaged by a NEW load; DOCK54 gained a live PRE_LOAD task. (Location API dockStatus remains unreliable — task-derived status is authoritative.)</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">3 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">4 inbound (RECEIVE)</strong> = 7 at 09:55 PDT (was 2+4=6 at 07:45). 42.9% outbound / 57.1% inbound.</li>
              <li><strong className="text-[#7c3aed]">Customer mix:</strong> 6 of the 7 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 85.7%; the 7th is the DOCK54 NEW receive for KARAKA, LLC (ORG-585450, RN-191995 IMPORTED).</li>
              <li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (unchanged condition, aging ~325d):</strong> TASK-5090739 (started 2025-10-21 20:21Z) RECEIVE remains IN_PROGRESS with endTime set (2025-10-22) and its receipt RN-5002143 already CLOSED. Assigned to daira gonzalez. Stuck/stale — investigate immediately.</li>
              <li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 34d 17h):</strong> TASK-5338695 (started 2026-08-07 23:29Z) remains IN_PROGRESS with endTime set (2026-08-10) and its load LOAD-5035487 already SHIPPED, while the same door now also carries BARTOLO RAMIREZ&apos;s live PRE_LOAD TASK-5365421 (~22m) and ARNULFO MUNGUIA&apos;s NEW receive TASK-5364490 (RN-191995 IMPORTED, KARAKA) — three open tasks on one door.</li>
              <li><strong className="text-[#f59e0b]">LOADED/SHIPPED-but-open watch:</strong> TASK-5338695 (DOCK54) is open with its load LOAD-5035487 already SHIPPED. Monitor for stalled close-out.</li>
              <li><strong className="text-[#22c55e]">Schedule % (today, 2026-09-11 — Friday, facility-wide, ~09:55 PDT):</strong> scheduled inbounds 35 → 0.0% (0 CLOSED-received; the day&apos;s receipts are IMPORTED/OPEN/IN_PROGRESS still outstanding); scheduled outbound loads 119 → 8.4% (10 LOADED/SHIPPED). The outbound load search honours only a date-boundary appointmentTimeFrom filter, so today&apos;s denominator is the 2026-09-11 vs 2026-09-12 from-population difference (372 − 253 = 119) and the loaded count is the same difference for LOADED (1−0) plus SHIPPED (11−2) = 10.</li>
              <li><strong className="text-[#a1a1aa]">All-time rollup</strong> (3,695 closed Bay-4 transactions / 81 assignees / top assignee ARNULFO MUNGUIA 954; GURUNANDA → Arnulfo 912) is CARRIED FORWARD from the 09-11 ~07:45 PDT recompute — it was not rescanned in this refresh.</li>
              <li><strong className="text-[#7c3aed]">&quot;Guru live out / in assign to Arnulfo&quot; re-verified:</strong> still NO exact literal match — dock load/receive tasks carry no task-name field. Interpretation holds: GURUNANDA, LLC (ORG-655875) dock transactions assigned to Arnulfo Munguia (assigneeUserId=89). All core metrics sourced from live WISE/WMS queries, Friday 2026-09-11 ~09:55 PDT. API timestamps are UTC; durations aged UTC → 09:55:00 PDT.</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: September 11, 2026 ~09:55 PDT</span>
        </div>
      </footer>
    </div>
  );
}
