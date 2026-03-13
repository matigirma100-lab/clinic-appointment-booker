"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { doctors, makeTimeSlots, services } from "@/lib/mock";

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
      {error ? (
        <div className="mt-1 text-xs text-red-500">{error}</div>
      ) : null}
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
          "mt-2 w-full rounded-xl bg-white/25 border px-3 py-2 text-sm text-slate-900 outline-none",
          "placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/30",
          error ? "border-red-400" : "border-white/30",
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
          "mt-2 w-full rounded-xl bg-white/25 border px-3 py-2 text-sm text-slate-900 outline-none",
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

export function DatePicker(
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
        type="date"
        {...rest}
        className={cn(
          "mt-2 w-full rounded-xl bg-white/25 border px-3 py-2 text-sm text-slate-900 outline-none",
          "focus:ring-2 focus:ring-blue-500/30",
          error ? "border-red-400" : "border-white/30",
          className,
        )}
      />
    </FieldShell>
  );
}

export function TimeSlotPicker(
  props: {
    label: string;
    slots: string[];
    required?: boolean;
    error?: string;
  } & React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  const { label, slots, required, error, className, ...rest } = props;
  return (
    <FieldShell label={label} required={required} error={error}>
      <select
        {...rest}
        className={cn(
          "mt-2 w-full rounded-xl bg-white/25 border px-3 py-2 text-sm text-slate-900 outline-none",
          "focus:ring-2 focus:ring-blue-500/30",
          error ? "border-red-400" : "border-white/30",
          className,
        )}
      >
        {slots.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 rounded-full border border-white/30 shadow-inner transition-colors",
        checked ? "bg-blue-600/80" : "bg-white/25",
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export function NewAppointmentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const timeSlots = useMemo(() => makeTimeSlots(8, 18, 15), []);

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [dynamicDoctors, setDynamicDoctors] = useState<string[]>(doctors);
  const [dynamicServices, setDynamicServices] = useState<string[]>(services);

  const [service, setService] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(timeSlots[2] ?? "");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState(true);

  const [errors, setErrors] = useState<{
    patientName?: string;
    phone?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch dynamic settings
  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(body => {
        if (body.success && body.data) {
          const docs = body.data.doctors || [];
          const svcs = body.data.services || [];
          if (docs.length) {
            setDynamicDoctors(docs);
            setDoctor(prev => prev || docs[0]);
          }
          if (svcs.length) {
            setDynamicServices(svcs);
            setService(prev => prev || svcs[0]);
          }
        }
      })
      .catch(err => console.error("Failed to load settings in modal:", err));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const nextErrors: typeof errors = {};
    if (!patientName.trim()) {
      nextErrors.patientName = "Patient name is required.";
    }
    if (!phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!date) {
      setSubmitError("Please select a date.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Build ISO string from date and time:
      const dt = new Date(`${date}T${time}:00`);
      if (Number.isNaN(dt.getTime())) {
        throw new Error("Invalid date or time selection.");
      }

      const payload = {
        patient_name: patientName.trim(),
        phone: phone.trim(),
        service,
        doctor,
        date_time: dt.toISOString(),
        notes: notes.trim(),
        reminder_sent: reminder,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to create appointment.");
      }

      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close modal"
            className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25 }}
          >
            <div
              className={cn(
                "mx-auto w-full md:max-w-2xl",
                "rounded-t-3xl md:rounded-3xl",
                "bg-white/20 backdrop-blur-md border border-white/30 shadow-xl",
              )}
            >
              <div className="flex items-center justify-between px-6 pt-6">
                <div>
                  <div className="text-sm font-semibold tracking-tight text-slate-900">
                    New Appointment
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Secure clinic booking via Supabase.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-white/25 border border-white/30 p-2 text-slate-700 hover:bg-white/30"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                className="px-6 pb-6 pt-5"
                onSubmit={handleSave}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    label="Patient Name"
                    required
                    placeholder="e.g. Maya Johnson"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    error={errors.patientName}
                  />
                  <InputField
                    label="Phone Number"
                    required
                    placeholder="e.g. +1 (555) 012-3456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={errors.phone}
                  />
                  <DropdownField
                    label="Service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    options={dynamicServices.map((s) => ({ label: s, value: s }))}
                  />
                  <DropdownField
                    label="Doctor"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    options={dynamicDoctors.map((d) => ({ label: d, value: d }))}
                  />
                  <DatePicker
                    label="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <TimeSlotPicker
                    label="Time"
                    slots={timeSlots}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                  <div className="md:col-span-2">
                    <FieldShell label="Notes" required={false} error={undefined}>
                      <textarea
                        placeholder="Optional notes…"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className={cn(
                          "mt-2 w-full min-h-[92px] resize-none rounded-xl bg-white/25 border border-white/30 px-3 py-2 text-sm text-slate-900 outline-none",
                          "placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/30",
                        )}
                      />
                    </FieldShell>
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between rounded-2xl bg-white/15 border border-white/20 px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        Reminder
                      </div>
                      <div className="text-xs text-slate-600">
                        Send a reminder (mock toggle).
                      </div>
                    </div>
                    <ToggleSwitch checked={reminder} onChange={setReminder} />
                  </div>
                </div>

                {submitError && (
                  <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-600">
                    {submitError}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: isSubmitting ? 1 : 0.95 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "flex-1 rounded-lg bg-slate-900 text-white px-4 py-3 text-sm font-medium shadow-xl",
                      isSubmitting && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 0.95 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={onClose}
                    className="rounded-lg bg-white/25 border border-white/30 px-4 py-3 text-sm font-medium text-slate-800"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

