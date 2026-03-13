"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Send, Clock, CheckCircle2 } from "lucide-react";
import { ReminderModal } from "@/components/ReminderModal";
import { useAppointmentsRealtime } from "@/lib/hooks";

interface Appointment {
  id: string;
  patient_name: string;
  date_time: string;
  reminder_sent: boolean;
}

export function UpcomingRemindersWidget() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDue = async () => {
    try {
      const res = await fetch("/api/reminders/due");
      const result = await res.json();
      if (result.success) {
        setAppointments(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch due reminders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDue();
  }, []);

  // Listen for real-time updates to appointments table
  useAppointmentsRealtime(() => {
    fetchDue();
  });

  const handleSendReminder = (id: string) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  if (loading && !appointments.length) {
    return (
      <GlassCard className="p-6 h-full bg-white/60">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="space-y-3">
            <div className="h-10 bg-slate-200 rounded-xl" />
            <div className="h-10 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <>
      <GlassCard className="p-6 h-full bg-white/60 border-slate-200/60 shadow-sm transition-all hover:shadow-md rounded-[32px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Upcoming Reminders</h3>
          </div>
          {appointments.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[10px] font-black text-blue-600 uppercase">
              {appointments.length} Due
            </span>
          )}
        </div>

        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-xs font-bold text-slate-400">All caught up!</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-medium">No reminders due in next hour</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
            {appointments.map((apt) => {
              const time = new Date(apt.date_time).toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              });
              return (
                <div 
                  key={apt.id}
                  className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-slate-900 truncate">
                      {apt.patient_name}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500">
                      Starts at {time}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendReminder(apt.id)}
                    className="h-8 px-3 rounded-xl bg-slate-900 text-white text-[11px] font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                  >
                    <Send className="h-3 w-3" />
                    Send
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      <ReminderModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedId(null);
        }}
        appointmentId={selectedId}
        onMarkSent={() => {
          fetchDue();
        }}
      />
    </>
  );
}
