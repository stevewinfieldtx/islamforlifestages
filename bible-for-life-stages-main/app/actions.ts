"use server"

import { generateObject, generateText } from "ai"
import type { Verse } from "@/lib/types"
import { z } from "zod"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { getCachedContent, setCachedContent } from "@/lib/cache"
import { openrouter } from "@/lib/openrouter"
import { generateImageWithSDK, generateImagesParallel } from "@/lib/runware"

const WRITER_MODEL = process.env.OPENROUTER_WRITER_MODEL || "anthropic/claude-3-opus"
const RESEARCH_MODEL = process.env.OPENROUTER_RESEARCH_MODEL || "openai/gpt-4-turbo-preview"
const PROMPT_MODEL = process.env.OPENROUTER_PROMPT_MODEL || "anthropic/claude-3.5-sonnet"

const RUNWARE_API_KEY = process.env.RUNWARE_API_KEY
const RUNWARE_MODEL_ID = process.env.RUNWARE_MODEL_ID || "runware:100@1"

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const READING_LEVEL_GUIDANCE: Record<string, string> = {
  youth: `
READING LEVEL: 3rd Grade (Ages 6-12)
- Use simple, short sentences (8-12 words average)
- Use common, everyday words a child would know
- Avoid abstract concepts - use concrete, tangible examples
- Explain any harder words in context
- Use dialogue and action to tell stories
- Keep paragraphs very short (2-3 sentences)`,

  teens: `
READING LEVEL: 6th Grade (Ages 13-17)
- Use clear, direct sentences
- Some complex vocabulary is okay but keep it accessible
- Can include abstract concepts if explained well
- Use relatable examples from teen life
- Keep paragraphs moderate length (3-5 sentences)`,

  university: `
READING LEVEL: 9th Grade (Ages 18-22)
- More sophisticated vocabulary and sentence structure
- Can explore nuanced ideas and concepts
- Include intellectual depth appropriate for college students
- Balance accessibility with academic rigor`,

  default: `
READING LEVEL: 12th Grade (Adult)
- Full vocabulary range appropriate
- Can include complex theological and philosophical concepts
- Nuanced, mature language and themes
- Assume adult life experience and comprehension`,
}

function getReadingLevelGuidance(lifeStageId: string): string {
  return READING_LEVEL_GUIDANCE[lifeStageId] || READING_LEVEL_GUIDANCE.default
}

