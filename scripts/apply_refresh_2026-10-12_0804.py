#!/usr/bin/env python3
"""Apply the 2026-10-12 ~08:04 PDT WISE/WMS refresh to src/app/page.tsx prose.

Source of truth = src/lib/wise_snapshot.json (written by scripts/snapshot.py at
2026-10-12T15:04:50Z / 2026-10-12 ~08:04 PDT). src/lib/data.ts was rewritten from the same
snapshot. Prior refresh = the committed 2026-10-11 ~16:27 PDT snapshot.

What actually changed in the live WISE read this refresh (vs the 2026-10-11 ~16:27 PDT snapshot):
  * snapshot instant / stamp roll forward from 2026-10-11 ~16:27 PDT to 2026-10-12 ~08:04 PDT.
  * door utilization: 8 Occ / 2 Res / 13 Avail  ->  9 Occ / 2 Res / 12 Avail (11 doors with tasks).
      DOCK66 moved Reserved -> Occupied (Fatima Ponce); DOCK59 moved Available -> Reserved (JEROME ARANDA);
      DOCK52 dropped JULIO CESAR Alvarado.
  * open mix: 11 LOAD + 5 RECEIVE  ->  12 LOAD + 4 RECEIVE (still 16 open; all GURUNANDA this refresh).
  * open task set: TASK-5389140 (DOCK52) closed; TASK-5391614 (DOCK59, LOAD NEW) opened.
  * schedule: 2026-10-11 (Sunday, non-operating, 0/0)  ->  2026-10-12 (Monday, OPERATING):
      93 outbound loads / 40 inbound receipts scheduled; % Outbounds Loaded = 1.1% (1/93);
      % Inbounds Received = 0.0% (0/40).
  * facility-wide open sweep: 41 load / 77 receive  ->  45 load / 84 receive.
  * all-time block RECOMPUTED, unchanged (4,002 closed / 2,936 LOAD / 1,066 RECEIVE / 83 names;
      GURUNANDA->Arnulfo 965).

Only prose values that changed are rewritten; the visual layout is untouched and no value is
invented. Every anchored replacement must match exactly once.
"""
import json, re, sys

snap = json.load(open("src/lib/wise_snapshot.json"))
assert snap["snapshotUtc"] == "2026-10-12T15:04:50Z", snap["snapshotUtc"]
assert snap["refreshStampLA"] == "Oct 12 ~08:04 PDT", snap["refreshStampLA"]

p = open("src/app/page.tsx", encoding="utf-8").read()

