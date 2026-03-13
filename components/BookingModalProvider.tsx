"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { NewAppointmentModal } from "@/components/NewAppointmentModal";

type BookingModalContextValue = {
  open: () => void;
  close: () => void;
};

const BookingModalContext = createContext<BookingModalContextValue | null>(null);

export function BookingModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<BookingModalContextValue>(
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [],
  );

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      <NewAppointmentModal open={isOpen} onClose={() => setIsOpen(false)} />
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error("useBookingModal must be used within BookingModalProvider");
  }
  return ctx;
}

