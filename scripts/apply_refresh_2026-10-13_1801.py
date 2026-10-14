#!/usr/bin/env python3
r"""Apply the 2026-10-13 ~18:01 PDT WISE/WMS refresh to src/app/page.tsx prose.

Source of truth = src/lib/wise_snapshot.json (written by scripts/snapshot.py at
2026-10-14T01:01:42Z / 2026-10-13 ~18:01 PDT). src/lib/data.ts was rewritten from the same
snapshot by scripts/gen_data.py. Prior refresh = the committed 2026-10-13 ~12:23 PDT snapshot
(2026-10-13T19:23:47Z).

Only prose values that changed are rewritten; the visual layout is untouched and no value is
invented. Every anchored replacement must match exactly once.
"""
import json, sys

snap = json.load(open("src/lib/wise_snapshot.json"))
assert snap["snapshotUtc"] == "2026-10-14T01:01:42Z", snap["snapshotUtc"]
assert snap["refreshStampLA"] == "Oct 13 ~18:01 PDT", snap["refreshStampLA"]
kpi = snap["kpi"]; mix = snap["mix"]; sch = snap["schedule"]; allt = snap["allTime"]
assert (kpi["occupied"], kpi["reserved"], kpi["available"], kpi["withTasks"]) == (8, 5, 10, 13)
assert (mix["outbound"], mix["inbound"], mix["total"]) == (9, 7, 16)
assert sch["inboundOrders"] == 28 and sch["outboundOrders"] == 93
assert sch["inboundReceived"] == 10 and sch["outboundLoaded"] == 80
assert allt["closedTotal"] == 4046 and allt["load"] == 2970 and allt["receive"] == 1076

p = open("src/app/page.tsx", encoding="utf-8").read()

