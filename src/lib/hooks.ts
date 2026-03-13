"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/supabaseClient";

export function useDebouncedValue<T>(value: T, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}

export type AppointmentsRealtimeEvent = {
  type: "INSERT" | "UPDATE" | "DELETE";
  record: any;
  oldRecord: any | null;
};

export function useAppointmentsRealtime(
  onChange?: (event: AppointmentsRealtimeEvent) => void,
) {
  const [lastEvent, setLastEvent] = useState<AppointmentsRealtimeEvent | null>(
    null,
  );

  useEffect(() => {
    const supabase = getSupabaseClient();

    const channel = supabase
      .channel("appointments-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        (payload: any) => {
          const event: AppointmentsRealtimeEvent = {
            type: payload.eventType,
            record: payload.new,
            oldRecord: payload.old,
          };

          setLastEvent(event);
          if (onChange) {
            onChange(event);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);

  return { lastEvent };
}

