"use client";

import { BottomNavigation } from "@/components/BottomNavigation";
import { FloatingActionButton } from "@/components/FAB";
import { SidebarNavigation } from "@/components/SidebarNavigation";
import { cn } from "@/lib/utils";
import { BookingModalProvider, useBookingModal } from "@/components/BookingModalProvider";

function FabBridge() {
  const { open } = useBookingModal();
  return <FloatingActionButton onClick={open} />;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <BookingModalProvider>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex px-4 py-6 md:px-6">
          <SidebarNavigation />
          <main className={cn("flex-1 min-w-0", "pb-28 md:pb-10")}>{children}</main>
        </div>

        <BottomNavigation />
        <FabBridge />
      </div>
    </BookingModalProvider>
  );
}