const LIFE_STAGE_INSTRUCTIONS: Record<string, string> = {
  youth: `
LIFE STAGE: Youth (6-12)
Language & Tone: Use simple, warm language that a child can understand. Be encouraging and gentle. Use short sentences and familiar words.
Application Focus: Friendship, being kind, telling the truth, obeying parents, feeling scared or worried, making good choices, helping others, feeling left out.
Examples: Playground situations, classroom moments, sibling conflicts, bedtime fears, sharing toys, making friends, trying new things, dealing with bullies.
Developmental: Concrete thinking, learning right from wrong, developing empathy, seeking approval, building foundational understanding of faith.`,

  teens: `
LIFE STAGE: Teenagers (13-18)
Language & Tone: Use authentic, straightforward language that doesn't talk down to them. Avoid being preachy or overly simplistic. Be honest about complexity while providing clarity.
Application Focus: Identity formation, peer pressure, social media dynamics, dating, body image, academic pressure, future uncertainty, conflict with parents, finding purpose.
Examples: High school dynamics, part-time jobs, sports, college apps, romantic relationships, friend drama, balancing responsibilities.
Developmental: Questioning beliefs, seeking independence, highly influenced by peers, intense emotions, forming identity.`,

  university: `
LIFE STAGE: University (19-24)
Language & Tone: Use intellectually engaging language that respects growing critical thinking. Address doubts and complexity. Acknowledge tension between faith and secular environments.
Application Focus: Faith deconstruction/reconstruction, intellectual doubts, living independently, romance/sexuality, career discernment, financial stress, finding community.
Examples: Dorm life, challenging professors, late-night talks, internships, dating, roommate conflicts, choosing majors, graduation anxiety.
Developmental: Significant identity formation, exploring ideologies, establishing independence, making consequential decisions.`,

  "newly-married": `
LIFE STAGE: Newly Married
Language & Tone: Warm, relational language affirming marriage while being honest about challenges. Avoid idealization.
Application Focus: Communication, managing conflict, blending lives/families, financial decisions, maintaining individual identity, spiritual maturity differences.
Examples: Money disagreements, in-laws, communication styles, housing decisions, dating, balancing couple time with friends, household responsibilities.
Developmental: Identity shift, prioritizing spouse, navigating dating vs daily life, establishing relationship foundation.`,

  "new-parents": `
LIFE STAGE: New Parents
Language & Tone: Compassionate, grace-filled language acknowledging exhaustion. Practical and concise. Encouraging without adding guilt.
Application Focus: Minimal sleep, feeling inadequate, reduced personal time, marriage dynamics, worry/anxiety, balancing work/parenting.
Examples: 2 AM feedings, tantrums, daycare, loss of spontaneity, isolation, mom/dad-shaming, financial strain.
Developmental: Sleep deprivation, identity restructuring, financial pressure, strained marriage dynamics, unexpected emotional challenges.`,

  divorced: `
LIFE STAGE: Newly Divorced
Language & Tone: Gentle, non-judgmental, compassionate. Acknowledge pain without minimizing. Create space for honest emotions.
Application Focus: Grief/loss, failure/shame, financial hardship, single parenting, rebuilding identity, anger/bitterness, finding community.
Examples: Co-parenting conversations, explaining to kids, attending events alone, holidays, financial struggles, feeling awkward at church.
Developmental: Processing trauma, rebuilding life, financial crisis, social stigma, theological wrestling.`,

  "empty-nesting": `
LIFE STAGE: Empty Nesting
Language & Tone: Reflective, transitional language acknowledging loss and opportunity. Honor grief while celebrating the new chapter.
Application Focus: Rediscovering identity, reconnecting with spouse, new purpose, quiet house, worry about adult kids, aging parents.
Examples: Quiet dinner table, resisting over-involvement, rediscovering hobbies, reconnecting as a couple, sandwich generation pressures.
Developmental: Identity transition, grieving active parenting end, marital strain or rediscovery, reimagining purpose.`,

  senior: `
LIFE STAGE: Retired (65+)
Language & Tone: Respectful, dignified language honoring wisdom. Avoid condescension. Recognize need for purpose.
Application Focus: Purpose beyond career, stewarding legacy, health challenges, loss, fixed income, changing family roles, mortality.
Examples: Retirement routines, grandparenting, losing friends/spouse, health conditions, downsizing, finding ways to serve.
Developmental: Identity shifts, health challenges, processing grief, managing fears of dependency, wrestling with legacy.`,
}

const storySchema = z.object({
  title: z.string(),
  content: z.string().describe("The full story - MUST be at least 750 words, approximately 1000 tokens"),
  image_prompt: z.string(),
  image_prompt_2: z.string().describe("A second scene from a different moment in the story"),
  card_image_prompt: z.string().describe("A brief, evocative scene for the card thumbnail (one sentence)"),
})

const poemSchema = z.object({
  title: z.string(),
  content: z.string(),
  image_prompt: z.string(),
  card_image_prompt: z.string().describe("A brief, evocative scene for the card thumbnail (one sentence)"),
})

const deepContextSchema = z.object({
  speaker: z.string(),
  audience: z.string(),
  why_said: z.string(),
  importance: z.string(),
  success: z.string(),
  before_verse: z.string(),
  after_verse: z.string(),
  location: z.string(),
  location_coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
})

// The image prompts are already detailed enough from the story/poem generation
async function generateImage(prompt: string): Promise<string | undefined> {
  try {
    const imageUrl = await generateImageWithSDK(prompt)
    console.log("[v0] generateImage returning URL:", imageUrl ? imageUrl.substring(0, 60) + "..." : "undefined")
    return imageUrl
  } catch (error) {
    console.error("[v0] Error generating image:", error)
    return undefined
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, name: string): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`${name} timed out after ${timeoutMs}ms`)), timeoutMs),
  )
  return Promise.race([promise, timeoutPromise])
}

