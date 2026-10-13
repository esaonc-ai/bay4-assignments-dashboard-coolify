#!/usr/bin/env python3
r"""Apply the 2026-10-13 ~12:23 PDT WISE/WMS refresh to src/app/page.tsx prose.

Source of truth = src/lib/wise_snapshot.json (written by scripts/snapshot.py at
2026-10-13T19:23:47Z / 2026-10-13 ~12:23 PDT). src/lib/data.ts was rewritten from the same
snapshot by scripts/gen_data.py. Prior refresh = the committed 2026-10-13 ~10:18 PDT snapshot
(2026-10-13T17:18:36Z).

Only prose values that changed are rewritten; the visual layout is untouched and no value is
invented. Every anchored replacement must match exactly once.
"""
import json, sys

snap = json.load(open("src/lib/wise_snapshot.json"))
assert snap["snapshotUtc"] == "2026-10-13T19:23:47Z", snap["snapshotUtc"]
assert snap["refreshStampLA"] == "Oct 13 ~12:23 PDT", snap["refreshStampLA"]
kpi = snap["kpi"]; mix = snap["mix"]; sch = snap["schedule"]; allt = snap["allTime"]
assert (kpi["occupied"], kpi["reserved"], kpi["available"], kpi["withTasks"]) == (8, 1, 14, 9)
assert (mix["outbound"], mix["inbound"], mix["total"]) == (5, 7, 12)
assert sch["inboundOrders"] == 28 and sch["outboundOrders"] == 94
assert sch["inboundReceived"] == 4 and sch["outboundLoaded"] == 31

p = open("src/app/page.tsx", encoding="utf-8").read()

