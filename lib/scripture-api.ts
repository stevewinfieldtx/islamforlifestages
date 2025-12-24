/**
 * SCRIPTURE API
 * 
 * Abstraction layer that fetches scripture from the correct API
 * based on the religion config. Add new providers as needed.
 */

import { RELIGION } from "@/config/religion"
import type { Scripture, DailyScripture } from "./types"

// ============================================
// PROVIDER INTERFACES
// ============================================

interface ScriptureProvider {
  getVerse(chapter: number, verse: number): Promise<Scripture | null>
  getVerseRange(chapter: number, startVerse: number, endVerse: number): Promise<Scripture[]>
  getChapter(chapter: number): Promise<{ name: string; verses: number } | null>
  getRandomVerse(): Promise<Scripture | null>
  search(query: string): Promise<Scripture[]>
}

// ============================================
// QURAN.COM PROVIDER
// ============================================

const quranProvider: ScriptureProvider = {
  async getVerse(chapter, verse) {
    try {
      const response = await fetch(
        `${RELIGION.api.baseUrl}/verses/by_key/${chapter}:${verse}?translations=${RELIGION.api.translationId}&fields=text_uthmani`
      )
      if (!response.ok) return null
      
      const data = await response.json()
      const v = data.verse
      
      // Get chapter info
      const chapterRes = await fetch(`${RELIGION.api.baseUrl}/chapters/${chapter}`)
      const chapterData = await chapterRes.json()
      
      return {
        id: `${chapter}:${verse}`,
        reference: `${chapter}:${verse}`,
        originalText: v.text_uthmani,
        translation: v.translations?.[0]?.text || "",
        translationSource: RELIGION.api.translationName,
        chapter: {
          number: chapter,
          name: chapterData.chapter?.name_simple || `Chapter ${chapter}`,
          originalName: chapterData.chapter?.name_arabic,
        },
        verseNumber: verse,
        metadata: {
          juz: v.juz_number,
          hizb: v.hizb_number,
          page: v.page_number,
        },
      }
    } catch (error) {
      console.error("[Scripture API] Error fetching verse:", error)
      return null
    }
  },

  async getVerseRange(chapter, startVerse, endVerse) {
    try {
      const response = await fetch(
        `${RELIGION.api.baseUrl}/verses/by_chapter/${chapter}?translations=${RELIGION.api.translationId}&fields=text_uthmani&per_page=50`
      )
      if (!response.ok) return []
      
      const data = await response.json()
      
      // Get chapter info once
      const chapterRes = await fetch(`${RELIGION.api.baseUrl}/chapters/${chapter}`)
      const chapterData = await chapterRes.json()
      const chapterInfo = {
        number: chapter,
        name: chapterData.chapter?.name_simple || `Chapter ${chapter}`,
        originalName: chapterData.chapter?.name_arabic,
      }
      
      return data.verses
        .filter((v: any) => v.verse_number >= startVerse && v.verse_number <= endVerse)
        .map((v: any) => ({
          id: v.verse_key,
          reference: v.verse_key,
          originalText: v.text_uthmani,
          translation: v.translations?.[0]?.text || "",
          translationSource: RELIGION.api.translationName,
          chapter: chapterInfo,
          verseNumber: v.verse_number,
        }))
    } catch (error) {
      console.error("[Scripture API] Error fetching range:", error)
      return []
    }
  },

  async getChapter(chapter) {
    try {
      const response = await fetch(`${RELIGION.api.baseUrl}/chapters/${chapter}`)
      if (!response.ok) return null
      
      const data = await response.json()
      return {
        name: data.chapter.name_simple,
        verses: data.chapter.verses_count,
      }
    } catch (error) {
      console.error("[Scripture API] Error fetching chapter:", error)
      return null
    }
  },

  async getRandomVerse() {
    try {
      const response = await fetch(
        `${RELIGION.api.baseUrl}/verses/random?translations=${RELIGION.api.translationId}&fields=text_uthmani`
      )
      if (!response.ok) return null
      
      const data = await response.json()
      const v = data.verse
      const [chapterNum] = v.verse_key.split(":").map(Number)
      
      const chapterRes = await fetch(`${RELIGION.api.baseUrl}/chapters/${chapterNum}`)
      const chapterData = await chapterRes.json()
      
      return {
        id: v.verse_key,
        reference: v.verse_key,
        originalText: v.text_uthmani,
        translation: v.translations?.[0]?.text || "",
        translationSource: RELIGION.api.translationName,
        chapter: {
          number: chapterNum,
          name: chapterData.chapter?.name_simple || `Chapter ${chapterNum}`,
          originalName: chapterData.chapter?.name_arabic,
        },
        verseNumber: v.verse_number,
      }
    } catch (error) {
      console.error("[Scripture API] Error fetching random:", error)
      return null
    }
  },

  async search(query) {
    try {
      const response = await fetch(
        `${RELIGION.api.baseUrl}/search?q=${encodeURIComponent(query)}&translations=${RELIGION.api.translationId}`
      )
      if (!response.ok) return []
      
      const data = await response.json()
      return data.search.results.map((r: any) => ({
        id: r.verse_key,
        reference: r.verse_key,
        translation: r.text,
        translationSource: RELIGION.api.translationName,
        chapter: {
          number: parseInt(r.verse_key.split(":")[0]),
          name: "",
        },
        verseNumber: parseInt(r.verse_key.split(":")[1]),
      }))
    } catch (error) {
      console.error("[Scripture API] Error searching:", error)
      return []
    }
  },
}

