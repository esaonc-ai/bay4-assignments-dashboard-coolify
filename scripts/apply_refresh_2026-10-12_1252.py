#!/usr/bin/env python3
r"""Apply the 2026-10-12 ~12:52 PDT WISE/WMS refresh to src/app/page.tsx prose.

Source of truth = src/lib/wise_snapshot.json (written by scripts/snapshot.py at
2026-10-12T19:52:34Z / 2026-10-12 ~12:52 PDT). src/lib/data.ts was rewritten from the same
snapshot. Prior refresh = the committed 2026-10-12 ~08:04 PDT snapshot (2026-10-12T15:04:50Z).

Only prose values that changed are rewritten; the visual layout is untouched and no value is
invented. Every anchored replacement must match exactly once.
"""
import json, sys

snap = json.load(open("src/lib/wise_snapshot.json"))
assert snap["snapshotUtc"] == "2026-10-12T19:52:34Z", snap["snapshotUtc"]
assert snap["refreshStampLA"] == "Oct 12 ~12:52 PDT", snap["refreshStampLA"]
sch = snap["schedule"]
assert sch["inboundOrders"] == 40 and sch["outboundOrders"] == 132
assert sch["inboundReceived"] == 3 and sch["outboundLoaded"] == 41

p = open("src/app/page.tsx", encoding="utf-8").read()

