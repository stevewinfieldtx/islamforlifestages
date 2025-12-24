# Bible for Life Stages → Islam for Life Stages Conversion Analysis

## Project Overview

Converting Bible for Life Stages (BLS) to Islam for Life Stages (ILS) while maintaining the same architecture, user experience, and quality standards.

---

## 1. ARCHITECTURE SUMMARY

### Stack (Keep Same)
- **Framework:** Next.js 16 with React 19
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **AI:** OpenRouter (Claude/GPT) for content generation
- **Images:** Runware SDK for AI image generation
- **Database:** Supabase (auth, caching, user data)
- **Payments:** Stripe
- **Hosting:** Vercel

### File Structure
```
bible-for-life-stages/
├── app/
│   ├── actions.ts          ← AI PROMPTS (MAJOR CHANGES)
│   ├── page.tsx            ← Landing page (content changes)
│   ├── daily/              ← Daily verse page
│   ├── example/[verse]/    ← Example content display
│   ├── auth/               ← Login/signup
│   └── subscribe/          ← Payment flow
├── components/
│   ├── ui/                 ← UI components (mostly keep)
│   ├── ai-insights.tsx     ← AI display component
│   └── verse-card.tsx      ← Verse display
├── lib/
│   ├── data/
│   │   ├── life-stages.ts  ← LIFE STAGES (CHANGES)
│   │   ├── verses.ts       ← VERSE SOURCE (CHANGES)
│   │   └── example-verses.ts ← EXAMPLE VERSES (CHANGES)
│   ├── types.ts            ← TypeScript types (expand)
│   ├── cache.ts            ← Caching logic (keep)
│   └── supabase/           ← DB client (keep)
└── public/
    └── images/             ← LOGO/BRANDING (CHANGES)
```

---

## 2. FILES REQUIRING CHANGES

### 🔴 MAJOR REWRITES (Core Logic)

| File | What Changes | Notes |
|------|--------------|-------|
| `app/actions.ts` | All AI prompts | Bible → Quran, verses → ayahs, Christian context → Islamic context |
| `lib/data/life-stages.ts` | Life stage definitions | Add Islamic stages (new Muslim, Hajj prep, Ramadan) |
| `lib/data/verses.ts` | Verse source | YouVersion API → Quran.com API |
| `lib/data/example-verses.ts` | Demo verses | John 3:16 → Quran 2:255 (Ayat al-Kursi) |
| `lib/types.ts` | Type definitions | Add `Surah`, `Ayah`, `Hadith` types |

### 🟡 CONTENT CHANGES (Text/Branding)

| File | What Changes |
|------|--------------|
| `app/page.tsx` | Brand name, tagline, video, features, charity |
| `app/layout.tsx` | Meta title, description, favicon |
| `app/example/[verse]/page.tsx` | Pre-built example content (Islamic) |
| `app/daily/page.tsx` | Daily content display |
| `app/auth/signup/page.tsx` | Onboarding text |
| `app/subscribe/page.tsx` | Subscription messaging |

### 🟢 MINIMAL CHANGES (Keep or Minor Tweaks)

| File | Notes |
|------|-------|
| `components/ui/*` | Keep all shadcn components |
| `lib/cache.ts` | Keep caching logic |
| `lib/supabase/*` | Keep auth/DB logic |
| `lib/stripe.ts` | Keep payment logic |
| `middleware.ts` | Keep as-is |
| `styles/globals.css` | Color scheme adjustments |

### 🔵 NEW FILES NEEDED

| File | Purpose |
|------|---------|
| `lib/quran.ts` | Quran.com API wrapper |
| `lib/aladhan.ts` | Prayer times API |
| `app/prayer-times/page.tsx` | Prayer times feature |
| `app/qibla/page.tsx` | Qibla compass feature |
| `components/PrayerCard.tsx` | Prayer time display |
| `components/QiblaCompass.tsx` | Compass UI |