REPL = [
 # ── Assigned-Activity banner: the two date stamps ──
 (r"""recomputed in this refresh</strong> from a full row-level rescan (2026-10-13 ~10:18 PDT). Below is the current live snapshot (2026-10-13 ~10:18 PDT).""",
  r"""recomputed in this refresh</strong> from a full row-level rescan (2026-10-13 ~12:23 PDT). Below is the current live snapshot (2026-10-13 ~12:23 PDT)."""),

 # ── Data Notes bullet 1: door utilization + occupied set + Location-API cross-check ──
 (r"""<strong className="text-[#f4f4f6]">9 Occupied / 1 Reserved / 13 Available / 2 anomalies</strong> — door utilization is task-derived at the 2026-10-13 ~10:18 PDT snapshot: 9 doors with an in-progress open task (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK68, DOCK69), 1 door holding only not-started NEW task(s) (DOCK55), 13 doors with no open load/receive task. 10 doors carry an active assignment (43.5% of the bay).""",
  r"""<strong className="text-[#f4f4f6]">8 Occupied / 1 Reserved / 14 Available / 2 anomalies</strong> — door utilization is task-derived at the 2026-10-13 ~12:23 PDT snapshot: 8 doors with an in-progress open task (DOCK50, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK68, DOCK69), 1 door holding only not-started NEW task(s) (DOCK55), 14 doors with no open load/receive task. 9 doors carry an active assignment (39.1% of the bay)."""),
 (r"""field reports 16 Bay-4 doors OCCUPIED / 2 RESERVED / 5 AVAILABLE (its <code>spaceStatus</code> reports 11 OCCUPIED / 12 EMPTY). It is driven by trailer check-in state rather than by open dock work and <strong className="text-[#f4f4f6]">diverges materially</strong> from task-derived status (9 vs 16).""",
  r"""field reports 12 Bay-4 doors OCCUPIED / 2 RESERVED / 9 AVAILABLE (its <code>spaceStatus</code> reports 11 OCCUPIED / 12 EMPTY). It is driven by trailer check-in state rather than by open dock work and <strong className="text-[#f4f4f6]">diverges materially</strong> from task-derived status (8 vs 12)."""),

 # ── Data Notes bullet 2: inbound vs outbound mix ──
 (r"""Open tasks: <strong className="text-[#7c3aed]">9 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">6 inbound (RECEIVE)</strong> = 15 at ~10:18 PDT. 60.0% outbound / 40.0% inbound.""",
  r"""Open tasks: <strong className="text-[#7c3aed]">5 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">7 inbound (RECEIVE)</strong> = 12 at ~12:23 PDT. 41.7% outbound / 58.3% inbound."""),

 # ── Data Notes bullet 3: customer mix + task status ──
 (r"""<strong className="text-[#7c3aed]">Customer mix:</strong> 13 of the 15 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 86.7%; the remaining 2 are KARAKA, LLC (ORG-585450) — 13.3%. Task status: 12 IN_PROGRESS + 3 NEW.""",
  r"""<strong className="text-[#7c3aed]">Customer mix:</strong> 10 of the 12 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 83.3%; the remaining 2 are KARAKA, LLC (ORG-585450) — 16.7%. Task status: 10 IN_PROGRESS + 2 NEW."""),

 # ── Data Notes bullet 4: DOCK50 severe anomaly duration ──
 (r"""<strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 356d 20h 57m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 also carries TASK-5391985 (RECEIVE, IN_PROGRESS 22h 59m, KARAKA, ARNULFO MUNGUIA). Investigate immediately.""",
  r"""<strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 356d 23h 2m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 also carries TASK-5391985 (RECEIVE, IN_PROGRESS 1d 1h 4m, KARAKA, ARNULFO MUNGUIA). Investigate immediately."""),

 # ── Data Notes bullet 5: DOCK54 anomaly duration + prior-ref stamp ──
 (r"""<strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 66d 17h 49m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — and the door now also carries TASK-5392484 (LOAD, IN_PROGRESS 19h 10m, DANIEL BELTRAN). The stale task is still assigned to ARNULFO MUNGUIA; it is unchanged in nature since the prior 2026-10-12 ~12:52 PDT refresh, other than continuing to age.""",
  r"""<strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 66d 19h 54m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — and is again the only open task on that door. The stale task is still assigned to ARNULFO MUNGUIA; it is unchanged in nature since the prior 2026-10-13 ~10:18 PDT refresh, other than continuing to age."""),

 # ── Data Notes bullet 6: single tight sweep + open-set delta ──
 (r"""all current-state figures on this page come from one self-consistent sweep at 2026-10-13T17:18:36Z (2026-10-13 ~10:18 PDT). Note: one door (DOCK55) holds only a not-started NEW task, so Reserved = 1 of 23; the occupied set is 9 doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK68, DOCK69). Since the prior 2026-10-12 ~12:52 PDT refresh the open set changed: eleven tasks left the open set (TASK-5389422 DOCK53; TASK-5392209 DOCK53; TASK-5381268 DOCK51; TASK-5391752 DOCK52; TASK-5392027 DOCK55; TASK-5391754 DOCK60; TASK-5392159 DOCK60; TASK-5389467 DOCK50; TASK-5390717 DOCK50; TASK-5391890 DOCK50; TASK-5390995 DOCK58) and ten entered (TASK-5392750 DOCK53; TASK-5392392 DOCK51; TASK-5392751 DOCK52; TASK-5392591 DOCK55; TASK-5392753 DOCK57; TASK-5392484 DOCK54; TASK-5392303 DOCK68; TASK-5392752 DOCK56; TASK-5393135 DOCK56; TASK-5392733 DOCK69), so the open population now spans 10 doors (9 occupied + 1 reserved) while totalling 15 open tasks.""",
  r"""all current-state figures on this page come from one self-consistent sweep at 2026-10-13T19:23:47Z (2026-10-13 ~12:23 PDT). Note: one door (DOCK55) holds only a not-started NEW task, so Reserved = 1 of 23; the occupied set is 8 doors (DOCK50, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK68, DOCK69). Since the prior 2026-10-13 ~10:18 PDT refresh the open set changed: five tasks left the open set (TASK-5392750 DOCK53; TASK-5392392 DOCK51; TASK-5392591 DOCK55; TASK-5392484 DOCK54; TASK-5393135 DOCK56) and two entered (TASK-5393281 DOCK55; TASK-5393377 DOCK56), so the open population now spans 9 doors (8 occupied + 1 reserved) while totalling 12 open tasks."""),

 # ── Data Notes bullet 7: schedule % (operating day) ──
 (r"""an OPERATING day carrying <strong className="text-[#f4f4f6]">25 inbound receipts</strong> and <strong className="text-[#f4f4f6]">88 outbound loads</strong> in its appointment window.""",
  r"""an OPERATING day carrying <strong className="text-[#f4f4f6]">28 inbound receipts</strong> and <strong className="text-[#f4f4f6]">94 outbound loads</strong> in its appointment window."""),
 (r"""<strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 8.0%</strong> (2 of 25 receipts received)""",
  r"""<strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 14.3%</strong> (4 of 28 receipts received)"""),
 (r"""<strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = 19.3%</strong> (17 of 88 loads loaded/shipped).""",
  r"""<strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = 33.0%</strong> (31 of 94 loads loaded/shipped)."""),
 (r"""Day status composition: loads — 52 NEW / 15 WINDOW_CHECKIN_DONE / 4 LOADING / 4 LOADED / 13 SHIPPED; receipts — 9 IMPORTED / 9 OPEN / 4 IN_PROGRESS / 1 EXCEPTION / 2 CLOSED.""",
  r"""Day status composition: loads — 42 NEW / 12 WINDOW_CHECKIN_DONE / 9 LOADING / 6 LOADED / 25 SHIPPED; receipts — 9 IMPORTED / 7 OPEN / 7 IN_PROGRESS / 1 EXCEPTION / 4 CLOSED."""),

 # ── Data Notes bullet 8: all-time rescan reconciliation ──
 (r"""23 doors × 2 task types (2,963 LOAD + 1,074 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-12 ~12:52 PDT rescan (4,017 closed / 2,950 LOAD / 1,067 RECEIVE) to 4,037 closed / 2,963 LOAD / 1,074 RECEIVE (+20 closed in the interval).""",
  r"""23 doors × 2 task types (2,968 LOAD + 1,074 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-13 ~10:18 PDT rescan (4,037 closed / 2,963 LOAD / 1,074 RECEIVE) to 4,042 closed / 2,968 LOAD / 1,074 RECEIVE (+5 closed in the interval)."""),

 # ── Data Notes bullet 10: timestamp basis ──
 (r"""task timestamps are read on the same UTC frame as the snapshot instant (2026-10-13T17:18:36Z). Query window 2026-10-13T17:18:36Z → 2026-10-13T17:18:36Z.""",
  r"""task timestamps are read on the same UTC frame as the snapshot instant (2026-10-13T19:23:47Z). Query window 2026-10-13T19:23:47Z → 2026-10-13T19:23:47Z."""),

 # ── Data Notes bullet 12: Arnulfo identity caveat (open-task count) ──
 (r"""verified on all 2 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot; and on 100% of the closed Bay-4 rows carrying that name.""",
  r"""verified on all 3 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot; and on 100% of the closed Bay-4 rows carrying that name."""),

 # ── Data Notes bullet 13: closing line ──
 (r"""Core live metrics sourced from live WISE/WMS queries — Tuesday 2026-10-13 ~10:18 PDT (UTC snapshot 2026-10-13T17:18:36Z).""",
  r"""Core live metrics sourced from live WISE/WMS queries — Tuesday 2026-10-13 ~12:23 PDT (UTC snapshot 2026-10-13T19:23:47Z)."""),

 # ── Footer stamp ──
 (r"""<span>Last refreshed: {refreshDateLong} ~10:18 PDT</span>""",
  r"""<span>Last refreshed: {refreshDateLong} ~12:23 PDT</span>"""),
]

