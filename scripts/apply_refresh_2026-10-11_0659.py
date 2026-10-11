#!/usr/bin/env python3
"""Apply the 2026-10-11 ~06:59 PDT WISE/WMS refresh to src/lib/data.ts and src/app/page.tsx.

Source of truth = src/lib/wise_snapshot.json (written by scripts/snapshot.py at
2026-10-11T13:59:19Z / 2026-10-11 ~06:59 PDT). Prior refresh = the committed
2026-10-10 ~19:04 PDT snapshot (copied to /tmp/wise_snapshot.prev.json).

What actually changed in the live WISE read this refresh:
  * snapshot instant / stamp / facility-local day roll forward to 2026-10-11 (Sunday).
  * every open-task and door DURATION ages by the elapsed interval (~11h 55m).
  * the open Bay-4 population is IDENTICAL (same 16 open tasks on the same 10 doors;
    8 Occupied / 2 Reserved / 13 Available; 11 LOAD + 5 RECEIVE; 15 GURUNANDA + 1 CMPC).
  * the scheduled-day window for the new facility-local day returns 0 loads / 0 receipts
    (down from 0 loads / 2 receipts) => BOTH schedule adherence figures now have no
    denominator and are reported n/a.

Only values that changed are rewritten; the visual layout is untouched and no value is
invented. Destructive-update guard: the script asserts every anchored replacement matched
exactly once (or, for idempotent repeats, that the target already holds the new value).
"""
import json, re, sys

snap = json.load(open("src/lib/wise_snapshot.json"))
prev = json.load(open("/tmp/wise_snapshot.prev.json"))

ISO_OLD = "2026-10-11T02:04:02Z"
ISO_NEW = snap["snapshotUtc"]                              # 2026-10-11T13:59:19Z
STAMP_NEW = "~" + snap["refreshStampLA"].split("~")[-1]    # ~06:59 PDT
DATE_NEW = snap["bootDay"]                                 # 2026-10-11
STAMP_CONST_NEW = snap["refreshStampLA"]                   # Oct 11 ~06:59 PDT
DATE_LONG_NEW = snap["refreshDateLong"]                    # October 11, 2026

door_dur = {d["door"]: d["duration"] for d in snap["doors"]}
task_pieces = {a["taskId"]: a["pieces"] for a in snap["assignments"]}
arnulfo_note = {t["taskId"]: t["note"] for t in snap["arnulfo"]["tasks"]}

sched = snap["schedule"]
assert sched["inboundOrders"] == 0 and sched["outboundOrders"] == 0, sched

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


def sub_all(t, old, new):
    n = t.count(old)
    report["globals"] += n
    return t.replace(old, new)


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
t = sub_once(t, 'export const refreshDateLong = "October 10, 2026";',
             f'export const refreshDateLong = "{DATE_LONG_NEW}";', "data:refreshDateLong")
t = sub_once(t, 'export const refreshStamp = "Oct 10 ~19:04 PDT";',
             f'export const refreshStamp = "{STAMP_CONST_NEW}";', "data:refreshStamp")
t = sub_once(t, 'export const allTimeLastRecomputed = "Oct 10 ~19:04 PDT";',
             f'export const allTimeLastRecomputed = "{STAMP_CONST_NEW}";', "data:allTimeLastRecomputed")

# header source comment (receipt totalCount now 0)
t = sub_once(t, "scheduled receipts (appointmentTimeFrom/To window, totalCount = 2)",
             "scheduled receipts (appointmentTimeFrom/To window, totalCount = 0)", "data:src-receipts")

# header SCHEDULE NOTE block
t = sub_once(
    t,
    " * SCHEDULE NOTE: the current facility-local day is 2026-10-10 (Saturday) — a NON-OPERATING day for\n"
    " *   outbound (0 load appointments in the day window) carrying only 2 inbound receipt appointments\n"
    " *   (both IMPORTED). % Scheduled Inbounds Received = 0.0% (0 of 2) is reported; % Scheduled Outbounds\n"
    " *   Loaded has no denominator this day (0 loads scheduled) and is therefore n/a — not 0%.",
    " * SCHEDULE NOTE: the current facility-local day is 2026-10-11 (Sunday) — a NON-OPERATING day: the day\n"
    " *   window carries 0 load appointments and 0 inbound receipt appointments. Neither adherence figure has a\n"
    " *   denominator this day (0 scheduled inbounds, 0 scheduled outbounds), so both % Scheduled Inbounds\n"
    " *   Received and % Scheduled Outbounds Loaded are reported n/a — not a fabricated 0%.",
    "data:SCHEDULE-NOTE")

