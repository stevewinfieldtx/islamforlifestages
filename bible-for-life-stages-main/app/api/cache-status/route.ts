import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("cached_content")
      .select("verse_reference, life_stage, updated_at, content")
      .order("updated_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const entries = data.map((row) => {
      const content = row.content as any
      const storyImagesCount = (content.stories || []).reduce((sum: number, story: any) => {
        return sum + (story.image_urls?.length || 0)
      }, 0)
      const poemImagesCount = (content.poems || []).filter((p: any) => p.image_url).length

      return {
        verse_reference: row.verse_reference,
        life_stage: row.life_stage,
        updated_at: row.updated_at,
        has_intro: !!content.conversational_intro,
        num_stories: content.stories?.length || 0,
        num_poems: content.poems?.length || 0,
        has_card_images: !!content.card_images,
        story_images_count: storyImagesCount,
        poem_images_count: poemImagesCount,
      }
    })

    const totalImages = entries.reduce((sum, entry) => {
      let count = entry.story_images_count + entry.poem_images_count
      if (entry.has_card_images) count += 3 // overview, context, prayer
      return sum + count
    }, 0)

    const stats = {
      total: entries.length,
      totalImages,
      oldestEntry: data[data.length - 1]?.updated_at || "",
      newestEntry: data[0]?.updated_at || "",
    }

    return NextResponse.json({ entries, stats })
  } catch (error) {
    console.error("Cache status error:", error)
    return NextResponse.json({ error: "Failed to fetch cache status" }, { status: 500 })
  }
}
