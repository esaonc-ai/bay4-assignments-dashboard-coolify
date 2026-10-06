#!/usr/bin/env python3
"""Apply the 2026-10-06 ~08:39 PDT WISE/WMS refresh to src/app/page.tsx (prose + stamps).

Every replacement is anchored on the exact prior-refresh (2026-10-05 ~12:32 PDT) string so a
partial/mismatched apply fails loudly instead of silently drifting.
"""
import sys

P = "src/app/page.tsx"
t = open(P, encoding="utf-8").read()

R = [
 # ── Assigned Activity banner ────────────────────────────────────────────────
 ("recomputed in this refresh</strong> from a full row-level rescan (2026-10-05 ~12:32 PDT). Below is the current live snapshot (2026-10-05 ~12:32 PDT).",
  "recomputed in this refresh</strong> from a full row-level rescan (2026-10-06 ~08:39 PDT). Below is the current live snapshot (2026-10-06 ~08:39 PDT)."),

 # ── Data Notes: door utilization headline ───────────────────────────────────
 ("5 Occupied / 0 Reserved / 18 Available / 2 anomalies",
  "6 Occupied / 1 Reserved / 16 Available / 2 anomalies"),
 ("task-derived at the 2026-10-05 ~12:32 PDT snapshot: 5 doors with an in-progress open task (DOCK50, DOCK51, DOCK53, DOCK54, DOCK69), 0 doors holding only a not-started NEW task, 18 doors with no open load/receive task. 5 doors carry an active assignment (21.7% of the bay).",
  "task-derived at the 2026-10-06 ~08:39 PDT snapshot: 6 doors with an in-progress open task (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56), 1 door holding only a not-started NEW task (DOCK69), 16 doors with no open load/receive task. 7 doors carry an active assignment (30.4% of the bay)."),

 # ── Data Notes: Location-API cross check ───────────────────────────────────
 ("reports 15 Bay-4 doors OCCUPIED / 1 RESERVED / 7 AVAILABLE (its <code>spaceStatus</code> reports 12 OCCUPIED / 11 EMPTY).",
  "reports 20 Bay-4 doors OCCUPIED / 1 RESERVED / 2 AVAILABLE (its <code>spaceStatus</code> reports 13 OCCUPIED / 10 EMPTY)."),
 ("from task-derived status (5 vs 15).",
  "from task-derived status (6 vs 20)."),

 # ── Data Notes: mix ────────────────────────────────────────────────────────
 ('<strong className="text-[#7c3aed]">6 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">3 inbound (RECEIVE)</strong> = 9 at ~12:32 PDT. 66.7% outbound / 33.3% inbound.',
  '<strong className="text-[#7c3aed]">7 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">2 inbound (RECEIVE)</strong> = 9 at ~08:39 PDT. 77.8% outbound / 22.2% inbound.'),

 # ── Data Notes: customer mix (drop stale prior-refresh KARAKA claim) ───────
 ("all 9 of the 9 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 100.0%; no KARAKA task remains open at Bay 4 this refresh (the prior DOCK55 KARAKA RECEIVE has closed). Task status: 8 IN_PROGRESS + 1 NEW.",
  "all 9 of the 9 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 100.0%; no KARAKA task is open at Bay 4 this refresh. Task status: 8 IN_PROGRESS + 1 NEW."),

 # ── Data Notes: DOCK50 severe anomaly ──────────────────────────────────────
 ("SEVERE ANOMALY — DOCK50 (aging 348d 23h 11m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 also carries TASK-5381269 (LOAD, IN_PROGRESS 5d 21h 3m) under ARNULFO MUNGUIA. Investigate immediately.",
  "SEVERE ANOMALY — DOCK50 (aging 349d 19h 18m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 also carries TASK-5381269 (LOAD, IN_PROGRESS 6d 17h 10m) under ARNULFO MUNGUIA. Investigate immediately."),

 # ── Data Notes: DOCK54 anomaly ─────────────────────────────────────────────
 ("ANOMALY — DOCK54 (aging 58d 20h 2m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — on a door that also carries TASK-5380820 (LOAD, IN_PROGRESS 6d 0h 24m, ARNULFO MUNGUIA) and TASK-5382462 (LOAD, IN_PROGRESS 4d 3h 9m, ARNULFO MUNGUIA).",
  "ANOMALY — DOCK54 (aging 59d 16h 10m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — on a door that also carries TASK-5382462 (LOAD, IN_PROGRESS 4d 23h 16m, ARNULFO MUNGUIA)."),

 # ── Data Notes: single sweep ───────────────────────────────────────────────
 ("all current-state figures on this page come from one self-consistent sweep at 2026-10-05T19:32:24Z (2026-10-05 ~12:32 PDT). Note: no door holds only a not-started NEW task, so Reserved = 0 of 23; the 5-door occupied set (DOCK50, DOCK51, DOCK53, DOCK54, DOCK69) shrank from the prior 2026-10-04 ~19:07 PDT refresh (8 doors / 12 open tasks) as DOCK55, DOCK56 and DOCK68 released and their inbound tasks closed — the open Bay-4 population is now 9 tasks on 5 doors.",
  "all current-state figures on this page come from one self-consistent sweep at 2026-10-06T15:39:31Z (2026-10-06 ~08:39 PDT). Note: one door (DOCK69) now holds only a not-started NEW task, so Reserved = 1 of 23; the occupied set is now 6 doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56) versus 5 at the prior 2026-10-05 ~12:32 PDT refresh — DOCK52 (EDUARDO MEJIA) and DOCK56 (DANIEL BELTRAN) took new load work while DOCK69&apos;s earlier in-progress receive (TASK-5377286) left the open set. The open Bay-4 population is still 9 tasks, now spread across 7 doors (6 occupied + 1 reserved)."),

 # ── Data Notes: schedule narrative ─────────────────────────────────────────
 ('the current facility-local day is <strong className="text-[#f4f4f6]">Monday 2026-10-05</strong> — an operating day carrying <strong className="text-[#f4f4f6]">22 inbound receipts</strong> and <strong className="text-[#f4f4f6]">160 outbound loads</strong> in its appointment window. <strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 22.7%</strong> (5 received of 22) and <strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = 22.5%</strong> (36 loaded/shipped of 160).',
  'the current facility-local day is <strong className="text-[#f4f4f6]">Tuesday 2026-10-06</strong> — an operating day carrying <strong className="text-[#f4f4f6]">33 inbound receipts</strong> and <strong className="text-[#f4f4f6]">104 outbound loads</strong> in its appointment window. <strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 0.0%</strong> (0 received of 33) and <strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = 3.8%</strong> (4 loaded/shipped of 104).'),
 ('i.e. [&quot;2026-10-05T00:00:00&quot;,&quot;2026-10-05T23:59:59&quot;]',
  'i.e. [&quot;2026-10-06T00:00:00&quot;,&quot;2026-10-06T23:59:59&quot;]'),
 ('Day status composition: loads — 89 NEW + 26 WINDOW_CHECKIN_DONE + 9 LOADING + 1 LOADED + 35 SHIPPED; receipts — 3 IN_PROGRESS + 12 IMPORTED + 5 CLOSED + 2 OPEN.',
  'Day status composition: loads — 81 NEW + 12 WINDOW_CHECKIN_DONE + 7 LOADING + 3 LOADED + 1 SHIPPED; receipts — 3 IN_PROGRESS + 24 IMPORTED + 6 OPEN.'),

 # ── Data Notes: all-time block ─────────────────────────────────────────────
 ("come from a full row-level rescan performed in this refresh — 23 doors × 2 task types (2,902 LOAD + 1,051 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-04 ~19:07 PDT rescan (3,943 → 3,953 closed / 2,896 → 2,902 LOAD / 1,047 → 1,051 RECEIVE).",
  "come from a full row-level rescan performed in this refresh — 23 doors × 2 task types (2,903 LOAD + 1,055 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-05 ~12:32 PDT rescan (3,953 → 3,958 closed / 2,902 → 2,903 LOAD / 1,051 → 1,055 RECEIVE)."),

 # ── Data Notes: timestamp basis ────────────────────────────────────────────
 ("(2026-10-05T19:32:24Z). Query window 2026-10-05T19:32:24Z → 2026-10-05T19:32:24Z.",
  "(2026-10-06T15:39:31Z). Query window 2026-10-06T15:39:31Z → 2026-10-06T15:39:31Z."),

 # ── Data Notes: Arnulfo identity caveat (open-task count) ──────────────────
 ('verified on all 6 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot;',
  'verified on all 5 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot;'),

 # ── Data Notes: closing line ───────────────────────────────────────────────
 ("Core live metrics sourced from live WISE/WMS queries — Monday 2026-10-05 ~12:32 PDT (UTC snapshot 2026-10-05T19:32:24Z).",
  "Core live metrics sourced from live WISE/WMS queries — Tuesday 2026-10-06 ~08:39 PDT (UTC snapshot 2026-10-06T15:39:31Z)."),

 # ── Footer stamp ───────────────────────────────────────────────────────────
 ("<span>Last refreshed: {refreshDateLong} ~12:32 PDT</span>",
  "<span>Last refreshed: {refreshDateLong} ~08:39 PDT</span>"),
]

applied, skipped, missing = 0, 0, []
for old, new in R:
    c = t.count(old)
    if c == 1:
        t = t.replace(old, new); applied += 1
    elif c == 0 and t.count(new) >= 1:
        skipped += 1
    else:
        missing.append((c, old[:80]))

open(P, "w", encoding="utf-8").write(t)
print(f"applied={applied} skipped(already)={skipped} missing={len(missing)}")
for c, m in missing:
    print(f"  MISSING (count={c}): {m}")
sys.exit(1 if missing else 0)
