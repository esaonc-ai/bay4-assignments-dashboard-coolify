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
              DOCK50–DOCK72 &nbsp;|&nbsp; August 23, 2026 &nbsp;|&nbsp; Last refreshed: Aug 23 18:27 PDT
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
                All-Time Assignments (DOCK50–DOCK72)
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
                ARNULFO MUNGUIA (userId=89) has 4 open tasks in Bay 4 DOCK50–DOCK72 — all PRE_LOAD
                outbound (GURUNANDA). All-time (GURUNANDA → Arnulfo): 483 transactions. Below is the current snapshot.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (4)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK50:</strong> TASK-5349533 (LOAD, IN_PROGRESS)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK53:</strong> TASK-5349697 (LOAD, NEW)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5348668 (LOAD, IN_PROGRESS), TASK-5338695 (LOAD, STALE)
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: 4 tasks (4 LOAD + 0 RECEIVE). All PRE_LOAD. All GURUNANDA. All-time: 483.
                </span>
              </div>

              {/* Column 2: Full Bay 4 Assignee Breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Open Assignee Breakdown
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">ARNULFO MUNGUIA:</span> 4 open (4 LOAD — DOCK50,53,54)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">DANIELA GONZALEZ:</span> 4 open (4 RECEIVE — DOCK58,63,64,66)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#f59e0b] font-semibold">RICARDO TAPIA:</span> 1 open (RECEIVE — DOCK55)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, ~306d ⚠)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#8b5cf6] font-semibold">JORGE ANTONIO FRANCO:</span> 1 open (RECEIVE — DOCK65)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#71717a] font-semibold">EDUARDO MEJIA:</span> 1 open (LOAD NEW — DOCK51)
                </span>
              </div>

              {/* Column 3: Customer Mix */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Customer Mix &amp; Status
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">GURUNANDA, LLC (ORG-655875):</span> 11 tasks (92% of open)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">KARAKA, LLC (ORG-585450):</span> 1 task (RECEIVE — DOCK55)
                </span>
                <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Task Status</span>
                  <span className="text-xs text-[#a1a1aa] block mt-0.5">
                    10 IN_PROGRESS (83%) / 2 NEW (17%)
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
              <li><strong className="text-[#f4f4f6]">8 Occupied / 2 Reserved / 13 Available</strong> — door utilization sourced from open load/receive tasks: 8 doors with an active IN_PROGRESS task, 2 doors with a NEW (not-yet-started) load task, 13 doors with no open task.</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">5 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">7 inbound (RECEIVE)</strong> = 12 total. 42% outbound / 58% inbound. 10 doors carry at least one open task (43.5% task occupancy).</li>
              <li><strong className="text-[#7c3aed]">★ Customer mix:</strong> 11 of 12 open tasks are GURUNANDA, LLC (ORG-655875); 1 is KARAKA, LLC (ORG-585450) — a RECEIVE at DOCK55 (Ricardo Tapia).</li>
              <li><strong className="text-[#f59e0b]">⚠ Dock-status flag:</strong> all 23 doors report <code>dockStatus=OCCUPIED</code> (likely a default/migrated flag), while <code>spaceStatus=OCCUPIED</code> on only 10. 4 doors carry active RECEIVE tasks yet <code>spaceStatus=EMPTY</code> (DOCK63, 64, 65, 66). Recommend a Bay 4 dock audit.</li>
              <li><strong className="text-[#ef4444]">⚠ SEVERE ANOMALY — DOCK50:</strong> TASK-5090739 ~306d old (Oct 2025), receipt closed, yet the task remains IN_PROGRESS. Assigned to daira gonzalez. Stuck/stale — investigate immediately.</li>
              <li><strong className="text-[#f59e0b]">⚠ Aged Task:</strong> TASK-5338695 IN_PROGRESS at DOCK54 (Arnulfo Munguia) — endTime set but status never closed.</li>
              <li><strong className="text-[#22c55e]">★ Schedule % (today, 2026-08-23):</strong> Sunday lull — inbound 0 received of 2 scheduled = <strong>0.0%</strong>; outbound 0 scheduled today = <strong>n/a</strong>. Facility-wide scope (appointments carry no clean dockId for Bay 4 scoping). Completion computed by joining today&apos;s appointments to CLOSED receive/load tasks.</li>
              <li>All core metrics sourced from live WISE/WMS queries, August 23, 2026 ~18:27 PDT. Assignee names via /wms-bam/user/search-by-paging; customers via /mdm/customer/search.</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: August 23, 2026 ~18:27 PDT</span>
        </div>
      </footer>
    </div>
  );
}
