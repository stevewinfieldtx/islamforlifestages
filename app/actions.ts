"use server"

import { generateObject, generateText } from "ai"
import type { Ayah, Surah } from "@/lib/types"
import { z } from "zod"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { getCachedContent, setCachedContent } from "@/lib/cache"
import { openrouter } from "@/lib/openrouter"
import { generateImageWithSDK, generateImagesParallel } from "@/lib/runware"

const WRITER_MODEL = process.env.OPENROUTER_WRITER_MODEL || "anthropic/claude-3-opus"
const RESEARCH_MODEL = process.env.OPENROUTER_RESEARCH_MODEL || "openai/gpt-4-turbo-preview"

// ============================================
// READING LEVEL GUIDANCE
// ============================================

const READING_LEVEL_GUIDANCE: Record<string, string> = {
  youth: `
READING LEVEL: 3rd Grade (Ages 6-12)
- Use simple, short sentences (8-12 words average)
- Explain Arabic/Islamic terms simply: "Salah means prayer", "Dua means talking to Allah"
- Use concrete, tangible examples from family and school life
- Keep paragraphs very short (2-3 sentences)`,

  teens: `
READING LEVEL: 6th Grade (Ages 13-17)
- Use clear, direct sentences
- Islamic terms can be used but briefly explained
- Use relatable examples from teen Muslim life
- Keep paragraphs moderate length (3-5 sentences)`,

  university: `
READING LEVEL: 9th Grade (Ages 18-24)
- More sophisticated vocabulary
- Arabic terms can be used freely with transliteration
- Include intellectual depth appropriate for college students`,

  default: `
READING LEVEL: 12th Grade (Adult)
- Full vocabulary range appropriate
- Arabic terms used naturally
- Complex theological concepts allowed
- Assume adult life experience and Islamic knowledge`,
}

function getReadingLevelGuidance(lifeStageId: string): string {
  return READING_LEVEL_GUIDANCE[lifeStageId] || READING_LEVEL_GUIDANCE.default
}

// ============================================
// ISLAMIC LIFE STAGE INSTRUCTIONS
// ============================================

