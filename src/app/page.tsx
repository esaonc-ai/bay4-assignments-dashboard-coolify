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
              DOCK50–DOCK72 &nbsp;|&nbsp; September 8, 2026 &nbsp;|&nbsp; Last refreshed: Sep 08 ~12:27 PDT
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
                All-Time Assignments (DOCK50–DOCK72) — recomputed 09/08 ~12:27 PDT
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
                ARNULFO MUNGUIA (userId=89) has 4 open tasks in Bay 4 DOCK50–DOCK72 — all LOAD
                outbound (GURUNANDA). All-time (GURUNANDA → Arnulfo): 1,107 closed transactions facility-wide
                (904 at Bay 4 doors) — fresh rollup, 2026-09-08 ~12:27 PDT. Below is the current snapshot.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (4)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK50:</strong> TASK-5360206 (LOAD, IN_PROGRESS, 4d 20h)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK51:</strong> TASK-5362385 (LOAD, IN_PROGRESS, ~10m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK52:</strong> TASK-5361994 (LOAD, IN_PROGRESS, 2h 39m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5338695 (LOAD, STALE, 31d 20h)
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: 4 tasks (4 LOAD + 0 RECEIVE). All GURUNANDA. All-time: 1,107 facility-wide /
                  904 Bay 4 (fresh). (Plus 1 open RECEIVE at DOCK36 — outside Bay 4.)
                </span>
              </div>

              {/* Column 2: Full Bay 4 Assignee Breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Open Assignee Breakdown
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">ARNULFO MUNGUIA:</span> 4 open (4 LOAD — DOCK50,51,52,54)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#f59e0b] font-semibold">DANIEL BELTRAN:</span> 1 open (LOAD — DOCK56, ~4m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, ~322d ⚠)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">Fatima Ponce:</span> 1 open (RECEIVE — DOCK58, ~49m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">RUFINO MUNGUIA:</span> 1 open (RECEIVE NEW — DOCK53, reserved)
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
                  <span className="text-[#7c3aed] font-semibold">GURUNANDA, LLC (ORG-655875):</span> 9 tasks (100% of open)
                </span>
                <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Task Status</span>
                  <span className="text-xs text-[#a1a1aa] block mt-0.5">
                    7 IN_PROGRESS + 2 NEW (77.8% / 22.2%)
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
              <li><strong className="text-[#f4f4f6]">6 Occupied / 2 Reserved / 15 Available</strong> — door utilization sourced from open load/receive tasks at the 2026-09-08 12:27 PDT snapshot: 6 doors with an active IN_PROGRESS task (DOCK50,51,52,54,56,58), 2 doors with a NEW not-yet-started task (DOCK53, DOCK67), 15 doors with no open load/receive task. <strong className="text-[#a1a1aa]">Major change vs 09-07 18:40 PDT (4/1/18)</strong> — DOCK51,52,56,58 newly occupied, DOCK53 flipped Occupied→Reserved (its IN_PROGRESS task TASK-5361270 closed 12:18:54), DOCK50/54/DOCK67 unchanged occupancy. (Location API still reports a stale dockStatus=OCCUPIED for many task-free doors — DOCK51/52/55/56/57/58/59/61/66/68/69/70/71 etc.; task-derived status is authoritative, consistent with prior snapshots.)</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">6 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">3 inbound (RECEIVE)</strong> = 9 total at 12:27 PDT (was 8 = 6+2 at 09-07 18:40). 66.7% outbound / 33.3% inbound. 8 doors carry at least one open task (34.8% task occupancy). Delta: TASK-5359541 (D51), TASK-5360934 (D54), TASK-5361270 (D53) CLOSED (all ARNULFO/GURUNANDA, ended 09:53:09 / 09:59:48 / 12:18:54); TASK-5362385 (D51 LOAD, ARNULFO), TASK-5361994 (D52 LOAD, ARNULFO), TASK-5362362 (D56 LOAD, DANIEL BELTRAN), TASK-5362261 (D58 RECEIVE, Fatima Ponce) OPENED.</li>
              <li><strong className="text-[#7c3aed]">★ Customer mix:</strong> all 9 open Bay 4 tasks are GURUNANDA, LLC (ORG-655875) — 100%, same as prior snapshot. No other customer currently holds an open Bay 4 dock task.</li>
              <li><strong className="text-[#ef4444]">⚠ SEVERE ANOMALY — DOCK50 (unchanged condition, aging):</strong> TASK-5090739 ~322d old (started Oct 21 2025 13:21 PDT) RECEIVE task remains IN_PROGRESS with endTime set (2025-10-22) and its receipt RN-5002143 CLOSED. Assigned to daira gonzalez. Stuck/stale — investigate immediately. DOCK50 also hosts Arnulfo&apos;s LOAD TASK-5360206 (4d 20h, both loads LOADED) — two open tasks co-located.</li>
              <li><strong className="text-[#f59e0b]">⚠ Aged/Stale (unchanged):</strong> TASK-5338695 (DOCK54, Arnulfo) 31d 20h with endTime set (2026-08-10) and its load SHIPPED, yet task IN_PROGRESS.</li>
              <li><strong className="text-[#f59e0b]">ℹ LOADED-but-open watch:</strong> TASK-5360206 (DOCK50, 4d 20h) and TASK-5361994 (DOCK52, 2h 39m — new today) are IN_PROGRESS with their loads already LOADED — not flagged under the endTime anomaly rule, but monitor for stalled dispatch/close-out. DOCK51&apos;s TASK-5362385 (~10m, loads LOADING) and DOCK56&apos;s TASK-5362362 (~4m, DANIEL BELTRAN, loads LOADING, appt APPT-6038955 09:00) are fresh starts from this morning. DOCK58 TASK-5362261 (RECEIVE IN_PROGRESS ~49m, Fatima Ponce) is actively receiving RN-5010095.</li>
              <li><strong className="text-[#f59e0b]">ℹ Reserved/awaiting:</strong> DOCK53 TASK-5360939 (RECEIVE NEW — RUFINO MUNGUIA, RN-191921 IMPORTED) unstarted since created 09-04 12:34 — 4 days waiting. DOCK67 TASK-5359531 (LOAD NEW — JEROME ARANDA) awaits its trailer LOAD-5037833 (WINDOW_CHECKIN_DONE, appointment 2026-09-08 09:00 PDT APPT-6038673 CHECKED_IN — BEST YET EXPRESS). <strong className="text-[#ef4444]">⚠ LIVE (post-snapshot, ~12:29:37 PDT):</strong> TASK-5359531 was CANCELLED and LOAD-5037833 re-created as NEW task TASK-5362409 at DOCK57 (DANIEL BELTRAN) seconds after the snapshot — next refresh will show DOCK67 freed / DOCK57 reserved.</li>
              <li><strong className="text-[#22c55e]">★ Schedule % (today, 2026-09-08 — Tuesday, facility-wide):</strong> scheduled inbounds <strong>34 → 8.8%</strong> (3 of 34 received: RN-5010014, RN-5009995, RN-5009993 — LENNOX INDUSTRIES INC., CLOSED 09:21:58–11:42:29; remaining 10 IN_PROGRESS, 7 OPEN, 14 IMPORTED incl. GURUNANDA will-call RN-5010129 12:00 / RN-191971 13:00 / RN-5010128 21:30 / RN-5010127 23:30 and midnight slots RN-192044/RN-192045); scheduled outbound loads <strong>138 → 34.8%</strong> (48 LOADED/SHIPPED = 38 SHIPPED + 10 LOADED; 69 NEW, 14 LOADING, 7 WINDOW_CHECKIN_DONE). <strong className="text-[#a1a1aa]">Unlike 09-07, no stranded outbound appointment entity today</strong> — every outbound appointment entity&apos;s load carries an appointmentTime in today&apos;s window, so the 138 denominator is clean (verified against all 139 outbound appointment entities). Facility-wide context (queried live ~12:30–12:36 PDT): 42 receipts created today (40 by the 12:27 snapshot; RN-5010135 @12:27:43 and RN-5010136 @12:31:27 arrived during refresh — VAONIS 1, ELEVATE BRANDS 2, COME READY FOODS 2, Mars Food 1, ORGAIN 1, BOUNDLESS EC 1, THE OUAI 1, EMBER 1, ALL MARKET/VITA COCO 19-receipt batch @12:18, GURUNANDA 13 incl. 09-09 appointments), 15 receipts CLOSED/FORCE_CLOSED with receivedTime today (13 by 12:27; +RN-5010094 GURUNANDA @12:27:41, RN-191511 COME READY FOODS @12:29:08), 63 loads created today (0 yesterday; first LOAD-5038143 @07:50, newest LOAD-5038205 @12:16:11), 55 loads LOADED/SHIPPED with endTime today (52 by 12:27; +3 by 12:36). Facility-wide scope (appointments carry no clean dockId for Bay 4 scoping).</li>
              <li><strong className="text-[#7c3aed]">★ All-time rollup rescanned:</strong> full CLOSED/FORCE_CLOSED load + receive rescan at all 23 Bay-4 door IDs at ~12:27 PDT (retried until 0 dropped pages) — 3,647 closed transactions (2,725 LOAD + 922 RECEIVE; 3,408 CLOSED + 239 FORCE_CLOSED) across 80 assignees, top assignee ARNULFO MUNGUIA 946. +8 vs 09-07 18:40 (3,639): eight Bay-4 closures in the window — TASK-5361773 (RECEIVE FORCE_CLOSED, Fatima Ponce, 08:37:57), TASK-5361841 (LOAD, DANIEL BELTRAN, 09:06:54), TASK-5359541 (LOAD, ARNULFO, 09:53:09), TASK-5361925 (LOAD, DANIEL BELTRAN, 09:57:35), TASK-5360934 (LOAD, ARNULFO, 09:59:48), TASK-5362062 (LOAD, JULIO CESAR ALVARADO, 11:58:56), TASK-5362193 (LOAD, DANIEL BELTRAN, 12:00:06), TASK-5361270 (LOAD, ARNULFO, 12:18:54). Newest closed task endTime 2026-09-08T12:18:54 local = 19:18:54Z (TASK-5361270, DOCK53). (DANIEL BELTRAN 918, DANIELA GONZALEZ 366, GEORGE LC BROWN 151, RENATO ROSALES GARCIA 149, Caren Cubides 147, JULIO CESAR ALVARADO 112, MARTIN MUNGUIA 106, Fatima Ponce 89, David Ramirez Selva 76.)</li>
              <li><strong className="text-[#7c3aed]">★ GuruNanda → Arnulfo rollup recomputed:</strong> 1,107 closed transactions facility-wide (1,105 LOAD + 2 RECEIVE); 904 at Bay 4 doors (903 LOAD + 1 RECEIVE) — +3 vs 09-07 18:40 (1,104 / 901), the three ARNULFO Bay-4 LOAD closures above. Open: 4 LOAD IN_PROGRESS at DOCK50/51/52/54 (ages at 12:27 PDT: TASK-5360206 4d 20h, TASK-5362385 ~10m, TASK-5361994 2h 39m, TASK-5338695 31d 20h ⚠STALE); plus 1 open RECEIVE at DOCK36 (TASK-5351470, outside Bay 4) for a facility-wide open count of 5. Full pagination under assigneeUserId=89 + customerIds=[ORG-655875] + CLOSED/FORCE_CLOSED.</li>
              <li><strong className="text-[#7c3aed]">★ &quot;Guru live out / in assign to Arnulfo&quot; re-verified:</strong> still NO exact literal match — dock load/receive tasks carry no task-name field, and keyword probes (&quot;Guru live out&quot;, &quot;assign to Arnulfo&quot;) return the same noisy 40-task set (keyword filter is not literal on this API; load records with &quot;Guru&quot; text return no task-name semantics). Interpretation holds: GURUNANDA, LLC (ORG-655875) dock transactions assigned to Arnulfo Munguia (assigneeUserId=89, confirmed live on all his task records).</li>
              <li>All core metrics sourced from live WISE/WMS queries, Tuesday, September 8, 2026 ~12:26–12:36 PDT (all endpoints live — schedule metrics available). Assignee names via task assigneeUserName (exact API forms: ARNULFO MUNGUIA, DANIEL BELTRAN, RUFINO MUNGUIA, JEROME ARANDA, Fatima Ponce, daira gonzalez); customers via task customer records (GURUNANDA, LLC per load/receipt organization records). Durations: task startTime returned facility-local (item-time-zone America/Los_Angeles) and aged to the 2026-09-08 12:27:00 PDT snapshot instant — same convention as the Sep 4/5/6/7 snapshots.</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: September 8, 2026 ~12:27 PDT</span>
        </div>
      </footer>
    </div>
  );
}
