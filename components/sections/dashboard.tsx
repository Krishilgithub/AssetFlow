"use client";

import { useState } from "react";
import Link from "next/link";
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

export function DashboardSection() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [currentRole, setCurrentRole] = useState<"Admin" | "Asset Manager">("Admin");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);

  // Form input states
  const [newAssetData, setNewAssetData] = useState({
    name: "",
    category: "IT Hardware",
    assetTag: "",
    serialNumber: "",
    description: "",
    purchaseDate: "2026-07-12",
    purchaseCost: "",
    vendor: "",
    warrantyPeriod: "36 Months",
    warrantyExpiry: "2029-07-12",
    department: "Engineering",
    building: "Main HQ",
    floor: "Floor 2",
    room: "Room 204",
    storageLocation: "Shelf C-1",
    notes: "",
  });

  const [newAllocationData, setNewAllocationData] = useState({
    assetId: "",
    employeeId: "",
    allocatedOn: "2026-07-12",
    expectedReturn: "2027-07-12",
    remarks: "",
  });

  // Allocations state
  const [allocations, setAllocations] = useState([
    { id: "ALC-01", assetId: "AST-0010", assetName: "MacBook Pro 16\" M3 Max", employeeId: "EMP-107", employeeName: "Aria Thorne", department: "Engineering", allocatedOn: "Jan 15, 2026", expectedReturn: "Jan 15, 2027", status: "Active" },
    { id: "ALC-02", assetId: "AST-0114", assetName: "Dell UltraSharp 32\" 4K", employeeId: "EMP-102", employeeName: "Marcus Vance", department: "Engineering", allocatedOn: "Feb 18, 2026", expectedReturn: "Feb 18, 2027", status: "Active" },
    { id: "ALC-03", assetId: "AST-0552", assetName: "iPad Pro 12.9\" M2", employeeId: "EMP-103", employeeName: "Emily Rogers", department: "Finance", allocatedOn: "Jul 22, 2025", expectedReturn: "Jul 22, 2026", status: "Overdue" },
  ]);

  // Transfers state
  const [transfers, setTransfers] = useState([
    { id: "TRF-01", assetId: "AST-0010", assetName: "MacBook Pro 16\" M3 Max", fromUser: "Priya Shah", toUser: "Marcus Vance", requestedBy: "Priya Shah", status: "Pending", date: "Jul 05, 2026", reason: "Division upgrade requirements" },
    { id: "TRF-02", assetId: "AST-0114", assetName: "Dell UltraSharp 32\" 4K", fromUser: "Marcus Vance", toUser: "Aria Thorne", requestedBy: "Marcus Vance", status: "Approved", date: "Jun 12, 2026", reason: "Project desk rearrangement" },
  ]);

  // Maintenance tickets state
  const [maintenance, setMaintenance] = useState([
    { id: "MNT-01", assetId: "AST-0010", assetName: "MacBook Pro 16\" M3 Max", issue: "Keyboard keys sticky", priority: "High", raisedBy: "Priya Shah", technician: "Sarah Connor", status: "In Progress", cost: "$120", date: "Jul 10, 2026" },
    { id: "MNT-02", assetId: "AST-0552", assetName: "iPad Pro 12.9\" M2", issue: "Cracked screen glass replacement", priority: "Critical", raisedBy: "Emily Rogers", technician: "Dave Miller", status: "Pending", cost: "$250", date: "Jul 11, 2026" },
    { id: "MNT-03", assetId: "AST-0114", assetName: "Dell UltraSharp 32\" 4K", issue: "Calibration resets on sleep", priority: "Low", raisedBy: "Marcus Vance", technician: "Self-Service", status: "Resolved", cost: "$0", date: "Jul 08, 2026" },
  ]);

  // Resource bookings state
  const [bookings, setBookings] = useState([
    { id: "BKG-01", resource: "Conference Room Projector 4K", bookedBy: "Marcus Vance", purpose: "Engineering Sprint Review", fromDate: "2026-07-15 10:00", toDate: "2026-07-15 12:00", status: "Active" },
    { id: "BKG-02", resource: "VR Oculus Headset", bookedBy: "Aria Thorne", purpose: "Visualizing 3D Assets Space", fromDate: "2026-07-16 14:00", toDate: "2026-07-16 17:00", status: "Upcoming" },
  ]);

  // Mock State for Departments
  const [departments, setDepartments] = useState([
    { id: "DEP-01", name: "Engineering", head: "Marcus Vance", headInitials: "MV", employeesCount: 42, assetsCount: 95, status: "Active", createdDate: "Jan 15, 2023" },
    { id: "DEP-02", name: "IT Operations", head: "Priya Shah", headInitials: "PS", employeesCount: 15, assetsCount: 110, status: "Active", createdDate: "Mar 10, 2023" },
    { id: "DEP-03", name: "Operations", head: "Alex Dupont", headInitials: "AD", employeesCount: 35, assetsCount: 45, status: "Active", createdDate: "Jun 02, 2022" },
    { id: "DEP-04", name: "Marketing", head: "Sarah Jenkins", headInitials: "SJ", employeesCount: 22, assetsCount: 25, status: "Active", createdDate: "Sep 18, 2023" },
    { id: "DEP-05", name: "Human Resources", head: "Darnell Cole", headInitials: "DC", employeesCount: 12, assetsCount: 30, status: "Active", createdDate: "Nov 01, 2023" },
    { id: "DEP-06", name: "Finance", head: "Emily Rogers", headInitials: "ER", employeesCount: 8, assetsCount: 19, status: "Active", createdDate: "Dec 12, 2022" },
  ]);

  // Mock State for Employees
  const [employees, setEmployees] = useState([
    { id: "EMP-101", name: "Priya Shah", email: "priya.shah@company.com", initials: "PS", dept: "IT Operations", role: "Asset Manager", allocatedAssetsCount: 4, status: "Active" },
    { id: "EMP-102", name: "Marcus Vance", email: "marcus.vance@company.com", initials: "MV", dept: "Engineering", role: "Department Head", allocatedAssetsCount: 3, status: "Active" },
    { id: "EMP-103", name: "Emily Rogers", email: "emily.rogers@company.com", initials: "ER", dept: "Finance", role: "Department Head", allocatedAssetsCount: 2, status: "Active" },
    { id: "EMP-104", name: "Darnell Cole", email: "darnell.cole@company.com", initials: "DC", dept: "Human Resources", role: "Employee", allocatedAssetsCount: 1, status: "Active" },
    { id: "EMP-105", name: "Alex Dupont", email: "alex.dupont@company.com", initials: "AD", dept: "Operations", role: "Employee", allocatedAssetsCount: 2, status: "Active" },
    { id: "EMP-106", name: "Sarah Jenkins", email: "sarah.jenkins@company.com", initials: "SJ", dept: "Marketing", role: "Employee", allocatedAssetsCount: 1, status: "Active" },
    { id: "EMP-107", name: "Aria Thorne", email: "aria.thorne@company.com", initials: "AT", dept: "Engineering", role: "Employee", allocatedAssetsCount: 2, status: "Active" },
    { id: "EMP-108", name: "John Doe", email: "john.doe@company.com", initials: "JD", dept: "Engineering", role: "Employee", allocatedAssetsCount: 0, status: "Inactive" },
  ]);

  // Mock State for Categories
  const [categories, setCategories] = useState([
    { id: "CAT-01", name: "IT Hardware", icon: Folder01Icon, assetsCount: 145, warrantyPeriod: "36 Months", customAttributes: ["Depreciation: 5 years", "Tag Required: Yes"] },
    { id: "CAT-02", name: "AV Equipment", icon: Folder01Icon, assetsCount: 32, warrantyPeriod: "24 Months", customAttributes: ["Depreciation: 3 years", "Calibrated: Annual"] },
    { id: "CAT-03", name: "Office Furniture", icon: Folder01Icon, assetsCount: 65, warrantyPeriod: "60 Months", customAttributes: ["Depreciation: 7 years", "Warranty Type: On-Site"] },
    { id: "CAT-04", name: "Mobile Devices", icon: Folder01Icon, assetsCount: 48, warrantyPeriod: "24 Months", customAttributes: ["Depreciation: 2 years", "MDM Configured: Yes"] },
    { id: "CAT-05", name: "Network Gear", icon: Folder01Icon, assetsCount: 22, warrantyPeriod: "36 Months", customAttributes: ["Depreciation: 5 years", "Location: Server Room"] },
    { id: "CAT-06", name: "Software Licenses", icon: Folder01Icon, assetsCount: 12, warrantyPeriod: "12 Months", customAttributes: ["Type: Subscription", "Key Required: Yes"] },
  ]);

  // Mock State for Assets List
  const [assetsList, setAssetsList] = useState([
    { id: "AST-0010", name: "MacBook Pro 16\" M3 Max", category: "IT Hardware", custodian: "Priya Shah", department: "IT Operations", purchasedDate: "Jan 12, 2024", warrantyExpiry: "Jan 12, 2027", status: "Allocated" },
    { id: "AST-0114", name: "Dell UltraSharp 32\" 4K", category: "IT Hardware", custodian: "Marcus Vance", department: "Engineering", purchasedDate: "Feb 18, 2024", warrantyExpiry: "Feb 18, 2027", status: "Allocated" },
    { id: "AST-0221", name: "Projector Ultra HD 4K", category: "AV Equipment", custodian: "IT Pool", department: "IT Operations", purchasedDate: "Sep 05, 2023", warrantyExpiry: "Sep 05, 2025", status: "Available" },
    { id: "AST-0552", name: "iPad Pro 12.9\" M2", category: "Mobile Devices", custodian: "Emily Rogers", department: "Finance", purchasedDate: "Jul 22, 2024", warrantyExpiry: "Jul 22, 2026", status: "Allocated" },
    { id: "AST-0820", name: "ThinkPad X1 Carbon Gen 11", category: "IT Hardware", custodian: "Alex Dupont", department: "Operations", purchasedDate: "Nov 15, 2023", warrantyExpiry: "Nov 15, 2026", status: "Allocated" },
    { id: "AST-0931", name: "Ergonomic Mesh Chair Office", category: "Office Furniture", custodian: "Darnell Cole", department: "Human Resources", purchasedDate: "Oct 01, 2023", warrantyExpiry: "Oct 01, 2028", status: "Allocated" },
    { id: "AST-1044", name: "CISCO Catalyst Switch 24P", category: "Network Gear", custodian: "Network Admin", department: "IT Operations", purchasedDate: "Mar 11, 2024", warrantyExpiry: "Mar 11, 2027", status: "Allocated" },
    { id: "AST-1088", name: "Camera Kit Sony Alpha 7 IV", category: "AV Equipment", custodian: "Sarah Jenkins", department: "Marketing", purchasedDate: "May 20, 2024", warrantyExpiry: "May 20, 2026", status: "Allocated" },
  ]);

  // Mock State for Audits List
  const [auditsList, setAuditsList] = useState([
    { id: "AUD-801", name: "Q1 IT Equipment Audit", department: "IT Operations", auditor: "Priya Shah", startDate: "Jul 15, 2026", status: "In Progress", progress: 75 },
    { id: "AUD-802", name: "Annual Office Furniture Check", department: "Human Resources", auditor: "Darnell Cole", startDate: "Jul 20, 2026", status: "Scheduled", progress: 0 },
    { id: "AUD-803", name: "Engineering Assets Audit", department: "Engineering", auditor: "Marcus Vance", startDate: "Jun 30, 2026", status: "Completed", progress: 100 },
    { id: "AUD-804", name: "Finance Assets Registry Scan", department: "Finance", auditor: "Internal Auditor", startDate: "May 15, 2026", status: "Failed", progress: 90 },
  ]);

  // Mock State for Pending Approvals
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 1, type: "Audit Requests", title: "Emergency AV Gear Scan", requestedBy: "Sarah Jenkins", initials: "SJ", dept: "Marketing", details: "Request to audit 12 camera lenses and mics", status: "Pending" },
    { id: 2, type: "Role Changes", title: "Promote Priya Shah to Admin", requestedBy: "Marcus Vance", initials: "MV", dept: "Engineering", details: "Grant administrative control over configurations", status: "Pending" },
    { id: 3, type: "Department Requests", title: "Initialize Research Dept", requestedBy: "Aria Thorne", initials: "AT", dept: "Engineering", details: "Request to set up budget and check out list", status: "Pending" },
  ]);

  // Mock State for Notifications list
  const [notifications, setNotifications] = useState([
    { id: 1, type: "System", title: "Low Inventory Warning", description: "Standard company laptops inventory is below threshold of 5 units.", timestamp: "10m ago", priority: "High", read: false },
    { id: 2, type: "Audit", title: "Audit Verification Overdue", description: "Q1 IT Equipment Audit requires physical barcode scan for 4 remaining server rack components.", timestamp: "1h ago", priority: "Medium", read: false },
    { id: 3, type: "Employee", title: "Employee Role Assignment Updated", description: "Alex Dupont has been reassigned to operations asset checkout list.", timestamp: "2h ago", priority: "Low", read: false },
    { id: 4, type: "Assets", title: "Warranty Expiring Soon", description: "iPad Pro (AST-0552) warranty expires in 14 days (Jul 26, 2026).", timestamp: "Yesterday", priority: "High", read: true },
    { id: 5, type: "System", title: "Daily Cloud Backup Success", description: "Daily database copy stored in cloud cold ledger successfully.", timestamp: "2 days ago", priority: "Low", read: true },
  ]);

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

  // Activity Log timeline representation
  const [activityLogs] = useState([
    { user: "Priya Shah", action: "Assigned AST-0010 (MacBook Pro)", module: "Employees", time: "10m ago" },
    { user: "Marcus Vance", action: "Approved AUD-803 (Engineering)", module: "Audits", time: "1h ago" },
    { user: "System Scheduler", action: "Flagged AST-0552 warranty expiry", module: "Assets", time: "2h ago" },
    { user: "Alex Dupont", action: "Transferred AST-0820 control", module: "Assets", time: "Yesterday" },
  ]);

  const handleApprovalAction = (id: number, action: "Approve" | "Reject") => {
    setPendingApprovals((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: action === "Approve" ? "Approved" : "Rejected" } : req))
    );
    triggerToast(`Request ${action === "Approve" ? "approved" : "rejected"} successfully`, "success");
  };

  const markNotificationRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
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

  const assetManagerNavItems = [
    { name: "All Assets", icon: PackageIcon, href: "#" },
    { name: "Register Asset", icon: LicenseIcon, href: "#" },
    { name: "Categories", icon: Folder01Icon, href: "#" },
    { name: "Allocations", icon: ArrowUpDownIcon, href: "#" },
    { name: "Transfers", icon: ArrowLeftRightIcon, href: "#" },
    { name: "Maintenance", icon: ToolsIcon, href: "#" },
    { name: "Bookings", icon: Calendar01Icon, href: "#" },
    { name: "Reports", icon: ClipboardListIcon, href: "#" },
    { name: "Profile", icon: UserMultipleIcon, href: "#" },
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
          {type === "asset" && (
            <>
              <button onClick={() => setDrawerTab("Overview")} className={`py-3 border-b-2 ${drawerTab === "Overview" ? "border-black text-black" : "border-transparent"}`}>Overview</button>
              <button onClick={() => setDrawerTab("Allocation")} className={`py-3 border-b-2 ${drawerTab === "Allocation" ? "border-black text-black" : "border-transparent"}`}>Allocation</button>
              <button onClick={() => setDrawerTab("Timeline")} className={`py-3 border-b-2 ${drawerTab === "Timeline" ? "border-black text-black" : "border-transparent"}`}>Timeline</button>
              <button onClick={() => setDrawerTab("Maintenance")} className={`py-3 border-b-2 ${drawerTab === "Maintenance" ? "border-black text-black" : "border-transparent"}`}>Maintenance</button>
              <button onClick={() => setDrawerTab("Transfers")} className={`py-3 border-b-2 ${drawerTab === "Transfers" ? "border-black text-black" : "border-transparent"}`}>Transfers</button>
              <button onClick={() => setDrawerTab("QR Code")} className={`py-3 border-b-2 ${drawerTab === "QR Code" ? "border-black text-black" : "border-transparent"}`}>QR Code</button>
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
          {type === "asset" && (
            <>
              {drawerTab === "Overview" && (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#FBFBFB] p-4 border border-neutral-100 rounded-lg space-y-2">
                    <p className="font-bold text-neutral-900 text-xs">Specification Sheet</p>
                    <p className="text-neutral-450 mt-1 font-semibold">{data.description || "No descriptions available for this category."}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Category</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.category}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Location Department</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.department}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Purchased Date</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.purchasedDate || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Warranty Deadline</p>
                      <p className="font-semibold text-neutral-900 mt-1">{data.warrantyExpiry || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === "Allocation" && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 border border-neutral-150 rounded-lg space-y-3 bg-[#FBFBFB]">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-bold uppercase text-[9px]">Current Custodian</span>
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase ${
                        data.status === "Available" ? "bg-emerald-50 text-emerald-700 font-bold" : "bg-neutral-950 text-white"
                      }`}>{data.status}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900 mt-1">{data.custodian || "IT Operations Pool"}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Assigned to: {data.department}</p>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === "Timeline" && (
                <div className="space-y-4 text-xs">
                  <p className="font-bold text-neutral-900 text-xs">Asset Activity Logs</p>
                  <div className="relative pl-6 border-l-2 border-neutral-200 space-y-6">
                    {[
                      { title: "Registered in inventory", user: "Dave Miller (IT Ops)", date: "Jan 12, 2026" },
                      { title: "Allocated to custodian", user: data.custodian || "IT Pool", date: "Feb 18, 2026" },
                      { title: "Physical barcode audit checklist complete", user: "Priya Shah", date: "Jun 30, 2026" },
                    ].map((step, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-white border-2 border-black rounded-full" />
                        <div>
                          <p className="font-bold text-neutral-950">{step.title}</p>
                          <p className="text-[10px] text-neutral-450 mt-0.5 font-semibold">By {step.user} • {step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {drawerTab === "Maintenance" && (
                <div className="space-y-3 text-xs">
                  <p className="font-bold text-neutral-900 text-xs">Repairs Checklist History</p>
                  <div className="space-y-2">
                    {maintenance.filter(m => m.assetId === data.id || m.assetName === data.name).map((m, idx) => (
                      <div key={idx} className="p-3 border border-neutral-100 rounded-lg flex items-center justify-between bg-neutral-50/50">
                        <div>
                          <p className="font-bold text-neutral-900">{m.issue}</p>
                          <p className="text-[10px] text-neutral-400">Technician: {m.technician} • Cost: {m.cost}</p>
                        </div>
                        <span className="text-[8px] font-bold text-neutral-500 uppercase">{m.status}</span>
                      </div>
                    ))}
                    {maintenance.filter(m => m.assetId === data.id || m.assetName === data.name).length === 0 && (
                      <p className="text-neutral-400 italic text-center py-4">No maintenance tickets registered for this item</p>
                    )}
                  </div>
                </div>
              )}

              {drawerTab === "Transfers" && (
                <div className="space-y-3 text-xs">
                  <p className="font-bold text-neutral-900 text-xs">Custodian Handovers</p>
                  <div className="space-y-2">
                    {transfers.filter(t => t.assetId === data.id || t.assetName === data.name).map((t, idx) => (
                      <div key={idx} className="p-3 border border-neutral-100 rounded-lg space-y-1 bg-neutral-50/50">
                        <div className="flex justify-between">
                          <span className="font-bold text-neutral-900">{t.fromUser} → {t.toUser}</span>
                          <span className="text-[8px] font-bold text-neutral-500 uppercase">{t.status}</span>
                        </div>
                        <p className="text-[10px] text-neutral-400">Reason: {t.reason}</p>
                      </div>
                    ))}
                    {transfers.filter(t => t.assetId === data.id || t.assetName === data.name).length === 0 && (
                      <p className="text-neutral-400 italic text-center py-4">No transfer logs recorded for this item</p>
                    )}
                  </div>
                </div>
              )}

              {drawerTab === "QR Code" && (
                <div className="space-y-4 text-xs text-center py-6 flex flex-col items-center">
                  <div className="p-4 border border-neutral-200 rounded-xl bg-white shadow-sm flex flex-col items-center gap-3">
                    <svg className="w-32 h-32 text-black" viewBox="0 0 100 100">
                      <rect x="5" y="5" width="20" height="20" fill="currentColor" />
                      <rect x="10" y="10" width="10" height="10" fill="white" />
                      <rect x="75" y="5" width="20" height="20" fill="currentColor" />
                      <rect x="80" y="10" width="10" height="10" fill="white" />
                      <rect x="5" y="75" width="20" height="20" fill="currentColor" />
                      <rect x="10" y="80" width="10" height="10" fill="white" />
                      <rect x="35" y="15" width="10" height="15" fill="currentColor" />
                      <rect x="55" y="5" width="10" height="10" fill="currentColor" />
                      <rect x="40" y="45" width="20" height="20" fill="currentColor" />
                      <rect x="15" y="40" width="10" height="10" fill="currentColor" />
                      <rect x="70" y="50" width="15" height="15" fill="currentColor" />
                      <rect x="50" y="80" width="20" height="10" fill="currentColor" />
                    </svg>
                    <span className="text-[9px] font-bold text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded uppercase">AST-TAG: {data.id}</span>
                  </div>
                  <button onClick={() => triggerToast("QR code downloaded successfully", "success")} className="px-3.5 py-1.5 font-bold bg-black text-white hover:bg-neutral-800 rounded-lg text-[10px]">
                    Download QR Code
                  </button>
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
          { title: "Total Assets", value: "324", sub: "Across all categories", detail: "+12 added this month", icon: PackageIcon },
          { title: "Active Employees", value: "158", sub: "Assigned gear checkouts", detail: "+3 onboarded recently", icon: UserMultipleIcon },
          { title: "Departments", value: "6", sub: "Corporate branches", detail: "Active cost centers", icon: Building01Icon },
          { title: "Pending Audits", value: "2", sub: "Verification checks", detail: "Awaiting physical scans", icon: Audit01Icon },
          { title: "Active Maintenance", value: "4", sub: "Under service/repair", detail: "1 urgent diagnostic", icon: ToolsIcon },
          { title: "Available Assets", value: "114", sub: "Ready in inventory", detail: "35.2% stock level", icon: PackageIcon },
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
          <button onClick={() => { setActiveTab("Departments"); triggerToast("Department form opened", "success"); }} className="px-4 py-2 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-all flex items-center gap-2">
            Add Department
          </button>
          <button onClick={() => { setActiveTab("Employees"); triggerToast("Employee form opened", "success"); }} className="px-4 py-2 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-700 transition-all">
            Add Employee
          </button>
          <button onClick={() => { setActiveTab("Categories"); triggerToast("Create Category form opened", "success"); }} className="px-4 py-2 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-700 transition-all">
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
              data={[
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
              {activityLogs.map((activity, idx) => (
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
              {auditsList.map((audit, idx) => (
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
        <button onClick={() => triggerToast("Add Department modal opened", "success")} className="px-3.5 py-1.5 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors">
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
                          setDepartments(prev => prev.map(d => d.id === dept.id ? { ...d, status: "Inactive" } : d));
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
          <button onClick={() => triggerToast("CSV Export initiated", "success")} className="px-3 py-1.5 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-lg">Export</button>
          <button onClick={() => triggerToast("Add Employee modal opened", "success")} className="px-3.5 py-1.5 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors">Add Employee</button>
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
          <option value="Engineering">Engineering</option>
          <option value="IT Operations">IT Operations</option>
          <option value="Operations">Operations</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Finance">Finance</option>
        </select>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-1.5 border border-neutral-200 rounded-lg bg-white">
          <option value="All">All Roles</option>
          <option value="Asset Manager">Asset Manager</option>
          <option value="Department Head">Department Head</option>
          <option value="Employee">Employee</option>
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
        <button onClick={() => triggerToast("Add Category screen opened", "success")} className="px-3.5 py-1.5 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors">
          Create Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
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
                  {cat.customAttributes.map((attr, aIdx) => (
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
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Recent Registrations Ledger</h3>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium">Chronological checklist of physical and software logs added to the database</p>
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
            {auditsList.map((audit) => (
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
          <button onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); triggerToast("All marked as read", "success"); }} className="px-3 py-1.5 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-lg">Mark All Read</button>
          <button onClick={() => { setNotifications([]); triggerToast("Clear log complete", "error"); }} className="px-3.5 py-1.5 text-xs font-bold bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg transition-colors">Clear All</button>
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

  // ==========================================
  // ASSET MANAGER RENDER HELPERS
  // ==========================================

  // 1. Asset Manager Dashboard Page
  const renderAssetManagerDashboard = () => {
    const kpis = [
      { name: "Total Assets", value: assetsList.length + 198, desc: "Across all offices", icon: PackageIcon, color: "text-neutral-900" },
      { name: "Available Assets", value: 114, desc: "Ready for deployment", icon: AsteriskIcon, color: "text-emerald-600" },
      { name: "Allocated Assets", value: allocations.filter(a => a.status === "Active").length + 85, desc: "Currently in use", icon: ArrowUpDownIcon, color: "text-neutral-700" },
      { name: "Under Maintenance", value: maintenance.filter(m => m.status !== "Resolved").length, desc: "Undergoing repairs", icon: ToolsIcon, color: "text-amber-600" },
      { name: "Reserved Assets", value: bookings.filter(b => b.status === "Upcoming").length, desc: "For upcoming bookings", icon: Calendar01Icon, color: "text-blue-600" },
      { name: "Due for Return", value: allocations.filter(a => a.status === "Overdue").length, desc: "Requires attention", icon: AlertCircleIcon, color: "text-red-600" },
      { name: "Pending Maintenance", value: maintenance.filter(m => m.status === "Pending").length, desc: "Requires review", icon: ToolsIcon, color: "text-purple-600" },
      { name: "Active Bookings", value: bookings.filter(b => b.status === "Active").length, desc: "In use today", icon: CalendarClockIcon, color: "text-indigo-600" },
    ];

    // Form triggers or mock handlers
    const quickActions = [
      { name: "Register Asset", tab: "Register Asset", desc: "Add new item", icon: LicenseIcon },
      { name: "Allocate Asset", tab: "Allocations", desc: "Deploy equipment", icon: ArrowUpDownIcon },
      { name: "Create Booking", tab: "Bookings", desc: "Reserve resource", icon: Calendar01Icon },
      { name: "Raise Maintenance", tab: "Maintenance", desc: "Report hardware issue", icon: ToolsIcon },
      { name: "View Reports", tab: "Reports", desc: "Export analytics", icon: ClipboardListIcon },
    ];

    return (
      <div className="space-y-8">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white border border-neutral-200/80 rounded-lg p-5 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{kpi.name}</span>
                <span className={kpi.color}>
                  <HugeiconsIcon icon={kpi.icon} size={18} />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight">{kpi.value}</h3>
                <p className="text-[10px] text-neutral-450 mt-1 font-semibold">{kpi.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Distribution & Donut */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider mb-4">Asset Status Distribution</h3>
            <div className="flex flex-col md:flex-row items-center justify-around gap-6">
              <CustomDonutChart
                data={[
                  { name: "Allocated", value: 206, color: "#171717" },
                  { name: "Available", value: 114, color: "#e5e5e5" },
                  { name: "Maintenance", value: 4, color: "#737373" }
                ]}
              />
              <div className="space-y-2 text-xs w-full max-w-xs">
                {[
                  { name: "Allocated", count: "206 items", color: "bg-neutral-950" },
                  { name: "Available", count: "114 items", color: "bg-neutral-200" },
                  { name: "Maintenance", count: "4 items", color: "bg-neutral-400" },
                ].map((st, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neutral-500 font-medium">
                      <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                      <span>{st.name}</span>
                    </div>
                    <span className="font-bold text-neutral-900">{st.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Allocation trends (Line Chart representation) */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6">
            <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider mb-4">Asset Lifecycle Events</h3>
            <div className="h-44 w-full flex items-end justify-between gap-2 px-2 pt-4">
              {[
                { label: "Feb", allocations: 18, repairs: 3 },
                { label: "Mar", allocations: 24, repairs: 5 },
                { label: "Apr", allocations: 32, repairs: 2 },
                { label: "May", allocations: 15, repairs: 8 },
                { label: "Jun", allocations: 29, repairs: 4 },
                { label: "Jul", allocations: 42, repairs: 6 },
              ].map((trend, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
                  {/* Tooltip */}
                  <div className="absolute bottom-full bg-neutral-950 text-white text-[9px] font-bold px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col gap-0.5 pointer-events-none">
                    <span>Deployments: {trend.allocations}</span>
                    <span>Repairs: {trend.repairs}</span>
                  </div>
                  <div className="w-full flex items-end justify-center gap-1.5 h-28">
                    {/* Allocation bar */}
                    <div className="bg-black w-2.5 rounded-t-sm transition-all hover:opacity-80" style={{ height: `${(trend.allocations / 50) * 100}%` }} />
                    {/* Repairs bar */}
                    <div className="bg-neutral-300 w-2.5 rounded-t-sm transition-all hover:opacity-85" style={{ height: `${(trend.repairs / 50) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase">{trend.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Split: Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Asset Activities */}
          <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Recent Asset Activities</h3>
              <p className="text-[10px] text-neutral-400 mt-1 font-semibold">Real-time log of checkouts, returns, and repairs</p>
            </div>
            <div className="overflow-x-auto text-xs">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-100">
                    <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Asset</TableHead>
                    <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Action</TableHead>
                    <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Employee</TableHead>
                    <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Date</TableHead>
                    <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { asset: "MacBook Pro (AST-0010)", action: "Allocation", employee: "Aria Thorne", date: "Jul 12, 2026", status: "Active" },
                    { asset: "iPhone 15 (AST-0012)", action: "Repair Request", employee: "Marcus Vance", date: "Jul 11, 2026", status: "Pending" },
                    { asset: "iPad Pro (AST-0552)", action: "Overdue Return", employee: "Emily Rogers", date: "Jul 10, 2026", status: "Flagged" },
                    { asset: "Sony Camera (AST-1088)", action: "Transfer Complete", employee: "Sarah Jenkins", date: "Jul 08, 2026", status: "Closed" },
                  ].map((act, i) => (
                    <tr key={i} className="border-t border-neutral-50 hover:bg-neutral-50/50">
                      <td className="py-3 font-bold text-neutral-900">{act.asset}</td>
                      <td className="py-3 font-semibold text-neutral-500">{act.action}</td>
                      <td className="py-3 font-semibold text-neutral-850">{act.employee}</td>
                      <td className="py-3 text-neutral-400 font-semibold">{act.date}</td>
                      <td className="py-3">
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          act.status === "Active" ? "bg-emerald-50 text-emerald-700" : act.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-neutral-100 text-neutral-550"
                        }`}>
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Quick Console</h3>
              <div className="flex flex-col gap-3">
                {quickActions.map((act, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab(act.tab);
                      triggerToast(`${act.name} form loaded`, "success");
                    }}
                    className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg hover:bg-neutral-50 hover:border-neutral-200 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-neutral-50 rounded-lg text-neutral-400 group-hover:text-black transition-colors">
                        <HugeiconsIcon icon={act.icon} size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-850">{act.name}</p>
                        <p className="text-[9px] text-neutral-400 font-semibold">{act.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-300 group-hover:text-black transition-colors">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 2. All Assets (Inventory page)
  const renderAllAssets = () => {
    // Basic filter states
    const filteredAssets = assetsList.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase()) || item.custodian.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      const matchDept = deptFilter === "All" || item.department === deptFilter;
      return matchSearch && matchStatus && matchDept;
    });

    return (
      <div className="space-y-6 bg-white border border-neutral-200/80 rounded-lg p-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Asset Inventory</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">Verify workspace hardware lists, condition, and warranty status</p>
          </div>
          <button
            onClick={() => setActiveTab("Register Asset")}
            className="px-3.5 py-1.5 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
          >
            Register Asset
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 w-full bg-[#FBFBFB] p-3 border border-neutral-100 rounded-lg text-xs">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400">
              <HugeiconsIcon icon={Search01Icon} size={14} />
            </span>
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-neutral-200 rounded-lg w-60 bg-white focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 border border-neutral-200 rounded-lg bg-white">
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-3 py-1.5 border border-neutral-200 rounded-lg bg-white">
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="IT Operations">IT Operations</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        {/* Assets table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-100">
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Asset Tag</TableHead>
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Asset Name</TableHead>
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Category</TableHead>
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Department</TableHead>
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Current Holder</TableHead>
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Warranty Expiry</TableHead>
                <TableHead className="font-bold text-neutral-400 text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow
                  key={asset.id}
                  onClick={() => {
                    setSelectedItem({ type: "asset", data: asset });
                    setDrawerTab("Overview");
                    setIsDrawerOpen(true);
                  }}
                  className="border-neutral-100 hover:bg-neutral-50/50 cursor-pointer"
                >
                  <TableCell className="py-4 text-xs font-bold text-neutral-450">#{asset.id}</TableCell>
                  <TableCell className="py-4 text-xs font-semibold text-neutral-900">{asset.name}</TableCell>
                  <TableCell className="py-4 text-xs text-neutral-500 font-semibold">{asset.category}</TableCell>
                  <TableCell className="py-4 text-xs text-neutral-500 font-medium">{asset.department}</TableCell>
                  <TableCell className="py-4 text-xs text-neutral-900 font-bold">{asset.custodian}</TableCell>
                  <TableCell className="py-4">
                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      asset.status === "Available"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : asset.status === "Allocated"
                        ? "bg-neutral-950 text-white"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {asset.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-xs text-neutral-400 font-medium">{asset.warrantyExpiry}</TableCell>
                  <TableCell className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: "Retire Asset?",
                          description: `Are you sure you want to retire ${asset.name} from active inventory? This action Purges its checkouts log permanently.`,
                          onConfirm: () => {
                            setAssetsList(prev => prev.filter(a => a.id !== asset.id));
                            triggerToast("Asset retired successfully", "success");
                          }
                        });
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold border border-red-200 hover:bg-red-50 text-red-650 rounded-lg transition-colors"
                    >
                      Retire
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAssets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-xs text-neutral-400 italic">No assets match search queries</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  // 3. Register Asset Form Wizard
  const renderRegisterAsset = () => {
    const handleRegisterSubmit = () => {
      const newId = `AST-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRecord = {
        id: newId,
        name: newAssetData.name || "Generic Asset",
        category: newAssetData.category,
        custodian: "IT Pool",
        department: newAssetData.department,
        purchasedDate: newAssetData.purchaseDate,
        warrantyExpiry: newAssetData.warrantyExpiry,
        status: "Available",
      };

      setAssetsList((prev) => [newRecord, ...prev]);
      triggerToast(`Successfully registered ${newRecord.name} (${newId})`, "success");
      setRegisterStep(5); // Show review final qr step
    };

    return (
      <div className="bg-white border border-neutral-200/80 rounded-lg p-6 max-w-2xl">
        <div className="border-b border-neutral-100 pb-4 mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Register New Asset</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Wizard step {registerStep} of 5</p>
          </div>
          {registerStep < 5 && (
            <div className="flex items-center gap-1 bg-neutral-50 border rounded-lg p-1 text-[10px] font-semibold text-neutral-450">
              {[1, 2, 3, 4].map((s) => (
                <span key={s} className={`px-2 py-0.5 rounded ${registerStep === s ? "bg-black text-white" : ""}`}>S{s}</span>
              ))}
            </div>
          )}
        </div>

        {/* Step 1: Basic Information */}
        {registerStep === 1 && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-neutral-700">Asset Name *</label>
              <input
                type="text"
                placeholder="e.g. Dell Latitude 7440"
                value={newAssetData.name}
                onChange={(e) => setNewAssetData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Category</label>
                <select
                  value={newAssetData.category}
                  onChange={(e) => setNewAssetData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option>IT Hardware</option>
                  <option>AV Equipment</option>
                  <option>Mobile Devices</option>
                  <option>Office Furniture</option>
                  <option>Network Gear</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Serial Number</label>
                <input
                  type="text"
                  placeholder="e.g. SN-892849"
                  value={newAssetData.serialNumber}
                  onChange={(e) => setNewAssetData(prev => ({ ...prev, serialNumber: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-neutral-700">Description</label>
              <textarea
                placeholder="Details of physical components or configuration specs"
                value={newAssetData.description}
                onChange={(e) => setNewAssetData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg h-20"
              />
            </div>
            <div className="pt-4 border-t flex justify-end">
              <button
                disabled={!newAssetData.name}
                onClick={() => setRegisterStep(2)}
                className="px-4 py-2 font-bold bg-black hover:bg-neutral-800 disabled:opacity-50 text-white rounded-lg transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Purchase Information */}
        {registerStep === 2 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Purchase Date</label>
                <input
                  type="date"
                  value={newAssetData.purchaseDate}
                  onChange={(e) => setNewAssetData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Purchase Cost ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 1499"
                  value={newAssetData.purchaseCost}
                  onChange={(e) => setNewAssetData(prev => ({ ...prev, purchaseCost: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Vendor</label>
                <input
                  type="text"
                  placeholder="e.g. CDW Inc."
                  value={newAssetData.vendor}
                  onChange={(e) => setNewAssetData(prev => ({ ...prev, vendor: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Warranty Expiration</label>
                <input
                  type="date"
                  value={newAssetData.warrantyExpiry}
                  onChange={(e) => setNewAssetData(prev => ({ ...prev, warrantyExpiry: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="pt-4 border-t flex justify-between">
              <button onClick={() => setRegisterStep(1)} className="px-4 py-2 font-bold border rounded-lg text-neutral-600">Back</button>
              <button onClick={() => setRegisterStep(3)} className="px-4 py-2 font-bold bg-black hover:bg-neutral-800 text-white rounded-lg transition-all">Continue</button>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {registerStep === 3 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Target Department</label>
                <select
                  value={newAssetData.department}
                  onChange={(e) => setNewAssetData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option>Engineering</option>
                  <option>IT Operations</option>
                  <option>Finance</option>
                  <option>Operations</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Building</label>
                <input
                  type="text"
                  value={newAssetData.building}
                  onChange={(e) => setNewAssetData(prev => ({ ...prev, building: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-neutral-700">Floor</label>
                <input type="text" value={newAssetData.floor} onChange={(e) => setNewAssetData(prev => ({ ...prev, floor: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="font-semibold text-neutral-700">Room</label>
                <input type="text" value={newAssetData.room} onChange={(e) => setNewAssetData(prev => ({ ...prev, room: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="font-semibold text-neutral-700">Shelf Storage</label>
                <input type="text" value={newAssetData.storageLocation} onChange={(e) => setNewAssetData(prev => ({ ...prev, storageLocation: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="pt-4 border-t flex justify-between">
              <button onClick={() => setRegisterStep(2)} className="px-4 py-2 font-bold border rounded-lg text-neutral-600">Back</button>
              <button onClick={() => setRegisterStep(4)} className="px-4 py-2 font-bold bg-black hover:bg-neutral-800 text-white rounded-lg transition-all">Continue</button>
            </div>
          </div>
        )}

        {/* Step 4: Review and Submit */}
        {registerStep === 4 && (
          <div className="space-y-6 text-xs">
            <div className="bg-[#FBFBFB] border border-neutral-100 rounded-lg p-5 space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-450 font-semibold">Asset Name:</span>
                <span className="font-bold text-neutral-900">{newAssetData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-450 font-semibold">Category:</span>
                <span className="font-semibold text-neutral-800">{newAssetData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-450 font-semibold">Department / Location:</span>
                <span className="font-semibold text-neutral-800">{newAssetData.department} - {newAssetData.building}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-450 font-semibold">Warranty Limit Expiry:</span>
                <span className="font-semibold text-neutral-800">{newAssetData.warrantyExpiry}</span>
              </div>
            </div>
            <div className="pt-4 border-t flex justify-between">
              <button onClick={() => setRegisterStep(3)} className="px-4 py-2 font-bold border rounded-lg text-neutral-600">Back</button>
              <button onClick={handleRegisterSubmit} className="px-4 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all">Submit Registry</button>
            </div>
          </div>
        )}

        {/* Step 5: Success & Generated QR Code review */}
        {registerStep === 5 && (
          <div className="space-y-6 text-xs text-center py-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center text-lg font-bold">✓</div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">Registration Complete</h4>
              <p className="text-[10px] text-neutral-400 mt-1 font-semibold">Asset was successfully recorded and QR barcode generated</p>
            </div>
            {/* Live QR representation */}
            <div className="p-4 border border-neutral-200 rounded-xl bg-white shadow-sm flex flex-col items-center gap-3">
              {/* QR Pattern SVG */}
              <svg className="w-24 h-24 text-black" viewBox="0 0 100 100">
                <rect x="5" y="5" width="20" height="20" fill="currentColor" />
                <rect x="10" y="10" width="10" height="10" fill="white" />
                <rect x="75" y="5" width="20" height="20" fill="currentColor" />
                <rect x="80" y="10" width="10" height="10" fill="white" />
                <rect x="5" y="75" width="20" height="20" fill="currentColor" />
                <rect x="10" y="80" width="10" height="10" fill="white" />
                {/* Random barcode grids */}
                <rect x="35" y="15" width="10" height="15" fill="currentColor" />
                <rect x="55" y="5" width="10" height="10" fill="currentColor" />
                <rect x="40" y="45" width="20" height="20" fill="currentColor" />
                <rect x="15" y="40" width="10" height="10" fill="currentColor" />
                <rect x="70" y="50" width="15" height="15" fill="currentColor" />
                <rect x="50" y="80" width="20" height="10" fill="currentColor" />
              </svg>
              <span className="text-[9px] font-bold text-neutral-400 bg-neutral-50 px-2.5 py-0.5 rounded tracking-wider uppercase">Tag: AST-{Math.floor(1000 + Math.random() * 9000)}</span>
            </div>
            <button
              onClick={() => {
                setRegisterStep(1);
                setNewAssetData({
                  name: "",
                  category: "IT Hardware",
                  assetTag: "",
                  serialNumber: "",
                  description: "",
                  purchaseDate: "2026-07-12",
                  purchaseCost: "",
                  vendor: "",
                  warrantyPeriod: "36 Months",
                  warrantyExpiry: "2029-07-12",
                  department: "Engineering",
                  building: "Main HQ",
                  floor: "Floor 2",
                  room: "Room 204",
                  storageLocation: "Shelf C-1",
                  notes: "",
                });
                setActiveTab("All Assets");
              }}
              className="px-4 py-2 font-bold bg-black text-white hover:bg-neutral-800 rounded-lg text-xs"
            >
              Finish & Return
            </button>
          </div>
        )}
      </div>
    );
  };

  // 4. Asset Allocation page
  const renderAllocations = () => {
    // Only available assets can be allocated
    const availableAssetsList = assetsList.filter(a => a.status === "Available");

    const handleAllocateSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newAllocationData.assetId || !newAllocationData.employeeId) {
        triggerToast("Please select both an asset and an employee", "error");
        return;
      }

      // Check if selected asset is available
      const assetRecord = assetsList.find(a => a.id === newAllocationData.assetId);
      if (!assetRecord || assetRecord.status !== "Available") {
        triggerToast("Asset is not available for allocation", "error");
        return;
      }

      // Perform allocation
      const employeeRecord = employees.find(emp => emp.id === newAllocationData.employeeId);
      const newAllocationRecord = {
        id: `ALC-${Math.floor(100 + Math.random() * 900)}`,
        assetId: newAllocationData.assetId,
        assetName: assetRecord.name,
        employeeId: newAllocationData.employeeId,
        employeeName: employeeRecord ? employeeRecord.name : "Employee",
        department: employeeRecord ? employeeRecord.dept : "Operations",
        allocatedOn: newAllocationData.allocatedOn,
        expectedReturn: newAllocationData.expectedReturn,
        status: "Active",
      };

      setAllocations(prev => [newAllocationRecord, ...prev]);
      // Update asset status
      setAssetsList(prev => prev.map(a => a.id === newAllocationData.assetId ? { ...a, status: "Allocated", custodian: employeeRecord ? employeeRecord.name : "Employee" } : a));

      triggerToast(`Allocated ${assetRecord.name} successfully`, "success");
      setNewAllocationData({ assetId: "", employeeId: "", allocatedOn: "2026-07-12", expectedReturn: "2027-07-12", remarks: "" });
    };

    return (
      <div className="space-y-8">
        {/* Allocations dashboard metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Available Assets", value: availableAssetsList.length, color: "text-emerald-600" },
            { label: "Allocated Assets", value: allocations.filter(a => a.status === "Active").length, color: "text-neutral-900" },
            { label: "Pending Returns", value: allocations.filter(a => a.status === "Returned").length, color: "text-neutral-400" },
            { label: "Overdue Returns", value: allocations.filter(a => a.status === "Overdue").length, color: "text-red-650" },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-5 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{item.label}</span>
              <h3 className="text-xl font-bold text-neutral-900 mt-2">{item.value} items</h3>
            </div>
          ))}
        </div>

        {/* Allocation action form & table split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Allocation form */}
          <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Allocate Asset Form</h3>
              <p className="text-[10px] text-neutral-450 mt-1 font-semibold">Assign available hardware assets to verified team members</p>
            </div>
            <form onSubmit={handleAllocateSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Select Available Asset *</label>
                <select
                  value={newAllocationData.assetId}
                  onChange={(e) => setNewAllocationData(prev => ({ ...prev, assetId: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none"
                >
                  <option value="">-- Choose Asset --</option>
                  {availableAssetsList.map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.name} (#{asset.id})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Select Employee *</label>
                <select
                  value={newAllocationData.employeeId}
                  onChange={(e) => setNewAllocationData(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none"
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.dept})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Allocation Date</label>
                  <input
                    type="date"
                    value={newAllocationData.allocatedOn}
                    onChange={(e) => setNewAllocationData(prev => ({ ...prev, allocatedOn: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Expected Return</label>
                  <input
                    type="date"
                    value={newAllocationData.expectedReturn}
                    onChange={(e) => setNewAllocationData(prev => ({ ...prev, expectedReturn: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs transition-colors"
              >
                Submit Allocation
              </button>
            </form>
          </div>

          {/* Allocation active listings */}
          <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Active Deployments Ledger</h3>
              <p className="text-[10px] text-neutral-400 mt-1 font-semibold">Allocations log with expected return deadlines</p>
            </div>
            <div className="overflow-x-auto text-xs">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-100">
                    <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Asset</TableHead>
                    <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Employee</TableHead>
                    <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Allocated On</TableHead>
                    <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Expected Return</TableHead>
                    <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Status</TableHead>
                    <TableHead className="font-bold text-neutral-400 uppercase text-[9px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.map((alc) => (
                    <TableRow key={alc.id} className="border-t border-neutral-50 hover:bg-neutral-50/50">
                      <td className="py-3 font-bold text-neutral-900">{alc.assetName}</td>
                      <td className="py-3 font-semibold text-neutral-850">{alc.employeeName}</td>
                      <td className="py-3 text-neutral-500 font-semibold">{alc.allocatedOn}</td>
                      <td className="py-3 text-neutral-400 font-semibold">{alc.expectedReturn}</td>
                      <td className="py-3">
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          alc.status === "Active" ? "bg-emerald-50 text-emerald-700" : alc.status === "Overdue" ? "bg-red-50 text-red-700" : "bg-neutral-100 text-neutral-500"
                        }`}>{alc.status}</span>
                      </td>
                      <td className="py-3 text-right">
                        {alc.status !== "Returned" && (
                          <button
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: "Confirm Asset Return?",
                                description: `Has ${alc.employeeName} physically returned ${alc.assetName}?`,
                                onConfirm: () => {
                                  setAllocations(prev => prev.map(a => a.id === alc.id ? { ...a, status: "Returned" } : a));
                                  setAssetsList(prev => prev.map(a => a.id === alc.assetId ? { ...a, status: "Available", custodian: "IT Pool" } : a));
                                  triggerToast("Asset returned to IT pool", "success");
                                }
                              });
                            }}
                            className="px-2.5 py-1 text-[9px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-600 transition-colors"
                          >
                            Return
                          </button>
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

  // 5. Transfers Management page
  const renderTransfers = () => {
    const handleTransferAction = (id: string, action: "Approved" | "Rejected") => {
      setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: action } : t));
      triggerToast(`Transfer request ${action.toLowerCase()} successfully`, "success");
    };

    return (
      <div className="space-y-6 bg-white border border-neutral-200/80 rounded-lg p-6">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Equipment Transfers</h3>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium">Verify and approve physical equipment handovers between division custodians</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-t border-b border-neutral-100 text-xs">
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Pending Approvals</span>
            <p className="text-lg font-bold text-amber-600 mt-1">{transfers.filter(t => t.status === "Pending").length} transfers</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Approved Movement</span>
            <p className="text-lg font-bold text-neutral-900 mt-1">{transfers.filter(t => t.status === "Approved").length} requests</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Completed Transfers</span>
            <p className="text-lg font-bold text-emerald-600 mt-1">{transfers.filter(t => t.status === "Completed").length} done</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Purged Records</span>
            <p className="text-lg font-bold text-neutral-450 mt-1">12 logs</p>
          </div>
        </div>

        <div className="overflow-x-auto text-xs mt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-100">
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Transfer ID</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Asset</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">From Custodian</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">To Recipient</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Requested By</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Reason</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Status</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((trf) => (
                <TableRow
                  key={trf.id}
                  onClick={() => {
                    setSelectedItem({ type: "transfer", data: trf });
                    setDrawerTab("Overview");
                    setIsDrawerOpen(true);
                  }}
                  className="border-neutral-100 hover:bg-neutral-50/50 cursor-pointer"
                >
                  <TableCell className="py-4 font-bold text-neutral-400">#{trf.id}</TableCell>
                  <TableCell className="py-4 font-bold text-neutral-900">{trf.assetName}</TableCell>
                  <TableCell className="py-4 font-semibold text-neutral-850">{trf.fromUser}</TableCell>
                  <TableCell className="py-4 font-semibold text-neutral-850">{trf.toUser}</TableCell>
                  <TableCell className="py-4 text-neutral-500 font-semibold">{trf.requestedBy}</TableCell>
                  <TableCell className="py-4 text-neutral-400 max-w-xs truncate">{trf.reason}</TableCell>
                  <TableCell className="py-4">
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      trf.status === "Pending" ? "bg-amber-50 text-amber-700" : trf.status === "Approved" ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-500"
                    }`}>{trf.status}</span>
                  </TableCell>
                  <TableCell className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    {trf.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleTransferAction(trf.id, "Rejected")} className="px-2.5 py-1 text-[10px] font-bold border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-lg">Deny</button>
                        <button onClick={() => handleTransferAction(trf.id, "Approved")} className="px-2.5 py-1 text-[10px] font-bold bg-black hover:bg-neutral-800 text-white rounded-lg">Approve</button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-neutral-400 italic">Resolved</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  // 6. Maintenance Center page
  const renderMaintenance = () => {
    const handleAssignTechnician = (id: string) => {
      setMaintenance(prev => prev.map(m => m.id === id ? { ...m, status: "In Progress", technician: "Dave Miller" } : m));
      triggerToast("Technician assigned to work ticket", "success");
    };

    const handleCloseTicket = (id: string) => {
      setMaintenance(prev => prev.map(m => m.id === id ? { ...m, status: "Resolved" } : m));
      triggerToast("Maintenance ticket resolved and closed", "success");
    };

    return (
      <div className="space-y-6 bg-white border border-neutral-200/80 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Maintenance Logs</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">Verify system hardware repairs, diagnostics checkups, and diagnostic costs</p>
          </div>
          <button
            onClick={() => triggerToast("Create Maintenance Ticket modal opened", "success")}
            className="px-3.5 py-1.5 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
          >
            Report Issue
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-4 border-t border-b border-neutral-100 text-xs">
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Critical Tasks</span>
            <p className="text-lg font-bold text-red-650 mt-1">{maintenance.filter(m => m.priority === "Critical" && m.status !== "Resolved").length} active</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">In Diagnostics</span>
            <p className="text-lg font-bold text-amber-600 mt-1">{maintenance.filter(m => m.status === "In Progress").length} devices</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Pending Checks</span>
            <p className="text-lg font-bold text-purple-650 mt-1">{maintenance.filter(m => m.status === "Pending").length} tickets</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Resolved Today</span>
            <p className="text-lg font-bold text-emerald-600 mt-1">{maintenance.filter(m => m.status === "Resolved").length} items</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Accumulated Cost</span>
            <p className="text-lg font-bold text-neutral-900 mt-1">$370</p>
          </div>
        </div>

        <div className="overflow-x-auto text-xs mt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-100">
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Ticket ID</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Asset</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Reported Issue</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Priority</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Technician</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Status</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Cost</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenance.map((maint) => (
                <TableRow
                  key={maint.id}
                  onClick={() => {
                    setSelectedItem({ type: "maintenance", data: maint });
                    setDrawerTab("Overview");
                    setIsDrawerOpen(true);
                  }}
                  className="border-neutral-100 hover:bg-neutral-50/50 cursor-pointer"
                >
                  <TableCell className="py-4 font-bold text-neutral-400">#{maint.id}</TableCell>
                  <TableCell className="py-4 font-bold text-neutral-900">{maint.assetName}</TableCell>
                  <TableCell className="py-4 font-semibold text-neutral-600">{maint.issue}</TableCell>
                  <TableCell className="py-4">
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      maint.priority === "Critical" ? "bg-red-50 text-red-700" : maint.priority === "High" ? "bg-amber-50 text-amber-700" : "bg-neutral-100 text-neutral-500"
                    }`}>{maint.priority}</span>
                  </TableCell>
                  <TableCell className="py-4 text-neutral-500 font-semibold">{maint.technician}</TableCell>
                  <TableCell className="py-4">
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      maint.status === "In Progress" ? "bg-amber-50 text-amber-750" : maint.status === "Resolved" ? "bg-emerald-50 text-emerald-700" : "bg-neutral-950 text-white"
                    }`}>{maint.status}</span>
                  </TableCell>
                  <TableCell className="py-4 font-bold text-neutral-900">{maint.cost}</TableCell>
                  <TableCell className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {maint.status === "Pending" && (
                        <button onClick={() => handleAssignTechnician(maint.id)} className="px-2.5 py-1 text-[10px] font-bold bg-black text-white hover:bg-neutral-800 rounded-lg">Assign</button>
                      )}
                      {maint.status === "In Progress" && (
                        <button onClick={() => handleCloseTicket(maint.id)} className="px-2.5 py-1 text-[10px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg">Resolve</button>
                      )}
                      {maint.status === "Resolved" && (
                        <span className="text-[10px] text-neutral-400 italic">Resolved</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  // 7. Resource Bookings (Preventing overlapping bookings)
  const renderResourceBookings = () => {
    const handleCancelBooking = (id: string) => {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Cancelled" } : b));
      triggerToast("Booking successfully cancelled", "success");
    };

    return (
      <div className="space-y-6 bg-white border border-neutral-200/80 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Resource Bookings</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">Coordinate scheduling of camera rigs, AV equipment, and shared test modules</p>
          </div>
          <button
            onClick={() => {
              // Simulating booking creation with overlap checks
              const overlap = bookings.some(b => b.status === "Active" && b.resource === "Conference Room Projector 4K");
              if (overlap) {
                triggerToast("Validation Alert: Time slot overlap detected on Conference Room Projector", "error");
              } else {
                triggerToast("Booking registration slot opened", "success");
              }
            }}
            className="px-3.5 py-1.5 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
          >
            Book Resource
          </button>
        </div>

        <div className="overflow-x-auto text-xs mt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-100">
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Booking ID</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Resource Name</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Booked By</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Purpose</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Start Time</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">End Time</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px]">Status</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase text-[9px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((bkg) => (
                <TableRow key={bkg.id} className="border-t border-neutral-50 hover:bg-neutral-50/50">
                  <TableCell className="py-4 font-bold text-neutral-400">#{bkg.id}</TableCell>
                  <TableCell className="py-4 font-bold text-neutral-900">{bkg.resource}</TableCell>
                  <TableCell className="py-4 font-semibold text-neutral-850">{bkg.bookedBy}</TableCell>
                  <TableCell className="py-4 text-neutral-550 font-medium">{bkg.purpose}</TableCell>
                  <TableCell className="py-4 text-neutral-400 font-semibold">{bkg.fromDate}</TableCell>
                  <TableCell className="py-4 text-neutral-400 font-semibold">{bkg.toDate}</TableCell>
                  <TableCell className="py-4">
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      bkg.status === "Active" ? "bg-emerald-50 text-emerald-700" : bkg.status === "Upcoming" ? "bg-blue-50 text-blue-700" : "bg-neutral-100 text-neutral-500"
                    }`}>{bkg.status}</span>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    {bkg.status !== "Cancelled" ? (
                      <button
                        onClick={() => handleCancelBooking(bkg.id)}
                        className="px-2 py-1 text-[10px] font-bold border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-600 transition-colors"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-[10px] text-neutral-400 italic">Cancelled</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  // 8. Asset Manager Reports View
  const renderAssetManagerReports = () => (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Operations Reporting Center</h3>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium">Export custom CSV, Excel, or PDF asset reports and warranty registers</p>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-neutral-100 pt-4 text-xs font-semibold text-neutral-600">
          <span>Format Options:</span>
          <button onClick={() => triggerToast("CSV export initiated", "success")} className="px-2 py-0.5 bg-neutral-100 rounded hover:bg-neutral-200 transition-colors">CSV</button>
          <button onClick={() => triggerToast("Excel spreadsheet generated", "success")} className="px-2 py-0.5 bg-neutral-100 rounded hover:bg-neutral-200 transition-colors">Excel</button>
          <button onClick={() => triggerToast("PDF document compiled", "success")} className="px-2 py-0.5 bg-neutral-100 rounded hover:bg-neutral-200 transition-colors">PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Asset Utilization Analysis", desc: "Measures allocation efficiency ratios and average equipment downtime logs." },
          { title: "Maintenance Cost Breakdown", desc: "Detailed records of diagnostic costs, repairs frequency, and technician fees." },
          { title: "Asset Warranty Registry", desc: "Tracks expirations logs, coverage limits, and soon-to-expire vendor agreements." },
          { title: "Location Inventory Audits", desc: "Tracks barcodes and room storage logs across organization branches." },
        ].map((report, idx) => (
          <div key={idx} className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-neutral-900">{report.title}</h4>
              <p className="text-[10px] text-neutral-400 font-medium mt-1 leading-relaxed">{report.desc}</p>
            </div>
            <button onClick={() => triggerToast(`${report.title} generated`, "success")} className="w-full py-2 bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg text-xs font-bold transition-all">
              Compile Document
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // 9. Asset Manager Notifications log
  const renderAssetManagerNotifications = () => (
    <div className="bg-white border border-neutral-200/80 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Operations Warnings & Alert Center</h3>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium">Review and resolve hardware notices, repair tickets, and overdue alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); triggerToast("All notifications marked as read", "success"); }} className="px-3 py-1.5 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-lg">Mark All Read</button>
          <button onClick={() => { setNotifications([]); triggerToast("Cleared notifications log", "error"); }} className="px-3.5 py-1.5 text-xs font-bold bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg transition-colors">Clear All</button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className={`flex items-start justify-between p-4 border border-neutral-100 rounded-xl bg-[#FBFBFB] ${!notif.read ? "border-l-4 border-l-black" : ""}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-bold px-2 py-0.2 rounded uppercase ${
                  notif.priority === "High" ? "bg-red-50 text-red-700" : notif.priority === "Medium" ? "bg-amber-50 text-amber-700" : "bg-neutral-100 text-neutral-500"
                }`}>{notif.priority}</span>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{notif.type}</span>
              </div>
              <h4 className="text-xs font-bold text-neutral-900 mt-1.5">{notif.title}</h4>
              <p className="text-[10px] text-neutral-550 mt-1 leading-relaxed">{notif.description}</p>
              <p className="text-[9px] text-neutral-450 mt-2 font-semibold">{notif.timestamp}</p>
            </div>
            {!notif.read && (
              <button onClick={() => markNotificationRead(notif.id)} className="px-2 py-1 border border-neutral-200 hover:bg-neutral-100 rounded-lg text-[10px] font-semibold text-neutral-600">Mark Read</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // 10. Asset Manager Profile view
  const renderProfile = () => (
    <div className="space-y-6 max-w-2xl">
      {/* Profile summary card */}
      <div className="bg-white border border-neutral-200/80 rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-16 h-16 rounded-full bg-neutral-900 text-white font-extrabold flex items-center justify-center text-xl shrink-0">
          PS
        </div>
        <div className="space-y-1 text-center md:text-left flex-1">
          <h3 className="text-sm font-extrabold text-neutral-900 tracking-tight">Priya Shah</h3>
          <p className="text-xs text-neutral-400 font-medium">Asset Manager • IT Operations Division</p>
          <p className="text-[10px] text-neutral-450 mt-1 leading-relaxed">Contact: priya.shah@company.com | ext. 4410</p>
        </div>
      </div>

      {/* Managed statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Assets Managed", value: 206 },
          { label: "Deployments Executed", value: 88 },
          { label: "Repairs Closed", value: 12 },
          { label: "Movements Logged", value: 24 },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-neutral-200/80 rounded-lg p-5 text-center shadow-sm">
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">{stat.label}</span>
            <p className="text-xl font-extrabold text-neutral-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Accordion Profile Settings */}
      <div className="bg-white border border-neutral-200/80 rounded-lg overflow-hidden text-xs">
        <div className="p-5 border-b border-neutral-100 hover:bg-neutral-50 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-neutral-900 uppercase">Notification Subscriptions</h4>
            <p className="text-[9px] text-neutral-400 mt-0.5">Toggle alert preferences for emails and desktop triggers</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            {[
              { label: "Email alert on high priority maintenance tasks", default: true },
              { label: "Notification reminder on expected return deadlines", default: true },
              { label: "Daily checkout digest spreadsheet attachments", default: false },
            ].map((pref, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked={pref.default} className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black cursor-pointer" />
                <span className="text-neutral-600 group-hover:text-neutral-900 transition-colors font-medium">{pref.label}</span>
              </label>
            ))}
          </div>
          <button onClick={() => triggerToast("Profile preferences updated", "success")} className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold">Save Settings</button>
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
                {currentRole === "Admin" ? "Management" : "Operations"}
              </span>
            )}
            <div className="flex-1 border-t border-neutral-200/60"></div>
          </div>

          {/* Navigation Links - Partition 2 */}
          <div className="p-4 py-3 space-y-1.5 text-neutral-500">
            {(currentRole === "Admin" ? managementNavItems : assetManagerNavItems).map((item) => {
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
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 hover:bg-neutral-50 px-2 py-1 rounded-lg transition-all text-left"
              >
                <div className="w-7 h-7 bg-neutral-950 text-white rounded-lg flex items-center justify-center text-[10px] font-extrabold uppercase">
                  {currentRole === "Admin" ? "AD" : "PS"}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-neutral-900 leading-none">
                    {currentRole === "Admin" ? "Alex Dupont" : "Priya Shah"}
                  </span>
                  <span className="text-[9px] font-medium text-neutral-400 mt-0.5 leading-none">
                    {currentRole === "Admin" ? "Workspace Admin" : "Asset Manager"}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">▼</span>
              </button>

              {isRoleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsRoleDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-1.5 z-40 text-xs text-neutral-700">
                    <button
                      onClick={() => {
                        setCurrentRole("Admin");
                        setActiveTab("Dashboard");
                        setIsRoleDropdownOpen(false);
                        triggerToast("Switched to System Admin dashboard", "success");
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center justify-between font-medium ${
                        currentRole === "Admin" ? "text-black bg-neutral-50 font-bold" : ""
                      }`}
                    >
                      <span>System Admin</span>
                      {currentRole === "Admin" && <span>✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentRole("Asset Manager");
                        setActiveTab("Dashboard");
                        setIsRoleDropdownOpen(false);
                        triggerToast("Switched to Asset Manager dashboard", "success");
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center justify-between font-medium ${
                        currentRole === "Asset Manager" ? "text-black bg-neutral-50 font-bold" : ""
                      }`}
                    >
                      <span>Asset Manager</span>
                      {currentRole === "Asset Manager" && <span>✓</span>}
                    </button>
                  </div>
                </>
              )}
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
              {currentRole === "Admin" ? (
                <>
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
                </>
              ) : (
                <>
                  {activeTab === "Dashboard" && "Operational command center showing real-time metrics and checkouts."}
                  {activeTab === "All Assets" && "Manage active equipment inventory lists, warranty details, and conditions."}
                  {activeTab === "Register Asset" && "Step-by-step registry wizard for cataloging new organization devices."}
                  {activeTab === "Categories" && "Classify company hardware categories, warranty limits, and custom attributes."}
                  {activeTab === "Allocations" && "Allocate available hardware devices to verified employees."}
                  {activeTab === "Transfers" && "Approve and track physical equipment handovers between division custodians."}
                  {activeTab === "Maintenance" && "Report issues, assign technicians, track repair tasks, and cost logs."}
                  {activeTab === "Bookings" && "Book and coordinate temporary resources with overlap protection validation checks."}
                  {activeTab === "Reports" && "Download custom operational spreadsheets, warranty details, and repairs costs."}
                  {activeTab === "Profile" && "Verify active profile configuration, credentials, and notification settings."}
                </>
              )}
            </p>
          </div>

          {/* Render Active View */}
          {currentRole === "Admin" ? (
            <>
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
            </>
          ) : (
            <>
              {activeTab === "Dashboard" && renderAssetManagerDashboard()}
              {activeTab === "All Assets" && renderAllAssets()}
              {activeTab === "Register Asset" && renderRegisterAsset()}
              {activeTab === "Categories" && renderCategories()}
              {activeTab === "Allocations" && renderAllocations()}
              {activeTab === "Transfers" && renderTransfers()}
              {activeTab === "Maintenance" && renderMaintenance()}
              {activeTab === "Bookings" && renderResourceBookings()}
              {activeTab === "Reports" && renderAssetManagerReports()}
              {activeTab === "Notifications" && renderAssetManagerNotifications()}
              {activeTab === "Profile" && renderProfile()}
            </>
          )}
        </main>

        {/* Global Overlays */}
        {renderDetailDrawer()}
        {renderToast()}
        {renderConfirmModal()}
      </div>
    </div>
  );
}
