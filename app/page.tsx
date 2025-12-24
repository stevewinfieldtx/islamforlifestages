"use client"

import { useState } from "react"
import Link from "next/link"
import { RELIGION } from "@/config/religion"
import type { LifeStageId } from "@/config/religion"

export default function HomePage() {
  const [selectedExample, setSelectedExample] = useState(0)
  const [selectedLifeStage, setSelectedLifeStage] = useState<string | null>(null)
  
  const t = RELIGION.terms
  const theme = RELIGION.theme
  const examples = RELIGION.examples
  const lifeStages = RELIGION.lifeStages
  const pricing = RELIGION.pricing
  const charity = RELIGION.charity
  
  const currentExample = examples[selectedExample]
  const canPreview = selectedLifeStage !== null

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse-glow"
          style={{ backgroundColor: `${theme.colors.primary}20` }}
        />
        <div 
          className="absolute top-1/3 right-0 w-80 h-80 rounded-full blur-3xl animate-pulse-glow"
          style={{ backgroundColor: `${theme.colors.secondary}15`, animationDelay: "1s" }}
        />
        <div 
          className="absolute bottom-1/4 left-0 w-72 h-72 rounded-full blur-3xl animate-pulse-glow"
          style={{ backgroundColor: `${theme.colors.accent}10`, animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
          >
            📖
          </div>
          <span className="text-white/90 font-medium hidden sm:block">{RELIGION.name}</span>
        </div>
        <Link href="/auth/login">
          <button 
            className="px-4 py-2 rounded-xl border text-sm font-medium transition-colors"
            style={{ 
              borderColor: `${theme.colors.primary}40`,
              color: theme.colors.primary,
            }}
          >
            Sign In
          </button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 md:px-6 pt-8 pb-16 max-w-6xl mx-auto w-full">
        
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-6xl shadow-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${theme.colors.primary}40, ${theme.colors.secondary}20)`,
                boxShadow: `0 20px 40px ${theme.colors.primary}30`,
              }}
            >
              📖
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {RELIGION.shortName}{" "}
            <span style={{ color: theme.colors.primary }} className="font-light">for</span>
            <br />
            Life Stages
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            {RELIGION.tagline}
          </p>
        </div>

        {/* Greeting */}
        <p 
          className="text-xl md:text-2xl mb-8 font-medium"
          style={{ color: theme.colors.primary }}
        >
          {t.greeting}!
        </p>

        {/* CTA */}
        <Link href="/auth/signup" className="mb-12">
          <button
            className="px-12 py-4 rounded-2xl text-lg font-bold text-white shadow-2xl transition-all hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
              boxShadow: `0 10px 30px ${theme.colors.primary}40`,
            }}
          >
            Start {pricing.trialDays}-Day Free Trial
          </button>
        </Link>

        {/* Preview Section */}
        <div className="w-full mb-12">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">
            Preview Our Content
          </h2>

          {/* Example Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {examples.map((example, idx) => (
              <button
                key={example.id}
                onClick={() => setSelectedExample(idx)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedExample === idx
                    ? "text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
                style={selectedExample === idx ? { 
                  backgroundColor: theme.colors.primary 
                } : {}}
              >
                {example.title}
              </button>
            ))}
          </div>

          {/* Life Stage Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {lifeStages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedLifeStage(stage.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedLifeStage === stage.id
                    ? "border"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
                style={selectedLifeStage === stage.id ? { 
                  backgroundColor: `${theme.colors.secondary}20`,
                  borderColor: `${theme.colors.secondary}40`,
                  color: theme.colors.secondary,
                } : {}}
              >
                {stage.label}
              </button>
            ))}
          </div>

          {/* Example Display */}
          <div className="glass-card rounded-3xl p-8 text-center max-w-3xl mx-auto">
            <p className="text-white/60 text-sm mb-4">
              {t.chapter} {currentExample.chapter}, {t.verse} {currentExample.verse}
            </p>
            
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
              {currentExample.title}
            </h3>
            
            <p className="text-white/60 mb-6">
              {currentExample.description}
            </p>

            {selectedLifeStage ? (
              <Link href={`/example/${currentExample.chapter}-${currentExample.verse}?stage=${selectedLifeStage}`}>
                <button
                  className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  View Personalized Content
                </button>
              </Link>
            ) : (
              <p style={{ color: `${theme.colors.primary}80` }} className="text-sm">
                Select a life stage above to preview content
              </p>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
          {[
            { icon: "📖", title: `Daily ${t.verse}`, desc: `Curated ${t.scripture} with personalized reflections` },
            { icon: "✨", title: "Modern Stories", desc: `Relatable narratives bringing ${t.scripture} to life` },
            { icon: "🎭", title: "Poetry", desc: "Beautiful verses inspired by sacred themes" },
            { icon: "📜", title: "Deep Context", desc: "Historical background and scholarly insights" },
          ].map((feature) => (
            <div key={feature.title} className="glass-card rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-white/50 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">
            Simple Pricing
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly */}
            <div className="glass-card rounded-2xl p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Monthly</h3>
              <p className="text-4xl font-bold mb-4" style={{ color: theme.colors.primary }}>
                ${pricing.monthly}
                <span className="text-lg font-normal opacity-60">/mo</span>
              </p>
              <p className="text-white/50 text-sm mb-4">Cancel anytime</p>
              <Link href="/auth/signup?plan=monthly">
                <button className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
                  Start Free Trial
                </button>
              </Link>
            </div>

            {/* Yearly */}
            <div 
              className="glass-card rounded-2xl p-6 text-center relative border-2"
              style={{ borderColor: `${theme.colors.primary}40` }}
            >
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: theme.colors.primary }}
              >
                BEST VALUE
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Annual</h3>
              <p className="text-4xl font-bold mb-4" style={{ color: theme.colors.primary }}>
                ${pricing.yearly}
                <span className="text-lg font-normal opacity-60">/yr</span>
              </p>
              <p className="text-white/50 text-sm mb-4">
                Save {Math.round((1 - pricing.yearly / (pricing.monthly * 12)) * 100)}%
              </p>
              <Link href="/auth/signup?plan=yearly">
                <button 
                  className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  Start Free Trial
                </button>
              </Link>
            </div>
          </div>
          
          <p className="text-center text-white/40 text-sm mt-4">
            {pricing.trialDays}-day free trial, then billing begins
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center border-t border-white/5 bg-black/20">
        <p className="text-white/60 text-sm mb-4 px-4 max-w-xl mx-auto">
          Helping {t.followerPlural} better understand what the {t.scripture} means in their season of life.
        </p>
        
        {charity && (
          <p className="text-sm mb-4" style={{ color: theme.colors.secondary }}>
            {charity.percentage}% of profits go to{" "}
            <a
              href={charity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-80"
            >
              {charity.name}
            </a>
          </p>
        )}
        
        <p className="text-white/40 text-sm">
          © {new Date().getFullYear()} {RELIGION.name}. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
