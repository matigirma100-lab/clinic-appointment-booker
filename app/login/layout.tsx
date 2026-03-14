import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Clinic Appointment System",
  description: "Login to the Northstar Clinic Appointment System",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {children}
    </div>
  )
}
