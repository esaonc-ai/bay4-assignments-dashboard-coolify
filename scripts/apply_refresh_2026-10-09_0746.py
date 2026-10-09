#!/usr/bin/env python3
"""Apply the 2026-10-09 ~07:46 PDT WISE/WMS refresh to src/app/page.tsx (prose + stamps).
Each replacement is anchored on the exact prior-refresh (2026-10-08 ~10:39 PDT) string.
"""
import sys

P = "src/app/page.tsx"
t = open(P, encoding="utf-8").read()

R = [
 # ── Assigned Activity banner ────────────────────────────────────────────────
 ("recomputed in this refresh</strong> from a full row-level rescan (2026-10-08 ~10:39 PDT). Below is the current live snapshot (2026-10-08 ~10:39 PDT).",
  "recomputed in this refresh</strong> from a full row-level rescan (2026-10-09 ~07:46 PDT). Below is the current live snapshot (2026-10-09 ~07:46 PDT)."),

 # ── Data Notes: door utilization headline + cross-check ─────────────────────
 ('<li><strong className="text-[#f4f4f6]">5 Occupied / 4 Reserved / 14 Available / 2 anomalies</strong> — door utilization is task-derived at the 2026-10-08 ~10:39 PDT snapshot: 5 doors with an in-progress open task (DOCK50, DOCK51, DOCK53, DOCK54, DOCK60), 4 doors holding only not-started NEW task(s) (DOCK52, DOCK56, DOCK69, DOCK70), 14 doors with no open load/receive task. 9 doors carry an active assignment (39.1% of the bay). <strong className="text-[#f4f4f6]">Cross-check / correction candidate:</strong> the Location API&apos;s own <code>dockStatus</code> field reports 15 Bay-4 doors OCCUPIED / 3 RESERVED / 5 AVAILABLE (its <code>spaceStatus</code> reports 10 OCCUPIED / 13 EMPTY). It is driven by trailer check-in state rather than by open dock work and <strong className="text-[#f4f4f6]">diverges materially</strong> from task-derived status (5 vs 15). Task-derived status is retained as the authoritative basis for this dashboard, consistent with the door-duration metric.</li>',
  '<li><strong className="text-[#f4f4f6]">8 Occupied / 1 Reserved / 14 Available / 2 anomalies</strong> — door utilization is task-derived at the 2026-10-09 ~07:46 PDT snapshot: 8 doors with an in-progress open task (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK61), 1 door holding only a not-started NEW task (DOCK69), 14 doors with no open load/receive task. 9 doors carry an active assignment (39.1% of the bay). <strong className="text-[#f4f4f6]">Cross-check / correction candidate:</strong> the Location API&apos;s own <code>dockStatus</code> field reports 16 Bay-4 doors OCCUPIED / 1 RESERVED / 6 AVAILABLE (its <code>spaceStatus</code> reports 11 OCCUPIED / 12 EMPTY). It is driven by trailer check-in state rather than by open dock work and <strong className="text-[#f4f4f6]">diverges materially</strong> from task-derived status (8 vs 16). Task-derived status is retained as the authoritative basis for this dashboard, consistent with the door-duration metric.</li>'),

 # ── Data Notes: mix ────────────────────────────────────────────────────────
 ('<li>Open tasks: <strong className="text-[#7c3aed]">8 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">6 inbound (RECEIVE)</strong> = 14 at ~10:39 PDT. 57.1% outbound / 42.9% inbound.',
  '<li>Open tasks: <strong className="text-[#7c3aed]">12 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">7 inbound (RECEIVE)</strong> = 19 at ~07:46 PDT. 63.2% outbound / 36.8% inbound.'),

 # ── Data Notes: customer mix ───────────────────────────────────────────────
 ('<li><strong className="text-[#7c3aed]">Customer mix:</strong> 12 of the 14 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 85.7%; the remaining 2 are CMPC USA (Cut Paper and Rolls) (ORG-40858) — a non-GURUNANDA customer is present at Bay 4 this refresh. Task status: 9 IN_PROGRESS + 5 NEW.</li>',
  '<li><strong className="text-[#7c3aed]">Customer mix:</strong> 16 of the 19 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 84.2%; the remaining 2 are CMPC USA (Cut Paper and Rolls) (ORG-40858) and 1 is KARAKA, LLC (ORG-585450) — two non-GURUNANDA customers are present at Bay 4 this refresh. Task status: 16 IN_PROGRESS + 3 NEW.</li>'),

 # ── Data Notes: DOCK50 severe anomaly ──────────────────────────────────────
 ('<li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 351d 21h 17m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 now also carries TASK-5389467 (LOAD, IN_PROGRESS 1h 31m, ARNULFO MUNGUIA). Investigate immediately.</li>',
  '<li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 352d 18h 25m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 still carries TASK-5389467 (LOAD, IN_PROGRESS 22h 38m, ARNULFO MUNGUIA). Investigate immediately.</li>'),

 # ── Data Notes: DOCK54 anomaly ─────────────────────────────────────────────
 ('<li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 61d 18h 9m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — on a door that also carries TASK-5382462 (LOAD, IN_PROGRESS 7d 1h 16m, ARNULFO MUNGUIA); its earlier task TASK-5387292 left the open set this refresh.</li>',
  '<li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 62d 15h 17m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — on a door that also carries TASK-5382462 (LOAD, IN_PROGRESS 7d 22h 23m, ARNULFO MUNGUIA) and TASK-5389875 (LOAD, IN_PROGRESS 18h 6m, ARNULFO MUNGUIA).</li>'),

 # ── Data Notes: single sweep ───────────────────────────────────────────────
 ('<li><strong className="text-[#22c55e]">Single tight sweep:</strong> all current-state figures on this page come from one self-consistent sweep at 2026-10-08T17:39:12Z (2026-10-08 ~10:39 PDT). Note: four doors (DOCK52, DOCK56, DOCK69, DOCK70) hold only not-started NEW tasks, so Reserved = 4 of 23; the occupied set is 5 doors (DOCK50, DOCK51, DOCK53, DOCK54, DOCK60) versus 5 at the prior 2026-10-07 ~15:28 PDT refresh — DOCK68 (Jorge Antonio Franco) cleared its task, DOCK60 (Jorge Antonio Franco) and DOCK52/DOCK56/DOCK70 took new tasks, DOCK50 gained a second load task (TASK-5389467, ARNULFO MUNGUIA), and DOCK54&apos;s TASK-5387292 left the open set. The open Bay-4 population is 14 tasks, spread across 9 doors (5 occupied + 4 reserved).</li>',
  '<li><strong className="text-[#22c55e]">Single tight sweep:</strong> all current-state figures on this page come from one self-consistent sweep at 2026-10-09T14:46:45Z (2026-10-09 ~07:46 PDT). Note: one door (DOCK69) holds only a not-started NEW task, so Reserved = 1 of 23; the occupied set is 8 doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK61) versus 5 at the prior 2026-10-08 ~10:39 PDT refresh — DOCK52, DOCK56, DOCK57 and DOCK61 entered the occupied set, DOCK60 cleared its task, DOCK69 dropped from two NEW tasks to one, and DOCK54 gained TASK-5389875 (ARNULFO MUNGUIA). The open Bay-4 population is 19 tasks, spread across 9 doors (8 occupied + 1 reserved).</li>'),

 # ── Data Notes: schedule narrative ─────────────────────────────────────────
 ('<li><strong className="text-[#22c55e]">Schedule % REPORTED this refresh (operating day):</strong> the current facility-local day is <strong className="text-[#f4f4f6]">Thursday 2026-10-08</strong> — an operating day carrying <strong className="text-[#f4f4f6]">39 inbound receipts</strong> and <strong className="text-[#f4f4f6]">108 outbound loads</strong> in its appointment window. <strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 7.7%</strong> (3 received of 39) and <strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = 25.9%</strong> (28 loaded/shipped of 108). Binding filters confirmed: <strong className="text-[#f4f4f6]">loads</strong> use <code>appointmentTimePeriod</code> — a BETWEEN that requires exactly two date-time elements, i.e. [&quot;2026-10-08T00:00:00&quot;,&quot;2026-10-08T23:59:59&quot;]; <strong className="text-[#f4f4f6]">receipts</strong> use <code>appointmentTimeFrom</code>/<code>appointmentTimeTo</code>. Day status composition: loads — 59 NEW + 19 LOADING + 16 LOADED + 12 SHIPPED + 2 WINDOW_CHECKIN_DONE; receipts — 26 IMPORTED + 9 IN_PROGRESS + 3 CLOSED + 1 OPEN.</li>',
  '<li><strong className="text-[#22c55e]">Schedule % REPORTED this refresh (operating day):</strong> the current facility-local day is <strong className="text-[#f4f4f6]">Friday 2026-10-09</strong> — an operating day carrying <strong className="text-[#f4f4f6]">33 inbound receipts</strong> and <strong className="text-[#f4f4f6]">107 outbound loads</strong> in its appointment window. <strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 0.0%</strong> (0 received of 33) and <strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = 0.9%</strong> (1 loaded/shipped of 107) — this is an early-morning (~07:46 PDT) snapshot, so most of the day&apos;s appointments have not yet started. Binding filters confirmed: <strong className="text-[#f4f4f6]">loads</strong> use <code>appointmentTimePeriod</code> — a BETWEEN that requires exactly two date-time elements, i.e. [&quot;2026-10-09T00:00:00&quot;,&quot;2026-10-09T23:59:59&quot;]; <strong className="text-[#f4f4f6]">receipts</strong> use <code>appointmentTimeFrom</code>/<code>appointmentTimeTo</code>. Day status composition: loads — 101 NEW + 3 WINDOW_CHECKIN_DONE + 2 LOADING + 1 SHIPPED; receipts — 22 IMPORTED + 11 OPEN.</li>'),

 # ── Data Notes: all-time block ─────────────────────────────────────────────
 ('(2,926 LOAD + 1,061 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-07 ~15:28 PDT rescan (3,979 → 3,987 closed / 2,921 → 2,926 LOAD / 1,058 → 1,061 RECEIVE).</li>',
  '(2,929 LOAD + 1,064 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-08 ~10:39 PDT rescan (3,987 → 3,993 closed / 2,926 → 2,929 LOAD / 1,061 → 1,064 RECEIVE).</li>'),

 # ── Data Notes: timestamp basis ────────────────────────────────────────────
 ('task timestamps are read on the same UTC frame as the snapshot instant (2026-10-08T17:39:12Z). Query window 2026-10-08T17:39:12Z → 2026-10-08T17:39:12Z.</li>',
  'task timestamps are read on the same UTC frame as the snapshot instant (2026-10-09T14:46:45Z). Query window 2026-10-09T14:46:45Z → 2026-10-09T14:46:45Z.</li>'),

 # ── Data Notes: Arnulfo identity caveat ────────────────────────────────────
 ('verified on all 7 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot;',
  'verified on all 9 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot;'),

 # ── Data Notes: closing line ───────────────────────────────────────────────
 ('Core live metrics sourced from live WISE/WMS queries — Thursday 2026-10-08 ~10:39 PDT (UTC snapshot 2026-10-08T17:39:12Z).',
  'Core live metrics sourced from live WISE/WMS queries — Friday 2026-10-09 ~07:46 PDT (UTC snapshot 2026-10-09T14:46:45Z).'),

 # ── Footer stamp ───────────────────────────────────────────────────────────
 ('<span>Last refreshed: {refreshDateLong} ~10:39 PDT</span>',
  '<span>Last refreshed: {refreshDateLong} ~07:46 PDT</span>'),
]

applied, skipped, missing = 0, 0, []
for old, new in R:
    c = t.count(old)
    if c == 1:
        t = t.replace(old, new); applied += 1
    elif c == 0 and t.count(new) >= 1:
        skipped += 1
    else:
        missing.append((c, old[:90]))

open(P, "w", encoding="utf-8").write(t)
print(f"applied={applied} skipped(already)={skipped} missing={len(missing)}")
for c, msg in missing:
    print(f"  MISSING (count={c}): {msg}")
sys.exit(1 if missing else 0)