async function safeGenerateObject<T>(
  options: Parameters<typeof generateObject>[0],
  retries = 2,
  name = "generateObject",
  timeoutMs = 300000,
): Promise<{ object: T } | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await withTimeout(generateObject(options), timeoutMs, name)
      console.log(`[v0] ${name} succeeded`)
      return result as { object: T }
    } catch (error) {
      console.error(
        `[v0] ${name} failed (attempt ${attempt}/${retries}):`,
        error instanceof Error ? error.message : error,
      )
      if (attempt === retries) {
        console.error(`[v0] ${name} all retries exhausted, returning null`)
        return null
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }
  return null
}

async function safeGenerateText(
  options: Parameters<typeof generateText>[0],
  retries = 2,
  name = "generateText",
  timeoutMs = 300000,
): Promise<{ text: string } | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await withTimeout(generateText(options), timeoutMs, name)
      console.log(`[v0] ${name} succeeded`)
      return result
    } catch (error) {
      console.error(
        `[v0] ${name} failed (attempt ${attempt}/${retries}):`,
        error instanceof Error ? error.message : error,
      )
      if (attempt === retries) {
        console.error(`[v0] ${name} all retries exhausted, returning null`)
        return null
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }
  return null
}

function getAgeAppropriateGuardrail(lifeStage?: string): string {
  const stageLabel = lifeStage ? `${lifeStage} life stage` : "each life stage"
  return `AGE APPROPRIATENESS: All responses must be suitable for ${stageLabel}, avoiding mature themes or romantic focus when inappropriate. Every example and application should directly address the real concerns, hopes, and fears of that stage without introducing content they shouldn't see.`
}

function getImageStyleGuidance(lifeStage?: string): string {
  switch (lifeStage) {
    case "youth":
      return `IMAGE STYLE: Yu-Gi-Oh!-style kid-friendly anime with bold lines, saturated colors, energetic poses, and clearly non-romantic interactions.`
    case "teens":
      return `IMAGE STYLE: Modern anime aesthetic with clean line art, cinematic lighting, expressive but wholesome characters, and zero suggestive framing.`
    default:
      return `IMAGE STYLE: Ultra-realistic, natural lighting, lifelike textures, documentary-style authenticity while remaining wholesome.`
  }
}

const imagePromptGuidance = `
IMAGE PROMPT REQUIREMENTS - DESCRIBE ONLY WHAT YOU WANT TO SEE:

=== COMPOSITION (MANDATORY) ===
- Wide establishing shot showing vast environment
- Single person shown small in the frame, full body visible head to toe
- 80% of image is background/setting (landscape, architecture, nature)
- Camera positioned far from subject
- Landscape or environmental photography style

=== SUBJECT PLACEMENT ===
- One person alone in the scene
- Subject occupies less than 20% of frame
- Full body always visible with space above head and below feet
- Person engaged in solitary activity

=== ENVIRONMENT FOCUS ===
- Expansive landscapes: mountains, fields, oceans, forests, city skylines
- Architectural spaces: cathedrals, libraries, empty hallways, vast rooms
- Natural settings: gardens, paths, shorelines, meadows
- Weather and atmosphere: fog, rain, sunset light, morning mist

=== EXAMPLE PROMPTS (COPY THIS STYLE) ===
* "Wide shot of empty church sanctuary, single elderly person sitting in distant pew, stained glass windows towering above, morning light streaming through, vast wooden ceiling"
* "Expansive wheat field at golden hour, lone child running toward distant farmhouse, sky fills upper two-thirds of frame"
* "Aerial view of winding forest path, single hiker small on trail below, autumn canopy stretching to horizon"
* "Grand library interior, towering bookshelves reaching cathedral ceiling, one student at tiny desk in center of vast reading room"
* "Ocean shoreline at dawn, single figure walking away from camera toward distant lighthouse, waves and sand dominate frame"

=== DESCRIBE THE PLACE, THEN ADD ONE PERSON ===
Start with the environment, then place a single small figure within it.
`

