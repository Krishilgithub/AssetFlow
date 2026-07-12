"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PackageIcon,
  ArrowRight01Icon,
  Building01Icon,
  UserMultipleIcon,
  LicenseIcon,
  Audit01Icon,
  ArrowUpDownIcon,
  ToolsIcon,
  Calendar01Icon,
  ClipboardListIcon,
} from "@hugeicons/core-free-icons";

export default function DashboardLandingPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans flex flex-col items-center justify-center px-6 py-16">
      {/* Logo / Wordmark */}
      <div className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 bg-neutral-950 text-white rounded-lg flex items-center justify-center">
          <HugeiconsIcon icon={PackageIcon} size={18} />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-neutral-900">
          AssetFlow
        </span>
      </div>

      {/* Heading */}
      <div className="text-center mb-10 max-w-lg">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
          Select Your Console
        </h1>
        <p className="text-sm text-neutral-500 mt-3 font-medium leading-relaxed">
          Choose the dashboard that matches your role. Each console is tailored
          to your responsibilities within the organisation.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Admin Card */}
        <Link
          href="/dashboard/admin"
          className="group bg-white border border-neutral-200 rounded-2xl p-8 hover:border-neutral-400 hover:shadow-lg transition-all duration-200 flex flex-col gap-6"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-neutral-950 text-white rounded-xl flex items-center justify-center text-lg font-extrabold">
              AD
            </div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider border border-neutral-200 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">
              System Admin
            </h2>
            <p className="text-xs text-neutral-500 mt-1.5 font-medium leading-relaxed">
              Manage the entire organisation — departments, employees,
              categories, asset overview, audit scheduling, roles &amp;
              permissions, and global settings.
            </p>
          </div>

          <div className="space-y-1.5 text-[10px] text-neutral-500 font-semibold">
            {[
              { icon: Building01Icon, label: "Organisation & Departments" },
              { icon: UserMultipleIcon, label: "Employee Management" },
              { icon: LicenseIcon, label: "Roles & Permissions" },
              { icon: Audit01Icon, label: "Audit Scheduling" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <HugeiconsIcon icon={item.icon} size={12} className="text-neutral-400" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <span className="text-xs font-bold text-neutral-900">
              Open Admin Console
            </span>
            <div className="w-7 h-7 bg-neutral-950 text-white rounded-lg flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </div>
          </div>
        </Link>

        {/* Asset Manager Card */}
        <Link
          href="/dashboard/asset-manager"
          className="group bg-white border border-neutral-200 rounded-2xl p-8 hover:border-neutral-400 hover:shadow-lg transition-all duration-200 flex flex-col gap-6"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-neutral-700 text-white rounded-xl flex items-center justify-center text-lg font-extrabold">
              PS
            </div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider border border-neutral-200 px-2 py-0.5 rounded-full">
              Operations
            </span>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">
              Asset Manager
            </h2>
            <p className="text-xs text-neutral-500 mt-1.5 font-medium leading-relaxed">
              Manage the complete asset lifecycle — register hardware, allocate
              to employees, approve transfers, schedule maintenance, and
              coordinate resource bookings.
            </p>
          </div>

          <div className="space-y-1.5 text-[10px] text-neutral-500 font-semibold">
            {[
              { icon: PackageIcon, label: "Asset Registry & Inventory" },
              { icon: ArrowUpDownIcon, label: "Allocations & Returns" },
              { icon: ToolsIcon, label: "Maintenance Tickets" },
              { icon: Calendar01Icon, label: "Resource Bookings" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <HugeiconsIcon icon={item.icon} size={12} className="text-neutral-400" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <span className="text-xs font-bold text-neutral-900">
              Open Asset Manager Console
            </span>
            <div className="w-7 h-7 bg-neutral-700 text-white rounded-lg flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </div>
          </div>
        </Link>
        {/* Employee Card */}
        <Link
          href="/dashboard/employee"
          className="group bg-white border border-neutral-200 rounded-2xl p-8 hover:border-neutral-400 hover:shadow-lg transition-all duration-200 flex flex-col gap-6"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-neutral-500 text-white rounded-xl flex items-center justify-center text-lg font-extrabold">
              JR
            </div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider border border-neutral-200 px-2 py-0.5 rounded-full">
              Employee
            </span>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">
              Employee Portal
            </h2>
            <p className="text-xs text-neutral-500 mt-1.5 font-medium leading-relaxed">
              View assigned assets, book shared resources, raise maintenance
              requests, and track transfer &amp; return requests.
            </p>
          </div>

          <div className="space-y-1.5 text-[10px] text-neutral-500 font-semibold">
            {[
              { icon: PackageIcon,       label: "My Assigned Assets" },
              { icon: Calendar01Icon,    label: "Resource Booking" },
              { icon: ToolsIcon,         label: "Maintenance Requests" },
              { icon: ClipboardListIcon, label: "Transfer & Return Requests" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <HugeiconsIcon icon={item.icon} size={12} className="text-neutral-400" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <span className="text-xs font-bold text-neutral-900">
              Open Employee Portal
            </span>
            <div className="w-7 h-7 bg-neutral-500 text-white rounded-lg flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </div>
          </div>
        </Link>
      </div>

      {/* Footer hint */}
      <p className="text-[10px] text-neutral-400 font-semibold mt-10 text-center">
        You can switch consoles at any time from the top-right profile menu inside each dashboard.
      </p>
    </div>
  );
}