const LIFE_STAGE_INSTRUCTIONS: Record<string, string> = {
  youth: `
LIFE STAGE: Muslim Youth (6-12)
Language & Tone: Simple, warm, encouraging. Use short sentences and familiar words.
Application Focus: Love for Allah, being kind, telling the truth, honoring parents, learning to pray, Ramadan excitement, making good choices.
Examples: School situations, family moments, learning Quran, fasting for the first time, Eid celebrations, helping at the mosque.
Developmental: Concrete thinking, learning right from wrong, building foundational understanding of Islam.`,

  teens: `
LIFE STAGE: Muslim Teenagers (13-17)
Language & Tone: Authentic, straightforward, not preachy. Be honest about complexity while providing clarity.
Application Focus: Muslim identity, peer pressure, hijab/modesty questions, halal relationships, social media, balancing deen and dunya, finding purpose.
Examples: High school dynamics, sports, college apps, friend drama, explaining Islamic practices to non-Muslim friends.
Developmental: Questioning beliefs, seeking independence, forming identity, highly influenced by peers.`,

  university: `
LIFE STAGE: Muslim University Students (18-24)
Language & Tone: Intellectually engaging, respects critical thinking. Acknowledge tension between faith and secular environments.
Application Focus: Faith challenges, intellectual doubts, halal socializing, career discernment, finding Muslim community, marriage thoughts.
Examples: Campus life, challenging professors, MSA involvement, internships, dating pressures, choosing career paths.
Developmental: Significant identity formation, exploring ideologies, establishing independence.`,

  "new-muslim": `
LIFE STAGE: New to Islam (Revert/Convert)
Language & Tone: Welcoming, patient, encouraging. Never assume Islamic knowledge. Explain everything gently.
Application Focus: Learning salah, understanding Quran, family reactions, finding community, changing lifestyle, feeling overwhelmed, joy of discovery.
Examples: First Ramadan, explaining conversion to family, learning Arabic pronunciation, finding halal food, making Muslim friends.
Developmental: Everything is new, information overload, potential isolation, beautiful spiritual awakening.`,

  "newly-married": `
LIFE STAGE: Newly Married (Nikah)
Language & Tone: Warm, relational, honest about challenges. Affirm marriage while being practical.
Application Focus: Building halal home, communication, rights and responsibilities, in-law dynamics, praying together, financial planning Islamically.
Examples: Navigating cultural vs. Islamic expectations, first Ramadan as couple, managing finances (avoiding riba), household responsibilities.
Developmental: Identity shift, prioritizing spouse, establishing relationship foundation, balancing two families.`,

  "new-parents": `
LIFE STAGE: New Muslim Parents
Language & Tone: Compassionate, grace-filled, practical. Acknowledge exhaustion without adding guilt.
Application Focus: Raising Muslim children, teaching by example, patience with exhaustion, aqeeqah and traditions, dua for children.
Examples: 3 AM feedings while trying to pray Fajr, choosing Islamic names, teaching first words include "Allah", finding Islamic preschools.
Developmental: Sleep deprivation, identity restructuring, wanting to raise children better than they were raised.`,

  ramadan: `
LIFE STAGE: Ramadan Focus
Language & Tone: Spiritually elevated, motivating. Focus on maximizing blessings without being overwhelming.
Application Focus: Fasting spirituality, taraweeh motivation, Quran completion, charity, family iftars, seeking Laylatul Qadr.
Examples: Suhoor struggles, staying focused at work while fasting, making the most of the last ten nights, Eid preparations.
Developmental: Heightened spiritual awareness, community connection, self-discipline, gratitude.`,

  "hajj-prep": `
LIFE STAGE: Hajj/Umrah Preparation
Language & Tone: Reverent, practical, building excitement. Balance spiritual preparation with logistical readiness.
Application Focus: Ihram preparation, learning rituals, spiritual readiness, seeking forgiveness, physical preparation, leaving affairs in order.
Examples: Packing lists, learning duas for each ritual, physical training for walking, writing wills, emotional preparation.
Developmental: Spiritual anticipation, anxiety about doing it correctly, once-in-a-lifetime awareness.`,

  "empty-nesting": `
LIFE STAGE: Empty Nesting
Language & Tone: Reflective, hopeful. Honor grief of transition while celebrating new possibilities.
Application Focus: Transition, Islamic legacy, rediscovering purpose, grandparenting, increased ibadah, preparing for akhirah.
Examples: Quiet house after kids leave, resisting over-involvement in adult children's lives, reconnecting with spouse, more time for Quran.
Developmental: Identity transition, grieving active parenting end, reimagining purpose, thinking about legacy.`,

  divorced: `
LIFE STAGE: Divorced
Language & Tone: Gentle, non-judgmental, compassionate. Create space for honest emotions. No shame.
Application Focus: Iddah period, healing through deen, trusting Allah's plan, co-parenting, community support, new beginnings.
Examples: Navigating mosque community as divorced person, explaining to children, financial adjustments, considering remarriage.
Developmental: Processing grief, rebuilding life, potential stigma, theological wrestling with "what went wrong".`,

  senior: `
LIFE STAGE: Senior Muslims (65+)
Language & Tone: Respectful, dignified. Honor wisdom and experience. Address mortality with hope, not fear.
Application Focus: Increased ibadah, preparing for akhirah, health challenges, legacy and sadaqah jariyah, wisdom to share.
Examples: Retirement routines, grandparenting, losing friends/spouse, health conditions, downsizing, planning Islamic will.
Developmental: Preparing to meet Allah, processing life review, managing fears of dependency, legacy concerns.`,

  seeking: `
LIFE STAGE: Seeking/Questioning
Language & Tone: Welcoming, non-pressuring, intellectually engaging. Meet questions with wisdom, not defensiveness.
Application Focus: Exploring truth, intellectual questions, comparing beliefs, finding peace, signs of Allah, purpose of life.
Examples: Reading Quran for the first time, visiting a mosque, talking to Muslim friends, watching Islamic content online.
Developmental: Curiosity, open-minded discovery, potentially challenging family expectations.`,
}

function getAgeAppropriateGuardrail(lifeStage?: string): string {
  return `AGE APPROPRIATENESS: All content must be suitable for the ${lifeStage || "target"} life stage, avoiding mature themes when inappropriate. Every example should directly address real concerns, hopes, and challenges of that stage.`
}

// ============================================
// IMAGE STYLE GUIDANCE
// ============================================

function getImageStyleGuidance(lifeStage?: string): string {
  switch (lifeStage) {
    case "youth":
      return `IMAGE STYLE: Warm, colorful illustration style suitable for children. Bright colors, friendly expressions, wholesome Islamic settings like mosques, family homes, Eid celebrations.`
    case "teens":
      return `IMAGE STYLE: Modern, clean aesthetic appealing to teenagers. Relatable Muslim teen characters, contemporary settings, modest dress, vibrant but not childish.`
    default:
      return `IMAGE STYLE: Respectful, dignified imagery. Beautiful Islamic architecture, calligraphy, nature scenes, diverse Muslim communities. Avoid stereotypes. Include geometric patterns and Islamic art elements.`
  }
}