function getRenderStyle(lifeStage?: string): string {
  switch (lifeStage) {
    case "youth":
      return "Yu-Gi-Oh!-style anime illustration, bold outlines, saturated colors, energetic action, child-safe content"
    case "teens":
      return "modern anime illustration, clean line art, cinematic but wholesome composition, expressive yet modest characters"
    default:
      return "ultra-realistic photographic rendering, natural lighting, lifelike textures, documentary-style authenticity"
  }
}

function createDetailedImagePrompt(
  basePrompt: string,
  type: "scene" | "card" | "poem" | "prayer",
  lifeStage?: string,
): string {
  const styleGuides = {
    scene:
      "cinematic wide shot, dramatic lighting, rich atmospheric perspective, emotional storytelling moment, film still quality",
    card: "storybook cover scene with environmental focus, medium or wide composition, symbolic objects, respectful distance between any people, warm inviting colors, gentle focus, no close-up faces",
    poem: "ethereal dreamlike atmosphere, painterly style, soft diffused light, emotional depth, fine art quality",
    prayer:
      "serene contemplative scene, golden hour lighting, peaceful atmosphere, spiritual warmth, meditation imagery",
  }

  const stageStyle = getRenderStyle(lifeStage)

  return `${basePrompt}, ${stageStyle}, ${styleGuides[type]}, masterful digital art, highly detailed`
}

