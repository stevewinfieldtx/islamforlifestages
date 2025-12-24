/**
 * AI PROMPTS
 * 
 * Generates AI prompts dynamically based on religion config.
 * No hardcoded religion references - everything comes from config.
 */

import { RELIGION } from "@/config/religion"
import type { Scripture, LifeStage, GeneratedContent } from "./types"

// ============================================
// READING LEVEL GUIDANCE
// ============================================

function getReadingLevel(lifeStage: LifeStage): string {
  const level = lifeStage.readingLevel || "adult"
  
  const levels: Record<string, string> = {
    "3rd grade": `
Use simple, short sentences (8-12 words average).
Use common, everyday words a child would know.
Explain any special terms simply.
Keep paragraphs very short (2-3 sentences).`,
    
    "6th grade": `
Use clear, direct sentences.
Some vocabulary is okay but keep it accessible.
Use relatable examples.
Keep paragraphs moderate length (3-5 sentences).`,
    
    "9th grade": `
More sophisticated vocabulary and sentence structure.
Can explore nuanced ideas.
Include intellectual depth.`,
    
    "adult": `
Full vocabulary range.
Can include complex theological and philosophical concepts.
Assume life experience and general religious knowledge.`,
  }
  
  return levels[level] || levels["adult"]
}

// ============================================
// SCRIPTURE CONTEXT BLOCK
// ============================================

function buildScriptureContext(scripture: Scripture): string {
  const t = RELIGION.terms
  
  return `
${t.scripture.toUpperCase()}: ${scripture.chapter.name}${scripture.chapter.originalName ? ` (${scripture.chapter.originalName})` : ""} - ${t.verse} ${scripture.verseNumber}
Reference: ${scripture.reference}
${scripture.originalText ? `Original Text: ${scripture.originalText}` : ""}
Translation: "${scripture.translation}"
Translation Source: ${scripture.translationSource}
`.trim()
}

// ============================================
// LIFE STAGE CONTEXT BLOCK
// ============================================

function buildLifeStageContext(lifeStage: LifeStage): string {
  return `
LIFE STAGE: ${lifeStage.label}
Description: ${lifeStage.description}
Key Themes: ${lifeStage.themes.join(", ")}
Tone: ${lifeStage.tone}

READING LEVEL:
${getReadingLevel(lifeStage)}
`.trim()
}

// ============================================
// SYSTEM PROMPT
// ============================================

export function getSystemPrompt(): string {
  const t = RELIGION.terms
  const ai = RELIGION.ai
  
  return `
You are creating spiritual content for ${t.followerPlural}.

${ai.systemContext}

${ai.avoidance}

TONE:
${ai.tone}
`.trim()
}

// ============================================
// FRIENDLY BREAKDOWN PROMPT
// ============================================

export function getFriendlyBreakdownPrompt(
  scripture: Scripture,
  lifeStage: LifeStage
): string {
  const t = RELIGION.terms
  
  return `
Write a comprehensive, warm exploration of this ${t.verse.toLowerCase()} for someone in the "${lifeStage.label}" life stage.

${buildScriptureContext(scripture)}

${buildLifeStageContext(lifeStage)}

YOUR RESPONSE MUST INCLUDE (as flowing prose paragraphs, 500+ words total):

1. OPENING (50+ words): A warm greeting using "${t.greeting}" that acknowledges their life stage. Draw them into the ${t.verse.toLowerCase()}.

2. CONTEXT (100+ words): Explain when/why this was written, the circumstances, and why it mattered to the original audience.

3. DEEP MEANING (100+ words): What does this ${t.verse.toLowerCase()} reveal about ${t.god}'s nature, guidance, or instructions?

4. LIFE STAGE APPLICATION (150+ words): Connect this directly to the specific challenges, joys, and hopes of someone who is "${lifeStage.label}". Use specific, relatable scenarios.

5. CLOSING (100+ words): End with hope, encouragement, or a call to action. Close with "${t.closingBlessing}".

FORMATTING:
- Flowing prose paragraphs ONLY
- NO markdown, NO headers, NO bullets
- Just beautiful, connected paragraphs

Write as a warm, knowledgeable friend, not as a ${t.teacher} giving a lecture.
`.trim()
}

// ============================================
// STORY PROMPT
// ============================================

