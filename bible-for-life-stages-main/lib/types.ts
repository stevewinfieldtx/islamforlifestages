export type LifeStageId =
  | "youth"
  | "teens"
  | "university"
  | "adult"
  | "newly-married"
  | "new-parents"
  | "empty-nesting"
  | "divorced"
  | "senior"

export interface LifeStage {
  id: LifeStageId
  label: string
  description: string
  themes: string[]
  tone: string
}

export interface Verse {
  date: string // YYYY-MM-DD format
  reference: string
  text_esv: string
  url: string
}

export interface Story {
  title: string
  content: string // 750 tokens minimum
  image_prompt: string
  card_image_prompt?: string // Added for card thumbnail
  image_urls?: string[] // 2 images per story
  card_image_url?: string // Added for card thumbnail image
}

export interface Poem {
  title: string
  content: string
  image_prompt: string
  card_image_prompt?: string // Added for card thumbnail
  image_url?: string
  card_image_url?: string // Added for card thumbnail image
}

export interface DeepContext {
  speaker: string
  audience: string
  why_said: string
  importance: string
  success: string
  before_verse: string
  after_verse: string
}

export interface LifeStageInsights {
  [key: string]: string
  youth: string
  teens: string
  university: string
  adult: string
  "newly-married": string
  "new-parents": string
  "empty-nesting": string
  divorced: string
  senior: string
}

export interface CardImages {
  overview?: string
  context?: string
  prayer?: string
}

export interface GeneratedContent {
  conversational_intro: string // 500+ tokens, like two friends talking
  stories: Story[] // 2 stories
  poems: Poem[] // 2 poems
  deep_context: DeepContext
  life_stage_insights: LifeStageInsights
  reflection_questions: string[]
  prayer_suggestion: string
  location?: any // Placeholder since LocationResearch interface is removed
  card_images?: CardImages // Added for card background images
}

export interface AIInsights {
  conversational_intro: string
  historical_context: string
  modern_application: string
  life_stage_insight: string
  reflection_questions: string[]
  prayer_suggestion: string
}

export interface GenerationProgress {
  step: string
  progress: number // 0-100
  message: string
}
