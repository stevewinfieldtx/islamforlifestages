"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { EXAMPLE_VERSES } from "@/lib/data/example-verses"
import { LIFE_STAGES } from "@/lib/data/life-stages"
import type { LifeStageId } from "@/lib/types"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [selectedVerse, setSelectedVerse] = useState(0)
  const [selectedLifeStage, setSelectedLifeStage] = useState<LifeStageId | null>(null)
  const router = useRouter()

  console.log("[v0] selectedVerse index:", selectedVerse)
  console.log("[v0] selectedVerse reference:", EXAMPLE_VERSES[selectedVerse]?.reference)
  console.log(
    "[v0] URL will be:",
    `/example/${EXAMPLE_VERSES[selectedVerse]?.reference.replace(/ /g, "-").replace(/:/g, "-")}?stage=${selectedLifeStage}`,
  )

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

  const canViewExample = selectedLifeStage !== null

  return (
    <div className="min-h-screen w-full stained-glass-bg flex flex-col relative overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-glow-pulse" />
        <div
          className="absolute top-1/3 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl animate-glow-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/4 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-glow-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-[52px] md:w-12 md:h-16 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/20 ring-1 ring-white/10">
            <Image src="/images/logo.jpg" alt="Bible for Life Stages" fill className="object-cover" />
          </div>
        </div>
        <Button
          variant="outline"
          className="border-amber-500/30 text-amber-100 hover:bg-amber-500/10 bg-transparent"
          onClick={() => setShowLogin(!showLogin)}
        >
          {showLogin ? "Close" : "Sign In"}
        </Button>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 md:px-6 pt-8 pb-16 w-full max-w-6xl mx-auto">
        {/* Hero Section with Logo */}
        <div className="text-center mb-12 animate-spring-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative w-24 h-32 md:w-36 md:h-48 rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/30 ring-2 ring-amber-500/20">
              <video
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Book%20of%20Life%20-%20Christian%20-%20Video-EUEqgFg1hYz6WSScEOOAh5PdJKt4kv.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-amber-100 mb-2">
            Bible <span className="text-amber-400/80 font-light">for</span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-semibold text-amber-100 mb-6">Life Stages</h2>
          <p className="text-lg md:text-xl text-blue-200/70 max-w-2xl mx-auto">
            Following Bible.com's Verse of the Day with stories, poetry, context, and reflections personalized for your
            season of life.
          </p>
        </div>

        {/* Login Form (when shown) */}
        {showLogin && (
          <div className="glass-card rounded-3xl p-8 mb-12 w-full max-w-md animate-spring-in">
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
        )}

        {/* CTA Button */}
        {!showLogin && (
          <Link href="/auth/signup" className="mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-lg px-12 py-6 rounded-2xl shadow-2xl shadow-amber-500/30 animate-spring-in"
            >
              Start 7-Day Free Trial
            </Button>
          </Link>
        )}

        {/* Example Verses Section */}
        <div className="w-full mb-12">
          <h3 className="text-2xl font-semibold text-amber-100 text-center mb-8">Preview Our Content</h3>

          {/* Verse Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {EXAMPLE_VERSES.map((verse, idx) => (
              <button
                key={verse.reference}
                onClick={() => {
                  console.log("[v0] Verse button clicked, setting index to:", idx)
                  setSelectedVerse(idx)
                }}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  selectedVerse === idx
                    ? "bg-amber-500 text-black font-semibold"
                    : "bg-white/5 text-amber-100/70 hover:bg-white/10"
                }`}
              >
                {verse.reference}
              </button>
            ))}
          </div>

          {/* Life Stage Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {LIFE_STAGES.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedLifeStage(stage.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                  selectedLifeStage === stage.id
                    ? "bg-teal-500/30 text-teal-200 border border-teal-400/30"
                    : "bg-white/5 text-blue-200/50 hover:bg-white/10"
                }`}
              >
                {stage.label}
              </button>
            ))}
          </div>

          {/* Verse Display */}
          <div className="glass-card rounded-3xl p-8 text-center">
            <p className="text-xl md:text-2xl text-amber-100 italic leading-relaxed mb-4">
              "{EXAMPLE_VERSES[selectedVerse].text}"
            </p>
            <p className="text-amber-400 font-medium">{EXAMPLE_VERSES[selectedVerse].reference}</p>
            <p className="mt-6 text-blue-200/60 text-sm">
              {selectedLifeStage ? (
                <>
                  Viewing as:{" "}
                  <span className="text-teal-300">{LIFE_STAGES.find((s) => s.id === selectedLifeStage)?.label}</span>
                </>
              ) : (
                <span className="text-amber-300/70">Select a life stage above to preview content</span>
              )}
            </p>
            <Link
              href={
                canViewExample
                  ? `/example/${EXAMPLE_VERSES[selectedVerse].reference.replace(/ /g, "-").replace(/:/g, "-")}?stage=${selectedLifeStage}`
                  : "#"
              }
              onClick={(e) => {
                console.log("[v0] View Example button clicked")
                console.log("[v0] canViewExample:", canViewExample)
                console.log("[v0] selectedVerse:", selectedVerse)
                console.log(
                  "[v0] href:",
                  `/example/${EXAMPLE_VERSES[selectedVerse].reference.replace(/ /g, "-").replace(/:/g, "-")}?stage=${selectedLifeStage}`,
                )
                if (!canViewExample) e.preventDefault()
              }}
            >
              <Button
                className={`mt-6 ${
                  canViewExample
                    ? "bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }`}
                disabled={!canViewExample}
              >
                View Example Content
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
          {[
            {
              title: "Daily Verses",
              desc: "Following Bible.com's Verse of the Day, personalized for your life stage",
              icon: "📖",
            },
            {
              title: "Modern Stories",
              desc: "Relatable parables that bring ancient wisdom into your everyday life",
              icon: "✨",
            },
            {
              title: "Poetry",
              desc: "Beautiful verses that capture the heart of scripture in memorable ways",
              icon: "🎭",
            },
            {
              title: "Historical Context",
              desc: "Understand the background and meaning behind each passage",
              icon: "📜",
            },
          ].map((feature) => (
            <div key={feature.title} className="glass-card rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-lg font-semibold text-amber-100 mb-2">{feature.title}</h4>
              <p className="text-blue-200/60 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="w-full max-w-2xl">
          <h3 className="text-2xl font-semibold text-amber-100 text-center mb-8">Simple Pricing</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6 text-center">
              <h4 className="text-xl font-semibold text-amber-100 mb-2">Monthly</h4>
              <p className="text-4xl font-bold text-amber-400 mb-4">
                $2<span className="text-lg font-normal text-amber-400/60">/mo</span>
              </p>
              <p className="text-blue-200/60 text-sm mb-4">Cancel anytime</p>
              <Link href="/auth/signup?plan=monthly">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-amber-100">Start Free Trial</Button>
              </Link>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center border-2 border-amber-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                SAVE 50%
              </div>
              <h4 className="text-xl font-semibold text-amber-100 mb-2">Annual</h4>
              <p className="text-4xl font-bold text-amber-400 mb-4">
                $12<span className="text-lg font-normal text-amber-400/60">/yr</span>
              </p>
              <p className="text-blue-200/60 text-sm mb-4">Just $1/month</p>
              <Link href="/auth/signup?plan=annual">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-center text-blue-200/40 text-sm mt-4">
            7-day free trial, then billing begins automatically
          </p>
        </div>
      </main>

      <footer className="relative z-10 w-full py-8 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <p className="text-amber-200/70 text-sm max-w-xl mx-auto mb-4 px-4">
          Helping you and your friends better understand what the Bible means in various stages of life.
        </p>
        <p className="text-teal-300/70 text-sm mb-4">
          10% of all profits go to{" "}
          <a
            href="https://www.cancercompanion.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-300 hover:text-teal-200 underline underline-offset-2"
          >
            Cancer Companion
          </a>
        </p>
        <p className="text-blue-300/50 text-sm">© 2025 Bible for Life Stages. All rights reserved.</p>
        <p className="mt-2 text-xs text-blue-300/30">Following Bible.com's Verse of the Day</p>
      </footer>
    </div>
  )
}
