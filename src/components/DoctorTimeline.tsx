"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import type { Appointment } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/mock";

function minutesSinceStart(iso: string, startHour = 8) {
  const d = new Date(iso);
  return (d.getHours() - startHour) * 60 + d.getMinutes();
}

const serviceColors: Record<string, string> = {
  "General Consultation": "from-blue-500/35 to-blue-500/5",
  Dermatology: "from-purple-500/35 to-purple-500/5",
  Pediatrics: "from-emerald-500/35 to-emerald-500/5",
  "Dental Checkup": "from-amber-500/35 to-amber-500/5",
  Physiotherapy: "from-sky-500/35 to-sky-500/5",
  "Blood Test": "from-rose-500/35 to-rose-500/5",
};

function getServiceColor(service: string) {
  return serviceColors[service] ?? "from-slate-500/30 to-slate-500/5";
}

export function ScheduleBlock({
  appointment,
  top,
  height,
}: {
  appointment: Appointment;
  top: number;
  height: number;
}) {
  const start = new Date(appointment.start);
  const end = new Date(appointment.end);

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 right-0"
      style={{ top: `${top}%`, height: `${Math.max(height, 8)}%` }}
    >
      <div
        className={cn(
          "group relative h-full rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl px-4 py-3 overflow-hidden",
          "transition-transform transition-shadow hover:-translate-y-[1px] hover:shadow-2xl cursor-grab active:cursor-grabbing",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-40 bg-gradient-to-br",
            getServiceColor(appointment.service),
          )}
        />
        <div className="relative z-10 flex flex-col justify-between h-full gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight text-slate-900">
              {appointment.patientName}
            </div>
            <div className="truncate text-xs text-slate-700/90">
              {appointment.service}
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-800/90">
            <span className="rounded-full bg-white/35 border border-white/40 px-2 py-0.5">
              {formatTime(start)} – {formatTime(end)}
            </span>
            <span className="text-[10px] text-slate-600 group-hover:text-slate-800">
              drag-ready
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DoctorTimeline({
  doctor,
  appointments,
}: {
  doctor: string;
  appointments: Appointment[];
}) {
  const startHour = 8;
  const endHour = 18;
  const totalMinutes = (endHour - startHour) * 60;

  const blocks = useMemo(() => {
    return appointments
      .slice()
      .sort((a, b) => (a.start > b.start ? 1 : -1))
      .map((a) => {
        const top = (minutesSinceStart(a.start, startHour) / totalMinutes) * 100;
        const height =
          ((new Date(a.end).getTime() - new Date(a.start).getTime()) / 60000 /
            totalMinutes) *
          100;
        return { appointment: a, top, height };
      });
  }, [appointments, totalMinutes]);

  const ticks = Array.from({ length: endHour - startHour + 1 }, (_, i) => {
    const h = startHour + i;
    const label = new Date(0, 0, 0, h).toLocaleTimeString(undefined, {
      hour: "numeric",
    });
    return { h, label, pct: (i / (endHour - startHour)) * 100 };
  });

  return (
    <GlassCard className="p-6">
      <div className="relative h-[680px] overflow-hidden rounded-2xl bg-white/10 border border-white/20">
        {ticks.map((t) => (
          <div
            key={t.h}
            className="absolute left-0 right-0 flex items-center"
            style={{ top: `${t.pct}%` }}
          >
            <div className="w-16 pl-3 text-[11px] text-slate-600">
              {t.label}
            </div>
            <div className="h-px flex-1 bg-white/20" />
          </div>
        ))}

        <div className="absolute left-20 right-4 top-0 bottom-0">
          {blocks.map(({ appointment, top, height }) => (
            <ScheduleBlock
              key={appointment.id}
              appointment={appointment}
              top={top}
              height={height}
            />
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

