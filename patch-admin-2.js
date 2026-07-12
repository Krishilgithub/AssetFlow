const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/sections/dashboard.tsx');
let content = fs.readFileSync(file, 'utf-8');

// Replace handleApprovalAction safely
content = content.replace(
  /const handleApprovalAction = \(id: number, action: "Approve" \| "Reject"\) => \{[\s\S]*?\};\n/g,
  `const handleApprovalAction = (id: number, action: "Approve" | "Reject") => {\n    triggerToast(\`Request \${action === "Approve" ? "approved" : "rejected"} successfully\`, "success");\n  };\n`
);

// Replace markNotificationRead safely
content = content.replace(
  /const markNotificationRead = \(id: number\) => \{[\s\S]*?\};\n/g,
  `const markNotificationRead = (id: number) => {\n    if (markReadMut) markReadMut.mutate(id.toString());\n  };\n`
);

fs.writeFileSync(file, content);
console.log('dashboard.tsx admin state patch 2 completed!');
