"use client";

import { useState } from "react";
import { useDashboardKPIs, useDashboardActivities, useDashboardCharts, useDepartments, useAssetsList, useEmployees, useAllocations, useTransfers, useAudits, useMyNotifications, useCategories, useMarkNotificationRead, useMarkAllNotificationsRead, useClearNotifications, downloadReport } from "@/lib/hooks/useDashboard";
import Link from "next/link";
import { AddDepartmentModal } from "@/components/modals/add-department-modal";
import { AddAssetModal } from "@/components/modals/add-asset-modal";
import { AddEmployeeModal } from "@/components/modals/add-employee-modal";
import { AddCategoryModal } from "@/components/modals/add-category-modal";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  UserMultipleIcon,
  Calendar01Icon,
  Mail01Icon,
  Coins01Icon,
  Settings01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Search01Icon,
  Notification01Icon,
  AsteriskIcon,
  Logout01Icon,
  Building01Icon,
  PackageIcon,
  ArrowLeftRightIcon,
  ToolsIcon,
  Audit01Icon,
  ClipboardListIcon,
  AlertCircleIcon,
  CalendarClockIcon,
  LicenseIcon,
  ArrowUpDownIcon,
  FilterIcon,
  Folder01Icon,
  MoreHorizontalIcon,
  Download01Icon,
} from "@hugeicons/core-free-icons";

// Import shadcn/ui Table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import EvilCharts
import {
  EvilLineChart,
  Line,
  XAxis as LineXAxis,
  YAxis as LineYAxis,
  Grid as LineGrid,
  Tooltip as LineTooltip,
  Legend as LineLegend,
} from "@/components/evilcharts/charts/line-chart";
import {
  EvilBarChart,
  Bar,
  XAxis as BarXAxis,
  YAxis as BarYAxis,
  Grid as BarGrid,
  Tooltip as BarTooltip,
  Legend as BarLegend,
} from "@/components/evilcharts/charts/bar-chart";

// Mock Data for Charts
// Mock Data for Charts
const assetStatusData = [
  { name: "Available", value: 114 },
  { name: "Allocated", value: 206 },
  { name: "Maintenance", value: 4 },
];

const deptAssetAllocationData = [
  { name: "Eng", value: 95 },
  { name: "IT", value: 110 },
  { name: "Ops", value: 45 },
  { name: "Mktg", value: 25 },
  { name: "HR", value: 30 },
  { name: "Finance", value: 19 },
];

const monthlyAssetGrowthData = [
  { name: "Jan", value: 250 },
  { name: "Feb", value: 268 },
  { name: "Mar", value: 290 },
  { name: "Apr", value: 305 },
  { name: "May", value: 312 },
  { name: "Jun", value: 324 },
];

const assetStatusConfig = {
  value: {
    label: "Assets Count",
    color: "#171717",
  },
};

const deptAssetAllocationConfig = {
  value: {
    label: "Allocated Assets",
    color: "#404040",
  },
};

const monthlyAssetGrowthConfig = {
  value: {
    label: "Total Assets",
    color: "#171717",
  },
};

