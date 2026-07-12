const fs = require('fs');
const path = require('path');

// ─── Patch employee-dashboard.tsx ─────────────────────────────────────────────
{
  const file = path.join(__dirname, 'components/sections/employee-dashboard.tsx');
  let content = fs.readFileSync(file, 'utf-8');

  // 1. Add notification hooks import
  if (!content.includes('useMyNotifications')) {
    content = content.replace(
      'import { useMyAssets, useMyBookings, useMyMaintenance, useMyTransfers as useMyTransfersHook, useMyReturns } from "@/lib/hooks/useDashboard";',
      'import { useMyAssets, useMyBookings, useMyMaintenance, useMyTransfers as useMyTransfersHook, useMyReturns, useMyNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useClearNotifications, downloadReport } from "@/lib/hooks/useDashboard";'
    );
  }

  // 2. Replace notifications state with live hook
  content = content.replace(
    'const [notifications, setNotifications] = useState<any[]>([]);',
    [
      'const { data: notificationsData, refetch: refetchNotifs } = useMyNotifications();',
      '  const notifications = notificationsData || [];',
      '  const markReadMut = useMarkNotificationRead();',
      '  const markAllReadMut = useMarkAllNotificationsRead();',
      '  const clearNotifsMut = useClearNotifications();'
    ].join('\n  ')
  );

  // 3. Replace "Mark All Read" button handler
  content = content.replace(
    `setNotifications((prev: any) => prev.map((n: any) => ({ ...n, read: true }))); triggerToast("All marked as read", "success");`,
    `markAllReadMut.mutate(undefined, { onSuccess: () => triggerToast("All marked as read", "success") });`
  );

  // 4. Replace "Clear All" handler
  content = content.replace(
    `setNotifications([]); triggerToast("Notifications cleared", "success");`,
    `clearNotifsMut.mutate(undefined, { onSuccess: () => triggerToast("Notifications cleared", "success") });`
  );

  // 5. Mark individual notif as read on click (if it has an onClick)
  content = content.replace(
    /\{filtered\.map\(notif =>/g,
    '{filtered.map((notif: any) =>'
  );

  fs.writeFileSync(file, content);
  console.log('employee-dashboard.tsx: notifications patched');
}

// ─── Patch dept-head-dashboard.tsx ───────────────────────────────────────────
{
  const file = path.join(__dirname, 'components/sections/dept-head-dashboard.tsx');
  let content = fs.readFileSync(file, 'utf-8');

  // 1. Add notification + report hook imports
  if (!content.includes('useMyNotifications')) {
    content = content.replace(
      'import { useDeptOverview, useApproveMutation, useRejectMutation } from "@/lib/hooks/useDashboard";',
      'import { useDeptOverview, useApproveMutation, useRejectMutation, useMyNotifications, useMarkAllNotificationsRead, useClearNotifications, downloadReport } from "@/lib/hooks/useDashboard";'
    );
  }

  // 2. Replace notifications state with live hook
  content = content.replace(
    'const [notifications, setNotifications] = useState<any[]>([]);',
    [
      'const { data: notificationsData } = useMyNotifications();',
      '  const notifications = notificationsData || [];',
      '  const markAllReadMut = useMarkAllNotificationsRead();',
      '  const clearNotifsMut = useClearNotifications();'
    ].join('\n  ')
  );

  // 3. Replace "Mark All Read" handler in renderNotifications
  content = content.replace(
    `setNotifications(prev => prev.map(n => ({ ...n, read: true }))); triggerToast("All marked as read", "success");`,
    `markAllReadMut.mutate(undefined, { onSuccess: () => triggerToast("All marked as read", "success") });`
  );
  content = content.replace(
    `setNotifications((prev: any) => prev.map((n: any) => ({ ...n, read: true }))); triggerToast("All marked as read", "success");`,
    `markAllReadMut.mutate(undefined, { onSuccess: () => triggerToast("All marked as read", "success") });`
  );

  // 4. Replace "Clear All" handler
  content = content.replace(
    `setNotifications([]); triggerToast("Notifications cleared", "success");`,
    `clearNotifsMut.mutate(undefined, { onSuccess: () => triggerToast("Notifications cleared", "success") });`
  );

  // 5. Fix filter(n =>) implicit any in renderNotifications
  content = content.replace(
    /notifications\.filter\(n =>/g,
    'notifications.filter((n: any) =>'
  );

  // 6. Wire the CSV export buttons in renderReports
  // Replace the onClick stub toast with actual downloadReport calls
  content = content.replace(
    `onClick={() => triggerToast(\`\${r.title} exported as \${fmt}\`, "success")}`,
    `onClick={async () => { try { const map: Record<string, any> = { 'Department Asset Report': 'assets', 'Employee Asset Report': 'allocations', 'Maintenance Report': 'maintenance', 'Transfer Report': 'transfers' }; const key = map[r.title]; if (key && fmt === 'CSV') { await downloadReport(key, deptInfo?.id); triggerToast(\`\${r.title} downloaded!\`, 'success'); } else { triggerToast(\`\${fmt} export coming soon\`, 'success'); } } catch (e: any) { triggerToast(e.message, 'error'); } }}`
  );

  fs.writeFileSync(file, content);
  console.log('dept-head-dashboard.tsx: notifications + reports patched');
}

console.log('\nMilestone 3 frontend wiring done!');
