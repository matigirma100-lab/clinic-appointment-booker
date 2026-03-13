"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useBookingModal } from "@/components/BookingModalProvider";

export function NewBookingButton({
  label = "New Booking",
}: {
  label?: string;
}) {
  const { open } = useBookingModal();
  return (
    <motion.button
      whileHover={{ scale: 0.95 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={open}
      className="rounded-lg bg-slate-900 text-white px-4 py-2.5 text-sm font-medium shadow-xl inline-flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      {label}
    </motion.button>
  );
}

