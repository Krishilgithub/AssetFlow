const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/sections/dept-head-dashboard.tsx');
let content = fs.readFileSync(file, 'utf-8');

// 1. Add axios import if not present
if (!content.includes('import axios from')) {
  content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport axios from "axios";\nimport { useDeptOverview, useApproveMutation, useRejectMutation } from "@/lib/hooks/useDashboard";');
}

// 2. Replace empty state arrays with live data
// deptAssets
content = content.replace(
  'const [deptAssets, setDeptAssets] = useState<any[]>([]);',
  [
    'const deptQuery = useDeptOverview();',
    '  const deptData = deptQuery.data;',
    '  const deptInfo = deptData?.dept;',
    '  const deptOverview = deptData?.overview || {};',
    '  const deptAssets = deptData?.assets || [];',
    '  const setDeptAssets = () => deptQuery.refetch();'
  ].join('\n  ')
);

// deptEmployees
content = content.replace(
  'const [deptEmployees, setDeptEmployees] = useState<any[]>([]);\n  const employees: any[] = [];',
  [
    'const deptEmployees = deptData?.employees || [];',
    '  const setDeptEmployees = () => deptQuery.refetch();',
    '  const employees = deptData?.employees || [];'
  ].join('\n  ')
);

// bookings
content = content.replace(
  'const [bookings, setBookings] = useState<any[]>([]);',
  'const bookings = deptData?.bookings || [];\n  const setBookings = () => deptQuery.refetch();'
);

// transferReqs
content = content.replace(
  'const [transferReqs, setTransferReqs] = useState<any[]>([]);',
  [
    'const transferReqs = deptData?.transfers || [];',
    '  const setTransferReqs = () => deptQuery.refetch();',
    '  const approveTransferMut = useApproveMutation("transfers");',
    '  const rejectTransferMut = useRejectMutation("transfers");'
  ].join('\n  ')
);

// maintenanceReqs
content = content.replace(
  'const [maintenanceReqs, setMaintenanceReqs] = useState<any[]>([]);',
  [
    'const maintenanceReqs = deptData?.maintenance || [];',
    '  const setMaintenanceReqs = () => deptQuery.refetch();',
    '  const approveMaintenanceMut = useApproveMutation("maintenance");',
    '  const rejectMaintenanceMut = useRejectMutation("maintenance");',
    '  const approveReturnMut = useApproveMutation("returns");'
  ].join('\n  ')
);

// notifications: keep empty for now – milestone 3
// reports
content = content.replace(
  'const reports: any[] = [];',
  'const reports: any[] = deptData?.reports || [];'
);

// 3. Replace optimistic approve handler in pending approvals widget
// Quick approve button - transfers
content = content.replace(
  `if (p.type === "Transfer") setTransferReqs(prev => prev.map(t => t.id === p.id ? { ...t, status: "Approved" } : t)); else setMaintenanceReqs(prev => prev.map(m => m.id === p.id ? { ...m, status: "In Progress" } : m)); triggerToast(\`\${p.type} approved\`, "success");`,
  `if (p.type === "Transfer") { approveTransferMut.mutate(p.id, { onSuccess: () => { triggerToast("Transfer approved", "success"); }, onError: (e: any) => triggerToast(e.response?.data?.error || e.message, "error") }); } else { approveMaintenanceMut.mutate(p.id, { onSuccess: () => { triggerToast("Maintenance approved", "success"); }, onError: (e: any) => triggerToast(e.response?.data?.error || e.message, "error") }); }`
);

// Quick reject button - transfers
content = content.replace(
  `if (p.type === "Transfer") setTransferReqs(prev => prev.map(t => t.id === p.id ? { ...t, status: "Rejected" } : t)); triggerToast(\`\${p.type} rejected\`, "error");`,
  `if (p.type === "Transfer") { rejectTransferMut.mutate({ id: p.id }, { onSuccess: () => { triggerToast("Transfer rejected", "info"); }, onError: (e: any) => triggerToast(e.response?.data?.error || e.message, "error") }); }`
);

