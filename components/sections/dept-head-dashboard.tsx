"use client";

import { useState } from "react";
import axios from "axios";
import { useDeptOverview, useApproveMutation, useRejectMutation, useMyNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useClearNotifications, downloadReport, useCurrentUser, clearCurrentUser } from "@/lib/hooks/useDashboard";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  PackageIcon,
  Calendar01Icon,
  ToolsIcon,
  ArrowLeftRightIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Notification01Icon,
  UserMultipleIcon,
  Search01Icon,
  AsteriskIcon,
  AlertCircleIcon,
  Download01Icon,
  ClipboardListIcon,
  Audit01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Dept Head Persona ───────────────────────────────────────────────
const DEPT_HEAD = {
  name: "Sarah Chen",
  id: "DH-001",
  dept: "Engineering",
  position: "Department Head",
  email: "sarah.chen@company.com",
  phone: "+1 (415) 555-0201",
  initials: "SC",
  employees: 24,
  lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
};

const TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

// ─── Sidebar Nav ─────────────────────────────────────────────────────
const NAV_TOP = [
  { name: "Dashboard", icon: DashboardSquare01Icon },
];
const NAV_MAIN = [
  { name: "Department Assets",    icon: PackageIcon },
  { name: "Department Employees", icon: UserMultipleIcon },
  { name: "Bookings",             icon: Calendar01Icon },
  { name: "Transfer Requests",    icon: ArrowLeftRightIcon },
  { name: "Maintenance",          icon: ToolsIcon },
  { name: "Reports",              icon: ClipboardListIcon },
  { name: "Profile",              icon: Audit01Icon },
];

// ─── Shared StatusBadge ──────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Active:       "bg-emerald-50 text-emerald-700 border-emerald-100",
    Allocated:    "bg-neutral-950 text-white",
    Available:    "bg-emerald-50 text-emerald-700 border-emerald-100",
    Pending:      "bg-amber-50 text-amber-700 border-amber-100",
    Approved:     "bg-emerald-50 text-emerald-700 border-emerald-100",
    Rejected:     "bg-red-50 text-red-700 border-red-100",
    Completed:    "bg-neutral-100 text-neutral-600",
    Cancelled:    "bg-neutral-100 text-neutral-500",
    "In Progress":"bg-blue-50 text-blue-700 border-blue-100",
    Resolved:     "bg-emerald-50 text-emerald-700 border-emerald-100",
    Upcoming:     "bg-blue-50 text-blue-700 border-blue-100",
    Critical:     "bg-red-50 text-red-700 border-red-100",
    High:         "bg-orange-50 text-orange-700 border-orange-100",
    Medium:       "bg-amber-50 text-amber-700 border-amber-100",
    Low:          "bg-neutral-100 text-neutral-500",
    Good:         "bg-emerald-50 text-emerald-700",
    Fair:         "bg-amber-50 text-amber-700",
    Poor:         "bg-red-50 text-red-700",
    Expiring:     "bg-amber-50 text-amber-700 border-amber-100",
    Ongoing:      "bg-blue-50 text-blue-700 border-blue-100",
    Unread:       "bg-neutral-950 text-white",
  };
  const cls = map[status] ?? "bg-neutral-100 text-neutral-500";
  return (
    <span className={`inline-block text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-transparent ${cls}`}>
      {status}
    </span>
  );
};

// ─── QR Code SVG ─────────────────────────────────────────────────────
const QrSvg = ({ tag }: { tag: string }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="p-4 border border-neutral-200 rounded-xl bg-white shadow-sm">
      <svg className="w-28 h-28 text-black" viewBox="0 0 100 100">
        <rect x="5"  y="5"  width="20" height="20" fill="currentColor" />
        <rect x="10" y="10" width="10" height="10" fill="white" />
        <rect x="75" y="5"  width="20" height="20" fill="currentColor" />
        <rect x="80" y="10" width="10" height="10" fill="white" />
        <rect x="5"  y="75" width="20" height="20" fill="currentColor" />
        <rect x="10" y="80" width="10" height="10" fill="white" />
        <rect x="35" y="5"  width="10" height="15" fill="currentColor" />
        <rect x="55" y="5"  width="10" height="10" fill="currentColor" />
        <rect x="40" y="40" width="20" height="20" fill="currentColor" />
        <rect x="15" y="40" width="10" height="10" fill="currentColor" />
        <rect x="70" y="50" width="15" height="15" fill="currentColor" />
        <rect x="50" y="75" width="20" height="10" fill="currentColor" />
        <rect x="65" y="30" width="10" height="10" fill="currentColor" />
        <rect x="30" y="65" width="10" height="10" fill="currentColor" />
      </svg>
    </div>
    <span className="text-[9px] font-bold text-neutral-400 bg-neutral-50 px-2.5 py-0.5 rounded tracking-wider uppercase">{tag}</span>
  </div>
);

