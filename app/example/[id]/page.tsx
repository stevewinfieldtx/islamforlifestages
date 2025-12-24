"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { RELIGION } from "@/config/religion"
import { getVerse, formatReference } from "@/lib/scripture-api"
import type { Scripture, GeneratedContent } from "@/lib/types"

export default function ExamplePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  
  const [scripture, setScripture] = useState<Scripture | null>(null)
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  
  const t = RELIGION.terms
  const theme = RELIGION.theme
  const lifeStages = RELIGION.lifeStages
  const features = RELIGION.features
  
  // Parse URL params
  const id = params.id as string
  const [chapter, verse] = id.split("-").map(Number)
  const stageId = searchParams.get("stage")
  const currentStage = lifeStages.find(s => s.id === stageId)

  useEffect(() => {
    loadScripture()
  }, [chapter, verse])

  useEffect(() => {
    if (scripture && stageId) {
      generateContent()
    }
  }, [scripture, stageId])

  const loadScripture = async () => {
    setLoading(true)
    try {
      const data = await getVerse(chapter, verse)
      setScripture(data)
    } catch (error) {
      console.error("Error loading scripture:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateContent = async () => {
    if (!scripture || !currentStage) return
    
    setGenerating(true)
    
    // Simulate content generation with demo content
    // In production, this would call the AI generation API
    await new Promise(r => setTimeout(r, 1500))
    
    setContent({
      friendlyBreakdown: `${t.greeting}! Let's explore this beautiful ${t.verse.toLowerCase()} together.\n\nThis ${t.verse.toLowerCase()} from ${scripture.chapter.name} speaks directly to where you are in life as someone in the "${currentStage.label}" stage. The words carry deep meaning that transcends time and speaks to the heart of every ${t.follower}.\n\nWhen we look at this passage, we see ${t.god}'s wisdom shining through in ways that are particularly relevant to the themes you're navigating: ${currentStage.themes.slice(0, 3).join(", ")}.\n\nTake a moment to let these words sink in. They weren't written by accident—they were preserved for moments like this one, when you need exactly this message.\n\n${t.closingBlessing}.`,
      
      stories: [
        {
          id: "1",
          title: "The Unexpected Lesson",
          content: `Sarah had been struggling with the weight of everything on her shoulders. As a ${currentStage.label.toLowerCase()}, the challenges seemed endless.\n\nOne evening, she opened her ${t.holyBook} almost mechanically, not expecting much. But then she read these words: "${scripture.translation}"\n\nSomething shifted. It was as if ${t.god} was speaking directly to her situation, to the exact things keeping her up at night.\n\nShe thought about her grandmother, who had faced far greater hardships, yet always maintained her faith. "This is how she did it," Sarah realized. "She held onto these words."\n\nThe next morning didn't bring fewer challenges. But it brought a new perspective—and sometimes, that makes all the difference.`,
        },
      ],
      
      poems: [
        {
          id: "1",
          title: "In This Season",
          content: `In this season where I stand,
${t.god}'s words like grains of sand—
Each one precious, each one true,
Guiding everything I do.

When the world feels far too much,
I return to ${t.godPossessive} gentle touch,
Found within these ancient lines,
Where eternal wisdom shines.`,
        },
      ],
      
      context: {
        source: `This ${t.verse.toLowerCase()} comes from ${scripture.chapter.name}`,
        audience: `Originally revealed to guide believers`,
        historicalContext: `This passage was given during a time when the community needed specific guidance`,
        significance: `It represents a core teaching about ${t.god}'s relationship with believers`,
        relatedTeachings: `Many scholars have written extensively about this passage`,
        beforeVerse: `The preceding verses set up the context`,
        afterVerse: `The following verses expand on this theme`,
      },
      
      reflectionQuestions: [
        `How does this ${t.verse.toLowerCase()} speak to your specific situation as someone in the "${currentStage.label}" stage?`,
        `What would change in your daily life if you fully embraced this teaching?`,
        `Who in your life might benefit from hearing this message?`,
      ],
      
      prayerSuggestion: `O ${t.god}, thank You for this ${t.verse.toLowerCase()} that speaks to my heart. Help me to understand it deeply and live by its wisdom. Guide me through the challenges of ${currentStage.label.toLowerCase()} with Your strength. ${t.closingBlessing}.`,
      
      lifeStageId: stageId || "",
      lifeStageInsight: `For someone in the "${currentStage.label}" stage, this teaching is particularly relevant because it addresses the core themes you're navigating.`,
      generatedAt: new Date().toISOString(),
      scriptureReference: scripture.reference,
    })
    
    setGenerating(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-white/60">Loading {t.verse.toLowerCase()}...</p>
        </div>
      </div>
    )
  }

  if (!scripture) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">{t.verse} not found</p>
          <Link href="/">
            <button 
              className="px-6 py-2 rounded-xl text-white"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Go Home
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="w-full p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
          >
            📖
          </div>
          <div>
            <span className="text-white/90 font-medium block">{RELIGION.name}</span>
            <span className="text-white/50 text-sm">Preview</span>
          </div>
        </div>
        <Link href="/">
          <button className="text-white/60 hover:text-white transition-colors">
            ← Back
          </button>
        </Link>
      </header>

      {/* Preview Banner */}
      <div 
        className="mx-4 md:mx-6 mb-6 p-4 rounded-2xl text-center"
        style={{ 
          background: `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.secondary}20)`,
          border: `1px solid ${theme.colors.primary}30`,
        }}
      >
        <p className="text-white font-medium">Free Preview</p>
        <p className="text-white/60 text-sm">Subscribe to unlock daily personalized content</p>
      </div>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        {/* Scripture Card */}
        <div className="glass-card rounded-3xl p-8 mb-8 animate-fade-in">
          {/* Original Text */}
          {features.originalLanguage && scripture.originalText && (
            <p 
              className="scripture-original text-2xl md:text-3xl text-white text-center mb-6"
              dir={features.originalLanguageDirection}
            >
              {scripture.originalText}
            </p>
          )}
          
          {/* Translation */}
          <p className="text-lg md:text-xl text-white/80 italic text-center mb-6">
            "{scripture.translation}"
          </p>
          
          {/* Reference */}
          <div className="text-center">
            <p style={{ color: theme.colors.primary }} className="font-medium">
              {formatReference(scripture)}
            </p>
            {scripture.chapter.originalName && (
              <p className="text-white/50 text-sm mt-1">
                {scripture.chapter.originalName}
              </p>
            )}
          </div>
        </div>

        {/* Life Stage Badge */}
        {currentStage && (
          <div className="text-center mb-8">
            <span 
              className="inline-block px-4 py-2 rounded-full text-sm"
              style={{ 
                backgroundColor: `${theme.colors.secondary}20`,
                color: theme.colors.secondary,
              }}
            >
              Viewing as: {currentStage.label}
            </span>
          </div>
        )}

        {/* Generated Content */}
        {generating ? (
          <div className="glass-card rounded-3xl p-8 text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-white/60">Generating personalized content...</p>
          </div>
        ) : content ? (
          <div className="space-y-8 animate-fade-in-up">
            {/* Friendly Breakdown */}
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span>💬</span> Friendly Breakdown
              </h3>
              <p className="text-white/80 leading-relaxed whitespace-pre-line">
                {content.friendlyBreakdown}
              </p>
            </div>

            {/* Story */}
            {content.stories[0] && (
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span>✨</span> Story: {content.stories[0].title}
                </h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-line">
                  {content.stories[0].content}
                </p>
              </div>
            )}

            {/* Poem */}
            {content.poems[0] && (
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span>🎭</span> Poetry: {content.poems[0].title}
                </h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-line text-center italic">
                  {content.poems[0].content}
                </p>
              </div>
            )}

            {/* Reflection */}
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span>🤔</span> Reflect
              </h3>
              <ul className="space-y-3">
                {content.reflectionQuestions.map((q, i) => (
                  <li key={i} className="text-white/80 flex gap-3">
                    <span style={{ color: theme.colors.primary }}>{i + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prayer */}
            <div 
              className="glass-card rounded-3xl p-8"
              style={{ 
                background: `linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.secondary}05)`,
              }}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span>🤲</span> {t.prayer}
              </h3>
              <p className="text-white/90 leading-relaxed italic text-center">
                {content.prayerSuggestion}
              </p>
            </div>
          </div>
        ) : null}

        {/* CTA */}
        {content && (
          <div className="mt-12 glass-card rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Loved this experience?
            </h3>
            <p className="text-white/60 mb-6">
              Get personalized content like this every day
            </p>
            <Link href="/auth/signup">
              <button
                className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Start {RELIGION.pricing.trialDays}-Day Free Trial
              </button>
            </Link>
            <p className="text-white/40 text-sm mt-4">
              ${RELIGION.pricing.monthly}/month after trial
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
