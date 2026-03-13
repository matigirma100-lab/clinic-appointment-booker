"use client";

import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CheckCircle2, Users, Clock, UserCheck } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "success" | "warning" | "danger" | "blue" | "purple" | "red";
  className?: string;
}) {
  const Icon = tone === "success" ? Clock : tone === "danger" || tone === "red" ? UserCheck : label.includes("Appointments") || label.includes("Bookings") ? ArrowUpRight : Users;
  
  const colorClass = 
    tone === "success" ? "text-slate-400" : 
    tone === "danger" || tone === "red" ? "text-red-500" : 
    tone === "purple" ? "text-purple-500" :
    tone === "blue" ? "text-blue-500" :
    "text-blue-500";

  const bgClass = 
    tone === "blue" ? "bg-blue-50/50 border-blue-100" :
    tone === "purple" ? "bg-purple-50/50 border-purple-100" :
    tone === "red" ? "bg-red-50/50 border-red-100" :
    "bg-white border-slate-200/60";

  const iconBg = "bg-white shadow-sm";

  return (
    <div className="h-full">
      <GlassCard
        className={cn(
          "p-8 h-full shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 rounded-[32px] hover:shadow-xl",
          bgClass,
          className,
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-8">
            <span className="text-base font-bold text-slate-500 max-w-[120px] leading-tight">{label}</span>
            <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", iconBg)}>
               <Icon className={cn("h-6 w-6 stroke-[1.5px]", colorClass)} />
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="text-5xl font-black text-[#1D1E20] tracking-tight">
              {value}
            </div>
            {hint && (
              <div className="mt-2 text-[13px] font-bold text-slate-400">
                {hint}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