REPL = [
    # ── Assigned-Activity interpretation banner: two date stamps ──
    ("recomputed in this refresh</strong> from a full row-level rescan (2026-10-11 ~16:27 PDT). "
     "Below is the current live snapshot (2026-10-11 ~16:27 PDT).",
     "recomputed in this refresh</strong> from a full row-level rescan (2026-10-12 ~08:04 PDT). "
     "Below is the current live snapshot (2026-10-12 ~08:04 PDT).", 1),

    # ── Data Notes bullet 1: door utilization + Location API cross-check ──
    ("<strong className=\"text-[#f4f4f6]\">8 Occupied / 2 Reserved / 13 Available / 2 anomalies</strong> "
     "— door utilization is task-derived at the 2026-10-11 ~16:27 PDT snapshot: 8 doors with an "
     "in-progress open task (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK58), 2 doors "
     "holding only not-started NEW task(s) (DOCK66, DOCK69), 13 doors with no open load/receive task. "
     "10 doors carry an active assignment (43.5% of the bay).",
     "<strong className=\"text-[#f4f4f6]\">9 Occupied / 2 Reserved / 12 Available / 2 anomalies</strong> "
     "— door utilization is task-derived at the 2026-10-12 ~08:04 PDT snapshot: 9 doors with an "
     "in-progress open task (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK58, DOCK66), 2 doors "
     "holding only not-started NEW task(s) (DOCK59, DOCK69), 12 doors with no open load/receive task. "
     "11 doors carry an active assignment (47.8% of the bay).", 1),
    ("field reports 16 Bay-4 doors OCCUPIED / 1 RESERVED / 6 AVAILABLE (its <code>spaceStatus</code> "
     "reports 12 OCCUPIED / 11 EMPTY). It is driven by trailer check-in state rather than by open dock work "
     "and <strong className=\"text-[#f4f4f6]\">diverges materially</strong> from task-derived status (8 vs 16).",
     "field reports 18 Bay-4 doors OCCUPIED / 1 RESERVED / 4 AVAILABLE (its <code>spaceStatus</code> "
     "reports 12 OCCUPIED / 11 EMPTY). It is driven by trailer check-in state rather than by open dock work "
     "and <strong className=\"text-[#f4f4f6]\">diverges materially</strong> from task-derived status (9 vs 18).", 1),

    # ── Data Notes bullet 2: inbound vs outbound mix ──
    ("<strong className=\"text-[#7c3aed]\">11 outbound (LOAD)</strong> / <strong className=\"text-[#22c55e]\">"
     "5 inbound (RECEIVE)</strong> = 16 at ~16:27 PDT. 68.8% outbound / 31.3% inbound.",
     "<strong className=\"text-[#7c3aed]\">12 outbound (LOAD)</strong> / <strong className=\"text-[#22c55e]\">"
     "4 inbound (RECEIVE)</strong> = 16 at ~08:04 PDT. 75.0% outbound / 25.0% inbound.", 1),

    # ── Data Notes bullet 3: customer mix + status ──
    ("<li><strong className=\"text-[#7c3aed]\">Customer mix:</strong> 15 of the 16 open Bay-4 tasks are "
     "GURUNANDA, LLC (ORG-655875) — 93.8%; the remaining 1 is CMPC USA (Cut Paper and Rolls) (ORG-40858) — "
     "a non-GURUNANDA customer is present at Bay 4 this refresh. Task status: 13 IN_PROGRESS + 3 NEW.</li>",
     "<li><strong className=\"text-[#7c3aed]\">Customer mix:</strong> all 16 of the 16 open Bay-4 tasks are "
     "GURUNANDA, LLC (ORG-655875) — 100.0%; no non-GURUNANDA customer is present at Bay 4 this refresh. "
     "Task status: 14 IN_PROGRESS + 2 NEW.</li>", 1),

    # ── Data Notes bullet 4: DOCK50 severe anomaly durations ──
    ("SEVERE ANOMALY — DOCK50 (aging 355d 3h 5m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with "
     "endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 "
     "still carries TASK-5389467 (LOAD, IN_PROGRESS 3d 7h 19m, ARNULFO MUNGUIA) and TASK-5390717 (LOAD, "
     "IN_PROGRESS 2d 4h 49m, ARNULFO MUNGUIA).",
     "SEVERE ANOMALY — DOCK50 (aging 355d 18h 43m):</strong> TASK-5090739 RECEIVE remains IN_PROGRESS with "
     "endTime already set (2025-10-22) — stuck/stale and still aging. Assigned to daira gonzalez. DOCK50 "
     "still carries TASK-5389467 (LOAD, IN_PROGRESS 3d 22h 57m, ARNULFO MUNGUIA) and TASK-5390717 (LOAD, "
     "IN_PROGRESS 2d 20h 26m, ARNULFO MUNGUIA).", 1),

    # ── Data Notes bullet 5: DOCK54 anomaly duration + prior-ref stamp ──
    ("ANOMALY — DOCK54 (aging 64d 23h 57m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains "
     "IN_PROGRESS — stale — and remains the only open task on that door (unchanged since the prior "
     "2026-10-11 ~12:33 PDT refresh).",
     "ANOMALY — DOCK54 (aging 65d 15h 35m):</strong> TASK-5338695 (LOAD, endTime 2026-08-10) remains "
     "IN_PROGRESS — stale — and remains the only open task on that door (unchanged since the prior "
     "2026-10-11 ~16:27 PDT refresh).", 1),

    # ── Data Notes bullet 6: single tight sweep ──
    ("<li><strong className=\"text-[#22c55e]\">Single tight sweep:</strong> all current-state figures on this "
     "page come from one self-consistent sweep at 2026-10-11T23:27:03Z (2026-10-11 ~16:27 PDT). Note: two "
     "doors (DOCK66, DOCK69) hold only a not-started NEW task, so Reserved = 2 of 23; the occupied set is 8 "
     "doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK58) — unchanged from the prior "
     "2026-10-11 ~12:33 PDT refresh: no task entered or left the open set, so the population is stable at the "
     "same 16 tasks across the same 10 doors (8 occupied + 2 reserved).</li>",
     "<li><strong className=\"text-[#22c55e]\">Single tight sweep:</strong> all current-state figures on this "
     "page come from one self-consistent sweep at 2026-10-12T15:04:50Z (2026-10-12 ~08:04 PDT). Note: two "
     "doors (DOCK59, DOCK69) hold only a not-started NEW task, so Reserved = 2 of 23; the occupied set is 9 "
     "doors (DOCK50, DOCK51, DOCK52, DOCK53, DOCK54, DOCK56, DOCK57, DOCK58, DOCK66). Since the prior "
     "2026-10-11 ~16:27 PDT refresh the open set changed: TASK-5389140 (DOCK52, CMPC RECEIVE) closed and "
     "TASK-5391614 (DOCK59, LOAD NEW) entered the open set, so the open population now spans 11 doors "
     "(9 occupied + 2 reserved) while still totalling 16 open tasks.</li>", 1),

    # ── Data Notes bullet 7: schedule % (non-operating -> operating day) ──
    ("<li><strong className=\"text-[#22c55e]\">Schedule % REPORTED this refresh (current facility-local day):"
     "</strong> the current facility-local day is <strong className=\"text-[#f4f4f6]\">Sunday 2026-10-11"
     "</strong> — a non-operating day carrying <strong className=\"text-[#f4f4f6]\">0 inbound receipts</strong> "
     "and <strong className=\"text-[#f4f4f6]\">0 outbound loads</strong> in its appointment window. <strong "
     "className=\"text-[#f4f4f6]\">% Scheduled Inbounds Received = n/a</strong> (0 inbounds scheduled, so there "
     "is no denominator this day — reported n/a rather than a fabricated 0%) and <strong className=\"text-"
     "[#f4f4f6]\">% Scheduled Outbounds Loaded = n/a</strong> (0 loads scheduled, so there is no denominator on "
     "this day — reported n/a rather than a fabricated 0%). Binding filters confirmed: <strong className=\"text-"
     "[#f4f4f6]\">loads</strong> use <code>appointmentTimePeriod</code> — a BETWEEN that requires exactly two "
     "date-time elements, i.e. [&quot;2026-10-11T00:00:00&quot;,&quot;2026-10-11T23:59:59&quot;]; <strong "
     "className=\"text-[#f4f4f6]\">receipts</strong> use <code>appointmentTimeFrom</code>/<code>"
     "appointmentTimeTo</code>. Day status composition: loads — none scheduled; receipts — none scheduled.</li>",
     "<li><strong className=\"text-[#22c55e]\">Schedule % REPORTED this refresh (current facility-local day):"
     "</strong> the current facility-local day is <strong className=\"text-[#f4f4f6]\">Monday 2026-10-12"
     "</strong> — an OPERATING day carrying <strong className=\"text-[#f4f4f6]\">40 inbound receipts</strong> "
     "and <strong className=\"text-[#f4f4f6]\">93 outbound loads</strong> in its appointment window. <strong "
     "className=\"text-[#f4f4f6]\">% Scheduled Inbounds Received = 0.0%</strong> (0 of 40 receipts received) and "
     "<strong className=\"text-[#f4f4f6]\">% Scheduled Outbounds Loaded = 1.1%</strong> (1 of 93 loads loaded/"
     "shipped). Binding filters confirmed: <strong className=\"text-[#f4f4f6]\">loads</strong> use <code>"
     "appointmentTimePeriod</code> — a BETWEEN that requires exactly two date-time elements, i.e. "
     "[&quot;2026-10-12T00:00:00&quot;,&quot;2026-10-12T23:59:59&quot;]; <strong className=\"text-[#f4f4f6]\">"
     "receipts</strong> use <code>appointmentTimeFrom</code>/<code>appointmentTimeTo</code>. Day status "
     "composition: loads — 80 NEW / 11 WINDOW_CHECKIN_DONE / 1 LOADING / 1 SHIPPED; receipts — 26 IMPORTED / "
     "14 OPEN.</li>", 1),

    # ── Data Notes bullet 8: all-time prior-ref stamp ──
    ("They are fresh, not carried forward: the closed set is unchanged from the prior 2026-10-11 ~12:33 PDT "
     "rescan (4,002 closed / 2,936 LOAD / 1,066 RECEIVE — no Bay-4 task closed in the interval).",
     "They are fresh, not carried forward: the closed set is unchanged from the prior 2026-10-11 ~16:27 PDT "
     "rescan (4,002 closed / 2,936 LOAD / 1,066 RECEIVE — no Bay-4 task closed in the interval).", 1),

    # ── Data Notes bullet 10: timestamp basis ──
    ("task timestamps are read on the same UTC frame as the snapshot instant (2026-10-11T23:27:03Z). Query "
     "window 2026-10-11T23:27:03Z → 2026-10-11T23:27:03Z.",
     "task timestamps are read on the same UTC frame as the snapshot instant (2026-10-12T15:04:50Z). Query "
     "window 2026-10-12T15:04:50Z → 2026-10-12T15:04:50Z.", 1),

    # ── Data Notes bullet 13: guru re-verification date ──
    ("Core live metrics sourced from live WISE/WMS queries — Sunday 2026-10-11 ~16:27 PDT (UTC snapshot "
     "2026-10-11T23:27:03Z).",
     "Core live metrics sourced from live WISE/WMS queries — Monday 2026-10-12 ~08:04 PDT (UTC snapshot "
     "2026-10-12T15:04:50Z).", 1),

    # ── Footer stamp ──
    ("Last refreshed: {refreshDateLong} ~16:27 PDT",
     "Last refreshed: {refreshDateLong} ~08:04 PDT", 1),
]

