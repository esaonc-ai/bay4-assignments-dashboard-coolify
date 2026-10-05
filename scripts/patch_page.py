#!/usr/bin/env python3
"""Apply the 2026-10-04 ~19:07 PDT WISE/WMS refresh to src/app/page.tsx (prose + stamps).

Every replacement is anchored on the exact prior-refresh (2026-10-04 ~14:48 PDT) string so a
partial/mismatched apply fails loudly instead of silently drifting.
"""
import sys

P = "src/app/page.tsx"
t = open(P, encoding="utf-8").read()

R = [
 # ── Assigned Activity banner ────────────────────────────────────────────────
 ("— <strong className=\"text-[#f4f4f6]\">recomputed in this refresh</strong> from a full row-level rescan (2026-10-04 ~14:48 PDT). Below is the current live snapshot (2026-10-04 ~14:48 PDT).",
  "— <strong className=\"text-[#f4f4f6]\">carried forward unchanged this refresh</strong> (last full rescan 2026-10-04 ~14:48 PDT). Below is the current live snapshot (2026-10-04 ~19:07 PDT)."),

 # ── All-time sub-block header ───────────────────────────────────────────────
 ("All-Time Assignments (DOCK50–DOCK72) — full recomputation {allTimeLastRecomputed} ({allTimeClosedTotal.toLocaleString()} closed / {allTimeDistinctAssignees} assignees); re-scanned in this refresh",
  "All-Time Assignments (DOCK50–DOCK72) — last full recomputation {allTimeLastRecomputed} ({allTimeClosedTotal.toLocaleString()} closed / {allTimeDistinctAssignees} assignees); carried forward this refresh (no Bay-4 closes since)"),

 # ── Arnulfo column footnote ────────────────────────────────────────────────
 ("All-time (fresh): {guruArnulfoAllTimeTotal} at Bay-4 doors",
  "All-time (unchanged): {guruArnulfoAllTimeTotal} at Bay-4 doors"),

 # ── Data Notes: door utilization ───────────────────────────────────────────
 ("door utilization is task-derived at the 2026-10-04 ~14:48 PDT snapshot: 8 doors with an in-progress open task (DOCK50, DOCK51, DOCK53, DOCK54, DOCK55, DOCK56, DOCK68, DOCK69), 0 doors holding only a not-started NEW task, 15 doors with no open load/receive task.",
  "door utilization is task-derived at the 2026-10-04 ~19:07 PDT snapshot: 8 doors with an in-progress open task (DOCK50, DOCK51, DOCK53, DOCK54, DOCK55, DOCK56, DOCK68, DOCK69), 0 doors holding only a not-started NEW task, 15 doors with no open load/receive task."),

 # ── Data Notes: Location-API cross check ───────────────────────────────────
 ("reports 17 Bay-4 doors OCCUPIED / 2 RESERVED / 4 AVAILABLE (its <code>spaceStatus</code> reports 10 OCCUPIED / 13 EMPTY)",
  "reports 16 Bay-4 doors OCCUPIED / 2 RESERVED / 5 AVAILABLE (its <code>spaceStatus</code> reports 10 OCCUPIED / 13 EMPTY)"),
 ("from task-derived status (8 vs 17)",
  "from task-derived status (8 vs 16)"),

 # ── Data Notes: mix timestamp ──────────────────────────────────────────────
 ("= 12 at ~14:48 PDT. 50.0% outbound / 50.0% inbound.",
  "= 12 at ~19:07 PDT. 50.0% outbound / 50.0% inbound."),

 # ── Data Notes: DOCK50 severe anomaly ──────────────────────────────────────
 ("SEVERE ANOMALY — DOCK50 (aging 348d 1h 27m):",
  "SEVERE ANOMALY — DOCK50 (aging 348d 5h 45m):"),
 ("DOCK50 also carries TASK-5381269 (LOAD, IN_PROGRESS 4d 23h 19m) under ARNULFO MUNGUIA.",
  "DOCK50 also carries TASK-5381269 (LOAD, IN_PROGRESS 5d 3h 37m) under ARNULFO MUNGUIA."),

 # ── Data Notes: DOCK54 anomaly ─────────────────────────────────────────────
 ("ANOMALY — DOCK54 (aging 57d 22h 19m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — on a door that also carries TASK-5380820 (LOAD, IN_PROGRESS 5d 2h 40m, ARNULFO MUNGUIA) and TASK-5382462 (LOAD, IN_PROGRESS 3d 5h 25m, ARNULFO MUNGUIA).",
  "ANOMALY — DOCK54 (aging 58d 2h 37m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — on a door that also carries TASK-5380820 (LOAD, IN_PROGRESS 5d 6h 59m, ARNULFO MUNGUIA) and TASK-5382462 (LOAD, IN_PROGRESS 3d 9h 44m, ARNULFO MUNGUIA)."),

 # ── Data Notes: single sweep timestamp + prior-refresh reference ────────────
 ("one self-consistent sweep at 2026-10-04T21:48:39Z (2026-10-04 ~14:48 PDT).",
  "one self-consistent sweep at 2026-10-05T02:07:00Z (2026-10-04 ~19:07 PDT)."),
 ("is unchanged from the prior 2026-10-04 ~11:58 PDT refresh, with only task durations aged.",
  "is unchanged from the prior 2026-10-04 ~14:48 PDT refresh (identical open task IDs), with only task durations aged."),

 # ── Data Notes: schedule narrative (drop stale prior/next-day counts) ───────
 ("The last reported operating day (Thursday 2026-10-01) carried 120 loads / 20 receipts, and the next operating day is Monday 2026-10-05 (154 loads / 22 receipts).",
  "The next operating day is Monday 2026-10-05."),

 # ── Data Notes: all-time block ─────────────────────────────────────────────
 ("<strong className=\"text-[#22c55e]\">All-time cumulative figures RECOMPUTED this refresh:</strong> the <strong className=\"text-[#f4f4f6]\">{allTimeClosedTotal.toLocaleString()}</strong> closed Bay-4 transactions across <strong className=\"text-[#f4f4f6]\">{allTimeDistinctAssignees}</strong> display names (top-10 list above) and the GURUNANDA → Arnulfo cumulative <strong className=\"text-[#f4f4f6]\">{guruArnulfoAllTimeTotal}</strong> ({guruArnulfoAllTimeLoad} LOAD + {guruArnulfoAllTimeReceive} RECEIVE) come from a full row-level rescan performed in this refresh — 23 doors × 2 task types (2,896 LOAD + 1,047 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward.",
  "<strong className=\"text-[#22c55e]\">All-time cumulative figures — CARRIED FORWARD UNCHANGED this refresh:</strong> the <strong className=\"text-[#f4f4f6]\">{allTimeClosedTotal.toLocaleString()}</strong> closed Bay-4 transactions across <strong className=\"text-[#f4f4f6]\">{allTimeDistinctAssignees}</strong> display names (top-10 list above) and the GURUNANDA → Arnulfo cumulative <strong className=\"text-[#f4f4f6]\">{guruArnulfoAllTimeTotal}</strong> ({guruArnulfoAllTimeLoad} LOAD + {guruArnulfoAllTimeReceive} RECEIVE) are unchanged from the full row-level rescan at 2026-10-04 ~14:48 PDT — 23 doors × 2 task types (2,896 LOAD + 1,047 RECEIVE, statuses CLOSED/FORCE_CLOSED). The live Bay-4 open population is identical to the prior refresh (same 12 task IDs), so no Bay-4 task could have closed in between."),

 # ── Data Notes: timestamp basis ────────────────────────────────────────────
 ("task timestamps are read on the same UTC frame as the snapshot instant (2026-10-04T21:48:39Z). Query window 2026-10-04T21:48:39Z → 2026-10-04T21:48:39Z.",
  "task timestamps are read on the same UTC frame as the snapshot instant (2026-10-05T02:07:00Z). Query window 2026-10-05T02:07:00Z → 2026-10-05T02:07:00Z."),

 # ── Data Notes: closing line ───────────────────────────────────────────────
 ("Core live metrics sourced from live WISE/WMS queries — Sunday 2026-10-04 ~14:48 PDT (UTC snapshot 2026-10-04T21:48:39Z).",
  "Core live metrics sourced from live WISE/WMS queries — Sunday 2026-10-04 ~19:07 PDT (UTC snapshot 2026-10-05T02:07:00Z)."),

 # ── Footer stamp ───────────────────────────────────────────────────────────
 ("<span>Last refreshed: {refreshDateLong} ~14:48 PDT</span>",
  "<span>Last refreshed: {refreshDateLong} ~19:07 PDT</span>"),
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