// 4. Approve/Reject on Transfer Requests tab
content = content.replace(
  `setTransferReqs(p => p.map(t => t.id === req.id ? { ...t, status: "Approved" } : t)); triggerToast("Transfer approved", "success");`,
  `approveTransferMut.mutate(req.id, { onSuccess: () => triggerToast("Transfer approved", "success"), onError: (e: any) => triggerToast(e.response?.data?.error || e.message, "error") });`
);
content = content.replace(
  `setTransferReqs(p => p.map(t => t.id === req.id ? { ...t, status: "Rejected" } : t)); triggerToast("Transfer rejected", "error");`,
  `rejectTransferMut.mutate({ id: req.id }, { onSuccess: () => triggerToast("Transfer rejected", "info"), onError: (e: any) => triggerToast(e.response?.data?.error || e.message, "error") });`
);

// 5. Approve on Maintenance tab
content = content.replace(
  `setMaintenanceReqs(p => p.map(m => m.id === req.id ? { ...m, status: "In Progress" } : m)); triggerToast("Maintenance approved", "success");`,
  `approveMaintenanceMut.mutate(req.id, { onSuccess: () => triggerToast("Maintenance approved", "success"), onError: (e: any) => triggerToast(e.response?.data?.error || e.message, "error") });`
);

// 6. Replace static KPI values in stats with live data
content = content.replace(
  `{ label: "Pending Transfer Approvals", value: transferReqs.filter(t => t.status === "Pending").length,               icon: ArrowLeftRightIcon }`,
  `{ label: "Pending Transfer Approvals", value: deptOverview.pendingTransfers ?? transferReqs.filter((t: any) => t.status === "Pending").length, icon: ArrowLeftRightIcon }`
);
content = content.replace(
  `{ label: "Pending Maintenance",      value: maintenanceReqs.filter(m => m.status === "Pending").length,              icon: AlertCircleIcon }`,
  `{ label: "Pending Maintenance", value: deptOverview.pendingMaint ?? maintenanceReqs.filter((m: any) => m.status === "Pending Approval").length, icon: AlertCircleIcon }`
);

// Fix implicit any types in filters
content = content.replace(/transferReqs\.filter\(t =>/g, 'transferReqs.filter((t: any) =>');
content = content.replace(/maintenanceReqs\.filter\(m =>/g, 'maintenanceReqs.filter((m: any) =>');
content = content.replace(/transferReqs\.filter\(\(t\) =>/g, 'transferReqs.filter((t: any) =>');
content = content.replace(/maintenanceReqs\.filter\(\(m\) =>/g, 'maintenanceReqs.filter((m: any) =>');
content = content.replace(/\.map\(t =>/g, '.map((t: any) =>');
content = content.replace(/\.map\(m =>/g, '.map((m: any) =>');
content = content.replace(/\.map\(emp =>/g, '.map((emp: any) =>');
content = content.replace(/\.map\(bkg =>/g, '.map((bkg: any) =>');
content = content.replace(/\.map\(req =>/g, '.map((req: any) =>');
content = content.replace(/employees\.filter\(e =>/g, 'employees.filter((e: any) =>');
content = content.replace(/bookings\.map\(b =>/g, 'bookings.map((b: any) =>');
content = content.replace(/pendingApprovals\.slice\(0, 4\)\.map\(p =>/g, 'pendingApprovals.slice(0, 4).map((p: any) =>');
content = content.replace(/pendingApprovals\.map\(p =>/g, 'pendingApprovals.map((p: any) =>');
content = content.replace(/\.map\(a =>/g, '.map((a: any) =>');
content = content.replace(/\.map\(s =>/g, '.map((s: any) =>');
content = content.replace(/(prev: any) =>/g, '(prev: any) =>'); // idempotent

fs.writeFileSync(file, content);
console.log('dept-head-dashboard patched!');
