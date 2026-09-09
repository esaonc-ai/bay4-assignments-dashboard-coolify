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
              DOCK50–DOCK72 &nbsp;|&nbsp; September 9, 2026 &nbsp;|&nbsp; Last refreshed: Sep 09 ~07:47 PDT
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
                All-Time Assignments (DOCK50–DOCK72) — recomputed 09/09 ~07:54 PDT
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
                outbound (GURUNANDA). All-time (GURUNANDA → Arnulfo): 1,109 closed transactions facility-wide
                (906 at Bay 4 doors) — fresh rollup, 2026-09-09 ~07:54 PDT. Below is the current snapshot.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Column 1: Arnulfo Bay 4 Tasks */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Arnulfo Open Bay 4 Tasks (4)
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <strong>DOCK51:</strong> TASK-5362385 (LOAD, IN_PROGRESS, 19h 30m — loads LOADED)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK52:</strong> TASK-5362731 (LOAD, IN_PROGRESS, 15h 27m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK53:</strong> TASK-5362444 (LOAD, IN_PROGRESS, 17h 54m — 4 loads LOADED)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <strong>DOCK54:</strong> TASK-5338695 (LOAD, STALE, 32d 15h)
                </span>
                <span className="text-xs text-[#71717a] mt-1 italic">
                  Total: 4 tasks (4 LOAD + 0 RECEIVE). All GURUNANDA. All-time: 1,109 facility-wide /
                  906 Bay 4 (fresh). (Plus 1 open RECEIVE at DOCK36 — TASK-5351470, ORG-585450, outside
                  Bay 4 and NOT a GURUNANDA transaction — Arnulfo&apos;s facility-wide open = 5 across all customers.)
                </span>
              </div>

              {/* Column 2: Full Bay 4 Assignee Breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                  Bay 4 Open Assignee Breakdown
                </span>
                <span className="text-xs text-[#a1a1aa] mt-1">
                  <span className="text-[#7c3aed] font-semibold">ARNULFO MUNGUIA:</span> 4 open (4 LOAD — DOCK51,52,53,54)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#f59e0b] font-semibold">JEROME ARANDA:</span> 2 open (LOAD NEW — DOCK50, DOCK53)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#22c55e] font-semibold">EDUARDO MEJIA:</span> 1 open (LOAD — DOCK51, 16h 16m)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">daira gonzalez:</span> 1 open (RECEIVE — DOCK50, ~323d ⚠)
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  <span className="text-[#ef4444] font-semibold">RUFINO MUNGUIA:</span> 1 open (RECEIVE — DOCK62, 18h 40m)
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
              <li><strong className="text-[#f4f4f6]">6 Occupied / 0 Reserved / 17 Available</strong> — door utilization sourced from open load/receive tasks at the 2026-09-09 07:47 PDT snapshot: 6 doors with an active IN_PROGRESS task (DOCK50,51,52,53,54,62), 0 doors with only a NEW not-yet-started task, 17 doors with no open load/receive task. <strong className="text-[#a1a1aa]">Change vs 09-08 12:27 PDT (6/2/15)</strong> — DOCK62 newly occupied (RUFINO MUNGUIA&apos;s RECEIVE TASK-5360939 moved DOCK53→DOCK62 and started 09-08 13:06 — the RN-191921 receive that had sat NEW on DOCK53 since 09-04), DOCK53 Reserved→Occupied, DOCK56 &amp; DOCK58 freed by closures, DOCK67 freed (TASK-5359531 CANCELLED ~12:29:37 on 09-08, as flagged live last refresh); DOCK50/51/52/54 remain occupied. (Location API still reports a stale/contradictory dockStatus for many task-free doors — DOCK51/52/55/59/61/64/65/66/67/68/70/71/72 etc. show OCCUPIED/EMPTY inconsistently; task-derived status is authoritative, consistent with prior snapshots.)</li>
              <li>Open tasks: <strong className="text-[#7c3aed]">7 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">2 inbound (RECEIVE)</strong> = 9 total at 07:47 PDT (was 9 = 6+3 at 09-08 12:27). 77.8% outbound / 22.2% inbound. 6 doors carry at least one open task (26.1% task occupancy; was 34.8% — 8 doors). Delta: 11 Bay-4 closures in the window (4 of them open at the prior snapshot — TASK-5362261 D58 RECEIVE FORCE_CLOSED 13:02:24, TASK-5361994 D52 LOAD 13:54:15, TASK-5362362 D56 LOAD 14:26:08, TASK-5360206 D50 LOAD 14:31:23; plus TASK-5362409 D57 13:58:29 [the DOCK67→DOCK57 trailer-move task created 12:29:37], TASK-5362405 D60 14:07:39, TASK-5362519 D57 14:43:56, TASK-5362469 D58 15:04:05, TASK-5362574 D56 15:31:35, TASK-5362231 D66 18:43:45, TASK-5361455 D64 19:23:51 — all LOAD except the two RECEIVE closures) and 5 tasks newly open &amp; still open: TASK-5362728 (D51, EDUARDO MEJIA), TASK-5362731 (D52, ARNULFO), TASK-5362444 (D53, ARNULFO), TASK-5363039 (D53, JEROME ARANDA — NEW 07:33 today), TASK-5363070 (D50, JEROME ARANDA — NEW 07:45 today).</li>
              <li><strong className="text-[#7c3aed]">★ Customer mix:</strong> all 9 open Bay 4 tasks are GURUNANDA, LLC (ORG-655875) — 100%, same as prior snapshot. No other customer currently holds an open Bay 4 dock task.</li>
              <li><strong className="text-[#ef4444]">⚠ SEVERE ANOMALY — DOCK50 (unchanged condition, aging ~323d):</strong> TASK-5090739 (started Oct 21 2025 13:21 PDT) RECEIVE task remains IN_PROGRESS with endTime set (2025-10-22) and its receipt RN-5002143 CLOSED. Assigned to daira gonzalez. Stuck/stale — investigate immediately. DOCK50 also now hosts JEROME ARANDA&apos;s NEW live-load TASK-5363070 (created 07:45:12 today; LOAD-5037945 WINDOW_CHECKIN_DONE with appointment time 09-08 08:00 — checked-in trailer parked against a door the stale RECEIVE still nominally occupies) — two open tasks co-located.</li>
              <li><strong className="text-[#ef4444]">⚠ NEW ANOMALY — DOCK51 double-booked:</strong> TWO IN_PROGRESS LOAD tasks on one door — ARNULFO MUNGUIA&apos;s TASK-5362385 (IN_PROGRESS since 09-08 12:16, 19h 30m, both loads LOADED) never closed, while EDUARDO MEJIA&apos;s TASK-5362728 (since 09-08 15:30, 16h 16m, 4 loads LOADING + 1 LOADED + 1 WINDOW_CHECKIN_DONE) is actively working the same door. Likely a stuck task blocking door accounting — close/reassign TASK-5362385.</li>
              <li><strong className="text-[#ef4444]">⚠ NEW ANOMALY — DOCK53 co-located:</strong> ARNULFO&apos;s TASK-5362444 (IN_PROGRESS since 09-08 13:52, 17h 54m, 4 loads LOADED) still open while JEROME ARANDA&apos;s NEW TASK-5363039 (created 07:33:46 today, LOAD-5038095 WINDOW_CHECKIN_DONE trailer checked in) waits on the same door.</li>
              <li><strong className="text-[#f59e0b]">⚠ Aged/Stale (unchanged, aging):</strong> TASK-5338695 (DOCK54, Arnulfo) 32d 15h with endTime set (2026-08-10) and its load SHIPPED, yet task IN_PROGRESS.</li>
              <li><strong className="text-[#f59e0b]">ℹ LOADED-but-open watch:</strong> TASK-5362385 (DOCK51, 19h 30m), TASK-5362444 (DOCK53, 17h 54m) and TASK-5362731 (DOCK52, 15h 27m — ARNULFO, LOAD-5038159 LOADED) are IN_PROGRESS with their loads already LOADED — not flagged under the endTime anomaly rule, but monitor for stalled dispatch/close-out. DOCK62&apos;s TASK-5360939 (RECEIVE IN_PROGRESS 18h 40m, RUFINO MUNGUIA) is actively receiving RN-191921 (moved from DOCK53 where it sat NEW since 09-04). The two NEW tasks (DOCK50 TASK-5363070, DOCK53 TASK-5363039 — both JEROME ARANDA, both WINDOW_CHECKIN_DONE trailers) are awaiting doors currently held by stuck IN_PROGRESS tasks.</li>
              <li><strong className="text-[#22c55e]">★ Schedule % (today, 2026-09-09 — Wednesday, facility-wide, early-morning ~07:54–07:58 PDT):</strong> scheduled inbounds <strong>63 → 0.0%</strong> (0 of 63 CLOSED-received by 07:47; 23 OPEN + 40 IMPORTED — overnight 00:00 Mars Food RN-5010040/44/50 and 03:00–04:00 CMPC USA ×11 still unreceived, 08:00 KING&apos;S HAWAIIAN / LENNOX / ORGAIN / ALL MARKET-VITA COCO, 10:00 GURUNANDA will-calls RN-5010150 / RN-5010134, BOUNDLESS RN-192046); scheduled outbound loads <strong>95 → 1.1%</strong> (1 SHIPPED of 95: LOAD-5038183 NILO BRANDS 07:14:50; 84 NEW, 9 WINDOW_CHECKIN_DONE, 1 LOADING). <strong className="text-[#a1a1aa]">Outbound denominator check:</strong> 161 appointment entities / 160 actions today — 97 outbound actions (93 LIVE_LOAD + 4 PICKUP_PRELOAD) currently expose NO embedded load references (unlike the Sep-8 shape), so the per-entity strand check cannot be reproduced identically today; load-side cross-check is clean (0 appointment-referenced load ids missing from the 95-load appointmentTime-today set) so the 95 denominator stands. Facility-wide context: 12 receipts created today (all by 07:45:07 — KARAKA ×4 incl. RN-192080 EXCEPTION 02:04, VAONIS RN-192081 03:07, ALL MARKET/VITA COCO RN-192105 07:19, FLAG &amp; ANTHEM RN-192106 EXCEPTION 07:22, SOUTHERN GLAZER&apos;S RN-90545 CLOSED 07:31, LIFEPRO FITNESS ×4 07:45:06–07), 4 receipts CLOSED/FORCE_CLOSED with receivedTime today (3 by 07:47: RN-191519 BABYARK INC 06:52:51, RN-190217 COME READY FOODS 06:53:26, RN-5009978 KING&apos;S HAWAIIAN FORCE_CLOSED 07:10:46; +RN-5009459 GURUNANDA 07:50:24 after snapshot), loads created today 0 at the 07:47 snapshot → 7 by 07:57:53 (LOAD-5038251..5038257 from 07:55:28, all GURUNANDA loadNos 50040541–47, NEW — wave began mid-refresh), 1 load LOADED/SHIPPED with endTime today (LOAD-5038183 NILO BRANDS SHIPPED 07:14:50). Facility-wide scope (appointments carry no clean dockId for Bay 4 scoping).</li>
              <li><strong className="text-[#7c3aed]">★ All-time rollup rescanned:</strong> full CLOSED/FORCE_CLOSED load + receive rescan at all 23 Bay-4 door IDs at ~07:54 PDT (retried until 0 dropped pages) — 3,658 closed transactions (2,733 LOAD CLOSED + 685 RECEIVE CLOSED + 240 RECEIVE FORCE_CLOSED; no LOAD FORCE_CLOSED) across 80 assignees, top assignee ARNULFO MUNGUIA 948. +11 vs 09-08 12:27 (3,647). Newest closed task endTime 2026-09-08T19:23:51 local = 2026-09-09T02:23:51Z (TASK-5361455, RECEIVE, DOCK64, DANIELA GONZALEZ). (DANIEL BELTRAN 922, DANIELA GONZALEZ 368, GEORGE LC BROWN 151, RENATO ROSALES GARCIA 149, Caren Cubides 147, JULIO CESAR ALVARADO 113, MARTIN MUNGUIA 106, Fatima Ponce 90, David Ramirez Selva 76.)</li>
              <li><strong className="text-[#7c3aed]">★ GuruNanda → Arnulfo rollup recomputed:</strong> 1,109 closed transactions facility-wide (1,107 LOAD + 2 RECEIVE); 906 at Bay 4 doors (905 LOAD + 1 RECEIVE) — +2 vs 09-08 12:27 (1,107 / 904), the two ARNULFO Bay-4 LOAD closures in the window (TASK-5361994 D52 13:54:15, TASK-5360206 D50 14:31:23). Open: 4 LOAD IN_PROGRESS at DOCK51/52/53/54 (ages at 07:47 PDT: TASK-5362385 19h 30m, TASK-5362731 15h 27m, TASK-5362444 17h 54m, TASK-5338695 32d 15h ⚠STALE). <strong className="text-[#a1a1aa]">Correction vs prior note:</strong> the DOCK36 RECEIVE (TASK-5351470, IN_PROGRESS since 08-25, RN-190392) belongs to ORG-585450 — NOT GURUNANDA — so it is excluded from the GURUNANDA→Arnulfo open count; Arnulfo&apos;s facility-wide open across all customers is 5 (4 GURUNANDA Bay-4 + 1 DOCK36). Full pagination under assigneeUserId=89 + customerIds=[ORG-655875] + CLOSED/FORCE_CLOSED.</li>
              <li><strong className="text-[#7c3aed]">★ &quot;Guru live out / in assign to Arnulfo&quot; re-verified:</strong> still NO exact literal match — dock load/receive tasks carry no task-name field, and keyword probes (&quot;Guru live out&quot;, &quot;assign to Arnulfo&quot;, full phrase) each return 19,072 records (the keyword filter is non-literal and matches the full load-task corpus on this API). Interpretation holds: GURUNANDA, LLC (ORG-655875) dock transactions assigned to Arnulfo Munguia (assigneeUserId=89, confirmed live on all his task records).</li>
              <li>All core metrics sourced from live WISE/WMS queries, Wednesday, September 9, 2026 ~07:53–07:58 PDT (all endpoints live — schedule metrics available). Assignee names via task assigneeUserName (exact API forms: ARNULFO MUNGUIA, JEROME ARANDA, EDUARDO MEJIA, RUFINO MUNGUIA, daira gonzalez); customers via task customer records (GURUNANDA, LLC per load/receipt organization records). Durations: task startTime returned facility-local (item-time-zone America/Los_Angeles) and aged to the 2026-09-09 07:47:00 PDT snapshot instant (clock-verified 07:47:31 PDT) — same convention as the Sep 4–8 snapshots.</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a] bg-[#0a0a0f] mt-2">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between text-xs text-[#71717a]">
          <span>Valley View Warehouse — Bay 4 Operations</span>
          <span>Last refreshed: September 9, 2026 ~07:47 PDT</span>
        </div>
      </footer>
    </div>
  );
}
