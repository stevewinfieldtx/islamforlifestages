import type { Ayah, Surah } from "../types"

/**
 * Example ayahs for the public preview/demo
 * These are universally powerful verses that work across life stages
 */

export interface ExampleAyah {
  ayah: Ayah
  surah: Surah
}

export const EXAMPLE_AYAHS: ExampleAyah[] = [
  {
    // Ayat al-Kursi - The Throne Verse (most famous)
    ayah: {
      id: 262,
      verse_number: 255,
      verse_key: "2:255",
      surah_id: 2,
      text_arabic:
        "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      text_translation:
        "Allah! There is no god except Him, the Ever-Living, All-Sustaining. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on the earth. Who could possibly intercede with Him without His permission? He knows what is ahead of them and what is behind them, but no one can grasp any of His knowledge—except what He wills. His Seat encompasses the heavens and the earth, and the preservation of both does not tire Him. For He is the Most High, the Greatest.",
      translation_name: "The Clear Quran",
      juz_number: 3,
      hizb_number: 5,
      page_number: 42,
    },
    surah: {
      id: 2,
      name: "Al-Baqarah",
      name_arabic: "البقرة",
      name_translation: "The Cow",
      revelation_place: "madinah",
      verses_count: 286,
    },
  },
  {
    // With hardship comes ease
    ayah: {
      id: 5765,
      verse_number: 6,
      verse_key: "94:6",
      surah_id: 94,
      text_arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      text_translation:
        "Surely with hardship comes ease.",
      translation_name: "The Clear Quran",
      juz_number: 30,
      hizb_number: 60,
      page_number: 596,
    },
    surah: {
      id: 94,
      name: "Ash-Sharh",
      name_arabic: "الشرح",
      name_translation: "The Relief",
      revelation_place: "makkah",
      verses_count: 8,
    },
  },
  {
    // Remember Me, I will remember you
    ayah: {
      id: 159,
      verse_number: 152,
      verse_key: "2:152",
      surah_id: 2,
      text_arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
      text_translation:
        "So remember Me, and I will remember you. And be grateful to Me, and do not deny Me.",
      translation_name: "The Clear Quran",
      juz_number: 2,
      hizb_number: 3,
      page_number: 23,
    },
    surah: {
      id: 2,
      name: "Al-Baqarah",
      name_arabic: "البقرة",
      name_translation: "The Cow",
      revelation_place: "madinah",
      verses_count: 286,
    },
  },
  {
    // Hearts find rest in remembrance of Allah
    ayah: {
      id: 1601,
      verse_number: 28,
      verse_key: "13:28",
      surah_id: 13,
      text_arabic:
        "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُمْ بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      text_translation:
        "Those who believe and whose hearts find comfort in the remembrance of Allah. Surely in the remembrance of Allah do hearts find comfort.",
      translation_name: "The Clear Quran",
      juz_number: 13,
      hizb_number: 26,
      page_number: 252,
    },
    surah: {
      id: 13,
      name: "Ar-Ra'd",
      name_arabic: "الرعد",
      name_translation: "The Thunder",
      revelation_place: "madinah",
      verses_count: 43,
    },
  },
  {
    // Do not despair of Allah's mercy
    ayah: {
      id: 4445,
      verse_number: 53,
      verse_key: "39:53",
      surah_id: 39,
      text_arabic:
        "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنْفُسِهِمْ لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ",
      text_translation:
        "Say, 'O My servants who have transgressed against themselves, do not despair of Allah's mercy, for Allah certainly forgives all sins. He is indeed the All-Forgiving, Most Merciful.'",
      translation_name: "The Clear Quran",
      juz_number: 24,
      hizb_number: 47,
      page_number: 464,
    },
    surah: {
      id: 39,
      name: "Az-Zumar",
      name_arabic: "الزمر",
      name_translation: "The Groups",
      revelation_place: "makkah",
      verses_count: 75,
    },
  },
  {
    // Allah is with those who are patient
    ayah: {
      id: 231,
      verse_number: 153,
      verse_key: "2:153",
      surah_id: 2,
      text_arabic:
        "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
      text_translation:
        "O you who believe! Seek help through patience and prayer. Surely Allah is with those who are patient.",
      translation_name: "The Clear Quran",
      juz_number: 2,
      hizb_number: 3,
      page_number: 23,
    },
    surah: {
      id: 2,
      name: "Al-Baqarah",
      name_arabic: "البقرة",
      name_translation: "The Cow",
      revelation_place: "madinah",
      verses_count: 286,
    },
  },
]

