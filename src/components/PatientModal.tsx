"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Form Components (Adapted for consistency) ---

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

export function DropdownField(
  props: {
    label: string;
    options: { label: string; value: string }[];
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
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export type Patient = {
  id: string;
  name: string;
  phone: string;
  gender?: string;
  age?: number;
  notes?: string;
};

export function PatientModal({
  open,
  onClose,
  patient = null,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  patient?: Patient | null;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (open) {
      if (patient) {
        setName(patient.name);
        setPhone(patient.phone);
        setGender(patient.gender || "");
        setAge(patient.age?.toString() || "");
        setNotes(patient.notes || "");
      } else {
        setName("");
        setPhone("");
        setGender("");
        setAge("");
        setNotes("");
      }
      setErrors({});
      setShake(false);
    }
  }, [open, patient]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Required";
    
    const ethPhoneRegex = /^\+2519\d{8}$/;
    if (!phone.trim()) {
      newErrors.phone = "Required";
    } else if (!ethPhoneRegex.test(phone.trim())) {
      newErrors.phone = "Invalid format (+2519XXXXXXXX)";
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
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        gender: gender || null,
        age: age ? parseInt(age, 10) : null,
        notes: notes.trim() || null,
      };

      const url = patient ? `/api/patients/${patient.id}` : "/api/patients";
      const method = patient ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save");

      setToast({ message: patient ? "Patient updated!" : "Patient added!", type: "success" });
      onSuccess();
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setToast({ message: err.message || "Failed to save", type: "error" });
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
              className="fixed inset-x-4 bottom-4 z-[120] mx-auto max-w-lg rounded-3xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl p-6 md:inset-0 md:h-fit md:top-1/2 md:-translate-y-1/2 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{patient ? "Edit Patient" : "New Patient"}</h2>
                  <p className="text-xs text-slate-500">Manage patient profile and information.</p>
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                  />
                  <InputField
                    label="Phone (+2519...)"
                    required
                    placeholder="+251912345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={errors.phone}
                  />
                  <InputField
                    label="Age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  <DropdownField
                    label="Gender"
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700/80">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-2 w-full min-h-[80px] rounded-xl bg-white/25 border border-white/30 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                    placeholder="Additional patient notes..."
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
                    {isSubmitting ? "Saving..." : (patient ? "Save Changes" : "Add Patient")}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
