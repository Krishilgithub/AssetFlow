const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/sections/employee-dashboard.tsx');
let content = fs.readFileSync(file, 'utf-8');

// Replace setBookings
content = content.replace(/setBookings\([^)]+\)/g, 'refetchBookings()');
// Replace setMaintenanceReqs
content = content.replace(/setMaintenanceReqs\([^)]+\)/g, 'refetchMaint()');
// Replace setTransferReqs
content = content.replace(/setTransferReqs\([^)]+\)/g, 'refetchTransfer()');
// Replace setReturnReqs
content = content.replace(/setReturnReqs\([^)]+\)/g, 'refetchReturn()');

fs.writeFileSync(file, content);
console.log('Fixed setX state setters in employee dashboard');
