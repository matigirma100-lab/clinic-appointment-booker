"use client";

import type { Appointment } from "@/lib/mock";
import { TimelineSlot } from "@/components/TimelineSlot";

export type TimelineSlotData = {
  timeLabel: string;
  appointment?: Appointment;
};

export function Timeline({ slots }: { slots: TimelineSlotData[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {slots.map((slot, index) => (
        <TimelineSlot
          key={`${slot.timeLabel}-${index}`}
          timeLabel={slot.timeLabel}
          appointment={slot.appointment}
        />
      ))}
    </div>
  );
}

