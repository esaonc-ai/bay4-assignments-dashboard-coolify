#!/usr/bin/env python3
"""Apply the 2026-10-11 ~09:44 PDT WISE/WMS refresh to src/lib/data.ts and src/app/page.tsx.

Source of truth = src/lib/wise_snapshot.json (written by scripts/snapshot.py at
2026-10-11T16:44:01Z / 2026-10-11 ~09:44 PDT). Prior refresh = the committed
2026-10-11 ~06:59 PDT snapshot (copied to /tmp/wise_snapshot.prev.json).

What actually changed in the live WISE read this refresh:
  * snapshot instant / stamp roll forward from 2026-10-11 ~06:59 PDT to ~09:44 PDT.
  * every open-task and door DURATION ages by the elapsed interval (~2h 45m).
  * the open Bay-4 population is IDENTICAL (same 16 open tasks on the same 10 doors;
    8 Occupied / 2 Reserved / 13 Available; 11 LOAD + 5 RECEIVE; 15 GURUNANDA + 1 CMPC;
    9 distinct active assignees; Arnulfo still 6 open).
  * the scheduled-day window for the facility-local day still returns 0 loads / 0 receipts
    (2026-10-11, Sunday) => BOTH schedule adherence figures remain n/a (no denominator).

Only values that changed are rewritten; the visual layout is untouched and no value is
invented. Destructive-update guard: every anchored replacement must match exactly once
(or, for globals, exactly the expected count).
"""
import json, re, sys

snap = json.load(open("src/lib/wise_snapshot.json"))
prev = json.load(open("/tmp/wise_snapshot.prev.json"))

ISO_OLD = prev["snapshotUtc"]                                  # 2026-10-11T13:59:19Z
ISO_NEW = snap["snapshotUtc"]                                  # 2026-10-11T16:44:01Z
STAMP_CONST_NEW = snap["refreshStampLA"]                       # Oct 11 ~09:44 PDT
STAMP_NEW = "~" + snap["refreshStampLA"].split("~")[-1]        # ~09:44 PDT
CUR_DATE_STAMP = f'{snap["bootDay"]} {STAMP_NEW}'              # 2026-10-11 ~09:44 PDT
PRIOR_DATE_STAMP = f'{prev["bootDay"]} ~{prev["refreshStampLA"].split("~")[-1]}'  # 2026-10-11 ~06:59 PDT
OLD_PRIOR_REF = "2026-10-10 ~19:04 PDT"

door_dur = {d["door"]: d["duration"] for d in snap["doors"]}
task_pieces = {a["taskId"]: a["pieces"] for a in snap["assignments"]}
arnulfo_note = {t["taskId"]: t["note"] for t in snap["arnulfo"]["tasks"]}

# Page prose durations (the four figures quoted outside the structured tables)
PAGE_DUR = [
    ("(aging 354d 17h 38m)", f'(aging {door_dur["DOCK50"]})'),
    ("TASK-5389467 (LOAD, IN_PROGRESS 2d 21h 51m, ARNULFO MUNGUIA)",
     f'TASK-5389467 (LOAD, IN_PROGRESS {task_pieces["TASK-5389467"].split("IN_PROGRESS (")[1].rstrip(")")}, ARNULFO MUNGUIA)'),
    ("TASK-5390717 (LOAD, IN_PROGRESS 1d 19h 21m, ARNULFO MUNGUIA)",
     f'TASK-5390717 (LOAD, IN_PROGRESS {task_pieces["TASK-5390717"].split("IN_PROGRESS (")[1].rstrip(")")}, ARNULFO MUNGUIA)'),
    ("(aging 64d 14h 29m)", f'(aging {door_dur["DOCK54"]})'),
]

report = {"doors": 0, "assignments": 0, "arnulfo": 0, "anchors": 0, "globals": 0}
missing = []


def sub_once(t, old, new, where):
    c = t.count(old)
    if c == 1:
        report["anchors"] += 1
        return t.replace(old, new)
    if c == 0 and t.count(new) >= 1:
        return t                      # already applied (idempotent)
    missing.append((c, where, old[:90]))
    return t


