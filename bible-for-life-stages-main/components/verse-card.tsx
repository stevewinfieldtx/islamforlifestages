import type { Verse } from "@/lib/types"
import { Share2, BookOpen } from "lucide-react"

export function VerseCard({ verse }: { verse: Verse }) {
  return (
    <div className="glass-card rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden group">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl group-hover:bg-primary-500/30 transition-all duration-700" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-primary-100 mb-6">
          <BookOpen className="w-3 h-3" />
          <span>Verse of the Day</span>
        </div>

        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight mb-8 text-shadow-sm">
          "{verse.text_esv}"
        </h1>

        <div className="flex flex-col items-center gap-4">
          <p className="text-xl font-medium tracking-wide text-primary-100">{verse.reference}</p>

          <div className="flex gap-4 mt-4">
            <a
              href={verse.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-sm font-medium flex items-center gap-2"
            >
              Read Full Chapter
            </a>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all">
              <Share2 className="w-5 h-5" />
              <span className="sr-only">Share Verse</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