---

## 3. LIFE STAGES MAPPING

### Keep (Universal Stages)
| BLS Stage | ILS Stage | Notes |
|-----------|-----------|-------|
| Youth (6-12) | Youth (6-12) | Same, Islamic examples |
| Teens (13-17) | Teens (13-17) | Same, Islamic examples |
| University (18-22) | University (18-22) | Same |
| Newly Married | Newly Married | Islamic nikah context |
| New Parents | New Parents | Same, Islamic parenting |
| Empty Nesting | Empty Nesting | Same |
| Senior (65+) | Senior (65+) | Same |

### Modify
| BLS Stage | ILS Stage | Reason |
|-----------|-----------|--------|
| Divorced | Divorced | Add iddah context, Islamic divorce laws |

### Add (Islamic-Specific)
| New Stage | Description | Themes |
|-----------|-------------|--------|
| New to Islam | Recent converts | Shahada, learning basics, finding community |
| Ramadan Focus | During holy month | Fasting, prayer, charity, Quran reading |
| Hajj/Umrah Prep | Preparing for pilgrimage | Ihram, rituals, spiritual preparation |
| Seeking/Questioning | Exploring Islam | Curiosity, doubts, learning |

---

## 4. AI PROMPT CONVERSION

### Key Terminology Changes
| Bible/Christian | Quran/Islamic |
|-----------------|---------------|
| Verse | Ayah (plural: Ayat) |
| Chapter | Surah |
| Bible | Quran |
| God's Word | Allah's Word |
| Lord | Allah / Rabb |
| Gospel | Good news of Islam |
| Faith | Iman |
| Prayer | Salah / Dua |
| Jesus said | The Prophet ﷺ said |
| Scripture | Quran and Sunnah |
| Sin | Dhunub / sins |
| Salvation | Guidance / Hidayah |
| Grace | Mercy / Rahmah |
| Church | Mosque / Ummah |
| Pastor | Imam / Sheikh |

### Prompt Structure (from actions.ts)

**ORIGINAL (Bible):**
```
Write a compelling modern-day story that brings ${verse.reference} - 
"${verse.text_esv}" to life for someone in the ${lifeStage} life stage.
```

**CONVERTED (Quran):**
```
Write a compelling modern-day story that brings Surah ${surah.name} 
Ayah ${ayah.number} - "${ayah.translation}" to life for a Muslim in 
the ${lifeStage} life stage.

Include relevant Hadith where appropriate to reinforce the message.
Ensure all content aligns with mainstream Islamic understanding.
```

### Life Stage Instructions Conversion

**ORIGINAL (newly-married):**
```
LIFE STAGE: Newly Married
Application Focus: Communication, managing conflict, blending lives/families...
Examples: Money disagreements, in-laws, communication styles...
```

**CONVERTED:**
```
LIFE STAGE: Newly Married (Nikah)
Application Focus: Building a halal home, communication, mahr, 
in-law dynamics, balancing deen with dunya, praying together...
Examples: Navigating cultural vs. Islamic expectations, first Ramadan 
as couple, managing finances Islamically (avoiding riba)...
```

---

## 5. API CHANGES

### Remove
- YouVersion/Bible.com API (verses)

### Add
- **Quran.com API** (FREE)
  - Endpoint: `https://api.quran.com/api/v4/`
  - Verses: `/verses/by_key/{surah}:{ayah}`
  - Translations: Multiple languages included
  
- **Aladhan API** (FREE)
  - Endpoint: `https://api.aladhan.com/v1/`
  - Prayer times: `/timings/{date}?latitude={lat}&longitude={lng}`
  - Qibla: `/qibla/{lat}/{lng}`

### Keep
- OpenRouter (AI content)
- Runware (images)
- Supabase (database)
- Stripe (payments)

---

## 6. CONTENT TYPE CHANGES

