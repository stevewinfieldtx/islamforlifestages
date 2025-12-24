"use client"

import { useEffect, useState } from "react"
import type { Verse, LifeStage, AIInsights } from "@/lib/types"
import { generateVerseInsights } from "@/app/actions"
import { Sparkles, User, History, MessageCircle, HeartHandshake } from "lucide-react"
import { motion } from "framer-motion"

interface AIInsightsDisplayProps {
  verse: Verse
  lifeStage: LifeStage
}

export function AIInsightsDisplay({ verse, lifeStage }: AIInsightsDisplayProps) {
  const [insights, setInsights] = useState<AIInsights | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true)
      const response = await generateVerseInsights(verse, lifeStage)
      if (response.success) {
        setInsights(response.data as AIInsights)
      }
      setLoading(false)
    }

    fetchInsights()
  }, [verse, lifeStage])

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-40 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5" />
          <div className="h-64 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5" />
        </div>
      </div>
    )
  }

  if (!insights) return null

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Main Conversational Intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 border-l-4 border-l-secondary-400"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-secondary-500/20 text-secondary-200 hidden sm:block">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-white">Let's Talk About It</h3>
            <p className="text-primary-100 leading-relaxed text-lg">{insights.conversational_intro}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Life Stage Specific */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4 text-primary-300">
            <User className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">For {lifeStage.label}</span>
          </div>
          <p className="text-white/90 leading-relaxed">{insights.life_stage_insight}</p>
        </motion.div>

        {/* Historical Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4 text-primary-300">
            <History className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">The Context</span>
          </div>
          <p className="text-white/90 leading-relaxed">{insights.historical_context}</p>
        </motion.div>
      </div>

      {/* Reflection & Prayer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-8 bg-gradient-to-br from-white/10 to-primary-900/20"
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-secondary-300 mb-2">
              <Sparkles className="w-5 h-5" />
              <h4 className="font-serif text-xl">Reflection Questions</h4>
            </div>
            <ul className="space-y-3">
              {insights.reflection_questions.map((q, i) => (
                <li key={i} className="flex items-start gap-3 text-primary-100">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-sm text-white/70">
                    {i + 1}
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-px bg-white/10 hidden md:block" />

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-secondary-300 mb-2">
              <HeartHandshake className="w-5 h-5" />
              <h4 className="font-serif text-xl">A Prayer for Today</h4>
            </div>
            <blockquote className="italic text-primary-100/90 leading-relaxed border-l-2 border-secondary-500/30 pl-4">
              "{insights.prayer_suggestion}"
            </blockquote>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
