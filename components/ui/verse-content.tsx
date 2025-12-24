"use client"

import type React from "react"
import type { GeneratedContent, LifeStageId } from "@/lib/types"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface VerseContentProps {
  content: GeneratedContent | null
  lifeStage: LifeStageId | null
  isLoading: boolean
}

const iconMap = {
  MessageCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  ),
  Heart: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  BookOpen: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  HelpCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
}

function GridItem({
  children,
  className,
  title,
  iconKey,
  image,
  span = 1,
  onClick,
  index = 0,
}: {
  children?: React.ReactNode
  className?: string
  title: string
  iconKey?: string
  image?: string
  span?: 1 | 2
  onClick?: () => void
  index?: number
}) {
  const IconComponent = iconKey ? iconMap[iconKey] : null

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={cn(
        "grid-card rounded-xl overflow-hidden flex flex-col h-full animate-spring-in",
        span === 2 ? "md:col-span-2" : "md:col-span-1",
        onClick ? "cursor-pointer" : "",
        className,
      )}
    >
      <div className={cn("relative shrink-0 overflow-hidden group", children ? "aspect-[3/2]" : "aspect-square")}>
        {image ? (
          <>
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-contain bg-slate-900 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-teal-600/30 to-amber-600/20">
            {IconComponent && (
              <div className="absolute inset-0 flex items-center justify-center text-white/10 scale-[3]">
                <IconComponent />
              </div>
            )}
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full p-2 md:p-3">
          <div className="flex items-center gap-2">
            {IconComponent && (
              <div className="p-1.5 rounded-lg bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/20">
                <IconComponent className="w-4 h-4" />
              </div>
            )}
            <h3 className="font-serif text-sm md:text-base text-amber-50 tracking-wide drop-shadow-lg line-clamp-1">
              {title}
            </h3>
          </div>
        </div>
      </div>

      {children && (
        <div className="p-6 flex-1 text-blue-100/90 leading-relaxed text-base space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-900/80">
          {children}
        </div>
      )}
    </motion.div>
  )
}

export function VerseContent({ content, lifeStage, isLoading }: VerseContentProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    setActiveSection(null)
  }, [content])

  if (isLoading) {
    return null
  }

  if (!content) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center text-blue-200">
        <p className="text-lg">No content available. Please try again.</p>
      </div>
    )
  }

  if (activeSection) {
    return (
      <div className="w-full space-y-6 animate-spring-in">
        <button
          onClick={() => setActiveSection(null)}
          className="flex items-center gap-2 text-amber-300 hover:text-amber-200 glass-card px-5 py-3 rounded-full transition-all duration-300 active:scale-95 font-medium"
        >
          <iconMap.ArrowLeft />
          <span>Back to Menu</span>
        </button>

        {activeSection === "overview" && (
          <GridItem title="Overview" iconKey="MessageCircle" image={content.card_images?.overview} span={2}>
            <div className="prose prose-invert prose-amber max-w-none">{content.conversational_intro}</div>
          </GridItem>
        )}

        {activeSection === "lifestage" &&
          lifeStage &&
          content.life_stage_insights &&
          content.life_stage_insights[lifeStage] && (
            <GridItem title="For Your Journey" iconKey="Heart" span={2}>
              <div className="prose prose-invert prose-amber max-w-none">
                <p className="text-sm font-medium text-teal-300 uppercase tracking-wider mb-2">
                  {lifeStage.replace("-", " ")}
                </p>
                {content.life_stage_insights[lifeStage]}
              </div>
            </GridItem>
          )}

        {activeSection.startsWith("story_") && (
          <GridItem
            title={`Story - ${content.stories?.[Number.parseInt(activeSection.split("_")[1])].title}`}
            image={content.stories?.[Number.parseInt(activeSection.split("_")[1])].image_urls?.[0]}
            iconKey="User"
            span={2}
          >
            <div className="prose prose-invert prose-amber max-w-none whitespace-pre-wrap">
              {content.stories?.[Number.parseInt(activeSection.split("_")[1])].content}
            </div>
            {content.stories?.[Number.parseInt(activeSection.split("_")[1])].image_urls?.[1] && (
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mt-6 ring-1 ring-white/10">
                <Image
                  src={
                    content.stories?.[Number.parseInt(activeSection.split("_")[1])].image_urls?.[1] ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt="Story illustration"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </GridItem>
        )}

        {activeSection === "context" && content.deep_context && (
          <GridItem title="Context" iconKey="BookOpen" image={content.card_images?.context} span={2}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">
                    Speaker & Audience
                  </h4>
                  <p className="text-blue-100">
                    {content.deep_context.speaker} to {content.deep_context.audience}
                  </p>
                </div>
                <div>
                  <h4 className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Context</h4>
                  <p className="text-blue-100">{content.deep_context.why_said}</p>
                </div>
                <div>
                  <h4 className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Before</h4>
                  <p className="text-blue-100">{content.deep_context.before_verse}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Significance</h4>
                  <p className="text-blue-100">{content.deep_context.importance}</p>
                </div>
                <div>
                  <h4 className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Outcome</h4>
                  <p className="text-blue-100">{content.deep_context.success}</p>
                </div>
                <div>
                  <h4 className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">After</h4>
                  <p className="text-blue-100">{content.deep_context.after_verse}</p>
                </div>
              </div>
            </div>
          </GridItem>
        )}

        {activeSection.startsWith("poem_") && (
          <GridItem
            title={`Poetry - ${content.poems?.[Number.parseInt(activeSection.split("_")[1])].title}`}
            image={content.poems?.[Number.parseInt(activeSection.split("_")[1])].image_url}
            iconKey="Sparkles"
            span={2}
          >
            <div className="prose prose-invert prose-amber max-w-none italic whitespace-pre-wrap text-lg leading-relaxed">
              {content.poems?.[Number.parseInt(activeSection.split("_")[1])].content}
            </div>
          </GridItem>
        )}

        {activeSection === "location" && content.location && (
          <GridItem title="Location" iconKey="MapPin" span={2}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amber-100">{content.location.location_name}</h4>
                {content.location.modern_name && (
                  <span className="text-xs text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                    Modern: {content.location.modern_name}
                  </span>
                )}
              </div>
              <p className="text-blue-100">{content.location.description}</p>
            </div>
          </GridItem>
        )}

        {activeSection === "prayer" && (
          <GridItem title="Prayer & Reflection" iconKey="HelpCircle" image={content.card_images?.prayer} span={2}>
            <div className="space-y-8">
              <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/20">
                <h4 className="font-serif text-xl text-amber-300 mb-4 flex items-center gap-2">
                  <iconMap.Sparkles /> A Prayer
                </h4>
                <p className="italic text-amber-100/90 text-lg leading-relaxed">{content.prayer_suggestion}</p>
              </div>
              <div>
                <h4 className="font-serif text-xl text-amber-100 mb-4">Questions for You</h4>
                <div className="grid gap-4">
                  {content.reflection_questions.map((q, i) => (
                    <div
                      key={i}
                      className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex gap-4 items-start"
                    >
                      <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-blue-100">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GridItem>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full pb-20">
      <GridItem
        title="Overview"
        iconKey="MessageCircle"
        image={content.card_images?.overview}
        onClick={() => setActiveSection("overview")}
        index={0}
      />

      <GridItem
        title="Context"
        iconKey="BookOpen"
        image={content.card_images?.context}
        onClick={() => setActiveSection("context")}
        index={1}
      />

      {content.stories?.[0] && (
        <GridItem
          title={`Story - ${content.stories[0].title}`}
          image={content.stories[0].card_image_url || content.stories[0].image_urls?.[0]}
          iconKey="User"
          onClick={() => setActiveSection("story_0")}
          index={2}
        />
      )}

      {content.stories?.[1] && (
        <GridItem
          title={`Story - ${content.stories[1].title}`}
          image={content.stories[1].card_image_url || content.stories[1].image_urls?.[0]}
          iconKey="User"
          onClick={() => setActiveSection("story_1")}
          index={3}
        />
      )}

      {content.poems?.[0] && (
        <GridItem
          title={`Poetry - ${content.poems[0].title}`}
          image={content.poems[0].card_image_url || content.poems[0].image_url}
          iconKey="Sparkles"
          onClick={() => setActiveSection("poem_0")}
          index={4}
        />
      )}

      {content.poems?.[1] && (
        <GridItem
          title={`Poetry - ${content.poems[1].title}`}
          image={content.poems[1].card_image_url || content.poems[1].image_url}
          iconKey="Sparkles"
          onClick={() => setActiveSection("poem_1")}
          index={5}
        />
      )}

      <GridItem
        title="Prayer & Reflection"
        iconKey="HelpCircle"
        image={content.card_images?.prayer}
        onClick={() => setActiveSection("prayer")}
        index={6}
      />

      <div
        className="rounded-xl h-24 md:h-28 flex flex-col items-center justify-center border-2 border-dashed border-blue-500/20 bg-blue-500/5 animate-spring-in px-3"
        style={{ animationDelay: "700ms" }}
      >
        <span className="text-blue-300/50 text-xs font-medium mb-1">Coming Soon</span>
        <ul className="text-blue-300/40 text-[10px] text-center space-y-0.5">
          <li>Customized music</li>
          <li>Unique image galleries</li>
          <li>Chat with Biblical figures</li>
        </ul>
      </div>
    </div>
  )
}
