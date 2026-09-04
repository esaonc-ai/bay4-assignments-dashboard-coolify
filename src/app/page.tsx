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
              DOCK50–DOCK72 &nbsp;|&nbsp; September 4, 2026 &nbsp;|&nbsp; Last refreshed: Sep 04 09:38 PDT
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
                All-Time Assignments (DOCK50–DOCK72) — recomputed 09/04 09:38 PDT
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
                outbound (GURUNANDA). All-time (GURUNANDA → Arnulfo): 1,102 closed transactions facility-wide
                (899 at Bay 4 doors) — fresh rollup, 2026-09-04 09:38 PDT. Below is the current snapshot.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (5)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK50:</strong> TASK-5360206 (LOAD, IN_PROGRESS, 17h 39m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK51:</strong> TASK-5359541 (LOAD, IN_PROGRESS, 23h 9m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK52:</strong> TASK-5360107 (LOAD, IN_PROGRESS, 18h 13m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK53:</strong> TASK-5359905 (LOAD, IN_PROGRESS, 19h 13m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5338695 (LOAD, STALE, 27d 17h)
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: 5 tasks (5 LOAD + 0 RECEIVE). All GURUNANDA. All-time: 1,102 (fresh).
                </span>
              </div>

              {/* Column 2: Full Bay 4 Assignee Breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Open Assignee Breakdown
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">ARNULFO MUNGUIA:</span> 5 open (5 LOAD — DOCK50,51,52,53,54)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">DANIEL BELTRAN:</span> 2 open (LOAD — DOCK56,58)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">DANIELA GONZALEZ:</span> 2 open (RECEIVE — DOCK66,72)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#f59e0b] font-semibold">SEBASTIAN GONZALEZ:</span> 1 open (LOAD — DOCK57)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">JEROME ARANDA:</span> 1 open (LOAD NEW — DOCK67, reserved)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, ~318d ⚠)
                </span>
              </div>

              {/* Column 3: Customer Mix */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Customer Mix &amp; Status
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">GURUNANDA, LLC (ORG-655875):</span> 12 tasks (100% of open)
                </span>
                <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Task Status</span>
                  <span className="text-xs text-[#a1a1aa] block mt-0.5">
                    11 IN_PROGRESS + 1 NEW (91.7% / 8.3%)
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
              <li><strong className="text-[#f4f4f6]">10 Occupied / 1 Reserved / 12 Available</strong> — door utilization sourced from open load/receive tasks: 10 doors with an active IN_PROGRESS task (DOCK50,51,52,53,54,56,57,58,66,72), 1 door with a NEW not-yet-started task (DOCK67), 12 doors with no open load/receive task. Since the Sep 3 18:42 snapshot DOCK62/63/64/65/68 freed and DOCK56/57/58/66 became occupied; DOCK72 moved Reserved → Occupied (TASK-5360230 started 21:46 PDT Sep 3).</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">9 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">3 inbound (RECEIVE)</strong> = 12 total. 75% outbound / 25% inbound. 11 doors carry at least one open task (47.8% task occupancy). 5 previously-open DANIELA GONZALEZ RECEIVE tasks left the board: DOCK63/64/68 CLOSED (TASK-5360232/5360159/5360233) and DOCK62/65 CANCELLED (TASK-5360141/5360194); 4 new tasks appeared (DOCK56/57/58 LOAD + DOCK66 RECEIVE TASK-5360266 since 20:39 PDT Sep 3).</li>
              <li><strong className="text-[#7c3aed]">★ Customer mix:</strong> all 12 open Bay 4 tasks are GURUNANDA, LLC (ORG-655875). No other customer currently holds an open Bay 4 dock task.</li>
              <li><strong className="text-[#ef4444]">⚠ SEVERE ANOMALY — DOCK50:</strong> TASK-5090739 ~318d old (started Oct 21 2025) RECEIVE task remains IN_PROGRESS with endTime set (2025-10-22) and its receipt RN-5002143 CLOSED. Assigned to daira gonzalez. Stuck/stale — investigate immediately. DOCK50 also hosts a second open task: Arnulfo&apos;s LOAD TASK-5360206 (17h 39m, load LOAD-5037749 LOADED).</li>
              <li><strong className="text-[#f59e0b]">⚠ Aged/Stale:</strong> TASK-5338695 (DOCK54, Arnulfo) 27d 17h with endTime set (2026-08-10) and load LOAD-5035487 SHIPPED, yet task IN_PROGRESS.</li>
              <li><strong className="text-[#f59e0b]">ℹ Overnight LOAD watch:</strong> TASK-5360206 (DOCK50), TASK-5359541 (DOCK51), TASK-5360107 (DOCK52), TASK-5359905 (DOCK53) have been IN_PROGRESS 17–23h across the overnight with their loads LOADED/LOADING — not flagged under the endTime anomaly rule, but monitor for stalled dispatch.</li>
              <li><strong className="text-[#22c55e]">★ Schedule % (today, 2026-09-04, facility-wide):</strong> inbound 0 received of 32 scheduled = <strong>0.0%</strong>; outbound 9 loaded/shipped of 109 scheduled = <strong>8.3%</strong> (8 SHIPPED + 1 LOADED). Morning snapshot (~09:38 PDT) — prior snapshot was end-of-day Sep 3 (23.1% and 91.8%). Facility-wide scope (appointments carry no clean dockId for Bay 4 scoping).</li>
              <li><strong className="text-[#7c3aed]">★ All-time rollup recomputed:</strong> scanned CLOSED/FORCE_CLOSED load + receive tasks at all 23 Bay-4 door IDs — 3,612 closed transactions (2,701 LOAD + 911 RECEIVE) across 80 assignees, top assignee ARNULFO MUNGUIA 941. DANIELA GONZALEZ +4 since Sep 3 18:42 (358 → 362); no other top-10 movement.</li>
              <li><strong className="text-[#7c3aed]">★ GuruNanda → Arnulfo rollup recomputed:</strong> 1,102 closed transactions facility-wide (1,100 LOAD + 2 RECEIVE); 899 at Bay 4 doors (898 LOAD + 1 RECEIVE, unchanged since Sep 3). Open: 5 LOAD IN_PROGRESS at DOCK50/51/52/53/54 — was 4; TASK-5360107 at DOCK52 was reassigned from DANIEL BELTRAN to ARNULFO at 08:55 PDT Sep 4. Note: facility-wide total moved from 1,141 (Sep 3) to 1,102 under the same assigneeUserId=89 + ORG-655875 + CLOSED/FORCE_CLOSED filter with full pagination; the Bay 4 subset matches exactly at 899.</li>
              <li>All core metrics sourced from live WISE/WMS queries, September 4, 2026 ~09:38 PDT. Assignee names via task assigneeUserName; customers via task customer records (GURUNANDA, LLC per receipt/organization records).</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: September 4, 2026 ~09:38 PDT</span>
        </div>
      </footer>
    </div>
  );
}
