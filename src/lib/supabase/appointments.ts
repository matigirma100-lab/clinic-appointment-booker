import { getSupabaseClient } from "@/lib/supabase/supabaseClient";

export type AppointmentRow = {
  id: string;
  patient_name: string;
  phone: string;
  service: string | null;
  doctor: string | null;
  date_time: string;
  status: string | null;
  notes: string | null;
  reminder_sent: boolean;
};

const TABLE_NAME = "appointments";

export async function fetchAppointments(): Promise<AppointmentRow[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("id, patient_name, phone, service, doctor, date_time, status, notes, reminder_sent")
    .order("date_time", { ascending: true });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[Supabase] Failed to fetch appointments:", error);
    throw error;
  }

  return data ?? [];
}

