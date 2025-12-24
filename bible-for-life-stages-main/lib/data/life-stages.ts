import type { LifeStage } from "../types"

export const lifeStages: LifeStage[] = [
  {
    id: "youth",
    label: "Youth (6-12)",
    description: "Children learning foundational faith concepts through stories and simple truths",
    themes: [
      "friendship",
      "family love",
      "being kind",
      "telling the truth",
      "helping others",
      "feeling scared",
      "making good choices",
    ],
    tone: "warm, simple, encouraging, using familiar examples from school and family life",
  },
  {
    id: "teens",
    label: "Teens (13-17)",
    description: "High school students navigating identity, peer pressure, and faith questions",
    themes: [
      "identity",
      "peer pressure",
      "future planning",
      "faith questions",
      "family relationships",
      "school stress",
    ],
    tone: "encouraging, relatable, addressing doubts and insecurities",
  },
  {
    id: "university",
    label: "University (18-22)",
    description: "College students experiencing independence and exploring beliefs",
    themes: [
      "independence",
      "academic pressure",
      "career choices",
      "relationships",
      "faith exploration",
      "financial stress",
    ],
    tone: "empowering, practical, addressing new freedoms and responsibilities",
  },
  {
    id: "adult",
    label: "Adult (23+)",
    description: "Adults navigating careers, relationships, and the complexities of modern life",
    themes: [
      "career development",
      "work-life balance",
      "relationship decisions",
      "financial planning",
      "purpose discovery",
      "community building",
    ],
    tone: "practical, empowering, addressing ambition and purpose",
  },
  {
    id: "newly-married",
    label: "Newly Married",
    description: "Couples in their first years of marriage building their life together",
    themes: ["unity", "communication", "compromise", "building traditions", "financial planning", "intimacy"],
    tone: "supportive, relationship-focused, celebrating love and partnership",
  },
  {
    id: "new-parents",
    label: "New Parents",
    description: "Parents with young children learning to balance family and faith",
    themes: ["responsibility", "sacrifice", "patience", "protection", "teaching faith", "exhaustion", "joy"],
    tone: "understanding, encouraging, acknowledging the challenges and blessings",
  },
  {
    id: "empty-nesting",
    label: "Empty Nesting",
    description: "Parents whose children have left home, rediscovering purpose",
    themes: ["transition", "rediscovery", "legacy", "new purpose", "relationship renewal", "wisdom sharing"],
    tone: "reflective, hopeful, celebrating accomplishments and new beginnings",
  },
  {
    id: "divorced",
    label: "Divorced",
    description: "Individuals navigating life after divorce, finding healing and hope",
    themes: ["healing", "forgiveness", "new beginnings", "single parenting", "trust", "self-worth", "hope"],
    tone: "compassionate, non-judgmental, focusing on healing and God's love",
  },
  {
    id: "senior",
    label: "Senior (65+)",
    description: "Older adults reflecting on life and preparing for eternity",
    themes: ["wisdom", "legacy", "health concerns", "mortality", "grandparent role", "life reflection"],
    tone: "respectful, honoring experience, addressing fears and celebrating life",
  },
]

export const LIFE_STAGES = lifeStages
