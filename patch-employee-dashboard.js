const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/sections/employee-dashboard.tsx');
let content = fs.readFileSync(file, 'utf-8');

// 1. Add missing imports
if (!content.includes('import axios from "axios"')) {
  content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport axios from "axios";');
}
content = content.replace(
  'import { useDashboardKPIs, useDashboardActivities, useDashboardCharts, useDepartments, useAssetsList, useEmployees, useAllocations, useTransfers, useAudits } from "@/lib/hooks/useDashboard";',
  'import { useDashboardKPIs, useDashboardActivities, useDashboardCharts, useDepartments, useAssetsList, useEmployees, useAllocations, useTransfers, useAudits, useMyAssets, useMyBookings, useMyMaintenance, useMyTransfers as useMyTransfersHook, useMyReturns } from "@/lib/hooks/useDashboard";'
);
if (!content.includes('useMyAssets')) {
    content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useMyAssets, useMyBookings, useMyMaintenance, useMyTransfers as useMyTransfersHook, useMyReturns } from "@/lib/hooks/useDashboard";');
}

// 2. Replace state initializations
content = content.replace(/const \[myAssets, setMyAssets\] = useState<any\[\]>\(\[\]\);/, 
  'const { data: myAssetsData, refetch: refetchAssets } = useMyAssets();\n  const myAssets = myAssetsData || [];');

content = content.replace(/const \[bookings, setBookings\] = useState<any\[\]>\(\[\]\);/,
  'const { data: bookingsData, refetch: refetchBookings } = useMyBookings();\n  const bookings = bookingsData || [];');

content = content.replace(/const \[maintenanceReqs, setMaintenanceReqs\] = useState<any\[\]>\(\[\]\);/,
  'const { data: maintData, refetch: refetchMaint } = useMyMaintenance();\n  const maintenanceReqs = maintData || [];');

content = content.replace(/const \[transferReqs, setTransferReqs\] = useState<any\[\]>\(\[\]\);/,
  'const { data: transferData, refetch: refetchTransfer } = useMyTransfersHook();\n  const transferReqs = transferData || [];');

content = content.replace(/const \[returnReqs, setReturnReqs\] = useState<any\[\]>\(\[\]\);/,
  'const { data: returnData, refetch: refetchReturn } = useMyReturns();\n  const returnReqs = returnData || [];');


// 3. Update handlers
const handleBookingSubmit = `const handleBookingSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!bookingForm.resource || !bookingForm.date || !bookingForm.startTime || !bookingForm.endTime) {
        triggerToast("Please fill in all required fields", "error"); return;
      }
      try {
        await axios.post('/api/me/bookings', {
          resourceId: "00000000-0000-0000-0000-000000000000", // Need actual ID, UI has resource name
          date: bookingForm.date,
          startTime: bookingForm.startTime,
          endTime: bookingForm.endTime,
          purpose: bookingForm.purpose
        });
        setBookingForm({ resource: "", date: "", startTime: "", endTime: "", purpose: "" });
        triggerToast(\`Booking request submitted\`, "success");
        refetchBookings();
      } catch (err: any) {
        triggerToast(err.response?.data?.error || err.message, "error");
      }
    };`;

content = content.replace(/const handleBookingSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?triggerToast\(`Booking.*submitted`, "success"\);\s*\};/, handleBookingSubmit);

const handleMaintSubmit = `const handleMaintenanceSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!maintForm.assetId || !maintForm.description) { triggerToast("Asset ID and description are required", "error"); return; }
      try {
        await axios.post('/api/me/maintenance', maintForm);
        setMaintForm({ assetId: "", issueType: "Hardware", priority: "Medium", description: "", notes: "" });
        triggerToast(\`Maintenance request submitted\`, "success");
        refetchMaint();
      } catch (err: any) {
        triggerToast(err.response?.data?.error || err.message, "error");
      }
    };`;
content = content.replace(/const handleMaintenanceSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?triggerToast\(`Maintenance.*submitted`, "success"\);\s*\};/, handleMaintSubmit);

const handleTransferSubmit = `const handleTransferSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!transferForm.assetId || !transferForm.transferTo) {
        triggerToast("Please fill in all required fields", "error"); return;
      }
      try {
        await axios.post('/api/me/transfers', {
          assetId: transferForm.assetId,
          transferTo: transferForm.transferTo,
          departmentId: "00000000-0000-0000-0000-000000000000", // Need actual ID
          reason: transferForm.reason
        });
        setTransferForm({ assetId: "", transferTo: "", department: "", reason: "" });
        triggerToast(\`Transfer request submitted\`, "success");
        refetchTransfer();
      } catch (err: any) {
        triggerToast(err.response?.data?.error || err.message, "error");
      }
    };`;
content = content.replace(/const handleTransferSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?triggerToast\(`Transfer.*submitted`, "success"\);\s*\};/, handleTransferSubmit);

const handleReturnSubmit = `const handleReturnSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!returnForm.assetId) { triggerToast("Please select an asset to return", "error"); return; }
      try {
        await axios.post('/api/me/returns', returnForm);
        setReturnForm({ assetId: "", reason: "", condition: "Good", notes: "" });
        triggerToast(\`Return request submitted\`, "success");
        refetchReturn();
        refetchAssets();
      } catch (err: any) {
        triggerToast(err.response?.data?.error || err.message, "error");
      }
    };`;
content = content.replace(/const handleReturnSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?triggerToast\(`Return.*submitted`, "success"\);\s*\};/, handleReturnSubmit);

fs.writeFileSync(file, content);
console.log('Employee dashboard patched');
