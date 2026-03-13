import { getSupabaseClient } from "@/lib/supabase/supabaseClient";

export type WeeklyBookingsPoint = {
  day: string;
  bookings: number;
};

export type TopServicePoint = {
  name: string;
  value: number;
};

export type ReportsSummary = {
  bookingsToday: number;
  servedToday: number;
  noShowToday: number;
  weeklyBookings: WeeklyBookingsPoint[];
  topServices: TopServicePoint[];
};

export async function getReportsSummary(): Promise<ReportsSummary> {
  const supabase = getSupabaseClient();

  const now = new Date();
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("appointments")
    .select("id, status, service, date_time")
    .gte("date_time", weekStart.toISOString())
    .lte("date_time", endOfToday.toISOString());

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];

  function isSameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  const bookingsToday = rows.filter((row) =>
    isSameDay(new Date(row.date_time as string), now),
  ).length;

  const servedToday = rows.filter((row) => {
    const d = new Date(row.date_time as string);
    const status = String(row.status ?? "").toLowerCase();
    return isSameDay(d, now) && status === "served";
  }).length;

  const noShowToday = rows.filter((row) => {
    const d = new Date(row.date_time as string);
    const status = String(row.status ?? "").toLowerCase();
    return (
      isSameDay(d, now) &&
      (status === "no-show" || status === "no_show" || status === "no show")
    );
  }).length;

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weeklyMap = new Map<string, number>();
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const label = weekdayLabels[d.getDay()];
    weeklyMap.set(label, 0);
  }

  rows.forEach((row) => {
    const d = new Date(row.date_time as string);
    const label = weekdayLabels[d.getDay()];
    weeklyMap.set(label, (weeklyMap.get(label) ?? 0) + 1);
  });

  const weeklyBookings: WeeklyBookingsPoint[] = Array.from(
    weeklyMap.entries(),
  ).map(([day, bookings]) => ({ day, bookings }));

  const serviceCounts = new Map<string, number>();
  rows.forEach((row) => {
    const service = (row.service as string | null) ?? "Other";
    serviceCounts.set(service, (serviceCounts.get(service) ?? 0) + 1);
  });

  const topServices: TopServicePoint[] = Array.from(
    serviceCounts.entries(),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return {
    bookingsToday,
    servedToday,
    noShowToday,
    weeklyBookings,
    topServices,
  };
}

