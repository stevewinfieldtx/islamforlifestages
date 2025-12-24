# Faith for Life Stages - Multi-Religion Architecture

## 🎯 Core Concept

One codebase, multiple religions. Swap a single config file to deploy:
- Islam for Life Stages
- Bible for Life Stages  
- Hindu for Life Stages
- Jewish for Life Stages
- Buddhist for Life Stages
- Sikh for Life Stages
- etc.

---

## 📁 Project Structure

```
faith-life-stages/
├── config/
│   └── religion.ts          ← THE ONLY FILE YOU CHANGE PER RELIGION
│
├── app/
│   ├── layout.tsx           ← Uses config for branding
│   ├── page.tsx             ← Landing page (generic)
│   ├── daily/page.tsx       ← Daily verse/ayah/shloka
│   ├── example/[id]/page.tsx
│   └── globals.css
│
├── components/
│   ├── ScriptureCard.tsx    ← Generic: displays any scripture
│   ├── LifeStageSelector.tsx
│   ├── StoryCard.tsx
│   ├── PoemCard.tsx
│   ├── ContextCard.tsx
│   └── ui/                  ← Shadcn components
│
├── lib/
│   ├── types.ts             ← Generic types that work for ALL religions
│   ├── ai-prompts.ts        ← Generates prompts FROM config
│   ├── scripture-api.ts     ← Fetches from correct API based on config
│   └── utils.ts
│
└── public/
    └── [religion]-logo.svg
```

---

## 🔧 The Magic: `config/religion.ts`

This ONE file defines EVERYTHING religion-specific:

```typescript
export const RELIGION_CONFIG = {
  // Identity
  id: "islam",
  name: "Islam for Life Stages",
  tagline: "Daily Quranic guidance personalized for your season of life",
  
  // Terminology (used throughout app)
  terms: {
    scripture: "Quran",
    verse: "Ayah",
    verses: "Ayat", 
    chapter: "Surah",
    god: "Allah",
    prayer: "Dua",
    greeting: "Assalamu alaikum",
    holyBook: "Quran",
  },
  
  // Branding
  theme: {
    primary: "emerald",      // Tailwind color
    secondary: "teal",
    gradient: "from-emerald-950 via-slate-900 to-slate-950",
    accent: "#10b981",
  },
  
  // Life Stages (religion-specific)
  lifeStages: [
    { id: "youth", label: "Youth (6-12)", themes: [...] },
    { id: "new-muslim", label: "New to Islam", themes: [...] },
    // ... etc
  ],
  
  // Scripture API
  api: {
    type: "quran.com",  // or "bible.api", "vedabase", etc.
    baseUrl: "https://api.quran.com/api/v4",
    defaultTranslation: 131,
  },
  
  // Example scriptures for demo
  examples: [
    { chapter: 2, verse: 255, title: "Ayat al-Kursi" },
    { chapter: 94, verse: 6, title: "With hardship comes ease" },
  ],
  
  // AI Prompt customization
  aiContext: {
    tone: "Reference Allah, use Islamic greetings, mention hadith when relevant",
    avoidance: "Never depict prophets, respect Islamic guidelines",
    honorifics: "Use ﷺ after Prophet Muhammad's name",
  },
  
  // Extra features (optional per religion)
  features: {
    prayerTimes: true,      // Islam, Judaism
    qiblaCompass: true,     // Islam only
    sabbathMode: false,     // Judaism only
    meditationTimer: false, // Buddhism only
  },
  
  // Charity
  charity: {
    name: "Islamic Relief USA",
    url: "https://irusa.org",
    percentage: 10,
  },
}
```

---

## 🔄 How Swapping Works

### To create "Hindu for Life Stages":

1. Copy `config/religion.ts`
2. Change values:

```typescript
export const RELIGION_CONFIG = {
  id: "hinduism",
  name: "Hindu for Life Stages",
  tagline: "Daily wisdom from the Vedas and Gita for your life journey",
  
  terms: {
    scripture: "Vedas & Gita",
    verse: "Shloka",
    verses: "Shlokas",
    chapter: "Adhyaya",
    god: "Bhagwan",
    prayer: "Prarthana",
    greeting: "Namaste",
    holyBook: "Bhagavad Gita",
  },
  
  theme: {
    primary: "orange",
    secondary: "amber",
    gradient: "from-orange-950 via-amber-900 to-slate-950",
  },
  
  lifeStages: [
    { id: "brahmacharya", label: "Student (Brahmacharya)", themes: [...] },
    { id: "grihastha", label: "Householder (Grihastha)", themes: [...] },
    { id: "vanaprastha", label: "Retired (Vanaprastha)", themes: [...] },
    { id: "sannyasa", label: "Renunciate (Sannyasa)", themes: [...] },
  ],
  
  api: {
    type: "vedabase",
    baseUrl: "https://vedabase.io/api",
  },
  
  features: {
    prayerTimes: false,
    poojaReminder: true,
    festivalCalendar: true,
  },
}
```

3. Deploy. Done.

---

## 📦 Generic Types

```typescript
// Works for ANY religion
interface Scripture {
  id: string
  reference: string        // "2:255" or "John 3:16" or "BG 2.47"
  originalText: string     // Arabic, Hebrew, Sanskrit, etc.
  translation: string
  translationSource: string
  chapter: {
    number: number
    name: string
    originalName?: string  // "Al-Baqarah" or "בראשית"
  }
}

interface LifeStage {
  id: string
  label: string
  description: string
  themes: string[]
  tone: string
}

interface GeneratedContent {
  friendlyBreakdown: string
  stories: Story[]
  poems: Poem[]
  context: DeepContext
  reflectionQuestions: string[]
  prayerSuggestion: string  // "Dua" or "Prayer" based on config
}
```

---

## 🚀 Build Order

### Phase 1: Core (Today)
1. ✅ Architecture design (this doc)
2. [ ] `config/religion.ts` - Islam version
3. [ ] `lib/types.ts` - Generic types
4. [ ] `lib/scripture-api.ts` - Multi-API fetcher
5. [ ] `app/layout.tsx` - Config-driven layout
6. [ ] `app/page.tsx` - Landing page
7. [ ] `app/globals.css` - CSS variables from config

### Phase 2: Content
8. [ ] `components/ScriptureCard.tsx`
9. [ ] `components/LifeStageSelector.tsx`
10. [ ] `app/example/[id]/page.tsx`
11. [ ] `lib/ai-prompts.ts` - Config-driven prompts

### Phase 3: Features
12. [ ] `app/daily/page.tsx`
13. [ ] Prayer times (conditional)
14. [ ] Qibla compass (conditional)

### Phase 4: Polish
15. [ ] Auth pages
16. [ ] Subscription
17. [ ] Deploy

---

## 💡 Key Principles

1. **ZERO hardcoded religion references** in components
2. **All text comes from config** or is generated
3. **Features toggle on/off** based on config
4. **Colors/themes are variables** not hardcoded
5. **API layer abstracts** scripture sources
6. **AI prompts are generated** from config context

This way, launching a new religion = 1 config file + deploy.
