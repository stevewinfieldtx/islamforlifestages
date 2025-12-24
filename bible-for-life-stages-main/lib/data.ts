import type { LifeStage, Verse } from "./types"

export const LIFE_STAGES: LifeStage[] = [
  {
    id: "teens",
    label: "Teens (13-17)",
    description: "Navigating identity, peer pressure, and future choices.",
    themes: ["identity", "peer pressure", "future", "acceptance"],
  },
  {
    id: "university",
    label: "University (18-22)",
    description: "Exploring independence, faith ownership, and career.",
    themes: ["independence", "doubt", "purpose", "relationships"],
  },
  {
    id: "newly-married",
    label: "Newly Married",
    description: "Building a foundation of unity and shared life.",
    themes: ["unity", "communication", "finances", "intimacy"],
  },
  {
    id: "new-parents",
    label: "New Parents",
    description: "Balancing exhaustion with the joy of raising children.",
    themes: ["patience", "responsibility", "legacy", "exhaustion"],
  },
  {
    id: "empty-nesting",
    label: "Empty Nesting",
    description: "Rediscovering purpose after children leave home.",
    themes: ["transition", "identity", "wisdom", "letting go"],
  },
  {
    id: "divorced",
    label: "Divorced",
    description: "Finding healing, wholeness, and new beginnings.",
    themes: ["healing", "forgiveness", "hope", "restoration"],
  },
  {
    id: "senior",
    label: "Senior (65+)",
    description: "Reflecting on a life well-lived and leaving a legacy.",
    themes: ["legacy", "peace", "heaven", "reflection"],
  },
]

// A subset of the 90-day schedule for demonstration, plus logic to cycle
export const VERSE_SCHEDULE: Verse[] = [
  {
    date: "2025-11-22",
    reference: "Colossians 4:2",
    text_esv: "Devote yourselves to prayer, being watchful and thankful.",
    url: "https://bible.com/bible/111/COL.4.2",
  },
  {
    date: "2025-11-23",
    reference: "Psalm 23:4",
    text_esv:
      "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
    url: "https://bible.com/bible/111/PSA.23.4",
  },
  {
    date: "2025-11-24",
    reference: "Matthew 10:20",
    text_esv: "For it will not be you speaking, but the Spirit of your Father speaking through you.",
    url: "https://www.bible.com/bible/111/MAT.10.20",
  },
  {
    date: "2025-11-25",
    reference: "Luke 6:38",
    text_esv:
      "Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap.",
    url: "https://bible.com/bible/111/LUK.6.38",
  },
  {
    date: "2025-11-26",
    reference: "Psalm 68:19",
    text_esv: "Praise be to the Lord, to God our Savior, who daily bears our burdens.",
    url: "https://bible.com/bible/111/PSA.68.19",
  },
  {
    date: "2025-11-27",
    reference: "Psalm 9:1",
    text_esv: "I will give thanks to you, Lord, with all my heart; I will tell of all your wonderful deeds.",
    url: "https://bible.com/bible/111/PSA.9.1",
  },
  {
    date: "2025-11-28",
    reference: "John 8:32",
    text_esv: "Then you will know the truth, and the truth will set you free.",
    url: "https://bible.com/bible/111/JHN.8.32",
  },
  {
    date: "2025-11-29",
    reference: "Isaiah 12:2",
    text_esv: "Surely God is my Salvation, I will trust and not be afraid",
    url: "https://bible.com/bible/111/ISA.12.2",
  },
  {
    date: "2025-11-30",
    reference: "Matthew 24:42",
    text_esv: "Therefore keep watch, because you do not know on what day your Lord will come.",
    url: "https://bible.com/bible/111/MAT.24.42",
  },
  // ... fallback/cycling logic will reuse these if we run out or dates don't match
]

export function getDailyVerse(): Verse {
  const today = new Date().toISOString().split("T")[0]

  // 1. Try to find exact date match
  const exactMatch = VERSE_SCHEDULE.find((v) => v.date === today)
  if (exactMatch) return exactMatch

  // 2. Fallback: Cycle based on day of year to ensure we always have a verse
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24,
  )
  return VERSE_SCHEDULE[dayOfYear % VERSE_SCHEDULE.length]
}
