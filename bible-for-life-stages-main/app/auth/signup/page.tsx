"use client"

import type React from "react"

import { useState, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"

function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "monthly"

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/subscribe?plan=${plan}`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="glass-card rounded-3xl p-8 w-full max-w-md text-center animate-spring-in">
        <div className="text-6xl mb-4">✉️</div>
        <h3 className="text-2xl font-semibold text-amber-100 mb-4">Check Your Email</h3>
        <p className="text-blue-200/70 mb-6">
          We've sent you a confirmation link. Click it to activate your account and start your free trial.
        </p>
        <Link href="/">
          <Button variant="outline" className="border-amber-500/30 text-amber-100 bg-transparent">
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-3xl p-8 w-full max-w-md animate-spring-in">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-amber-100 mb-2">Start Your Free Trial</h3>
        <p className="text-blue-200/60">7 days free, then ${plan === "annual" ? "12/year" : "2/month"}</p>
      </div>
      <form onSubmit={handleSignUp} className="space-y-4">
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
        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
        <p className="text-center text-sm text-blue-200/50">
          Already have an account?{" "}
          <Link href="/" className="text-amber-400 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  )
}

export default function SignUpPage() {
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

      <Suspense fallback={<div className="text-amber-100">Loading...</div>}>
        <SignUpForm />
      </Suspense>
    </div>
  )
}
