"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Copy, CheckCircle, Clock, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReminderModalProps {
  open: boolean;
  onClose: () => void;
  appointmentId: string | null;
  onMarkSent?: (id: string) => void;
}

export function ReminderModal({ 
  open, 
  onClose, 
  appointmentId,
  onMarkSent 
}: ReminderModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && appointmentId) {
      generateReminder();
    } else {
      setMessage("");
      setError(null);
      setCopied(false);
    }
  }, [open, appointmentId]);

  async function generateReminder() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reminders/generate/${appointmentId}`, {
        method: "POST",
      });
      const result = await res.json();
      if (result.success) {
        setMessage(result.data.message);
      } else {
        setError(result.error || "Failed to generate reminder.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkSent = async () => {
    if (!appointmentId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminder_sent: true }),
      });
      
      if (res.ok) {
        if (onMarkSent) onMarkSent(appointmentId);
        onClose();
      } else {
        setError("Failed to mark as sent.");
      }
    } catch (err) {
      setError("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 bottom-8 z-[70] mx-auto max-w-lg md:inset-0 md:flex md:items-center md:justify-center"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="w-full rounded-[32px] bg-white p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Send className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Appointment Reminder</h3>
                    <p className="text-xs font-medium text-slate-500">Preview and send message</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {loading && !message && (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="h-8 w-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generating Message...</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium">
                  {error}
                </div>
              )}

              {message && (
                <div className="space-y-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-[24px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                    <div className="relative p-5 rounded-[20px] bg-slate-50 border border-slate-200/60 font-medium text-slate-800 text-sm leading-relaxed whitespace-pre-wrap min-h-[160px]">
                      {message}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleCopy}
                      className={cn(
                        "flex-1 h-12 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95",
                        copied 
                          ? "bg-green-500 text-white shadow-lg shadow-green-500/20" 
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      )}
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span>{copied ? "Copied!" : "Copy Message"}</span>
                    </button>
                    <button
                      onClick={handleMarkSent}
                      disabled={loading}
                      className="flex-1 h-12 bg-[#1D1E20] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>{loading ? "Updating..." : "Mark as Sent"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
