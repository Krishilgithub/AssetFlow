const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/sections/employee-dashboard.tsx');
let content = fs.readFileSync(file, 'utf-8');

if (!content.includes('import { useMyAssets')) {
  content = content.replace(
    'import axios from "axios";',
    'import axios from "axios";\nimport { useMyAssets, useMyBookings, useMyMaintenance, useMyTransfers as useMyTransfersHook, useMyReturns } from "@/lib/hooks/useDashboard";'
  );
  fs.writeFileSync(file, content);
  console.log('Fixed imports in employee dashboard');
} else {
  console.log('Imports already present');
}
