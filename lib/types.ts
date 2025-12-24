/**
 * GENERIC TYPES
 * 
 * These types work for ANY religion.
 * They use generic terms that get mapped to religion-specific terms via config.
 */

// ============================================
// SCRIPTURE TYPES
// ============================================

/**
 * A single verse/ayah/shloka from any scripture
 */
export interface Scripture {
  id: string
  reference: string           // "2:255" or "John 3:16" or "BG 2.47"
  
  // The actual text
  originalText?: string       // Arabic, Hebrew, Sanskrit, etc.
  translation: string
  translationSource: string   // "Sahih International", "NIV", etc.
  
  // Chapter/Book info
  chapter: {
    number: number
    name: string              // "Al-Baqarah", "Genesis", "Bhagavad Gita"
    originalName?: string     // Original language name
  }
  
  // Verse position
  verseNumber: number
  
  // Metadata
  metadata?: {
    juz?: number              // Islam: Quran division
    hizb?: number             // Islam: Quran subdivision
    testament?: string        // Christianity: Old/New
    book?: string             // Various: Book name
    page?: number
  }
}

/**
 * Daily scripture with chapter context
 */
export interface DailyScripture {
  date: string                // YYYY-MM-DD
  scripture: Scripture
  chapterInfo?: {
    totalVerses: number
    theme?: string
    period?: string           // Makki/Madani, Pre-exile, etc.
  }
}

// ============================================
// LIFE STAGE TYPES
// ============================================

export interface LifeStage {
  id: string
  label: string
  description: string
  themes: string[]
  tone: string
  readingLevel?: string
}

// ============================================
// GENERATED CONTENT TYPES
// ============================================

export interface Story {
  id: string
  title: string
  content: string             // 750+ words
  relatedTeaching?: string    // Hadith, Midrash, etc.
  imagePrompt?: string
  imageUrl?: string
}

export interface Poem {
  id: string
  title: string
  content: string
  style?: string              // "free-verse", "nasheed", "hymn"
  imagePrompt?: string
  imageUrl?: string
}

export interface DeepContext {
  source: string              // Who wrote/revealed this
  audience: string            // Original recipients
  historicalContext: string   // What was happening
  significance: string        // Why it matters theologically
  relatedTeachings: string    // Connected texts (hadith, commentary)
  beforeVerse: string         // Context from before
  afterVerse: string          // Context from after
}

export interface GeneratedContent {
  // Core content
  friendlyBreakdown: string   // Conversational exploration (500+ words)
  stories: Story[]            // 2 modern stories
  poems: Poem[]               // 2 poems
  
  // Context
  context: DeepContext
  
  // Reflection
  reflectionQuestions: string[]  // 3 questions
  prayerSuggestion: string       // Dua/Prayer/Meditation
  
  // For specific life stage
  lifeStageId: string
  lifeStageInsight: string
  
  // Metadata
  generatedAt: string
  scriptureReference: string
}

// ============================================
// USER TYPES
// ============================================

export interface UserProfile {
  id: string
  email: string
  lifeStageId: string
  
  // Preferences
  language: string
  showOriginalText: boolean
  
  // Location (for prayer times, etc.)
  location?: {
    latitude: number
    longitude: number
    timezone: string
  }
  
  // Subscription
  subscription: {
    status: "free" | "trial" | "premium" | "expired"
    expiresAt?: string
  }
  
  createdAt: string
}

// ============================================
// PRAYER TIMES (Optional Feature)
// ============================================

export interface PrayerTimes {
  date: string
  location: {
    latitude: number
    longitude: number
    timezone: string
    name?: string
  }
  times: {
    name: string              // "Fajr", "Shacharit", etc.
    time: string              // "05:30"
    isMainPrayer: boolean     // Distinguish prayer vs sunrise
  }[]
  calculationMethod?: string
}

// ============================================
// DIRECTION FINDER (Qibla, Jerusalem, etc.)
// ============================================

export interface DirectionData {
  targetName: string          // "Kaaba", "Jerusalem", etc.
  targetCoordinates: {
    latitude: number
    longitude: number
  }
  fromCoordinates: {
    latitude: number
    longitude: number
  }
  bearing: number             // Degrees from North
  distance: number            // Kilometers
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// ============================================
// GENERATION PROGRESS
// ============================================

export interface GenerationProgress {
  step: string
  progress: number            // 0-100
  message: string
}

// ============================================
// CACHE TYPES
// ============================================

export interface CacheEntry {
  key: string
  content: GeneratedContent
  lifeStageId: string
  createdAt: string
  expiresAt: string
}
