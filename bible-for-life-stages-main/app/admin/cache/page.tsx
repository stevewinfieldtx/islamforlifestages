"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CacheEntry {
  verse_reference: string
  life_stage: string
  updated_at: string
  has_intro: boolean
  num_stories: number
  num_poems: number
  has_card_images: boolean
  story_images_count: number
  poem_images_count: number
}

export default function CacheDashboard() {
  const [entries, setEntries] = useState<CacheEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, totalImages: 0, oldestEntry: "", newestEntry: "" })

  async function loadCache() {
    setLoading(true)
    try {
      const response = await fetch("/api/cache-status")
      const data = await response.json()
      setEntries(data.entries)
      setStats(data.stats)
    } catch (error) {
      console.error("Failed to load cache:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadCache()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">Cache Dashboard</h1>
          <Button onClick={loadCache} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="border-teal-500/20 bg-slate-800/50 p-6 backdrop-blur">
            <div className="text-sm text-slate-400">Total Cached Entries</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </Card>
          <Card className="border-teal-500/20 bg-slate-800/50 p-6 backdrop-blur">
            <div className="text-sm text-slate-400">Total Images Stored</div>
            <div className="text-3xl font-bold text-teal-400">{stats.totalImages}</div>
          </Card>
          <Card className="border-teal-500/20 bg-slate-800/50 p-6 backdrop-blur">
            <div className="text-sm text-slate-400">Oldest Entry</div>
            <div className="text-lg font-medium text-white">
              {stats.oldestEntry ? new Date(stats.oldestEntry).toLocaleDateString() : "N/A"}
            </div>
          </Card>
          <Card className="border-teal-500/20 bg-slate-800/50 p-6 backdrop-blur">
            <div className="text-sm text-slate-400">Newest Entry</div>
            <div className="text-lg font-medium text-white">
              {stats.newestEntry ? new Date(stats.newestEntry).toLocaleDateString() : "N/A"}
            </div>
          </Card>
        </div>

        <Card className="border-teal-500/20 bg-slate-800/50 backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-700 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3">Verse</th>
                  <th className="px-6 py-3">Life Stage</th>
                  <th className="px-6 py-3">Updated</th>
                  <th className="px-6 py-3">Content</th>
                  <th className="px-6 py-3">Images</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="px-6 py-4 font-medium text-white">{entry.verse_reference}</td>
                    <td className="px-6 py-4 text-slate-300">{entry.life_stage}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(entry.updated_at).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 text-xs">
                        {entry.has_intro && (
                          <span className="rounded bg-green-500/20 px-2 py-1 text-green-400">Intro</span>
                        )}
                        <span className="rounded bg-blue-500/20 px-2 py-1 text-blue-400">
                          {entry.num_stories} Stories
                        </span>
                        <span className="rounded bg-purple-500/20 px-2 py-1 text-purple-400">
                          {entry.num_poems} Poems
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 text-xs">
                        {entry.has_card_images && (
                          <span className="rounded bg-teal-500/20 px-2 py-1 text-teal-400">Cards</span>
                        )}
                        {entry.story_images_count > 0 && (
                          <span className="rounded bg-orange-500/20 px-2 py-1 text-orange-400">
                            {entry.story_images_count} Story
                          </span>
                        )}
                        {entry.poem_images_count > 0 && (
                          <span className="rounded bg-pink-500/20 px-2 py-1 text-pink-400">
                            {entry.poem_images_count} Poem
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
