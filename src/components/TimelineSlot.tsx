"use client";

import { motion } from "framer-motion";
import type { Appointment } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { AppointmentCard } from "@/components/AppointmentCard";

export function TimelineSlot({
  timeLabel,
  appointment,
  className,
}: {
  timeLabel: string;
  appointment?: Appointment;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn("min-w-[220px] sm:min-w-[260px]", className)}
    >
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500/60">{timeLabel}</div>
      <div className="mt-2.5 rounded-2xl bg-white/40 backdrop-blur-[8px] border border-slate-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-3 group hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] transition-shadow">
        {appointment ? (
          <AppointmentCard appointment={appointment} />
        ) : (
          <div className="h-[74px] rounded-xl bg-slate-50/50 border border-slate-100/50 border-dashed" />
        )}
      </div>
    </motion.div>
  );
}