# schedule constants block
t = sub_once(t, "// Schedule: facility-wide appointment adherence for the current facility-local day (2026-10-10, Saturday).",
             "// Schedule: facility-wide appointment adherence for the current facility-local day (2026-10-11, Sunday).",
             "data:sched-comment1")
t = sub_once(t, "// appointmentTimeFrom/To. The 2026-10-10 window returns 0 loads / 2 receipts (non-operating day for outbound).",
             "// appointmentTimeFrom/To. The 2026-10-11 window returns 0 loads / 0 receipts (non-operating day).",
             "data:sched-comment2")
t = sub_once(t,
             '"Reported — 2026-10-10 (Saturday) is a non-operating day for outbound (0 loads / 2 receipts scheduled)";',
             '"Reported — 2026-10-11 (Sunday) is a non-operating day (0 loads / 0 receipts scheduled)";',
             "data:sched-reason")
t = sub_once(t, "export const scheduledInboundOrders = 2;",
             "export const scheduledInboundOrders = 0;", "data:sched-inboundOrders")
t = sub_once(t,
             "export const pctScheduledInboundReceived = (0 / 2) * 100; // 0.0% — 0 of 2 receipts received (today)",
             "export const pctScheduledInboundReceived = 0; // n/a — 0 inbounds scheduled today, so there is no denominator",
             "data:sched-pctInbound")
t = sub_once(t, "// n/a: no outbound loads are scheduled in the 2026-10-10 window, so there is no denominator this day.",
             "// n/a: no loads are scheduled in the 2026-10-11 window, so there is no denominator this day.",
             "data:sched-pctOutbound-comment")
t = sub_once(t, "// Live status composition of the 2026-10-10 scheduled day.",
             "// Live status composition of the 2026-10-11 scheduled day.", "data:sched-status-comment")
t = sub_once(t, "export const scheduleReceiptStatus: Record<string, number> = { IMPORTED: 2 };",
             "export const scheduleReceiptStatus: Record<string, number> = {};", "data:sched-receiptStatus")

# header comment stamps: current-refresh occurrences roll to the new date+stamp,
# prior-refresh references roll from ~18:12 to the just-passed ~19:04 stamp (date stays 2026-10-10)
t = sub_all(t, "2026-10-10 ~19:04 PDT", f"{DATE_NEW} {STAMP_NEW}")
t = sub_all(t, "2026-10-10 ~18:12 PDT", "2026-10-10 ~19:04 PDT")

# global ISO re-stamp (data.ts)
t = sub_all(t, ISO_OLD, ISO_NEW)
open("src/lib/data.ts", "w", encoding="utf-8").write(t)

# ─────────────────────────────────────────────────────────────────────────────
# 2. page.tsx — prose values + stamps
# ─────────────────────────────────────────────────────────────────────────────
p = open("src/app/page.tsx", encoding="utf-8").read()

# 2a. current-refresh stamp occurrences that carry the old calendar date
p = sub_all(p, "2026-10-10 ~19:04 PDT", f"{DATE_NEW} {STAMP_NEW}")
# 2b. remaining bare current-refresh stamps
p = sub_once(p, "= 16 at ~19:04 PDT.", f"= 16 at {STAMP_NEW}.", "page:mix-stamp")
p = sub_once(p, "{refreshDateLong} ~19:04 PDT", "{refreshDateLong} " + STAMP_NEW, "page:footer-stamp")
# 2c. prior-refresh references roll from ~18:12 to the just-passed ~19:04 stamp (dates stay 2026-10-10)
p = sub_all(p, "2026-10-10 ~18:12 PDT", "2026-10-10 ~19:04 PDT")

# 2d. DOCK50 severe-anomaly durations
p = sub_once(p, "(aging 354d 5h 42m)", "(aging 354d 17h 38m)", "page:DOCK50-age")
p = sub_once(p, "IN_PROGRESS 2d 9h 56m, ARNULFO", "IN_PROGRESS 2d 21h 51m, ARNULFO", "page:DOCK50-task2")
p = sub_once(p, "IN_PROGRESS 1d 7h 26m, ARNULFO", "IN_PROGRESS 1d 19h 21m, ARNULFO", "page:DOCK50-task3")
# 2e. DOCK54 anomaly duration
p = sub_once(p, "(aging 64d 2h 34m)", "(aging 64d 14h 29m)", "page:DOCK54-age")

