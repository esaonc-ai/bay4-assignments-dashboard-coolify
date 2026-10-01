#!/usr/bin/env python3
"""Single consistent WISE/WMS snapshot for the Bay 4 Assignments dashboard (LT_F1, DOCK50-DOCK72).
Emits src/lib/wise_snapshot.json with every value the dashboard renders."""
import os, json, time, urllib.request
from datetime import datetime, timezone, timedelta

BASE = os.environ["WMS_BASE_URL"].rstrip("/")
HDRS = {"Authorization": os.environ["WMS_AUTHORIZATION"], "x-tenant-id": os.environ["WMS_TENANT_ID"],
        "x-facility-id": os.environ["WMS_FACILITY_ID"], "Content-Type": "application/json"}
PAGE_CAP = 200
BOOT = "2026-10-01"                       # facility-local operating day (America/Los_Angeles)
LA = timezone(timedelta(hours=-7))        # PDT

def post(path, body, tries=4):
    data = json.dumps(body).encode(); last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(BASE + path, data=data, headers=HDRS, method="POST")
            return json.loads(urllib.request.urlopen(req, timeout=60).read().decode())
        except Exception as e:
            last = e; time.sleep(1.5 * (i + 1))
    raise RuntimeError(f"POST {path}: {last}")

def paged(path, body):
    out, page = [], 1
    while True:
        b = dict(body); b["currentPage"] = page; b["pageSize"] = PAGE_CAP
        d = post(path, b).get("data") or {}
        rows = d.get("list") or []; out.extend(rows)
        if page >= (d.get("totalPage") or 1) or not rows:
            return out, d.get("totalCount")
        page += 1

BAY4 = {"570":"DOCK50","554":"DOCK51","556":"DOCK52","552":"DOCK53","564":"DOCK54","560":"DOCK55",
        "575":"DOCK56","563":"DOCK57","572":"DOCK58","571":"DOCK59","565":"DOCK60","567":"DOCK61",
        "566":"DOCK62","568":"DOCK63","559":"DOCK64","573":"DOCK65","576":"DOCK66","577":"DOCK67",
        "574":"DOCK68","578":"DOCK69","579":"DOCK70","580":"DOCK71","587":"DOCK72"}
BAY4_IDS = set(BAY4)
CUST = {"ORG-655875":"GURUNANDA, LLC","ORG-585450":"KARAKA, LLC"}

NOW = datetime.now(timezone.utc).replace(microsecond=0)
ISO = NOW.strftime("%Y-%m-%dT%H:%M:%SZ")
LA_NOW = NOW.astimezone(LA)

def dur(start_iso):
    if not start_iso: return None
    s = datetime.strptime(start_iso, "%Y-%m-%dT%H:%M:%S").replace(tzinfo=timezone.utc)
    secs = int((NOW - s).total_seconds())
    d, r = divmod(secs, 86400); h, r = divmod(r, 3600); m = r // 60
    if d > 0: return f"{d}d {h}h {m}m"
    return f"{h}h {m}m"

# 1) door locations
loc, loc_total = paged("/wms-bam/wms-location/search-by-paging", {"names": list(BAY4.values())})
loc_by_name = {r["name"]: r for r in loc}

# 2) open load + receive tasks (facility sweep) -> Bay4 subset
oload, oload_total = paged("/wms-bam/outbound/load-task/search-by-paging", {"statuses": ["NEW","IN_PROGRESS","EXCEPTION"]})
orecv, orecv_total = paged("/wms-bam/inbound/receive-task/search-by-paging", {"statuses": ["NEW","IN_PROGRESS","EXCEPTION"]})

open_rows = []
for r in oload:
    if str(r.get("dockId")) in BAY4_IDS:
        open_rows.append({**r, "_kind":"LOAD"})
for r in orecv:
    if str(r.get("dockId")) in BAY4_IDS:
        open_rows.append({**r, "_kind":"RECEIVE"})

# 3) today's schedule
sloads, sload_total = paged("/wms-bam/outbound/load/search-by-paging",
    {"appointmentTimePeriod": [f"{BOOT}T00:00:00", f"{BOOT}T23:59:59"]})
srecv, srecv_total = paged("/wms-bam/inbound/receipt/search-by-paging",
    {"appointmentTimeFrom": f"{BOOT}T00:00:00", "appointmentTimeTo": f"{BOOT}T23:59:59"})