export function getStoryPrompt(
  scripture: Scripture,
  lifeStage: LifeStage,
  storyNumber: 1 | 2
): string {
  const t = RELIGION.terms
  
  const uniqueness = storyNumber === 2
    ? "This must be COMPLETELY DIFFERENT from the first story - different character, setting, cultural background, and situation."
    : ""
  
  return `
Write a compelling modern-day story that brings this ${t.verse.toLowerCase()} to life for a ${t.follower} in the "${lifeStage.label}" life stage.

${buildScriptureContext(scripture)}

${buildLifeStageContext(lifeStage)}

${uniqueness}

STORY REQUIREMENTS:
- MINIMUM 750 words of flowing prose
- Main character is a ${t.follower} currently in the "${lifeStage.label}" stage
- Contemporary setting (2024/2025) that feels authentic
- Include realistic dialogue and emotional depth
- Show internal struggle and spiritual growth
- End with the ${t.verse.toLowerCase()}'s truth transforming their situation
- Weave in relevant teachings naturally if appropriate

CHARACTER:
- Give them an appropriate name
- Make their struggles realistic for this life stage
- Show how they turn to ${t.god} / ${t.holyBook} in difficulty

Write as prose narrative, like a short story in a book.
NO markdown formatting.
`.trim()
}

// ============================================
// POEM PROMPT
// ============================================

export function getPoemPrompt(
  scripture: Scripture,
  lifeStage: LifeStage,
  poemNumber: 1 | 2
): string {
  const t = RELIGION.terms
  
  const style = poemNumber === 2
    ? "Use a DIFFERENT style than the first poem - if that was reflective, make this uplifting; if that was personal, make this cosmic."
    : ""
  
  return `
Write a meaningful poem inspired by this ${t.verse.toLowerCase()} for a ${t.follower} in the "${lifeStage.label}" life stage.

${buildScriptureContext(scripture)}

${buildLifeStageContext(lifeStage)}

${style}

POEM REQUIREMENTS:
- 12-20 lines with clear rhythm
- Optional rhyme (not required)
- Speak to this life stage's journey, struggles, and hopes
- Use vivid imagery and metaphor
- End with hope or transformation

NO markdown formatting.
`.trim()
}

// ============================================
// CONTEXT PROMPT
// ============================================

export function getContextPrompt(scripture: Scripture): string {
  const t = RELIGION.terms
  
  return `
Provide scholarly context for this ${t.verse.toLowerCase()}:

${buildScriptureContext(scripture)}

Provide the following (be accurate and cite sources when possible):

1. SOURCE: Who wrote/revealed this and through what means?
2. AUDIENCE: Who were the original recipients?
3. HISTORICAL CONTEXT: What was happening when this was revealed/written?
4. SIGNIFICANCE: Why is this ${t.verse.toLowerCase()} important theologically?
5. RELATED TEACHINGS: What other texts (commentary, teachings) illuminate this?
6. BEFORE: What comes before this and how does it connect?
7. AFTER: What comes after and how does it complete the message?

Be scholarly but accessible. Use proper terminology for ${RELIGION.name}.
`.trim()
}

// ============================================
// REFLECTION PROMPT
// ============================================

export function getReflectionPrompt(
  scripture: Scripture,
  lifeStage: LifeStage
): string {
  const t = RELIGION.terms
  
  return `
Create reflection questions and a ${t.prayer.toLowerCase()} for this ${t.verse.toLowerCase()}, personalized for someone in the "${lifeStage.label}" life stage.

${buildScriptureContext(scripture)}

${buildLifeStageContext(lifeStage)}

REFLECTION QUESTIONS:
- Provide 3 thoughtful, honest questions
- Questions should be specific to "${lifeStage.label}" challenges
- Should prompt genuine self-reflection, not guilt
- Connect the ${t.verse.toLowerCase()} to daily life decisions

${t.prayer.toUpperCase()} SUGGESTION:
- Write a heartfelt ${t.prayer.toLowerCase()} inspired by this ${t.verse.toLowerCase()}
- 2-4 sentences
- Should feel personal and specific to this life stage
- End with "${t.closingBlessing}"
`.trim()
}

// ============================================
// IMAGE PROMPT HELPERS
// ============================================

export function getImageStyleGuidance(): string {
  return `
IMAGE STYLE:
- Respectful, dignified imagery appropriate for ${RELIGION.name}
- Beautiful architectural elements, nature, calligraphy
- Avoid close-up faces
- Focus on scenes, environments, and symbolic imagery
- Wide establishing shots
- ${RELIGION.ai.avoidance}
`.trim()
}