const imagePromptGuidance = `
IMAGE PROMPT REQUIREMENTS:

=== COMPOSITION ===
- Wide establishing shots showing vast environment
- Respectful portrayal of Muslim characters and settings
- Beautiful Islamic imagery: mosques, geometric patterns, calligraphy, nature
- Avoid faces in close-up (Islamic art tradition)
- Focus on scenes, environments, and symbolic imagery

=== ISLAMIC ELEMENTS TO INCLUDE ===
- Mosque architecture, minarets, domes
- Islamic geometric patterns
- Arabic calligraphy
- Prayer scenes (from respectful distance)
- Natural beauty (mountains, stars, gardens - signs of Allah)
- Modest dress for any people shown

=== AVOID ===
- Any depiction that could be seen as depicting prophets or angels
- Close-up faces
- Anything that could be considered disrespectful to Islam
- Stereotypical or negative imagery
`

// ============================================
// SCHEMAS
// ============================================

const storySchema = z.object({
  title: z.string(),
  content: z.string().describe("The full story - MUST be at least 750 words"),
  hadith_reference: z.string().optional().describe("A relevant hadith that connects to the story"),
  image_prompt: z.string(),
  image_prompt_2: z.string(),
  card_image_prompt: z.string(),
})

const poemSchema = z.object({
  title: z.string(),
  content: z.string(),
  image_prompt: z.string(),
  card_image_prompt: z.string(),
})

const deepContextSchema = z.object({
  speaker: z.string().describe("Who revealed this - Allah through Jibreel to the Prophet ﷺ"),
  audience: z.string().describe("Original recipients of this revelation"),
  why_revealed: z.string().describe("Asbab al-Nuzul - reasons for revelation if known"),
  importance: z.string().describe("Theological significance of this ayah"),
  related_hadith: z.string().describe("A relevant hadith that illuminates this ayah"),
  before_ayah: z.string().describe("Context from preceding ayahs"),
  after_ayah: z.string().describe("Context from following ayahs"),
  revelation_type: z.string().describe("Makki or Madani"),
  location: z.string().optional(),
})

// ============================================
// MAIN CONTENT GENERATION
// ============================================

