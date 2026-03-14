"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, CalendarDays, List, User, Plus, Search, Users, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/GlassCard";

const nav = [
  { href: "/", label: "Dashboard", icon: CalendarDays },
  { href: "/list", label: "Appointments", icon: List },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/doctor/Dr.%20Avery%20Kim", label: "Doctor Schedule", icon: User },
  { href: "/patients", label: "Patients", icon: Users },
];

export function SidebarNavigation() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "hidden md:flex md:flex-col shrink-0 border-r border-slate-200/50 bg-white/40 backdrop-blur-xl h-screen sticky top-0 transition-all duration-300 ease-in-out z-50",
        isCollapsed ? "w-20 px-3" : "w-72 px-6"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all z-50"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Brand Header */}
      <div className={cn("flex items-center gap-3 mb-8 pt-8", isCollapsed ? "justify-center" : "px-2")}>
        <div className="h-10 w-10 min-w-[40px] rounded-xl bg-[#266DF0] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(38,109,240,0.3)]">
          <Plus className="h-6 w-6 stroke-[3px]" />
        </div>
        {!isCollapsed && (
          <div className="text-lg font-bold tracking-tight text-[#1D1E20] whitespace-nowrap">
            Clinic Appointment
          </div>
        )}
      </div>

      {/* Main Nav */}
      <div className="flex-1 space-y-1">
        <div className={cn("mb-6", isCollapsed ? "px-2" : "px-0")}>
          <div className="relative group">
            <Search className={cn(
              "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-[#266DF0]",
              isCollapsed ? "left-1/2 -translate-x-1/2" : "left-3"
            )} />
            {!isCollapsed && (
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-slate-100/50 border border-transparent rounded-xl py-2 pl-10 pr-4 text-sm focus:bg-white focus:border-[#266DF0]/20 focus:ring-4 focus:ring-[#266DF0]/5 outline-none transition-all"
              />
            )}
            {isCollapsed && (
               <div className="w-10 h-10 rounded-xl bg-slate-100/50 flex items-center justify-center cursor-pointer hover:bg-slate-200/50 transition-colors" />
            )}
          </div>
        </div>

        <nav className="space-y-1">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl transition-all duration-200 relative",
                  isCollapsed ? "justify-center h-11 px-0" : "px-3 py-2.5",
                  active
                    ? "bg-[#266DF0]/10 text-[#266DF0]"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80",
                )}
              >
                <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
                  <Icon className={cn("h-5 w-5", active ? "text-[#266DF0]" : "text-slate-400 group-hover:text-slate-600")} />
                  {!isCollapsed && <span className={cn("font-medium", active && "font-bold")}>{item.label}</span>}
                </div>
                {active && !isCollapsed && (
                  <div className="h-1.5 w-1.5 rounded-full bg-[#266DF0] shadow-[0_0_8px_rgba(38,109,240,0.5)]" />
                )}
                {active && isCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#266DF0] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Section */}
      <div className={cn("mt-auto space-y-6 py-6 border-t border-slate-100", isCollapsed ? "items-center" : "")}>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors px-2",
            isCollapsed ? "justify-center" : "px-3 py-2"
          )}
        >
          <Settings className="h-5 w-5" />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </Link>

        <div className={cn("flex items-center justify-between gap-3 px-2", isCollapsed ? "flex-col" : "")}>
          <div className={cn("flex items-center gap-3 min-w-0", isCollapsed ? "flex-col" : "")}>
            <div className="h-10 w-10 min-w-[40px] rounded-full bg-slate-900 border border-slate-700/50 flex items-center justify-center overflow-hidden text-white font-bold">
              N
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-[#1D1E20] truncate">Admin User</span>
                <span className="text-[11px] font-medium text-slate-500 truncate">admin@clinicflow.com</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