# 4) all-time closed per Bay-4 door
closed = []
for dock in sorted(BAY4_IDS):
    for kind, path in (("LOAD","/wms-bam/outbound/load-task/search-by-paging"),
                       ("RECEIVE","/wms-bam/inbound/receive-task/search-by-paging")):
        rows, _ = paged(path, {"statuses": ["CLOSED","FORCE_CLOSED"], "dockId": dock})
        for r in rows:
            closed.append({"kind": kind, "taskId": r.get("id"), "customerId": r.get("customerId"),
                           "uid": str(r.get("assigneeUserId")), "name": r.get("assigneeUserName")})
seen=set(); dedup=[]
for r in closed:
    k=(r["kind"], r["taskId"])
    if k in seen: continue
    seen.add(k); dedup.append(r)

# ---- doors ----
def fmt_dur(s): return s
doors = []
for name in [f"DOCK{n}" for n in range(50, 73)]:
    did = next(i for i, n in BAY4.items() if n == name)
    rows = [r for r in open_rows if str(r.get("dockId")) == did]
    rows.sort(key=lambda r: r.get("startTime") or "9999")
    inprog = [r for r in rows if r.get("status") == "IN_PROGRESS"]
    status = "Occupied" if inprog else ("Reserved" if rows else "Available")
    assignees = []
    for r in rows:
        nm = r.get("assigneeUserName")
        if nm and nm not in assignees: assignees.append(nm)
    custs = []
    for r in rows:
        nm = CUST.get(r.get("customerId"), r.get("customerId"))
        if nm not in custs: custs.append(nm)
    durs = [dur(r.get("startTime")) for r in rows if r.get("startTime")]
    dur_s = durs[0] if durs else None      # oldest task age (rows sorted oldest-first)
    anomaly = any(r.get("endTime") for r in rows)   # endTime set while still open => stale
    doors.append({"door": name, "status": status,
                  "assignee": ", ".join(assignees) if assignees else None,
                  "customer": ", ".join(custs) if custs else None,
                  "taskIds": [r.get("id") for r in rows],
                  "duration": dur_s, "anomaly": bool(anomaly)})

occupied = sum(1 for d in doors if d["status"] == "Occupied")
reserved = sum(1 for d in doors if d["status"] == "Reserved")
available = sum(1 for d in doors if d["status"] == "Available")
with_tasks = sum(1 for d in doors if d["taskIds"])
anomalous = sum(1 for d in doors if d["anomaly"])

# ---- assignees ----
ac = {}
for r in open_rows:
    nm = r.get("assigneeUserName") or "(unassigned)"
    ac[nm] = ac.get(nm, 0) + 1
assignee_summaries = [{"name": k, "taskCount": v} for k, v in sorted(ac.items(), key=lambda kv: -kv[1])]
assert sum(ac.values()) == len(open_rows)

# ---- mix / customer / status ----
outb = sum(1 for r in open_rows if r["_kind"] == "LOAD")
inb = sum(1 for r in open_rows if r["_kind"] == "RECEIVE")
cmix = {}
for r in open_rows:
    nm = CUST.get(r.get("customerId"), r.get("customerId")); cmix[nm] = cmix.get(nm, 0) + 1
smix = {}
for r in open_rows:
    smix[r.get("status")] = smix.get(r.get("status"), 0) + 1

# ---- all-time ----
an = {}
for r in dedup:
    nm = r.get("name") or "(unassigned)"; an[nm] = an.get(nm, 0) + 1
guru = [r for r in dedup if r.get("customerId") == "ORG-655875" and r.get("uid") == "89"]

# ---- schedule ----
sl_stat = {}; [sl_stat.__setitem__(l.get("status"), sl_stat.get(l.get("status"), 0) + 1) for l in sloads]
sr_stat = {}; [sr_stat.__setitem__(x.get("status"), sr_stat.get(x.get("status"), 0) + 1) for x in srecv]
sl_loaded = sum(1 for l in sloads if l.get("status") in ("LOADED", "SHIPPED"))
sl_shipped = sum(1 for l in sloads if l.get("status") == "SHIPPED")
sr_received = sum(1 for x in srecv if x.get("receivedTime"))
sr_started = sum(1 for x in srecv if x.get("receivedStartTime"))