export async function generateAyahContent(
  ayah: Ayah,
  surah: Surah,
  lifeStage?: string
) {
  const cacheKey = `${ayah.verse_key}-${lifeStage || 'default'}`
  const cached = await getCachedContent(cacheKey, lifeStage)
  if (cached) {
    return cached
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing. Please add it to your environment variables.")
  }

  const openrouterInstance = createOpenRouter({ apiKey })

  try {
    const lifeStageInstructions =
      lifeStage && LIFE_STAGE_INSTRUCTIONS[lifeStage] ? LIFE_STAGE_INSTRUCTIONS[lifeStage] : ""

    const readingLevelGuidance = getReadingLevelGuidance(lifeStage || "default")
    const ageAppropriateGuardrail = getAgeAppropriateGuardrail(lifeStage)

    const stageGuidanceBlock = [lifeStageInstructions, readingLevelGuidance, ageAppropriateGuardrail]
      .filter(Boolean)
      .join("\n\n")

    const ayahContext = `
AYAH: ${surah.name} (${surah.name_arabic}) - Ayah ${ayah.verse_number}
Verse Key: ${ayah.verse_key}
Arabic: ${ayah.text_arabic}
Translation: "${ayah.text_translation}"
Revelation: ${surah.revelation_place === 'makkah' ? 'Makki' : 'Madani'}
Surah Meaning: ${surah.name_translation}
`

    console.log(`[ILS] Starting content generation for ${ayah.verse_key}${lifeStage ? ` (${lifeStage})` : ""}`)

    // Generate intro/friendly breakdown
    const introResult = await generateObject({
      model: openrouterInstance(WRITER_MODEL),
      schema: z.object({ intro: z.string() }),
      prompt: `CRITICAL: Your response MUST be AT LEAST 500 WORDS.

Write a comprehensive, in-depth exploration of this Quranic ayah for a Muslim in the ${lifeStage || "any"} life stage.

${ayahContext}

${stageGuidanceBlock}

YOUR RESPONSE MUST INCLUDE ALL OF THE FOLLOWING (as flowing prose paragraphs):

1. OPENING (50+ words): A warm, personal greeting using "Salaam" or "Assalamu alaikum" that acknowledges this life stage's unique perspective. Draw them into the ayah.

2. AYAH CONTEXT (100+ words): Explain when this was revealed (Makki/Madani), the circumstances (asbab al-nuzul if known), and why this message mattered to the original audience.

3. DEEP MEANING (100+ words): Unpack the theological significance. What does this ayah reveal about Allah's nature, His guidance, or His instructions for believers?

4. LIFE STAGE APPLICATION (150+ words): Connect this ayah directly to the specific challenges, joys, fears, and hopes of someone in the ${lifeStage || "any"} life stage. Use specific, relatable scenarios. Make it personal and practical.

5. CLOSING WITH HOPE (100+ words): End with encouragement, a call to action, or a reminder of Allah's mercy that leaves them spiritually nourished.

TONE: Write as a warm, knowledgeable friend who happens to know their deen well. Not as an imam giving a khutbah. Conversational but respectful.

FORMATTING: 
- Flowing prose paragraphs ONLY
- NO markdown, NO headers, NO bullets
- Just beautiful, connected paragraphs

Include appropriate Islamic phrases: SubhanAllah, Alhamdulillah, InshaAllah, ﷺ after Prophet's name.

REMEMBER: MINIMUM 500 WORDS.`,
    })

    // Generate first story
    const story1Result = await generateObject({
      model: openrouterInstance(WRITER_MODEL),
      schema: storySchema,
      prompt: `Write a compelling modern-day story that brings this Quranic ayah to life for a Muslim in the ${lifeStage || "any"} life stage.

${ayahContext}

${stageGuidanceBlock}

STORY REQUIREMENTS:
- MINIMUM 750 words of flowing prose (NO markdown formatting)
- Main character MUST be a Muslim currently IN this life stage
- Contemporary setting (2024/2025) that feels authentic to their world
- Include realistic dialogue and emotional depth
- Show internal struggle and spiritual growth
- End with the ayah's truth transforming their situation
- Weave in a relevant hadith naturally if possible

CHARACTER GUIDELINES:
- Give them a Muslim name appropriate to their background
- Make their struggles realistic to this life stage
- Show how they turn to Allah/Quran in difficulty
- Include supporting characters (family, friends, community)

${getImageStyleGuidance(lifeStage)}
${imagePromptGuidance}

Include THREE image prompts:
1. image_prompt: A wide scene from a KEY MOMENT in the story
2. image_prompt_2: A different pivotal scene
3. card_image_prompt: An evocative thumbnail scene (NOT a face close-up)`,
    })

    // Generate second story (different scenario)
    const story2Result = await generateObject({
      model: openrouterInstance(WRITER_MODEL),
      schema: storySchema,
      prompt: `Write a DIFFERENT compelling modern-day story that brings this Quranic ayah to life for a Muslim in the ${lifeStage || "any"} life stage.

${ayahContext}

${stageGuidanceBlock}

THIS STORY MUST BE COMPLETELY DIFFERENT from other stories - different character, different setting, different situation, different cultural background.

STORY REQUIREMENTS:
- MINIMUM 750 words of flowing prose
- Main character MUST be a Muslim currently IN this life stage
- Different cultural/ethnic background than typical representations
- Contemporary setting that feels authentic
- Rich dialogue and emotional moments
- Show spiritual transformation through the ayah's message

${getImageStyleGuidance(lifeStage)}
${imagePromptGuidance}

Include THREE image prompts:
1. image_prompt: A wide scene from a KEY MOMENT
2. image_prompt_2: A different pivotal scene
3. card_image_prompt: An evocative thumbnail scene`,
    })

    // Generate first poem
    const poem1Result = await generateObject({
      model: openrouterInstance(WRITER_MODEL),
      schema: poemSchema,
      prompt: `Write a meaningful poem inspired by this Quranic ayah for a Muslim in the ${lifeStage || "any"} life stage.

${ayahContext}

${stageGuidanceBlock}

POEM REQUIREMENTS:
- 12-20 lines with clear rhythm and optional rhyme
- Speak directly to this life stage's journey, struggles, and hopes
- Use vivid imagery and metaphor
- May incorporate Islamic concepts: tawakkul, sabr, taqwa, dhikr
- End with hope or spiritual transformation
- Style can be free verse or nasheed-inspired

${getImageStyleGuidance(lifeStage)}
${imagePromptGuidance}

Include TWO image prompts:
1. image_prompt: A scene that captures the poem's essence
2. card_image_prompt: A symbolic/environmental thumbnail`,
    })

    // Generate second poem (different style)
    const poem2Result = await generateObject({
      model: openrouterInstance(WRITER_MODEL),
      schema: poemSchema,
      prompt: `Write a DIFFERENT meaningful poem inspired by this Quranic ayah for a Muslim in the ${lifeStage || "any"} life stage.

${ayahContext}

${stageGuidanceBlock}

THIS POEM MUST BE COMPLETELY DIFFERENT in tone, style, and imagery from other poems.

POEM REQUIREMENTS:
- 12-20 lines with clear rhythm
- Different style: if first was reflective, this could be uplifting; if first was personal, this could be cosmic
- Speak to this life stage's unique perspective
- Use vivid imagery and metaphor
- End with hope or transformation

${getImageStyleGuidance(lifeStage)}
${imagePromptGuidance}

Include TWO image prompts:
1. image_prompt: A scene that captures the poem's essence
2. card_image_prompt: A symbolic/environmental thumbnail`,
    })

    // Generate deep context
    const contextResult = await generateObject({
      model: openrouterInstance(RESEARCH_MODEL),
      schema: deepContextSchema,
      prompt: `Provide scholarly context for this Quranic ayah:

${ayahContext}

Research and provide:
1. speaker: Explain the chain of revelation (Allah → Jibreel → Prophet Muhammad ﷺ)
2. audience: Who were the original recipients when this was revealed?
3. why_revealed: What are the asbab al-nuzul (circumstances of revelation) if known? If not known, say so.
4. importance: What is the theological significance? Why is this ayah important in Islamic thought?
5. related_hadith: Provide ONE authentic hadith (preferably from Bukhari or Muslim) that illuminates this ayah. Include the narrator.
6. before_ayah: What comes before this ayah and how does it connect?
7. after_ayah: What comes after and how does it complete the message?
8. revelation_type: Is this Makki (before Hijrah) or Madani (after Hijrah)?
9. location: If known, where was the Prophet ﷺ when this was revealed?

Be scholarly but accessible. Use proper Islamic terminology.`,
    })

    // Generate reflection and dua
    const reflectionResult = await generateObject({
      model: openrouterInstance(WRITER_MODEL),
      schema: z.object({
        reflection_questions: z.array(z.string()),
        dua_suggestion: z.string(),
      }),
      prompt: `Create reflection questions and a dua for this Quranic ayah, personalized for someone in the ${lifeStage || "any"} life stage.

${ayahContext}

${stageGuidanceBlock}

REFLECTION QUESTIONS:
- Provide 3 thoughtful, honest questions
- Questions should be specific to this life stage's challenges
- Should prompt genuine self-reflection, not guilt
- Connect the ayah to daily life decisions

DUA SUGGESTION:
- Write a heartfelt dua (supplication) inspired by this ayah
- 2-4 sentences
- Can begin with "Ya Allah," or "Ya Rabb," or "O Allah,"
- Should feel personal and specific to this life stage
- End with "Ameen"`,
    })

    // Compile content
    const stories = [story1Result?.object, story2Result?.object].filter(Boolean)
    const poems = [poem1Result?.object, poem2Result?.object].filter(Boolean)

    const content = {
      conversational_intro: introResult?.object?.intro || "Assalamu alaikum! Let's explore this beautiful ayah together.",
      stories,
      poems,
      deep_context: contextResult?.object || {
        speaker: "Allah through Jibreel to Prophet Muhammad ﷺ",
        audience: "The believers",
        why_revealed: "Context unavailable",
        importance: "This ayah holds deep meaning for believers",
        related_hadith: "Further research recommended",
        before_ayah: "See Quran for full context",
        after_ayah: "See Quran for full context",
        revelation_type: surah.revelation_place === "makkah" ? "Makki" : "Madani",
      },
      life_stage_insights: { [lifeStage || "default"]: introResult?.object?.intro || "" },
      reflection_questions: reflectionResult?.object?.reflection_questions || [
        "What does this ayah reveal about Allah?",
        "How can I apply this in my life today?",
        "Who in my life needs to hear this message?",
      ],
      dua_suggestion: reflectionResult?.object?.dua_suggestion || 
        "Ya Allah, help me understand and live by Your words. Grant me guidance and strength. Ameen.",
      card_images: {},
    }

    await setCachedContent(cacheKey, content, lifeStage)

    console.log("[ILS] Content generation complete and cached")

    return content
  } catch (error) {
    console.error("[ILS] Error generating content:", error)
    throw error
  }
}

// Export for direct verse insights (used in quick preview)
export async function generateAyahInsights(ayah: Ayah, surah: Surah, lifeStage: any) {
  return generateAyahContent(ayah, surah, lifeStage?.id)
}
