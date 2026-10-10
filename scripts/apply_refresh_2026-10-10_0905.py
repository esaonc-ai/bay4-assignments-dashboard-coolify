#!/usr/bin/env python3
"""Apply the 2026-10-10 ~09:05 PDT WISE/WMS refresh to src/app/page.tsx (prose + stamps).
Each replacement is anchored on the exact prior-refresh (2026-10-09 ~07:46 PDT) string.
"""
import sys

P = "src/app/page.tsx"
t = open(P, encoding="utf-8").read()

R = [
 # ── Assigned Activity banner ────────────────────────────────────────────────
 ("recomputed in this refresh</strong> from a full row-level rescan (2026-10-09 ~07:46 PDT). Below is the current live snapshot (2026-10-09 ~07:46 PDT).",
  "recomputed in this refresh</strong> from a full row-level rescan (2026-10-10 ~09:05 PDT). Below is the current live snapshot (2026-10-10 ~09:05 PDT)."),

 # ── Data Notes: door utilization headline ───────────────────────────────────
 ("8 Occupied / 1 Reserved / 14 Available / 2 anomalies</strong> — door utilization is task-derived at the 2026-10-09 ~07:46 PDT snapshot: 8 doors with an in-progress open task (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK61), 1 door holding only a not-started NEW task (DOCK69), 14 doors with no open load/receive task. 9 doors carry an active assignment (39.1% of the bay).",
  "8 Occupied / 2 Reserved / 13 Available / 2 anomalies</strong> — door utilization is task-derived at the 2026-10-10 ~09:05 PDT snapshot: 8 doors with an in-progress open task (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK58), 2 doors holding only not-started NEW task(s) (DOCK66, DOCK69), 13 doors with no open load/receive task. 10 doors carry an active assignment (43.5% of the bay)."),

 # ── Data Notes: Location-API cross check ────────────────────────────────────
 ("its <code>spaceStatus</code> reports 11 OCCUPIED / 12 EMPTY",
  "its <code>spaceStatus</code> reports 12 OCCUPIED / 11 EMPTY"),

 # ── Data Notes: open-task mix ───────────────────────────────────────────────
 ('<li>Open tasks: <strong className="text-[#7c3aed]">12 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">7 inbound (RECEIVE)</strong> = 19 at ~07:46 PDT. 63.2% outbound / 36.8% inbound.',
  '<li>Open tasks: <strong className="text-[#7c3aed]">11 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">5 inbound (RECEIVE)</strong> = 16 at ~09:05 PDT. 68.8% outbound / 31.3% inbound.'),

 # ── Data Notes: customer mix ────────────────────────────────────────────────
 ('<li><strong className="text-[#7c3aed]">Customer mix:</strong> 16 of the 19 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 84.2%; the remaining 2 are CMPC USA (Cut Paper and Rolls) (ORG-40858) and 1 is KARAKA, LLC (ORG-585450) — two non-GURUNANDA customers are present at Bay 4 this refresh. Task status: 16 IN_PROGRESS + 3 NEW.</li>',
  '<li><strong className="text-[#7c3aed]">Customer mix:</strong> 15 of the 16 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 93.8%; the remaining 1 is CMPC USA (Cut Paper and Rolls) (ORG-40858) — a non-GURUNANDA customer is present at Bay 4 this refresh. Task status: 13 IN_PROGRESS + 3 NEW.</li>'),

 # ── Data Notes: DOCK50 severe anomaly ──────────────────────────────────────
 ('<li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 352d 18h 25m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 still carries TASK-5389467 (LOAD, IN_PROGRESS 22h 38m, ARNULFO MUNGUIA). Investigate immediately.</li>',
  '<li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 353d 19h 44m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 now also carries TASK-5389467 (LOAD, IN_PROGRESS 1d 23h 58m, ARNULFO MUNGUIA) and TASK-5390717 (LOAD, IN_PROGRESS 21h 28m, ARNULFO MUNGUIA). Investigate immediately.</li>'),

 # ── Data Notes: DOCK54 anomaly ─────────────────────────────────────────────
 ('<li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 62d 15h 17m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — on a door that also carries TASK-5382462 (LOAD, IN_PROGRESS 7d 22h 23m, ARNULFO MUNGUIA) and TASK-5389875 (LOAD, IN_PROGRESS 18h 6m, ARNULFO MUNGUIA).</li>',
  '<li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 63d 16h 36m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — and is now the only open task on that door (TASK-5382462 and TASK-5389875 left the open set this refresh). Assigned to ARNULFO MUNGUIA.</li>'),

 # ── Data Notes: single sweep ───────────────────────────────────────────────
 ('<li><strong className="text-[#22c55e]">Single tight sweep:</strong> all current-state figures on this page come from one self-consistent sweep at 2026-10-09T14:46:45Z (2026-10-09 ~07:46 PDT). Note: one door (DOCK69) holds only a not-started NEW task, so Reserved = 1 of 23; the occupied set is 8 doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK61) versus 5 at the prior 2026-10-08 ~10:39 PDT refresh — DOCK52, DOCK56, DOCK57 and DOCK61 entered the occupied set, DOCK60 cleared its task, DOCK69 dropped from two NEW tasks to one, and DOCK54 gained TASK-5389875 (ARNULFO MUNGUIA). The open Bay-4 population is 19 tasks, spread across 9 doors (8 occupied + 1 reserved).</li>',
  '<li><strong className="text-[#22c55e]">Single tight sweep:</strong> all current-state figures on this page come from one self-consistent sweep at 2026-10-10T16:05:58Z (2026-10-10 ~09:05 PDT). Note: two doors (DOCK66, DOCK69) hold only a not-started NEW task, so Reserved = 2 of 23; the occupied set is 8 doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK58) versus 8 at the prior 2026-10-09 ~07:46 PDT refresh — DOCK58 entered the occupied set while DOCK61 left it, and the open population turned over: seven tasks cleared (TASK-5389880 / DOCK52, TASK-5382457 / DOCK53, TASK-5382462 and TASK-5389875 / DOCK54, TASK-5389143 and TASK-5389635 / DOCK56, TASK-5390038 / DOCK61) and four appeared (TASK-5390717 / DOCK50, TASK-5390984 / DOCK52, TASK-5390995 / DOCK58, TASK-5390273 / DOCK66). The open Bay-4 population is 16 tasks, spread across 10 doors (8 occupied + 2 reserved).</li>'),

 # ── Data Notes: schedule narrative ────────────────────────────────────────
 ('<li><strong className="text-[#22c55e]">Schedule % REPORTED this refresh (operating day):</strong> the current facility-local day is <strong className="text-[#f4f4f6]">Friday 2026-10-09</strong> — an operating day carrying <strong className="text-[#f4f4f6]">33 inbound receipts</strong> and <strong className="text-[#f4f4f6]">107 outbound loads</strong> in its appointment window. <strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 0.0%</strong> (0 received of 33) and <strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = 0.9%</strong> (1 loaded/shipped of 107) — this is an early-morning (~07:46 PDT) snapshot, so most of the day&apos;s appointments have not yet started. Binding filters confirmed: <strong className="text-[#f4f4f6]">loads</strong> use <code>appointmentTimePeriod</code> — a BETWEEN that requires exactly two date-time elements, i.e. [&quot;2026-10-09T00:00:00&quot;,&quot;2026-10-09T23:59:59&quot;]; <strong className="text-[#f4f4f6]">receipts</strong> use <code>appointmentTimeFrom</code>/<code>appointmentTimeTo</code>. Day status composition: loads — 101 NEW + 3 WINDOW_CHECKIN_DONE + 2 LOADING + 1 SHIPPED; receipts — 22 IMPORTED + 11 OPEN.</li>',
  '<li><strong className="text-[#22c55e]">Schedule % REPORTED this refresh (current facility-local day):</strong> the current facility-local day is <strong className="text-[#f4f4f6]">Saturday 2026-10-10</strong> — a non-operating day for outbound carrying <strong className="text-[#f4f4f6]">2 inbound receipts</strong> and <strong className="text-[#f4f4f6]">0 outbound loads</strong> in its appointment window. <strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 0.0%</strong> (0 received of 2) and <strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = n/a</strong> (0 loads scheduled, so there is no denominator on this day — reported n/a rather than a fabricated 0%). Binding filters confirmed: <strong className="text-[#f4f4f6]">loads</strong> use <code>appointmentTimePeriod</code> — a BETWEEN that requires exactly two date-time elements, i.e. [&quot;2026-10-10T00:00:00&quot;,&quot;2026-10-10T23:59:59&quot;]; <strong className="text-[#f4f4f6]">receipts</strong> use <code>appointmentTimeFrom</code>/<code>appointmentTimeTo</code>. Day status composition: loads — none scheduled; receipts — 2 IMPORTED.</li>'),

 # ── Data Notes: all-time block ────────────────────────────────────────────
 ("(2,929 LOAD + 1,064 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-08 ~10:39 PDT rescan (3,987 → 3,993 closed / 2,926 → 2,929 LOAD / 1,061 → 1,064 RECEIVE).</li>",
  "(2,936 LOAD + 1,066 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-09 ~07:46 PDT rescan (3,993 → 4,002 closed / 2,929 → 2,936 LOAD / 1,064 → 1,066 RECEIVE).</li>"),

 # ── Data Notes: timestamp basis ───────────────────────────────────────────
 ("task timestamps are read on the same UTC frame as the snapshot instant (2026-10-09T14:46:45Z). Query window 2026-10-09T14:46:45Z → 2026-10-09T14:46:45Z.</li>",
  "task timestamps are read on the same UTC frame as the snapshot instant (2026-10-10T16:05:58Z). Query window 2026-10-10T16:05:58Z → 2026-10-10T16:05:58Z.</li>"),

 # ── Data Notes: Arnulfo identity caveat ───────────────────────────────────
 ('verified on all 9 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot;',
  'verified on all 6 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot;'),

 # ── Data Notes: closing line ──────────────────────────────────────────────
 ("Core live metrics sourced from live WISE/WMS queries — Friday 2026-10-09 ~07:46 PDT (UTC snapshot 2026-10-09T14:46:45Z).",
  "Core live metrics sourced from live WISE/WMS queries — Saturday 2026-10-10 ~09:05 PDT (UTC snapshot 2026-10-10T16:05:58Z)."),

 # ── Footer stamp ──────────────────────────────────────────────────────────
 ("<span>Last refreshed: {refreshDateLong} ~07:46 PDT</span>",
  "<span>Last refreshed: {refreshDateLong} ~09:05 PDT</span>"),
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
