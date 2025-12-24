"use client"
import type { Verse } from "@/lib/types"
import { cn } from "@/lib/utils"

interface VerseCardProps {
  verse: Verse
  className?: string
}

export function VerseCard({ verse, className }: VerseCardProps) {
  return (
    <div className={cn("relative group", className)}>
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-teal-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-all duration-700" />

      <div className="relative glass-card rounded-3xl p-6 md:p-10 overflow-hidden">
        {/* Decorative stained glass corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full" />

        <div className="relative flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium tracking-wider uppercase backdrop-blur-sm">
            Today's Verse
          </div>

          <blockquote className="relative">
            <p className="font-serif text-2xl md:text-4xl lg:text-5xl leading-tight md:leading-tight text-amber-50">
              "{verse.text_esv}"
            </p>
          </blockquote>

          <div className="flex flex-col items-center gap-4 pt-2">
            <h2 className="font-serif text-xl md:text-2xl text-teal-300">{verse.reference}</h2>

            <div className="flex gap-3 pt-2">
              <a
                href={verse.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/20 text-blue-200 transition-all duration-300 text-sm font-medium active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Read on Bible.com
              </a>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: `Verse of the Day: ${verse.reference}`,
                        text: `"${verse.text_esv}" - ${verse.reference}`,
                        url: window.location.href,
                      })
                      .catch(console.error)
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-blue-100 transition-all duration-300 text-sm font-medium active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