# 2f. schedule narrative — the day window is now empty for BOTH directions
p = sub_once(
    p,
    '<li><strong className="text-[#22c55e]">Schedule % REPORTED this refresh (current facility-local day):</strong> the current facility-local day is <strong className="text-[#f4f4f6]">Saturday 2026-10-10</strong> — a non-operating day for outbound carrying <strong className="text-[#f4f4f6]">2 inbound receipts</strong> and <strong className="text-[#f4f4f6]">0 outbound loads</strong> in its appointment window. <strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = 0.0%</strong> (0 received of 2) and <strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = n/a</strong> (0 loads scheduled, so there is no denominator on this day — reported n/a rather than a fabricated 0%). Binding filters confirmed: <strong className="text-[#f4f4f6]">loads</strong> use <code>appointmentTimePeriod</code> — a BETWEEN that requires exactly two date-time elements, i.e. [&quot;2026-10-10T00:00:00&quot;,&quot;2026-10-10T23:59:59&quot;]; <strong className="text-[#f4f4f6]">receipts</strong> use <code>appointmentTimeFrom</code>/<code>appointmentTimeTo</code>. Day status composition: loads — none scheduled; receipts — 2 IMPORTED.</li>',
    '<li><strong className="text-[#22c55e]">Schedule % REPORTED this refresh (current facility-local day):</strong> the current facility-local day is <strong className="text-[#f4f4f6]">Sunday 2026-10-11</strong> — a non-operating day carrying <strong className="text-[#f4f4f6]">0 inbound receipts</strong> and <strong className="text-[#f4f4f6]">0 outbound loads</strong> in its appointment window. <strong className="text-[#f4f4f6]">% Scheduled Inbounds Received = n/a</strong> (0 inbounds scheduled, so there is no denominator this day — reported n/a rather than a fabricated 0%) and <strong className="text-[#f4f4f6]">% Scheduled Outbounds Loaded = n/a</strong> (0 loads scheduled, so there is no denominator on this day — reported n/a rather than a fabricated 0%). Binding filters confirmed: <strong className="text-[#f4f4f6]">loads</strong> use <code>appointmentTimePeriod</code> — a BETWEEN that requires exactly two date-time elements, i.e. [&quot;2026-10-11T00:00:00&quot;,&quot;2026-10-11T23:59:59&quot;]; <strong className="text-[#f4f4f6]">receipts</strong> use <code>appointmentTimeFrom</code>/<code>appointmentTimeTo</code>. Day status composition: loads — none scheduled; receipts — none scheduled.</li>',
    "page:schedule-note")

# 2g. closing line day name
p = sub_once(p, "queries — Saturday 2026-10-11", "queries — Sunday 2026-10-11", "page:closing-dayname")

# 2h. global ISO re-stamp (page.tsx)
p = sub_all(p, ISO_OLD, ISO_NEW)
open("src/app/page.tsx", "w", encoding="utf-8").write(p)

# ─────────────────────────────────────────────────────────────────────────────
# 3. Integrity checks
# ─────────────────────────────────────────────────────────────────────────────
d = open("src/lib/data.ts", encoding="utf-8").read()
pg = open("src/app/page.tsx", encoding="utf-8").read()
both = d + pg

occ = len(re.findall(r'^  \{ door: "DOCK\d+", status: "Occupied"', d, re.M))
res = len(re.findall(r'^  \{ door: "DOCK\d+", status: "Reserved"', d, re.M))
tot = len(re.findall(r'^  \{ door: "DOCK\d+", status: "', d, re.M))

checks = {
    "no_missing_anchors": not missing,
    "occupied_matches": occ == snap["kpi"]["occupied"],
    "reserved_matches": res == snap["kpi"]["reserved"],
    "doors_total": tot == 23,
    "stale_iso_gone": ISO_OLD not in both,
    "new_iso_present": ISO_NEW in d and ISO_NEW in pg,
    "new_stamp_present": STAMP_NEW in pg and STAMP_CONST_NEW in d,
    "new_date_present": DATE_LONG_NEW in d,
    "sched_inbound_orders_zero": "export const scheduledInboundOrders = 0;" in d,
    "sched_receipt_status_empty": "export const scheduleReceiptStatus: Record<string, number> = {};" in d,
    "day_is_sunday_1011": "Sunday 2026-10-11" in pg and "2026-10-11 (Sunday)" in d,
    "old_saturday_gone": "Saturday 2026-10-10</strong>" not in pg,
    "data_only_prior_date": d.count("2026-10-10") == 1,
    "page_only_prior_dates": pg.count("2026-10-10") == 3,
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
