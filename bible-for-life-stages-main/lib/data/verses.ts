import type { Verse } from "../types"

// Based on the provided schedule starting Nov 22, 2025
export const plannedVerses: Verse[] = [
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
  {
    date: "2025-12-01",
    reference: "Psalms 121:5",
    text_esv: "The Lord watches over you—the Lord is your shade at your right hand",
    url: "https://bible.com/bible/111/PSA.121.5",
  },
  // Adding placeholders/repeats to ensure we have data for logic testing if needed,
  // but keeping the specific dates mentioned in the prompt
  {
    date: "2025-12-25",
    reference: "Isaiah 9:6",
    text_esv:
      "For to us a child is born, to us a son is given, and the government will be on his shoulders. And he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.",
    url: "https://bible.com/bible/111/ISA.9.6",
  },
  {
    date: "2026-01-01",
    reference: "Isaiah 43:18-19",
    text_esv:
      "Forget the former things; do not dwell on the past. See, I am doing a new thing! Now it springs up; do you not perceive it?",
    url: "https://bible.com/bible/111/ISA.43.18-19",
  },
  {
    date: "2026-02-19",
    reference: "Hebrews 12:11",
    text_esv:
      "No discipline seems pleasant at the time, but painful. Later on, however, it produces a harvest of righteousness and peace for those who have been trained by it.",
    url: "https://bible.com/bible/111/HEB.12.11",
  },
]

export function getVerseForDate(dateStr: string): Verse {
  // Try to find exact match
  const exactMatch = plannedVerses.find((v) => v.date === dateStr)
  if (exactMatch) return exactMatch

  // If no exact match, cycle through available verses based on day of year
  const date = new Date(dateStr)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
  const index = dayOfYear % plannedVerses.length

  return plannedVerses[index]
}

export function getCurrentDateString(): string {
  const now = new Date()
  return now.toISOString().split("T")[0]
}
