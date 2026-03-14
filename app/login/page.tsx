"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Activity } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

      <div className="flex flex-col items-center mb-8">
        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
          <Activity className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 text-center tracking-tight">
          Clinic Appointment System
        </h1>
        <p className="text-sm text-slate-500 mt-2 font-medium">
          Northstar Clinic
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
          <div className="mt-0.5">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors sm:text-sm"
            placeholder="you@northstar.clinic"
            required
          />
        </div>

        <div>
           <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <button
              type="button"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors sm:text-sm"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-2 shadow-sm"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  )
}
