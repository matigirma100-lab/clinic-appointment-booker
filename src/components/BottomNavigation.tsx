"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, List, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Dashboard", icon: CalendarDays },
  { href: "/list", label: "Appointments", icon: List },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/doctor/Dr.%20Avery%20Kim", label: "Doctor", icon: User },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-md px-4 pb-4">
        <div className="rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
          <div className="grid grid-cols-4">
            {items.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-2 py-3 text-xs",
                    active ? "text-slate-900" : "text-slate-600",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      active ? "text-blue-600" : "text-slate-500",
                    )}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

