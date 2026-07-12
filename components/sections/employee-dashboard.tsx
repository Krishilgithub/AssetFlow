"use client";

import { useState } from "react";
import Link from "next/link";
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
  CalendarClockIcon,
  ClipboardListIcon,
  ArrowUpDownIcon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Employee Mock Data ──────────────────────────────────────────────
const EMPLOYEE = {
  name: "Jordan Rivera",
  id: "EMP-214",
  dept: "Engineering",
  email: "jordan.rivera@company.com",
  phone: "+1 (415) 555-0192",
  initials: "JR",
  joined: "Mar 14, 2024",
};

const TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// ─── Nav Items ───────────────────────────────────────────────────────
const NAV_ITEMS_TOP = [
  { name: "Dashboard", icon: DashboardSquare01Icon },
];

const NAV_ITEMS_MAIN = [
  { name: "My Assets",         icon: PackageIcon },
  { name: "Book Resources",    icon: Calendar01Icon },
  { name: "Maintenance",       icon: ToolsIcon },
  { name: "Transfer Requests", icon: ArrowLeftRightIcon },
  { name: "Return Requests",   icon: ArrowUpDownIcon },
  { name: "Profile",           icon: UserMultipleIcon },
];

// ─── Shared badge helper ─────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Active:      "bg-emerald-50 text-emerald-700 border-emerald-100",
    Allocated:   "bg-neutral-950 text-white",
    Available:   "bg-emerald-50 text-emerald-700 border-emerald-100",
    Pending:     "bg-amber-50 text-amber-700 border-amber-100",
    Approved:    "bg-emerald-50 text-emerald-700 border-emerald-100",
    Rejected:    "bg-red-50 text-red-700 border-red-100",
    Completed:   "bg-neutral-100 text-neutral-600",
    Cancelled:   "bg-neutral-100 text-neutral-500",
    "In Progress":"bg-blue-50 text-blue-700 border-blue-100",
    Resolved:    "bg-emerald-50 text-emerald-700 border-emerald-100",
    Upcoming:    "bg-blue-50 text-blue-700 border-blue-100",
    Expiring:    "bg-amber-50 text-amber-700 border-amber-100",
    Good:        "bg-emerald-50 text-emerald-700",
    Fair:        "bg-amber-50 text-amber-700",
    Poor:        "bg-red-50 text-red-700",
    Overdue:     "bg-red-50 text-red-700 border-red-100",
    Unread:      "bg-neutral-950 text-white",
  };
  const cls = map[status] ?? "bg-neutral-100 text-neutral-500";
  return (
    <span className={`inline-block text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-transparent ${cls}`}>
      {status}
    </span>
  );
};

