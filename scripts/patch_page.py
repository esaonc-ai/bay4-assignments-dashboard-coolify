#!/usr/bin/env python3
"""Atomically apply the remaining Data-Notes prose refreshes to src/app/page.tsx."""
import sys

P = "src/app/page.tsx"
t = open(P, encoding="utf-8").read()

R = [
 ("(2026-09-30 ~19:06 PDT). Below is the current live snapshot (2026-09-30 ~19:06 PDT).",
  "(2026-10-01 ~11:27 PDT). Below is the current live snapshot (2026-10-01 ~11:27 PDT)."),
 ("7 Occupied / 1 Reserved / 15 Available / 2 anomalies",
  "8 Occupied / 0 Reserved / 15 Available / 2 anomalies"),
 ("at the 2026-09-30 ~19:06 PDT snapshot: 7 doors with an in-progress open task (DOCK50, DOCK51, DOCK53, DOCK54, DOCK55, DOCK63, DOCK69), 1 door holding only a not-started NEW task (DOCK59), 15 doors with no open load/receive task.",
  "at the 2026-10-01 ~11:27 PDT snapshot: 8 doors with an in-progress open task (DOCK50, DOCK51, DOCK53, DOCK54, DOCK55, DOCK59, DOCK63, DOCK69), 0 doors holding only a not-started NEW task, 15 doors with no open load/receive task."),
 ("reports 15 Bay-4 doors OCCUPIED / 1 RESERVED / 7 AVAILABLE (its <code>spaceStatus</code> reports 10 OCCUPIED / 13 EMPTY)",
  "reports 16 Bay-4 doors OCCUPIED / 1 RESERVED / 6 AVAILABLE (its <code>spaceStatus</code> reports 11 OCCUPIED / 12 EMPTY)"),
 ("from task-derived status (7 vs 15)",
  "from task-derived status (8 vs 16)"),
 ("Task status: 10 IN_PROGRESS + 3 NEW.</li>",
  "Task status: 12 IN_PROGRESS + 1 NEW.</li>"),
 ("DOCK54 (aging 54d 9h 37m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS \u2014 stale \u2014 on a door that also carries TASK-5380820 (LOAD, IN_PROGRESS 1d 13h 59m) and TASK-5382462 (LOAD, NEW); all three DOCK54 tasks are ARNULFO MUNGUIA.",
  "DOCK54 (aging 54d 18h 57m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS \u2014 stale \u2014 on a door that also carries TASK-5380820 (LOAD, IN_PROGRESS 1d 23h 19m, ARNULFO MUNGUIA) and TASK-5382462 (LOAD, IN_PROGRESS 2h 4m, DANIEL BELTRAN)."),
 ("Wednesday 2026-09-30</strong> and its appointment windows return <strong className=\"text-[#f4f4f6]\">111 loads</strong> and <strong className=\"text-[#f4f4f6]\">45 receipts</strong>. The outbound tile reports <strong className=\"text-[#f4f4f6]\">85.6%</strong> (95 loaded of 111; 95 SHIPPED, 16 still NEW) and the inbound tile reports <strong className=\"text-[#f4f4f6]\">35.6%</strong> (16 received of 45; 15 CLOSED, 12 IN_PROGRESS, 17 IMPORTED and 1 EXCEPTION).",
  "Thursday 2026-10-01</strong> and its appointment windows return <strong className=\"text-[#f4f4f6]\">129 loads</strong> and <strong className=\"text-[#f4f4f6]\">21 receipts</strong>. The outbound tile reports <strong className=\"text-[#f4f4f6]\">34.9%</strong> (45 loaded of 129; 29 SHIPPED + 16 LOADED, 29 LOADING, 6 checked-in and 49 still NEW) and the inbound tile reports <strong className=\"text-[#f4f4f6]\">0.0%</strong> (0 received of 21; 8 IN_PROGRESS \u2014 receiving started, 11 IMPORTED, 1 OPEN and 1 EXCEPTION)."),
 ("i.e. [&quot;2026-09-30T00:00:00&quot;,&quot;2026-09-30T23:59:59&quot;]",
  "i.e. [&quot;2026-10-01T00:00:00&quot;,&quot;2026-10-01T23:59:59&quot;]"),
 ("(2,888 LOAD + 1,037 RECEIVE, statuses CLOSED/FORCE_CLOSED)",
  "(2,890 LOAD + 1,039 RECEIVE, statuses CLOSED/FORCE_CLOSED)"),
 ("(2026-10-01T02:06:59Z). Query window 2026-10-01T02:06:59Z \u2192 2026-10-01T02:06:59Z.",
  "(2026-10-01T18:27:09Z). Query window 2026-10-01T18:27:09Z \u2192 2026-10-01T18:27:09Z."),
 ("Core live metrics sourced from live WISE/WMS queries \u2014 Wednesday 2026-09-30 ~19:06 PDT (UTC snapshot 2026-10-01T02:06:59Z).",
  "Core live metrics sourced from live WISE/WMS queries \u2014 Thursday 2026-10-01 ~11:27 PDT (UTC snapshot 2026-10-01T18:27:09Z)."),
 ("verified on all 6 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot;",
  "verified on all 7 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot;"),
 ("<span>Last refreshed: {refreshDateLong} ~19:06 PDT</span>",
  "<span>Last refreshed: {refreshDateLong} ~11:27 PDT</span>"),
]

applied, skipped, missing = 0, 0, []
for old, new in R:
    if old in t:
        assert t.count(old) == 1, f"multiple matches: {old[:60]}"
        t = t.replace(old, new); applied += 1
    elif new in t:
        skipped += 1
    else:
        missing.append(old[:70])

open(P, "w", encoding="utf-8").write(t)
print(f"applied={applied} skipped(already)={skipped} missing={len(missing)}")
for m in missing: print("  MISSING:", m)
sys.exit(1 if missing else 0)