missing = []
for old, new in REPL:
    c = p.count(old)
    if c == 1:
        p = p.replace(old, new, 1)
    else:
        missing.append((c, old[:110]))

open("src/app/page.tsx", "w", encoding="utf-8").write(p)

# ── integrity checks ──
d = open("src/lib/data.ts", encoding="utf-8").read()
both = d + p
checks = {
    "no_missing_anchors": not missing,
    "old_iso_gone": "2026-10-13T17:18:36Z" not in both,
    "new_iso_in_data": "2026-10-13T19:23:47Z" in d,
    "new_iso_in_page": "2026-10-13T19:23:47Z" in p,
    # "~10:18 PDT" may survive only as the three prose references to the PRIOR refresh
    # (all prefixed "prior 2026-10-13"), never as a current stamp and never in data.ts.
    "old_stamp_only_as_prior_ref": (both.count("~10:18 PDT") == 3
                                    and both.count("prior 2026-10-13 ~10:18 PDT") == 3
                                    and "~10:18 PDT" not in d),
    "page_new_stamp": p.count("~12:23 PDT") >= 6,
    "occ_8": p.count("8 Occupied / 1 Reserved / 14 Available") == 1,
    "kpi_withtasks": "9 doors carry an active assignment (39.1% of the bay)" in p,
    "loc_api_crosscheck": "(8 vs 12)" in p,
    "mix_counts": d.count("count: 5, total: 12") == 2 and d.count("count: 7, total: 12") == 2,
    "mix_banner": "5 outbound (LOAD)</strong> / <strong className=\"text-[#22c55e]\">7 inbound (RECEIVE)</strong> = 12" in p,
    "sched_inbound_28": "scheduledInboundOrders = 28;" in d,
    "sched_outbound_94": "scheduledOutboundOrders = 94;" in d,
    "pct_inbound_14p3": "pctScheduledInboundReceived = 14.285714285714285;" in d and "% Scheduled Inbounds Received = 14.3%" in p,
    "pct_outbound_33": "scheduledOutboundLoaded = 31;" in d and "% Scheduled Outbounds Loaded = 33.0%" in p,
    "alltime_total": "allTimeClosedTotal = 4042;" in d and allt["closedTotal"] == 4042,
    "alltime_distinct": "allTimeDistinctAssignees = 84;" in d,
    "guru_980": "guruArnulfoAllTimeTotal = 980;" in d,
    "facility_open": "facilityOpenLoad = 41;" in d and "facilityOpenReceive = 87;" in d,
    "door_durations": all(
        (x["duration"] is None) or (f'duration: "{x["duration"]}"' in d) for x in snap["doors"]),
    "assignment_pieces": all(f'pieces: "{a["pieces"]}"' in d for a in snap["assignments"]),
    "arnulfo_rows": all(f'taskId: "{t["taskId"]}"' in d for t in snap["arnulfo"]["tasks"]),
    "arnulfo_counts": ("arnulfoOpenCount = 3;" in d and "arnulfoOpenLoad = 1;" in d
                       and "arnulfoOpenReceive = 2;" in d),
    "arnulfo_caveat": "verified on all 3 open Bay-4 tasks" in p,
    # no stale task ids carried forward from the prior refresh
    "no_stale_tasks": all(t not in d for t in
        ["TASK-5392750", "TASK-5392392", "TASK-5392591", "TASK-5392484", "TASK-5393135"]),
    "new_tasks_present": all(t in d for t in ["TASK-5393281", "TASK-5393377"]),
    # layout preserved: same section count + title
    "no_layout_change": p.count("<section>") == 7 and "Bay 4 Assignments — Valley View" in p,
}

print("missing anchors:", missing)
print("checks:", json.dumps(checks, indent=2))
assert all(checks.values()), {k: v for k, v in checks.items() if not v}
print("OK — data.ts and page.tsx refreshed to the 2026-10-13 ~12:23 PDT snapshot")
