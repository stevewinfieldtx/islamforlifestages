/**
 * Quran.com API Wrapper
 * Free API for Quranic text, translations, and audio
 * Documentation: https://quran.api-docs.io/
 */

import type { Surah, Ayah, DailyAyah } from "./types"

const QURAN_API_BASE = "https://api.quran.com/api/v4"

// Default translation: Sahih International (131)
const DEFAULT_TRANSLATION = 131

// Alternative translations available:
// 20 = Saheeh International
// 85 = Abdul Haleem
// 84 = Mufti Taqi Usmani
// 203 = The Clear Quran (Mustafa Khattab)

interface QuranAPIVerse {
  id: number
  verse_number: number
  verse_key: string
  text_uthmani: string
  translations: Array<{
    id: number
    resource_id: number
    text: string
  }>
  juz_number: number
  hizb_number: number
  page_number: number
}

interface QuranAPIChapter {
  id: number
  name_arabic: string
  name_simple: string
  name_complex: string
  revelation_place: string
  verses_count: number
  translated_name: {
    name: string
    language_name: string
  }
}

/**
 * Get a specific ayah by surah and verse number
 */
export async function getAyah(
  surahNumber: number,
  verseNumber: number,
  translationId: number = DEFAULT_TRANSLATION
): Promise<Ayah | null> {
  try {
    const verseKey = `${surahNumber}:${verseNumber}`
    const response = await fetch(
      `${QURAN_API_BASE}/verses/by_key/${verseKey}?translations=${translationId}&fields=text_uthmani`
    )

    if (!response.ok) {
      console.error(`[Quran API] Error fetching ayah ${verseKey}:`, response.status)
      return null
    }

    const data = await response.json()
    const verse: QuranAPIVerse = data.verse

    return {
      id: verse.id,
      verse_number: verse.verse_number,
      verse_key: verse.verse_key,
      surah_id: surahNumber,
      text_arabic: verse.text_uthmani,
      text_translation: verse.translations[0]?.text || "",
      translation_name: "Sahih International",
      juz_number: verse.juz_number,
      hizb_number: verse.hizb_number,
      page_number: verse.page_number,
    }
  } catch (error) {
    console.error("[Quran API] Error:", error)
    return null
  }
}

/**
 * Get a range of ayahs from a surah
 */
export async function getAyahRange(
  surahNumber: number,
  startVerse: number,
  endVerse: number,
  translationId: number = DEFAULT_TRANSLATION
): Promise<Ayah[]> {
  try {
    const response = await fetch(
      `${QURAN_API_BASE}/verses/by_chapter/${surahNumber}?translations=${translationId}&fields=text_uthmani&per_page=${endVerse - startVerse + 1}&page=1`
    )

    if (!response.ok) {
      console.error("[Quran API] Error fetching ayah range:", response.status)
      return []
    }

    const data = await response.json()
    return data.verses
      .filter((v: QuranAPIVerse) => v.verse_number >= startVerse && v.verse_number <= endVerse)
      .map((verse: QuranAPIVerse) => ({
        id: verse.id,
        verse_number: verse.verse_number,
        verse_key: verse.verse_key,
        surah_id: surahNumber,
        text_arabic: verse.text_uthmani,
        text_translation: verse.translations[0]?.text || "",
        translation_name: "Sahih International",
        juz_number: verse.juz_number,
        hizb_number: verse.hizb_number,
        page_number: verse.page_number,
      }))
  } catch (error) {
    console.error("[Quran API] Error:", error)
    return []
  }
}

/**
 * Get surah information
 */
export async function getSurah(surahNumber: number): Promise<Surah | null> {
  try {
    const response = await fetch(`${QURAN_API_BASE}/chapters/${surahNumber}`)

    if (!response.ok) {
      console.error("[Quran API] Error fetching surah:", response.status)
      return null
    }

    const data = await response.json()
    const chapter: QuranAPIChapter = data.chapter

    return {
      id: chapter.id,
      name: chapter.name_simple,
      name_arabic: chapter.name_arabic,
      name_translation: chapter.translated_name.name,
      revelation_place: chapter.revelation_place.toLowerCase() as "makkah" | "madinah",
      verses_count: chapter.verses_count,
    }
  } catch (error) {
    console.error("[Quran API] Error:", error)
    return null
  }
}

/**
 * Get all surahs
 */
export async function getAllSurahs(): Promise<Surah[]> {
  try {
    const response = await fetch(`${QURAN_API_BASE}/chapters`)

    if (!response.ok) {
      console.error("[Quran API] Error fetching surahs:", response.status)
      return []
    }

    const data = await response.json()
    return data.chapters.map((chapter: QuranAPIChapter) => ({
      id: chapter.id,
      name: chapter.name_simple,
      name_arabic: chapter.name_arabic,
      name_translation: chapter.translated_name.name,
      revelation_place: chapter.revelation_place.toLowerCase() as "makkah" | "madinah",
      verses_count: chapter.verses_count,
    }))
  } catch (error) {
    console.error("[Quran API] Error:", error)
    return []
  }
}

/**
 * Get a random ayah (for daily verse feature)
 */
