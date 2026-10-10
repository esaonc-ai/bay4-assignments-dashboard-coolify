#!/usr/bin/env python3
"""Apply the 2026-10-10 ~12:08 PDT WISE/WMS refresh to src/lib/data.ts and src/app/page.tsx.

Source of truth = src/lib/wise_snapshot.json (written by scripts/snapshot.py).
Only values that changed in this refresh are rewritten; the visual layout is untouched
and no value is invented. All counts are unchanged from the 2026-10-10 ~09:05 PDT refresh,
so this refresh ages the snapshot instant and every task duration by the elapsed interval.
"""
import json, re, sys

snap = json.load(open("src/lib/wise_snapshot.json"))
door_dur = {d["door"]: d["duration"] for d in snap["doors"]}
task_pieces = {a["taskId"]: a["pieces"] for a in snap["assignments"]}
arnulfo_note = {t["taskId"]: t["note"] for t in snap["arnulfo"]["tasks"]}

ISO_OLD = "2026-10-10T16:05:58Z"
ISO_NEW = snap["snapshotUtc"]            # 2026-10-10T19:08:14Z
STAMP_OLD = "~09:05 PDT"
STAMP_NEW = "~" + snap["refreshStampLA"].split("~")[-1]   # ~12:08 PDT
# Sentinel for references to the PRIOR refresh's stamp, which must NOT be re-stamped
# by the global replacement; restored to the literal after global replacement runs.
PRIOR = "\u00ab09:05\u00bb"
PRIOR_LIT = "~09:05 PDT"

report = {"doors": 0, "assignments": 0, "arnulfo": 0, "global": 0, "prose": 0, "missing": []}


def finalize(t):
    return t.replace(PRIOR, PRIOR_LIT)


def patch_data_ts(path):
    lines = open(path, encoding="utf-8").read().split("\n")
    out = []
    for ln in lines:
        if re.match(r'^  \{ door: "DOCK\d+", ', ln) and "duration:" in ln:
            door = re.match(r'^  \{ door: "(DOCK\d+)"', ln).group(1)
            new = door_dur.get(door)
            if new is not None:
                ln, n = re.subn(r'(duration: ")[^"]*(")', lambda m: m.group(1) + new + m.group(2), ln, count=1)
                report["doors"] += n
        elif re.match(r'^  \{ taskId: "TASK-\d+", ', ln) and "pieces:" in ln:
            tid = re.match(r'^  \{ taskId: "(TASK-\d+)"', ln).group(1)
            new = task_pieces.get(tid)
            if new is not None:
                ln, n = re.subn(r'(pieces: ").*?(", assignee:)', lambda m: m.group(1) + new + m.group(2), ln, count=1)
                report["assignments"] += n
        elif re.match(r'^  \{ door: "DOCK\d+", taskId: "TASK-\d+", ', ln) and "note:" in ln:
            tid = re.match(r'^  \{ door: "DOCK\d+", taskId: "(TASK-\d+)"', ln).group(1)
            new = arnulfo_note.get(tid)
            if new is not None:
                ln, n = re.subn(r'(note: ").*?(" \},$)', lambda m: m.group(1) + new + m.group(2), ln, count=1)
                report["arnulfo"] += n
        out.append(ln)
    t = "\n".join(out)
    return finalize(globals_replace(t))


def globals_replace(t):
    before = t
    t = t.replace(ISO_OLD, ISO_NEW)
    t = t.replace(STAMP_OLD, STAMP_NEW)
    if t != before:
        report["global"] += 1
    return t


def apply_prose(path, pairs):
    t = open(path, encoding="utf-8").read()
    for old, new in pairs:
        c = t.count(old)
        if c == 1:
            t = t.replace(old, new)
            report["prose"] += 1
        elif c == 0 and t.count(new) >= 1:
            pass
        else:
            report["missing"].append((c, path, old[:80]))
    t = finalize(globals_replace(t))
    open(path, "w", encoding="utf-8").write(t)


# ── data.ts ─────────────────────────────────────────────────────────────────
t = patch_data_ts("src/lib/data.ts")
old_alltime = (" *   Bay-4 door (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED). The closed population grew from\n"
               " *   the prior 2026-10-09 ~07:46 PDT rescan (3,993 → 4,002 closed transactions; 2,929 → 2,936 LOAD;\n"
               " *   1,064 → 1,066 RECEIVE), so the cumulative figures below are fresh, not carried forward.")
