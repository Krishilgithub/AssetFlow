"use client";

import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AsteriskIcon,
  ArrowRight01Icon,
  DashboardSquare01Icon,
  Calendar01Icon,
  ToolsIcon,
  UserMultipleIcon,
  Search01Icon,
  Notification01Icon,
  ArrowUpDownIcon,
} from "@hugeicons/core-free-icons";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-[#F5F5F5] font-sans text-neutral-900 relative overflow-hidden flex flex-col justify-between">
      
      {/* ── Grid Lines Background ── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      />
      
      {/* Structural alignment lines matching max-w-5xl layout width (1024px) */}
      <div className="absolute left-1/2 -translate-x-[512px] top-0 bottom-0 w-px bg-neutral-200/30 pointer-events-none hidden lg:block" />
      <div className="absolute right-1/2 translate-x-[512px] top-0 bottom-0 w-px bg-neutral-200/30 pointer-events-none hidden lg:block" />

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <div className="px-4 pt-5 relative z-10">
        <nav className="max-w-5xl mx-auto bg-white border border-neutral-200/80 rounded-2xl px-5 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-black rounded-lg flex items-center justify-center">
              <HugeiconsIcon icon={AsteriskIcon} size={32} />
            </div>
            <span className="text-base font-extrabold tracking-tight text-neutral-900">AssetFlow</span>
          </Link>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login-in" className="px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all">
              Login
            </Link>
            <Link href="/sign-up" className="px-4 py-2 text-sm font-medium bg-neutral-950 hover:bg-neutral-800 text-white rounded-md transition-all flex items-center gap-1.5 shadow-sm">
              Sign up
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg hover:bg-neutral-100 text-neutral-600" onClick={() => setMobileMenuOpen(p => !p)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="max-w-5xl mx-auto mt-2 bg-white border border-neutral-200 rounded-2xl px-5 py-4 flex flex-col gap-3 text-sm font-semibold text-neutral-600 shadow-sm md:hidden">
            {["Features", "How It Works", "Pricing", "FAQ"].map(l => (
              <a key={l} href="#" className="hover:text-neutral-900 transition-colors py-1">{l}</a>
            ))}
            <hr className="border-neutral-100" />
            <Link href="/login-in" className="py-1 hover:text-neutral-900">Login</Link>
            <Link href="/dashboard" className="px-4 py-2 text-center font-bold bg-neutral-950 text-white rounded-xl">Sign up</Link>
          </div>
        )}
      </div>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="pt-18 pb-10 px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter text-neutral-950 leading-[1.03] max-w-5xl mx-auto">
          The smarter way to manage enterprise assets.
        </h1>

        <p className="mt-6 text-base md:text-lg text-neutral-600 font-regular max-w-2xl mx-auto leading-relaxed">
          One unified platform for asset lifecycle management, resource
          booking, approvals, audits, and workforce coordination—built
          for modern organisations.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="px-4 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-md font-medium rounded-md flex items-center gap-2 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Get Started <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
          </Link>
        </div>
      </section>

      {/* ── Dashboard Mockup (Matching original image layout) ────────── */}
      <section className="px-4 pb-24 max-w-6xl mx-auto relative z-10">
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden">

          {/* Browser chrome bar */}
          <div className="border-b border-neutral-100 bg-[#FAFAFA] px-4 py-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white border border-neutral-200 rounded-lg px-10 py-1 text-[10px] text-neutral-400 font-medium tracking-wide">
                app.assetflow.io/workspace
              </div>
            </div>
            <div className="w-14" />
          </div>

          {/* App shell */}
          <div className="flex h-[520px] overflow-hidden text-neutral-850">

            {/* ── Sidebar ── */}
            <div className="w-52 border-r border-neutral-100 bg-[#F9F9F9] flex flex-col shrink-0">
              <div className="h-14 px-4 flex items-center gap-2 border-b border-neutral-100">
                <div className="w-6 h-6 bg-neutral-950 text-white rounded-lg flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={AsteriskIcon} size={12} />
                </div>
                <span className="text-xs font-bold tracking-tight">AssetFlow</span>
              </div>

              <div className="px-3 py-3 space-y-4">
                <div>
                  <p className="text-[8px] font-extrabold text-neutral-400 uppercase tracking-widest px-2 pb-1.5">General</p>
                  {[
                    { icon: DashboardSquare01Icon, label: "Dashboard", active: true },
                    { icon: ToolsIcon, label: "My Tasks" },
                    { icon: Notification01Icon, label: "Inbox" },
                    { icon: Calendar01Icon, label: "Calendar" },
                  ].map(item => (
                    <div key={item.label} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer ${item.active ? "bg-neutral-950 text-white" : "text-neutral-500 hover:bg-neutral-200/50"}`}>
                      <HugeiconsIcon icon={item.icon} size={13} />{item.label}
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-[8px] font-extrabold text-neutral-400 uppercase tracking-widest px-2 pb-1.5">Workspace</p>
                  {[
                    { label: "Nova Men", active: true },
                    { label: "BrandForge" },
                    { label: "Pulse tracking" },
                  ].map(item => (
                    <div key={item.label} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer ${item.active ? "bg-neutral-200 text-neutral-900" : "text-neutral-500 hover:bg-neutral-200/50"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Content ── */}
            <div className="flex-1 bg-white flex flex-col overflow-hidden">

              {/* Top bar */}
              <div className="h-14 border-b border-neutral-100 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
                  <span>Higvu Studious</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-1">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center">
                      <span className="text-[8px] font-bold text-neutral-600">AF</span>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-700">Ananti Fisher</span>
                    <span className="text-[8px] text-neutral-400">▼</span>
                  </div>
                </div>
              </div>

              {/* Project banner row */}
              <div className="px-6 py-3 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-neutral-900">Nova Me – Product Launch</h2>
                  <span className="text-[9px] text-neutral-400">▼</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} className="w-5 h-5 rounded-full border border-white bg-neutral-200 flex items-center justify-center text-[7px] font-bold text-neutral-500">U{n}</div>
                    ))}
                    <div className="w-5 h-5 rounded-full border border-white bg-neutral-100 flex items-center justify-center text-[7px] font-bold text-neutral-400">+4</div>
                  </div>
                  <button className="px-2 py-1 border border-neutral-200 rounded-lg text-[9px] font-semibold flex items-center gap-1 text-neutral-600 hover:bg-neutral-50">
                    <span className="text-[10px] font-bold">+</span> Invite
                  </button>
                </div>
              </div>

              {/* View selector tabs */}
              <div className="px-6 border-b border-neutral-100 flex gap-4 text-[10px] font-semibold text-neutral-400">
                {["Overview", "List", "Board", "Calendar", "Progress", "Messages"].map(t => (
                  <button key={t} className={`py-2.5 border-b-2 font-bold ${t === "Board" ? "border-black text-black" : "border-transparent hover:text-neutral-700"}`}>{t}</button>
                ))}
              </div>

              {/* Search & Actions row */}
              <div className="px-6 py-2.5 border-b border-neutral-100 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1 border border-neutral-200 rounded-md font-semibold flex items-center gap-1 text-neutral-600 hover:bg-neutral-50">
                    <span className="font-bold">+</span> Add New Task
                  </button>
                  <button className="px-2.5 py-1 border border-neutral-200 rounded-md font-semibold flex items-center gap-1 text-neutral-600 hover:bg-neutral-50">
                    Filter
                  </button>
                  <button className="px-2.5 py-1 border border-neutral-200 rounded-md font-semibold flex items-center gap-1 text-neutral-600 hover:bg-neutral-50">
                    <HugeiconsIcon icon={ArrowUpDownIcon} size={10} /> Sort
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"><HugeiconsIcon icon={Search01Icon} size={10} /></span>
                  <input placeholder="Search task..." className="pl-7 pr-2.5 py-1 border border-neutral-200 rounded-md w-40 bg-[#FAFAFA]" readOnly />
                </div>
              </div>

              {/* Kanban board */}
              <div className="flex-1 bg-[#FCFCFC] p-4 flex gap-4 overflow-hidden">
                {[
                  { title: "To-Do", count: 2, tasks: [{ title: "Research Target Audience", desc: "Gather insights into Nova Me's potential users, focusing on demographics & behaviours.", priority: "Medium", date: "28, Nov 2024", comments: 2 }] },
                  { title: "In-Progress", count: 4, tasks: [{ title: "Build Landing Page", desc: "Design and develop a responsive landing page to showcase Nova Me and capture early sign-ups.", priority: "High", date: "15, Nov 2024", comments: 0 }] },
                  { title: "In-Review", count: 2, tasks: [{ title: "Social Media Teasers", desc: "Drafted posts and visuals for Twitter, LinkedIn, and Instagram to build anticipation.", priority: "Medium", date: "13, Nov 2024", comments: 2 }] },
                  { title: "Done", count: 9, tasks: [{ title: "Finalize Brand Assets", desc: "Logo, color palette, and typography finalized and approved for launch.", priority: "High", date: "10, Nov 2024", comments: 10 }] },
                ].map((col, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-2 min-w-0">
                    <div className="flex items-center justify-between px-1 text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${i === 3 ? "bg-emerald-500" : "bg-neutral-400"}`} />
                        <span className="text-neutral-800">{col.title}</span>
                        <span>{col.count}</span>
                      </div>
                      <span className="text-neutral-400 hover:text-neutral-700 cursor-pointer">+</span>
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto pr-0.5">
                      {col.tasks.map((t, idx) => (
                        <div key={idx} className="bg-white border border-neutral-200/60 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2">
                          <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded ${t.priority === "High" ? "bg-red-50 text-red-700" : "bg-neutral-100 text-neutral-600"}`}>
                            {t.priority}
                          </span>
                          <h4 className="text-[10px] font-bold text-neutral-900 leading-tight">{t.title}</h4>
                          <p className="text-[9px] text-neutral-450 leading-relaxed font-medium line-clamp-3">{t.desc}</p>
                          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[8px] text-neutral-400 font-semibold">
                            <span className="flex items-center gap-1"><HugeiconsIcon icon={Calendar01Icon} size={8} />{t.date}</span>
                            {t.comments > 0 && <span className="flex items-center gap-0.5"><HugeiconsIcon icon={Notification01Icon} size={8} />{t.comments}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom shadow fade */}
        <div className="relative -mt-16 h-16 bg-gradient-to-t from-[#F5F5F5] to-transparent pointer-events-none rounded-b-2xl" />
      </section>
    </div>
  );
}
