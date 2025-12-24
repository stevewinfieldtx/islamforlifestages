/**
 * RELIGION CONFIGURATION
 * 
 * This is the ONLY file you change to create a new religion version.
 * Everything else in the app reads from this config.
 * 
 * To create "Hindu for Life Stages": copy this file, change the values, deploy.
 */

export const RELIGION = {
  // ============================================
  // IDENTITY
  // ============================================
  id: "islam",
  name: "Islam for Life Stages",
  shortName: "Islam",
  tagline: "Daily Quranic guidance personalized for your season of life",
  description: "Stories, poetry, context, and reflections that speak to where you are right now.",
  
  // ============================================
  // TERMINOLOGY
  // Used throughout the app to display correct terms
  // ============================================
  terms: {
    scripture: "Quran",
    scripturePlural: "Quran",
    verse: "Ayah",
    versePlural: "Ayat",
    chapter: "Surah",
    chapterPlural: "Surahs",
    god: "Allah",
    godPossessive: "Allah's",
    prayer: "Dua",
    prayerVerb: "make dua",
    greeting: "Assalamu alaikum",
    closingBlessing: "Ameen",
    holyBook: "Quran",
    follower: "Muslim",
    followerPlural: "Muslims",
    teacher: "Imam",
    houseOfWorship: "Mosque",
  },

  // ============================================
  // BRANDING / THEME
  // Colors use Tailwind color names
  // ============================================
  theme: {
    primary: "emerald",
    secondary: "teal", 
    accent: "gold",
    background: {
      gradient: "from-emerald-950 via-slate-900 to-slate-950",
      solid: "#022c22",
    },
    text: {
      primary: "emerald-100",
      secondary: "teal-200",
      muted: "teal-300/60",
    },
    // Hex values for CSS variables
    colors: {
      primary: "#10b981",
      primaryDark: "#059669",
      secondary: "#14b8a6",
      accent: "#f59e0b",
      background: "#022c22",
    },
  },

  // ============================================
  // SCRIPTURE API CONFIGURATION
  // ============================================
  api: {
    provider: "quran.com",
    baseUrl: "https://api.quran.com/api/v4",
    translationId: 131, // Sahih International
    translationName: "Sahih International",
    // How to construct verse references
    referenceFormat: "{chapter}:{verse}", // e.g., "2:255"
    displayFormat: "{chapterName} {verse}", // e.g., "Al-Baqarah 255"
  },

  // ============================================
  // LIFE STAGES
  // Each religion has unique life stages
  // ============================================
  lifeStages: [
    {
      id: "youth",
      label: "Youth (6-12)",
      description: "Children learning foundational Islamic concepts through stories",
      themes: ["love for Allah", "kindness", "honesty", "honoring parents", "learning to pray", "Ramadan"],
      tone: "warm, simple, encouraging, using familiar examples from school and family",
      readingLevel: "3rd grade",
    },
    {
      id: "teens",
      label: "Teens (13-17)",
      description: "Young Muslims navigating identity, peer pressure, and faith",
      themes: ["Muslim identity", "peer pressure", "modesty", "social media", "purpose"],
      tone: "authentic, relatable, not preachy, honest about challenges",
      readingLevel: "6th grade",
    },
    {
      id: "university",
      label: "University (18-24)",
      description: "College students maintaining faith in secular environments",
      themes: ["intellectual challenges", "halal lifestyle", "career", "marriage thoughts", "community"],
      tone: "intellectually engaging, practical, respects critical thinking",
      readingLevel: "9th grade",
    },
    {
      id: "new-believer",
      label: "New to Islam",
      description: "Recent converts learning the basics and finding community",
      themes: ["learning salah", "family reactions", "finding community", "lifestyle changes", "joy of discovery"],
      tone: "welcoming, patient, encouraging, never assumes knowledge",
      readingLevel: "adult",
    },
    {
      id: "newly-married",
      label: "Newly Married",
      description: "Couples building their home and growing together in faith",
      themes: ["halal home", "communication", "in-laws", "praying together", "finances"],
      tone: "supportive, practical, celebrates marriage while being honest",
      readingLevel: "adult",
    },
    {
      id: "new-parents",
      label: "New Parents",
      description: "Parents raising children while balancing responsibilities",
      themes: ["raising Muslim children", "patience", "teaching by example", "exhaustion", "Islamic parenting"],
      tone: "compassionate, acknowledges exhaustion, grace-filled",
      readingLevel: "adult",
    },
    {
      id: "midlife",
      label: "Midlife",
      description: "Adults balancing career, family, and spiritual growth",
      themes: ["work-life balance", "legacy", "spiritual renewal", "aging parents", "purpose"],
      tone: "understanding, practical, addresses complexity",
      readingLevel: "adult",
    },
    {
      id: "empty-nest",
      label: "Empty Nesting",
      description: "Parents whose children have left, rediscovering purpose",
      themes: ["transition", "legacy", "grandparenting", "increased worship", "preparing for akhirah"],
      tone: "reflective, hopeful, honors this new chapter",
      readingLevel: "adult",
    },
    {
      id: "senior",
      label: "Senior (65+)",
      description: "Elders preparing for the meeting with Allah",
      themes: ["increased ibadah", "health", "mortality", "wisdom", "sadaqah jariyah"],
      tone: "respectful, dignified, addresses mortality with hope",
      readingLevel: "adult",
    },
    {
      id: "hardship",
      label: "Going Through Hardship",
      description: "Those facing illness, loss, divorce, or major challenges",
      themes: ["patience (sabr)", "trust in Allah", "healing", "hope", "community support"],
      tone: "gentle, compassionate, non-judgmental, focuses on Allah's mercy",
      readingLevel: "adult",
    },
    {
      id: "ramadan",
      label: "Ramadan Focus",
      description: "Maximizing the blessed month",
      themes: ["fasting", "taraweeh", "Quran completion", "charity", "Laylatul Qadr"],
      tone: "spiritually elevated, motivating, focused on blessings",
      readingLevel: "adult",
    },
    {
      id: "seeking",
      label: "Seeking / Curious",
      description: "Those exploring Islam or questioning their journey",
      themes: ["truth-seeking", "intellectual questions", "finding peace", "purpose of life"],
      tone: "welcoming, non-pressuring, intellectually engaging",
      readingLevel: "adult",
    },
  ],

  // ============================================
  // EXAMPLE SCRIPTURES FOR DEMO
  // ============================================
  examples: [
    {
      id: "ayat-al-kursi",
      chapter: 2,
      verse: 255,
      title: "Ayat al-Kursi (The Throne Verse)",
      description: "The greatest verse in the Quran",
    },
    {
      id: "hardship-ease",
      chapter: 94,
      verse: 6,
      title: "With Hardship Comes Ease",
      description: "Allah's promise of relief",
    },
    {
      id: "remember-me",
      chapter: 2,
      verse: 152,
      title: "Remember Me",
      description: "The reciprocal relationship with Allah",
    },
    {
      id: "hearts-find-rest",
      chapter: 13,
      verse: 28,
      title: "Hearts Find Rest",
      description: "Peace through remembrance",
    },
    {
      id: "mercy",
      chapter: 39,
      verse: 53,
      title: "Do Not Despair",
      description: "Allah's infinite mercy",
    },
  ],

  // ============================================
  // AI GENERATION CONTEXT
  // Instructions for AI when generating content
  // ============================================
  ai: {
    systemContext: `You are creating content for Muslims. Use Islamic terminology naturally:
- Use "Allah" for God
- Use "ﷺ" or "peace be upon him" after Prophet Muhammad's name
- Reference relevant hadith when appropriate
- Use greetings like "Assalamu alaikum" and closings like "Ameen"
- Be respectful of Islamic guidelines and sensitivities`,
    
    avoidance: `Never:
- Depict or describe prophets or angels visually
- Make definitive religious rulings (fatwas)
- Be preachy or judgmental
- Assume all Muslims practice the same way`,
    
    tone: `Write as a warm, knowledgeable friend who happens to know their deen well. 
Conversational but respectful. Real but hopeful.`,
  },

  // ============================================
  // OPTIONAL FEATURES
  // Toggle religion-specific features
  // ============================================
  features: {
    prayerTimes: true,
    prayerTimesApi: "aladhan", // API provider for prayer times
    qiblaCompass: true,
    hijriCalendar: true,
    audioRecitation: true,
    originalLanguage: true, // Show Arabic text
    originalLanguageDirection: "rtl", // Right-to-left
    originalLanguageFont: "Amiri", // Google Font for Arabic
  },

  // ============================================
  // PRICING
  // ============================================
  pricing: {
    currency: "USD",
    monthly: 4.99,
    yearly: 29.99,
    trialDays: 7,
  },

  // ============================================
  // CHARITY
  // ============================================
  charity: {
    name: "Islamic Relief USA",
    url: "https://irusa.org",
    percentage: 10,
  },

  // ============================================
  // SOCIAL / LINKS
  // ============================================
  links: {
    website: "https://islamforlifestages.com",
    support: "support@islamforlifestages.com",
    privacy: "/privacy",
    terms: "/terms",
  },
} as const

// Export type for TypeScript
export type ReligionConfig = typeof RELIGION
export type LifeStageId = typeof RELIGION.lifeStages[number]["id"]