export async function generateVerseContent(verse: Verse, lifeStage?: string) {
  const cached = await getCachedContent(verse.reference, lifeStage)
  if (cached) {
    return cached
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing. Please add it to your environment variables.")
  }

  const openrouterInstance = createOpenRouter({
    apiKey: apiKey,
  })

  try {
    const lifeStageInstructions =
      lifeStage && LIFE_STAGE_INSTRUCTIONS[lifeStage] ? LIFE_STAGE_INSTRUCTIONS[lifeStage] : ""

    const readingLevelGuidance = getReadingLevelGuidance(lifeStage || "default")

    const ageAppropriateGuardrail = getAgeAppropriateGuardrail(lifeStage)

    const stageGuidanceBlock = [lifeStageInstructions, readingLevelGuidance, ageAppropriateGuardrail]
      .filter(Boolean)
      .join("\n\n")

    console.log(`[v0] Starting content generation for ${verse.reference}${lifeStage ? ` (${lifeStage})` : ""}`)

    const [introResult, story1Result, story2Result, poem1Result, poem2Result] = await Promise.all([
      safeGenerateObject<{ intro: string }>(
        {
          model: openrouterInstance(WRITER_MODEL),
          schema: z.object({
            intro: z.string(),
          }),
          prompt: `CRITICAL LENGTH REQUIREMENT: Your response MUST be AT LEAST 500 WORDS. Count your words - if under 500, keep writing. This is NON-NEGOTIABLE.

Write a comprehensive, in-depth theological and personal exploration of ${verse.reference} - "${verse.text_esv}" for someone in the ${lifeStage || "any"} life stage.

${stageGuidanceBlock}

YOUR RESPONSE MUST INCLUDE ALL OF THE FOLLOWING (each as flowing prose paragraphs):

1. OPENING (50+ words): A warm, personal greeting that acknowledges this life stage's unique perspective and draws them into the verse.

2. VERSE CONTEXT (100+ words): Explain the historical and biblical context - who wrote this, to whom, what was happening at the time, and why this message mattered to its original audience.

3. DEEP MEANING (100+ words): Unpack the theological significance - what does this verse reveal about God's character, His promises, or His instructions? Explore the deeper spiritual truths.

4. LIFE STAGE APPLICATION (150+ words): Connect this verse directly to the specific challenges, joys, fears, and hopes of someone in the ${lifeStage || "any"} life stage. Use specific, relatable scenarios they would actually face. Make it personal and practical.

5. CLOSING ENCOURAGEMENT (100+ words): End with hope, comfort, or a call to action that leaves them feeling spiritually nourished and equipped.

FORMATTING RULES:
- Write as flowing prose paragraphs ONLY
- NO markdown (no ###, no **, no bullets, no numbered lists)
- NO section headers or labels in your output
- Just beautiful, connected paragraphs

REMEMBER: MINIMUM 500 WORDS. If you write less, you have failed the task.`,
        },
        2,
        "intro",
        300000,
      ),
      safeGenerateObject<{
        story: {
          title: string
          content: string
          image_prompt: string
          image_prompt_2: string
          card_image_prompt: string
        }
      }>(
        {
          model: openrouterInstance(WRITER_MODEL),
          schema: z.object({
            story: z.object({
              title: z.string(),
              content: z.string(),
              image_prompt: z.string(),
              image_prompt_2: z.string(),
              card_image_prompt: z.string(),
            }),
          }),
          prompt: `Write a compelling modern-day story that brings ${verse.reference} - "${verse.text_esv}" to life for someone in the ${lifeStage || "any"} life stage.

${stageGuidanceBlock}

Story Requirements:
- MINIMUM 563-750 words of flowing prose (750+ tokens) - NO markdown formatting (no ### headings, no **bold**, no bullet points, no section labels)
- Main character MUST be someone currently IN this life stage experiencing its specific challenges
- Write as narrative prose with natural paragraph breaks, like a short story in a book
- Setting must feel authentic to this life stage's world
- Include rich dialogue and emotional moments
- Develop the character's internal journey and transformation
- End with hope and the verse's truth transforming the situation
- MATCH THE READING LEVEL EXACTLY - use appropriate vocabulary and sentence complexity

${getImageStyleGuidance(lifeStage)}

${imagePromptGuidance}

Include THREE image prompts based on the rules above:
1. image_prompt: A wide or environmental shot of a KEY SCENE from the story - show the character in their setting doing something meaningful (2-3 sentences describing the scene, NOT a portrait)
2. image_prompt_2: A different pivotal SCENE from the story showing action or environment (2-3 sentences describing the scene, NOT a portrait)
3. card_image_prompt: An evocative scene for the thumbnail - environment, objects, or symbolic imagery (1 sentence, NOT a face close-up)`,
        },
        2,
        "story1",
        300000,
      ),
      safeGenerateObject<{
        story: {
          title: string
          content: string
          image_prompt: string
          image_prompt_2: string
          card_image_prompt: string
        }
      }>(
        {
          model: openrouterInstance(WRITER_MODEL),
          schema: z.object({
            story: z.object({
              title: z.string(),
              content: z.string(),
              image_prompt: z.string(),
              image_prompt_2: z.string(),
              card_image_prompt: z.string(),
            }),
          }),
          prompt: `Write a DIFFERENT compelling modern-day story that brings ${verse.reference} - "${verse.text_esv}" to life for someone in the ${lifeStage || "any"} life stage.

${stageGuidanceBlock}

Story Requirements:
- MINIMUM 563-750 words of flowing prose (750+ tokens) - NO markdown formatting (no ### headings, no **bold**, no bullet points, no section labels)
- This must be completely different from other stories - different character, different setting, different situation
- Main character MUST be someone currently IN this life stage experiencing its specific challenges
- Write as narrative prose with natural paragraph breaks, like a short story in a book
- Setting must feel authentic to this life stage's world
- Include rich dialogue and emotional moments
- Develop the character's internal journey and transformation
- End with hope and the verse's truth transforming the situation
- MATCH THE READING LEVEL EXACTLY - use appropriate vocabulary and sentence complexity

${getImageStyleGuidance(lifeStage)}

${imagePromptGuidance}

Include THREE image prompts based on the rules above:
1. image_prompt: A wide or environmental shot of a KEY SCENE from the story - show the character in their setting doing something meaningful (2-3 sentences describing the scene, NOT a portrait)
2. image_prompt_2: A different pivotal SCENE from the story showing action or environment (2-3 sentences describing the scene, NOT a portrait)
3. card_image_prompt: An evocative scene for the thumbnail - environment, objects, or symbolic imagery (1 sentence, NOT a face close-up)`,
        },
        2,
        "story2",
        300000,
      ),
      safeGenerateObject<{
        poem: { title: string; content: string; image_prompt: string; card_image_prompt: string }
      }>(
        {
          model: openrouterInstance(WRITER_MODEL),
          schema: z.object({
            poem: z.object({
              title: z.string(),
              content: z.string(),
              image_prompt: z.string(),
              card_image_prompt: z.string(),
            }),
          }),
          prompt: `Write a meaningful poem inspired by ${verse.reference} - "${verse.text_esv}" for someone in the ${lifeStage || "any"} life stage.

${stageGuidanceBlock}

Poem Requirements:
- 12-20 lines, with clear rhythm and optional rhyme
- Speak directly to this life stage's journey, struggles, and hopes
- Use vivid imagery and metaphor
- End with hope or transformation
- Do NOT use markdown formatting

${getImageStyleGuidance(lifeStage)}

${imagePromptGuidance}

Include TWO image prompts based on the rules above:
1. image_prompt: A wide, environmental, full-body scene that captures the poem's essence (NOT a portrait or close-up)
2. card_image_prompt: A symbolic or environmental scene for the thumbnail (NOT a face)`,
        },
        2,
        "poem1",
        300000,
      ),
      safeGenerateObject<{
        poem: { title: string; content: string; image_prompt: string; card_image_prompt: string }
      }>(
        {
          model: openrouterInstance(WRITER_MODEL),
          schema: z.object({
            poem: z.object({
              title: z.string(),
              content: z.string(),
              image_prompt: z.string(),
              card_image_prompt: z.string(),
            }),
          }),
          prompt: `Write a DIFFERENT meaningful poem inspired by ${verse.reference} - "${verse.text_esv}" for someone in the ${lifeStage || "any"} life stage.

${stageGuidanceBlock}

Poem Requirements:
- 12-20 lines, with clear rhythm and optional rhyme
- This must be completely different in tone, style, and imagery from other poems
- Speak directly to this life stage's journey, struggles, and hopes
- Use vivid imagery and metaphor
- End with hope or transformation
- Do NOT use markdown formatting

${getImageStyleGuidance(lifeStage)}

${imagePromptGuidance}

Include TWO image prompts based on the rules above:
1. image_prompt: A wide, environmental, full-body scene that captures the poem's essence (NOT a portrait or close-up)
2. card_image_prompt: A symbolic or environmental scene for the thumbnail (NOT a face)`,
        },
        2,
        "poem2",
        300000,
      ),
    ])

    console.log("[v0] First batch complete (intro, story1, story2, poem1, poem2)")

    const storiesResult = {
      object: {
        stories: [story1Result?.object?.story, story2Result?.object?.story].filter(Boolean),
      },
    }

    const poemsResult = {
      object: {
        poems: [poem1Result?.object?.poem, poem2Result?.object?.poem].filter(Boolean),
      },
    }

    const [contextResult, reflectionResult] = await Promise.all([
      safeGenerateObject<any>(
        {
          model: openrouterInstance(RESEARCH_MODEL),
          schema: deepContextSchema,
          prompt: `You're sharing fascinating background about this Bible verse with a friend: ${verse.reference} - "${verse.text_esv}"

Tell the story behind this verse in a warm, engaging way - think storytelling, not textbook. Use vivid details, help us picture the scene, make the people real.

Share about:
1. Speaker/Writer: Who's talking here? What kind of person were they? What was going on in their life?
2. Audience: Who's listening? What were they going through? Why did they need to hear this?
3. Why Said: What prompted this exact moment? What was happening that made these words necessary right then?
4. Importance: Why did this matter so much? What was at stake? How did this change things?
5. Success: How did people respond? Did it work? What happened because of these words?
6. Before: Paint the picture - what was happening leading up to this moment? Set the scene for us.
7. After: Zoom out to the bigger story - what ripples did this create? How did this shape what came next in God's larger story? What did it set in motion beyond just the immediate aftermath? Think big picture - redemption, history, God's people.
8. Location: Where did this go down? Give us the ancient place name and enough detail to find it on a map if it's a real location.

Be conversational, vivid, and help us feel like we're there. Make the history come alive, not like a textbook but like a great story someone's sharing.`,
        },
        2,
        "context",
      ),
      safeGenerateObject<{ reflection_questions: string[]; prayer_suggestion: string }>(
        {
          model: openrouterInstance(WRITER_MODEL),
          schema: z.object({
            reflection_questions: z.array(z.string()).length(3),
            prayer_suggestion: z.string(),
          }),
          prompt: `For ${verse.reference}${lifeStage ? ` speaking to someone in the ${lifeStage} life stage` : ""}, create:
1. 3 deep, searching reflection questions that invite honest self-examination${lifeStage ? ` relevant to ${lifeStage} experiences` : ""}
2. A simple, heartfelt prayer (2-3 sentences) - authentic and vulnerable`,
        },
        2,
        "reflection",
      ),
    ])

    console.log("[v0] Second batch complete (context, reflection)")

    let insightResult = { text: "" }
    if (lifeStage) {
      try {
        insightResult = await safeGenerateText(
          {
            model: openrouterInstance(WRITER_MODEL),
            prompt: `Write a specific, relatable application of ${verse.reference} - "${verse.text_esv}" for someone in the ${lifeStage} life stage.

${stageGuidanceBlock}

Be conversational and avoid assumptions about where they are in their journey. Speak to the ongoing reality of that stage using the tone defined above.

Write 150-200 words, warm and specific to that stage's ongoing challenges.`,
          },
          2,
          "insight",
        )
      } catch (err) {
        console.error("[v0] Insight generation failed, skipping:", err)
      }
    }

    console.log("[v0] All text content generated successfully")

    console.log("[v0] Generating card images...")
    const cardImages = await generateMultipleImages(
      [
        `Abstract spiritual scene representing an overview and introduction to ${verse.reference}, warm welcoming colors, soft light`,
        `Ancient biblical setting representing historical context of ${verse.reference}, scrolls, ancient architecture, warm tones`,
      ],
      lifeStage,
    )

    // Collect all image prompts
    const storyImagePrompts: string[] = []
    for (const story of storiesResult.object.stories) {
      storyImagePrompts.push(createDetailedImagePrompt(story.image_prompt, "scene", lifeStage))
      storyImagePrompts.push(createDetailedImagePrompt(story.image_prompt_2, "scene", lifeStage))
      storyImagePrompts.push(
        createDetailedImagePrompt(
          `${story.title} - story card thumbnail, cinematic scene from the story`,
          "card",
          lifeStage,
        ),
      )
    }

    const poemImagePrompts: string[] = []
    for (const poem of poemsResult.object.poems) {
      poemImagePrompts.push(createDetailedImagePrompt(poem.image_prompt, "poem", lifeStage))
      poemImagePrompts.push(
        createDetailedImagePrompt(`${poem.title} - poetry card thumbnail, ethereal artistic scene`, "card", lifeStage),
      )
    }

    const prayerPrompt = `Peaceful meditation scene representing prayer and reflection on ${verse.reference}, soft light, contemplative atmosphere`

    // Generate all content images sequentially
    const allPrompts = [
      ...storyImagePrompts,
      ...poemImagePrompts,
      createDetailedImagePrompt(prayerPrompt, "prayer", lifeStage),
    ]
    console.log(`[v0] Generating ${allPrompts.length} content images...`)

    const allImages = await generateMultipleImages(allPrompts, lifeStage)

    console.log("[v0] All images generated")

    const storiesWithImages = storiesResult.object.stories.map((story: any, idx: number) => ({
      ...story,
      image_urls: [allImages[idx * 3], allImages[idx * 3 + 1]].filter(Boolean) as string[],
      card_image_url: allImages[idx * 3 + 2],
    }))

    const poemsWithImages = poemsResult.object.poems.map((poem: any, idx: number) => ({
      ...poem,
      image_url: allImages[6 + idx * 2],
      card_image_url: allImages[6 + idx * 2 + 1],
    }))

    const life_stage_insights: any = {}
    if (lifeStage && insightResult) {
      life_stage_insights[lifeStage] = insightResult.text
    }

    const intro = introResult?.object?.intro || "Welcome to today's verse reflection."
    const context = contextResult?.object || {
      speaker: "Unknown",
      audience: "Unknown",
      why_said: "Context unavailable",
      importance: "This verse holds deep meaning",
      success: "Unknown",
      before_verse: "Unknown",
      after_verse: "Unknown",
      location: "Unknown",
    }
    const reflection = reflectionResult?.object || {
      reflection_questions: [
        "What does this verse mean to you?",
        "How can you apply this today?",
        "Who might need to hear this?",
      ],
      prayer_suggestion: "Lord, help me understand and live out your word. Amen.",
    }

    const content = {
      conversational_intro: intro,
      stories: storiesWithImages,
      poems: poemsWithImages,
      deep_context: context,
      life_stage_insights,
      reflection_questions: reflection.reflection_questions,
      prayer_suggestion: reflection.prayer_suggestion,
      card_images: {
        overview: cardImages[0],
        context: cardImages[1],
        prayer: allImages[allImages.length - 1],
      },
    }

    console.log("[v0] Card images in content:", content.card_images)

    await setCachedContent(verse.reference, content, lifeStage)

    console.log("[v0] Content generation complete and cached")

    return content
  } catch (error) {
    console.error("[v0] Error generating content:", error)
    throw error
  }
}

