"use client";

import type { Appointment } from "@/lib/mock";
import { StatusChip } from "@/components/StatusChip";
import { formatTime } from "@/lib/mock";

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const start = new Date(appointment.start);
  const end = new Date(appointment.end);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-bold tracking-tight text-[#1D1E20]">
            {appointment.patientName}
          </div>
          <div className="truncate text-[11px] font-medium text-slate-500">
            {appointment.service}
          </div>
        </div>
        <StatusChip status={appointment.status} />
      </div>
      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
        <span className="truncate uppercase tracking-wider">{appointment.doctor}</span>
        <span className="rounded-md bg-slate-50 border border-slate-100 px-1.5 py-0.5 text-slate-500">
          {formatTime(start)} – {formatTime(end)}
        </span>
      </div>
    </div>
  );
}