// ============================================
// BIBLE API PROVIDER (for future use)
// ============================================

// const bibleProvider: ScriptureProvider = {
//   async getVerse(chapter, verse) { ... },
//   // etc.
// }

// ============================================
// PROVIDER REGISTRY
// ============================================

const providers: Record<string, ScriptureProvider> = {
  "quran.com": quranProvider,
  // "bible.api": bibleProvider,
  // "vedabase": vedabaseProvider,
}

// ============================================
// PUBLIC API
// ============================================

function getProvider(): ScriptureProvider {
  const provider = providers[RELIGION.api.provider]
  if (!provider) {
    throw new Error(`Unknown scripture provider: ${RELIGION.api.provider}`)
  }
  return provider
}

export async function getVerse(chapter: number, verse: number): Promise<Scripture | null> {
  return getProvider().getVerse(chapter, verse)
}

export async function getVerseRange(
  chapter: number,
  startVerse: number,
  endVerse: number
): Promise<Scripture[]> {
  return getProvider().getVerseRange(chapter, startVerse, endVerse)
}

export async function getChapter(chapter: number) {
  return getProvider().getChapter(chapter)
}

export async function getRandomVerse(): Promise<Scripture | null> {
  return getProvider().getRandomVerse()
}

export async function searchScripture(query: string): Promise<Scripture[]> {
  return getProvider().search(query)
}

// ============================================
// CURATED DAILY SCRIPTURES
// Rotate through high-impact verses
// ============================================

export async function getTodaysScripture(): Promise<DailyScripture | null> {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  // Cycle through example scriptures
  const examples = RELIGION.examples
  const todayExample = examples[dayOfYear % examples.length]
  
  const scripture = await getVerse(todayExample.chapter, todayExample.verse)
  if (!scripture) return null
  
  const chapterInfo = await getChapter(todayExample.chapter)
  
  return {
    date: today.toISOString().split("T")[0],
    scripture,
    chapterInfo: chapterInfo ? {
      totalVerses: chapterInfo.verses,
      theme: todayExample.description,
    } : undefined,
  }
}

// ============================================
// FORMAT HELPERS
// ============================================

export function formatReference(scripture: Scripture): string {
  const format = RELIGION.api.displayFormat
  return format
    .replace("{chapterName}", scripture.chapter.name)
    .replace("{chapter}", String(scripture.chapter.number))
    .replace("{verse}", String(scripture.verseNumber))
}

export function formatChapterVerse(chapter: number, verse: number): string {
  return RELIGION.api.referenceFormat
    .replace("{chapter}", String(chapter))
    .replace("{verse}", String(verse))
}
