export type AppointmentStatus =
  | "Booked"
  | "Arrived"
  | "Served"
  | "No-show"
  | "Cancelled";

export type Appointment = {
  id: string;
  patientName: string;
  phone: string;
  service: string;
  doctor: string;
  start: string; // ISO
  end: string; // ISO
  status: AppointmentStatus;
  notes?: string;
  reminderSent?: boolean;
};

export const clinic = {
  name: "Northstar Clinic",
};

export const services = [
  "General Consultation",
  "Dermatology",
  "Pediatrics",
  "Dental Checkup",
  "Physiotherapy",
  "Blood Test",
];

export const doctors = [
  "Dr. Avery Kim",
  "Dr. Samir Patel",
  "Dr. Isla Chen",
  "Dr. Noah Rivera",
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function formatDateLong(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(d: Date) {
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getTodayRange(now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function makeTimeSlots(
  startHour = 8,
  endHour = 18,
  stepMinutes = 30,
) {
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      if (h === endHour && m > 0) break;
      slots.push(`${pad2(h)}:${pad2(m)}`);
    }
  }
  return slots;
}

const base = new Date();
base.setHours(0, 0, 0, 0);

function at(time: string, dayOffset = 0) {
  const [hh, mm] = time.split(":").map(Number);
  const d = new Date(base);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hh, mm, 0, 0);
  return d.toISOString();
}

export const appointments: Appointment[] = [
  {
    id: "apt_1001",
    patientName: "Maya Johnson",
    phone: "+1 (555) 012-1144",
    service: "General Consultation",
    doctor: "Dr. Avery Kim",
    start: at("08:30"),
    end: at("09:00"),
    status: "Arrived",
  },
  {
    id: "apt_1002",
    patientName: "Ethan Park",
    phone: "+1 (555) 013-9081",
    service: "Blood Test",
    doctor: "Dr. Isla Chen",
    start: at("09:00"),
    end: at("09:30"),
    status: "Served",
  },
  {
    id: "apt_1003",
    patientName: "Sofia Martinez",
    phone: "+1 (555) 014-2011",
    service: "Dermatology",
    doctor: "Dr. Samir Patel",
    start: at("10:00"),
    end: at("10:30"),
    status: "Booked",
    notes: "Follow-up on treatment plan.",
  },
  {
    id: "apt_1004",
    patientName: "Liam Carter",
    phone: "+1 (555) 010-7712",
    service: "Dental Checkup",
    doctor: "Dr. Noah Rivera",
    start: at("11:30"),
    end: at("12:00"),
    status: "No-show",
  },
  {
    id: "apt_1005",
    patientName: "Aisha Rahman",
    phone: "+1 (555) 019-1140",
    service: "Physiotherapy",
    doctor: "Dr. Avery Kim",
    start: at("14:00"),
    end: at("14:30"),
    status: "Booked",
  },
  {
    id: "apt_1006",
    patientName: "Oliver Singh",
    phone: "+1 (555) 018-6620",
    service: "Pediatrics",
    doctor: "Dr. Isla Chen",
    start: at("15:30"),
    end: at("16:00"),
    status: "Cancelled",
  },
];

export function mapDbStatusToAppointmentStatus(
  status: string | null | undefined,
): AppointmentStatus {
  const normalized = (status ?? "Booked").toLowerCase();
  switch (normalized) {
    case "booked":
      return "Booked";
    case "arrived":
      return "Arrived";
    case "served":
      return "Served";
    case "no-show":
    case "no_show":
    case "no show":
      return "No-show";
    case "cancelled":
    case "canceled":
      return "Cancelled";
    default:
      return "Booked";
  }
}

export const weeklyBookings = [
  { day: "Mon", bookings: 18 },
  { day: "Tue", bookings: 22 },
  { day: "Wed", bookings: 19 },
  { day: "Thu", bookings: 26 },
  { day: "Fri", bookings: 24 },
  { day: "Sat", bookings: 11 },
  { day: "Sun", bookings: 8 },
];

export const last7DaysTrend = [
  { date: "D-6", value: 16 },
  { date: "D-5", value: 18 },
  { date: "D-4", value: 15 },
  { date: "D-3", value: 21 },
  { date: "D-2", value: 19 },
  { date: "D-1", value: 23 },
  { date: "Today", value: 20 },
];

export const topServices = [
  { name: "General Consultation", value: 42 },
  { name: "Blood Test", value: 26 },
  { name: "Dermatology", value: 18 },
  { name: "Dental Checkup", value: 14 },
];

