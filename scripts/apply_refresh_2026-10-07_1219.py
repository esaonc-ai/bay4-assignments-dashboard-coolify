#!/usr/bin/env python3
"""Apply the 2026-10-07 ~12:19 PDT WISE/WMS refresh to src/app/page.tsx (prose + stamps).
Each replacement is anchored on the exact prior-refresh (2026-10-07 ~10:16 PDT) string."""
import sys

P = "src/app/page.tsx"
t = open(P, encoding="utf-8").read()

R = [
 # ── Assigned Activity banner ────────────────────────────────────────────────
 ("recomputed in this refresh</strong> from a full row-level rescan (2026-10-07 ~10:16 PDT). Below is the current live snapshot (2026-10-07 ~10:16 PDT).",
  "recomputed in this refresh</strong> from a full row-level rescan (2026-10-07 ~12:19 PDT). Below is the current live snapshot (2026-10-07 ~12:19 PDT)."),

 # ── Data Notes: door utilization headline ───────────────────────────────────
 ("5 Occupied / 1 Reserved / 17 Available / 2 anomalies",
  "6 Occupied / 1 Reserved / 16 Available / 2 anomalies"),
 ("task-derived at the 2026-10-07 ~10:16 PDT snapshot: 5 doors with an in-progress open task (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54), 1 door holding only a not-started NEW task (DOCK69), 17 doors with no open load/receive task. 6 doors carry an active assignment (26.1% of the bay).",
  "task-derived at the 2026-10-07 ~12:19 PDT snapshot: 6 doors with an in-progress open task (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56), 1 door holding only a not-started NEW task (DOCK69), 16 doors with no open load/receive task. 7 doors carry an active assignment (30.4% of the bay)."),

 # ── Data Notes: Location-API cross check ───────────────────────────────────
 ("reports 11 Bay-4 doors OCCUPIED / 4 RESERVED / 8 AVAILABLE (its <code>spaceStatus</code> reports 10 OCCUPIED / 13 EMPTY).",
  "reports 10 Bay-4 doors OCCUPIED / 4 RESERVED / 9 AVAILABLE (its <code>spaceStatus</code> reports 10 OCCUPIED / 13 EMPTY)."),
 ("from task-derived status (5 vs 11).",
  "from task-derived status (6 vs 10)."),

 # ── Data Notes: mix ────────────────────────────────────────────────────────
 ('<strong className="text-[#7c3aed]">9 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">2 inbound (RECEIVE)</strong> = 11 at ~10:16 PDT. 81.8% outbound / 18.2% inbound.',
  '<strong className="text-[#7c3aed]">7 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">3 inbound (RECEIVE)</strong> = 10 at ~12:19 PDT. 70.0% outbound / 30.0% inbound.'),

 # ── Data Notes: customer mix ───────────────────────────────────────────────
 ("all 11 of the 11 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 100.0%; no KARAKA task is open at Bay 4 this refresh. Task status: 9 IN_PROGRESS + 2 NEW.",
  "9 of the 10 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 90.0%; the remaining 1 is KARAKA, LLC (ORG-585450) — a non-GURUNANDA customer is present at Bay 4 this refresh. Task status: 9 IN_PROGRESS + 1 NEW."),

 # ── Data Notes: DOCK50 severe anomaly ──────────────────────────────────────
 ("SEVERE ANOMALY — DOCK50 (aging 350d 20h 54m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 also carries TASK-5381269 (LOAD, IN_PROGRESS 7d 18h 46m) under ARNULFO MUNGUIA. Investigate immediately.",
  "SEVERE ANOMALY — DOCK50 (aging 350d 22h 58m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 no longer carries the earlier load task TASK-5381269 (LOAD, ARNULFO MUNGUIA) — it left the open set this refresh. Investigate immediately."),

 # ── Data Notes: DOCK54 anomaly ─────────────────────────────────────────────
 ("ANOMALY — DOCK54 (aging 60d 17h 46m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — on a door that also carries TASK-5382462 (LOAD, IN_PROGRESS 6d 0h 53m, ARNULFO MUNGUIA) and TASK-5387292 (LOAD, IN_PROGRESS 1d 0h 3m, ARNULFO MUNGUIA).",
  "ANOMALY — DOCK54 (aging 60d 19h 50m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — on a door that also carries TASK-5382462 (LOAD, IN_PROGRESS 6d 2h 56m, ARNULFO MUNGUIA) and TASK-5387292 (LOAD, IN_PROGRESS 1d 2h 6m, ARNULFO MUNGUIA)."),

 # ── Data Notes: single sweep ───────────────────────────────────────────────
 ("all current-state figures on this page come from one self-consistent sweep at 2026-10-07T17:16:07Z (2026-10-07 ~10:16 PDT). Note: one door (DOCK69) holds only a not-started NEW task, so Reserved = 1 of 23; the occupied set is now 5 doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54) versus 6 at the prior 2026-10-06 ~08:39 PDT refresh — DOCK56 (its load task TASK-5387024) left the open set while DOCK51 (JEROME ARANDA) and DOCK53 took new load tasks. The open Bay-4 population grew to 11 tasks, spread across 6 doors (5 occupied + 1 reserved).",
  "all current-state figures on this page come from one self-consistent sweep at 2026-10-07T19:19:40Z (2026-10-07 ~12:19 PDT). Note: one door (DOCK69) holds only a not-started NEW task, so Reserved = 1 of 23; the occupied set is now 6 doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56) versus 5 at the prior 2026-10-07 ~10:16 PDT refresh — DOCK56 (ARNULFO MUNGUIA) took a new KARAKA receive task (TASK-5388747) while DOCK50&apos;s load task TASK-5381269 left the open set, and JEROME ARANDA&apos;s DOCK51 NEW task closed. The open Bay-4 population is 10 tasks, spread across 7 doors (6 occupied + 1 reserved)."),

 # ── Data Notes: schedule narrative ─────────────────────────────────────────
 ('the current facility-local day is <strong className="text-[#f4f4f6]">Wednesday 2026-10-07</strong> — an operating day carrying <strong className="text-[#f4f4f6]">44 inbound receipts</strong> and <strong className="text-[#f4f4f6]">96 outbound loads</strong> in its appointment window. <strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 0.0%</strong> (0 received of 44) and <strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = 11.5%</strong> (11 loaded/shipped of 96).',
  'the current facility-local day is <strong className="text-[#f4f4f6]">Wednesday 2026-10-07</strong> — an operating day carrying <strong className="text-[#f4f4f6]">44 inbound receipts</strong> and <strong className="text-[#f4f4f6]">102 outbound loads</strong> in its appointment window. <strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 6.8%</strong> (3 received of 44) and <strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = 29.4%</strong> (30 loaded/shipped of 102).'),
 ("Day status composition: loads — 62 NEW + 15 WINDOW_CHECKIN_DONE + 8 LOADING + 5 LOADED + 6 SHIPPED; receipts — 5 IN_PROGRESS + 31 IMPORTED + 8 OPEN.",
  "Day status composition: loads — 56 NEW + 26 SHIPPED + 11 LOADING + 5 WINDOW_CHECKIN_DONE + 4 LOADED; receipts — 28 IMPORTED + 7 IN_PROGRESS + 6 OPEN + 2 CLOSED + 1 EXCEPTION."),

 # ── Data Notes: all-time block ─────────────────────────────────────────────
 ("come from a full row-level rescan performed in this refresh — 23 doors × 2 task types (2,914 LOAD + 1,057 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-06 ~08:39 PDT rescan (3,958 → 3,971 closed / 2,903 → 2,914 LOAD / 1,055 → 1,057 RECEIVE).",
  "come from a full row-level rescan performed in this refresh — 23 doors × 2 task types (2,917 LOAD + 1,057 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-07 ~10:16 PDT rescan (3,971 → 3,974 closed / 2,914 → 2,917 LOAD / 1,057 → 1,057 RECEIVE)."),

 # ── Data Notes: timestamp basis ────────────────────────────────────────────
 ("(2026-10-07T17:16:07Z). Query window 2026-10-07T17:16:07Z → 2026-10-07T17:16:07Z.",
  "(2026-10-07T19:19:40Z). Query window 2026-10-07T19:19:40Z → 2026-10-07T19:19:40Z."),

 # ── Data Notes: closing line ───────────────────────────────────────────────
 ("Core live metrics sourced from live WISE/WMS queries — Wednesday 2026-10-07 ~10:16 PDT (UTC snapshot 2026-10-07T17:16:07Z).",
  "Core live metrics sourced from live WISE/WMS queries — Wednesday 2026-10-07 ~12:19 PDT (UTC snapshot 2026-10-07T19:19:40Z)."),

 # ── Footer stamp ───────────────────────────────────────────────────────────
 ("<span>Last refreshed: {refreshDateLong} ~10:16 PDT</span>",
  "<span>Last refreshed: {refreshDateLong} ~12:19 PDT</span>"),
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