### Stories
- Keep 2 stories per verse format
- Change: Characters are Muslim, settings include mosques, halal contexts
- Add: Reference to relevant Hadith in stories

### Poems
- Keep 2 poems per verse format
- Change: Islamic imagery (crescent, minaret, desert, Kaaba)
- Style: Can include Nasheed-inspired structure

### Deep Context
- Keep format but change content:
  - `speaker` → Who revealed/transmitted (Allah → Jibreel → Prophet)
  - `audience` → Original recipients
  - `why_said` → Asbab al-Nuzul (reasons for revelation)
  - `location` → Makki or Madani + historical location

### Reflection Questions
- Keep 3 questions format
- Frame around Islamic practice and iman

### Prayer Suggestion
- Keep format
- Change to Dua format: "O Allah, help me..." / "Ya Rabb..."

---

## 7. UI/BRANDING CHANGES

### Colors
| Element | BLS | ILS |
|---------|-----|-----|
| Primary | Amber (#F59E0B) | Emerald (#10B981) or Gold (#D4AF37) |
| Secondary | Teal | Deep Blue |
| Background | Dark blue gradient | Dark green/blue gradient |

### Logo
- BLS: Tree of Life / Cross imagery
- ILS: Geometric Islamic pattern / Crescent / Mosque silhouette

### Iconography
- Replace: Cross → Crescent, Church → Mosque, Bible → Quran
- Add: Prayer mat, Kaaba, Arabic calligraphy elements

### Fonts
- Consider: Arabic-friendly fonts for RTL support
- Amiri, Scheherazade, or Noto Naskh Arabic for Quranic text

---

## 8. NEW FEATURES

### Prayer Times (MVP)
```typescript
// lib/aladhan.ts
async function getPrayerTimes(lat: number, lng: number, date: string) {
  const response = await fetch(
    `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lng}&method=2`
  );
  return response.json();
}
// Returns: Fajr, Dhuhr, Asr, Maghrib, Isha times
```

### Qibla Compass (MVP)
```typescript
// lib/aladhan.ts
async function getQiblaDirection(lat: number, lng: number) {
  const response = await fetch(
    `https://api.aladhan.com/v1/qibla/${lat}/${lng}`
  );
  return response.json(); // Returns bearing in degrees
}
```

### Hadith Integration (MVP)
- Use Sunnah.com API or curated database
- Pair relevant hadith with each Quranic verse

---

## 9. DEVELOPMENT PHASES

### Phase 1: Foundation (This Session)
1. ✅ Analyze BLS codebase
2. [ ] Create new life-stages.ts with Islamic stages
3. [ ] Create types.ts with Islamic types
4. [ ] Create quran.ts API wrapper
5. [ ] Create aladhan.ts API wrapper

### Phase 2: Core Content (Next)
1. [ ] Rewrite actions.ts with Islamic prompts
2. [ ] Create example-verses.ts with Quran verses
3. [ ] Update page.tsx landing page
4. [ ] Update example/[verse]/page.tsx

### Phase 3: New Features (After)
1. [ ] Build prayer-times page
2. [ ] Build qibla compass
3. [ ] Add hadith integration

### Phase 4: Polish (Final)
1. [ ] Update branding/colors
2. [ ] Create new logo
3. [ ] Test all life stages
4. [ ] Deploy to Vercel

---

## 10. ESTIMATED EFFORT

| Phase | Files | Effort |
|-------|-------|--------|
| Foundation | 5 files | 2-3 hours |
| Core Content | 4 files | 4-6 hours |
| New Features | 4 files | 3-4 hours |
| Polish | Various | 2-3 hours |
| **Total** | ~15 files | **11-16 hours** |

---

## Next Steps

Ready to start Phase 1. Creating:
1. `lib/types.ts` (expanded with Islamic types)
2. `lib/data/life-stages.ts` (Islamic life stages)
3. `lib/quran.ts` (Quran.com API)
4. `lib/aladhan.ts` (Prayer times API)
