#!/usr/bin/env python3
"""Pull fresh WISE/WMS data for the Bay 4 Assignments dashboard (LT_F1, DOCK50-DOCK72)."""
import os, json, sys, time, urllib.request, urllib.error
from datetime import datetime, timezone, timedelta

BASE = os.environ["WMS_BASE_URL"].rstrip("/")
HDRS = {
    "Authorization": os.environ["WMS_AUTHORIZATION"],
    "x-tenant-id": os.environ["WMS_TENANT_ID"],
    "x-facility-id": os.environ["WMS_FACILITY_ID"],
    "Content-Type": "application/json",
}
PAGE_CAP = 200

def post(path, body, tries=4):
    data = json.dumps(body).encode()
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(BASE + path, data=data, headers=HDRS, method="POST")
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            last = e
            time.sleep(1.5 * (i + 1))
    raise RuntimeError(f"POST {path} failed: {last}")

def paged(path, body):
    """Return the full concatenated list across all pages of a search-by-paging endpoint."""
    out = []
    page = 1
    while True:
        b = dict(body); b["currentPage"] = page; b["pageSize"] = PAGE_CAP
        resp = post(path, b)
        d = resp.get("data") or {}
        rows = d.get("list") or []
        out.extend(rows)
        tp = d.get("totalPage") or 1
        if page >= tp or not rows:
            return out, d.get("totalCount")
        page += 1

BOOT = "2026-10-01"  # facility-local day (America/Los_Angeles), Thursday

bay4_name_by_id = {
    "570":"DOCK50","554":"DOCK51","556":"DOCK52","552":"DOCK53","564":"DOCK54","560":"DOCK55",
    "575":"DOCK56","563":"DOCK57","572":"DOCK58","571":"DOCK59","565":"DOCK60","567":"DOCK61",
    "566":"DOCK62","568":"DOCK63","559":"DOCK64","573":"DOCK65","576":"DOCK66","577":"DOCK67",
    "574":"DOCK68","578":"DOCK69","579":"DOCK70","580":"DOCK71","587":"DOCK72",
}
BAY4_IDS = set(bay4_name_by_id)

# ---- verify door locations live ----
loc = paged("/wms-bam/wms-location/search-by-paging", {"names": list(bay4_name_by_id.values())})
doors_live = []
for r in loc[0]:
    doors_live.append({"id": r.get("id"), "name": r.get("name"),
                       "dockStatus": r.get("dockStatus"), "spaceStatus": r.get("spaceStatus"),
                       "status": r.get("status")})

# ---- open load tasks (facility-wide sweep) ----
open_load_rows, open_load_total = paged("/wms-bam/outbound/load-task/search-by-paging",
    {"statuses": ["NEW", "IN_PROGRESS", "EXCEPTION"]})
# ---- open receive tasks ----
open_recv_rows, open_recv_total = paged("/wms-bam/inbound/receive-task/search-by-paging",
    {"statuses": ["NEW", "IN_PROGRESS", "EXCEPTION"]})

def slim(r, kind):
    return {
        "kind": kind,
        "taskId": r.get("id"),
        "dockId": str(r.get("dockId")),
        "dockName": r.get("dockName"),
        "status": r.get("status"),
        "customerId": r.get("customerId"),
        "assigneeUserId": r.get("assigneeUserId"),
        "assigneeUserName": r.get("assigneeUserName"),
        "startTime": r.get("startTime"),
        "endTime": r.get("endTime"),
        "createdTime": r.get("createdTime"),
        "note": r.get("note"),
        "loadIds": r.get("loadIds"),
        "loadStatuses": [l.get("status") for l in (r.get("loads") or [])],
        "loadNos": [l.get("loadNo") for l in (r.get("loads") or [])],
    }

bay4_open = []
for r in open_load_rows:
    if str(r.get("dockId")) in BAY4_IDS:
        bay4_open.append(slim(r, "LOAD"))
for r in open_recv_rows:
    if str(r.get("dockId")) in BAY4_IDS:
        bay4_open.append(slim(r, "RECEIVE"))

# ---- scheduled loads today ----
sched_loads, sched_load_total = paged("/wms-bam/outbound/load/search-by-paging",
    {"appointmentTimePeriod": [f"{BOOT}T00:00:00", f"{BOOT}T23:59:59"]})
# ---- scheduled receipts today ----
sched_recv, sched_recv_total = paged("/wms-bam/inbound/receipt/search-by-paging",
    {"appointmentTimeFrom": f"{BOOT}T00:00:00", "appointmentTimeTo": f"{BOOT}T23:59:59"})

def status_hist(rows, key="status"):
    h = {}
    for r in rows:
        h[r.get(key)] = h.get(r.get(key), 0) + 1
    return h

sched_load_status = status_hist(sched_loads)
sched_recv_status = status_hist(sched_recv)
sched_recv_received = sum(1 for r in sched_recv if r.get("receivedTime"))

# ---- all-time closed LOAD + RECEIVE at Bay-4 doors (per-door rescan) ----
alltime_closed = []
for dock in sorted(BAY4_IDS):
    for kind, path in (("LOAD", "/wms-bam/outbound/load-task/search-by-paging"),
                        ("RECEIVE", "/wms-bam/inbound/receive-task/search-by-paging")):
        rows, _ = paged(path, {"statuses": ["CLOSED", "FORCE_CLOSED"], "dockId": dock})
        for r in rows:
            alltime_closed.append({
                "kind": kind,
                "taskId": r.get("id"),
                "dockId": str(r.get("dockId")),
                "customerId": r.get("customerId"),
                "assigneeUserId": r.get("assigneeUserId"),
                "assigneeUserName": r.get("assigneeUserName"),
            })

# de-dup on (kind, taskId)
seen = set(); dedup = []
for r in alltime_closed:
    k = (r["kind"], r["taskId"])
    if k in seen: continue
    seen.add(k); dedup.append(r)

by_name = {}
for r in dedup:
    n = r.get("assigneeUserName") or "(unassigned)"
    by_name[n] = by_name.get(n, 0) + 1
alltime_top = sorted(by_name.items(), key=lambda kv: -kv[1])[:15]

guru_arnulfo = [r for r in dedup if r.get("customerId") == "ORG-655875" and str(r.get("assigneeUserId")) == "89"]

summary = {
    "pulledAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "bootDay": BOOT,
    "doorsLive": doors_live,
    "openLoadTotalFacility": open_load_total,
    "openRecvTotalFacility": open_recv_total,
    "bay4Open": bay4_open,
    "schedLoadTotal": sched_load_total,
    "schedLoadStatus": sched_load_status,
    "schedRecvTotal": sched_recv_total,
    "schedRecvStatus": sched_recv_status,
    "schedRecvReceived": sched_recv_received,
    "allTimeClosedTotal": len(dedup),
    "allTimeClosedLoad": sum(1 for r in dedup if r["kind"] == "LOAD"),
    "allTimeClosedReceive": sum(1 for r in dedup if r["kind"] == "RECEIVE"),
    "allTimeDistinctAssignees": len(by_name),
    "allTimeTop": alltime_top,
    "guruArnulfoTotal": len(guru_arnulfo),
    "guruArnulfoLoad": sum(1 for r in guru_arnulfo if r["kind"] == "LOAD"),
    "guruArnulfoReceive": sum(1 for r in guru_arnulfo if r["kind"] == "RECEIVE"),
}
print(json.dumps(summary, indent=2, default=str))