// Helper to format verse reference for URLs
export function formatAyahReference(ayah: Ayah): string {
  return `Surah-${ayah.surah_id}-Ayah-${ayah.verse_number}`
}

// Helper to parse URL back to verse key
export function parseAyahReference(ref: string): { surah: number; ayah: number } | null {
  const match = ref.match(/Surah-(\d+)-Ayah-(\d+)/)
  if (!match) return null
  return {
    surah: parseInt(match[1]),
    ayah: parseInt(match[2]),
  }
}

/**
 * Pre-built example content for Ayat al-Kursi (2:255) across life stages
 * This mirrors the Bible version's John 3:16 examples
 */
export const AYAT_AL_KURSI_CONTENT: Record<
  string,
  {
    story: { title: string; content: string }
    poem: { title: string; content: string }
    context: string
    reflection: string
    dua: string
  }
> = {
  teens: {
    story: {
      title: "The Night Before Exams",
      content:
        "Aisha stared at her phone—3 AM, and she still couldn't sleep. Tomorrow's exam felt like it would determine her entire future. Her parents had sacrificed so much for her education, and the pressure was suffocating. She scrolled through social media, watching classmates post confident selfies. Her heart raced. Then her grandmother's voice echoed in her mind: 'When you can't sleep, neither does your worry—but Allah never sleeps, never tires.' Aisha remembered the ayah her grandmother had taught her since childhood—Ayat al-Kursi. She whispered it in the darkness, and something shifted. The God who sustains the heavens and earth wasn't tired of her problems. He wasn't overwhelmed by her anxiety. She wasn't alone in that dark room. She didn't know if she'd ace the exam, but she knew something bigger: she was held by something vast, and that was enough to finally close her eyes.",
    },
    poem: {
      title: "When Sleep Won't Come",
      content:
        "At 3 AM when worries grow,\nAnd stress becomes all that I know,\nI remember One who never sleeps,\nWhose knowledge is vast, whose love runs deep.\n\nHe holds the stars, He holds the sun,\nHe holds my heart when day is done.\nNo drowsiness touches His throne,\nYet somehow He sees me—never alone.",
    },
    context:
      "Ayat al-Kursi is considered the greatest verse in the Quran. The Prophet ﷺ said whoever recites it before sleeping will be protected throughout the night. It describes Allah's absolute sovereignty—He never tires, never sleeps, and His throne encompasses everything. For anxious teens, this is powerful: the same God who manages the entire universe is fully aware of your problems too.",
    reflection:
      "What keeps you up at night—grades, friends, the future? How does knowing Allah 'never drowses nor sleeps' change how you face those worries? What would it feel like to truly trust that He sees everything you're going through?",
    dua: "Ya Allah, when my heart races and sleep won't come, remind me that You never tire of watching over me. Help me trust You with what I can't control. Grant me peace that comes from knowing You see me, You hear me, and You've got this. Ameen.",
  },

  "new-muslim": {
    story: {
      title: "Learning to Stand",
      content:
        "Marcus had taken his shahada three months ago, but the prayer movements still felt foreign. Standing in the back of the mosque, he watched others bow and prostrate with fluid grace while he fumbled through, always a beat behind. After prayer, he sat alone, feeling like an imposter. An elderly uncle noticed and sat beside him. 'Brother, do you know Ayat al-Kursi?' Marcus shook his head. The uncle smiled. 'It tells us that Allah's knowledge encompasses everything—including the stumbling steps of someone learning to pray.' He taught Marcus the verse slowly, word by word. 'You see,' the uncle said, 'Allah doesn't need your perfect prayer. He sees your effort. He sees you chose Him when you could have chosen anything else. That's what He loves.' Marcus realized he'd been trying to earn something that was already given. Allah saw his struggle—and it was beautiful to Him.",
    },
    poem: {
      title: "The New Path",
      content:
        "I stumble through the words I'm learning,\nMy tongue still new to this returning,\nBut He who holds the heavens high\nSees every effort that I try.\n\nHis knowledge spans what was and is,\nMy fumbling prayers don't threaten His.\nFor in His vast and endless sight,\nMy small beginnings are still bright.",
    },
    context:
      "Ayat al-Kursi emphasizes Allah's omniscience—'He knows what is before them and what is behind them.' For new Muslims, this is comforting: Allah knows your journey, your struggles with family, your questions about how to pray correctly. He knows you're trying. The verse also mentions that nothing escapes His knowledge—including the courage it took to embrace Islam.",
    reflection:
      "What part of being a new Muslim feels hardest right now? How does knowing that Allah's knowledge 'encompasses the heavens and earth' change how you view your imperfect attempts at worship? What would it mean to truly believe He values your effort over your perfection?",
    dua: "Ya Rabb, You knew I would find my way to You before I even knew myself. As I learn Your words and Your ways, grant me patience with my progress. Help me remember that You see my heart, not just my mistakes. Let Ayat al-Kursi be a shield for me as I grow in this beautiful path. Ameen.",
  },

  "newly-married": {
    story: {
      title: "The Throne in Our Home",
      content:
        "They'd been married four months when the first real fight happened. Fatima couldn't even remember what started it—something about money, or in-laws, or both. Yusuf had stormed out, and she sat crying on the prayer mat, her half-finished Maghrib abandoned. When he returned an hour later, he found her there, reciting something softly. Ayat al-Kursi. He stood in the doorway, listening. 'His Seat encompasses the heavens and the earth.' The words hit him differently now. If Allah's throne could hold everything in existence, surely He could hold their small marriage with its small problems. Yusuf sat beside her. They didn't talk at first—they just prayed together. Later, he said, 'I think we've been trying to be each other's everything. But only Allah can be that.' Fatima nodded. 'He never tires. We do.' They held hands. 'Let's let Him hold what we can't.'",
    },
    poem: {
      title: "Two Hearts, One Throne",
      content:
        "We thought our love could hold it all,\nBut love grows tired, and humans fall.\nSo we return to what is true:\nA throne that holds both me and you.\n\nNot in each other do we rest complete,\nBut in the One whose love won't deplete.\nHis kingdom spans the seen, unseen—\nBig enough for what lies in between.",
    },
    context:
      "The verse says 'the preservation of both (the heavens and earth) does not tire Him.' Marriage reveals our limitations—we get exhausted, frustrated, hurt. But this ayah reminds couples that Allah is the only One who never tires of sustaining things. When spouses place their ultimate reliance on Allah rather than expecting each other to be everything, the marriage breathes easier.",
    reflection:
      "Where in your marriage have you been expecting your spouse to be what only Allah can be? How might 'the preservation does not tire Him' change how you handle conflicts? What would it look like to let Allah hold what you both can't?",
    dua: "Ya Allah, You are Al-Qayyum—the Self-Sustaining who sustains all things. Sustain our marriage when we grow tired. Help us turn to You instead of demanding from each other what only You can give. Make our home a place where Ayat al-Kursi is recited and lived. Ameen.",
  },

  "new-parents": {
    story: {
      title: "The 2 AM Feeding",
      content:
        "Kareem walked the hallway at 2 AM, his three-week-old son finally quiet against his chest. His wife Amina was sleeping—he'd insisted she rest. His eyes burned with exhaustion, but something in him marveled at this tiny human who depended on them for everything. The baby stirred, and Kareem whispered Ayat al-Kursi softly, the way his father used to for him. 'Neither drowsiness nor sleep overtakes Him.' He almost laughed—because drowsiness had definitely overtaken him. But Allah? Never. Allah was watching this 2 AM moment. Allah saw every diaper change, every feeding, every moment of doubt about whether he was doing this right. 'He knows what is before them and what is behind them.' Allah knew this baby's whole life—and He still gave this small person to them. If Allah trusted them with this child, maybe Kareem could trust himself a little more too.",
    },
    poem: {
      title: "Night Watch",
      content:
        "At 2 AM I walk the floor,\nThis tiny soul I'm watching for,\nBut Someone else keeps watch with me—\nA Guardian who never tires, you see.\n\nHis throne holds stars and holds my son,\nHis mercy new when night is done.\nSo I will pace and pray and stay,\nKnowing He guards us either way.",
    },
    context:
      "Ayat al-Kursi is traditionally recited over sleeping children for protection. The Prophet ﷺ said whoever recites it will have a guardian from Allah until morning. For exhausted new parents, this verse offers comfort: while you desperately need sleep, Allah never does. He is watching over your child even when you can't keep your eyes open. The verse's emphasis on Allah's vast knowledge means He knows every worry about your baby's health, development, and future.",
    reflection:
      "What fears about your child keep you up at night? How does knowing Allah 'neither drowses nor sleeps' change how you face those fears? What would it mean to truly entrust your child to the One whose throne encompasses everything?",
    dua: "Ya Hafidh, Ya Raqeeb—Protector and Watchful One—guard this child You have entrusted to us. When we are too tired to keep watch, remind us that You never are. Cover our baby with the protection of Ayat al-Kursi. Help us parent with trust in Your plan. Ameen.",
  },

  senior: {
    story: {
      title: "The Throne Room",
      content:
        "Hajji Ibrahim sat in his favorite chair by the window, watching the neighborhood children play. He was 78 now, and his body was slowing down. The doctor's words from yesterday still echoed: 'We need to monitor you more closely.' His daughter wanted him to move in with her. Everything felt like it was ending. He picked up his worn Quran and turned to Al-Baqarah, verse 255—the same verse his mother had taught him seventy years ago. 'The Ever-Living, All-Sustaining.' Ibrahim had sustained a business, raised children, buried his wife. Now he could barely sustain himself. But Allah? The verse said preservation of everything 'does not tire Him.' Ibrahim closed his eyes. He wasn't approaching nothingness. He was approaching the One whose throne holds everything—including whatever came next. For the first time in weeks, he smiled. The ending was just a door, and on the other side waited the One who never ends.",
    },
    poem: {
      title: "The Everlasting Throne",
      content:
        "My hands grow weak, my steps grow slow,\nThis body hints it's time to go.\nBut You, Al-Hayy, will never tire,\nYour kingdom never will expire.\n\nSo when my final breath is drawn,\nI'm not approaching some dark dawn—\nI'm coming home to rest at last\nBefore a Throne forever vast.",
    },
    context:
      "Al-Hayy Al-Qayyum—the Ever-Living, Self-Sustaining—are two of Allah's greatest names, both found in this verse. For those approaching life's end, this is profound comfort. While human life fades, Allah is eternal. The Prophet ﷺ said reciting Ayat al-Kursi after every prayer helps pave the way to Paradise. For seniors, this verse offers both protection now and hope for what comes next.",
    reflection:
      "What aspects of aging are hardest for you? How does the phrase 'the Ever-Living, All-Sustaining' speak to your concerns about mortality? What would it mean to approach life's end as approaching 'a Throne forever vast' rather than an end?",
    dua: "Ya Hayy, Ya Qayyum—Ever-Living, Self-Sustaining One—as my body weakens, strengthen my soul. As my time here shortens, lengthen my good deeds. Help me meet You with a heart full of trust that Your throne awaits, and that the best is yet to come. Ameen.",
  },
}