// ─── QR SVG ─────────────────────────────────────────────────────────
const QrSvg = ({ tag }: { tag: string }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="p-4 border border-neutral-200 rounded-xl bg-white shadow-sm">
      <svg className="w-28 h-28 text-black" viewBox="0 0 100 100">
        <rect x="5" y="5" width="20" height="20" fill="currentColor" />
        <rect x="10" y="10" width="10" height="10" fill="white" />
        <rect x="75" y="5" width="20" height="20" fill="currentColor" />
        <rect x="80" y="10" width="10" height="10" fill="white" />
        <rect x="5" y="75" width="20" height="20" fill="currentColor" />
        <rect x="10" y="80" width="10" height="10" fill="white" />
        <rect x="35" y="5" width="10" height="15" fill="currentColor" />
        <rect x="55" y="5" width="10" height="10" fill="currentColor" />
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

// ─── Main Component ──────────────────────────────────────────────────
export function EmployeeDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", description: "", onConfirm: () => {} });

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState<{ type: string; data: Record<string, unknown> } | null>(null);
  const [drawerTab, setDrawerTab] = useState("Overview");

  // Search / filter
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Notification tab
  const [notifTab, setNotifTab] = useState("All");
  const [myAssets, setMyAssets] = useState<any[]>([]);

  // Mock Data arrays cleared to be dynamic later
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingForm, setBookingForm] = useState({ resource: "", date: "", startTime: "", endTime: "", purpose: "" });

  // ─── Maintenance Requests State ─────────────────────────────────
  const [maintenanceReqs, setMaintenanceReqs] = useState<any[]>([]);
  const [maintForm, setMaintForm] = useState({ assetId: "", issueType: "Hardware", priority: "Medium", description: "", notes: "" });

  // ─── Transfer Requests State ─────────────────────────────────────
  const [transferReqs, setTransferReqs] = useState<any[]>([]);
  const [transferForm, setTransferForm] = useState({ assetId: "", transferTo: "", department: "", reason: "" });

  // ─── Return Requests State ────────────────────────────────────────
  const [returnReqs, setReturnReqs] = useState<any[]>([]);
  const [returnForm, setReturnForm] = useState({ assetId: "", reason: "", condition: "Good", notes: "" });

  // ─── Notifications State ──────────────────────────────────────────
  const [notifications, setNotifications] = useState<any[]>([]);

  // ─────────────────────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────────────────────

  // Toast overlay
  const renderToast = () => {
    if (!toast) return null;
    const isSuccess = toast.type === "success";
    return (
      <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold border transition-all ${
        isSuccess ? "bg-white border-neutral-200 text-neutral-900" : "bg-red-50 border-red-200 text-red-800"
      }`}>
        <span className={`w-2 h-2 rounded-full ${isSuccess ? "bg-emerald-500" : "bg-red-500"}`} />
        {toast.message}
      </div>
    );
  };

  // Confirm modal
  const renderConfirmModal = () => {
    if (!confirmModal.isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900">{confirmModal.title}</h3>
          <p className="text-xs text-neutral-500 font-medium leading-relaxed">{confirmModal.description}</p>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} className="px-4 py-2 text-xs font-bold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-600">Cancel</button>
            <button onClick={() => { confirmModal.onConfirm(); setConfirmModal(prev => ({ ...prev, isOpen: false })); }} className="px-4 py-2 text-xs font-bold bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg">Confirm</button>
          </div>
        </div>
      </div>
    );
  };

  // Detail Drawer
  const renderDrawer = () => {
    if (!drawerOpen || !drawerItem) return null;
    const { type, data } = drawerItem;
    const asset = data as Record<string, string>;
    const maint = data as Record<string, string>;
    const trf   = data as Record<string, string>;
    const ret   = data as Record<string, string>;
    const bkg   = data as Record<string, string>;

    const tabSets: Record<string, string[]> = {
      asset:       ["Overview", "QR Code", "Warranty", "Allocation History", "Maintenance History"],
      maintenance: ["Issue Details", "Timeline", "Resolution"],
      transfer:    ["Request Details", "Timeline", "Approval"],
      return:      ["Return Details", "Timeline", "Inspection"],
      booking:     ["Booking Details", "Timeline"],
    };
    const tabs = tabSets[type] ?? ["Overview"];

    return (
      <div className="fixed inset-y-0 right-0 w-[460px] bg-white border-l border-neutral-200 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="h-16 px-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{type} Details</span>
            <h2 className="text-sm font-bold text-neutral-900 mt-0.5 truncate max-w-[320px]">
              {asset.name || asset.assetName || asset.resource || `#${asset.id}`}
            </h2>
          </div>
          <button onClick={() => { setDrawerOpen(false); setDrawerItem(null); }} className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 text-xs font-bold">✕</button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-neutral-100 flex gap-4 text-xs font-semibold text-neutral-500 overflow-x-auto">
          {tabs.map(t => (
            <button key={t} onClick={() => setDrawerTab(t)} className={`py-3 border-b-2 whitespace-nowrap ${drawerTab === t ? "border-black text-black" : "border-transparent hover:text-neutral-700"}`}>{t}</button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs">
          {/* ── Asset tabs ─────────────────────── */}
          {type === "asset" && drawerTab === "Overview" && (
            <div className="space-y-4">
              <div className="bg-[#FBFBFB] border border-neutral-100 rounded-lg p-4 space-y-3">
                {[
                  ["Category",    asset.category],
                  ["Condition",   asset.condition],
                  ["Status",      asset.status],
                  ["Allocated",   asset.allocatedDate],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">{k}</span>
                    <span className="font-semibold text-neutral-900">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => { setDrawerOpen(false); setActiveTab("Maintenance"); }} className="px-3 py-1.5 bg-black text-white rounded-lg font-bold text-[10px]">Raise Maintenance</button>
                <button onClick={() => { setDrawerOpen(false); setActiveTab("Transfer Requests"); }} className="px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-lg font-bold text-[10px]">Request Transfer</button>
                <button onClick={() => { setDrawerOpen(false); setActiveTab("Return Requests"); }} className="px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-lg font-bold text-[10px]">Request Return</button>
              </div>
            </div>
          )}
          {type === "asset" && drawerTab === "QR Code" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <QrSvg tag={asset.id} />
              <button onClick={() => triggerToast("QR Code downloaded", "success")} className="px-4 py-2 bg-black text-white rounded-lg font-bold text-[10px]">
                <HugeiconsIcon icon={Download01Icon} size={12} className="inline mr-1" />Download
              </button>
            </div>
          )}
          {type === "asset" && drawerTab === "Warranty" && (
            <div className="space-y-3">
              <div className="bg-[#FBFBFB] border border-neutral-100 rounded-lg p-4 space-y-3">
                <div className="flex justify-between"><span className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider">Warranty Status</span><StatusBadge status={asset.warrantyStatus} /></div>
                <div className="flex justify-between"><span className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider">Expiry Date</span><span className="font-semibold text-neutral-900">{asset.warrantyExpiry}</span></div>
              </div>
              {asset.warrantyStatus === "Expiring" && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 font-semibold text-[10px]">⚠ This warranty is expiring soon. Contact your Asset Manager for renewal.</div>
              )}
            </div>
          )}
          {type === "asset" && drawerTab === "Allocation History" && (
            <div className="relative pl-6 border-l-2 border-neutral-200 space-y-6">
              {[
                { title: "Allocated to you", user: "Admin", date: asset.allocatedDate },
                { title: "Registered in inventory", user: "IT Operations", date: "Jan 10, 2026" },
              ].map((e, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-white border-2 border-black rounded-full" />
                  <p className="font-bold text-neutral-950">{e.title}</p>
                  <p className="text-[10px] text-neutral-450 mt-0.5 font-semibold">By {e.user} · {e.date}</p>
                </div>
              ))}
            </div>
          )}
          {type === "asset" && drawerTab === "Maintenance History" && (
            <div className="space-y-2">
              {maintenanceReqs.filter(m => m.assetId === asset.id).map((m, i) => (
                <div key={i} className="p-3 border border-neutral-100 rounded-lg flex items-center justify-between bg-neutral-50/50">
                  <div>
                    <p className="font-bold text-neutral-900">{m.issue}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Created: {m.createdOn}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              ))}
              {maintenanceReqs.filter(m => m.assetId === asset.id).length === 0 && (
                <p className="text-neutral-400 italic text-center py-6">No maintenance history for this asset</p>
              )}
            </div>
          )}

          {/* ── Maintenance tabs ────────────────── */}
          {type === "maintenance" && drawerTab === "Issue Details" && (
            <div className="space-y-3">
              <div className="bg-[#FBFBFB] border border-neutral-100 rounded-lg p-4 space-y-3">
                {[["Asset", maint.assetName], ["Issue Type", maint.issueType], ["Priority", maint.priority], ["Status", maint.status], ["Created", maint.createdOn], ["Technician", maint.technician]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider">{k}</span>
                    <span className="font-semibold text-neutral-900">{v}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-lg">
                <p className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider mb-1">Reported Issue</p>
                <p className="font-medium text-neutral-700">{maint.issue}</p>
              </div>
            </div>
          )}
          {type === "maintenance" && drawerTab === "Timeline" && (
            <div className="relative pl-6 border-l-2 border-neutral-200 space-y-6">
              {[
                { title: "Request submitted", date: maint.createdOn },
                ...(maint.status !== "Pending" ? [{ title: "Technician assigned", date: maint.createdOn }] : []),
                ...(maint.status === "Resolved" ? [{ title: "Issue resolved", date: "Jul 13, 2026" }] : []),
              ].map((e, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-white border-2 border-black rounded-full" />
                  <p className="font-bold text-neutral-950">{e.title}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{e.date}</p>
                </div>
              ))}
            </div>
          )}
          {type === "maintenance" && drawerTab === "Resolution" && (
            <div className="space-y-3">
              {maint.status === "Resolved" ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-emerald-800 font-semibold text-[10px]">✓ Issue resolved. Cost: {maint.cost}</div>
              ) : (
                <p className="text-neutral-400 italic text-center py-6">Resolution details will appear once the ticket is closed.</p>
              )}
            </div>
          )}

          {/* ── Transfer tabs ───────────────────── */}
          {type === "transfer" && drawerTab === "Request Details" && (
            <div className="bg-[#FBFBFB] border border-neutral-100 rounded-lg p-4 space-y-3">
              {[["Asset", trf.assetName], ["Transfer To", trf.transferTo], ["Department", trf.department], ["Reason", trf.reason], ["Request Date", trf.requestDate], ["Status", trf.status]].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider">{k}</span>
                  <span className="font-semibold text-neutral-900">{v}</span>
                </div>
              ))}
            </div>
          )}
          {type === "transfer" && (drawerTab === "Timeline" || drawerTab === "Approval") && (
            <div className="relative pl-6 border-l-2 border-neutral-200 space-y-6">
              {[
                { title: "Transfer request submitted", date: trf.requestDate },
                ...(trf.status !== "Pending" ? [{ title: `Request ${trf.status.toLowerCase()}`, date: "Jul 12, 2026" }] : []),
              ].map((e, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-white border-2 border-black rounded-full" />
                  <p className="font-bold text-neutral-950">{e.title}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{e.date}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Return tabs ─────────────────────── */}
          {type === "return" && drawerTab === "Return Details" && (
            <div className="bg-[#FBFBFB] border border-neutral-100 rounded-lg p-4 space-y-3">
              {[["Asset", ret.assetName], ["Reason", ret.reason], ["Condition", ret.condition], ["Requested", ret.requestDate], ["Status", ret.status], ["Approved By", ret.approvedBy]].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider">{k}</span>
                  <span className="font-semibold text-neutral-900">{v}</span>
                </div>
              ))}
            </div>
          )}
          {type === "return" && drawerTab === "Timeline" && (
            <div className="relative pl-6 border-l-2 border-neutral-200 space-y-6">
              {[
                { title: "Return request submitted", date: ret.requestDate },
                ...(ret.status !== "Pending" ? [{ title: `Return ${ret.status.toLowerCase()}`, date: "Jul 10, 2026" }] : []),
              ].map((e, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-white border-2 border-black rounded-full" />
                  <p className="font-bold text-neutral-950">{e.title}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{e.date}</p>
                </div>
              ))}
            </div>
          )}
          {type === "return" && drawerTab === "Inspection" && (
            <p className="text-neutral-400 italic text-center py-6">Inspection report will appear once the asset is physically returned.</p>
          )}

          {/* ── Booking tabs ─────────────────────── */}
          {type === "booking" && drawerTab === "Booking Details" && (
            <div className="bg-[#FBFBFB] border border-neutral-100 rounded-lg p-4 space-y-3">
              {[["Resource", bkg.resource], ["Date", bkg.date], ["Time", `${bkg.startTime} – ${bkg.endTime}`], ["Purpose", bkg.purpose], ["Status", bkg.status]].map(([k, v]) => (
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
                <p className="font-bold text-neutral-950">Booking created</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Today</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-white border-2 border-neutral-300 rounded-full" />
                <p className="font-bold text-neutral-450">Scheduled on {bkg.date}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">{bkg.startTime} – {bkg.endTime}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────
  // 1. EMPLOYEE DASHBOARD
  // ─────────────────────────────────────────────────────────────────
  const renderDashboard = () => {
    const kpis = [
      { label: "Assigned Assets",        value: myAssets.length,                                      icon: PackageIcon,      color: "text-neutral-900" },
      { label: "Active Bookings",        value: bookings.filter(b => b.status === "Upcoming").length,   icon: Calendar01Icon,   color: "text-blue-600" },
      { label: "Open Maintenance",       value: maintenanceReqs.filter(m => m.status !== "Resolved").length, icon: ToolsIcon, color: "text-amber-600" },
      { label: "Pending Transfers",      value: transferReqs.filter(t => t.status === "Pending").length, icon: ArrowLeftRightIcon, color: "text-purple-600" },
      { label: "Pending Returns",        value: returnReqs.filter(r => r.status === "Pending").length,   icon: ArrowUpDownIcon,  color: "text-indigo-600" },
      { label: "Upcoming Bookings",      value: bookings.filter(b => b.status === "Upcoming").length,   icon: CalendarClockIcon, color: "text-emerald-600" },
    ];

    const quickActions = [
      { label: "Book Resource",        tab: "Book Resources",    icon: Calendar01Icon },
      { label: "Raise Maintenance",    tab: "Maintenance",       icon: ToolsIcon },
      { label: "Request Transfer",     tab: "Transfer Requests", icon: ArrowLeftRightIcon },
      { label: "Request Return",       tab: "Return Requests",   icon: ArrowUpDownIcon },
    ];

    const activity = [
      { title: "Maintenance request submitted", desc: "iPad Pro 12.9\" screen flickering — MNT-002", date: "Jul 11, 2026", type: "Maintenance" },
      { title: "Booking created", desc: "Conference Room A — Jul 14, 09:00 AM", date: "Jul 11, 2026", type: "Booking" },
      { title: "Transfer requested", desc: "Dell Monitor to Priya Shah", date: "Jul 09, 2026", type: "Transfer" },
      { title: "Asset allocated", desc: "MacBook Pro 16\" M3 Max assigned", date: "Jan 15, 2026", type: "Asset" },
    ];

    const upcoming = [
      { title: "Conference Room A booking", date: "Jul 14 · 09:00 AM", icon: Calendar01Icon, color: "text-blue-600" },
      { title: "iPad Pro warranty expiring", date: "Sep 10, 2026", icon: AlertCircleIcon,    color: "text-amber-600" },
    ];

    return (
      <div className="space-y-8">
        {/* Greeting */}
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-950 text-white font-extrabold text-lg flex items-center justify-center shrink-0">{EMPLOYEE.initials}</div>
            <div>
              <h2 className="text-sm font-extrabold text-neutral-900">Good morning, {EMPLOYEE.name.split(" ")[0]} 👋</h2>
              <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{EMPLOYEE.dept} · {EMPLOYEE.id}</p>
            </div>
          </div>
          <p className="text-[10px] text-neutral-400 font-semibold">{TODAY}</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider leading-tight">{kpi.label}</span>
                <span className={kpi.color}><HugeiconsIcon icon={kpi.icon} size={16} /></span>
              </div>
              <p className="text-2xl font-extrabold text-neutral-900 mt-3">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions + Activity + Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-neutral-950 uppercase tracking-wider">Quick Actions</h3>
            <div className="flex flex-col gap-2.5">
              {quickActions.map((a, i) => (
                <button key={i} onClick={() => { setActiveTab(a.tab); triggerToast(`Navigated to ${a.tab}`, "success"); }}
                  className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg hover:bg-neutral-50 hover:border-neutral-200 transition-all group text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-neutral-50 rounded-lg text-neutral-400 group-hover:text-black transition-colors"><HugeiconsIcon icon={a.icon} size={14} /></div>
                    <span className="text-xs font-bold text-neutral-850">{a.label}</span>
                  </div>
                  <span className="text-[10px] text-neutral-300 group-hover:text-black">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-neutral-950 uppercase tracking-wider">Recent Activity</h3>
            <div className="relative pl-5 border-l-2 border-neutral-100 space-y-5">
              {activity.map((a, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[25px] top-1 w-2 h-2 bg-white border-2 border-neutral-400 rounded-full" />
                  <p className="text-xs font-bold text-neutral-900">{a.title}</p>
                  <p className="text-[10px] text-neutral-500 font-medium mt-0.5">{a.desc}</p>
                  <p className="text-[9px] text-neutral-400 mt-0.5">{a.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-neutral-950 uppercase tracking-wider">Upcoming Events</h3>
            <div className="flex flex-col gap-3">
              {upcoming.map((u, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border border-neutral-100 rounded-lg bg-neutral-50/40">
                  <span className={u.color}><HugeiconsIcon icon={u.icon} size={15} /></span>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">{u.title}</p>
                    <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">{u.date}</p>
                  </div>
                </div>
              ))}
              {upcoming.length === 0 && <p className="text-xs text-neutral-400 italic">No upcoming events</p>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────
  // 2. MY ASSETS
  // ─────────────────────────────────────────────────────────────────
  const renderMyAssets = () => {
    const filtered = myAssets.filter(a => {
      const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat    = categoryFilter === "All" || a.category === categoryFilter;
      const matchSt     = statusFilter   === "All" || a.warrantyStatus === statusFilter;
      return matchSearch && matchCat && matchSt;
    });

    return (
      <div className="space-y-6 bg-white border border-neutral-200/80 rounded-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">My Assets</h3>
            <p className="text-xs text-neutral-400 font-medium mt-0.5">All assets currently allocated to your profile</p>
          </div>
          <span className="text-[10px] font-bold text-neutral-400 bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded-full">{myAssets.length} total assets</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 bg-[#FBFBFB] p-3 border border-neutral-100 rounded-lg text-xs">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"><HugeiconsIcon icon={Search01Icon} size={13} /></span>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search assets…" className="pl-8 pr-3 py-1.5 border border-neutral-200 rounded-lg w-52 bg-white focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-1.5 border border-neutral-200 rounded-lg bg-white">
            <option value="All">All Categories</option>
            <option>IT Hardware</option>
            <option>Mobile Devices</option>
            <option>AV Equipment</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 border border-neutral-200 rounded-lg bg-white">
            <option value="All">All Warranty Statuses</option>
            <option>Active</option>
            <option>Expiring</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-100">
                {["Asset Tag", "Asset Name", "Category", "Condition", "Allocated Date", "Warranty", "Status", "Actions"].map(h => (
                  <TableHead key={h} className="font-bold text-neutral-400 text-[10px] uppercase tracking-wider">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(asset => (
                <TableRow key={asset.id} onClick={() => { setDrawerItem({ type: "asset", data: asset as unknown as Record<string, unknown> }); setDrawerTab("Overview"); setDrawerOpen(true); }} className="border-neutral-100 hover:bg-neutral-50/50 cursor-pointer">
                  <TableCell className="py-4 text-[10px] font-bold text-neutral-450">#{asset.id}</TableCell>
                  <TableCell className="py-4 text-xs font-semibold text-neutral-900">{asset.name}</TableCell>
                  <TableCell className="py-4 text-xs text-neutral-500 font-medium">{asset.category}</TableCell>
                  <TableCell className="py-4"><StatusBadge status={asset.condition} /></TableCell>
                  <TableCell className="py-4 text-xs text-neutral-500">{asset.allocatedDate}</TableCell>
                  <TableCell className="py-4"><StatusBadge status={asset.warrantyStatus} /></TableCell>
                  <TableCell className="py-4"><StatusBadge status={asset.status} /></TableCell>
                  <TableCell className="py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1.5">
                      <button onClick={() => { setDrawerItem({ type: "asset", data: asset as unknown as Record<string, unknown> }); setDrawerTab("Overview"); setDrawerOpen(true); }} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded">View</button>
                      <button onClick={() => { setActiveTab("Maintenance"); triggerToast("Navigated to Maintenance", "success"); }} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded">Repair</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="py-10 text-center text-xs text-neutral-400 italic">No assets match your filters</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────
  // 3. BOOK RESOURCES
  // ─────────────────────────────────────────────────────────────────
  const renderBookResources = () => {
    const resources = ["Conference Room A", "Conference Room B", "Sony 4K Projector", "Epson Projector", "Company Van", "Lab Room A", "Lab Room B"];

    const handleBookingSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!bookingForm.resource || !bookingForm.date || !bookingForm.startTime || !bookingForm.endTime) {
        triggerToast("Please fill in all required fields", "error"); return;
      }
      // Overlap check
      const overlap = bookings.some(b =>
        b.resource === bookingForm.resource &&
        b.date === bookingForm.date &&
        b.status !== "Cancelled" &&
        b.status !== "Completed" &&
        !(bookingForm.endTime <= b.startTime || bookingForm.startTime >= b.endTime)
      );
      if (overlap) { triggerToast(`Time conflict: ${bookingForm.resource} is already booked in that slot`, "error"); return; }
      const newBkg = { id: `BKG-${100 + bookings.length}`, ...bookingForm, status: "Upcoming" };
      setBookings(prev => [newBkg, ...prev]);
      setBookingForm({ resource: "", date: "", startTime: "", endTime: "", purpose: "" });
      triggerToast(`Booking confirmed for ${newBkg.resource}`, "success");
    };

    const kpis = [
      { label: "Active Bookings",  value: bookings.filter(b => b.status === "Active").length },
      { label: "Upcoming",         value: bookings.filter(b => b.status === "Upcoming").length },
      { label: "Completed",        value: bookings.filter(b => b.status === "Completed").length },
      { label: "Cancelled",        value: bookings.filter(b => b.status === "Cancelled").length },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-5 shadow-sm">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{k.label}</p>
              <p className="text-xl font-extrabold text-neutral-900 mt-2">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Book a Resource</h3>
              <p className="text-[10px] text-neutral-400 mt-1 font-semibold">Reserve rooms, projectors, vehicles, and labs</p>
            </div>
            <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Resource *</label>
                <select value={bookingForm.resource} onChange={e => setBookingForm(p => ({ ...p, resource: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black">
                  <option value="">— Select Resource —</option>
                  {resources.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Date *</label>
                <input type="date" value={bookingForm.date} onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Start Time *</label>
                  <input type="time" value={bookingForm.startTime} onChange={e => setBookingForm(p => ({ ...p, startTime: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none" />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">End Time *</label>
                  <input type="time" value={bookingForm.endTime} onChange={e => setBookingForm(p => ({ ...p, endTime: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Purpose</label>
                <input type="text" placeholder="e.g. Sprint Planning" value={bookingForm.purpose} onChange={e => setBookingForm(p => ({ ...p, purpose: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <button type="submit" className="w-full py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs transition-colors">Confirm Booking</button>
            </form>
          </div>

          {/* Bookings Table */}
          <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">My Bookings</h3>
            <div className="overflow-x-auto text-xs">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-100">
                    {["Resource", "Purpose", "Date", "Time", "Status", "Actions"].map(h => (
                      <TableHead key={h} className="font-bold text-neutral-400 text-[9px] uppercase tracking-wider">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map(bkg => (
                    <TableRow key={bkg.id} onClick={() => { setDrawerItem({ type: "booking", data: bkg as unknown as Record<string, unknown> }); setDrawerTab("Booking Details"); setDrawerOpen(true); }} className="border-t border-neutral-50 hover:bg-neutral-50/50 cursor-pointer">
                      <td className="py-3 font-bold text-neutral-900">{bkg.resource}</td>
                      <td className="py-3 text-neutral-500 font-medium">{bkg.purpose}</td>
                      <td className="py-3 text-neutral-500">{bkg.date}</td>
                      <td className="py-3 text-neutral-400">{bkg.startTime}–{bkg.endTime}</td>
                      <td className="py-3"><StatusBadge status={bkg.status} /></td>
                      <td className="py-3" onClick={e => e.stopPropagation()}>
                        {bkg.status !== "Cancelled" && bkg.status !== "Completed" && (
                          <button onClick={() => setConfirmModal({ isOpen: true, title: "Cancel Booking?", description: `Cancel your booking for ${bkg.resource} on ${bkg.date}?`, onConfirm: () => { setBookings(prev => prev.map(b => b.id === bkg.id ? { ...b, status: "Cancelled" } : b)); triggerToast("Booking cancelled", "success"); } })} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded text-neutral-600">Cancel</button>
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

  // ─────────────────────────────────────────────────────────────────
  // 4. MAINTENANCE
  // ─────────────────────────────────────────────────────────────────
  const renderMaintenance = () => {
    const kpis = [
      { label: "Open Requests",  value: maintenanceReqs.filter(m => m.status === "Pending").length,     color: "text-amber-600" },
      { label: "In Progress",    value: maintenanceReqs.filter(m => m.status === "In Progress").length, color: "text-blue-600" },
      { label: "Resolved",       value: maintenanceReqs.filter(m => m.status === "Resolved").length,    color: "text-emerald-600" },
      { label: "Rejected",       value: maintenanceReqs.filter(m => m.status === "Rejected").length,    color: "text-red-600" },
    ];

    const handleMaintSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!maintForm.assetId || !maintForm.description) {
        triggerToast("Please select an asset and describe the issue", "error"); return;
      }
      const asset = myAssets.find(a => a.id === maintForm.assetId);
      const newReq = {
        id: `MNT-${100 + maintenanceReqs.length}`,
        assetId: maintForm.assetId,
        assetName: asset?.name ?? "Unknown Asset",
        issue: maintForm.description,
        issueType: maintForm.issueType,
        priority: maintForm.priority,
        status: "Pending",
        createdOn: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        technician: "Unassigned",
        cost: "—",
      };
      setMaintenanceReqs(prev => [newReq, ...prev]);
      setMaintForm({ assetId: "", issueType: "Hardware", priority: "Medium", description: "", notes: "" });
      triggerToast(`Maintenance request ${newReq.id} submitted`, "success");
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-5 shadow-sm">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{k.label}</p>
              <p className={`text-xl font-extrabold mt-2 ${k.color}`}>{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Raise Maintenance Request</h3>
              <p className="text-[10px] text-neutral-400 mt-1 font-semibold">Report a hardware or software issue with an assigned asset</p>
            </div>
            <form onSubmit={handleMaintSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Select Asset *</label>
                <select value={maintForm.assetId} onChange={e => setMaintForm(p => ({ ...p, assetId: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black">
                  <option value="">— Choose Asset —</option>
                  {myAssets.map(a => <option key={a.id} value={a.id}>{a.name} (#{a.id})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Issue Type</label>
                  <select value={maintForm.issueType} onChange={e => setMaintForm(p => ({ ...p, issueType: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none">
                    <option>Hardware</option><option>Software</option><option>Connectivity</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Priority</label>
                  <select value={maintForm.priority} onChange={e => setMaintForm(p => ({ ...p, priority: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none">
                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Describe the Issue *</label>
                <textarea rows={3} placeholder="Provide a clear description of the problem…" value={maintForm.description} onChange={e => setMaintForm(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black resize-none" />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Additional Notes</label>
                <textarea rows={2} placeholder="Any other relevant information…" value={maintForm.notes} onChange={e => setMaintForm(p => ({ ...p, notes: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none resize-none" />
              </div>
              <button type="submit" className="w-full py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs transition-colors">Submit Request</button>
            </form>
          </div>

          {/* Table */}
          <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">My Requests</h3>
            <div className="overflow-x-auto text-xs">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-100">
                    {["Asset", "Issue", "Priority", "Status", "Created", "Technician", "Actions"].map(h => (
                      <TableHead key={h} className="font-bold text-neutral-400 text-[9px] uppercase tracking-wider">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceReqs.map(req => (
                    <TableRow key={req.id} onClick={() => { setDrawerItem({ type: "maintenance", data: req as unknown as Record<string, unknown> }); setDrawerTab("Issue Details"); setDrawerOpen(true); }} className="border-t border-neutral-50 hover:bg-neutral-50/50 cursor-pointer">
                      <td className="py-3 font-bold text-neutral-900 max-w-[140px] truncate">{req.assetName}</td>
                      <td className="py-3 text-neutral-500 max-w-[140px] truncate">{req.issue}</td>
                      <td className="py-3"><StatusBadge status={req.priority} /></td>
                      <td className="py-3"><StatusBadge status={req.status} /></td>
                      <td className="py-3 text-neutral-400">{req.createdOn}</td>
                      <td className="py-3 text-neutral-500 font-medium">{req.technician}</td>
                      <td className="py-3" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setDrawerItem({ type: "maintenance", data: req as unknown as Record<string, unknown> }); setDrawerTab("Issue Details"); setDrawerOpen(true); }} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded">View</button>
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

  // ─────────────────────────────────────────────────────────────────
  // 5. TRANSFER REQUESTS
  // ─────────────────────────────────────────────────────────────────
  const renderTransferRequests = () => {
    const kpis = [
      { label: "Pending",   value: transferReqs.filter(t => t.status === "Pending").length },
      { label: "Approved",  value: transferReqs.filter(t => t.status === "Approved").length },
      { label: "Rejected",  value: transferReqs.filter(t => t.status === "Rejected").length },
      { label: "Completed", value: transferReqs.filter(t => t.status === "Completed").length },
    ];

    const handleTransferSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!transferForm.assetId || !transferForm.transferTo) {
        triggerToast("Please fill in all required fields", "error"); return;
      }
      const asset = myAssets.find(a => a.id === transferForm.assetId);
      const newReq = {
        id: `TRF-${100 + transferReqs.length}`,
        assetId: transferForm.assetId,
        assetName: asset?.name ?? "Unknown Asset",
        transferTo: transferForm.transferTo,
        department: transferForm.department,
        reason: transferForm.reason,
        requestDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "Pending",
      };
      setTransferReqs(prev => [newReq, ...prev]);
      setTransferForm({ assetId: "", transferTo: "", department: "", reason: "" });
      triggerToast(`Transfer request ${newReq.id} submitted`, "success");
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-5 shadow-sm">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{k.label}</p>
              <p className="text-xl font-extrabold text-neutral-900 mt-2">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Request Transfer</h3>
              <p className="text-[10px] text-neutral-400 mt-1 font-semibold">Transfer an assigned asset to another employee</p>
            </div>
            <form onSubmit={handleTransferSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Select Asset *</label>
                <select value={transferForm.assetId} onChange={e => setTransferForm(p => ({ ...p, assetId: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black">
                  <option value="">— Choose Asset —</option>
                  {myAssets.map(a => <option key={a.id} value={a.id}>{a.name} (#{a.id})</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Transfer To *</label>
                <input type="text" placeholder="Employee name" value={transferForm.transferTo} onChange={e => setTransferForm(p => ({ ...p, transferTo: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Department</label>
                <select value={transferForm.department} onChange={e => setTransferForm(p => ({ ...p, department: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none">
                  <option value="">— Select Department —</option>
                  <option>Engineering</option><option>IT Operations</option><option>Finance</option><option>Operations</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Reason</label>
                <textarea rows={3} placeholder="Reason for transfer…" value={transferForm.reason} onChange={e => setTransferForm(p => ({ ...p, reason: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none resize-none" />
              </div>
              <button type="submit" className="w-full py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs">Submit Transfer Request</button>
            </form>
          </div>

          {/* Table */}
          <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">My Transfer Requests</h3>
            <div className="overflow-x-auto text-xs">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-100">
                    {["Asset", "Transfer To", "Department", "Requested", "Status", "Actions"].map(h => (
                      <TableHead key={h} className="font-bold text-neutral-400 text-[9px] uppercase tracking-wider">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transferReqs.map(req => (
                    <TableRow key={req.id} onClick={() => { setDrawerItem({ type: "transfer", data: req as unknown as Record<string, unknown> }); setDrawerTab("Request Details"); setDrawerOpen(true); }} className="border-t border-neutral-50 hover:bg-neutral-50/50 cursor-pointer">
                      <td className="py-3 font-bold text-neutral-900 max-w-[140px] truncate">{req.assetName}</td>
                      <td className="py-3 font-semibold text-neutral-850">{req.transferTo}</td>
                      <td className="py-3 text-neutral-500">{req.department}</td>
                      <td className="py-3 text-neutral-400">{req.requestDate}</td>
                      <td className="py-3"><StatusBadge status={req.status} /></td>
                      <td className="py-3" onClick={e => e.stopPropagation()}>
                        {req.status === "Pending" && (
                          <button onClick={() => setConfirmModal({ isOpen: true, title: "Cancel Transfer Request?", description: `Cancel transfer request for ${req.assetName}?`, onConfirm: () => { setTransferReqs(prev => prev.map(t => t.id === req.id ? { ...t, status: "Rejected" } : t)); triggerToast("Transfer request cancelled", "success"); } })} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded text-neutral-600">Cancel</button>
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

  // ─────────────────────────────────────────────────────────────────
  // 6. RETURN REQUESTS
  // ─────────────────────────────────────────────────────────────────
  const renderReturnRequests = () => {
    const kpis = [
      { label: "Pending",   value: returnReqs.filter(r => r.status === "Pending").length },
      { label: "Approved",  value: returnReqs.filter(r => r.status === "Approved").length },
      { label: "Completed", value: returnReqs.filter(r => r.status === "Completed").length },
      { label: "Rejected",  value: returnReqs.filter(r => r.status === "Rejected").length },
    ];

    const handleReturnSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!returnForm.assetId) { triggerToast("Please select an asset to return", "error"); return; }
      const asset = myAssets.find(a => a.id === returnForm.assetId);
      const newReq = {
        id: `RTN-${100 + returnReqs.length}`,
        assetId: returnForm.assetId,
        assetName: asset?.name ?? "Unknown Asset",
        reason: returnForm.reason,
        condition: returnForm.condition,
        requestDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "Pending",
        approvedBy: "—",
      };
      setReturnReqs(prev => [newReq, ...prev]);
      setReturnForm({ assetId: "", reason: "", condition: "Good", notes: "" });
      triggerToast(`Return request ${newReq.id} submitted`, "success");
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-5 shadow-sm">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{k.label}</p>
              <p className="text-xl font-extrabold text-neutral-900 mt-2">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Request Asset Return</h3>
              <p className="text-[10px] text-neutral-400 mt-1 font-semibold">Initiate a return for an asset no longer needed</p>
            </div>
            <form onSubmit={handleReturnSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Select Asset *</label>
                <select value={returnForm.assetId} onChange={e => setReturnForm(p => ({ ...p, assetId: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black">
                  <option value="">— Choose Asset —</option>
                  {myAssets.map(a => <option key={a.id} value={a.id}>{a.name} (#{a.id})</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Return Reason</label>
                <textarea rows={2} placeholder="Why are you returning this asset?" value={returnForm.reason} onChange={e => setReturnForm(p => ({ ...p, reason: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none resize-none" />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Current Condition</label>
                <select value={returnForm.condition} onChange={e => setReturnForm(p => ({ ...p, condition: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none">
                  <option>Good</option><option>Fair</option><option>Poor</option><option>Damaged</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Additional Notes</label>
                <textarea rows={2} placeholder="Any additional context…" value={returnForm.notes} onChange={e => setReturnForm(p => ({ ...p, notes: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none resize-none" />
              </div>
              <button type="submit" className="w-full py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs">Submit Return Request</button>
            </form>
          </div>

          {/* Table */}
          <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">My Return Requests</h3>
            <div className="overflow-x-auto text-xs">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-100">
                    {["Asset", "Reason", "Condition", "Requested", "Status", "Approved By", "Actions"].map(h => (
                      <TableHead key={h} className="font-bold text-neutral-400 text-[9px] uppercase tracking-wider">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {returnReqs.map(req => (
                    <TableRow key={req.id} onClick={() => { setDrawerItem({ type: "return", data: req as unknown as Record<string, unknown> }); setDrawerTab("Return Details"); setDrawerOpen(true); }} className="border-t border-neutral-50 hover:bg-neutral-50/50 cursor-pointer">
                      <td className="py-3 font-bold text-neutral-900 max-w-[130px] truncate">{req.assetName}</td>
                      <td className="py-3 text-neutral-500 max-w-[120px] truncate">{req.reason}</td>
                      <td className="py-3"><StatusBadge status={req.condition} /></td>
                      <td className="py-3 text-neutral-400">{req.requestDate}</td>
                      <td className="py-3"><StatusBadge status={req.status} /></td>
                      <td className="py-3 text-neutral-500">{req.approvedBy}</td>
                      <td className="py-3" onClick={e => e.stopPropagation()}>
                        {req.status === "Pending" && (
                          <button onClick={() => setConfirmModal({ isOpen: true, title: "Cancel Return Request?", description: `Cancel the return request for ${req.assetName}?`, onConfirm: () => { setReturnReqs(prev => prev.map(r => r.id === req.id ? { ...r, status: "Rejected" } : r)); triggerToast("Return request cancelled", "success"); } })} className="px-2 py-0.5 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded text-neutral-600">Cancel</button>
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

  // ─────────────────────────────────────────────────────────────────
  // 7. NOTIFICATIONS
  // ─────────────────────────────────────────────────────────────────
  const renderNotifications = () => {
    const tabs = ["All", "Assets", "Bookings", "Maintenance", "Transfers", "Returns", "Unread"];
    const filtered = notifications.filter(n => {
      if (notifTab === "All") return true;
      if (notifTab === "Unread") return !n.read;
      return n.category === notifTab;
    });

    return (
      <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">{notifications.filter(n => !n.read).length} unread notifications</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); triggerToast("All marked as read", "success"); }} className="px-3 py-1.5 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-lg">Mark All Read</button>
            <button onClick={() => setConfirmModal({ isOpen: true, title: "Clear All Notifications?", description: "This will permanently delete all notifications.", onConfirm: () => { setNotifications([]); triggerToast("Notifications cleared", "success"); } })} className="px-3.5 py-1.5 text-xs font-bold bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg">Clear All</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap border-b border-neutral-100 pb-0">
          {tabs.map(t => (
            <button key={t} onClick={() => setNotifTab(t)} className={`px-3 py-2 text-[10px] font-bold rounded-t-lg transition-colors ${notifTab === t ? "bg-neutral-950 text-white" : "text-neutral-500 hover:text-neutral-700"}`}>{t}</button>
          ))}
        </div>

        {/* Notification list */}
        <div className="space-y-3">
          {filtered.map(notif => (
            <div key={notif.id} className={`flex items-start justify-between p-4 border border-neutral-100 rounded-xl bg-[#FBFBFB] ${!notif.read ? "border-l-4 border-l-black" : ""}`}>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={notif.priority} />
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{notif.category}</span>
                </div>
                <p className="text-xs font-bold text-neutral-900 mt-1">{notif.title}</p>
                <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">{notif.description}</p>
                <p className="text-[9px] text-neutral-400 font-semibold mt-1">{notif.timestamp}</p>
              </div>
              <div className="flex gap-1.5 ml-3 shrink-0">
                {!notif.read && <button onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))} className="px-2 py-1 border border-neutral-200 hover:bg-neutral-100 rounded-lg text-[9px] font-bold text-neutral-600">Read</button>}
                <button onClick={() => setConfirmModal({ isOpen: true, title: "Delete Notification?", description: `Delete "${notif.title}"?`, onConfirm: () => setNotifications(prev => prev.filter(n => n.id !== notif.id)) })} className="px-2 py-1 border border-neutral-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 rounded-lg text-[9px] font-bold text-neutral-600">Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-xs text-neutral-400 italic">No notifications in this category</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────
  // 8. PROFILE
  // ─────────────────────────────────────────────────────────────────
  const renderProfile = () => {
    const stats = [
      { label: "Assigned Assets",       value: myAssets.length },
      { label: "Total Bookings",         value: bookings.length },
      { label: "Maintenance Requests",   value: maintenanceReqs.length },
      { label: "Transfer Requests",      value: transferReqs.length },
    ];

    const activity = [
      { title: "Maintenance request submitted", date: "Jul 11, 2026" },
      { title: "Booking created: Conference Room A", date: "Jul 11, 2026" },
      { title: "Transfer request: Dell Monitor", date: "Jul 09, 2026" },
      { title: "Logged in from new device", date: "Jul 07, 2026" },
    ];

    return (
      <div className="space-y-6 max-w-2xl">
        {/* Profile Card */}
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-16 h-16 rounded-full bg-neutral-950 text-white font-extrabold text-2xl flex items-center justify-center shrink-0">{EMPLOYEE.initials}</div>
          <div className="flex-1 space-y-1 text-center md:text-left">
            <h3 className="text-base font-extrabold text-neutral-900">{EMPLOYEE.name}</h3>
            <p className="text-xs text-neutral-500 font-medium">{EMPLOYEE.id} · {EMPLOYEE.dept}</p>
            <p className="text-[10px] text-neutral-400 mt-1">{EMPLOYEE.email} · {EMPLOYEE.phone}</p>
            <p className="text-[10px] text-neutral-400">Joined: {EMPLOYEE.joined}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-5 text-center shadow-sm">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-extrabold text-neutral-900 mt-2">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Preferences */}
        <div className="bg-white border border-neutral-200/80 rounded-lg overflow-hidden text-xs">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-neutral-900 text-xs">Notification Preferences</h4>
              <p className="text-[9px] text-neutral-400 mt-0.5">Control which alerts and reminders you receive</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: "Email alerts for warranty expiry reminders", defaultChecked: true },
              { label: "Push notifications on maintenance updates", defaultChecked: true },
              { label: "Booking reminders 24 hours before scheduled time", defaultChecked: true },
              { label: "Approval notifications for transfer requests", defaultChecked: false },
              { label: "Weekly asset digest emails", defaultChecked: false },
            ].map((pref, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked={pref.defaultChecked} className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black cursor-pointer" />
                <span className="text-neutral-600 group-hover:text-neutral-900 transition-colors font-medium">{pref.label}</span>
              </label>
            ))}
            <button onClick={() => triggerToast("Preferences saved", "success")} className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs">Save Preferences</button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
          <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Recent Activity</h3>
          <div className="relative pl-5 border-l-2 border-neutral-100 space-y-5">
            {activity.map((a, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[25px] top-1 w-2 h-2 bg-white border-2 border-neutral-400 rounded-full" />
                <p className="text-xs font-semibold text-neutral-900">{a.title}</p>
                <p className="text-[9px] text-neutral-400 mt-0.5">{a.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────
  // PAGE DESCRIPTIONS
  // ─────────────────────────────────────────────────────────────────
  const PAGE_DESCS: Record<string, string> = {
    "Dashboard":          "Your personalized workspace overview — assigned assets, upcoming events, and quick actions.",
    "My Assets":          "View and manage all hardware assets currently allocated to your profile.",
    "Book Resources":     "Reserve meeting rooms, projectors, vehicles, and shared lab equipment.",
    "Maintenance":        "Report hardware or software issues with assigned assets and track repair progress.",
    "Transfer Requests":  "Request to transfer an assigned asset to another employee.",
    "Return Requests":    "Initiate a return for assets no longer required.",
    "Notifications":      "Your priority alerts, booking reminders, and request status updates.",
    "Profile":            "Manage your profile, notification preferences, and view activity history.",
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "Dashboard":         return renderDashboard();
      case "My Assets":         return renderMyAssets();
      case "Book Resources":    return renderBookResources();
      case "Maintenance":       return renderMaintenance();
      case "Transfer Requests": return renderTransferRequests();
      case "Return Requests":   return renderReturnRequests();
      case "Notifications":     return renderNotifications();
      case "Profile":           return renderProfile();
      default:                  return renderDashboard();
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // LAYOUT
  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#F9F9F9] text-neutral-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.div
        animate={{ width: isSidebarOpen ? 220 : 60 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-white border-r border-neutral-200/80 flex flex-col shrink-0 overflow-hidden"
      >
        {/* Logo row */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-100">
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-neutral-950 text-white rounded-lg flex items-center justify-center">
                  <HugeiconsIcon icon={AsteriskIcon} size={16} />
                </div>
                <span className="font-bold text-sm tracking-tight">AssetFlow</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              </button>
            </>
          ) : (
            <button onClick={() => setIsSidebarOpen(true)} className="mx-auto p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500">
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </button>
          )}
        </div>

        {/* Nav partition 1 — Overview */}
        <div className="p-4 py-3 space-y-1">
          {NAV_ITEMS_TOP.map(item => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActive ? "bg-neutral-950 text-white font-medium" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <div className={isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-600"}>
                  <HugeiconsIcon icon={item.icon} size={19} />
                </div>
                {isSidebarOpen && <span className="text-sm">{item.name}</span>}
              </button>
            );
          })}
        </div>

        {/* Partition separator */}
        <div className="px-4 py-2 flex items-center gap-2">
          <div className="flex-1 border-t border-neutral-200/60" />
          {isSidebarOpen && (
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1">
              My Work
            </span>
          )}
          <div className="flex-1 border-t border-neutral-200/60" />
        </div>

        {/* Nav partition 2 — My Work */}
        <div className="p-4 py-3 space-y-1 flex-1">
          {NAV_ITEMS_MAIN.map(item => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActive ? "bg-neutral-950 text-white font-medium" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <div className={isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-600"}>
                  <HugeiconsIcon icon={item.icon} size={19} />
                </div>
                {isSidebarOpen && <span className="text-sm">{item.name}</span>}
              </button>
            );
          })}
        </div>

        {/* Role tag at bottom */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-600 font-bold text-[9px] flex items-center justify-center">{EMPLOYEE.initials}</div>
              <div>
                <p className="text-[10px] font-bold text-neutral-700 truncate leading-none">{EMPLOYEE.name}</p>
                <p className="text-[9px] text-neutral-400 mt-0.5">Employee</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-neutral-200/80 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            <span>AssetFlow</span>
            <span className="text-neutral-300">/</span>
            <span>Employee</span>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-700 font-semibold capitalize">{activeTab}</span>
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

            {/* Profile display — read-only */}
            <div className="flex items-center gap-2 px-2 py-1">
                <div className="w-7 h-7 bg-neutral-950 text-white rounded-lg flex items-center justify-center text-[10px] font-extrabold">{EMPLOYEE.initials}</div>
                <div className="flex flex-col items-start">
                  <span className="text-[11px] font-bold text-neutral-900 leading-none">{EMPLOYEE.name}</span>
                  <span className="text-[9px] text-neutral-400 mt-0.5">Employee</span>
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
            <p className="text-xs text-neutral-500 font-medium">{PAGE_DESCS[activeTab]}</p>
          </div>

          {renderActiveView()}
        </main>
      </div>

      {/* Global overlays */}
      {renderDrawer()}
      {renderToast()}
      {renderConfirmModal()}
    </div>
  );
}
