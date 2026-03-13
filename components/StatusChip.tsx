"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, CheckCircle2, Clock, XCircle, AlertCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/lib/mock";

const styles: Record<AppointmentStatus, { bg: string; text: string; icon: any }> = {
  Booked: {
    bg: "bg-blue-50/80 border-blue-100",
    text: "text-blue-700",
    icon: Clock
  },
  Arrived: {
    bg: "bg-amber-50/80 border-amber-100",
    text: "text-amber-700",
    icon: AlertCircle
  },
  Served: {
    bg: "bg-emerald-50/80 border-emerald-100",
    text: "text-emerald-700",
    icon: CheckCircle2
  },
  "No-show": {
    bg: "bg-red-50/80 border-red-100",
    text: "text-red-700",
    icon: XCircle
  },
  Cancelled: {
    bg: "bg-slate-50/80 border-slate-100",
    text: "text-slate-700",
    icon: HelpCircle
  },
};

export function StatusChip({
  status,
  className,
}: {
  status: AppointmentStatus;
  className?: string;
}) {
  const { bg, text, icon: Icon } = styles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold tracking-tight border",
        bg,
        text,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

const allStatuses: AppointmentStatus[] = [
  "Booked",
  "Arrived",
  "Served",
  "No-show",
  "Cancelled",
];

export function StatusChipInteractive({
  status,
  onChange,
}: {
  status: AppointmentStatus;
  onChange: (next: AppointmentStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  function handleSelect(next: AppointmentStatus) {
    if (next !== status) {
      setRippleKey((k) => k + 1);
      onChange(next);
    }
    setOpen(false);
  }

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      <motion.button
        type="button"
        whileHover={{ scale: 0.97 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tracking-tight border border-transparent focus:outline-none"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={rippleKey}
            initial={{ scale: 0.4, opacity: 0.5 }}
            animate={{ scale: 1.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full",
              status === "Booked" && "bg-blue-300/40",
              status === "Arrived" && "bg-green-300/40",
              status === "Served" && "bg-emerald-300/40",
              status === "No-show" && "bg-red-300/40",
              status === "Cancelled" && "bg-slate-300/40",
            )}
          />
        </AnimatePresence>
        <StatusChip
          status={status}
          className="relative z-10 transition-colors"
        />
        <ChevronDown className="relative z-10 h-3 w-3 text-slate-600" />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-[100] mt-1 min-w-[140px] rounded-2xl bg-white shadow-xl border border-slate-200/70"
          >
            <div className="py-1 text-xs text-slate-600 px-3">
              Update status
            </div>
            <div className="py-1">
              {allStatuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSelect(s)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-slate-100",
                    s === status && "font-semibold text-slate-900",
                  )}
                >
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}