// Custom SVG Charts for Enterprise look
const CustomDonutChart = ({ data }: { data: { name: string; value: number; color: string }[] }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 justify-center py-4">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f5f5f5" strokeWidth="12" />
          {data.map((item, idx) => {
            const percent = item.value / total;
            const strokeDasharray = `${percent * 251.2} 251.2`;
            const strokeDashoffset = -accumulatedPercent * 251.2;
            accumulatedPercent += percent;
            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={item.color}
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 hover:stroke-[14] cursor-pointer"
              >
                <title>{`${item.name}: ${item.value} (${(percent * 100).toFixed(1)}%)`}</title>
              </circle>
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-neutral-900">{total}</span>
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total Assets</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-neutral-500 font-medium truncate max-w-[100px]">{item.name}</span>
            <span className="text-neutral-900 font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomPieChart = ({ data }: { data: { name: string; value: number; color: string }[] }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 justify-center py-4">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          <circle cx="50" cy="50" r="25" fill="transparent" stroke="#f5f5f5" strokeWidth="50" />
          {data.map((item, idx) => {
            const percent = item.value / total;
            const strokeDasharray = `${percent * 157.1} 157.1`;
            const strokeDashoffset = -accumulatedPercent * 157.1;
            accumulatedPercent += percent;
            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r="25"
                fill="transparent"
                stroke={item.color}
                strokeWidth="50"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 hover:opacity-90 cursor-pointer"
              >
                <title>{`${item.name}: ${item.value} (${(percent * 100).toFixed(1)}%)`}</title>
              </circle>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-col gap-2 text-xs min-w-[120px]">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-neutral-500 font-medium">{item.name}</span>
            <span className="text-neutral-900 font-bold ml-auto">
              {item.value} ({(item.value / total * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomHeatmap = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const grid = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => Math.floor(Math.random() * 5))
  );

  const getColor = (val: number) => {
    if (val === 0) return "bg-neutral-100";
    if (val === 1) return "bg-neutral-200";
    if (val === 2) return "bg-neutral-300";
    if (val === 3) return "bg-neutral-500";
    return "bg-neutral-900";
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-[#FBFBFB] border border-neutral-200/60 rounded-lg overflow-x-auto">
      <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold mb-2">
        <span>Asset Activity Heatmap (Audit Events Logs)</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-neutral-100 border border-neutral-200/40" />
          <span className="w-2.5 h-2.5 rounded-sm bg-neutral-200" />
          <span className="w-2.5 h-2.5 rounded-sm bg-neutral-300" />
          <span className="w-2.5 h-2.5 rounded-sm bg-neutral-500" />
          <span className="w-2.5 h-2.5 rounded-sm bg-neutral-900" />
          <span>More</span>
        </div>
      </div>
      <div className="flex gap-2 min-w-[360px]">
        <div className="flex flex-col justify-between text-[10px] text-neutral-400 font-bold pr-1 pt-1.5 pb-1">
          {days.map((d, i) => (
            <span key={i} className="h-3 leading-none">{i % 2 === 0 ? d : ""}</span>
          ))}
        </div>
        <div className="grid grid-rows-7 grid-flow-col gap-1 flex-1">
          {grid.map((row, rIdx) =>
            row.map((val, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`w-3.5 h-3.5 rounded-sm cursor-pointer transition-all hover:scale-110 ${getColor(val)}`}
                title={`Activity intensity: ${val} check events`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export function DashboardSection({ initialRole = "Admin" }: { initialRole?: string }) {
  const { data: kpis } = useDashboardKPIs();
  const { data: chartsData } = useDashboardCharts();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Mock State for Departments
  const { data: departmentsData } = useDepartments();
  const departments = departmentsData || [];
  const { data: employeesData } = useEmployees();
  const employees = employeesData || [];
  // Categories Data
  const { data: categoriesData } = useCategories();
  const categories = categoriesData || [];
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  // Mock State for Assets List
  const { data: assetsData } = useAssetsList();
  const assetsList = assetsData || [];

  const { data: allocationsData } = useAllocations();
  const allocationsList = allocationsData || [];

  const { data: transfersData } = useTransfers();
  const transfersList = transfersData || [];

  // Mock State for Audits
  const { data: auditsData } = useAudits();
  const auditsList = auditsData || [];

  // Mock State for Pending Approvals
  const pendingApprovals = [
    ...transfersList.filter((t: any) => t.status === 'Pending').map((t: any) => ({ ...t, type: 'Transfer' })),
    ...allocationsList.filter((a: any) => a.status === 'Pending Approval').map((a: any) => ({ ...a, type: 'Allocation' }))
  ];

  // Mock State for Notifications list
  const { data: notificationsData } = useMyNotifications();
    const notifications = notificationsData || [];
    const markReadMut = useMarkNotificationRead();
    const markAllReadMut = useMarkAllNotificationsRead();
    const clearNotifsMut = useClearNotifications();

  // Role-Based Access Control State
  const [rbacPermissions, setRbacPermissions] = useState<Record<string, Record<string, Record<string, boolean>>>>({
    Admin: {
      Departments: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Employees: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Categories: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Assets: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Reports: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Audits: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Settings: { view: true, create: true, edit: true, delete: true, approve: true, export: true }
    },
    "Asset Manager": {
      Departments: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      Employees: { view: true, create: true, edit: true, delete: false, approve: false, export: true },
      Categories: { view: true, create: true, edit: true, delete: false, approve: false, export: true },
      Assets: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      Reports: { view: true, create: true, edit: false, delete: false, approve: false, export: true },
      Audits: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      Settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false }
    },
    "Department Head": {
      Departments: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Employees: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Categories: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Assets: { view: true, create: true, edit: false, delete: false, approve: false, export: true },
      Reports: { view: true, create: true, edit: false, delete: false, approve: false, export: true },
      Audits: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false }
    },
    Employee: {
      Departments: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      Employees: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      Categories: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Assets: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Reports: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      Audits: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      Settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false }
    }
  });

  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState("Admin");

  // Expanded Settings Accordions state
  const [expandedSettings, setExpandedSettings] = useState<Record<string, boolean>>({
    org: true,
    branding: false,
    notifications: false,
    email: false,
    security: false,
    preferences: false,
  });

  const toggleSettingsSection = (section: string) => {
    setExpandedSettings((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Toast Notifications State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  // Sorting & Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Selected Detail Drawer State
  const [selectedItem, setSelectedItem] = useState<{ type: string; data: any } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState("Overview");
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);

  const { data: activitiesData } = useDashboardActivities();
  const activityLogs = activitiesData || [];

  const handleApprovalAction = (id: string, action: "Approve" | "Reject") => {
    triggerToast(`Request ${action === "Approve" ? "approved" : "rejected"} successfully`, "success");
  };

  const markNotificationRead = (id: string) => {
    markReadMut?.mutate(id);
  };

  const generalNavItems = [
    { name: "Dashboard", icon: DashboardSquare01Icon, href: "#" },
  ];

  const managementNavItems = [
    { name: "Organization", icon: Building01Icon, href: "#" },
    { name: "Departments", icon: Building01Icon, href: "#" },
    { name: "Employees", icon: UserMultipleIcon, href: "#" },
    { name: "Categories", icon: Folder01Icon, href: "#" },
    { name: "Asset Overview", icon: PackageIcon, href: "#" },
    { name: "Audits", icon: Audit01Icon, href: "#" },
    { name: "Reports", icon: ClipboardListIcon, href: "#" },
    { name: "Roles & Permissions", icon: LicenseIcon, href: "#" },
    { name: "Settings", icon: Settings01Icon, href: "#" },
  ];

  // Render Success/Error Toast Notifications
  const renderToast = () => {
    if (!toast) return null;
    const isSuccess = toast.type === "success";
    return (
      <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-xs font-bold transition-all duration-300 ${
        isSuccess ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
      }`}>
        <span className="text-lg">{isSuccess ? "✓" : "✕"}</span>
        <span>{toast.message}</span>
      </div>
    );
  };

  // Render Confirmation Modal
  const renderConfirmModal = () => {
    if (!confirmModal || !confirmModal.isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-amber-500 font-extrabold text-xl">⚠️</span>
            <h3 className="text-sm font-bold text-neutral-900">{confirmModal.title}</h3>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">{confirmModal.description}</p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setConfirmModal(null)}
              className="px-3.5 py-1.5 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                confirmModal.onConfirm();
                setConfirmModal(null);
              }}
              className="px-3.5 py-1.5 text-xs font-bold bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Right-side Detail Drawer
  const renderDetailDrawer = () => {
    if (!isDrawerOpen || !selectedItem) return null;
    const { type, data } = selectedItem;

    return (
      <div className="fixed inset-y-0 right-0 w-[480px] bg-white border-l border-neutral-200 shadow-2xl z-50 flex flex-col transition-all duration-300">
        {/* Drawer Header */}
        <div className="h-16 px-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{type} Details</span>
            <h2 className="text-sm font-bold text-neutral-900 mt-0.5">{data.name || data.asset || data.id}</h2>
          </div>
          <button
            onClick={() => {
              setIsDrawerOpen(false);
              setSelectedItem(null);
            }}
            className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Drawer Tabs */}
        <div className="px-6 border-b border-neutral-100 flex gap-4 text-xs font-semibold text-neutral-500">
          {type === "employee" && (
            <>
              <button onClick={() => setDrawerTab("Overview")} className={`py-3 border-b-2 ${drawerTab === "Overview" ? "border-black text-black" : "border-transparent"}`}>Profile</button>
              <button onClick={() => setDrawerTab("Assets")} className={`py-3 border-b-2 ${drawerTab === "Assets" ? "border-black text-black" : "border-transparent"}`}>Assigned Assets</button>
              <button onClick={() => setDrawerTab("History")} className={`py-3 border-b-2 ${drawerTab === "History" ? "border-black text-black" : "border-transparent"}`}>Role History</button>
            </>
          )}
          {type === "department" && (
            <>
              <button onClick={() => setDrawerTab("Overview")} className={`py-3 border-b-2 ${drawerTab === "Overview" ? "border-black text-black" : "border-transparent"}`}>Overview</button>
              <button onClick={() => setDrawerTab("Employees")} className={`py-3 border-b-2 ${drawerTab === "Employees" ? "border-black text-black" : "border-transparent"}`}>Employees</button>
              <button onClick={() => setDrawerTab("Assets")} className={`py-3 border-b-2 ${drawerTab === "Assets" ? "border-black text-black" : "border-transparent"}`}>Assets</button>
            </>
          )}
          {type === "audit" && (
            <>
              <button onClick={() => setDrawerTab("Overview")} className={`py-3 border-b-2 ${drawerTab === "Overview" ? "border-black text-black" : "border-transparent"}`}>Audit Summary</button>
              <button onClick={() => setDrawerTab("Assets")} className={`py-3 border-b-2 ${drawerTab === "Assets" ? "border-black text-black" : "border-transparent"}`}>Covered Assets</button>
            </>
          )}
        </div>

        {/* Drawer Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {type === "employee" && (
            <>
              {drawerTab === "Overview" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-900 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                      {data.initials}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-neutral-950">{data.name}</p>
                      <p className="text-xs text-neutral-500">{data.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100 text-xs">
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Department</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.dept}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">System Role</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.role}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Allocated Items</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.allocatedAssetsCount} devices</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Status</p>
                      <span className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${data.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-neutral-100 text-neutral-500"}`}>{data.status}</span>
                    </div>
                  </div>
                </div>
              )}
              {drawerTab === "Assets" && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-neutral-900">Items checked out by {data.name}:</p>
                  <div className="border border-neutral-200 rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-neutral-50 text-[10px] text-neutral-400 font-bold uppercase">
                        <tr>
                          <th className="p-3">Asset ID</th>
                          <th className="p-3">Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetsList.filter(a => a.custodian === data.name).map((a, i) => (
                          <tr key={i} className="border-t border-neutral-100">
                            <td className="p-3 font-semibold text-neutral-400">#{a.id}</td>
                            <td className="p-3 text-neutral-800">{a.name}</td>
                          </tr>
                        ))}
                        {assetsList.filter(a => a.custodian === data.name).length === 0 && (
                          <tr>
                            <td colSpan={2} className="p-3 text-center text-neutral-400 italic">No assets assigned</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {drawerTab === "History" && (
                <div className="space-y-4 text-xs">
                  <div className="border-l-2 border-neutral-200 pl-4 space-y-4">
                    <div>
                      <p className="font-bold text-neutral-900">Role updated to {data.role}</p>
                      <p className="text-[10px] text-neutral-400">Jan 12, 2026</p>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-600">Onboarded to system</p>
                      <p className="text-[10px] text-neutral-400">Nov 15, 2025</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {type === "department" && (
            <>
              {drawerTab === "Overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Department Head</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.head}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Total Members</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.employeesCount} employees</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Budget Assets</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.assetsCount} items</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Established</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.createdDate}</p>
                    </div>
                  </div>
                </div>
              )}
              {drawerTab === "Employees" && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-neutral-900 font-bold">Personnel</p>
                  <div className="space-y-2">
                    {employees.filter(e => e.dept === data.name).map((e, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border border-neutral-100 rounded-lg text-xs bg-neutral-50/50">
                        <div className="w-8 h-8 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-neutral-700">
                          {e.initials}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{e.name}</p>
                          <p className="text-[10px] text-neutral-400">{e.email}</p>
                        </div>
                      </div>
                    ))}
                    {employees.filter(e => e.dept === data.name).length === 0 && (
                      <p className="text-xs text-neutral-400 italic">No employees in this department</p>
                    )}
                  </div>
                </div>
              )}
              {drawerTab === "Assets" && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-neutral-900 font-bold">Allocated Resources</p>
                  <div className="space-y-2">
                    {assetsList.filter(a => a.department === data.name).map((a, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg text-xs bg-[#FBFBFB]">
                        <div>
                          <p className="font-bold text-neutral-900">{a.name}</p>
                          <p className="text-[10px] text-neutral-400">Custodian: {a.custodian}</p>
                        </div>
                        <span className="text-[9px] font-bold text-neutral-400 uppercase">#{a.id}</span>
                      </div>
                    ))}
                    {assetsList.filter(a => a.department === data.name).length === 0 && (
                      <p className="text-xs text-neutral-400 italic">No assets allocated to this department</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {type === "audit" && (
            <>
              {drawerTab === "Overview" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Department</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.department}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Auditor Assigned</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.auditor}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Audit Date</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.startDate}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Scan Progress</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.progress}% complete</p>
                    </div>
                  </div>
                </div>
              )}
              {drawerTab === "Assets" && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-neutral-900 font-bold">Items under review</p>
                  <div className="space-y-2">
                    {assetsList.filter(a => a.department === data.department).map((a, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg text-xs bg-[#FBFBFB]">
                        <div>
                          <p className="font-bold text-neutral-900">{a.name}</p>
                          <p className="text-[10px] text-neutral-400">Status: {a.status}</p>
                        </div>
                        <span className="text-[9px] font-bold text-neutral-400 uppercase">#{a.id}</span>
                      </div>
                    ))}
                    {assetsList.filter(a => a.department === data.department).length === 0 && (
                      <p className="text-xs text-neutral-400 italic">No assets mapped for this audit</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Render Page 1 - Dashboard
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Row 1 - KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[
          { title: "Total Assets", value: kpis?.totalAssets?.toString() ?? "0", sub: "Across all categories", detail: "Active items", icon: PackageIcon },
          { title: "Active Employees", value: employees.length.toString(), sub: "Assigned gear checkouts", detail: "In directory", icon: UserMultipleIcon },
          { title: "Departments", value: departments.length.toString(), sub: "Corporate branches", detail: "Active cost centers", icon: Building01Icon },
          { title: "Pending Audits", value: auditsList.filter((a: any) => a.status === 'Pending').length.toString(), sub: "Verification checks", detail: "Awaiting physical scans", icon: Audit01Icon },
          { title: "Active Maintenance", value: kpis?.maintenanceToday?.toString() ?? "0", sub: "Under service/repair", detail: "Active", icon: ToolsIcon },
          { title: "Available Assets", value: kpis?.availableAssets?.toString() ?? "0", sub: "Ready in inventory", detail: "Stock level", icon: PackageIcon },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-extrabold text-neutral-900 mt-2 tracking-tight">{card.value}</p>
              </div>
              <div className="text-neutral-500 p-1.5 bg-neutral-50 rounded-lg border border-neutral-100 flex-shrink-0">
                <HugeiconsIcon icon={card.icon} size={20} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col gap-1">
              <span className="text-xs font-semibold text-neutral-800">{card.sub}</span>
              <span className="text-[10px] text-neutral-400 font-medium">{card.detail}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Quick Actions</h3>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium">Perform common administrator operations shortcuts</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setIsAddDepartmentModalOpen(true)} className="px-4 py-2 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-all flex items-center gap-2">
            Add Department
          </button>
          <button onClick={() => setIsAddEmployeeModalOpen(true)} className="px-4 py-2 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-700 transition-all">
            Add Employee
          </button>
          <button onClick={() => { setIsAddCategoryModalOpen(true); }} className="px-4 py-2 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-700 transition-all">
            Create Category
          </button>
          <button onClick={() => { setActiveTab("Audits"); triggerToast("Audit scope screen loaded", "success"); }} className="px-4 py-2 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-700 transition-all">
            Start Audit
          </button>
          <button onClick={() => { setActiveTab("Reports"); }} className="px-4 py-2 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-700 transition-all">
            View Reports
          </button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category distribution donut */}
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Asset Distribution by Category</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">Breakdown of assets across categories</p>
          </div>
          <div className="mt-2">
            <CustomDonutChart
              data={chartsData?.categoryData && chartsData.categoryData.length > 0 ? chartsData.categoryData : [
                { name: "IT Hardware", value: 145, color: "#171717" },
                { name: "AV Equipment", value: 32, color: "#404040" },
                { name: "Office Furniture", value: 65, color: "#737373" },
                { name: "Mobile Devices", value: 48, color: "#a3a3a3" },
                { name: "Network Gear", value: 22, color: "#d4d4d4" },
                { name: "Software Licenses", value: 12, color: "#e5e5e5" }
              ]}
            />
          </div>
        </div>

        {/* Status overview bar */}
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Asset Status Overview</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">Availability vs checkouts vs maintenance status</p>
          </div>
          <div className="h-64 mt-2">
            <EvilBarChart config={assetStatusConfig} data={assetStatusData} layout="horizontal">
              <BarGrid strokeDasharray="3 3" />
              <BarXAxis dataKey="name" />
              <BarYAxis />
              <BarTooltip />
              <BarLegend verticalAlign="bottom" align="center" />
              <Bar dataKey="value" variant="default" />
            </EvilBarChart>
          </div>
        </div>

        {/* Department wise asset allocation */}
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Department-wise Asset Allocation</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">Total assigned equipment count across divisions</p>
          </div>
          <div className="h-64 mt-2">
            <EvilBarChart config={deptAssetAllocationConfig} data={deptAssetAllocationData} layout="horizontal">
              <BarGrid strokeDasharray="3 3" />
              <BarXAxis dataKey="name" />
              <BarYAxis />
              <BarTooltip />
              <BarLegend verticalAlign="bottom" align="center" />
              <Bar dataKey="value" variant="default" />
            </EvilBarChart>
          </div>
        </div>

        {/* Monthly Asset Growth */}
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Monthly Asset Growth</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">Total registered database items (last 6 months)</p>
          </div>
          <div className="h-64 mt-2">
            <EvilLineChart config={monthlyAssetGrowthConfig} data={monthlyAssetGrowthData}>
              <LineGrid strokeDasharray="3 3" />
              <LineXAxis dataKey="name" />
              <LineYAxis domain={[230, 340]} />
              <LineTooltip />
              <LineLegend verticalAlign="bottom" align="center" />
              <Line dataKey="value" strokeVariant="solid" />
            </EvilLineChart>
          </div>
        </div>
      </div>

      {/* Row 3 - Table & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table: Pending Approvals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Pending Approvals</h3>
              <p className="text-xs text-neutral-400 mt-0.5 font-medium">Administrator requests, audits, and role modifications</p>
            </div>

            <div className="mt-2">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-neutral-100">
                    <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider h-8">Subject / Initiative</TableHead>
                    <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider h-8">Requestor</TableHead>
                    <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider h-8">Type</TableHead>
                    <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider h-8">Status</TableHead>
                    <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider h-8 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApprovals.map((req) => (
                    <TableRow key={req.id} className="border-neutral-100 hover:bg-neutral-50/50">
                      <TableCell className="py-3">
                        <div>
                          <p className="font-semibold text-neutral-900 text-xs">{req.title}</p>
                          <p className="text-[10px] text-neutral-400 font-medium mt-0.5">{req.details}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-[10px] text-neutral-600">
                            {req.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900 text-xs">{req.requestedBy}</p>
                            <p className="text-[9px] text-neutral-400 font-medium">{req.dept}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-xs font-semibold text-neutral-600">{req.type}</TableCell>
                      <TableCell className="py-3">
                        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          req.status === "Pending" ? "bg-neutral-100 text-neutral-600" : req.status === "Approved" ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-400 line-through"
                        }`}>
                          {req.status}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        {req.status === "Pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleApprovalAction(req.id, "Reject")} className="px-2.5 py-1 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-600 transition-colors">Deny</button>
                            <button onClick={() => handleApprovalAction(req.id, "Approve")} className="px-2.5 py-1 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors">Approve</button>
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400 italic font-medium">Settled</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Recent Activity</h3>
              <p className="text-xs text-neutral-400 mt-0.5 font-medium">Real-time logs of organizational actions and updates</p>
            </div>
            <div className="space-y-4 mt-2">
              {activityLogs.map((activity: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 border-b border-neutral-50 pb-3 last:border-0 last:pb-0">
                  <div className="text-neutral-400 p-1.5 bg-neutral-50 rounded-lg border border-neutral-100 shrink-0">
                    <HugeiconsIcon icon={PackageIcon} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-neutral-800">{activity.user}</p>
                      <span className="text-[10px] text-neutral-400 font-semibold">{activity.time}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{activity.action}</p>
                    <span className="inline-block text-[8px] bg-neutral-100 text-neutral-500 font-bold px-1.5 py-0.2 rounded uppercase tracking-wider mt-1">{activity.module}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Warnings and Audits timelines */}
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Audit Schedule</h3>
              <p className="text-xs text-neutral-400 mt-0.5 font-medium">Pending corporate compliance reviews</p>
            </div>
            <div className="space-y-4 mt-2">
              {auditsList.map((audit: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between border-b border-neutral-50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-900">{audit.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-medium mt-0.5">By {audit.auditor}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      audit.status === "In Progress" ? "bg-amber-50 text-amber-700 border border-amber-250" : audit.status === "Completed" ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-600"
                    }`}>
                      {audit.status}
                    </span>
                    <p className="text-[9px] text-neutral-400 mt-1 font-semibold">{audit.startDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Page 2 - Organization Setup
  const renderOrganization = () => (
    <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Organization Profile</h3>
        <p className="text-xs text-neutral-400 mt-0.5 font-medium">Verify primary business locations, registration entities, and workspace sizes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-100 text-xs">
        <div className="p-4 border border-neutral-100 rounded-xl bg-[#FBFBFB]">
          <h4 className="font-bold text-neutral-800">Corporate HQ</h4>
          <p className="text-neutral-500 mt-2">San Francisco, California</p>
          <p className="text-[10px] text-neutral-400 mt-1 font-medium">Active Members: 124 employees</p>
        </div>
        <div className="p-4 border border-neutral-100 rounded-xl bg-[#FBFBFB]">
          <h4 className="font-bold text-neutral-800">London Office</h4>
          <p className="text-neutral-500 mt-2">London, United Kingdom</p>
          <p className="text-[10px] text-neutral-400 mt-1 font-medium">Active Members: 22 employees</p>
        </div>
        <div className="p-4 border border-neutral-100 rounded-xl bg-[#FBFBFB]">
          <h4 className="font-bold text-neutral-800">APAC Operations Center</h4>
          <p className="text-neutral-500 mt-2">Singapore Hub</p>
          <p className="text-[10px] text-neutral-400 mt-1 font-medium">Active Members: 12 employees</p>
        </div>
      </div>
    </div>
  );

  // Render Page 3 - Departments Page
  const renderDepartments = () => (
    <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Department Management</h3>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium">Configure corporate branches, cost centers, and checkout privileges</p>
        </div>
        <button onClick={() => setIsAddDepartmentModalOpen(true)} className="px-3.5 py-1.5 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors">
          Add Department
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-3 w-full bg-[#FBFBFB] p-3 border border-neutral-100 rounded-lg text-xs mt-2">
        <input
          type="text"
          placeholder="Search departments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-1.5 border border-neutral-200 rounded-lg w-72 bg-white focus:outline-none focus:ring-1 focus:ring-black"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 border border-neutral-200 rounded-lg bg-white">
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="mt-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-neutral-100">
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Department Name</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Department Head</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Employees</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Assets Count</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Created Date</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.filter(d => (statusFilter === "All" || d.status === statusFilter) && d.name.toLowerCase().includes(searchQuery.toLowerCase())).map((dept) => (
              <TableRow key={dept.id} className="border-neutral-100 hover:bg-neutral-50/50 cursor-pointer" onClick={() => { setSelectedItem({ type: "department", data: dept }); setDrawerTab("Overview"); setIsDrawerOpen(true); }}>
                <TableCell className="py-4">
                  <div>
                    <span className="font-semibold text-neutral-900 text-xs">{dept.name}</span>
                    <p className="text-[10px] text-neutral-400 font-bold mt-0.5 uppercase">{dept.id}</p>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-[10px] text-neutral-600">
                      {dept.headInitials}
                    </div>
                    <span className="font-semibold text-neutral-900 text-xs">{dept.head}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-xs font-semibold text-neutral-600">{dept.employeesCount} members</TableCell>
                <TableCell className="py-4 text-xs font-semibold text-neutral-600">{dept.assetsCount} items</TableCell>
                <TableCell className="py-4">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${dept.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-neutral-100 text-neutral-600"}`}>
                    {dept.status}
                  </span>
                </TableCell>
                <TableCell className="py-4 text-xs text-neutral-450 font-medium">{dept.createdDate}</TableCell>
                <TableCell className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setSelectedItem({ type: "department", data: dept }); setDrawerTab("Overview"); setIsDrawerOpen(true); }} className="px-2 py-1 text-[10px] font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-600">View</button>
                    <button onClick={() => {
                      setConfirmModal({
                        isOpen: true,
                        title: `Deactivate ${dept.name} Department?`,
                        description: `Are you sure you want to suspend allocation privileges and set department ${dept.name} as inactive?`,
                        onConfirm: () => {
                          /* TODO: Add real deactivate API */
                          triggerToast(`${dept.name} deactivated`, "error");
                        }
                      });
                    }} className="px-2 py-1 text-[10px] font-semibold border border-neutral-200 hover:bg-red-50 hover:text-red-600 rounded-lg text-red-500">Deactivate</button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  // Render Page 4 - Employees Page
  const renderEmployees = () => (
    <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Employee Management</h3>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium">Verify workspace user directories, access levels, and checked out hardware</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { downloadReport('allocations'); triggerToast("Exporting Employees allocations...", "success"); }} className="px-3 py-1.5 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-lg">Export</button>
          <button onClick={() => setIsAddEmployeeModalOpen(true)} className="px-3.5 py-1.5 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors">Add Employee</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full bg-[#FBFBFB] p-3 border border-neutral-100 rounded-lg text-xs mt-2">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-1.5 border border-neutral-200 rounded-lg w-64 bg-white focus:outline-none focus:ring-1 focus:ring-black"
        />
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-3 py-1.5 border border-neutral-200 rounded-lg bg-white">
          <option value="All">All Departments</option>
          {departments.map((dept: any) => (
            <option key={dept.id} value={dept.name}>{dept.name}</option>
          ))}
        </select>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-1.5 border border-neutral-200 rounded-lg bg-white">
          <option value="All">All Roles</option>
          {Array.from(new Set(employees.map((e: any) => e.role))).map((role: any) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <div className="mt-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-neutral-100">
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Employee Name</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Email Address</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Department</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">System Role</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Allocated Assets</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.filter(e => (deptFilter === "All" || e.dept === deptFilter) && (roleFilter === "All" || e.role === roleFilter) && e.name.toLowerCase().includes(searchQuery.toLowerCase())).map((emp) => (
              <TableRow key={emp.id} className="border-neutral-100 hover:bg-neutral-50/50 cursor-pointer" onClick={() => { setSelectedItem({ type: "employee", data: emp }); setDrawerTab("Overview"); setIsDrawerOpen(true); }}>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-600">
                      {emp.initials}
                    </div>
                    <span className="font-bold text-neutral-900 text-xs">{emp.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-xs font-medium text-neutral-500">{emp.email}</TableCell>
                <TableCell className="py-4 text-xs font-semibold text-neutral-700">{emp.dept}</TableCell>
                <TableCell className="py-4 text-xs font-semibold text-neutral-600">{emp.role}</TableCell>
                <TableCell className="py-4 text-xs font-semibold text-neutral-900">{emp.allocatedAssetsCount} devices</TableCell>
                <TableCell className="py-4">
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${emp.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-neutral-100 text-neutral-600"}`}>
                    {emp.status}
                  </span>
                </TableCell>
                <TableCell className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => { setSelectedItem({ type: "employee", data: emp }); setDrawerTab("Overview"); setIsDrawerOpen(true); }} className="px-2.5 py-1 text-[10px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-600 transition-colors">View Details</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  // Render Page 5 - Categories
  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white border border-neutral-200/80 rounded-lg p-6">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Asset Categories</h3>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium">Configure classification ledgers, warranty thresholds, and custom checklists</p>
        </div>
        <button onClick={() => setIsAddCategoryModalOpen(true)} className="px-3.5 py-1.5 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors">
          Create Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat: any, idx: number) => (
          <div key={idx} className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4 justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-50 border border-neutral-100 rounded-lg text-neutral-600">
                  <HugeiconsIcon icon={Folder01Icon} size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">{cat.name}</h4>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase mt-0.5">{cat.id}</p>
                </div>
              </div>
              <button onClick={() => triggerToast("Actions menu opened", "success")} className="p-1 hover:bg-neutral-100 rounded-md text-neutral-400">
                <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
              </button>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between text-neutral-500">
                <span>Total Assets:</span>
                <span className="font-bold text-neutral-950">{cat.assetsCount} items</span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span>Warranty Period:</span>
                <span className="font-semibold text-neutral-800">{cat.warrantyPeriod}</span>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Attributes:</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {(cat.customAttributes || []).map((attr: any, aIdx: number) => (
                    <span key={aIdx} className="text-[9px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-medium">{attr}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Page 6 - Asset Overview (Admin Analytics)
  const renderAssetOverview = () => (
    <div className="space-y-8">
      <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Admin Asset Overview</h3>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium">Verify system hardware distributions, warranty schedules, and logs</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-neutral-100 text-xs">
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Recently Registered</span>
            <p className="text-lg font-bold text-neutral-900 mt-1">8 hardware logs</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Warranty Expiring Soon</span>
            <p className="text-lg font-bold text-neutral-950 mt-1">3 items (14 days)</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Average Item Usage</span>
            <p className="text-lg font-bold text-neutral-900 mt-1">32.4 months</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Depreciation Ratio</span>
            <p className="text-lg font-bold text-emerald-600 mt-1">4.2% optimized</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap */}
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6">
          <CustomHeatmap />
        </div>

        {/* Pie Chart */}
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight mb-2">Assets by Status Allocation</h3>
          <CustomPieChart
            data={[
              { name: "Available", value: 114, color: "#e5e5e5" },
              { name: "Allocated", value: 206, color: "#171717" },
              { name: "Maintenance", value: 4, color: "#737373" }
            ]}
          />
        </div>
      </div>

      {/* Registrations list */}
      <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Recent Registrations Ledger</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">Chronological checklist of physical and software logs added to the database</p>
          </div>
          <button onClick={() => setIsAddAssetModalOpen(true)} className="px-3.5 py-1.5 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors">
            Add Asset
          </button>
        </div>
        <div className="mt-2">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-neutral-100">
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Asset ID</TableHead>
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Asset Name</TableHead>
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Category</TableHead>
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Custodian</TableHead>
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Warranty Expiration</TableHead>
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assetsList.map((asset) => (
                <TableRow key={asset.id} className="border-neutral-100 hover:bg-neutral-50/50">
                  <TableCell className="py-3 text-xs font-bold text-neutral-455">#{asset.id}</TableCell>
                  <TableCell className="py-3 text-xs font-semibold text-neutral-900">{asset.name}</TableCell>
                  <TableCell className="py-3 text-xs text-neutral-500 font-medium">{asset.category}</TableCell>
                  <TableCell className="py-3 text-xs text-neutral-500 font-medium">{asset.custodian}</TableCell>
                  <TableCell className="py-3 text-xs text-neutral-400 font-medium">{asset.warrantyExpiry}</TableCell>
                  <TableCell className="py-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      asset.status === "Allocated" ? "bg-neutral-950 text-white" : asset.status === "Available" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {asset.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  // Render Page 7 - Audits
  const renderAudits = () => (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Audit Center</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">Verify system hardware inventories and checklists matching GRI standards</p>
          </div>
          <button onClick={() => triggerToast("Start Audit form loaded", "success")} className="px-3.5 py-1.5 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors">
            Start Audit
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-neutral-100 text-xs">
          <div>
            <span className="text-neutral-450 font-bold uppercase tracking-wider text-[9px]">Completed Audits</span>
            <p className="text-lg font-bold text-neutral-900 mt-1">12 audits</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Pending Checks</span>
            <p className="text-lg font-bold text-amber-600 mt-1">2 remaining</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Successful Audits</span>
            <p className="text-lg font-bold text-emerald-600 mt-1">11 reviews</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Failed Audits</span>
            <p className="text-lg font-bold text-red-600 mt-1">1 scan</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200/80 rounded-lg p-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-neutral-100">
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Audit Name</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Department</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Auditor Assigned</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Start Date</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Progress</TableHead>
              <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditsList.map((audit: any) => (
              <TableRow key={audit.id} className="border-neutral-100 hover:bg-neutral-50/50 cursor-pointer" onClick={() => { setSelectedItem({ type: "audit", data: audit }); setDrawerTab("Overview"); setIsDrawerOpen(true); }}>
                <TableCell className="py-4 text-xs font-bold text-neutral-900">{audit.name}</TableCell>
                <TableCell className="py-4 text-xs font-medium text-neutral-500">{audit.department}</TableCell>
                <TableCell className="py-4 text-xs text-neutral-500 font-semibold">{audit.auditor}</TableCell>
                <TableCell className="py-4 text-xs text-neutral-400 font-medium">{audit.startDate}</TableCell>
                <TableCell className="py-4">
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    audit.status === "Completed" ? "bg-neutral-950 text-white" : audit.status === "In Progress" ? "bg-amber-50 text-amber-700" : audit.status === "Failed" ? "bg-red-50 text-red-700" : "bg-neutral-100 text-neutral-550"
                  }`}>
                    {audit.status}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-black h-full rounded-full" style={{ width: `${audit.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600">{audit.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => { setSelectedItem({ type: "audit", data: audit }); setDrawerTab("Overview"); setIsDrawerOpen(true); }} className="px-2.5 py-1 text-[10px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-600 transition-colors">Details</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  // Render Page 8 - Reports
  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Reports & Disclosures</h3>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium">Generate custom reports, depreciation sheets, and audit ledgers</p>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-neutral-100 pt-4 text-xs font-semibold text-neutral-600">
          <span>Export Options:</span>
          <button onClick={() => triggerToast("CSV export compiled", "success")} className="px-2 py-0.5 bg-neutral-100 rounded hover:bg-neutral-200 transition-colors">CSV</button>
          <button onClick={() => triggerToast("Excel ledger compiled", "success")} className="px-2 py-0.5 bg-neutral-100 rounded hover:bg-neutral-200 transition-colors">Excel</button>
          <button onClick={() => triggerToast("PDF document compiled", "success")} className="px-2 py-0.5 bg-neutral-100 rounded hover:bg-neutral-200 transition-colors">PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Asset Audit Ledger", desc: "List of active assets mapped to auditor checkout status." },
          { title: "Department Cost Sheet", desc: "Financial depreciation checklist across divisions." },
          { title: "Employee Allocation Report", desc: "Complete records of checked out corporate gear." },
          { title: "System Maintenance Audit", desc: "Diagnostic checks schedules and repair ledger." },
        ].map((report, idx) => (
          <div key={idx} className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-neutral-900">{report.title}</h4>
              <p className="text-[10px] text-neutral-400 font-medium mt-1 leading-relaxed">{report.desc}</p>
            </div>
            <button onClick={() => triggerToast(`${report.title} generated`, "success")} className="w-full py-2 bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg text-xs font-bold transition-all">
              Generate Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Page 9 - Notifications Center
  const renderNotifications = () => (
    <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Notification Center</h3>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium">Verify system warnings, audit alerts, and employee roll checks</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { markAllReadMut.mutate(undefined, { onSuccess: () => triggerToast("All marked as read", "success") }); }} className="px-3 py-1.5 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-lg">Mark All Read</button>
          <button onClick={() => { clearNotifsMut.mutate(undefined, { onSuccess: () => triggerToast("Clear log complete", "error") }); }} className="px-3.5 py-1.5 text-xs font-bold bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg transition-colors">Clear All</button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className={`flex items-start justify-between p-4 border border-neutral-100 rounded-xl bg-[#FBFBFB] ${!notif.read ? "border-l-4 border-l-black" : ""}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-bold px-2 py-0.2 rounded uppercase ${
                  notif.priority === "High" ? "bg-red-50 text-red-700" : notif.priority === "Medium" ? "bg-amber-50 text-amber-700" : "bg-neutral-100 text-neutral-550"
                }`}>{notif.priority}</span>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{notif.type}</span>
              </div>
              <h4 className="text-xs font-bold text-neutral-900 mt-1.5">{notif.title}</h4>
              <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">{notif.description}</p>
              <p className="text-[9px] text-neutral-400 mt-2 font-semibold">{notif.timestamp}</p>
            </div>
            {!notif.read && (
              <button onClick={() => markNotificationRead(notif.id)} className="px-2 py-1 border border-neutral-200 hover:bg-neutral-100 rounded-lg text-[10px] font-semibold text-neutral-600">Mark Read</button>
            )}
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="text-xs text-neutral-400 italic text-center py-8">Notification ledger is completely clear</p>
        )}
      </div>
    </div>
  );

  // Render Page 10 - Roles & Permissions (RBAC Permission Matrix)
  const renderRolesPermissions = () => {
    const modules = ["Departments", "Employees", "Categories", "Assets", "Reports", "Audits", "Settings"];
    const actions = ["view", "create", "edit", "delete", "approve", "export"];

    const togglePermission = (module: string, action: string) => {
      setRbacPermissions((prev) => {
        const updatedModule = { ...prev[selectedRoleForPermissions][module] };
        updatedModule[action] = !updatedModule[action];
        return {
          ...prev,
          [selectedRoleForPermissions]: {
            ...prev[selectedRoleForPermissions],
            [module]: updatedModule,
          },
        };
      });
    };

    return (
      <div className="space-y-6">
        {/* Role Selectors Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Admin", "Asset Manager", "Department Head", "Employee"].map((role) => (
            <div
              key={role}
              onClick={() => setSelectedRoleForPermissions(role)}
              className={`p-5 border rounded-lg cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                selectedRoleForPermissions === role
                  ? "bg-neutral-950 text-white border-neutral-950 shadow-md"
                  : "bg-white text-neutral-900 border-neutral-200/80 hover:bg-neutral-50"
              }`}
            >
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">{role}</h4>
                <p className={`text-[10px] mt-1 leading-relaxed ${selectedRoleForPermissions === role ? "text-neutral-300" : "text-neutral-400"}`}>
                  {role === "Admin" && "Full administrative workspace access"}
                  {role === "Asset Manager" && "Register items, configure categories, start audits"}
                  {role === "Department Head" && "Approve division checkouts and view logs"}
                  {role === "Employee" && "View allocated equipment and request checkouts"}
                </p>
              </div>
              <span className={`text-[10px] font-bold ${selectedRoleForPermissions === role ? "text-white" : "text-neutral-500"}`}>
                Configure Matrix →
              </span>
            </div>
          ))}
        </div>

        {/* Permissions Matrix with switches */}
        <div className="bg-white border border-neutral-200/80 rounded-lg p-6">
          <div className="border-b border-neutral-100 pb-4 mb-4">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Access Privileges Matrix: {selectedRoleForPermissions}</h3>
            <p className="text-[10px] text-neutral-400 mt-1 font-semibold">Toggle access permissions below using sliding switches</p>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="py-3 font-bold text-neutral-400 uppercase text-[10px]">Module / Entity</th>
                  {actions.map((act) => (
                    <th key={act} className="py-3 font-bold text-neutral-400 uppercase text-[10px] text-center">{act}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((mod) => (
                  <tr key={mod} className="border-t border-neutral-50 hover:bg-neutral-50/50">
                    <td className="py-4 font-semibold text-neutral-800">{mod}</td>
                    {actions.map((act) => {
                      const isAllowed = rbacPermissions[selectedRoleForPermissions]?.[mod]?.[act] || false;
                      return (
                        <td key={act} className="py-4 text-center">
                          <div className="flex justify-center">
                            {/* Switch Component */}
                            <button
                              onClick={() => togglePermission(mod, act)}
                              className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                                isAllowed ? "bg-black" : "bg-neutral-200"
                              }`}
                            >
                              <span
                                className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                                  isAllowed ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render Page 11 - Expandable Accordion Settings
  const renderSettings = () => (
    <div className="space-y-6">
      {/* 1. Organization Information */}
      <div className="bg-white border border-neutral-200/80 rounded-lg overflow-hidden">
        <div
          onClick={() => toggleSettingsSection("org")}
          className="p-5 border-b border-neutral-100 flex items-center justify-between cursor-pointer hover:bg-neutral-50"
        >
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Organization Information</h4>
            <p className="text-[10px] text-neutral-400 mt-0.5">Corporate business identities, registration tax codes, and addresses</p>
          </div>
          <span className="text-neutral-500 font-bold text-xs">{expandedSettings.org ? "▲" : "▼"}</span>
        </div>
        {expandedSettings.org && (
          <div className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-800">Organization Name</label>
                <input type="text" defaultValue="AssetFlow Inc." className="w-full px-3 py-2 border border-neutral-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-neutral-800">Corporate Registry ID (Tax ID)</label>
                <input type="text" defaultValue="TX-9428-11A" className="w-full px-3 py-2 border border-neutral-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-neutral-800">Primary Business Email</label>
                <input type="email" defaultValue="admin@company.com" className="w-full px-3 py-2 border border-neutral-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-neutral-800">Business Address</label>
                <input type="text" defaultValue="Market St, San Francisco, CA" className="w-full px-3 py-2 border border-neutral-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
            </div>
            <button onClick={() => triggerToast("Organization details saved", "success")} className="px-4 py-2 text-xs font-bold bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg transition-colors">
              Save Details
            </button>
          </div>
        )}
      </div>

      {/* 2. Notification preferences */}
      <div className="bg-white border border-neutral-200/80 rounded-lg overflow-hidden">
        <div
          onClick={() => toggleSettingsSection("notifications")}
          className="p-5 border-b border-neutral-100 flex items-center justify-between cursor-pointer hover:bg-neutral-50"
        >
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Notification Parameters</h4>
            <p className="text-[10px] text-neutral-400 mt-0.5">Toggle alert targets for system, audits, and asset warranty checks</p>
          </div>
          <span className="text-neutral-500 font-bold text-xs">{expandedSettings.notifications ? "▲" : "▼"}</span>
        </div>
        {expandedSettings.notifications && (
          <div className="p-6 space-y-4 text-xs">
            <div className="space-y-3">
              {[
                { title: "Enable Email Alerts", desc: "Receive immediate notifications on checkouts and transfers requests" },
                { title: "Enable Audit Reminders", desc: "Weekly reminder updates on pending physical verification schedules" },
                { title: "Hardware Warranty Alerts", desc: "Flag items whose coverage dates expire in less than 30 days" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-neutral-50 rounded-lg">
                  <div>
                    <h5 className="font-bold text-neutral-800">{item.title}</h5>
                    <p className="text-[10px] text-neutral-400 mt-0.5 font-medium">{item.desc}</p>
                  </div>
                  <button className="relative w-9 h-5 rounded-full transition-colors duration-200 bg-black">
                    <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full translate-x-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Security Settings */}
      <div className="bg-white border border-neutral-200/80 rounded-lg overflow-hidden">
        <div
          onClick={() => toggleSettingsSection("security")}
          className="p-5 border-b border-neutral-100 flex items-center justify-between cursor-pointer hover:bg-neutral-50"
        >
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Security Preferences</h4>
            <p className="text-[10px] text-neutral-400 mt-0.5">Configure password lengths, timeout settings, and cloud backup frequencies</p>
          </div>
          <span className="text-neutral-500 font-bold text-xs">{expandedSettings.security ? "▲" : "▼"}</span>
        </div>
        {expandedSettings.security && (
          <div className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-800">Minimum Password Length</label>
                <input type="number" defaultValue={12} className="w-full px-3 py-2 border border-neutral-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-neutral-800">Session Timeout (Minutes)</label>
                <input type="number" defaultValue={30} className="w-full px-3 py-2 border border-neutral-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-neutral-800">Cloud Backup Schedule</label>
                <select className="w-full px-3 py-2 border border-neutral-250 rounded-lg bg-white">
                  <option>Every 24 Hours</option>
                  <option>Every 12 Hours</option>
                  <option>Real-time sync</option>
                </select>
              </div>
            </div>
            <button onClick={() => triggerToast("Security parameters applied", "success")} className="px-4 py-2 text-xs font-bold bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg transition-colors">Apply Security</button>
          </div>
        )}
      </div>

      {/* 4. Danger Zone */}
      <div className="bg-red-50/20 border border-red-200 rounded-lg overflow-hidden">
        <div className="p-5 border-b border-red-200 bg-red-50/50 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider">Danger Zone</h4>
            <p className="text-[10px] text-red-550 mt-0.5">Destructive actions for workspace accounts and organizational ledgers</p>
          </div>
        </div>
        <div className="p-6 flex flex-wrap gap-4 text-xs font-bold">
          <button
            onClick={() => {
              setConfirmModal({
                isOpen: true,
                title: "Delete All Assets Data?",
                description: "Are you sure you want to purge all company physical hardware allocations log? This action is permanent and cannot be undone.",
                onConfirm: () => triggerToast("All asset files deleted", "error")
              });
            }}
            className="px-3.5 py-2 border border-red-200 hover:bg-red-50 text-red-650 rounded-lg"
          >
            Clear Assets Ledger
          </button>
          <button
            onClick={() => {
              setConfirmModal({
                isOpen: true,
                title: "Deactivate Workspace?",
                description: "Are you sure you want to deactivate AssetFlow organization workspace? All accounts and databases will be locked.",
                onConfirm: () => triggerToast("Workspace deactivated", "error")
              });
            }}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Deactivate Workspace
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F9F9F9] text-neutral-900 font-sans overflow-hidden">
      {/* Sidebar - Collapsible */}
      <motion.div
        animate={{ width: isSidebarOpen ? 260 : 76 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-full bg-white border-r border-neutral-200/80 flex flex-col justify-between z-20 shrink-0"
      >
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
            {isSidebarOpen ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="text-black shrink-0">
                    <HugeiconsIcon icon={AsteriskIcon} size={24} />
                  </div>
                  <span className="font-bold text-base tracking-tight">AssetFlow</span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="mx-auto p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </button>
            )}
          </div>

          {/* Navigation Links - Partition 1 */}
          <div className="p-4 py-3 space-y-1.5">
            {generalNavItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
                    isActive
                       ? "bg-neutral-950 text-white font-medium"
                       : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-600"}>
                      <HugeiconsIcon icon={item.icon} size={20} />
                    </div>
                    {isSidebarOpen && <span className="text-sm">{item.name}</span>}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Partition Separator */}
          <div className="px-4 py-2 flex items-center gap-2">
            <div className="flex-1 border-t border-neutral-200/60"></div>
            {isSidebarOpen && (
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1">
                Management
              </span>
            )}
            <div className="flex-1 border-t border-neutral-200/60"></div>
          </div>

          {/* Navigation Links - Partition 2 */}
          <div className="p-4 py-3 space-y-1.5 text-neutral-500">
            {managementNavItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
                    isActive
                      ? "bg-neutral-950 text-white font-medium"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-600"}>
                      <HugeiconsIcon icon={item.icon} size={20} />
                    </div>
                    {isSidebarOpen && <span className="text-sm">{item.name}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-100 flex flex-col gap-3 shrink-0">
          {/* Settings link */}
          <Link
            href="#"
            onClick={() => setActiveTab("ESG Configuration")}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
              activeTab === "ESG Configuration"
                ? "bg-neutral-950 text-white font-medium"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={activeTab === "ESG Configuration" ? "text-white" : "text-neutral-400 group-hover:text-neutral-600"}>
                <HugeiconsIcon icon={Settings01Icon} size={20} />
              </div>
              {isSidebarOpen && <span className="text-sm">Settings</span>}
            </div>
          </Link>

          {/* Sign Out link */}
          <button
            onClick={() => {
              window.location.href = "/login-in";
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-red-600 hover:text-red-700 hover:bg-red-50/50 group"
          >
            <div className="text-red-500 group-hover:text-red-600">
              <HugeiconsIcon icon={Logout01Icon} size={20} />
            </div>
            {isSidebarOpen && <span className="text-sm font-semibold">Sign Out</span>}
          </button>

          <div className="h-px bg-neutral-200/60 my-0.5"></div>

          {/* User profile representation */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-200 border border-neutral-300 flex items-center justify-center font-bold text-neutral-700 shrink-0 text-sm">
              AD
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate leading-none mb-1">Alex Dupont</p>
                <p className="text-xs text-neutral-400 truncate">Workspace Admin</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-neutral-200/60 bg-white px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <HugeiconsIcon icon={Search01Icon} size={18} />
              </span>
              <input
                type="text"
                placeholder="Search CSR activities, challenges, carbon offset data, policies..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all bg-[#F9F9F9] placeholder:text-neutral-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("Notifications")}
              className={`p-2 hover:bg-neutral-100 rounded-lg transition-colors relative ${activeTab === "Notifications" ? "text-neutral-900 bg-neutral-100" : "text-neutral-500"}`}
            >
              <HugeiconsIcon icon={Notification01Icon} size={20} />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-neutral-900 rounded-full border border-white"></span>
              )}
            </button>
            <div className="h-8 w-px bg-neutral-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-neutral-950 text-white rounded-lg flex items-center justify-center text-[10px] font-extrabold uppercase">
                AD
              </div>
              <span className="text-xs font-semibold text-neutral-600">Workspace Admin</span>
            </div>
          </div>
        </header>

        {/* Dynamic Panel Container */}
        <main className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {/* Header Title with Breadcrumbs */}
          <div className="flex flex-col gap-1.5 border-b border-neutral-200/50 pb-5">
            <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              <span>AssetFlow</span>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-700 font-semibold">{activeTab}</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 mt-1">{activeTab}</h1>
            <p className="text-xs text-neutral-500 font-medium">
              {activeTab === "Dashboard" && "Monitor organization activity, checkouts, and allocations from a single dashboard."}
              {activeTab === "Organization" && "Configure primary corporate registries, tax identities, and branches."}
              {activeTab === "Departments" && "Manage organization departments, heads, cost centers, and checkout permissions."}
              {activeTab === "Employees" && "Track personnel records, roles list, email contacts, and allocated equipment."}
              {activeTab === "Categories" && "Classify company hardware categories, warranty limits, and custom attributes."}
              {activeTab === "Asset Overview" && "Administrative dashboard for physical gear metrics, heatmaps, and stats."}
              {activeTab === "Audits" && "Plan and track barcode scans, asset verifications, and compliance checklists."}
              {activeTab === "Reports" && "Generate and download custom CSV, Excel, or PDF asset reports."}
              {activeTab === "Notifications" && "Verify system notifications logs, priority warnings, and alerts."}
              {activeTab === "Roles & Permissions" && "Manage RBAC access privileges matrix using animated switch toggles."}
              {activeTab === "Settings" && "Manage brand parameters, security keys, email structures, and timeouts."}
            </p>
          </div>

          {/* Render Active View */}
          {activeTab === "Dashboard" && renderDashboard()}
          {activeTab === "Organization" && renderOrganization()}
          {activeTab === "Departments" && renderDepartments()}
          {activeTab === "Employees" && renderEmployees()}
          {activeTab === "Categories" && renderCategories()}
          {activeTab === "Asset Overview" && renderAssetOverview()}
          {activeTab === "Audits" && renderAudits()}
          {activeTab === "Reports" && renderReports()}
          {activeTab === "Notifications" && renderNotifications()}
          {activeTab === "Roles & Permissions" && renderRolesPermissions()}
          {activeTab === "Settings" && renderSettings()}
        </main>

        {/* Global Overlays */}
        {renderDetailDrawer()}
        {renderToast()}
        {renderConfirmModal()}
        <AddEmployeeModal isOpen={isAddEmployeeModalOpen} onClose={() => setIsAddEmployeeModalOpen(false)} onSuccess={() => triggerToast("Employee added successfully", "success")} />
        <AddDepartmentModal isOpen={isAddDepartmentModalOpen} onClose={() => setIsAddDepartmentModalOpen(false)} onSuccess={() => triggerToast("Department created successfully", "success")} />
        <AddAssetModal isOpen={isAddAssetModalOpen} onClose={() => setIsAddAssetModalOpen(false)} onSuccess={() => triggerToast("Asset registered successfully", "success")} />
        <AddCategoryModal isOpen={isAddCategoryModalOpen} onClose={() => setIsAddCategoryModalOpen(false)} onSuccess={() => triggerToast("Category created successfully", "success")} />
      </div>
    </div>
  );
}

