# Faith for Life Stages

A **multi-religion template** for building personalized daily scripture apps. One codebase, swap a single config file to deploy for any religion.

## 🎯 Current: Islam for Life Stages

This instance is configured for Islam. To create versions for other religions, simply copy and modify `config/religion.ts`.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
faith-life-stages/
├── config/
│   └── religion.ts       ← CHANGE THIS FILE FOR NEW RELIGIONS
│
├── app/
│   ├── layout.tsx        ← Reads from config
│   ├── page.tsx          ← Landing page
│   ├── globals.css
│   └── example/[id]/
│       └── page.tsx      ← Scripture preview
│
├── lib/
│   ├── types.ts          ← Generic types for any religion
│   ├── scripture-api.ts  ← Multi-provider scripture fetcher
│   ├── ai-prompts.ts     ← Config-driven AI prompts
│   └── utils.ts
│
└── ARCHITECTURE.md       ← Full documentation
```

## 🔧 How to Create a New Religion Version

### 1. Copy the config

```bash
cp config/religion.ts config/religion-backup.ts
```

### 2. Edit config/religion.ts with new values:

```typescript
export const RELIGION = {
  id: "hinduism",
  name: "Hindu for Life Stages",
  shortName: "Hindu",
  tagline: "Daily wisdom from the Vedas personalized for your ashrama",
  
  terms: {
    scripture: "Vedas & Gita",
    verse: "Shloka",
    chapter: "Adhyaya",
    god: "Bhagwan",
    prayer: "Prarthana",
    greeting: "Namaste",
    closingBlessing: "Om Shanti",
    holyBook: "Bhagavad Gita",
    follower: "Hindu",
    followerPlural: "Hindus",
  },
  
  theme: {
    primary: "orange",
    secondary: "amber",
    // ... colors
  },
  
  lifeStages: [
    { id: "brahmacharya", label: "Student (Brahmacharya)", ... },
    { id: "grihastha", label: "Householder (Grihastha)", ... },
    // ...
  ],
  
  // ... rest of config
}
```

### 3. Deploy

That's it! The entire app reads from the config.

## 🌍 Supported Religions (Planned)

| Religion | Config Status | API Status |
|----------|---------------|------------|
| Islam | ✅ Complete | ✅ Quran.com |
| Christianity | 📝 Template ready | 🔜 Bible API |
| Judaism | 📝 Template ready | 🔜 Sefaria |
| Hinduism | 📝 Template ready | 🔜 Vedabase |
| Buddhism | 📝 Template ready | 🔜 Access to Insight |
| Sikhism | 📝 Template ready | 🔜 SikhiToTheMax |

## 📦 Key Files Explained

### `config/religion.ts`
The **only file you change** per religion. Contains:
- Identity (name, tagline)
- Terminology (verse, chapter, god, prayer, etc.)
- Theme colors
- Life stages specific to the religion
- API configuration
- AI prompt context
- Optional features (prayer times, direction finder, etc.)

### `lib/scripture-api.ts`
Abstraction layer that:
- Reads API config from religion.ts
- Routes requests to correct provider (Quran.com, Bible API, etc.)
- Returns standardized `Scripture` objects

### `lib/ai-prompts.ts`
Generates AI prompts dynamically:
- Uses terminology from config
- Adapts to life stage
- Includes religion-specific context
- No hardcoded religion references

### `lib/types.ts`
Generic TypeScript types:
- `Scripture` - works for any verse/ayah/shloka
- `LifeStage` - universal life stage definition
- `GeneratedContent` - AI output structure

## 🎨 Theming

Colors are defined in config and applied via CSS variables:

```typescript
// config/religion.ts
theme: {
  colors: {
    primary: "#10b981",    // Emerald for Islam
    primaryDark: "#059669",
    secondary: "#14b8a6",
    accent: "#f59e0b",
  }
}
```

These become CSS variables in `layout.tsx`:
```css
--color-primary: #10b981;
```

Used throughout the app:
```tsx
style={{ backgroundColor: theme.colors.primary }}
```

## 🔜 To Add

1. **Daily Page** (`/daily`) - Shows today's scripture
2. **Auth Pages** (`/auth/login`, `/auth/signup`)
3. **Prayer Times** (conditional feature)
4. **Direction Finder** (Qibla for Islam, Jerusalem for Judaism)
5. **AI Generation API** - Full content generation

## 📄 License

MIT

---

Built with ❤️ for spiritual seekers everywhere.
