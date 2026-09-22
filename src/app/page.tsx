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
  refreshDateLong,
  refreshStamp,
  openCustomerMix,
  openStatusCounts,
  arnulfoOpenTasks,
  arnulfoOpenCount,
  arnulfoOpenLoad,
  arnulfoOpenReceive,
  arnulfoOpenGuru,
  arnulfoOpenKaraka,
  guruArnulfoAllTimeTotal,
  guruArnulfoAllTimeLoad,
  guruArnulfoAllTimeReceive,
  facilityOpenLoad,
  facilityOpenReceive,
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

const totalOpen = assignments.length;

// Per-assignee door/kind breakdown, derived from the live open-task rows.
const bay4ByAssignee = assigneeSummaries.map((a) => {
  const rows = assignments.filter((r) => r.assignee === a.name);
  const loadDoors = rows.filter((r) => r.dns.startsWith("LOAD")).map((r) => r.door);
  const recvDoors = rows.filter((r) => r.dns.startsWith("RECEIVE")).map((r) => r.door);
  const stale = rows.some((r) => r.pieces.includes("STALE"));
  return { name: a.name, count: a.taskCount, loadDoors, recvDoors, stale };
});

function assigneeColor(name: string, stale: boolean) {
  if (name === "ARNULFO MUNGUIA") return "#22c55e";
  if (stale) return "#ef4444";
  return "#7c3aed";
}

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
              DOCK50–DOCK72 &nbsp;|&nbsp; {refreshDateLong} &nbsp;|&nbsp; Last refreshed: {refreshStamp}
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
                ARNULFO MUNGUIA (userId=89) has {arnulfoOpenCount} open tasks at Bay 4 DOCK50–DOCK72 — {arnulfoOpenLoad} LOAD outbound + {arnulfoOpenReceive} RECEIVE inbound. {arnulfoOpenGuru} of those {arnulfoOpenCount} are GURUNANDA ({arnulfoOpenLoad - 1} LOAD + 1 RECEIVE). All-time (GURUNANDA → Arnulfo): <strong className="text-[#f4f4f6]">{guruArnulfoAllTimeTotal}</strong> closed transactions at Bay-4 doors ({guruArnulfoAllTimeLoad} LOAD + {guruArnulfoAllTimeReceive} RECEIVE) — <strong className="text-[#f4f4f6]">recomputed in this refresh</strong> from a full row-level rescan (2026-09-21 ~18:15 PDT). Below is the current live snapshot (2026-09-21 ~18:15 PDT).
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks ({arnulfoOpenCount})
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  {arnulfoOpenTasks.map((t) => (
                    <span key={t.taskId} className="block">
                      <strong>{t.door}:</strong> {t.taskId} ({t.kind}, {t.note} — {t.customer})
                    </span>
                  ))}
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: {arnulfoOpenCount} tasks ({arnulfoOpenLoad} LOAD + {arnulfoOpenReceive} RECEIVE). {arnulfoOpenGuru} GURUNANDA + {arnulfoOpenKaraka} KARAKA. No other open Bay-4 task is assigned to Arnulfo. All-time (fresh): {guruArnulfoAllTimeTotal} at Bay-4 doors ({guruArnulfoAllTimeLoad} LOAD + {guruArnulfoAllTimeReceive} RECEIVE).
                </span>
              </div>

              {/* Column 2: Full Bay 4 Assignee Breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Open Assignee Breakdown
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  {bay4ByAssignee.map((a) => (
                    <span key={a.name} className="block">
                      <span className="font-semibold" style={{ color: assigneeColor(a.name, a.stale) }}>
                        {a.name}:
                      </span>{" "}
                      {a.count} open
                      {a.loadDoors.length > 0 ? ` (${a.loadDoors.length} LOAD — ${a.loadDoors.join(", ")})` : ""}
                      {a.loadDoors.length > 0 && a.recvDoors.length > 0 ? "; " : ""}
                      {a.recvDoors.length > 0 ? `(${a.recvDoors.length} RECEIVE — ${a.recvDoors.join(", ")})` : ""}
                    </span>
                  ))}
                </span>
              </div>

              {/* Column 3: Customer Mix */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Customer Mix &amp; Status
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  {openCustomerMix.map((c) => (
                    <span key={c.name} className="block">
                      <span className="text-[#7c3aed] font-semibold">{c.name}:</span> {c.taskCount} tasks ({((c.taskCount / totalOpen) * 100).toFixed(1)}% of open)
                    </span>
                  ))}
                </span>
                <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Task Status</span>
                  <span className="text-xs text-[#a1a1aa] block mt-0.5">
                    {openStatusCounts.map((s, i) => (
                      <span key={s.name}>
                        {i > 0 ? " + " : ""}
                        {s.taskCount} {s.name}
                      </span>
                    ))}
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
              <li><strong className="text-[#f4f4f6]">8 Occupied / 4 Reserved / 11 Available</strong> — door utilization is task-derived at the 2026-09-21 ~18:15 PDT snapshot: 8 doors with an in-progress open task (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK61, DOCK62, DOCK72), 4 doors holding only not-started NEW tasks (DOCK55, DOCK56, DOCK59, DOCK64 — Reserved rather than Occupied), 11 doors with no open load/receive task. 12 doors carry an active assignment (52.2% of the bay). <strong className="text-[#f4f4f6]">Cross-check / correction candidate:</strong> the Location API&apos;s own <code>dockStatus</code> field reports 21 Bay-4 doors OCCUPIED / 0 RESERVED / 2 AVAILABLE (DOCK63 and DOCK64 available). It is driven by trailer check-in state rather than by open dock work and <strong className="text-[#f4f4f6]">diverges materially</strong> from task-derived status (8 vs 21). Task-derived status is retained as the authoritative basis for this dashboard, consistent with the door-duration metric.</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">6 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">10 inbound (RECEIVE)</strong> = 16 at ~18:15 PDT. 37.5% outbound / 62.5% inbound. The open population was read exhaustively — a full facility-wide sweep ({facilityOpenLoad} open load + {facilityOpenReceive} open receive tasks, statuses NEW/IN_PROGRESS/EXCEPTION) filtered on each row&apos;s <code>dockId</code> to the 23 Bay-4 doors.</li>
              <li><strong className="text-[#7c3aed]">Customer mix:</strong> 12 of the 16 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 75.0%; 3 are KARAKA, LLC (ORG-585450) — DOCK55 TASK-5373122, DOCK55 TASK-5368665, DOCK56 TASK-5369120; and 1 is ORG-798965 (DOCK50 TASK-5373019 — a JOSE MORALES load; customer display name not resolvable from the endpoints used, shown as its org id). Task status: 10 IN_PROGRESS + 6 NEW.</li>
              <li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 335d 4h 53m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. Investigate immediately.</li>
              <li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 45d 1h 45m and 10d 8h 42m):</strong> TASK-5338695 (LOAD) and TASK-5365421 (LOAD) both remain IN_PROGRESS with endTime already set (2026-08-10 and 2026-09-11) — stale — on a door that retains two open load tasks for ARNULFO MUNGUIA.</li>
              <li><strong className="text-[#22c55e]">Live churn during this pull:</strong> none observed within the sweep — all figures on this page come from one tight, self-consistent sweep at 2026-09-22T01:14:57Z (2026-09-21 ~18:15 PDT).</li>
              <li><strong className="text-[#22c55e]">Schedule % REPORTED this refresh:</strong> today is <strong className="text-[#f4f4f6]">Monday 2026-09-21</strong> and the appointment windows for this facility-local day return live rows on both sides — <strong className="text-[#f4f4f6]">127 loads scheduled</strong> (103 loaded → <strong className="text-[#f4f4f6]">81.1%</strong>) and <strong className="text-[#f4f4f6]">53 receipts scheduled</strong> (8 received → <strong className="text-[#f4f4f6]">15.1%</strong>). Binding filters confirmed: <strong className="text-[#f4f4f6]">loads</strong> use <code>appointmentTimePeriod</code> — a BETWEEN that requires exactly two date-time elements, e.g. [&quot;2026-09-21T00:00:00&quot;,&quot;2026-09-21T23:59:59&quot;]; <strong className="text-[#f4f4f6]">receipts</strong> use <code>appointmentTimeFrom</code>/<code>appointmentTimeTo</code>. &quot;Loaded&quot; counts loads whose status shows loading complete — 97 SHIPPED + 6 LOADED = 103 (1 LOADING + 23 NEW still pending). &quot;Received&quot; counts receipts fully closed — 5 CLOSED + 3 FORCE_CLOSED = 8 (22 IMPORTED + 15 IN_PROGRESS + 8 OPEN still pending).</li>
              <li><strong className="text-[#22c55e]">All-time cumulative figures RECOMPUTED this refresh:</strong> the <strong className="text-[#f4f4f6]">{allTimeClosedTotal.toLocaleString()}</strong> closed Bay-4 transactions across <strong className="text-[#f4f4f6]">{allTimeDistinctAssignees}</strong> display names (top-10 list above) and the GURUNANDA → Arnulfo cumulative <strong className="text-[#f4f4f6]">{guruArnulfoAllTimeTotal}</strong> ({guruArnulfoAllTimeLoad} LOAD + {guruArnulfoAllTimeReceive} RECEIVE) come from a full row-level rescan performed in this refresh — 23 doors × 2 task types (2,826 LOAD + 1,000 RECEIVE). They are fresh, not carried forward.</li>
              <li><strong className="text-[#ef4444]">FILTER CORRECTION — status filter binds as the plural <code>statuses</code>; door filter binds only in the singular:</strong> on the task searches the status filter binds ONLY as the plural <code>statuses</code> (array); a <code>statusList</code> (array) is silently IGNORED. The door filter binds ONLY as the singular <code>dockId</code>; a plural <code>dockIds</code> (array) is silently IGNORED, and a comma-separated <code>dockId</code> string is rejected (HTTP 400). Bay-4 doors were therefore resolved from a facility-wide sweep filtered on each row&apos;s <code>dockId</code>.</li>
              <li><strong className="text-[#f59e0b]">TIMESTAMP BASIS — durations aged task startTime → snapshot instant:</strong> task timestamps are read on the same UTC frame as the snapshot instant (2026-09-22T01:14:57Z). Query window 2026-09-22T01:14:57Z → 2026-09-22T01:14:57Z.</li>
              <li><strong className="text-[#f59e0b]">Door-ID correction:</strong> Bay-4 dock ids are NOT sequential. Live-verified this refresh (23/23, totalCount = 23): DOCK50=570, 51=554, 52=556, 53=552, 54=564, 55=560, 56=575, 57=563, 58=572, 59=571, 60=565, 61=567, 62=566, 63=568, 64=559, 65=573, 66=576, 67=577, 68=574, 69=578, 70=579, 71=580, 72=587.</li>
              <li><strong className="text-[#f59e0b]">Arnulfo identity caveat:</strong> uid <strong>89</strong> (amunguia, employee code 229G, default facility LT_F1) is the id on the live Bay-4 task rows for this name and the basis of the {guruArnulfoAllTimeTotal} all-time figure. Other employees share the display name &quot;ARNULFO MUNGUIA&quot; on different ids — notably uid <strong>1948070158297014384</strong> (employee229G — the <em>same</em> employee code 229G, i.e. a duplicate identity) and uid <strong>1948070158297014318</strong> (employee0669). Merging those into the all-time GURUNANDA figure would inflate it; the headline uses uid 89 only.</li>
              <li><strong className="text-[#7c3aed]">&quot;Guru live out / in assign to Arnulfo&quot; re-verified:</strong> still NO exact literal match — load-task and receive-task records expose no task-name field, so the interpretation holds: GURUNANDA, LLC (ORG-655875) dock transactions assigned to Arnulfo Munguia (assigneeUserId=89). Core live metrics sourced from live WISE/WMS queries — Monday 2026-09-21 ~18:15 PDT (UTC snapshot 2026-09-22T01:14:57Z).</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: {refreshDateLong} ~18:15 PDT</span>
        </div>
      </footer>
    </div>
  );
}
