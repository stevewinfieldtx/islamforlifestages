// Life Stage Types
export type LifeStageId =
  | "youth"
  | "teens"
  | "university"
  | "new-muslim"
  | "newly-married"
  | "new-parents"
  | "ramadan"
  | "hajj-prep"
  | "empty-nesting"
  | "divorced"
  | "senior"
  | "seeking"

export interface LifeStage {
  id: LifeStageId
  label: string
  description: string
  themes: string[]
  tone: string
}

// Quran Types
export interface Surah {
  id: number // 1-114
  name: string // English name
  name_arabic: string // Arabic name
  name_translation: string // Meaning of name
  revelation_place: "makkah" | "madinah"
  verses_count: number
}

export interface Ayah {
  id: number
  verse_number: number
  verse_key: string // e.g., "2:255"
  surah_id: number
  text_arabic: string
  text_translation: string // English translation
  translation_name: string // e.g., "Sahih International"
  juz_number: number
  hizb_number: number
  page_number: number
}

export interface DailyAyah {
  date: string // YYYY-MM-DD format
  ayah: Ayah
  surah: Surah
}

// Hadith Types
export interface Hadith {
  id: string
  collection: string // e.g., "Sahih Bukhari", "Sahih Muslim"
  book: string
  number: string
  text_arabic?: string
  text_english: string
  narrator: string
  grade: "sahih" | "hasan" | "daif" | "unknown"
}

// Prayer Times Types
export interface PrayerTimes {
  date: string
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  timezone: string
}

export interface PrayerSettings {
  method: number // Calculation method (1-15)
  school: 0 | 1 // 0 = Shafi, 1 = Hanafi
  latitude: number
  longitude: number
  timezone: string
}

// Qibla Types
export interface QiblaData {
  latitude: number
  longitude: number
  direction: number // Degrees from North
  distance: number // Distance to Kaaba in km
}

// Content Generation Types (matching BLS structure)
export interface Story {
  title: string
  content: string // 750 tokens minimum
  hadith_reference?: string // Optional hadith connection
  image_prompt: string
  card_image_prompt?: string
  image_urls?: string[]
  card_image_url?: string
}

export interface Poem {
  title: string
  content: string
  style?: "free-verse" | "nasheed-inspired" | "classical"
  image_prompt: string
  card_image_prompt?: string
  image_url?: string
  card_image_url?: string
}

export interface DeepContext {
  speaker: string // Who revealed/transmitted
  audience: string // Original recipients
  why_revealed: string // Asbab al-Nuzul
  importance: string // Theological significance
  related_hadith: string // Supporting hadith
  before_ayah: string // Context before
  after_ayah: string // Context after
  revelation_type: "makki" | "madani"
  location?: string
}

export interface LifeStageInsights {
  [key: string]: string
}

export interface CardImages {
  overview?: string
  context?: string
  prayer?: string
}

export interface GeneratedContent {
  conversational_intro: string // Friendly breakdown
  stories: Story[] // 2 stories
  poems: Poem[] // 2 poems
  deep_context: DeepContext
  related_hadith: Hadith[] // Supporting ahadith
  life_stage_insights: LifeStageInsights
  reflection_questions: string[]
  dua_suggestion: string // Prayer/supplication
  card_images?: CardImages
}

export interface AIInsights {
  conversational_intro: string
  historical_context: string
  modern_application: string
  life_stage_insight: string
  reflection_questions: string[]
  dua_suggestion: string
}

export interface GenerationProgress {
  step: string
  progress: number // 0-100
  message: string
}

// User Types
export interface UserProfile {
  id: string
  email: string
  life_stage: LifeStageId
  prayer_settings?: PrayerSettings
  language: string
  created_at: string
  subscription_status: "free" | "trial" | "premium"
}

// Calculation Method Reference
export const CALCULATION_METHODS = {
  1: "University of Islamic Sciences, Karachi",
  2: "Islamic Society of North America (ISNA)",
  3: "Muslim World League",
  4: "Umm Al-Qura University, Makkah",
  5: "Egyptian General Authority of Survey",
  7: "Institute of Geophysics, University of Tehran",
  8: "Gulf Region",
  9: "Kuwait",
  10: "Qatar",
  11: "Majlis Ugama Islam Singapura",
  12: "Union Organization Islamic de France",
  13: "Diyanet İşleri Başkanlığı, Turkey",
  14: "Spiritual Administration of Muslims of Russia",
  15: "Moonsighting Committee Worldwide",
} as const

export type CalculationMethod = keyof typeof CALCULATION_METHODS
