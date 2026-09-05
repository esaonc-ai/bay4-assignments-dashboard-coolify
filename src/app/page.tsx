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
              DOCK50–DOCK72 &nbsp;|&nbsp; September 5, 2026 &nbsp;|&nbsp; Last refreshed: Sep 05 11:46 PDT
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
                All-Time Assignments (DOCK50–DOCK72) — recomputed 09/05 11:46 PDT
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
                (901 at Bay 4 doors) — fresh rollup, 2026-09-05 11:46 PDT. Below is the current snapshot.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (5)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK50:</strong> TASK-5360206 (LOAD, IN_PROGRESS, 1d 19h)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK51:</strong> TASK-5359541 (LOAD, IN_PROGRESS, 2d 1h)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK53:</strong> TASK-5361270 (LOAD, IN_PROGRESS, 19h 28m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5360934 (LOAD, IN_PROGRESS, 22h 29m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5338695 (LOAD, STALE, 28d 19h)
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
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, ~318d ⚠)
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
              <li><strong className="text-[#f4f4f6]">4 Occupied / 1 Reserved / 18 Available</strong> — door utilization sourced from open load/receive tasks: 4 doors with an active IN_PROGRESS task (DOCK50,51,53,54), 1 door with a NEW not-yet-started task (DOCK67), 18 doors with no open load/receive task. <strong className="text-[#a1a1aa]">Unchanged since the 10:22 PDT snapshot</strong> — no door opened, freed, or moved tasks in the window.</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">6 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">2 inbound (RECEIVE)</strong> = 8 total (same set as 10:22). 75% outbound / 25% inbound. 5 doors carry at least one open task (21.7% task occupancy). No task opened or closed since 10:22 PDT — only ages advanced ~1h 24m.</li>
              <li><strong className="text-[#7c3aed]">★ Customer mix:</strong> all 8 open Bay 4 tasks are GURUNANDA, LLC (ORG-655875). No other customer currently holds an open Bay 4 dock task.</li>
              <li><strong className="text-[#ef4444]">⚠ SEVERE ANOMALY — DOCK50 (unchanged):</strong> TASK-5090739 ~318d old (started Oct 21 2025, 13:21 PDT) RECEIVE task remains IN_PROGRESS with endTime set (2025-10-22) and its receipt RN-5002143 CLOSED. Assigned to daira gonzalez. Stuck/stale — investigate immediately. DOCK50 also hosts Arnulfo&apos;s LOAD TASK-5360206 (1d 19h, both loads LOADED) — two open tasks co-located.</li>
              <li><strong className="text-[#f59e0b]">⚠ Aged/Stale (unchanged):</strong> TASK-5338695 (DOCK54, Arnulfo) 28d 19h with endTime set (2026-08-10) and its load SHIPPED, yet task IN_PROGRESS.</li>
              <li><strong className="text-[#ef4444]">⚠ Co-location anomalies (unchanged):</strong> DOCK53 hosts two open tasks (TASK-5361270 LOAD IN_PROGRESS 19h 28m with 1 LOADED + 4 LOADING loads, and TASK-5360939 RECEIVE NEW — RUFINO MUNGUIA, receipt RN-191921 IMPORTED, not yet started); DOCK54 hosts two open LOAD tasks (TASK-5360934 IN_PROGRESS 22h 29m with all 8 loads LOADED + stale TASK-5338695).</li>
              <li><strong className="text-[#f59e0b]">ℹ LOADED-but-open watch:</strong> TASK-5360206 (DOCK50, 1d 19h), TASK-5359541 (DOCK51, 2d 1h) and TASK-5360934 (DOCK54, 22h 29m) are IN_PROGRESS with their loads already LOADED/LOADING — not flagged under the endTime anomaly rule, but monitor for stalled dispatch/close-out.</li>
              <li><strong className="text-[#22c55e]">★ Schedule % (today, 2026-09-05 — Saturday, facility-wide):</strong> inbound 0 received of 3 scheduled = <strong>0.0%</strong> (all 3 still IMPORTED as of 11:46 PDT: RN-5010097 GURUNANDA, RN-5009845 CMPC USA, RN-5009641 AMIEE LYNN); outbound <strong>0 scheduled today → n/a</strong> (no Saturday load appointments exist). Facility-wide context: 10 receipts CLOSED/FORCE_CLOSED with receivedTime today (8 CLOSED + 2 FORCE_CLOSED), 1 receipt created today (RN-112654), 1 load SHIPPED with endTime today (LOAD-5037180, Mars Food / Preferred Brands). All unchanged since the 10:22 PDT snapshot. Facility-wide scope (appointments carry no clean dockId for Bay 4 scoping).</li>
              <li><strong className="text-[#7c3aed]">★ All-time rollup recomputed:</strong> scanned CLOSED/FORCE_CLOSED load + receive tasks at all 23 Bay-4 door IDs — 3,639 closed transactions (2,718 LOAD + 921 RECEIVE) across 80 assignees, top assignee ARNULFO MUNGUIA 943. Identical to the 10:22 PDT rollup — no Bay-4 closures in the window (DANIEL BELTRAN 915, DANIELA GONZALEZ 366, GEORGE LC BROWN 151, RENATO ROSALES GARCIA 149, Caren Cubides 147, JULIO CESAR ALVARADO 111, MARTIN MUNGUIA 106, Fatima Del Rosario Ponce 88, David Ramirez Selva 76).</li>
              <li><strong className="text-[#7c3aed]">★ GuruNanda → Arnulfo rollup recomputed:</strong> 1,104 closed transactions facility-wide (1,102 LOAD + 2 RECEIVE); 901 at Bay 4 doors (900 LOAD + 1 RECEIVE) — identical to 10:22 PDT (+0 in the window). Open: 5 LOAD IN_PROGRESS at DOCK50/51/53/54 (4 doors). Full pagination under assigneeUserId=89 + ORG-655875 + CLOSED/FORCE_CLOSED.</li>
              <li>All core metrics sourced from live WISE/WMS queries, September 5, 2026 ~11:46 PDT. Assignee names via task assigneeUserName (exact API forms: ARNULFO MUNGUIA, RUFINO MUNGUIA, JEROME ARANDA, daira gonzalez); customers via task customer records (GURUNANDA, LLC per receipt/organization records). Durations: API startTime treated as UTC, converted to America/Los_Angeles (UTC-7) — same convention as the Sep 4/5 snapshots.</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: September 5, 2026 ~11:46 PDT</span>
        </div>
      </footer>
    </div>
  );
}
