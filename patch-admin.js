const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/sections/dashboard.tsx');
let content = fs.readFileSync(file, 'utf-8');

// 1. Add notification and report hooks
if (!content.includes('useMyNotifications')) {
  content = content.replace(
    'import { useDashboardKPIs, useDashboardActivities, useDashboardCharts, useDepartments, useAssetsList, useEmployees, useAllocations, useTransfers, useAudits } from "@/lib/hooks/useDashboard";',
    'import { useDashboardKPIs, useDashboardActivities, useDashboardCharts, useDepartments, useAssetsList, useEmployees, useAllocations, useTransfers, useAudits, useMyNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useClearNotifications, downloadReport } from "@/lib/hooks/useDashboard";'
  );
}

// 2. Replace Notifications Mock State
content = content.replace(
  'const [notifications, setNotifications] = useState<any[]>([]);',
  [
    'const { data: notificationsData } = useMyNotifications();',
    '  const notifications = notificationsData || [];',
    '  const markReadMut = useMarkNotificationRead();',
    '  const markAllReadMut = useMarkAllNotificationsRead();',
    '  const clearNotifsMut = useClearNotifications();'
  ].join('\n  ')
);

// 3. Fix Notification render block
content = content.replace(
  `setNotifications(prev => prev.map(n => ({ ...n, read: true }))); triggerToast("All marked as read", "success");`,
  `markAllReadMut.mutate(undefined, { onSuccess: () => triggerToast("All marked as read", "success") });`
);
content = content.replace(
  `setNotifications([]); triggerToast("Notifications cleared", "success");`,
  `clearNotifsMut.mutate(undefined, { onSuccess: () => triggerToast("Notifications cleared", "success") });`
);
// Fix the individual read/delete button replacements for the array map
content = content.replace(
  /onClick=\{\(\) => setNotifications\(prev => prev\.map\(n => n\.id === notif\.id \? \{ \.\.\.n, read: true \} : n\)\)\}/g,
  `onClick={() => markReadMut.mutate(notif.id)}`
);
content = content.replace(
  /onClick=\{\(\) => setConfirmModal\(\{ isOpen: true, title: "Delete Notification\?", description: \`Delete "\$\{notif\.title\}"\?\`, onConfirm: \(\) => setNotifications\(prev => prev\.filter\(n => n\.id !== notif\.id\)\) \}\)\}/g,
  `onClick={() => setConfirmModal({ isOpen: true, title: "Delete Notification?", description: \`Delete "\${notif.title}"?\`, onConfirm: () => { clearNotifsMut.mutate(undefined, { onSuccess: () => triggerToast("Deleted", "success") }) } })}`
);

// Fix TS implicitly any inside notification filters
content = content.replace(
  /notifications\.filter\(n =>/g,
  'notifications.filter((n: any) =>'
);
content = content.replace(
  /filtered\.map\(notif =>/g,
  'filtered.map((notif: any) =>'
);
content = content.replace(
  /categories\.filter\(c =>/g,
  'categories.filter((c: any) =>'
);
content = content.replace(
  /categories\.map\(\(cat, idx\) =>/g,
  'categories.map((cat: any, idx: number) =>'
);

// 4. Implement Export buttons in Admin dashboard
content = content.replace(
  `onClick={() => triggerToast("CSV Export initiated", "success")}`,
  `onClick={() => { downloadReport('allocations'); triggerToast("Exporting Employees allocations...", "success"); }}`
);
content = content.replace(
  `onClick={() => triggerToast("CSV Export initiated", "success")}`,
  `onClick={() => { downloadReport('assets'); triggerToast("Exporting Assets...", "success"); }}`
);

// 5. Build dynamic pending approvals
content = content.replace(
  'const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);',
  `const pendingApprovals = [
    ...transfersList.filter((t: any) => t.status === 'Pending').map((t: any) => ({ ...t, type: 'Transfer' })),
    ...allocationsList.filter((a: any) => a.status === 'Pending Approval').map((a: any) => ({ ...a, type: 'Allocation' }))
  ];`
);

// 6. Delete old dummy setDepartments / setEmployees
content = content.replace(
  /const setDepartments: React\.Dispatch<React\.SetStateAction<any\[\]>> = \(val\) => \{\};\s*/g,
  ''
);
content = content.replace(
  /const setEmployees: React\.Dispatch<React\.SetStateAction<any\[\]>> = \(val\) => \{\};\s*/g,
  ''
);

// 7. Remove any deactivate handlers that tried to mutate departments/employees directly via setters
content = content.replace(
  /setDepartments\(prev => prev\.map\(d => d\.id === dept\.id \? \{ \.\.\.d, status: "Inactive" \} : d\)\);/g,
  '/* TODO: Add real deactivate API */'
);

fs.writeFileSync(file, content);
console.log('dashboard.tsx admin state patched!');