// ─── Mini Bar Chart ───────────────────────────────────────────────────
const MiniBar = ({ data }: { data: { label: string; value: number; max: number }[] }) => (
  <div className="space-y-2.5">
    {data.map((d, i) => (
      <div key={i} className="flex items-center gap-3 text-xs">
        <span className="w-20 text-neutral-500 font-medium truncate shrink-0">{d.label}</span>
        <div className="flex-1 bg-neutral-100 rounded-full h-1.5">
          <div className="bg-neutral-900 h-1.5 rounded-full transition-all" style={{ width: `${(d.value / d.max) * 100}%` }} />
        </div>
        <span className="w-6 text-neutral-700 font-bold text-right">{d.value}</span>
      </div>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────
export function DeptHeadDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const { data: currentUser } = useCurrentUser();
  const userName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : DEPT_HEAD.name;
  const userInitials = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()
    : DEPT_HEAD.initials;

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  // ─── Department Overview State ─────────────────────────────────────────────
  const deptQuery = useDeptOverview();
    const deptData = deptQuery.data;
    const deptInfo = deptData?.dept;
    const deptOverview = deptData?.overview || {};
    const deptAssets = deptData?.assets || [];
    const setDeptAssets = () => deptQuery.refetch();

  // ─── Department Employees State ─────────────────────────────────────────────
  const [deptEmployees, setDeptEmployees] = useState<any[]>([]);
  const employees: any[] = [];

  // ─── Bookings State ─────────────────────────────────────────────
  const bookings = deptData?.bookings || [];
  const setBookings = () => deptQuery.refetch();
  const [bookingForm, setBookingForm] = useState({ resource: "", date: "", startTime: "", endTime: "", purpose: "" });

  // ─── Transfer Requests ──────────────────────────────────────────────────
  const transferReqs = deptData?.transfers || [];
    const setTransferReqs = () => deptQuery.refetch();
    const approveTransferMut = useApproveMutation("transfers");
    const rejectTransferMut = useRejectMutation("transfers");

  // ─── Maintenance ────────────────────────────────────────────────────────
  const maintenanceReqs = deptData?.maintenance || [];
    const setMaintenanceReqs = () => deptQuery.refetch();
    const approveMaintenanceMut = useApproveMutation("maintenance");
    const rejectMaintenanceMut = useRejectMutation("maintenance");
    const approveReturnMut = useApproveMutation("returns");

  // ─── Notifications ──────────────────────────────────────────────────────
  const { data: notificationsData } = useMyNotifications();
    const notifications = notificationsData || [];
    const markAllReadMut = useMarkAllNotificationsRead();
  const clearNotifsMut = useClearNotifications();
  const markReadMut = useMarkNotificationRead();

  // ─── Reports ────────────────────────────────────────────────────────────
  const reports: any[] = deptData?.reports || [];

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean; title: string; description: string; onConfirm: () => void;
  }>({ isOpen: false, title: "", description: "", onConfirm: () => {} });

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState<{ type: string; data: Record<string, unknown> } | null>(null);
  const [drawerTab, setDrawerTab] = useState("Overview");

  // Notification tab
  const [notifTab, setNotifTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // End of state

  // ───────────────────────────────────────────────────────────────
  // GLOBAL OVERLAYS
  // ───────────────────────────────────────────────────────────────
  const renderToast = () => {
    if (!toast) return null;
    const ok = toast.type === "success";
    return (
      <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold border ${ok ? "bg-white border-neutral-200 text-neutral-900" : "bg-red-50 border-red-200 text-red-800"}`}>
        <span className={`w-2 h-2 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`} />
        {toast.message}
      </div>
    );
  };

  const renderConfirmModal = () => {
    if (!confirmModal.isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900">{confirmModal.title}</h3>
          <p className="text-xs text-neutral-500 font-medium leading-relaxed">{confirmModal.description}</p>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setConfirmModal(p => ({ ...p, isOpen: false }))} className="px-4 py-2 text-xs font-bold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-600">Cancel</button>
            <button onClick={() => { confirmModal.onConfirm(); setConfirmModal(p => ({ ...p, isOpen: false })); }} className="px-4 py-2 text-xs font-bold bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg">Confirm</button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Detail Drawer ────────────────────────────────────────────────
  const renderDrawer = () => {
    if (!drawerOpen || !drawerItem) return null;
    const { type, data } = drawerItem;
    const d = data as Record<string, string>;

    const tabSets: Record<string, string[]> = {
      asset:    ["Overview", "Current Holder", "Maintenance History", "Timeline", "QR Code"],
      employee: ["Profile", "Assigned Assets", "Recent Activities", "Maintenance History"],
      transfer: ["Request Details", "Timeline", "Comments"],
      maintenance: ["Issue Details", "Timeline", "Resolution"],
      booking:  ["Booking Details", "Timeline"],
    };
    const tabs = tabSets[type] ?? ["Overview"];

    const titleMap: Record<string, string> = {
      asset: d.name ?? "",
      employee: d.name ?? "",
      transfer: d.assetName ?? "",
      maintenance: d.assetName ?? "",
      booking: d.resource ?? "",
    };

    return (
      <div className="fixed inset-y-0 right-0 w-[460px] bg-white border-l border-neutral-200 shadow-2xl z-50 flex flex-col">
        <div className="h-16 px-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{type} Details</span>
            <h2 className="text-sm font-bold text-neutral-900 mt-0.5 truncate max-w-[320px]">{titleMap[type]}</h2>
          </div>
          <button onClick={() => { setDrawerOpen(false); setDrawerItem(null); }} className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 text-xs font-bold">✕</button>
        </div>

        <div className="px-6 border-b border-neutral-100 flex gap-4 text-xs font-semibold text-neutral-500 overflow-x-auto">
          {tabs.map((t: any) => (
            <button key={t} onClick={() => setDrawerTab(t)} className={`py-3 border-b-2 whitespace-nowrap ${drawerTab === t ? "border-black text-black" : "border-transparent hover:text-neutral-700"}`}>{t}</button>
          ))}
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs">

          {/* ── ASSET ── */}
          {type === "asset" && drawerTab === "Overview" && (
            <div className="space-y-4">
              <div className="bg-[#FBFBFB] border border-neutral-100 rounded-lg p-4 space-y-3">
                {[["Asset Tag", d.id], ["Category", d.category], ["Condition", d.condition], ["Status", d.status], ["Warranty", d.warranty], ["Location", d.location]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider">{k}</span>
                    <span className="font-semibold text-neutral-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {type === "asset" && drawerTab === "Current Holder" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                <div className="w-10 h-10 bg-neutral-950 text-white rounded-full font-bold text-sm flex items-center justify-center">{d.allocatedTo?.split(" ").map((n: string) => n[0]).join("") ?? "—"}</div>
                <div>
                  <p className="font-bold text-neutral-900">{d.allocatedTo}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{DEPT_HEAD.dept} · {d.location}</p>
                </div>
              </div>
            </div>
          )}
          {type === "asset" && drawerTab === "Maintenance History" && (
            <div className="space-y-2">
              {maintenanceReqs.filter((m: any) => m.assetId === d.id).map((m: any, i: number) => (
                <div key={i} className="p-3 border border-neutral-100 rounded-lg flex items-center justify-between bg-neutral-50/50">
                  <div>
                    <p className="font-bold text-neutral-900">{m.issue}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Created: {m.createdOn}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              ))}
              {maintenanceReqs.filter((m: any) => m.assetId === d.id).length === 0 && (
                <p className="text-neutral-400 italic text-center py-6">No maintenance history</p>
              )}
            </div>
          )}
          {type === "asset" && drawerTab === "Timeline" && (
            <div className="relative pl-6 border-l-2 border-neutral-200 space-y-6">
              {[{ t: "Allocated to " + d.allocatedTo, dt: "Jan 15, 2026" }, { t: "Registered in inventory", dt: "Jan 10, 2026" }].map((e, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-white border-2 border-black rounded-full" />
                  <p className="font-bold text-neutral-950">{e.t}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{e.dt}</p>
                </div>
              ))}
            </div>
          )}
          {type === "asset" && drawerTab === "QR Code" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <QrSvg tag={d.id} />
              <button onClick={() => triggerToast("QR Code downloaded", "success")} className="px-4 py-2 bg-black text-white rounded-lg font-bold text-[10px]">
                <HugeiconsIcon icon={Download01Icon} size={12} className="inline mr-1" />Download
              </button>
            </div>
          )}

          {/* ── EMPLOYEE ── */}
          {type === "employee" && drawerTab === "Profile" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                <div className="w-12 h-12 bg-neutral-950 text-white rounded-full font-bold text-sm flex items-center justify-center">{d.name?.split(" ").map((n: string) => n[0]).join("") ?? "?"}</div>
                <div>
                  <p className="font-bold text-neutral-900">{d.name}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{d.role} · {d.id}</p>
                  <p className="text-[10px] text-neutral-400">{d.email}</p>
                </div>
              </div>
              <div className="bg-[#FBFBFB] border border-neutral-100 rounded-lg p-4 space-y-3">
                {[["Status", d.status], ["Department", DEPT_HEAD.dept], ["Assets", d.assets + " assigned"], ["Maintenance Requests", d.maintenance], ["Active Bookings", d.bookings]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider">{k}</span>
                    <span className="font-semibold text-neutral-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {type === "employee" && drawerTab === "Assigned Assets" && (
            <div className="space-y-2">
              {deptAssets.filter((a: any) => a.allocatedTo === d.name).map((a: any, i: number) => (
                <div key={i} className="p-3 border border-neutral-100 rounded-lg flex justify-between items-center bg-neutral-50/50">
                  <div>
                    <p className="font-bold text-neutral-900">{a.name}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">#{a.id} · {a.category}</p>
                  </div>
                  <StatusBadge status={a.condition} />
                </div>
              ))}
              {deptAssets.filter((a: any) => a.allocatedTo === d.name).length === 0 && (
                <p className="text-neutral-400 italic text-center py-6">No assets assigned</p>
              )}
            </div>
          )}
          {type === "employee" && (drawerTab === "Recent Activities" || drawerTab === "Maintenance History") && (
            <p className="text-neutral-400 italic text-center py-6">No recent records found.</p>
          )}

          {/* ── TRANSFER ── */}
          {type === "transfer" && drawerTab === "Request Details" && (
            <div className="space-y-4">
              <div className="bg-[#FBFBFB] border border-neutral-100 rounded-lg p-4 space-y-3">
                {[["Asset", d.assetName], ["Requested By", d.requestedBy], ["Transfer To", d.transferTo], ["Department", d.dept], ["Reason", d.reason], ["Date", d.date], ["Status", d.status]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider">{k}</span>
                    <span className="font-semibold text-neutral-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {type === "transfer" && (drawerTab === "Timeline" || drawerTab === "Comments") && (
            <div className="relative pl-6 border-l-2 border-neutral-200 space-y-6">
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-white border-2 border-black rounded-full" />
                <p className="font-bold text-neutral-950">Request submitted by {d.requestedBy}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">{d.date}</p>
              </div>
              {d.status !== "Pending" && (
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-white border-2 border-black rounded-full" />
                  <p className="font-bold text-neutral-950">Request {d.status?.toLowerCase()}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">By Dept Head · {d.date}</p>
                </div>
              )}
            </div>
          )}

          {/* ── MAINTENANCE ── */}
          {type === "maintenance" && drawerTab === "Issue Details" && (
            <div className="space-y-3">
              <div className="bg-[#FBFBFB] border border-neutral-100 rounded-lg p-4 space-y-3">
                {[["Asset", d.assetName], ["Employee", d.employee], ["Issue Type", d.issueType], ["Priority", d.priority], ["Status", d.status], ["Created", d.createdOn], ["Technician", d.technician]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider">{k}</span>
                    <span className="font-semibold text-neutral-900">{v}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-lg">
                <p className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider mb-1">Description</p>
                <p className="font-medium text-neutral-700">{d.issue}</p>
              </div>
            </div>
          )}
          {type === "maintenance" && drawerTab === "Timeline" && (
            <div className="relative pl-6 border-l-2 border-neutral-200 space-y-6">
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-white border-2 border-black rounded-full" />
                <p className="font-bold text-neutral-950">Request submitted</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">{d.createdOn}</p>
              </div>
              {d.status !== "Pending" && (
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-white border-2 border-neutral-300 rounded-full" />
                  <p className="font-bold text-neutral-900">Technician assigned: {d.technician}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">In progress</p>
                </div>
              )}
            </div>
          )}
          {type === "maintenance" && drawerTab === "Resolution" && (
            d.status === "Resolved"
              ? <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 font-semibold text-[10px]">✓ Issue resolved. Cost: {d.cost}</div>
              : <p className="text-neutral-400 italic text-center py-6">Resolution will appear once the ticket is closed.</p>
          )}

          {/* ── BOOKING ── */}
          {type === "booking" && drawerTab === "Booking Details" && (
            <div className="bg-[#FBFBFB] border border-neutral-100 rounded-lg p-4 space-y-3">
              {[["Resource", d.resource], ["Booked By", d.bookedBy], ["Date", d.date], ["Time", `${d.start} – ${d.end}`], ["Purpose", d.purpose], ["Status", d.status]].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider">{k}</span>
                  <span className="font-semibold text-neutral-900">{v}</span>
                </div>
              ))}
            </div>
          )}
          {type === "booking" && drawerTab === "Timeline" && (
            <div className="relative pl-6 border-l-2 border-neutral-200 space-y-6">
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-white border-2 border-black rounded-full" />
                <p className="font-bold text-neutral-950">Booking created by {d.bookedBy}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Scheduled: {d.date} · {d.start}–{d.end}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────────
  // 1. DASHBOARD
  // ───────────────────────────────────────────────────────────────
  const renderDashboard = () => {
    const kpis = [
      { label: "Department Assets",        value: deptAssets.length,                                                      icon: PackageIcon },
      { label: "Employees",                value: employees.length,                                                        icon: UserMultipleIcon },
      { label: "Assets in Use",            value: deptAssets.filter((a: any) => a.status === "Allocated").length,                 icon: PackageIcon },
      { label: "Under Maintenance",        value: maintenanceReqs.filter((m: any) => m.status !== "Resolved").length,             icon: ToolsIcon },
      { label: "Active Bookings",          value: bookings.filter((b: any) => b.status === "Upcoming" || b.status === "Ongoing").length, icon: Calendar01Icon },
      { label: "Pending Transfer Approvals", value: deptOverview.pendingTransfers ?? transferReqs.filter((t: any) => t.status === "Pending").length, icon: ArrowLeftRightIcon },
      { label: "Pending Maintenance", value: deptOverview.pendingMaint ?? maintenanceReqs.filter((m: any) => m.status === "Pending Approval").length, icon: AlertCircleIcon },
      { label: "Dept Utilisation",         value: `${Math.round((deptAssets.filter((a: any) => a.status === "Allocated").length / deptAssets.length) * 100)}%`, icon: Audit01Icon },
    ];

    const catData = [
      { label: "IT Hardware",    value: deptAssets.filter((a: any) => a.category === "IT Hardware").length,    max: 10 },
      { label: "Mobile Devices", value: deptAssets.filter((a: any) => a.category === "Mobile Devices").length, max: 10 },
      { label: "Accessories",    value: deptAssets.filter((a: any) => a.category === "Accessories").length,    max: 10 },
      { label: "Peripherals",    value: deptAssets.filter((a: any) => a.category === "Peripherals").length,    max: 10 },
    ];

    const recentActivity = [
      { employee: "Chris Nguyen",  asset: "Lenovo ThinkPad X1",    activity: "Maintenance Request",  date: "Jul 12, 2026", status: "Pending" },
      { employee: "Aria Thorne",   asset: "iPad Pro 12.9\" M2",    activity: "Transfer Request",     date: "Jul 10, 2026", status: "Pending" },
      { employee: "Marcus Vance",  asset: "Dell UltraSharp 32\"",  activity: "Transfer Request",     date: "Jul 09, 2026", status: "Pending" },
      { employee: "Jordan Rivera", asset: "MacBook Pro 16\"",      activity: "Maintenance Request",  date: "Jul 11, 2026", status: "In Progress" },
      { employee: "Dev Patel",     asset: "Sony WH-1000XM5",       activity: "Asset Allocated",      date: "Jul 01, 2026", status: "Completed" },
    ];

    const pendingApprovals = [
      ...transferReqs.filter((t: any) => t.status === "Pending").map((t: any) => ({ type: "Transfer", desc: `${t.requestedBy} → ${t.assetName}`, id: t.id })),
      ...maintenanceReqs.filter((m: any) => m.status === "Pending").map((m: any) => ({ type: "Maintenance", desc: `${m.employee} — ${m.assetName}`, id: m.id })),
    ];

    return (
      <div className="space-y-8">
        {/* Dept header card */}
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-950 text-white font-extrabold text-lg flex items-center justify-center shrink-0">{userInitials}</div>
            <div>
              <h2 className="text-sm font-extrabold text-neutral-900">{DEPT_HEAD.dept} Department</h2>
              <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Head: {userName} · {DEPT_HEAD.employees} Employees</p>
            </div>
          </div>
          <p className="text-[10px] text-neutral-400 font-semibold">Updated: {DEPT_HEAD.lastUpdated}</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {kpis.map((k, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider leading-tight">{k.label}</span>
                <span className="text-neutral-400"><HugeiconsIcon icon={k.icon} size={14} /></span>
              </div>
              <p className="text-xl font-extrabold text-neutral-900 mt-3">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Charts + pending approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category distribution */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-neutral-950 uppercase tracking-wider">Asset Distribution</h3>
            <MiniBar data={catData} />
          </div>

          {/* Asset status */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-neutral-950 uppercase tracking-wider">Asset Status Overview</h3>
            <div className="flex flex-col gap-3 mt-2">
              {[
                { label: "Allocated", value: deptAssets.filter((a: any) => a.status === "Allocated").length, color: "bg-neutral-950" },
                { label: "Available", value: deptAssets.filter((a: any) => a.status === "Available").length, color: "bg-emerald-500" },
                { label: "In Service", value: deptAssets.filter((a: any) => a.status === "In Service").length, color: "bg-blue-500" },
                { label: "Under Maintenance", value: maintenanceReqs.filter((m: any) => m.status !== "Resolved").length, color: "bg-amber-500" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.color}`} />
                  <span className="text-neutral-500 flex-1 font-medium">{s.label}</span>
                  <span className="font-extrabold text-neutral-900">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-neutral-950 uppercase tracking-wider">Pending Approvals</h3>
              {pendingApprovals.length > 0 && <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{pendingApprovals.length} items</span>}
            </div>
            <div className="flex flex-col gap-2.5">
              {pendingApprovals.slice(0, 4).map((p, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 border border-neutral-100 rounded-lg bg-[#FBFBFB]">
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase">{p.type}</span>
                    <p className="text-[10px] font-semibold text-neutral-900 mt-0.5 truncate max-w-[170px]">{p.desc}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => { if (p.type === "Transfer") { approveTransferMut.mutate(p.id, { onSuccess: () => { triggerToast("Transfer approved", "success"); }, onError: (e: any) => triggerToast(e.response?.data?.error || e.message, "error") }); } else { approveMaintenanceMut.mutate(p.id, { onSuccess: () => { triggerToast("Maintenance approved", "success"); }, onError: (e: any) => triggerToast(e.response?.data?.error || e.message, "error") }); } }} className="px-2 py-0.5 text-[9px] font-bold bg-black text-white rounded">✓</button>
                    <button onClick={() => { if (p.type === "Transfer") { rejectTransferMut.mutate({ id: p.id }, { onSuccess: () => { triggerToast("Transfer rejected", "error"); }, onError: (e: any) => triggerToast(e.response?.data?.error || e.message, "error") }); } }} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 text-neutral-600 rounded hover:bg-neutral-50">✕</button>
                  </div>
                </div>
              ))}
              {pendingApprovals.length === 0 && <p className="text-xs text-neutral-400 italic text-center py-4">No pending approvals</p>}
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-neutral-950 uppercase tracking-wider">Recent Department Activity</h3>
            <div className="flex gap-2">
              {[{ label: "View Assets", tab: "Department Assets" }, { label: "Approve Requests", tab: "Transfer Requests" }, { label: "Book Resource", tab: "Bookings" }, { label: "Reports", tab: "Reports" }].map((a: any, i: number) => (
                <button key={i} onClick={() => setActiveTab(a.tab)} className="px-3 py-1.5 text-[10px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-700">{a.label}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto text-xs">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-100">
                  {["Employee", "Asset", "Activity", "Date", "Status"].map(h => (
                    <TableHead key={h} className="font-bold text-neutral-400 text-[9px] uppercase tracking-wider">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((row, i) => (
                  <TableRow key={i} className="border-neutral-50 hover:bg-neutral-50/50">
                    <TableCell className="py-3 font-semibold text-neutral-900">{row.employee}</TableCell>
                    <TableCell className="py-3 text-neutral-500 font-medium">{row.asset}</TableCell>
                    <TableCell className="py-3 text-neutral-500">{row.activity}</TableCell>
                    <TableCell className="py-3 text-neutral-400">{row.date}</TableCell>
                    <TableCell className="py-3"><StatusBadge status={row.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────────
  // 2. DEPARTMENT ASSETS
  // ───────────────────────────────────────────────────────────────
  const renderDeptAssets = () => {
    const [catF, statF] = ["All", "All"];
    const filtered = deptAssets.filter((a: any) => {
      const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase()) || a.allocatedTo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });

    return (
      <div className="space-y-6 bg-white border border-neutral-200/80 rounded-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Department Assets</h3>
            <p className="text-xs text-neutral-400 font-medium mt-0.5">All assets assigned within the {DEPT_HEAD.dept} department</p>
          </div>
          <span className="text-[10px] font-bold text-neutral-400 bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded-full">{deptAssets.length} total assets</span>
        </div>
        <div className="flex flex-wrap gap-3 bg-[#FBFBFB] p-3 border border-neutral-100 rounded-lg text-xs">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"><HugeiconsIcon icon={Search01Icon} size={13} /></span>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, tag, or employee…" className="pl-8 pr-3 py-1.5 border border-neutral-200 rounded-lg w-64 bg-white focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          <select className="px-3 py-1.5 border border-neutral-200 rounded-lg bg-white">
            <option>All Categories</option><option>IT Hardware</option><option>Mobile Devices</option><option>Accessories</option><option>Peripherals</option>
          </select>
          <select className="px-3 py-1.5 border border-neutral-200 rounded-lg bg-white">
            <option>All Statuses</option><option>Allocated</option><option>Available</option><option>In Service</option>
          </select>
          <select className="px-3 py-1.5 border border-neutral-200 rounded-lg bg-white">
            <option>All Employees</option>
            {employees.map(e => <option key={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-100">
                {["Asset Tag", "Asset Name", "Allocated To", "Category", "Condition", "Status", "Warranty", "Actions"].map(h => (
                  <TableHead key={h} className="font-bold text-neutral-400 text-[9px] uppercase tracking-wider">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((asset: any) => (
                <TableRow key={asset.id} onClick={() => { setDrawerItem({ type: "asset", data: asset as unknown as Record<string, unknown> }); setDrawerTab("Overview"); setDrawerOpen(true); }} className="border-neutral-50 hover:bg-neutral-50/50 cursor-pointer">
                  <TableCell className="py-4 text-[10px] font-bold text-neutral-450">#{asset.id}</TableCell>
                  <TableCell className="py-4 text-xs font-semibold text-neutral-900">{asset.name}</TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-neutral-200 text-neutral-600 rounded-full text-[8px] font-bold flex items-center justify-center">{asset.allocatedTo.split(" ").map((n: any) => n[0]).join("").slice(0,2)}</div>
                      <span className="text-xs text-neutral-700 font-medium">{asset.allocatedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-xs text-neutral-500 font-medium">{asset.category}</TableCell>
                  <TableCell className="py-4"><StatusBadge status={asset.condition} /></TableCell>
                  <TableCell className="py-4"><StatusBadge status={asset.status} /></TableCell>
                  <TableCell className="py-4"><StatusBadge status={asset.warranty} /></TableCell>
                  <TableCell className="py-4" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setDrawerItem({ type: "asset", data: asset as unknown as Record<string, unknown> }); setDrawerTab("Overview"); setDrawerOpen(true); }} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded">View</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────────
  // 3. DEPARTMENT EMPLOYEES
  // ───────────────────────────────────────────────────────────────
  const renderDeptEmployees = () => {
    const cards = [
      { label: "Total Employees",       value: employees.length },
      { label: "Assets Assigned",       value: employees.reduce((acc, e) => acc + e.assets, 0) },
      { label: "No Assets Assigned",    value: employees.filter((e: any) => e.assets === 0).length },
      { label: "Pending Requests",      value: transferReqs.filter((t: any) => t.status === "Pending").length + maintenanceReqs.filter((m: any) => m.status === "Pending").length },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((k, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-5 shadow-sm">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{k.label}</p>
              <p className="text-xl font-extrabold text-neutral-900 mt-2">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Team Members</h3>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"><HugeiconsIcon icon={Search01Icon} size={13} /></span>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search employees…" className="pl-8 pr-3 py-1.5 border border-neutral-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
          </div>
          <div className="overflow-x-auto text-xs">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-100">
                  {["Employee", "Role", "Assets", "Maintenance", "Bookings", "Status", "Actions"].map(h => (
                    <TableHead key={h} className="font-bold text-neutral-400 text-[9px] uppercase tracking-wider">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.filter((e: any) => e.name.toLowerCase().includes(searchQuery.toLowerCase())).map((emp: any) => (
                  <TableRow key={emp.id} onClick={() => { setDrawerItem({ type: "employee", data: emp as unknown as Record<string, unknown> }); setDrawerTab("Profile"); setDrawerOpen(true); }} className="border-neutral-50 hover:bg-neutral-50/50 cursor-pointer">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-neutral-950 text-white rounded-full font-bold text-[9px] flex items-center justify-center">{emp.name.split(" ").map((n: any) => n[0]).join("")}</div>
                        <div>
                          <p className="font-bold text-neutral-900">{emp.name}</p>
                          <p className="text-[9px] text-neutral-400">{emp.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-neutral-500 font-medium">{emp.role}</TableCell>
                    <TableCell className="py-3 font-bold text-neutral-900">{emp.assets}</TableCell>
                    <TableCell className="py-3 font-bold text-neutral-900">{emp.maintenance}</TableCell>
                    <TableCell className="py-3 font-bold text-neutral-900">{emp.bookings}</TableCell>
                    <TableCell className="py-3"><StatusBadge status={emp.status} /></TableCell>
                    <TableCell className="py-3" onClick={e => e.stopPropagation()}>
                      <button onClick={() => { setDrawerItem({ type: "employee", data: emp as unknown as Record<string, unknown> }); setDrawerTab("Profile"); setDrawerOpen(true); }} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded">View</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────────
  // 4. BOOKINGS
  // ───────────────────────────────────────────────────────────────
  const renderBookings = () => {
    const resources = ["Conference Room A", "Conference Room B", "Sony 4K Projector", "Lab Room A", "Lab Room B", "Company Van"];

    const handleBook = (e: React.FormEvent) => {
      e.preventDefault();
      if (!bookingForm.resource || !bookingForm.date) { triggerToast("Please fill all required fields", "error"); return; }
      const overlap = bookings.some((b: any) => b.resource === bookingForm.resource && b.date === bookingForm.date && b.status !== "Cancelled" && b.status !== "Completed" && !(bookingForm.endTime <= b.start || bookingForm.startTime >= b.end));
      if (overlap) { triggerToast(`Time conflict: ${bookingForm.resource} is already booked then`, "error"); return; }
      const nb = { id: `BKG-${100 + bookings.length}`, resource: bookingForm.resource, bookedBy: DEPT_HEAD.name, purpose: bookingForm.purpose, date: bookingForm.date, start: bookingForm.startTime, end: bookingForm.endTime, status: "Upcoming" };
      deptQuery.refetch();
      setBookingForm({ resource: "", date: "", startTime: "", endTime: "", purpose: "" });
      triggerToast(`Booking confirmed for ${nb.resource}`, "success");
    };

    const cards = [
      { label: "Upcoming",  value: bookings.filter((b: any) => b.status === "Upcoming").length },
      { label: "Ongoing",   value: bookings.filter((b: any) => b.status === "Ongoing").length },
      { label: "Completed", value: bookings.filter((b: any) => b.status === "Completed").length },
      { label: "Cancelled", value: bookings.filter((b: any) => b.status === "Cancelled").length },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((k, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-5 shadow-sm">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{k.label}</p>
              <p className="text-xl font-extrabold text-neutral-900 mt-2">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Book a Resource</h3>
            <form onSubmit={handleBook} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Resource *</label>
                <select value={bookingForm.resource} onChange={e => setBookingForm(p => ({ ...p, resource: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black">
                  <option value="">— Select —</option>
                  {resources.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Date *</label>
                <input type="date" value={bookingForm.date} onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Start</label>
                  <input type="time" value={bookingForm.startTime} onChange={e => setBookingForm(p => ({ ...p, startTime: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none" />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">End</label>
                  <input type="time" value={bookingForm.endTime} onChange={e => setBookingForm(p => ({ ...p, endTime: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Purpose</label>
                <input type="text" placeholder="e.g. Team Sprint Review" value={bookingForm.purpose} onChange={e => setBookingForm(p => ({ ...p, purpose: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <button type="submit" className="w-full py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs">Confirm Booking</button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Department Bookings</h3>
            <div className="overflow-x-auto text-xs">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-100">
                    {["Resource", "Booked By", "Date", "Time", "Purpose", "Status", "Actions"].map(h => (
                      <TableHead key={h} className="font-bold text-neutral-400 text-[9px] uppercase tracking-wider">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((bkg: any) => (
                    <TableRow key={bkg.id} onClick={() => { setDrawerItem({ type: "booking", data: bkg as unknown as Record<string, unknown> }); setDrawerTab("Booking Details"); setDrawerOpen(true); }} className="border-t border-neutral-50 hover:bg-neutral-50/50 cursor-pointer">
                      <td className="py-3 font-bold text-neutral-900">{bkg.resource}</td>
                      <td className="py-3 text-neutral-500">{bkg.bookedBy}</td>
                      <td className="py-3 text-neutral-400">{bkg.date}</td>
                      <td className="py-3 text-neutral-400">{bkg.start}–{bkg.end}</td>
                      <td className="py-3 text-neutral-500 font-medium max-w-[120px] truncate">{bkg.purpose}</td>
                      <td className="py-3"><StatusBadge status={bkg.status} /></td>
                      <td className="py-3" onClick={e => e.stopPropagation()}>
                        {bkg.status === "Upcoming" && (
                          <button onClick={() => setConfirmModal({ isOpen: true, title: "Cancel Booking?", description: `Cancel booking for ${bkg.resource} on ${bkg.date}?`, onConfirm: () => { triggerToast("Booking cancelled", "success"); deptQuery.refetch(); } })} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded text-neutral-600">Cancel</button>
                        )}
                      </td>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────────
  // 5. TRANSFER REQUESTS
  // ───────────────────────────────────────────────────────────────
  const renderTransfers = () => {
    const cards = [
      { label: "Pending",   value: transferReqs.filter((t: any) => t.status === "Pending").length,   color: "text-amber-600" },
      { label: "Approved",  value: transferReqs.filter((t: any) => t.status === "Approved").length,  color: "text-emerald-600" },
      { label: "Rejected",  value: transferReqs.filter((t: any) => t.status === "Rejected").length,  color: "text-red-600" },
      { label: "Completed", value: transferReqs.filter((t: any) => t.status === "Completed").length, color: "text-neutral-600" },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((k, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-5 shadow-sm">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{k.label}</p>
              <p className={`text-xl font-extrabold mt-2 ${k.color}`}>{k.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
          <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Transfer Requests — Awaiting Approval</h3>
          <div className="overflow-x-auto text-xs">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-100">
                  {["Asset", "Requested By", "Transfer To", "Department", "Requested", "Status", "Actions"].map(h => (
                    <TableHead key={h} className="font-bold text-neutral-400 text-[9px] uppercase tracking-wider">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transferReqs.map((req: any) => (
                  <TableRow key={req.id} onClick={() => { setDrawerItem({ type: "transfer", data: req as unknown as Record<string, unknown> }); setDrawerTab("Request Details"); setDrawerOpen(true); }} className="border-t border-neutral-50 hover:bg-neutral-50/50 cursor-pointer">
                    <td className="py-3 font-bold text-neutral-900 max-w-[140px] truncate">{req.assetName}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-neutral-200 rounded-full text-[8px] font-bold flex items-center justify-center text-neutral-600">{req.requestedBy.split(" ").map((n: any) => n[0]).join("")}</div>
                        <span className="font-medium text-neutral-700">{req.requestedBy}</span>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-700 font-semibold">{req.transferTo}</td>
                    <td className="py-3 text-neutral-500">{req.dept}</td>
                    <td className="py-3 text-neutral-400">{req.date}</td>
                    <td className="py-3"><StatusBadge status={req.status} /></td>
                    <td className="py-3" onClick={e => e.stopPropagation()}>
                      {req.status === "Pending" && (
                        <div className="flex gap-1.5">
                          <button onClick={() => setConfirmModal({ isOpen: true, title: "Approve Transfer?", description: `Approve transfer of ${req.assetName} from ${req.requestedBy} to ${req.transferTo}?`, onConfirm: () => { approveTransferMut.mutate(req.id, { onSuccess: () => triggerToast("Transfer approved", "success"), onError: (e: any) => triggerToast(e.response?.data?.error || e.message, "error") }); } })} className="px-2 py-0.5 text-[9px] font-bold bg-neutral-950 text-white rounded">Approve</button>
                          <button onClick={() => setConfirmModal({ isOpen: true, title: "Reject Transfer?", description: `Reject the transfer request from ${req.requestedBy}?`, onConfirm: () => { rejectTransferMut.mutate({ id: req.id }, { onSuccess: () => triggerToast("Transfer rejected", "error"), onError: (e: any) => triggerToast(e.response?.data?.error || e.message, "error") }); } })} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded text-neutral-600">Reject</button>
                        </div>
                      )}
                      {req.status !== "Pending" && (
                        <button onClick={() => { setDrawerItem({ type: "transfer", data: req as unknown as Record<string, unknown> }); setDrawerTab("Request Details"); setDrawerOpen(true); }} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded">View</button>
                      )}
                    </td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────────
  // 6. MAINTENANCE
  // ───────────────────────────────────────────────────────────────
  const renderMaintenance = () => {
    const cards = [
      { label: "Pending",     value: maintenanceReqs.filter((m: any) => m.status === "Pending").length,     color: "text-amber-600" },
      { label: "In Progress", value: maintenanceReqs.filter((m: any) => m.status === "In Progress").length, color: "text-blue-600" },
      { label: "Resolved",    value: maintenanceReqs.filter((m: any) => m.status === "Resolved").length,    color: "text-emerald-600" },
      { label: "Critical",    value: maintenanceReqs.filter((m: any) => m.priority === "Critical").length,  color: "text-red-600" },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((k, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-5 shadow-sm">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{k.label}</p>
              <p className={`text-xl font-extrabold mt-2 ${k.color}`}>{k.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
          <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Department Maintenance Requests</h3>
          <div className="overflow-x-auto text-xs">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-100">
                  {["Asset", "Employee", "Issue", "Priority", "Status", "Technician", "Created", "Actions"].map(h => (
                    <TableHead key={h} className="font-bold text-neutral-400 text-[9px] uppercase tracking-wider">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceReqs.map((req: any) => (
                  <TableRow key={req.id} onClick={() => { setDrawerItem({ type: "maintenance", data: req as unknown as Record<string, unknown> }); setDrawerTab("Issue Details"); setDrawerOpen(true); }} className="border-t border-neutral-50 hover:bg-neutral-50/50 cursor-pointer">
                    <td className="py-3 font-bold text-neutral-900 max-w-[130px] truncate">{req.assetName}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-neutral-200 rounded-full text-[8px] font-bold flex items-center justify-center text-neutral-600">{req.employee.split(" ").map((n: any) => n[0]).join("")}</div>
                        <span className="text-neutral-700 font-medium">{req.employee}</span>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-500 max-w-[130px] truncate">{req.issue}</td>
                    <td className="py-3"><StatusBadge status={req.priority} /></td>
                    <td className="py-3"><StatusBadge status={req.status} /></td>
                    <td className="py-3 text-neutral-500">{req.technician}</td>
                    <td className="py-3 text-neutral-400">{req.createdOn}</td>
                    <td className="py-3" onClick={e => e.stopPropagation()}>
                      {req.status === "Pending" && (
                        <button onClick={() => setConfirmModal({ isOpen: true, title: "Approve Maintenance?", description: `Approve maintenance request for ${req.assetName}?`, onConfirm: () => { approveMaintenanceMut.mutate(req.id, { onSuccess: () => triggerToast("Maintenance approved", "success"), onError: (e: any) => triggerToast(e.response?.data?.error || e.message, "error") }); } })} className="px-2 py-0.5 text-[9px] font-bold bg-neutral-950 text-white rounded">Approve</button>
                      )}
                      {req.status !== "Pending" && (
                        <button onClick={() => { setDrawerItem({ type: "maintenance", data: req as unknown as Record<string, unknown> }); setDrawerTab("Issue Details"); setDrawerOpen(true); }} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded">View</button>
                      )}
                    </td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────────
  // 7. REPORTS
  // ───────────────────────────────────────────────────────────────
  const renderReports = () => {
    const reportCards = [
      { title: "Department Asset Report",    desc: "Full inventory and allocation summary for the department", icon: PackageIcon },
      { title: "Employee Asset Report",      desc: "Per-employee breakdown of all assigned assets",            icon: UserMultipleIcon },
      { title: "Maintenance Report",         desc: "Open, in-progress, and resolved maintenance analysis",     icon: ToolsIcon },
      { title: "Transfer Report",            desc: "All approved, rejected, and pending transfer requests",    icon: ArrowLeftRightIcon },
      { title: "Booking Utilisation Report", desc: "Resource usage and booking pattern analytics",             icon: Calendar01Icon },
      { title: "Utilisation Report",         desc: "Department asset utilisation rate and idle asset tracking", icon: Audit01Icon },
    ];

    return (
      <div className="space-y-8">
        {/* Report cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportCards.map((r, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-50 rounded-lg text-neutral-500"><HugeiconsIcon icon={r.icon} size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">{r.title}</h4>
                  <p className="text-[10px] text-neutral-400 mt-1 font-medium">{r.desc}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["CSV", "Excel", "PDF"].map(fmt => (
                  <button key={fmt} onClick={async () => { try { const map: Record<string, any> = { 'Department Asset Report': 'assets', 'Employee Asset Report': 'allocations', 'Maintenance Report': 'maintenance', 'Transfer Report': 'transfers' }; const key = map[r.title]; if (key && fmt === 'CSV') { await downloadReport(key, deptInfo?.id); triggerToast(`${r.title} downloaded!`, 'success'); } else { triggerToast(`${fmt} export coming soon`, 'success'); } } catch (e: any) { triggerToast(e.message, 'error'); } }} className="px-3 py-1 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-lg flex items-center gap-1">
                    <HugeiconsIcon icon={Download01Icon} size={10} />{fmt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recent reports table */}
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
          <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Recent Reports</h3>
          <div className="overflow-x-auto text-xs">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-100">
                  {["Report Name", "Generated Date", "Generated By", "Format", "Actions"].map(h => (
                    <TableHead key={h} className="font-bold text-neutral-400 text-[9px] uppercase tracking-wider">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r, i) => (
                  <TableRow key={i} className="border-t border-neutral-50 hover:bg-neutral-50/50">
                    <TableCell className="py-3 font-semibold text-neutral-900">{r.name}</TableCell>
                    <TableCell className="py-3 text-neutral-400">{r.date}</TableCell>
                    <TableCell className="py-3 text-neutral-500">{r.by}</TableCell>
                    <TableCell className="py-3"><span className="text-[9px] font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">{r.format}</span></TableCell>
                    <TableCell className="py-3">
                      <button onClick={() => triggerToast(`Downloading "${r.name}"`, "success")} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded flex items-center gap-1">
                        <HugeiconsIcon icon={Download01Icon} size={10} />Download
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────────
  // 8. NOTIFICATIONS
  // ───────────────────────────────────────────────────────────────
  const renderNotifications = () => {
    const tabs = ["All", "Transfers", "Maintenance", "Bookings", "Assets", "Unread"];
    const filtered = notifications.filter((n: any) => {
      if (notifTab === "All") return true;
      if (notifTab === "Unread") return !n.read;
      return n.category === notifTab;
    });

    return (
      <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">{notifications.filter((n: any) => !n.read).length} unread</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { markAllReadMut.mutate(undefined, { onSuccess: () => triggerToast("All marked as read", "success") }); triggerToast("All marked as read", "success"); }} className="px-3 py-1.5 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-lg">Mark All Read</button>
            <button onClick={() => setConfirmModal({ isOpen: true, title: "Clear All Notifications?", description: "This will permanently delete all notifications.", onConfirm: () => { clearNotifsMut.mutate(); triggerToast("Cleared", "success"); } })} className="px-3.5 py-1.5 text-xs font-bold bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg">Clear All</button>
          </div>
        </div>

        <div className="flex gap-1 flex-wrap border-b border-neutral-100">
          {tabs.map((t: any) => (
            <button key={t} onClick={() => setNotifTab(t)} className={`px-3 py-2 text-[10px] font-bold rounded-t-lg transition-colors ${notifTab === t ? "bg-neutral-950 text-white" : "text-neutral-500 hover:text-neutral-700"}`}>{t}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(n => (
            <div key={n.id} className={`flex items-start justify-between p-4 border border-neutral-100 rounded-xl bg-[#FBFBFB] ${!n.read ? "border-l-4 border-l-black" : ""}`}>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={n.priority} />
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{n.category}</span>
                </div>
                <p className="text-xs font-bold text-neutral-900 mt-1">{n.title}</p>
                <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">{n.description}</p>
                <p className="text-[9px] text-neutral-400 font-semibold mt-1">{n.timestamp}</p>
              </div>
              <div className="flex gap-1.5 ml-3 shrink-0">
                {!n.read && <button onClick={() => markReadMut?.mutate(n.id)} className="px-2 py-1 border border-neutral-200 hover:bg-neutral-100 rounded-lg text-[9px] font-bold text-neutral-600">Read</button>}
                <button onClick={() => clearNotifsMut.mutate()} className="px-2 py-1 border border-neutral-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 rounded-lg text-[9px] font-bold text-neutral-600">Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-xs text-neutral-400 italic text-center py-12">No notifications in this category</p>}
        </div>
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────────
  // 9. PROFILE
  // ───────────────────────────────────────────────────────────────
  const renderProfile = () => {
    const stats = [
      { label: "Employees Managed",  value: DEPT_HEAD.employees },
      { label: "Department Assets",  value: deptAssets.length },
      { label: "Approvals Completed", value: transferReqs.filter((t: any) => t.status !== "Pending").length + maintenanceReqs.filter((m: any) => m.status !== "Pending").length },
      { label: "Reports Generated",  value: reports.length },
    ];

    const approvalHistory = [
      { action: "Approved transfer: Sony WH-1000XM5",  date: "Jul 05, 2026" },
      { action: "Approved maintenance: HP LaserJet",   date: "Jul 01, 2026" },
      { action: "Rejected transfer: iPad mini (EMP-109)", date: "Jun 28, 2026" },
    ];

    return (
      <div className="space-y-6 max-w-2xl">
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-16 h-16 rounded-xl bg-neutral-950 text-white font-extrabold text-2xl flex items-center justify-center shrink-0">{userInitials}</div>
          <div className="flex-1 space-y-1 text-center md:text-left">
            <h3 className="text-base font-extrabold text-neutral-900">{userName}</h3>
            <p className="text-xs text-neutral-500 font-medium">{DEPT_HEAD.position} · {DEPT_HEAD.dept}</p>
            <p className="text-[10px] text-neutral-400 mt-1">{currentUser?.email || DEPT_HEAD.email} · {DEPT_HEAD.phone}</p>
            <p className="text-[10px] text-neutral-400">ID: {DEPT_HEAD.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-5 text-center shadow-sm">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-extrabold text-neutral-900 mt-2">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-lg overflow-hidden text-xs">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h4 className="font-bold text-neutral-900 text-xs">Notification Preferences</h4>
            <p className="text-[9px] text-neutral-400 mt-0.5">Control which approval alerts and team updates you receive</p>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: "Email notifications for pending transfer approvals", checked: true },
              { label: "Push alerts for critical maintenance requests", checked: true },
              { label: "Weekly department asset summary digest", checked: true },
              { label: "Booking reminders for department resources", checked: false },
              { label: "New employee onboarding asset notifications", checked: false },
            ].map((pref, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked={pref.checked} className="w-4 h-4 rounded border-neutral-300 cursor-pointer" />
                <span className="text-neutral-600 group-hover:text-neutral-900 transition-colors font-medium">{pref.label}</span>
              </label>
            ))}
            <button onClick={() => triggerToast("Preferences saved", "success")} className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs">Save Preferences</button>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
          <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Approval History</h3>
          <div className="relative pl-5 border-l-2 border-neutral-100 space-y-5">
            {approvalHistory.map((a: any, i: number) => (
              <div key={i} className="relative">
                <span className="absolute -left-[25px] top-1 w-2 h-2 bg-white border-2 border-neutral-400 rounded-full" />
                <p className="text-xs font-semibold text-neutral-900">{a.action}</p>
                <p className="text-[9px] text-neutral-400 mt-0.5">{a.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────────
  // PAGE META
  // ───────────────────────────────────────────────────────────────
  const PAGE_DESCS: Record<string, string> = {
    "Dashboard":             `Overview of the ${DEPT_HEAD.dept} department — assets, employees, pending approvals, and utilisation metrics.`,
    "Department Assets":     "View and monitor all assets allocated within your department.",
    "Department Employees":  "Track team members, their assigned assets, and open requests.",
    "Bookings":              "Manage department resource bookings and approve or cancel reservations.",
    "Transfer Requests":     "Review and approve or reject asset transfer requests raised by your team.",
    "Maintenance":           "Monitor and approve maintenance requests for department assets.",
    "Reports":               "Generate and export department-level asset, maintenance, and utilisation reports.",
    "Profile":               "Manage your department head profile, preferences, and review approval history.",
  };

  const renderView = () => {
    switch (activeTab) {
      case "Dashboard":             return renderDashboard();
      case "Department Assets":     return renderDeptAssets();
      case "Department Employees":  return renderDeptEmployees();
      case "Bookings":              return renderBookings();
      case "Transfer Requests":     return renderTransfers();
      case "Maintenance":           return renderMaintenance();
      case "Reports":               return renderReports();
      case "Notifications":         return renderNotifications();
      case "Profile":               return renderProfile();
      default:                      return renderDashboard();
    }
  };

  // ───────────────────────────────────────────────────────────────
  // LAYOUT
  // ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#F9F9F9] text-neutral-900 font-sans overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <motion.div
        animate={{ width: isSidebarOpen ? 220 : 60 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-white border-r border-neutral-200/80 flex flex-col shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-100 shrink-0">
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-neutral-950 text-white rounded-lg flex items-center justify-center"><HugeiconsIcon icon={AsteriskIcon} size={16} /></div>
                <span className="font-bold text-sm tracking-tight">AssetFlow</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500"><HugeiconsIcon icon={ArrowLeft01Icon} size={16} /></button>
            </>
          ) : (
            <button onClick={() => setIsSidebarOpen(true)} className="mx-auto p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500"><HugeiconsIcon icon={ArrowRight01Icon} size={16} /></button>
          )}
        </div>

        {/* Partition 1 — Overview */}
        <div className="p-4 py-3 space-y-1">
          {NAV_TOP.map(item => {
            const isActive = activeTab === item.name;
            return (
              <button key={item.name} onClick={() => setActiveTab(item.name)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive ? "bg-neutral-950 text-white font-medium" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"}`}>
                <div className={isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-600"}><HugeiconsIcon icon={item.icon} size={19} /></div>
                {isSidebarOpen && <span className="text-sm">{item.name}</span>}
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="px-4 py-2 flex items-center gap-2">
          <div className="flex-1 border-t border-neutral-200/60" />
          {isSidebarOpen && <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1">Department</span>}
          <div className="flex-1 border-t border-neutral-200/60" />
        </div>

        {/* Partition 2 — Department */}
        <div className="p-4 py-3 space-y-1 flex-1">
          {NAV_MAIN.map(item => {
            const isActive = activeTab === item.name;
            return (
              <button key={item.name} onClick={() => setActiveTab(item.name)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive ? "bg-neutral-950 text-white font-medium" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"}`}>
                <div className={isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-600"}><HugeiconsIcon icon={item.icon} size={19} /></div>
                {isSidebarOpen && <span className="text-sm">{item.name}</span>}
              </button>
            );
          })}
        </div>

        {/* Sign Out + profile */}
        <div className="p-3 border-t border-neutral-100 shrink-0 space-y-2">
          <button
            onClick={async () => {
              clearCurrentUser();
              try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
              window.location.href = "/login-in";
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-red-600 hover:text-red-700 hover:bg-red-50/50 group"
          >
            <div className="text-red-500 group-hover:text-red-600 shrink-0">
              <HugeiconsIcon icon={Logout01Icon} size={18} />
            </div>
            {isSidebarOpen && <span className="text-sm font-semibold">Sign Out</span>}
          </button>

          <div className="flex items-center gap-2 px-1">
            <div className="w-6 h-6 rounded-full bg-neutral-950 text-white font-bold text-[9px] flex items-center justify-center shrink-0">{userInitials}</div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-neutral-700 truncate leading-none">{userName}</p>
                <p className="text-[9px] text-neutral-400 mt-0.5">{DEPT_HEAD.position}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Main ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-16 bg-white border-b border-neutral-200/80 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            <span>AssetFlow</span>
            <span className="text-neutral-300">/</span>
            <span>Dept Head</span>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-700 font-semibold">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button
              onClick={() => setActiveTab("Notifications")}
              className={`p-2 hover:bg-neutral-100 rounded-lg transition-colors relative ${activeTab === "Notifications" ? "text-neutral-900 bg-neutral-100" : "text-neutral-500"}`}
            >
              <HugeiconsIcon icon={Notification01Icon} size={19} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-neutral-900 rounded-full border border-white" />
              )}
            </button>

            <div className="h-8 w-px bg-neutral-200" />

            {/* Dynamic identity */}
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-7 h-7 bg-neutral-950 text-white rounded-lg flex items-center justify-center text-[10px] font-extrabold">{userInitials}</div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-neutral-900 leading-none">{userName}</span>
                <span className="text-[9px] font-medium text-neutral-400 mt-0.5 leading-none">{DEPT_HEAD.position}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {/* Page header */}
          <div className="flex flex-col gap-1.5 border-b border-neutral-200/50 pb-5">
            <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              <span>AssetFlow</span>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-700 font-semibold">{activeTab}</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 mt-1">{activeTab}</h1>
            <p className="text-xs text-neutral-500 font-medium">{PAGE_DESCS[activeTab] ?? ""}</p>
          </div>

          {renderView()}
        </main>
      </div>

      {/* Overlays */}
      {renderDrawer()}
      {renderToast()}
      {renderConfirmModal()}
    </div>
  );
}



