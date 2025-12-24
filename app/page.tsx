"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { EXAMPLE_AYAHS } from "@/lib/data/example-ayahs"
import { LIFE_STAGES } from "@/lib/data/life-stages"
import type { LifeStageId } from "@/lib/types"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [selectedAyah, setSelectedAyah] = useState(0)
  const [selectedLifeStage, setSelectedLifeStage] = useState<LifeStageId | null>(null)
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

  const canViewExample = selectedLifeStage !== null

  const currentAyah = EXAMPLE_AYAHS[selectedAyah]

  return (
    <div className="min-h-screen w-full islamic-gradient-bg flex flex-col relative overflow-x-hidden">
      {/* Background effects - Islamic geometric pattern overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/3 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/4 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-[url('/images/islamic-pattern.svg')] bg-repeat" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/20 ring-1 ring-white/10 bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center">
            <span className="text-2xl">🌙</span>
          </div>
          <span className="text-emerald-100 font-medium hidden sm:block">Islam for Life Stages</span>
        </div>
        <Button
          variant="outline"
          className="border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/10 bg-transparent"
          onClick={() => setShowLogin(!showLogin)}
        >
          {showLogin ? "Close" : "Sign In"}
        </Button>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 md:px-6 pt-8 pb-16 w-full max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/30 ring-2 ring-emerald-500/20 bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 flex items-center justify-center">
              <span className="text-6xl md:text-7xl">📖</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-emerald-100 mb-2">
            Islam <span className="text-emerald-400/80 font-light">for</span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-semibold text-emerald-100 mb-6">Life Stages</h2>
          <p className="text-lg md:text-xl text-teal-200/70 max-w-2xl mx-auto">
            Daily Quranic guidance with stories, poetry, context, and reflections personalized for your
            season of life.
          </p>
        </div>

        {/* Bismillah */}
        <div className="text-center mb-8">
          <p className="text-2xl md:text-3xl font-amiri text-emerald-300/80" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-sm text-teal-300/60 mt-2">In the name of Allah, the Most Gracious, the Most Merciful</p>
        </div>

        {/* Login Form (when shown) */}
        {showLogin && (
          <div className="glass-card rounded-3xl p-8 mb-12 w-full max-w-md animate-fade-in">
            <h3 className="text-2xl font-semibold text-emerald-100 mb-6 text-center">Welcome Back</h3>
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
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-center text-sm text-teal-200/50">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-emerald-400 hover:underline">
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
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg px-12 py-6 rounded-2xl shadow-2xl shadow-emerald-500/30 animate-fade-in"
            >
              Start 7-Day Free Trial
            </Button>
          </Link>
        )}

        {/* Example Ayahs Section */}
        <div className="w-full mb-12">
          <h3 className="text-2xl font-semibold text-emerald-100 text-center mb-8">Preview Our Content</h3>

          {/* Ayah Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {EXAMPLE_AYAHS.map((item, idx) => (
              <button
                key={item.ayah.verse_key}
                onClick={() => setSelectedAyah(idx)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  selectedAyah === idx
                    ? "bg-emerald-500 text-white font-semibold"
                    : "bg-white/5 text-emerald-100/70 hover:bg-white/10"
                }`}
              >
                {item.surah.name} {item.ayah.verse_number}
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
                    : "bg-white/5 text-teal-200/50 hover:bg-white/10"
                }`}
              >
                {stage.label}
              </button>
            ))}
          </div>

          {/* Ayah Display */}
          <div className="glass-card rounded-3xl p-8 text-center">
            {/* Arabic Text */}
            <p className="text-2xl md:text-3xl text-emerald-100 font-amiri leading-loose mb-4" dir="rtl">
              {currentAyah.ayah.text_arabic}
            </p>
            
            {/* Translation */}
            <p className="text-lg md:text-xl text-teal-100/80 italic leading-relaxed mb-4">
              "{currentAyah.ayah.text_translation}"
            </p>
            
            {/* Reference */}
            <p className="text-emerald-400 font-medium">
              {currentAyah.surah.name} ({currentAyah.surah.name_arabic}) - Ayah {currentAyah.ayah.verse_number}
            </p>
            <p className="text-teal-300/60 text-sm mt-1">
              {currentAyah.surah.name_translation} • {currentAyah.surah.revelation_place === 'makkah' ? 'Makki' : 'Madani'}
            </p>
            
            <p className="mt-6 text-teal-200/60 text-sm">
              {selectedLifeStage ? (
                <>
                  Viewing as:{" "}
                  <span className="text-emerald-300">{LIFE_STAGES.find((s) => s.id === selectedLifeStage)?.label}</span>
                </>
              ) : (
                <span className="text-emerald-300/70">Select a life stage above to preview content</span>
              )}
            </p>
            <Link
              href={
                canViewExample
                  ? `/example/Surah-${currentAyah.ayah.surah_id}-Ayah-${currentAyah.ayah.verse_number}?stage=${selectedLifeStage}`
                  : "#"
              }
              onClick={(e) => {
                if (!canViewExample) e.preventDefault()
              }}
            >
              <Button
                className={`mt-6 ${
                  canViewExample
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }`}
                disabled={!canViewExample}
              >
                View Example Content
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
          {[
            {
              title: "Daily Ayah",
              desc: "Curated Quranic verses with personalized reflections for your life stage",
              icon: "📖",
            },
            {
              title: "Modern Stories",
              desc: "Relatable narratives that bring Quranic wisdom into your everyday life",
              icon: "✨",
            },
            {
              title: "Prayer Times",
              desc: "Accurate salah times based on your location with customizable notifications",
              icon: "🕌",
            },
            {
              title: "Deep Context",
              desc: "Scholarly background including asbab al-nuzul and connected hadith",
              icon: "📜",
            },
          ].map((feature) => (
            <div key={feature.title} className="glass-card rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-lg font-semibold text-emerald-100 mb-2">{feature.title}</h4>
              <p className="text-teal-200/60 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-6 w-full mb-12">
          {[
            {
              title: "Qibla Compass",
              desc: "Find the direction of the Kaaba from anywhere in the world",
              icon: "🧭",
            },
            {
              title: "Poetry & Nasheeds",
              desc: "Beautiful verses inspired by Quranic themes for reflection",
              icon: "🎭",
            },
            {
              title: "12 Life Stages",
              desc: "From youth to seniors, new Muslims to Hajj pilgrims—content for everyone",
              icon: "🌙",
            },
          ].map((feature) => (
            <div key={feature.title} className="glass-card rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-lg font-semibold text-emerald-100 mb-2">{feature.title}</h4>
              <p className="text-teal-200/60 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="w-full max-w-2xl">
          <h3 className="text-2xl font-semibold text-emerald-100 text-center mb-8">Simple Pricing</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6 text-center">
              <h4 className="text-xl font-semibold text-emerald-100 mb-2">Monthly</h4>
              <p className="text-4xl font-bold text-emerald-400 mb-4">
                $4.99<span className="text-lg font-normal text-emerald-400/60">/mo</span>
              </p>
              <p className="text-teal-200/60 text-sm mb-4">Cancel anytime</p>
              <Link href="/auth/signup?plan=monthly">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-emerald-100">Start Free Trial</Button>
              </Link>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center border-2 border-emerald-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
              <h4 className="text-xl font-semibold text-emerald-100 mb-2">Annual</h4>
              <p className="text-4xl font-bold text-emerald-400 mb-4">
                $29.99<span className="text-lg font-normal text-emerald-400/60">/yr</span>
              </p>
              <p className="text-teal-200/60 text-sm mb-4">Save 50% • Just $2.50/month</p>
              <Link href="/auth/signup?plan=annual">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-center text-teal-200/40 text-sm mt-4">
            7-day free trial, then billing begins automatically
          </p>
        </div>
      </main>

      <footer className="relative z-10 w-full py-8 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <p className="text-emerald-200/70 text-sm max-w-xl mx-auto mb-4 px-4">
          Helping Muslims better understand what the Quran means in their season of life.
        </p>
        <p className="text-teal-300/70 text-sm mb-4">
          10% of all profits go to{" "}
          <a
            href="https://irusa.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-300 hover:text-teal-200 underline underline-offset-2"
          >
            Islamic Relief USA
          </a>
        </p>
        <p className="text-teal-300/50 text-sm">© 2025 Islam for Life Stages. All rights reserved.</p>
        <p className="mt-2 text-xs text-teal-300/30">Powered by Quran.com API • Prayer times by Aladhan</p>
      </footer>
    </div>
  )
}
