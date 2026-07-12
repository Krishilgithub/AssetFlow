const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components/sections/dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Inject the kpis hook at the top of DashboardSection
const sectionStart = content.indexOf('export function DashboardSection() {');
if (sectionStart !== -1) {
  const insertIndex = content.indexOf('{', sectionStart) + 1;
  content = content.slice(0, insertIndex) + `\n  const { data: kpis } = useDashboardKPIs();\n` + content.slice(insertIndex);
}

// Replace the KPI values with dynamic data if it's there
content = content.replace(/value: "114"/g, 'value: kpis?.availableAssets ?? "0"');
content = content.replace(/value: "206"/g, 'value: kpis?.allocatedAssets ?? "0"');
content = content.replace(/value: "4"/g, 'value: kpis?.maintenanceToday ?? "0"');
content = content.replace(/value: "12"/g, 'value: kpis?.activeBookings ?? "0"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched KPIs.');