export async function getRandomAyah(translationId: number = DEFAULT_TRANSLATION): Promise<DailyAyah | null> {
  try {
    const response = await fetch(
      `${QURAN_API_BASE}/verses/random?translations=${translationId}&fields=text_uthmani`
    )

    if (!response.ok) {
      console.error("[Quran API] Error fetching random ayah:", response.status)
      return null
    }

    const data = await response.json()
    const verse: QuranAPIVerse = data.verse
    const surahNumber = parseInt(verse.verse_key.split(":")[0])

    // Get surah info
    const surah = await getSurah(surahNumber)
    if (!surah) return null

    const ayah: Ayah = {
      id: verse.id,
      verse_number: verse.verse_number,
      verse_key: verse.verse_key,
      surah_id: surahNumber,
      text_arabic: verse.text_uthmani,
      text_translation: verse.translations[0]?.text || "",
      translation_name: "Sahih International",
      juz_number: verse.juz_number,
      hizb_number: verse.hizb_number,
      page_number: verse.page_number,
    }

    return {
      date: new Date().toISOString().split("T")[0],
      ayah,
      surah,
    }
  } catch (error) {
    console.error("[Quran API] Error:", error)
    return null
  }
}

/**
 * Search the Quran
 */
export async function searchQuran(
  query: string,
  translationId: number = DEFAULT_TRANSLATION,
  page: number = 1,
  perPage: number = 10
): Promise<{ results: Ayah[]; total: number }> {
  try {
    const response = await fetch(
      `${QURAN_API_BASE}/search?q=${encodeURIComponent(query)}&translations=${translationId}&page=${page}&per_page=${perPage}`
    )

    if (!response.ok) {
      console.error("[Quran API] Error searching:", response.status)
      return { results: [], total: 0 }
    }

    const data = await response.json()
    const results = data.search.results.map((result: any) => ({
      id: result.verse_id,
      verse_number: parseInt(result.verse_key.split(":")[1]),
      verse_key: result.verse_key,
      surah_id: parseInt(result.verse_key.split(":")[0]),
      text_arabic: result.text,
      text_translation: result.translations?.[0]?.text || "",
      translation_name: "Sahih International",
      juz_number: 0,
      hizb_number: 0,
      page_number: 0,
    }))

    return {
      results,
      total: data.search.total_results,
    }
  } catch (error) {
    console.error("[Quran API] Error:", error)
    return { results: [], total: 0 }
  }
}

/**
 * Get audio recitation URL for an ayah
 * Default reciter: Mishary Rashid Alafasy (7)
 */
export function getAudioUrl(verseKey: string, reciterId: number = 7): string {
  return `https://verses.quran.com/${reciterId}/${verseKey.replace(":", "_")}.mp3`
}

/**
 * Curated daily verses - high-impact ayahs for each day
 * These are selected for their universal appeal and spiritual depth
 */
export const CURATED_DAILY_AYAHS = [
  { surah: 2, ayah: 255 },   // Ayat al-Kursi (The Throne Verse)
  { surah: 112, ayah: 1 },   // Al-Ikhlas (Sincerity) - complete surah starts
  { surah: 1, ayah: 1 },     // Al-Fatiha (The Opening)
  { surah: 2, ayah: 286 },   // End of Al-Baqarah - Allah does not burden...
  { surah: 3, ayah: 139 },   // Do not lose hope
  { surah: 94, ayah: 5 },    // With hardship comes ease
  { surah: 2, ayah: 152 },   // Remember Me, I will remember you
  { surah: 13, ayah: 28 },   // Hearts find rest in remembrance
  { surah: 29, ayah: 69 },   // Strive for Allah, He guides
  { surah: 3, ayah: 159 },   // Mercy and consultation
  { surah: 49, ayah: 13 },   // Created nations and tribes
  { surah: 16, ayah: 90 },   // Justice and kindness
  { surah: 23, ayah: 1 },    // Successful are the believers
  { surah: 31, ayah: 17 },   // Luqman's advice
  { surah: 55, ayah: 13 },   // Which favors will you deny?
  { surah: 93, ayah: 1 },    // Ad-Duha (The Morning Light)
  { surah: 103, ayah: 1 },   // Al-Asr (Time)
  { surah: 67, ayah: 1 },    // Al-Mulk (Sovereignty)
  { surah: 36, ayah: 1 },    // Ya-Sin
  { surah: 17, ayah: 23 },   // Honor parents
  { surah: 2, ayah: 177 },   // True righteousness
  { surah: 4, ayah: 135 },   // Stand for justice
  { surah: 5, ayah: 8 },     // Be just
  { surah: 41, ayah: 34 },   // Repel evil with good
  { surah: 64, ayah: 16 },   // Fear Allah as much as you can
  { surah: 25, ayah: 63 },   // Servants of the Most Merciful
  { surah: 73, ayah: 8 },    // Devote yourself to Him
  { surah: 39, ayah: 53 },   // Do not despair of Allah's mercy
  { surah: 65, ayah: 2 },    // Allah makes a way out (tawakkul)
  { surah: 9, ayah: 40 },    // Allah is with us
]

/**
 * Get today's curated ayah based on day of year
 */
export async function getTodaysAyah(): Promise<DailyAyah | null> {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 0)
  const diff = today.getTime() - startOfYear.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  // Cycle through curated verses
  const index = dayOfYear % CURATED_DAILY_AYAHS.length
  const { surah, ayah: verseNum } = CURATED_DAILY_AYAHS[index]

  const ayah = await getAyah(surah, verseNum)
  const surahInfo = await getSurah(surah)

  if (!ayah || !surahInfo) return null

  return {
    date: today.toISOString().split("T")[0],
    ayah,
    surah: surahInfo,
  }
}