REPL = [
 # ── Assigned-Activity interpretation banner: rewrite the two date stamps ──
 (r"""recomputed in this refresh</strong> from a full row-level rescan (2026-10-12 ~08:04 PDT). Below is the current live snapshot (2026-10-12 ~08:04 PDT).""",
  r"""recomputed in this refresh</strong> from a full row-level rescan (2026-10-12 ~12:52 PDT). Below is the current live snapshot (2026-10-12 ~12:52 PDT)."""),

 # ── Data Notes bullet 1: door utilization + occupied set ──
 (r"""<strong className="text-[#f4f4f6]">9 Occupied / 2 Reserved / 12 Available / 2 anomalies</strong> — door utilization is task-derived at the 2026-10-12 ~08:04 PDT snapshot: 9 doors with an in-progress open task (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK58, DOCK66), 2 doors holding only not-started NEW task(s) (DOCK59, DOCK69), 12 doors with no open load/receive task. 11 doors carry an active assignment (47.8% of the bay).""",
  r"""<strong className="text-[#f4f4f6]">8 Occupied / 1 Reserved / 14 Available / 2 anomalies</strong> — door utilization is task-derived at the 2026-10-12 ~12:52 PDT snapshot: 8 doors with an in-progress open task (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK55, DOCK58, DOCK60), 1 door holding only not-started NEW task(s) (DOCK69), 14 doors with no open load/receive task. 9 doors carry an active assignment (39.1% of the bay)."""),

 # ── Data Notes bullet 1b: Location-API cross-check ──
 (r"""field reports 18 Bay-4 doors OCCUPIED / 1 RESERVED / 4 AVAILABLE (its <code>spaceStatus</code> reports 12 OCCUPIED / 11 EMPTY). It is driven by trailer check-in state rather than by open dock work and <strong className="text-[#f4f4f6]">diverges materially</strong> from task-derived status (9 vs 18).""",
  r"""field reports 14 Bay-4 doors OCCUPIED / 2 RESERVED / 7 AVAILABLE (its <code>spaceStatus</code> reports 11 OCCUPIED / 12 EMPTY). It is driven by trailer check-in state rather than by open dock work and <strong className="text-[#f4f4f6]">diverges materially</strong> from task-derived status (8 vs 14)."""),

 # ── Data Notes bullet 2: inbound vs outbound mix ──
 (r"""<strong className="text-[#7c3aed]">12 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">4 inbound (RECEIVE)</strong> = 16 at ~08:04 PDT. 75.0% outbound / 25.0% inbound.""",
  r"""<strong className="text-[#7c3aed]">8 outbound (LOAD)</strong> / <strong className="text-[#22c55e]">8 inbound (RECEIVE)</strong> = 16 at ~12:52 PDT. 50.0% outbound / 50.0% inbound."""),

 # ── Data Notes bullet 3: customer mix + task status ──
 (r"""<li><strong className="text-[#7c3aed]">Customer mix:</strong> all 16 of the 16 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 100.0%; no non-GURUNANDA customer is present at Bay 4 this refresh. Task status: 14 IN_PROGRESS + 2 NEW.</li>""",
  r"""<li><strong className="text-[#7c3aed]">Customer mix:</strong> 13 of the 16 open Bay-4 tasks are GURUNANDA, LLC (ORG-655875) — 81.3%; the remaining 3 are KARAKA, LLC (ORG-585450) — 18.8%. Task status: 13 IN_PROGRESS + 3 NEW.</li>"""),

 # ── Data Notes bullet 4: DOCK50 severe anomaly durations ──
 (r"""<li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 355d 18h 43m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 still carries TASK-5389467 (LOAD, IN_PROGRESS 3d 22h 57m, ARNULFO MUNGUIA) and TASK-5390717 (LOAD, IN_PROGRESS 2d 20h 26m, ARNULFO MUNGUIA). Investigate immediately.</li>""",
  r"""<li><strong className="text-[#ef4444]">SEVERE ANOMALY — DOCK50 (aging 355d 23h 31m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 still carries TASK-5389467 (LOAD, IN_PROGRESS 4d 3h 44m, ARNULFO MUNGUIA) and TASK-5390717 (LOAD, IN_PROGRESS 3d 1h 14m, ARNULFO MUNGUIA). Investigate immediately.</li>"""),

 # ── Data Notes bullet 5: DOCK54 anomaly duration + prior-ref stamp ──
 (r"""<li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 65d 15h 35m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — and remains the only open task on that door (unchanged since the prior 2026-10-11 ~16:27 PDT refresh). Assigned to ARNULFO MUNGUIA.</li>""",
  r"""<li><strong className="text-[#f59e0b]">ANOMALY — DOCK54 (aging 65d 20h 23m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains IN_PROGRESS — stale — and remains the only open task on that door (unchanged since the prior 2026-10-12 ~08:04 PDT refresh). Assigned to ARNULFO MUNGUIA.</li>"""),

 # ── Data Notes bullet 6: single tight sweep + open-set delta ──
 (r"""<li><strong className="text-[#22c55e]">Single tight sweep:</strong> all current-state figures on this page come from one self-consistent sweep at 2026-10-12T15:04:50Z (2026-10-12 ~08:04 PDT). Note: two doors (DOCK59, DOCK69) hold only a not-started NEW task, so Reserved = 2 of 23; the occupied set is 9 doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK58, DOCK66). Since the prior 2026-10-11 ~16:27 PDT refresh the open set changed: TASK-5389140 (DOCK52, CMPC RECEIVE) closed and TASK-5391614 (DOCK59, LOAD NEW) entered the open set, so the open population now spans 11 doors (9 occupied + 2 reserved) while still totalling 16 open tasks.</li>""",
  r"""<li><strong className="text-[#22c55e]">Single tight sweep:</strong> all current-state figures on this page come from one self-consistent sweep at 2026-10-12T19:52:34Z (2026-10-12 ~12:52 PDT). Note: one door (DOCK69) holds only a not-started NEW task, so Reserved = 1 of 23; the occupied set is 8 doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK55, DOCK58, DOCK60). Since the prior 2026-10-12 ~08:04 PDT refresh the open set changed: seven tasks left the open set (TASK-5389973 DOCK51; TASK-5390984 DOCK52; TASK-5390119 DOCK53; TASK-5390124 DOCK56; TASK-5390129 DOCK57; TASK-5391614 DOCK59; TASK-5390273 DOCK66) and seven entered (TASK-5391890, TASK-5391985 DOCK50; TASK-5391752 DOCK52; TASK-5392209 DOCK53; TASK-5392027 DOCK55; TASK-5392159, TASK-5391754 DOCK60), so the open population now spans 9 doors (8 occupied + 1 reserved) while still totalling 16 open tasks.</li>"""),

 # ── Data Notes bullet 7: schedule % (operating day, rolled forward) ──
 (r"""<li><strong className="text-[#22c55e]">Schedule % REPORTED this refresh (current facility-local day):</strong> the current facility-local day is <strong className="text-[#f4f4f6]">Monday 2026-10-12</strong> — an OPERATING day carrying <strong className="text-[#f4f4f6]">40 inbound receipts</strong> and <strong className="text-[#f4f4f6]">93 outbound loads</strong> in its appointment window. <strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 0.0%</strong> (0 of 40 receipts received) and <strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = 1.1%</strong> (1 of 93 loads loaded/shipped). Binding filters confirmed: <strong className="text-[#f4f4f6]">loads</strong> use <code>appointmentTimePeriod</code> — a BETWEEN that requires exactly two date-time elements, i.e. [&quot;2026-10-12T00:00:00&quot;,&quot;2026-10-12T23:59:59&quot;]; <strong className="text-[#f4f4f6]">receipts</strong> use <code>appointmentTimeFrom</code>/<code>appointmentTimeTo</code>. Day status composition: loads — 80 NEW / 11 WINDOW_CHECKIN_DONE / 1 LOADING / 1 SHIPPED; receipts — 26 IMPORTED / 14 OPEN.</li>""",
  r"""<li><strong className="text-[#22c55e]">Schedule % REPORTED this refresh (current facility-local day):</strong> the current facility-local day is <strong className="text-[#f4f4f6]">Monday 2026-10-12</strong> — an OPERATING day carrying <strong className="text-[#f4f4f6]">40 inbound receipts</strong> and <strong className="text-[#f4f4f6]">132 outbound loads</strong> in its appointment window. <strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 7.5%</strong> (3 of 40 receipts received) and <strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = 31.1%</strong> (41 of 132 loads loaded/shipped). Binding filters confirmed: <strong className="text-[#f4f4f6]">loads</strong> use <code>appointmentTimePeriod</code> — a BETWEEN that requires exactly two date-time elements, i.e. [&quot;2026-10-12T00:00:00&quot;,&quot;2026-10-12T23:59:59&quot;]; <strong className="text-[#f4f4f6]">receipts</strong> use <code>appointmentTimeFrom</code>/<code>appointmentTimeTo</code>. Day status composition: loads — 64 NEW / 13 WINDOW_CHECKIN_DONE / 14 LOADING / 9 LOADED / 32 SHIPPED; receipts — 20 IMPORTED / 8 OPEN / 9 IN_PROGRESS / 3 CLOSED.</li>"""),

 # ── Data Notes bullet 8: all-time rescan reconciliation ──
 (r"""come from a full row-level rescan performed in this refresh — 23 doors × 2 task types (2,936 LOAD + 1,066 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set is unchanged from the prior 2026-10-11 ~16:27 PDT rescan (4,002 closed / 2,936 LOAD / 1,066 RECEIVE — no Bay-4 task closed in the interval).""",
  r"""come from a full row-level rescan performed in this refresh — 23 doors × 2 task types (2,950 LOAD + 1,067 RECEIVE, statuses CLOSED/FORCE_CLOSED). They are fresh, not carried forward: the closed set grew from the prior 2026-10-12 ~08:04 PDT rescan (4,002 closed / 2,936 LOAD / 1,066 RECEIVE) to 4,017 closed / 2,950 LOAD / 1,067 RECEIVE (+15 closed in the interval)."""),

 # ── Data Notes bullet 10: timestamp basis ──
 (r"""task timestamps are read on the same UTC frame as the snapshot instant (2026-10-12T15:04:50Z). Query window 2026-10-12T15:04:50Z → 2026-10-12T15:04:50Z.""",
  r"""task timestamps are read on the same UTC frame as the snapshot instant (2026-10-12T19:52:34Z). Query window 2026-10-12T19:52:34Z → 2026-10-12T19:52:34Z."""),

 # ── Data Notes bullet 12: Arnulfo identity caveat (open-task count) ──
 (r"""verified on all 6 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot; and on 100% of the closed Bay-4 rows carrying that name.""",
  r"""verified on all 10 open Bay-4 tasks assigned to &quot;ARNULFO MUNGUIA&quot; and on 100% of the closed Bay-4 rows carrying that name."""),

 # ── Data Notes bullet 13: guru re-verification stamp ──
 (r"""Core live metrics sourced from live WISE/WMS queries — Monday 2026-10-12 ~08:04 PDT (UTC snapshot 2026-10-12T15:04:50Z).""",
  r"""Core live metrics sourced from live WISE/WMS queries — Monday 2026-10-12 ~12:52 PDT (UTC snapshot 2026-10-12T19:52:34Z)."""),

 # ── Footer stamp ──
 (r"""Last refreshed: {refreshDateLong} ~08:04 PDT""",
  r"""Last refreshed: {refreshDateLong} ~12:52 PDT"""),
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
    "old_iso_gone": "2026-10-12T15:04:50Z" not in both,
    "new_iso_in_data": "2026-10-12T19:52:34Z" in d,
    "new_iso_in_page": "2026-10-12T19:52:34Z" in p,
    "old_stamp_gone": "Oct 12 ~08:04 PDT" not in both,
    "page_new_stamp": p.count("2026-10-12 ~12:52 PDT") == 5,
    "occ_8": p.count("8 Occupied / 1 Reserved / 14 Available") == 1,
    "mix_counts": ('count: 8, total: 16' in d),
    "sched_inbound_40": "scheduledInboundOrders = 40;" in d,
    "sched_outbound_132": "scheduledOutboundOrders = 132;" in d,
    "pct_inbound_7p5": "pctScheduledInboundReceived = 7.5;" in d,
    "pct_loaded_31": "scheduledOutboundLoaded = 41;" in d,
    "facility_open": "facilityOpenLoad = 45;" in d and "facilityOpenReceive = 98;" in d,
    "no_stale_task": all(t not in d for t in ["TASK-5389973", "TASK-5390984", "TASK-5390119", "TASK-5390124", "TASK-5390129", "TASK-5391614", "TASK-5390273"]),
    "new_tasks_present": all(t in d for t in ["TASK-5391890", "TASK-5391985", "TASK-5391752", "TASK-5392209", "TASK-5392027", "TASK-5392159", "TASK-5391754"]),
    "data_door_durations": all(
        (x["duration"] is None) or (f'duration: "{x["duration"]}"' in d) for x in snap["doors"]),
    "data_task_pieces": all(
        (f'pieces: "{a["pieces"]}"' in d) for a in snap["assignments"]),
}
print("missing anchors:", missing)
print("checks:", json.dumps(checks, indent=2))
assert all(checks.values()), checks
print("OK — page.tsx patched")
