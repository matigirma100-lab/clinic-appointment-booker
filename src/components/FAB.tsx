"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingActionButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 0.95 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "fixed bottom-20 right-4 z-50 md:hidden",
        "rounded-2xl bg-slate-900 text-white shadow-xl",
        "h-14 w-14 flex items-center justify-center",
        "border border-white/10",
        className,
      )}
      aria-label="New booking"
    >
      <Plus className="h-5 w-5" />
    </motion.button>
  );
}

