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
              DOCK50–DOCK72 &nbsp;|&nbsp; September 11, 2026 &nbsp;|&nbsp; Last refreshed: Sep 11 ~07:45 PDT
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
                All-Time Assignments (DOCK50–DOCK72) — recomputed 09/11 ~07:45 PDT
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
                ARNULFO MUNGUIA (userId=89) has 3 open tasks at Bay 4 DOCK50–DOCK72 — 2 LOAD
                outbound (GURUNANDA) + 1 NEW receive (KARAKA, ORG-585450). All-time (GURUNANDA → Arnulfo):
                912 closed transactions at Bay-4 doors (911 LOAD + 1 RECEIVE) — fresh rollup,
                2026-09-11 ~07:45 PDT. Below is the current snapshot.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (3)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK53:</strong> TASK-5364572 (LOAD, IN_PROGRESS, 13h 17m — LOAD-5038408 LOADED)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5338695 (LOAD, STALE, 34d 8h — LOAD-5035487 SHIPPED)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5364490 (RECEIVE, NEW — RN-191995 IMPORTED)
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: 3 tasks (2 LOAD + 1 RECEIVE). 2 GURUNANDA + 1 KARAKA. All-time: 912 at Bay-4
                  doors (911 LOAD + 1 RECEIVE, fresh). (Plus 1 open RECEIVE at DOCK36 — TASK-5351470,
                  ORG-585450, outside Bay 4 and NOT a GURUNANDA transaction — Arnulfo&apos;s facility-wide
                  open = 4 across all customers.)
                </span>
              </div>

              {/* Column 2: Full Bay 4 Assignee Breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Open Assignee Breakdown
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#f59e0b] font-semibold">ARNULFO MUNGUIA:</span> 3 open (2 LOAD — DOCK53, DOCK54; 1 RECEIVE — DOCK54 NEW)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#7c3aed] font-semibold">DANIELA GONZALEZ:</span> 1 open (RECEIVE — DOCK63, 2h 24m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">Fatima Ponce:</span> 1 open (RECEIVE — DOCK57, 1d 8h 25m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, ~324d ⚠)
                </span>
              </div>

              {/* Column 3: Customer Mix */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Customer Mix &amp; Status
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">GURUNANDA, LLC (ORG-655875):</span> 5 tasks (83.3% of open)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">KARAKA, LLC (ORG-585450):</span> 1 task (16.7%)
                </span>
                <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Task Status</span>
                  <span className="text-xs text-[#a1a1aa] block mt-0.5">
                    5 IN_PROGRESS + 1 NEW
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
              <li><strong className="text-[#f4f4f6]">5 Occupied / 0 Reserved / 18 Available</strong> — door utilization sourced from open load/receive tasks at the 2026-09-11 07:45 PDT snapshot: 5 doors with an open task (DOCK50, DOCK53, DOCK54, DOCK57, DOCK63), 0 doors with only a NEW not-yet-started task, 18 doors with no open load/receive task. <strong className="text-[#a1a1aa]">Change vs 09-09 18:15 PDT (10/0/13)</strong> — DOCK52, DOCK58, DOCK60, DOCK64, DOCK68, DOCK69 freed by task closures; DOCK53 newly occupied. (Location API still reports a stale/contradictory dockStatus for many doors — e.g. DOCK51/52/53/55/58/59/61/62/64/65/66/67/68/69/71/72 show OCCUPIED/EMPTY inconsistently; task-derived status is authoritative, consistent with prior snapshots.)</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">2 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">4 inbound (RECEIVE)</strong> = 6 total at 07:45 PDT (was 13 = 5+8 at 09-09 18:15). 33.3% outbound / 66.7% inbound. 5 doors carry at least one open task (21.7% task occupancy; was 43.5% — 10 doors).</li>
              <li><strong className="text-[#7c3aed]">★ Customer mix:</strong> 5 of the 6 open Bay 4 tasks are GURUNANDA, LLC (ORG-655875) — 83.3%; the remaining one is the DOCK54 NEW receive for KARAKA, LLC (ORG-585450, RN-191995). First non-GURUNANDA open Bay-4 task in the recent snapshots.</li>
              <li><strong className="text-[#ef4444]">⚠ SEVERE ANOMALY — DOCK50 (unchanged condition, aging ~324d):</strong> TASK-5090739 (started Oct 21 2025 20:21 PDT) RECEIVE task remains IN_PROGRESS with endTime set (2025-10-22) and its receipt RN-5002143 already CLOSED. Assigned to daira gonzalez. Stuck/stale — investigate immediately.</li>
              <li><strong className="text-[#f59e0b]">⚠ ANOMALY — DOCK54 (aging 34d 8h):</strong> TASK-5338695 (started 2026-08-07 23:29 PDT) remains IN_PROGRESS with endTime set (2026-08-10) and its load LOAD-5035487 already SHIPPED, while the same door also carries ARNULFO MUNGUIA&apos;s NEW receive TASK-5364490 (RN-191995 IMPORTED, KARAKA, LLC) — two open tasks on one door.</li>
              <li><strong className="text-[#f59e0b]">ℹ LOADED/SHIPPED-but-open watch:</strong> TASK-5364572 (DOCK53) is IN_PROGRESS with its load LOAD-5038408 already LOADED; TASK-5338695 (DOCK54) is open with its load LOAD-5035487 already SHIPPED. Monitor for stalled dispatch/close-out.</li>
              <li><strong className="text-[#22c55e]">★ Schedule % (today, 2026-09-11 — Friday, facility-wide, ~07:45 PDT):</strong> scheduled inbounds <strong>33 → 0.0%</strong> (0 CLOSED-received; 30 IMPORTED + 3 OPEN still outstanding); scheduled outbound loads <strong>117 → 0.0%</strong> (0 LOADED/SHIPPED; 111 NEW + 4 WINDOW_CHECKIN_DONE + 2 LOADING outstanding). This is an early-morning snapshot — the day&apos;s appointments have not yet been worked, so both rates are legitimately 0.0% (not unavailable).</li>
              <li><strong className="text-[#a1a1aa]">Outbound denominator note:</strong> the outbound load search now honours only a date-boundary <em>appointmentTimeFrom</em> filter (the previously used appointmentTimePeriod parameter returns 400), so today&apos;s outbound set was taken as the 2026-09-11 vs 2026-09-12 from-population difference (345 − 228 = 117) and confirmed by a client-side appointment-date filter over the returned rows (114 rows carry an explicit 2026-09-11 appointment date; the 3-row residual has no appointment date). The appointment-entity cross-check used in the previous refresh is not reproducible in the current API shape, so the 117 denominator stands on the load-side count alone.</li>
              <li><strong className="text-[#7c3aed]">★ All-time rollup rescanned:</strong> full CLOSED/FORCE_CLOSED load + receive rescan at all 23 Bay-4 door IDs at ~07:45 PDT (single large page per door, de-duplicated by task id, 0 dropped rows) — 3,695 closed transactions (2,757 LOAD CLOSED + 696 RECEIVE CLOSED + 242 RECEIVE FORCE_CLOSED; no LOAD FORCE_CLOSED) across 81 assignees, top assignee ARNULFO MUNGUIA 954. +20 vs 09-09 18:15 (3,675). (DANIEL BELTRAN 935, DANIELA GONZALEZ 377, GEORGE LC BROWN 151, RENATO ROSALES GARCIA 149, Caren Cubides 147, JULIO CESAR ALVARADO 113, MARTIN MUNGUIA 106, Fatima Ponce 92, David Ramirez Selva 76.)</li>
              <li><strong className="text-[#7c3aed]">★ GuruNanda → Arnulfo rollup recomputed:</strong> 912 closed transactions at Bay-4 doors (911 LOAD + 1 RECEIVE) — +3 vs 09-09 18:15 (909). Open: 2 GURUNANDA Bay-4 LOAD IN_PROGRESS at DOCK53 and DOCK54 (ages at 07:45 PDT: TASK-5364572 13h 17m, TASK-5338695 34d 8h ⚠STALE). Arnulfo&apos;s facility-wide open across all customers is 4 (2 GURUNANDA Bay-4 LOAD + 1 KARAKA Bay-4 RECEIVE TASK-5364490 + 1 DOCK36 RECEIVE TASK-5351470, ORG-585450 — not a GURUNANDA transaction).</li>
              <li><strong className="text-[#7c3aed]">★ &quot;Guru live out / in assign to Arnulfo&quot; re-verified:</strong> still NO exact literal match — dock load/receive tasks carry no task-name field, and keyword probes (&quot;Guru live out&quot;, &quot;assign to Arnulfo&quot;, full phrase) each return the full load-task corpus (the keyword filter is non-literal). Interpretation holds: GURUNANDA, LLC (ORG-655875) dock transactions assigned to Arnulfo Munguia (assigneeUserId=89, confirmed live on all his task records).</li>
              <li>All core metrics sourced from live WISE/WMS queries, Friday, September 11, 2026 ~07:45 PDT (all endpoints live — schedule metrics available). Assignee names via task assigneeUserName (exact API forms); customers via task customerId/customerIds records. Durations: task startTime read with the facility timezone applied (item-time-zone America/Los_Angeles) and aged to the 2026-09-11 07:45:00 PDT snapshot instant. <strong className="text-[#a1a1aa]">API note:</strong> the WMS BAM search-by-paging endpoints repeat page-1 rows for pageNum &gt; 1, so every pull used a single large page and was de-duplicated by task id.</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: September 11, 2026 ~07:45 PDT</span>
        </div>
      </footer>
    </div>
  );
}