new_alltime = (" *   Bay-4 door (23 doors × 2 task types, statuses CLOSED/FORCE_CLOSED). The closed population is unchanged\n"
               " *   from the prior 2026-10-10 " + PRIOR + " rescan (4,002 closed transactions; 2,936 LOAD; 1,066 RECEIVE) —\n"
               " *   no Bay-4 task closed in the interval, so the cumulative figures below are fresh, not carried forward.")
if t.count(old_alltime) == 1:
    t = t.replace(old_alltime, new_alltime); report["prose"] += 1
else:
    report["missing"].append((t.count(old_alltime), "data.ts", "ALL-TIME NOTE comment"))
t = finalize(t)
open("src/lib/data.ts", "w", encoding="utf-8").write(t)

# ── page.tsx prose (anchored on the exact prior-refresh strings) ─────────────
P = "src/app/page.tsx"
R = [
 # Data Notes: DOCK50 severe anomaly
 ("SEVERE ANOMALY — DOCK50 (aging 353d 19h 44m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 now also carries TASK-5389467 (LOAD, IN_PROGRESS 1d 23h 58m, ARNULFO MUNGUIA) and TASK-5390717 (LOAD, IN_PROGRESS 21h 28m, ARNULFO MUNGUIA).",
  "SEVERE ANOMALY — DOCK50 (aging 353d 22h 47m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 still carries TASK-5389467 (LOAD, IN_PROGRESS 2d 3h 0m, ARNULFO MUNGUIA) and TASK-5390717 (LOAD, IN_PROGRESS 1d 0h 30m, ARNULFO MUNGUIA)."),

 # Data Notes: DOCK54 anomaly
 ("ANOMALY — DOCK54 (aging 63d 16h 36m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — and is now the only open task on that door (TASK-5382462 and TASK-5389875 left the open set this refresh). Assigned to ARNULFO MUNGUIA.",
  "ANOMALY — DOCK54 (aging 63d 19h 38m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — and remains the only open task on that door (unchanged since the prior 2026-10-10 " + PRIOR + " refresh). Assigned to ARNULFO MUNGUIA."),

 # Data Notes: single tight sweep (sweep instant + delta vs prior refresh)
 ("all current-state figures on this page come from one self-consistent sweep at 2026-10-10T16:05:58Z (2026-10-10 ~09:05 PDT). Note: two doors (DOCK66, DOCK69) hold only a not-started NEW task, so Reserved = 2 of 23; the occupied set is 8 doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK58) versus 8 at the prior 2026-10-09 ~07:46 PDT refresh — DOCK58 entered the occupied set while DOCK61 left it, and the open population turned over: seven tasks cleared (TASK-5389880 / DOCK52, TASK-5382457 / DOCK53, TASK-5382462 and TASK-5389875 / DOCK54, TASK-5389143 and TASK-5389635 / DOCK56, TASK-5390038 / DOCK61) and four appeared (TASK-5390717 / DOCK50, TASK-5390984 / DOCK52, TASK-5390995 / DOCK58, TASK-5390273 / DOCK66). The open Bay-4 population is 16 tasks, spread across 10 doors (8 occupied + 2 reserved).",
  "all current-state figures on this page come from one self-consistent sweep at 2026-10-10T19:08:14Z (2026-10-10 ~12:08 PDT). Note: two doors (DOCK66, DOCK69) hold only a not-started NEW task, so Reserved = 2 of 23; the occupied set is 8 doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK58) — unchanged from the prior 2026-10-10 ~09:05 PDT refresh: no task entered or left the open set, so the population is stable at the same 16 tasks across the same 10 doors (8 occupied + 2 reserved).".replace("~09:05 PDT", PRIOR)),

 # Data Notes: all-time cumulative block
 ("come from a full row-level rescan performed in this refresh — 23 doors × 2 task types (2,936 LOAD + 1,066 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-09 ~07:46 PDT rescan (3,993 → 4,002 closed / 2,929 → 2,936 LOAD / 1,064 → 1,066 RECEIVE).",
  "come from a full row-level rescan performed in this refresh — 23 doors × 2 task types (2,936 LOAD + 1,066 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set is unchanged from the prior 2026-10-10 ~09:05 PDT rescan (4,002 closed / 2,936 LOAD / 1,066 RECEIVE — no Bay-4 task closed in the interval).".replace("~09:05 PDT", PRIOR)),
]
apply_prose(P, R)

print(json.dumps(report, indent=2, ensure_ascii=False))
sys.exit(1 if report["missing"] else 0)
