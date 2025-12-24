import { createClient } from "@/lib/supabase/server"
import type { GeneratedContent } from "./types"

// Content cached after Nov 25, 2025 will be considered fresh
const MIN_CACHE_DATE = new Date("2025-11-25T00:00:00Z")

export async function getCachedContent(verseReference: string, lifeStage?: string): Promise<GeneratedContent | null> {
  try {
    const supabase = await createClient()

    if (!lifeStage) {
      console.log(`[v0] Cache SKIP - no life stage provided for ${verseReference}`)
      return null
    }

    const { data, error } = await supabase
      .from("cached_content")
      .select("content, updated_at")
      .eq("verse_reference", verseReference)
      .eq("life_stage", lifeStage)
      .maybeSingle()

    if (error) {
      console.log(`[v0] Cache ERROR for ${verseReference} (${lifeStage}): ${error.message}`)
      return null
    }

    if (!data) {
      console.log(`[v0] Cache MISS for ${verseReference} (${lifeStage})`)
      return null
    }

    if (new Date(data.updated_at) < MIN_CACHE_DATE) {
      console.log(`[v0] Cache STALE for ${verseReference} (${lifeStage}) - refreshing content`)
      return null
    }

    console.log(`[v0] Cache HIT for ${verseReference} (${lifeStage}) - saving you money!`)
    return data.content as GeneratedContent
  } catch (error) {
    console.error("[v0] Error reading from cache:", error)
    return null
  }
}

export async function setCachedContent(
  verseReference: string,
  content: GeneratedContent,
  lifeStage: string, // Made required, not optional
): Promise<void> {
  try {
    if (!lifeStage) {
      console.error("[v0] Cannot cache content without life stage")
      return
    }

    const supabase = await createClient()

    const { error } = await supabase.from("cached_content").upsert(
      {
        verse_reference: verseReference,
        life_stage: lifeStage,
        content: content,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "verse_reference,life_stage",
      },
    )

    if (error) {
      console.error("[v0] Error caching content:", error.message)
    } else {
      console.log(`[v0] Cached content for ${verseReference} (${lifeStage}) in Supabase`)
    }
  } catch (error) {
    console.error("[v0] Error saving to cache:", error)
  }
}

export async function clearCache(): Promise<void> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("cached_content").delete().neq("id", "00000000-0000-0000-0000-000000000000") // Delete all

    if (error) {
      console.error("[v0] Error clearing cache:", error)
    } else {
      console.log("[v0] Cache cleared from Supabase")
    }
  } catch (error) {
    console.error("[v0] Error clearing cache:", error)
  }
}
