#!/usr/bin/env python3
r"""Verify the 2026-10-13 ~12:23 PDT WISE/WMS refresh.

Source of truth = src/lib/wise_snapshot.json (written by scripts/snapshot.py at
2026-10-13T19:23:47Z / 2026-10-13 ~12:23 PDT). This script asserts that the rendered source
(src/lib/data.ts + src/app/page.tsx) matches the snapshot and carries no stale values from the
prior 2026-10-13 ~10:18 PDT refresh. It mutates nothing.
"""
import json

snap = json.load(open("src/lib/wise_snapshot.json"))
assert snap["snapshotUtc"] == "2026-10-13T19:23:47Z", snap["snapshotUtc"]
assert snap["refreshStampLA"] == "Oct 13 ~12:23 PDT", snap["refreshStampLA"]
assert snap["refreshDateLong"] == "October 13, 2026"
assert snap["bootDay"] == "2026-10-13"

d = open("src/lib/data.ts", encoding="utf-8").read()
p = open("src/app/page.tsx", encoding="utf-8").read()
both = d + p

kpi = snap["kpi"]; allt = snap["allTime"]; guru = snap["guruArnulfo"]
sch = snap["schedule"]; mix = snap["mix"]; arn = snap["arnulfo"]; fac = snap["facilityOpen"]

checks = {
    # ── snapshot instant / stamps ──
    "new_iso_in_data": "2026-10-13T19:23:47Z" in d,
    "new_iso_in_page": "2026-10-13T19:23:47Z" in p,
    "new_stamp_in_data": 'refreshStamp = "Oct 13 ~12:23 PDT"' in d,
    "old_iso_gone": "2026-10-13T17:18:36Z" not in both,
    "old_stamp_only_as_prior_ref": both.count("~10:18 PDT") == 3,
    "prior_ref_wording": both.count("prior 2026-10-13 ~10:18 PDT") == 3,

    # ── KPI / doors ──
    "occ_8_avail_14": kpi["occupied"] == 8 and kpi["available"] == 14 and kpi["reserved"] == 1,
    "kpi_row": p.count("8 Occupied / 1 Reserved / 14 Available") == 1,
    "kpi_withtasks": kpi["withTasks"] == 9 and "9 doors carry an active assignment (39.1% of the bay)" in p,
    "all_doors_present": all(f'door: "{x["door"]}"' in d for x in snap["doors"]),
    "door_durations": all(
        (x["duration"] is None) or (f'duration: "{x["duration"]}"' in d) for x in snap["doors"]),

    # ── assignees / mix ──
    "assignee_rows": all(
        f'{{ name: "{a["name"]}", taskCount: {a["taskCount"]} }}' in d for a in snap["assigneeSummaries"]),
    "mix_counts": (d.count(f'{{ label: "Outbound", count: {mix["outbound"]}, total: {mix["total"]} }}') == 2
                   and d.count(f'{{ label: "Inbound", count: {mix["inbound"]}, total: {mix["total"]} }}') == 2),
    "mix_banner": "5 outbound (LOAD)</strong> / <strong className=\"text-[#22c55e]\">7 inbound (RECEIVE)</strong> = 12" in p,

    # ── all-time ──
    "alltime_total": f"allTimeClosedTotal = {allt['closedTotal']};" in d and allt["closedTotal"] == 4042,
    "alltime_distinct": f"allTimeDistinctAssignees = {allt['distinct']};" in d and allt["distinct"] == 84,
    "alltime_top": all(f'{{ name: "{t["name"]}", taskCount: {t["count"]} }}' in d for t in allt["top"]),
    "guru_totals": (f"guruArnulfoAllTimeTotal = {guru['total']};" in d
                    and f"guruArnulfoAllTimeLoad = {guru['load']};" in d
                    and f"guruArnulfoAllTimeReceive = {guru['receive']};" in d
                    and guru["total"] == 980),

    # ── schedule ──
    "sched_inbound": f"scheduledInboundOrders = {sch['inboundOrders']};" in d and sch["inboundOrders"] == 28,
    "sched_outbound": f"scheduledOutboundOrders = {sch['outboundOrders']};" in d and sch["outboundOrders"] == 94,
    "sched_recv": f"scheduledInboundReceived = {sch['inboundReceived']};" in d,
    "sched_loaded": f"scheduledOutboundLoaded = {sch['outboundLoaded']};" in d,
    "pct_inbound_14p3": "% Scheduled Inbounds Received = 14.3%" in p,
    "pct_outbound_33": "% Scheduled Outbounds Loaded = 33.0%" in p,
    "sched_day": "Tuesday 2026-10-13" in p,

    # ── facility sweep ──
    "facility_open": (f"facilityOpenLoad = {fac['load']};" in d and f"facilityOpenReceive = {fac['receive']};" in d),

    # ── assignments + Arnulfo section ──
    "assignment_rows": all(f'taskId: "{a["taskId"]}"' in d for a in snap["assignments"]),
    "assignment_pieces": all(f'pieces: "{a["pieces"]}"' in d for a in snap["assignments"]),
    "arnulfo_rows": all(f'taskId: "{t["taskId"]}"' in d for t in arn["tasks"]),
    "arnulfo_counts": (f"arnulfoOpenCount = {arn['count']};" in d and f"arnulfoOpenLoad = {arn['load']};" in d
                       and f"arnulfoOpenReceive = {arn['receive']};" in d and arn["count"] == 3),
    "arnulfo_caveat": "verified on all 3 open Bay-4 tasks" in p,

    # ── no stale task ids / rows carried forward ──
    "no_stale_tasks": all(t not in d for t in
        ["TASK-5392750", "TASK-5392392", "TASK-5392591", "TASK-5392484", "TASK-5393135"]),
    "new_tasks_present": all(t in d for t in ["TASK-5393281", "TASK-5393377"]),
    # retained across both refreshes
    "retained_tasks": all(t in d for t in ["TASK-5338695", "TASK-5090739", "TASK-5391985",
                                           "TASK-5381972", "TASK-5389637", "TASK-5392751",
                                           "TASK-5392753", "TASK-5392303", "TASK-5392752",
                                           "TASK-5392733"]),

    # ── layout preserved ──
    "no_layout_change": p.count("<section>") == 7 and "Bay 4 Assignments — Valley View" in p,
}

print(json.dumps(checks, indent=2))
bad = {k: v for k, v in checks.items() if not v}
assert not bad, f"FAILED: {bad}"
print("OK — data.ts and page.tsx are consistent with the 2026-10-13 ~12:23 PDT snapshot")
