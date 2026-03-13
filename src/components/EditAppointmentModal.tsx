"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { makeTimeSlots } from "@/lib/mock";
import type { Appointment, AppointmentStatus } from "@/lib/mock";

// --- Form Components (Adapted from NewAppointmentModal for consistency) ---

type FieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

function FieldShell({ label, required, error, children }: FieldProps) {
  return (
    <div>
      <div className="text-xs font-medium text-slate-700/80">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="mt-1 text-xs text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function InputField(
  props: {
    label: string;
    required?: boolean;
    error?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { label, required, error, className, ...rest } = props;
  return (
    <FieldShell label={label} required={required} error={error}>
      <input
        {...rest}
        className={cn(
          "mt-2 w-full rounded-xl bg-white/25 border px-3 py-2 text-sm text-slate-900 outline-none transition-all",
          "placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/30",
          error ? "border-red-400 ring-red-500/10" : "border-white/30",
          className,
        )}
      />
    </FieldShell>
  );
}

type Option = { label: string; value: string };

export function DropdownField(
  props: {
    label: string;
    options: Option[];
    required?: boolean;
    error?: string;
  } & React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  const { label, options, required, error, className, ...rest } = props;
  return (
    <FieldShell label={label} required={required} error={error}>
      <select
        {...rest}
        className={cn(
          "mt-2 w-full rounded-xl bg-white/25 border px-3 py-2 text-sm text-slate-900 outline-none transition-all",
          "focus:ring-2 focus:ring-blue-500/30",
          error ? "border-red-400" : "border-white/30",
          className,
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

// --- Main Modal Component ---

const EDIT_SERVICES = ["Consultation", "Injection", "Checkup", "Lab Test"];
const EDIT_DOCTORS = ["Dr. Selam", "Dr. Abebe"];
const EDIT_STATUSES: AppointmentStatus[] = ["Booked", "Arrived", "Served", "No-show", "Cancelled"];

export function EditAppointmentModal({
  open,
  onClose,
  appointment,
  allAppointments = [],
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  allAppointments?: Appointment[];
  onUpdated: (updated: Appointment) => void;
}) {
  const timeSlots = useMemo(() => makeTimeSlots(8, 18, 15), []);

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<AppointmentStatus>("Booked");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Initialize form when appointment changes
  useEffect(() => {
    if (appointment && open) {
      const d = new Date(appointment.start);
      const datePart = d.toISOString().split("T")[0];
      const timePart = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

      setPatientName(appointment.patientName);
      setPhone(appointment.phone);
      setService(appointment.service);
      setDoctor(appointment.doctor);
      setDate(datePart);
      setTime(timePart);
      setStatus(appointment.status);
      setNotes(appointment.notes || "");
      setErrors({});
      setShake(false);
    }
  }, [appointment, open]);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!patientName.trim()) newErrors.patientName = "Required";
    
    // Ethiopian Phone Validation
    const ethPhoneRegex = /^\+2519\d{8}$/;
    if (!phone.trim()) {
      newErrors.phone = "Required";
    } else if (!ethPhoneRegex.test(phone.trim())) {
      newErrors.phone = "Invalid format (+2519XXXXXXXX)";
    } else {
      // Unique phone among today's appointments (excluding this one)
      const sameDayAppointments = allAppointments.filter(a => 
        a.id !== appointment?.id && 
        new Date(a.start).toISOString().split('T')[0] === date
      );
      if (sameDayAppointments.some(a => a.phone === phone.trim())) {
        newErrors.phone = "Phone already booked for this day";
      }
    }

    if (!date) newErrors.date = "Required";
    if (!time) newErrors.time = "Required";

    // Doctor availability (no double booking)
    if (date && time && doctor && appointment) {
      const dt = new Date(`${date}T${time}:00`);
      const iso = dt.toISOString();
      const conflict = allAppointments.find(a => 
        a.id !== appointment.id && 
        a.doctor === doctor && 
        a.start === iso
      );
      if (conflict) {
        newErrors.doctor = "Doctor unavailable at this time";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return false;
    }
    return true;
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting || !appointment) return;

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const dt = new Date(`${date}T${time}:00`);
      const payload = {
        patient_name: patientName.trim(),
        phone: phone.trim(),
        service,
        doctor,
        date_time: dt.toISOString(),
        status,
        notes: notes.trim(),
      };

      const res = await fetch(`/api/appointments/${encodeURIComponent(appointment.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update");

      setToast({ message: "Appointment updated!", type: "success" });
      onUpdated({
        ...appointment,
        patientName: payload.patient_name,
        phone: payload.phone,
        service: payload.service,
        doctor: payload.doctor,
        start: payload.date_time,
        end: payload.date_time, // Assuming fixed duration for now or same as start
        status: payload.status as AppointmentStatus,
        notes: payload.notes,
      });

      // Close after a brief delay for toast visibility if desired, 
      // or just close immediately
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setToast({ message: err.message || "Update failed", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                x: shake ? [-2, 2, -2, 2, 0] : 0
              }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                x: { duration: 0.4, ease: "easeInOut" },
                default: { duration: 0.2 }
              }}
              className="fixed inset-x-4 bottom-4 z-[120] mx-auto max-w-lg rounded-3xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl p-6 md:inset-0 md:h-fit md:top-1/2 md:-translate-y-1/2"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Edit Appointment</h2>
                  <p className="text-xs text-slate-500">Update patient details and schedule.</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-100/50 hover:bg-slate-200/50 transition-colors"
                >
                  <X className="h-4 w-4 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField
                    label="Patient Name"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    error={errors.patientName}
                  />
                  <InputField
                    label="Phone (+2519...)"
                    required
                    placeholder="+251912345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={errors.phone}
                  />
                  <DropdownField
                    label="Service"
                    options={EDIT_SERVICES.map(s => ({ label: s, value: s }))}
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  />
                  <DropdownField
                    label="Doctor"
                    options={EDIT_DOCTORS.map(d => ({ label: d, value: d }))}
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    error={errors.doctor}
                  />
                  <InputField
                    label="Date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    error={errors.date}
                  />
                  <DropdownField
                    label="Time"
                    options={timeSlots.map(t => ({ label: t, value: t }))}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    error={errors.time}
                  />
                  <DropdownField
                    label="Status"
                    className="sm:col-span-2"
                    options={EDIT_STATUSES.map(s => ({ label: s, value: s }))}
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700/80">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-2 w-full min-h-[80px] rounded-xl bg-white/25 border border-white/30 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30 resize-none px-3 py-2"
                    placeholder="Describe any additional details..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-lg transition-all active:scale-95",
                      isSubmitting && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mini Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 rounded-full shadow-2xl border flex items-center gap-2 text-sm font-semibold whitespace-nowrap",
              toast.type === "success" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                : "bg-red-50 border-red-200 text-red-800"
            )}
          >
            {toast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
