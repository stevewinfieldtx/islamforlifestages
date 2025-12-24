"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { LifeStageId, Ayah, Surah } from "@/lib/types"
import { generateAyahContent } from "@/app/actions"
import { LifeStageSelector } from "@/components/ui/life-stage-selector"
import { EXAMPLE_AYAHS, AYAT_AL_KURSI_CONTENT } from "@/lib/data/example-ayahs"
import { LIFE_STAGES } from "@/lib/data/life-stages"

export default function ExampleAyahPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [selectedLifeStage, setSelectedLifeStage] = useState<LifeStageId | null>(null)
  const [content, setContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Preparing your reflection...")
  const [mounted, setMounted] = useState(false)
  const [year, setYear] = useState<number | null>(null)

  // Parse the verse reference from URL
  const verseRef = params.verse as string
  const match = verseRef?.match(/Surah-(\d+)-Ayah-(\d+)/)
  const surahNum = match ? parseInt(match[1]) : 2
  const ayahNum = match ? parseInt(match[2]) : 255

  // Find the example ayah
  const currentExample = EXAMPLE_AYAHS.find(
    (e) => e.ayah.surah_id === surahNum && e.ayah.verse_number === ayahNum
  ) || EXAMPLE_AYAHS[0]

  useEffect(() => {
    setMounted(true)
    setYear(new Date().getFullYear())
    const stageParam = searchParams.get("stage") as LifeStageId | null
    if (stageParam) {
      setSelectedLifeStage(stageParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (selectedLifeStage && currentExample) {
      loadContent()
    }
  }, [selectedLifeStage])

  const loadContent = async () => {
    setIsLoading(true)
    setLoadingMessage("Connecting with Quranic wisdom...")

    try {
      // Check if we have pre-built content for Ayat al-Kursi
      if (currentExample.ayah.verse_key === "2:255" && selectedLifeStage) {
        const prebuilt = AYAT_AL_KURSI_CONTENT[selectedLifeStage]
        if (prebuilt) {
          setLoadingMessage("Personalizing for your life stage...")
          await new Promise((r) => setTimeout(r, 1000))
          
          setContent({
            conversational_intro: `Assalamu alaikum! Let's explore one of the most powerful ayahs in the Quran together - Ayat al-Kursi. This verse, found in Surah Al-Baqarah, is known as the greatest verse in the Quran. The Prophet Muhammad ﷺ said that whoever recites it before sleeping will be protected throughout the night. SubhanAllah, this ayah describes Allah's absolute majesty and sovereignty in a way that should make every Muslim's heart tremble with awe and find peace simultaneously. For someone in your stage of life, this verse carries special significance...`,
            stories: [{ ...prebuilt.story, image_urls: [], card_image_url: "" }],
            poems: [{ ...prebuilt.poem, image_url: "", card_image_url: "" }],
            deep_context: {
              speaker: "Allah through Jibreel to Prophet Muhammad ﷺ",
              audience: "The believers in Madinah",
              why_revealed: prebuilt.context,
              importance: "Ayat al-Kursi is considered the greatest verse in the Quran. The Prophet ﷺ said whoever recites it after every obligatory prayer, nothing will prevent them from entering Paradise except death.",
              related_hadith: "Abu Hurairah reported: The Messenger of Allah ﷺ said, 'Everything has a hump (pinnacle), and the pinnacle of the Quran is Surah Al-Baqarah. In it is a verse which is the master of all verses in the Quran: Ayat al-Kursi.' (Tirmidhi)",
              before_ayah: "The preceding verses discuss the story of Ibrahim (AS) debating with a king about Allah's power over life and death.",
              after_ayah: "The following verse (2:256) contains 'La ikraha fi al-deen' - There is no compulsion in religion.",
              revelation_type: "Madani",
            },
            reflection_questions: [
              prebuilt.reflection,
              "When you recite 'Al-Hayy Al-Qayyum' (The Ever-Living, Self-Sustaining), what does that mean for your daily worries?",
              "How can you make Ayat al-Kursi part of your daily routine?",
            ],
            dua_suggestion: prebuilt.dua,
          })
          setIsLoading(false)
          return
        }
      }

      // Otherwise generate content via AI
      setLoadingMessage("Generating personalized content...")
      const generatedContent = await generateAyahContent(
        currentExample.ayah,
        currentExample.surah,
        selectedLifeStage || undefined
      )
      setContent(generatedContent)
    } catch (error) {
      console.error("Error loading content:", error)
      setContent(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStageSelect = (stageId: LifeStageId) => {
    setSelectedLifeStage(stageId)
    window.history.replaceState(null, "", `?stage=${stageId}`)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen w-full islamic-gradient-bg flex flex-col relative overflow-x-hidden">
      {/* Background effects */}
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
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/20 ring-1 ring-white/10 bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center">
            <span className="text-2xl">🌙</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl tracking-wide text-emerald-100 font-medium">Islam for Life Stages</h1>
            <span className="text-xs text-teal-300/70 hidden sm:block">
              Example: {currentExample.surah.name} {currentExample.ayah.verse_number}
            </span>
          </div>
        </div>
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-teal-200/60 hover:text-emerald-100">
            Back to Home
          </Button>
        </Link>
      </header>

      {/* Preview Banner */}
      <div className="relative z-10 mx-4 md:mx-6 mb-4">
        <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-500/30 rounded-2xl p-4 text-center">
          <p className="text-emerald-100 font-medium">
            This is a free preview of the full experience for {currentExample.surah.name} {currentExample.ayah.verse_number}
          </p>
          <p className="text-teal-200/70 text-sm mt-1">
            Subscribe to unlock daily personalized content for every ayah
          </p>
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 md:px-6 pt-4 pb-16 w-full max-w-7xl mx-auto">
        {/* Life Stage Selector */}
        <LifeStageSelector selectedStage={selectedLifeStage} onSelectStage={handleStageSelect} />

        <div className="w-full max-w-4xl space-y-8">
          {/* Ayah Card */}
          <div className="glass-card rounded-3xl p-8 animate-fade-in">
            {/* Arabic Text */}
            <p className="text-2xl md:text-3xl text-emerald-100 font-amiri leading-loose mb-6 text-center" dir="rtl">
              {currentExample.ayah.text_arabic}
            </p>
            
            {/* Translation */}
            <p className="text-lg md:text-xl text-teal-100/80 italic leading-relaxed mb-4 text-center">
              "{currentExample.ayah.text_translation}"
            </p>
            
            {/* Reference */}
            <div className="text-center">
              <p className="text-emerald-400 font-medium">
                {currentExample.surah.name} ({currentExample.surah.name_arabic}) - Ayah {currentExample.ayah.verse_number}
              </p>
              <p className="text-teal-300/60 text-sm mt-1">
                {currentExample.surah.name_translation} • {currentExample.surah.revelation_place === 'makkah' ? 'Makki' : 'Madani'} • Verse {currentExample.ayah.verse_key}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="glass-card rounded-3xl p-8 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 animate-pulse" />
                </div>
              </div>
              <p className="text-emerald-100/90 text-center font-medium">{loadingMessage}</p>
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-pulse" />
              </div>
            </div>
          ) : content ? (
            <div className="space-y-8">
              {/* Friendly Breakdown */}
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-xl font-semibold text-emerald-100 mb-4 flex items-center gap-2">
                  <span>💬</span> Friendly Breakdown
                </h3>
                <p className="text-teal-100/80 leading-relaxed whitespace-pre-line">
                  {content.conversational_intro}
                </p>
              </div>

              {/* Story */}
              {content.stories?.[0] && (
                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-xl font-semibold text-emerald-100 mb-4 flex items-center gap-2">
                    <span>✨</span> Story: {content.stories[0].title}
                  </h3>
                  <p className="text-teal-100/80 leading-relaxed whitespace-pre-line">
                    {content.stories[0].content}
                  </p>
                </div>
              )}

              {/* Poem */}
              {content.poems?.[0] && (
                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-xl font-semibold text-emerald-100 mb-4 flex items-center gap-2">
                    <span>🎭</span> Poetry: {content.poems[0].title}
                  </h3>
                  <p className="text-teal-100/80 leading-relaxed whitespace-pre-line text-center italic">
                    {content.poems[0].content}
                  </p>
                </div>
              )}

              {/* Deep Context */}
              {content.deep_context && (
                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-xl font-semibold text-emerald-100 mb-4 flex items-center gap-2">
                    <span>📜</span> Deep Context
                  </h3>
                  <div className="space-y-4 text-teal-100/80">
                    <div>
                      <p className="text-emerald-300 font-medium text-sm mb-1">Historical Context</p>
                      <p>{content.deep_context.why_revealed}</p>
                    </div>
                    <div>
                      <p className="text-emerald-300 font-medium text-sm mb-1">Related Hadith</p>
                      <p className="italic">{content.deep_context.related_hadith}</p>
                    </div>
                    <div>
                      <p className="text-emerald-300 font-medium text-sm mb-1">Theological Significance</p>
                      <p>{content.deep_context.importance}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reflection Questions */}
              {content.reflection_questions && (
                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-xl font-semibold text-emerald-100 mb-4 flex items-center gap-2">
                    <span>🤔</span> Reflect
                  </h3>
                  <ul className="space-y-3">
                    {content.reflection_questions.map((q: string, idx: number) => (
                      <li key={idx} className="text-teal-100/80 flex gap-3">
                        <span className="text-emerald-400">{idx + 1}.</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dua */}
              {content.dua_suggestion && (
                <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-emerald-900/30 to-teal-900/30">
                  <h3 className="text-xl font-semibold text-emerald-100 mb-4 flex items-center gap-2">
                    <span>🤲</span> Dua
                  </h3>
                  <p className="text-teal-100/90 leading-relaxed italic text-center">
                    {content.dua_suggestion}
                  </p>
                </div>
              )}
            </div>
          ) : selectedLifeStage ? (
            <div className="glass-card rounded-3xl p-8 text-center">
              <p className="text-teal-200/60">Select a life stage above to see personalized content</p>
            </div>
          ) : null}
        </div>

        {/* CTA */}
        {!isLoading && content && (
          <div className="mt-12 w-full max-w-2xl">
            <div className="glass-card rounded-3xl p-8 text-center space-y-6">
              <h3 className="text-2xl font-medium text-emerald-100">Loved this experience?</h3>
              <p className="text-teal-200/80">
                Get personalized content like this every day. Stories, poetry, context, and reflections
                tailored to your life stage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/subscribe">
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-8 py-6 text-lg rounded-xl">
                    Start 7-Day Free Trial
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="border-teal-400/30 text-teal-200 hover:bg-teal-500/10 px-8 py-6 text-lg rounded-xl bg-transparent"
                  >
                    Back to Home
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-teal-300/50">$4.99/month or $29.99/year after trial • Cancel anytime</p>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 w-full py-8 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <p className="text-teal-300/70 text-sm mb-2">
          Helping Muslims better understand what the Quran means in their season of life.
        </p>
        <p className="text-teal-300/50 text-sm">© {year ?? 2025} Islam for Life Stages. All rights reserved.</p>
        <p className="mt-2 text-xs text-teal-300/30">Powered by Quran.com API</p>
      </footer>
    </div>
  )
}