const insightSchema = z.object({
  conversational_intro: z.string(),
  historical_context: z.string(),
  modern_application: z.string(),
  life_stage_insight: z.string(),
  reflection_questions: z.array(z.string()),
  prayer_suggestion: z.string(),
})

export async function generateVerseInsights(verse: Verse, lifeStage: any) {
  try {
    const lifeStageInstructions =
      lifeStage.id && LIFE_STAGE_INSTRUCTIONS[lifeStage.id] ? LIFE_STAGE_INSTRUCTIONS[lifeStage.id] : ""

    const readingLevelGuidance = getReadingLevelGuidance(lifeStage.id || "default")

    const ageAppropriateGuardrail = getAgeAppropriateGuardrail(lifeStage.id)

    const stageGuidanceBlock = [lifeStageInstructions, readingLevelGuidance, ageAppropriateGuardrail]
      .filter(Boolean)
      .join("\n\n")

    const prompt = `Generate warm, conversational content for ${verse.reference} - "${verse.text_esv}"
    
Target: ${lifeStage.label}
Context: ${stageGuidanceBlock}

Themes: ${lifeStage.themes.join(", ")}
Tone: ${lifeStage.tone}

Warm, real, vulnerable tone. Speak as a friend. Not preachy.

1. conversational_intro: Relatable hook (80-100 words)
2. historical_context: Brief context (40-50 words)
3. modern_application: 2025/2026 relevance
4. life_stage_insight: Specific to ${lifeStage.label} using the context above
5. reflection_questions: 3 honest questions
6. prayer_suggestion: Simple prayer (1-2 sentences)`

    const { object } = await generateObject({
      model: openrouter(WRITER_MODEL),
      schema: insightSchema,
      prompt,
    })

    return { success: true, data: object }
  } catch (error) {
    console.error("Error generating insights:", error)
    return {
      success: false,
      data: {
        conversational_intro: "Take a moment to read this verse slowly and let it speak to you.",
        historical_context: "This verse comes from a rich historical context of God's faithfulness.",
        modern_application: "In our fast-paced world, this truth calls us to pause and reflect.",
        life_stage_insight: `Consider how this applies to your life as a ${lifeStage.label}.`,
        reflection_questions: [
          "What does this reveal about God?",
          "How can I live this out today?",
          "Who needs to hear this?",
        ],
        prayer_suggestion: "Lord, help me understand and live out your word. Amen.",
      },
    }
  }
}

async function generateMultipleImages(prompts: string[], lifeStage?: string): Promise<string[]> {
  console.log(`[v0] Generating ${prompts.length} images in parallel...`)
  const results = await generateImagesParallel(prompts, 10, lifeStage)
  return results.map((url) => url || "")
}
