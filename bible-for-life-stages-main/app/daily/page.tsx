"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { LifeStageId, Verse, GeneratedContent } from "@/lib/types"
import { getCurrentDateString, getVerseForDate } from "@/lib/data/verses"
import { generateVerseContent } from "@/app/actions"
import { LifeStageSelector } from "@/components/ui/life-stage-selector"
import { VerseCard } from "@/components/ui/verse-card"
import { VerseContent } from "@/components/ui/verse-content"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export default function DailyPage() {
  const [mounted, setMounted] = useState(false)
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null)
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [selectedLifeStage, setSelectedLifeStage] = useState<LifeStageId | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState("Preparing your daily verse...")
  const [year, setYear] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    setYear(new Date().getFullYear())

    // Check auth
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/")
        return
      }
      setUser(user)
    })

    const savedLifeStage = localStorage.getItem("lifeStage") as LifeStageId | null
    setSelectedLifeStage(savedLifeStage || "adult")

    const today = getCurrentDateString()
    const verse = getVerseForDate(today)
    setCurrentVerse(verse)
  }, [router])

  useEffect(() => {
    if (!currentVerse || !selectedLifeStage || !mounted || !user) return

    async function loadContentForLifeStage() {
      setIsLoading(true)
      try {
        setLoadingMessage(`Personalizing content for ${selectedLifeStage?.replace("-", " ")}...`)
        const generatedContent = await generateVerseContent(currentVerse, selectedLifeStage)
        setContent(generatedContent)
      } catch (err) {
        console.error("Failed to load content for life stage", err)
        setLoadingMessage("Error loading content. Please refresh.")
      } finally {
        setIsLoading(false)
      }
    }

    loadContentForLifeStage()
  }, [selectedLifeStage, currentVerse, mounted, user])

  const handleStageSelect = (stage: LifeStageId) => {
    setSelectedLifeStage(stage)
    localStorage.setItem("lifeStage", stage)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!mounted || !user) return null

  return (
    <div className="min-h-screen w-full stained-glass-bg flex flex-col relative overflow-x-hidden">
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
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl animate-glow-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <header className="relative z-10 w-full p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/20 ring-1 ring-white/10">
            <Image src="/images/logo.jpg" alt="Bible for Life Stages" fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl tracking-wide text-amber-100 font-medium">Bible for Life Stages</h1>
            <span className="text-xs text-blue-300/70 hidden sm:block">Scripture for every season</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-blue-200/60 hover:text-amber-100">
          Sign Out
        </Button>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 md:px-6 pt-4 pb-16 w-full max-w-7xl mx-auto">
        <LifeStageSelector selectedStage={selectedLifeStage} onSelectStage={handleStageSelect} />

        <div className="w-full max-w-7xl space-y-8">
          {currentVerse && <VerseCard verse={currentVerse} className="animate-spring-in" />}

          {isLoading ? (
            <div className="glass-card rounded-3xl p-8 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 animate-pulse" />
                </div>
              </div>
              <p className="text-amber-100/90 text-center font-medium">{loadingMessage}</p>
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-amber-500 animate-shimmer" />
              </div>
            </div>
          ) : (
            <VerseContent content={content} lifeStage={selectedLifeStage} isLoading={isLoading} />
          )}
        </div>
      </main>

      <footer className="relative z-10 w-full py-8 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 mb-2 text-amber-300/80">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          <span className="text-sm">Powered by AI & Scripture</span>
        </div>
        <p className="text-blue-300/50 text-sm">© {year ?? 2025} Bible for Life Stages. All rights reserved.</p>
        <p className="mt-2 text-xs text-blue-300/30">Verses from Bible.com • ESV Translation</p>
      </footer>
    </div>
  )
}
