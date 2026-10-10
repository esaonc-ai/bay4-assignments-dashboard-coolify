#!/usr/bin/env python3
"""Apply the 2026-10-10 ~13:29 PDT WISE/WMS refresh to src/lib/data.ts and src/app/page.tsx.

Source of truth = src/lib/wise_snapshot.json (written by scripts/snapshot.py at
2026-10-10T20:29:59Z / 2026-10-10 ~13:29 PDT).

Only values that changed in this refresh are rewritten; the visual layout is untouched
and no value is invented. All counts/percentages are unchanged from the 2026-10-10 ~12:08 PDT
refresh, so this refresh ages the snapshot instant and every task/door duration by the elapsed
interval (~1h21m) and re-stamps the refresh references.
"""
import json, re, sys

snap = json.load(open("src/lib/wise_snapshot.json"))
door_dur = {d["door"]: d["duration"] for d in snap["doors"]}
task_pieces = {a["taskId"]: a["pieces"] for a in snap["assignments"]}
arnulfo_note = {t["taskId"]: t["note"] for t in snap["arnulfo"]["tasks"]}

ISO_OLD = "2026-10-10T19:08:14Z"
ISO_NEW = snap["snapshotUtc"]            # 2026-10-10T20:29:59Z
STAMP_OLD = "~12:08 PDT"
STAMP_NEW = "~" + snap["refreshStampLA"].split("~")[-1]   # ~13:29 PDT
# The prior refresh's stamp, which after this refresh denotes the PRIOR snapshot.
PRIOR_OLD = "~09:05 PDT"
PRIOR_NEW = STAMP_OLD
SENT = "\u0001PRIORSTAMP\u0001"

report = {"doors": 0, "assignments": 0, "arnulfo": 0, "iso": 0, "stamp": 0, "prose": 0, "missing": []}


def reindex(t):
    """Bump the refresh timeline by one step, protecting prior-reference stamps."""
    n_iso = t.count(ISO_OLD)
    t = t.replace(ISO_OLD, ISO_NEW)
    t = t.replace(PRIOR_OLD, SENT)          # protect prior refs before bumping current stamp
    n_stamp = t.count(STAMP_OLD)
    t = t.replace(STAMP_OLD, STAMP_NEW)     # current stamp -> new current stamp
    t = t.replace(SENT, PRIOR_NEW)          # prior refs -> fresh prior stamp
    report["iso"] += n_iso
    report["stamp"] += n_stamp
    return t


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
    return reindex("\n".join(out))


def apply_prose(path, pairs):
    t = reindex(open(path, encoding="utf-8").read())
    for old, new in pairs:
        c = t.count(old)
        if c == 1:
            t = t.replace(old, new)
            report["prose"] += 1
        elif c == 0 and t.count(new) >= 1:
            pass
        else:
            report["missing"].append((c, path, old[:100]))
    open(path, "w", encoding="utf-8").write(t)


# ── data.ts ─────────────────────────────────────────────────────────────────
_patched = patch_data_ts("src/lib/data.ts")          # read+patch BEFORE opening for write
open("src/lib/data.ts", "w", encoding="utf-8").write(_patched)

# ── page.tsx prose (anchored on the exact prior-refresh strings) ────────────
P = "src/app/page.tsx"
R = [
 # Data Notes: DOCK50 severe anomaly (duration re-aged to the new snapshot instant)
 ("SEVERE ANOMALY — DOCK50 (aging 353d 22h 47m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 still carries TASK-5389467 (LOAD, IN_PROGRESS 2d 3h 0m, ARNULFO MUNGUIA) and TASK-5390717 (LOAD, IN_PROGRESS 1d 0h 30m, ARNULFO MUNGUIA). Investigate immediately.",
  "SEVERE ANOMALY — DOCK50 (aging 354d 0h 8m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 still carries TASK-5389467 (LOAD, IN_PROGRESS 2d 4h 22m, ARNULFO MUNGUIA) and TASK-5390717 (LOAD, IN_PROGRESS 1d 1h 52m, ARNULFO MUNGUIA). Investigate immediately."),

 # Data Notes: DOCK54 anomaly (duration re-aged; prior-refresh stamp already bumped by reindex)
 ("ANOMALY — DOCK54 (aging 63d 19h 38m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — and remains the only open task on that door (unchanged since the prior 2026-10-10 ~12:08 PDT refresh). Assigned to ARNULFO MUNGUIA.",
  "ANOMALY — DOCK54 (aging 63d 21h 0m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — and remains the only open task on that door (unchanged since the prior 2026-10-10 ~12:08 PDT refresh). Assigned to ARNULFO MUNGUIA."),
]
apply_prose(P, R)

print(json.dumps(report, indent=2, ensure_ascii=False))

# ── integrity checks: rendered figures must reconcile to the fresh snapshot ──
data_t = open("src/lib/data.ts", encoding="utf-8").read()
page_t = open(P, encoding="utf-8").read()
occ = len(re.findall(r'^  \{ door: "DOCK\d+", status: "Occupied"', data_t, re.M))
res = len(re.findall(r'^  \{ door: "DOCK\d+", status: "Reserved"', data_t, re.M))
tot = len(re.findall(r'^  \{ door: "DOCK\d+", status: "', data_t, re.M))
checks = {
    "occupied_matches": occ == snap["kpi"]["occupied"],
    "reserved_matches": res == snap["kpi"]["reserved"],
    "doors_total": tot == 23,
    "stale_iso_gone": (ISO_OLD not in data_t) and (ISO_OLD not in page_t),
    "new_iso_present": ISO_NEW in data_t and ISO_NEW in page_t,
    "no_write_sentinels": (SENT not in data_t) and (SENT not in page_t),
}
print("checks:", json.dumps(checks))
assert all(checks.values()), checks
sys.exit(1 if report["missing"] else 0)
