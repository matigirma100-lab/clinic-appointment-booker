"use client";

import { useMemo } from "react";
import type { Appointment } from "@/lib/mock";
import { formatTime } from "@/lib/mock";
import { StatusChip } from "@/components/StatusChip";
import { Trash2, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export function VerticalTimeline({ appointments, onDelete }: { appointments: Appointment[], onDelete?: (id: string) => void }) {
  const slots = useMemo(() => {
    return HOURS.map((hour) => {
      const timeLabel = hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
      const apts = appointments.filter((a) => {
        const d = new Date(a.start);
        return d.getHours() === hour;
      });
      return { hour, timeLabel, appointments: apts };
    });
  }, [appointments]);

  return (
    <div className="relative overflow-hidden bg-white/50 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Timeline Header */}
      <div className="px-8 py-6 border-b border-slate-200/50">
        <h3 className="text-lg font-bold text-[#1D1E20]">Timeline</h3>
      </div>

      <div className="relative flex p-8 overflow-x-auto min-w-full">
        {/* Time Labels */}
        <div className="flex-1 flex min-w-[800px]">
          {slots.map((slot) => (
            <div key={slot.hour} className="flex-1 min-w-[120px] relative">
              <div className="text-[11px] font-bold text-slate-400 mb-4 px-2">
                {slot.timeLabel}
              </div>
              
              {/* Vertical Grid Line */}
              <div className="absolute left-0 top-8 bottom-0 w-px bg-slate-100" />

              {/* Appointment Content Area */}
              <div className="relative pt-4 px-2 min-h-[160px] flex items-start gap-4 h-full">
                {slot.appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={cn(
                      "w-[140px] shrink-0 rounded-[24px] p-4 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl z-10",
                      apt.status === "Served" ? "bg-emerald-50 text-emerald-700" :
                      apt.status === "Arrived" ? "bg-orange-50 text-orange-700" :
                      apt.status === "No-show" ? "bg-red-50 text-red-700" :
                      "bg-blue-50 text-blue-700"
                    )}
                  >
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-black uppercase tracking-wider opacity-60">
                        {formatTime(new Date(apt.start))}
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="text-[13px] font-bold truncate leading-tight">
                          {apt.patientName}
                        </div>
                        {apt.reminderSent ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                        ) : (
                          <Clock className="h-3 w-3 text-slate-400 shrink-0 opacity-40" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-auto">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full bg-current",
                        apt.status === "Served" ? "animate-pulse" : ""
                      )} />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                        {apt.status === "No-show" ? "No-show" : apt.status}
                      </span>
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(apt.id);
                          }}
                          className="ml-auto p-1 hover:bg-black/5 rounded-full transition-colors text-current/80 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