# ---- assignment rows ----
assignments = []
for r in sorted(open_rows, key=lambda r: (str(r.get("dockId")), r.get("id") or "")):
    kind = r["_kind"]; st = r.get("status")
    d = dur(r.get("startTime"))
    pieces = "NEW — not started" if st == "NEW" else f"IN_PROGRESS ({d})"
    if r.get("endTime"): pieces += " ⚠ STALE"
    assignments.append({"taskId": r.get("id"), "dns": f"{kind} {st}",
                        "customer": CUST.get(r.get("customerId"), r.get("customerId")),
                        "pieces": pieces, "assignee": r.get("assigneeUserName"),
                        "door": BAY4[str(r.get("dockId"))]})

arnulfo = [r for r in open_rows if str(r.get("assigneeUserId")) == "89"]
arnulfo_tasks = []
for r in sorted(arnulfo, key=lambda r: (str(r.get("dockId")), r.get("id") or "")):
    st = r.get("status"); d = dur(r.get("startTime"))
    note = "NEW — not started" if st == "NEW" else f"IN_PROGRESS — {d}"
    if r.get("endTime"): note = f"STALE — {d} (endTime set {(r.get('endTime') or '')[:10]})"
    arnulfo_tasks.append({"door": BAY4[str(r.get("dockId"))], "taskId": r.get("id"), "kind": r["_kind"],
                          "status": st, "customer": CUST.get(r.get("customerId"), r.get("customerId")), "note": note})
ag = sum(1 for r in arnulfo if r.get("customerId") == "ORG-655875")
ak = sum(1 for r in arnulfo if r.get("customerId") == "ORG-585450")

out = {
  "snapshotUtc": ISO,
  "refreshStampLA": LA_NOW.strftime("%b %d ~%H:%M PDT"),
  "refreshDateLong": LA_NOW.strftime("%B %d, %Y"),
  "bootDay": BOOT,
  "doors": doors,
  "kpi": {"occupied": occupied, "reserved": reserved, "available": available,
          "withTasks": with_tasks, "anomalous": anomalous, "total": len(doors)},
  "assigneeSummaries": assignee_summaries,
  "mix": {"outbound": outb, "inbound": inb, "total": outb + inb},
  "customerMix": [{"name": k, "count": v} for k, v in sorted(cmix.items(), key=lambda kv: -kv[1])],
  "statusMix": [{"name": k, "count": v} for k, v in sorted(smix.items(), key=lambda kv: -kv[1])],
  "allTime": {"closedTotal": len(dedup),
              "load": sum(1 for r in dedup if r["kind"] == "LOAD"),
              "receive": sum(1 for r in dedup if r["kind"] == "RECEIVE"),
              "distinct": len(an),
              "top": [{"name": k, "count": v} for k, v in sorted(an.items(), key=lambda kv: -kv[1])[:10]]},
  "guruArnulfo": {"total": len(guru), "load": sum(1 for r in guru if r["kind"] == "LOAD"),
                  "receive": sum(1 for r in guru if r["kind"] == "RECEIVE")},
  "schedule": {"inboundOrders": len(srecv), "outboundOrders": len(sloads),
               "inboundReceived": sr_received, "inboundStarted": sr_started,
               "outboundLoaded": sl_loaded, "outboundShipped": sl_shipped,
               "loadStatus": sl_stat, "receiptStatus": sr_stat},
  "assignments": assignments,
  "arnulfo": {"tasks": arnulfo_tasks, "count": len(arnulfo),
              "load": sum(1 for r in arnulfo if r["_kind"] == "LOAD"),
              "receive": sum(1 for r in arnulfo if r["_kind"] == "RECEIVE"),
              "guru": ag, "karaka": ak,
              "guruLoad": sum(1 for r in arnulfo if r["customerId"] == "ORG-655875" and r["_kind"] == "LOAD"),
              "guruReceive": sum(1 for r in arnulfo if r["customerId"] == "ORG-655875" and r["_kind"] == "RECEIVE")},
  "facilityOpen": {"load": oload_total, "receive": orecv_total},
  "doorIdMap": {v: k for k, v in BAY4.items()},
  "locationApi": [{"name": r["name"], "dockStatus": r.get("dockStatus"), "spaceStatus": r.get("spaceStatus")} for r in loc],
}
with open("src/lib/wise_snapshot.json", "w") as f:
    json.dump(out, f, indent=2)
print(json.dumps({k: out[k] for k in ("snapshotUtc","refreshStampLA","kpi","assigneeSummaries","mix","customerMix","statusMix","allTime","guruArnulfo","schedule","facilityOpen","arnulfo")}, indent=2))
