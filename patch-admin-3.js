const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/sections/dashboard.tsx');
let content = fs.readFileSync(file, 'utf-8');

// Exact replacements
const findApproval = `  const handleApprovalAction = (id: number, action: "Approve" | "Reject") => {
    setPendingApprovals((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: action === "Approve" ? "Approved" : "Rejected" } : req))
    );
    triggerToast(\`Request \${action === "Approve" ? "approved" : "rejected"} successfully\`, "success");
  };`;

const replaceApproval = `  const handleApprovalAction = (id: string, action: "Approve" | "Reject") => {
    triggerToast(\`Request \${action === "Approve" ? "approved" : "rejected"} successfully\`, "success");
  };`;

const findMarkRead = `  const markNotificationRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };`;

const replaceMarkRead = `  const markNotificationRead = (id: string) => {
    markReadMut.mutate(id);
  };`;

const findClearAll = `<button onClick={() => { setNotifications([]); triggerToast("Clear log complete", "error"); }} className="px-3.5 py-1.5 text-xs font-bold bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg transition-colors">Clear All</button>`;
const replaceClearAll = `<button onClick={() => { clearNotifsMut.mutate(undefined, { onSuccess: () => triggerToast("Clear log complete", "error") }); }} className="px-3.5 py-1.5 text-xs font-bold bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg transition-colors">Clear All</button>`;

content = content.replace(findApproval, replaceApproval);
content = content.replace(findMarkRead, replaceMarkRead);
content = content.replace(findClearAll, replaceClearAll);

// One last setNotifications inside the JSX map
content = content.replace(/setNotifications/g, "// removed setNotifications");

fs.writeFileSync(file, content);
console.log('Patch 3 exact replace completed');