def sub_n(t, old, new, n, where):
    c = t.count(old)
    if c == n:
        report["globals"] += n
        return t.replace(old, new)
    if c == 0 and t.count(new) >= n:
        return t                      # already applied (idempotent)
    missing.append((c, where, f"{old[:60]} (expected {n})"))
    return t


# ─────────────────────────────────────────────────────────────────────────────
# 1. data.ts — structured rows rewritten from the fresh snapshot (by key, order kept)
# ─────────────────────────────────────────────────────────────────────────────
lines = open("src/lib/data.ts", encoding="utf-8").read().split("\n")
out = []
for ln in lines:
    if re.match(r'^  \{ door: "DOCK\d+", ', ln) and "duration:" in ln and "taskIds:" in ln:
        door = re.match(r'^  \{ door: "(DOCK\d+)"', ln).group(1)
        new = door_dur.get(door)
        if new is not None:
            ln, n = re.subn(r'(duration: ")[^"]*(")', lambda m: m.group(1) + new + m.group(2), ln, count=1)
            report["doors"] += n
    elif re.match(r'^  \{ taskId: "TASK-\d+", ', ln) and "pieces:" in ln and "assignee:" in ln:
        tid = re.match(r'^  \{ taskId: "(TASK-\d+)"', ln).group(1)
        new = task_pieces.get(tid)
        if new is not None:
            ln, n = re.subn(r'(pieces: ").*?(", assignee:)', lambda m: m.group(1) + new + m.group(2), ln, count=1)
            report["assignments"] += n
    elif re.match(r'^  \{ door: "DOCK\d+", taskId: "TASK-\d+", ', ln) and "note:" in ln:
        tid = re.match(r'^  \{ door: "DOCK\d+", taskId: "(TASK-\d+)"', ln).group(1)
        new = arnulfo_note.get(tid)
        if new is not None:
            ln, n = re.subn(r'(note: ").*?(" \},)', lambda m: m.group(1) + new + m.group(2), ln, count=1)
            report["arnulfo"] += n
    out.append(ln)
t = "\n".join(out)

assert report["doors"] == sum(1 for d in snap["doors"] if d["duration"]), report
assert report["assignments"] == 16, report
assert report["arnulfo"] == 6, report

# scalar constants
t = sub_once(t, 'export const refreshStamp = "Oct 11 ~06:59 PDT";',
             f'export const refreshStamp = "{STAMP_CONST_NEW}";', "data:refreshStamp")
t = sub_once(t, 'export const allTimeLastRecomputed = "Oct 11 ~06:59 PDT";',
             f'export const allTimeLastRecomputed = "{STAMP_CONST_NEW}";', "data:allTimeLastRecomputed")

# current-refresh date+stamp occurrences roll forward (2 in comments)
t = sub_n(t, "2026-10-11 ~06:59 PDT", CUR_DATE_STAMP, 2, "data:current-date-stamp")
# prior-refresh reference rolls 2026-10-10 ~19:04 -> the just-passed 2026-10-11 ~06:59 stamp
t = sub_once(t, OLD_PRIOR_REF, PRIOR_DATE_STAMP, "data:prior-ref")
# global ISO re-stamp (6 occurrences)
t = sub_n(t, ISO_OLD, ISO_NEW, 6, "data:iso")
open("src/lib/data.ts", "w", encoding="utf-8").write(t)

# ─────────────────────────────────────────────────────────────────────────────
# 2. page.tsx — prose values + stamps
# ─────────────────────────────────────────────────────────────────────────────
p = open("src/app/page.tsx", encoding="utf-8").read()

# 2a. every current-refresh stamp (~06:59 PDT) rolls to the new stamp (7 occurrences)
p = sub_n(p, "~06:59 PDT", STAMP_NEW, 7, "page:stamp")
# 2b. global ISO re-stamp (5 occurrences)
p = sub_n(p, ISO_OLD, ISO_NEW, 5, "page:iso")
# 2c. prior-refresh references roll from 2026-10-10 ~19:04 -> 2026-10-11 ~06:59 (3 occurrences)
p = sub_n(p, OLD_PRIOR_REF, PRIOR_DATE_STAMP, 3, "page:prior-ref")
# 2d. quoted anomaly / task durations age
for old, new in PAGE_DUR:
    p = sub_once(p, old, new, f"page:dur[{old[:24]}]")