REPL = [
 # ── Assigned-Activity banner: the two date stamps ──
 (r"""recomputed in this refresh</strong> from a full row-level rescan (2026-10-13 ~12:23 PDT). Below is the current live snapshot (2026-10-13 ~12:23 PDT).""",
  r"""recomputed in this refresh</strong> from a full row-level rescan (2026-10-13 ~18:01 PDT). Below is the current live snapshot (2026-10-13 ~18:01 PDT)."""),

 # ── Data Notes bullet 1: door utilization + occupied/reserved sets ──
 (r"""<strong className="text-[#f4f4f6]">8 Occupied / 1 Reserved / 14 Available / 2 anomalies</strong> — door utilization is task-derived at the 2026-10-13 ~12:23 PDT snapshot: 8 doors with an in-progress open task (DOCK50, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK68, DOCK69), 1 door holding only not-started NEW task(s) (DOCK55), 14 doors with no open load/receive task. 9 doors carry an active assignment (39.1% of the bay).""",
  r"""<strong className="text-[#f4f4f6]">8 Occupied / 5 Reserved / 10 Available / 2 anomalies</strong> — door utilization is task-derived at the 2026-10-13 ~18:01 PDT snapshot: 8 doors with an in-progress open task (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK62), 5 doors holding only not-started NEW task(s) (DOCK55, DOCK58, DOCK60, DOCK65, DOCK69), 10 doors with no open load/receive task. 13 doors carry an active assignment (56.5% of the bay)."""),

 # ── Data Notes bullet 1: Location-API cross-check ──
 (r"""field reports 12 Bay-4 doors OCCUPIED / 2 RESERVED / 9 AVAILABLE (its <code>spaceStatus</code> reports 11 OCCUPIED / 12 EMPTY). It is driven by trailer check-in state rather than by open dock work and <strong className="text-[#f4f4f6]">diverges materially</strong> from task-derived status (8 vs 12).""",
  r"""field reports 14 Bay-4 doors OCCUPIED / 2 RESERVED / 7 AVAILABLE (its <code>spaceStatus</code> reports 11 OCCUPIED / 12 EMPTY). It is driven by trailer check-in state rather than by open dock work and <strong className="text-[#f4f4f6]">diverges materially</strong> from task-derived status (8 vs 14)."""),

 # ── Data Notes bullet 2: inbound vs outbound mix ──
 (r"""Open tasks: <strong className="text-[#7c3aed]">5 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">7 inbound (RECEIVE)</strong> = 12 at ~12:23 PDT. 41.7% outbound / 58.3% inbound.""",
  r"""Open tasks: <strong className="text-[#7c3aed]">9 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">7 inbound (RECEIVE)</strong> = 16 at ~18:01 PDT. 56.3% outbound / 43.8% inbound."""),

 # ── Data Notes bullet 3: customer mix + task status ──
 (r"""<strong className="text-[#7c3aed]">Customer mix:</strong> 10 of the 12 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 83.3%; the remaining 2 are KARAKA, LLC (ORG-585450) — 16.7%. Task status: 10 IN_PROGRESS + 2 NEW.""",
  r"""<strong className="text-[#7c3aed]">Customer mix:</strong> 14 of the 16 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 87.5%; the remaining 2 are KARAKA, LLC (ORG-585450) — 12.5%. Task status: 11 IN_PROGRESS + 5 NEW."""),

 # ── Data Notes bullet 4: DOCK50 severe anomaly ──
 (r"""<strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 356d 23h 2m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 also carries TASK-5391985 (RECEIVE, IN_PROGRESS 1d 1h 4m, KARAKA, ARNULFO MUNGUIA). Investigate immediately.""",
  r"""<strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 357d 4h 40m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 also carries TASK-5391985 (RECEIVE, IN_PROGRESS 1d 6h 42m, KARAKA, ARNULFO MUNGUIA) and TASK-5393541 (LOAD, IN_PROGRESS 4h 46m, GURUNANDA, ARNULFO MUNGUIA). Investigate immediately."""),

 # ── Data Notes bullet 5: DOCK54 anomaly + prior-ref stamp ──
 (r"""<strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 66d 19h 54m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — and is again the only open task on that door. The stale task is still assigned to ARNULFO MUNGUIA; it is unchanged in nature since the prior 2026-10-13 ~10:18 PDT refresh, other than continuing to age.""",
  r"""<strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 67d 1h 32m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — and the door now also carries TASK-5393866 (LOAD, IN_PROGRESS 1h 21m, EDUARDO MEJIA). The stale task is still assigned to ARNULFO MUNGUIA; it is unchanged in nature since the prior 2026-10-13 ~12:23 PDT refresh, other than continuing to age."""),

 # ── Data Notes bullet 6: single tight sweep + open-set delta ──
 (r"""all current-state figures on this page come from one self-consistent sweep at 2026-10-13T19:23:47Z (2026-10-13 ~12:23 PDT). Note: one door (DOCK55) holds only a not-started NEW task, so Reserved = 1 of 23; the occupied set is 8 doors (DOCK50, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK68, DOCK69). Since the prior 2026-10-13 ~10:18 PDT refresh the open set changed: five tasks left the open set (TASK-5392750 DOCK53; TASK-5392392 DOCK51; TASK-5392591 DOCK55; TASK-5392484 DOCK54; TASK-5393135 DOCK56) and two entered (TASK-5393281 DOCK55; TASK-5393377 DOCK56), so the open population now spans 9 doors (8 occupied + 1 reserved) while totalling 12 open tasks.""",
  r"""all current-state figures on this page come from one self-consistent sweep at 2026-10-14T01:01:42Z (2026-10-13 ~18:01 PDT). Note: five doors (DOCK55, DOCK58, DOCK60, DOCK65, DOCK69) hold only not-started NEW tasks, so Reserved = 5 of 23; the occupied set is 8 doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK62). Since the prior 2026-10-13 ~12:23 PDT refresh the open set changed: three tasks left the open set (TASK-5392303 DOCK68; TASK-5393377 DOCK56; TASK-5392733 DOCK69) and seven entered (TASK-5393782 DOCK51; TASK-5393866 DOCK54; TASK-5393915 DOCK60; TASK-5393820 DOCK62; TASK-5393541 DOCK50; TASK-5393812 DOCK58; TASK-5393821 DOCK65), so the open population now spans 13 doors (8 occupied + 5 reserved) while totalling 16 open tasks."""),

 # ── Data Notes bullet 7: schedule day window size ──
 (r"""an OPERATING day carrying <strong className="text-[#f4f4f6]">28 inbound receipts</strong> and <strong className="text-[#f4f4f6]">94 outbound loads</strong> in its appointment window.""",
  r"""an OPERATING day carrying <strong className="text-[#f4f4f6]">28 inbound receipts</strong> and <strong className="text-[#f4f4f6]">93 outbound loads</strong> in its appointment window."""),

 # ── Data Notes bullet 7: % scheduled inbounds received ──
 (r"""<strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 14.3%</strong> (4 of 28 receipts received)""",
  r"""<strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 35.7%</strong> (10 of 28 receipts received)"""),

 # ── Data Notes bullet 7: % scheduled outbounds loaded ──
 (r"""<strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = 33.0%</strong> (31 of 94 loads loaded/shipped).""",
  r"""<strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = 86.0%</strong> (80 of 93 loads loaded/shipped)."""),

 # ── Data Notes bullet 7: day status composition ──
 (r"""Day status composition: loads — 42 NEW / 12 WINDOW_CHECKIN_DONE / 9 LOADING / 6 LOADED / 25 SHIPPED; receipts — 9 IMPORTED / 7 OPEN / 7 IN_PROGRESS / 1 EXCEPTION / 4 CLOSED.""",
  r"""Day status composition: loads — 12 NEW / 1 LOADING / 7 LOADED / 73 SHIPPED; receipts — 5 IMPORTED / 4 OPEN / 8 IN_PROGRESS / 2 EXCEPTION / 8 CLOSED / 1 REOPENED."""),

 # ── Data Notes bullet 8: all-time rescan reconciliation ──
 (r"""come from a full row-level rescan performed in this refresh — 23 doors × 2 task types (2,968 LOAD + 1,074 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-13 ~10:18 PDT rescan (4,037 closed / 2,963 LOAD / 1,074 RECEIVE) to 4,042 closed / 2,968 LOAD / 1,074 RECEIVE (+5 closed in the interval).""",
  r"""come from a full row-level rescan performed in this refresh — 23 doors × 2 task types (2,970 LOAD + 1,076 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-13 ~12:23 PDT rescan (4,042 closed / 2,968 LOAD / 1,074 RECEIVE) to 4,046 closed / 2,970 LOAD / 1,076 RECEIVE (+4 closed in the interval)."""),

 # ── Data Notes bullet 10: timestamp basis ──
 (r"""task timestamps are read on the same UTC frame as the snapshot instant (2026-10-13T19:23:47Z). Query window 2026-10-13T19:23:47Z → 2026-10-13T19:23:47Z.""",
  r"""task timestamps are read on the same UTC frame as the snapshot instant (2026-10-14T01:01:42Z). Query window 2026-10-14T01:01:42Z → 2026-10-14T01:01:42Z."""),

 # ── Data Notes bullet 12: Arnulfo identity caveat (open-task count) ──
 (r"""verified on all 3 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot; and on 100% of the closed Bay-4 rows carrying that name.""",
  r"""verified on all 4 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot; and on 100% of the closed Bay-4 rows carrying that name."""),

 # ── Data Notes bullet 13: closing line ──
 (r"""Core live metrics sourced from live WISE/WMS queries — Tuesday 2026-10-13 ~12:23 PDT (UTC snapshot 2026-10-13T19:23:47Z).""",
  r"""Core live metrics sourced from live WISE/WMS queries — Tuesday 2026-10-13 ~18:01 PDT (UTC snapshot 2026-10-14T01:01:42Z)."""),

 # ── Footer stamp ──
 (r"""<span>Last refreshed: {refreshDateLong} ~12:23 PDT</span>""",
  r"""<span>Last refreshed: {refreshDateLong} ~18:01 PDT</span>"""),
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
    "old_iso_gone": "2026-10-13T19:23:47Z" not in both,
    "new_iso_in_data": "2026-10-14T01:01:42Z" in d,
    "new_iso_in_page": "2026-10-14T01:01:42Z" in p,
    # "~10:18 PDT" (prior-previous refresh) must be fully gone now
    "old_prev_stamp_gone": "~10:18 PDT" not in both,
    # "~12:23 PDT" may survive only as the three prose references to the PRIOR refresh
    "prior_stamp_only_as_prior_ref": (both.count("~12:23 PDT") == 3
                                      and both.count("prior 2026-10-13 ~12:23 PDT") == 3
                                      and "~12:23 PDT" not in d),
    "page_new_stamp": p.count("~18:01 PDT") >= 6,
    "occ_row": p.count("8 Occupied / 5 Reserved / 10 Available") == 1,
    "kpi_withtasks": "13 doors carry an active assignment (56.5% of the bay)" in p,
    "loc_api_crosscheck": "(8 vs 14)" in p,
    "mix_counts": d.count("count: 9, total: 16") == 2 and d.count("count: 7, total: 16") == 2,
    "mix_banner": "9 outbound (LOAD)</strong> / <strong className=\"text-[#22c55e]\">7 inbound (RECEIVE)</strong> = 16" in p,
    "sched_inbound_28": "scheduledInboundOrders = 28;" in d,
    "sched_outbound_93": "scheduledOutboundOrders = 93;" in d,
    "pct_inbound_35p7": "pctScheduledInboundReceived = 35.714285714285715;" in d and "% Scheduled Inbounds Received = 35.7%" in p,
    "pct_outbound_86": "scheduledOutboundLoaded = 80;" in d and "% Scheduled Outbounds Loaded = 86.0%" in p,
    "alltime_total": "allTimeClosedTotal = 4046;" in d and allt["closedTotal"] == 4046,
    "alltime_distinct": "allTimeDistinctAssignees = 84;" in d,
    "guru_980": "guruArnulfoAllTimeTotal = 980;" in d,
    "facility_open": "facilityOpenLoad = 40;" in d and "facilityOpenReceive = 83;" in d,
    "door_durations": all(
        (x["duration"] is None) or (f'duration: "{x["duration"]}"' in d) for x in snap["doors"]),
    "assignment_pieces": all(f'pieces: "{a["pieces"]}"' in d for a in snap["assignments"]),
    "arnulfo_rows": all(f'taskId: "{t["taskId"]}"' in d for t in snap["arnulfo"]["tasks"]),
    "arnulfo_counts": ("arnulfoOpenCount = 4;" in d and "arnulfoOpenLoad = 2;" in d
                       and "arnulfoOpenReceive = 2;" in d),
    "arnulfo_caveat": "verified on all 4 open Bay-4 tasks" in p,
    # no stale task ids carried forward from the prior refresh
    "no_stale_tasks": all(t not in d for t in
        ["TASK-5392303", "TASK-5393377", "TASK-5392733"]),
    "new_tasks_present": all(t in d for t in
        ["TASK-5393782", "TASK-5393866", "TASK-5393915", "TASK-5393820",
         "TASK-5393541", "TASK-5393812", "TASK-5393821"]),
    # layout preserved: same section count + title
    "no_layout_change": p.count("<section>") == 7 and "Bay 4 Assignments — Valley View" in p,
}

print("missing anchors:", missing)
print("checks:", json.dumps(checks, indent=2))
assert all(checks.values()), {k: v for k, v in checks.items() if not v}
print("OK — data.ts and page.tsx refreshed to the 2026-10-13 ~18:01 PDT snapshot")