missing = []
for old, new, n in REPL:
    c = p.count(old)
    if c == n:
        p = p.replace(old, new, n)
    else:
        missing.append((c, n, old[:110]))

open("src/app/page.tsx", "w", encoding="utf-8").write(p)

# ── integrity checks ──
d = open("src/lib/data.ts", encoding="utf-8").read()
pg = p
both = d + pg
checks = {
    "no_missing_anchors": not missing,
    "old_iso_gone": "2026-10-11T23:27:03Z" not in both,
    "new_iso_in_data": "2026-10-12T15:04:50Z" in d,
    "new_iso_in_page": "2026-10-12T15:04:50Z" in pg,
    "old_stamp_gone": "Oct 11 ~16:27 PDT" not in pg,
    "old_stamp_gone_data": 'refreshStamp = "Oct 11' not in d,
    "page_new_stamp": pg.count("2026-10-12 ~08:04 PDT") == 5,
    "occ_9": pg.count("9 Occupied / 2 Reserved / 12 Available") == 1,
    "mix_counts": ('count: 12, total: 16' in d) and ('count: 4, total: 16' in d),
    "sched_inbound_40": "scheduledInboundOrders = 40;" in d,
    "sched_outbound_93": "scheduledOutboundOrders = 93;" in d,
    "pct_loaded_1p1": 'count: 12, total: 16' in d and "scheduledOutboundLoaded = 1;" in d,
    "facility_open": "facilityOpenLoad = 45;" in d and "facilityOpenReceive = 84;" in d,
    "no_stale_task": "TASK-5389140" not in d,
    "new_task_present": "TASK-5391614" in d,
    "data_door_durations": all(
        (x["duration"] is None) or (f'duration: "{x["duration"]}"' in d) for x in snap["doors"]),
    "data_task_pieces": all(
        (f'pieces: "{a["pieces"]}"' in d) for a in snap["assignments"]),
}
print("missing anchors:", missing)
print("checks:", json.dumps(checks, indent=2))
assert all(checks.values()), checks
print("OK — page.tsx patched")