open("src/app/page.tsx", "w", encoding="utf-8").write(p)

# ─────────────────────────────────────────────────────────────────────────────
# 3. Integrity checks
# ─────────────────────────────────────────────────────────────────────────────
d = open("src/lib/data.ts", encoding="utf-8").read()
pg = open("src/app/page.tsx", encoding="utf-8").read()
both = d + pg

occ = len(re.findall(r'^  \{ door: "DOCK\d+", status: "Occupied"', d, re.M))
res = len(re.findall(r'^  \{ door: "DOCK\d+", status: "Reserved"', d, re.M))
ava = len(re.findall(r'^  \{ door: "DOCK\d+", status: "Available"', d, re.M))
tot = occ + res + ava

# cross-check the non-duration scalars against the fresh snapshot
scalars_ok = all([
    d.count("export const scheduledInboundOrders = 0;") == 1,
    d.count("export const scheduledOutboundOrders = 0;") == 1,
    d.count("export const facilityOpenLoad = %d;" % snap["facilityOpen"]["load"]) == 1,
    d.count("export const facilityOpenReceive = %d;" % snap["facilityOpen"]["receive"]) == 1,
    d.count("export const allTimeClosedTotal = %d;" % snap["allTime"]["closedTotal"]) == 1,
    d.count("export const allTimeDistinctAssignees = %d;" % snap["allTime"]["distinct"]) == 1,
    d.count("export const guruArnulfoAllTimeTotal = %d;" % snap["guruArnulfo"]["total"]) == 1,
    d.count("{ label: \"Outbound\", count: %d, total: 16 }" % snap["mix"]["outbound"]) >= 1,
    d.count("{ label: \"Inbound\", count: %d, total: 16 }" % snap["mix"]["inbound"]) >= 1,
    d.count("taskCount: %d }" % snap["assigneeSummaries"][0]["taskCount"]) >= 1,
])

checks = {
    "no_missing_anchors": not missing,
    "occupied_matches": occ == snap["kpi"]["occupied"],
    "reserved_matches": res == snap["kpi"]["reserved"],
    "available_matches": ava == snap["kpi"]["available"],
    "doors_total": tot == 23,
    "scalars_match_snapshot": scalars_ok,
    "stale_iso_gone": ISO_OLD not in both,
    "new_iso_present": ISO_NEW in d and ISO_NEW in pg,
    "data_current_stamp": d.count(STAMP_CONST_NEW) == 2,
    "data_new_iso_count": d.count(ISO_NEW) == 6,
    "page_new_iso_count": pg.count(ISO_NEW) == 5,
    "page_new_stamp_count": pg.count(STAMP_NEW) == 7,
    "page_prior_stamp_count": pg.count(PRIOR_DATE_STAMP) == 3,
    "old_prior_ref_gone": OLD_PRIOR_REF not in both,
    "old_0659_stamp_only_as_prior": d.count("~06:59 PDT") == 1 and pg.count("~06:59 PDT") == 3,
    "all_door_durs_fresh": all(
        (dd["duration"] is None) or
        re.search(r'\{ door: "%s".*duration: "%s"' % (dd["door"], re.escape(dd["duration"])), d)
        for dd in snap["doors"]),
    "all_task_durs_fresh": all(
        re.search(r'\{ taskId: "%s".*pieces: "%s"' % (a["taskId"], re.escape(a["pieces"])), d)
        for a in snap["assignments"]),
    "all_arnulfo_notes_fresh": all(
        re.search(r'taskId: "%s".*note: "%s"' % (t2["taskId"], re.escape(t2["note"])), d)
        for t2 in snap["arnulfo"]["tasks"]),
    "no_old_durations_left": all(
        (dd["duration"] is None) or dd["duration"] not in both
        for dd in prev["doors"]
        if dd["duration"] != door_dur.get(dd["door"])),
}
print("report:", json.dumps(report, ensure_ascii=False))
if missing:
    print("MISSING ANCHORS:")
    for c, where, snippet in missing:
        print(f"  [{where}] count={c}: {snippet}")
print("checks:", json.dumps(checks, indent=2))
assert all(checks.values()), checks
sys.exit(0)
