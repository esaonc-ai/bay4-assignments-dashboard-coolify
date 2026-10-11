#!/usr/bin/env python3
"""Apply the 2026-10-10 ~19:04 PDT WISE/WMS refresh to src/lib/data.ts and src/app/page.tsx.

Source of truth = src/lib/wise_snapshot.json (written by scripts/snapshot.py at
2026-10-11T02:04:02Z / 2026-10-10 ~19:04 PDT). Prior refresh = /tmp/wise_snapshot.prev.json
(the 2026-10-10 ~18:12 PDT snapshot).

Only values that changed in this refresh are rewritten; the visual layout is untouched and no
value is invented. The open Bay-4 population is identical to the 2026-10-10 ~18:12 PDT refresh
(same 16 open tasks on the same 10 doors; 8 Occupied / 2 Reserved / 13 Available) and the all-time
closed set is unchanged (4,002 closed), so this refresh ages every task/door duration by the
elapsed interval (~51m) and re-stamps the refresh references.
"""
import json, re, sys, os

snap = json.load(open("src/lib/wise_snapshot.json"))
prev = json.load(open(os.environ.get("PREV_SNAPSHOT", "/tmp/wise_snapshot.prev.json")))

ISO_OLD = "2026-10-11T01:12:49Z"
ISO_NEW = snap["snapshotUtc"]                                    # 2026-10-11T02:04:02Z
STAMP_OLD = "~18:12 PDT"
STAMP_NEW = "~" + snap["refreshStampLA"].split("~")[-1]          # ~19:04 PDT
PRIOR_OLD = "~16:18 PDT"                                         # prior refresh's stamp
PRIOR_NEW = STAMP_OLD                                            # becomes the new "prior" stamp
SENT = "\u0001PRIORSTAMP\u0001"

# ── 1. Build the old->new duration map from the two snapshots (by door name / task id) ──
durmap, conflicts = {}, []


def add(old, new):
    if old is None or new is None or old == new:
        return
    if old in durmap and durmap[old] != new:
        conflicts.append((old, durmap[old], new))
    durmap[old] = new


for o, n in zip(prev["doors"], snap["doors"]):
    assert o["door"] == n["door"]
    add(o["duration"], n["duration"])

def find_dur(s):
    m = re.search(r"\d+d \d+h \d+m", s or "")
    return m.group(0) if m else None

for o, n in zip(prev["assignments"], snap["assignments"]):
    assert o["taskId"] == n["taskId"]
    add(find_dur(o["pieces"]), find_dur(n["pieces"]))

for o, n in zip(prev["arnulfo"]["tasks"], snap["arnulfo"]["tasks"]):
    assert o["taskId"] == n["taskId"]
    add(find_dur(o["note"]), find_dur(n["note"]))

assert not conflicts, f"non-1:1 duration map: {conflicts}"
durpat = re.compile("|".join(re.escape(k) for k in sorted(durmap, key=len, reverse=True)))
print(f"duration map ({len(durmap)} entries): {json.dumps(durmap, ensure_ascii=False)}")

report = {"iso": 0, "stamp": 0, "prior": 0, "dur": 0}


def reindex(t):
    """Bump the refresh timeline by one step, protecting prior-reference stamps."""
    n_iso = t.count(ISO_OLD); t = t.replace(ISO_OLD, ISO_NEW)
    t = t.replace(PRIOR_OLD, SENT)
    n_stamp = t.count(STAMP_OLD); t = t.replace(STAMP_OLD, STAMP_NEW)
    n_prior = t.count(SENT); t = t.replace(SENT, PRIOR_NEW)
    report["iso"] += n_iso; report["stamp"] += n_stamp; report["prior"] += n_prior
    return t


def age_durations(t):
    def repl(m):
        report["dur"] += 1
        return durmap[m.group(0)]
    return durpat.sub(repl, t)


for path in ("src/lib/data.ts", "src/app/page.tsx"):
    t = open(path, encoding="utf-8").read()
    t = age_durations(reindex(t))
    open(path, "w", encoding="utf-8").write(t)

print("report:", json.dumps(report))

# ── 2. Integrity checks: rendered figures must reconcile to the fresh snapshot ──
data_t = open("src/lib/data.ts", encoding="utf-8").read()
page_t = open("src/app/page.tsx", encoding="utf-8").read()
occ = len(re.findall(r'^  \{ door: "DOCK\d+", status: "Occupied"', data_t, re.M))
res = len(re.findall(r'^  \{ door: "DOCK\d+", status: "Reserved"', data_t, re.M))
tot = len(re.findall(r'^  \{ door: "DOCK\d+", status: "', data_t, re.M))
checks = {
    "occupied_matches": occ == snap["kpi"]["occupied"],
    "reserved_matches": res == snap["kpi"]["reserved"],
    "doors_total": tot == 23,
    "stale_iso_gone": ISO_OLD not in data_t and ISO_OLD not in page_t,
    "new_iso_present": ISO_NEW in data_t and ISO_NEW in page_t,
    "no_write_sentinels": SENT not in data_t and SENT not in page_t,
    "old_durations_gone": all(d not in data_t and d not in page_t for d in durmap),
    "door_durations_fresh": all(
        (d["duration"] is None) or
        (re.search(r'\{ door: "%s".*duration: "%s"' % (d["door"], re.escape(d["duration"])), data_t) is not None)
        for d in snap["doors"]),
}
print("checks:", json.dumps(checks))
assert all(checks.values()), checks
sys.exit(0)
