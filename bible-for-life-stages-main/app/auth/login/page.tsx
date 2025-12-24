"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    router.push("/daily")
  }

  return (
    <div className="min-h-screen w-full stained-glass-bg flex flex-col items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-glow-pulse" />
        <div
          className="absolute bottom-1/4 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl animate-glow-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3 mb-8">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/20 ring-1 ring-white/10">
          <Image src="/images/logo.jpg" alt="Bible for Life Stages" fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-amber-100">Bible for Life Stages</h1>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 w-full max-w-md animate-spring-in relative z-10">
        <h3 className="text-2xl font-semibold text-amber-100 mb-6 text-center">Welcome Back</h3>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <p className="text-center text-sm text-blue-200/50">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-amber-400 hover:underline">
              Start Free Trial
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
