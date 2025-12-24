"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { LifeStageId, Verse, GeneratedContent } from "@/lib/types"
import { generateVerseContent } from "@/app/actions"
import { LifeStageSelector } from "@/components/ui/life-stage-selector"
import { VerseCard } from "@/components/ui/verse-card"
import { VerseContent } from "@/components/ui/verse-content"
import { EXAMPLE_VERSES } from "@/lib/data/example-verses"

// Pre-built example content for John 3:16 across different life stages
const JOHN_316_CONTENT: Record<
  LifeStageId,
  {
    story: { title: string; content: string }
    poem: { title: string; content: string }
    context: string
    reflection: string
    prayer: string
  }
> = {
  teens: {
    story: {
      title: "The Scholarship",
      content:
        "Maya stared at the rejection letter, tears blurring the words. She'd worked so hard for that scholarship—late nights studying, sacrificing hangouts with friends, pouring everything into her dream. Her dad found her on the porch, shoulders shaking. He didn't say anything at first, just sat beside her. Then he told her about his own failed business at 25, how he'd lost everything but gained something more—a faith that taught him love isn't earned, it's given freely. 'God didn't love the world because it was perfect,' he said. 'He loved it because that's who He is.' Maya realized she'd been trying to earn her worth through achievements. But real love—God's love—was already hers, no application required.",
    },
    poem: {
      title: "No Conditions",
      content:
        "Not for the grades you bring,\nNot for the songs you sing,\nNot for the crowds who cheer your name—\nHis love remains the same.\n\nBefore you proved your worth,\nBefore your day of birth,\nA love so deep it crossed the sky\nWhispered, 'For you, I'd die.'",
    },
    context:
      "In Jesus' time, the concept of a god sacrificing for humans was revolutionary. Ancient gods demanded sacrifices FROM people. But here, God becomes the sacrifice FOR people. This would have shocked Nicodemus, a religious teacher who thought favor with God was earned through following rules. Jesus flipped everything upside down—love comes first, freely given.",
    reflection:
      "What have you been trying to 'earn' lately—approval from friends, parents, or even God? How does knowing you're already loved change how you see yourself?",
    prayer:
      "God, help me stop trying to earn what You've already given. When I feel not good enough, remind me that Your love isn't based on my performance. Thank You for loving me before I could do anything to deserve it. Amen.",
  },
  university: {
    story: {
      title: "The All-Nighter",
      content:
        "James sat in the library at 3 AM, surrounded by empty coffee cups and highlighted textbooks. Finals week had broken him. His roommate had asked if he wanted to join a late-night Bible study instead—something about 'soul rest'—but James had laughed it off. He needed to pass, not pray. But staring at equations that blurred together, he felt something crack inside. Not his focus—his facade. He'd been running for years, trying to prove he belonged at this university, in this major, in this life. His phone buzzed: a text from his grandmother. 'Remember, you are loved not for what you achieve, but for who you are. John 3:16.' For the first time in months, James closed his laptop. Some things couldn't be studied for—they had to be received.",
    },
    poem: {
      title: "The Grade That Matters",
      content:
        "Stack your books and chase the dean's list,\nBurn the midnight oil, persist—\nBut know this truth when dawn appears:\nYour worth's not weighed in GPAs or fears.\n\nThe Son was sent not to condemn\nBut offer life through Him.\nSo rest, dear student, weary soul,\nHis love already makes you whole.",
    },
    context:
      "Nicodemus came to Jesus at night, possibly to avoid being seen by his colleagues. He was a Pharisee, part of the religious elite, yet something was missing. Despite his education and status, he sensed there was more. Jesus' words about being 'born again' confused him—he was thinking literally when Jesus meant spiritually. This passage reminds us that intellectual achievement alone can't fill our deepest needs.",
    reflection:
      "Where are you seeking validation—grades, relationships, career prospects? What would change if you truly believed you were loved regardless of your achievements?",
    prayer:
      "Lord, in this season of pressure and expectations, ground me in Your unconditional love. Help me pursue excellence without making it my identity. I receive Your gift of grace today. Amen.",
  },
  adult: {
    story: {
      title: "The Corner Office",
      content:
        "Rachel finally got the promotion—corner office, executive title, everything she'd worked fifteen years to achieve. But sitting in her new leather chair, staring at the city skyline, she felt hollow. That night, she found herself at her mother's kitchen table, the same one where she'd done homework as a kid. 'I thought I'd feel different,' she admitted. Her mother smiled knowingly. 'I chased that feeling too, once. Then your father got sick, and I learned something.' She pulled out a worn Bible. 'God so loved the world—not the successful, not the worthy, just... the world. All of us, as we are.' Rachel realized she'd been trying to fill a God-shaped hole with career-shaped achievements. The love she'd been working for was already waiting.",
    },
    poem: {
      title: "Already Loved",
      content:
        "The corner office has a view,\nThe title sounds impressive too,\nYet late at night, success grows thin—\nAchievement can't reach deep within.\n\nBut here's a love that doesn't wait\nFor you to earn or demonstrate:\nGod gave His Son, the story goes,\nBefore you struck a single pose.",
    },
    context:
      "John 3:16 is often called the 'Gospel in a nutshell.' The Greek word for 'gave' (edōken) implies a complete, sacrificial giving—not a loan or trade, but a gift with no strings attached. In a transactional world where everything has a price, this radical generosity stands out. The early church would have understood this as counter-cultural; Roman society was built on patronage and reciprocity.",
    reflection:
      "What are you working toward that you hope will finally make you feel 'enough'? How might receiving God's love change your relationship with ambition?",
    prayer:
      "Father, I've spent years building, striving, achieving. Today I pause to receive what I cannot earn. Thank You for loving me not for my productivity, but for being Your child. Amen.",
  },
  "newly-married": {
    story: {
      title: "The First Fight",
      content:
        "They'd been married three months when the first real fight happened. Not a disagreement—a fight. Doors slammed, words that couldn't be unsaid. Michael sat in his car in the driveway, wondering if he'd made a mistake. His phone rang—his grandfather, somehow sensing trouble. 'You know why your grandmother and I lasted 54 years?' the old man asked. 'Because we learned that love isn't a feeling to fall into—it's a choice to fall forward.' He quoted John 3:16. 'God didn't love the world because it was lovable. He loved it as an act of will. Marriage is the same.' Michael walked back inside. Sarah was crying on the couch. He sat beside her, took her hand. 'I choose you,' he said. 'Even when it's hard. Especially then.'",
    },
    poem: {
      title: "Two Become",
      content:
        "The vows we spoke in candlelight\nAre tested when we start to fight,\nWhen flaws emerge and patience thins,\nThat's where the real love begins.\n\nFor God so loved—not perfect things—\nBut broken world with broken wings.\nSo love your spouse through storm and sun,\nAnd let two hearts become as one.",
    },
    context:
      "The Greek word for 'world' (kosmos) in this verse implies the entire created order—beautiful but broken, loved despite its rebellion. When Jesus speaks of God loving the 'world,' He means all of it, including the parts that resist love. This mirrors marriage: loving not an idealized partner, but a real person with real flaws. The gift of the Son mirrors the gift spouses give each other—not because it's deserved, but because love gives.",
    reflection:
      "What parts of your spouse do you find hardest to love? How does God's unconditional love challenge you to love differently?",
    prayer:
      "Lord, teach us to love each other the way You love us—not based on performance, but on covenant. When we fail each other, help us choose grace. Make our marriage a reflection of Your sacrificial love. Amen.",
  },
  "new-parents": {
    story: {
      title: "3 AM",
      content:
        "The baby wouldn't stop crying. It was 3 AM, and David had been awake for what felt like days. His wife was finally asleep, and he paced the nursery, bouncing their daughter, begging her to please, please rest. In exhaustion, he started to cry too. Then something shifted. Looking at this tiny person who had done nothing to earn his love, he understood something new about God. 'I would do anything for you,' he whispered to his daughter. 'Anything.' And in that moment, John 3:16 transformed from a verse he'd memorized into a truth he felt. God looked at humanity—crying, needy, unable to help themselves—and said the same thing. Not 'earn it.' Just 'I love you. Here's my Son.'",
    },
    poem: {
      title: "The Father's Heart",
      content:
        "At 3 AM I finally see\nWhat God's love means for you and me:\nThis tiny child did nothing yet—\nI love her more than words can get.\n\nSo God looked down at broken earth,\nNot waiting for us to prove worth,\nAnd gave His Son without a pause.\nNow I understand, because...\n\nI'd give my life for this small one.\nAnd that's exactly what God's done.",
    },
    context:
      "In ancient Jewish culture, a father's role was paramount. The concept of God 'giving' His only Son would have resonated deeply with listeners—this was the ultimate sacrifice, the giving of one's legacy and future. The word 'only begotten' (monogenēs) emphasizes uniqueness; Jesus wasn't one of many options but God's singular, irreplaceable gift. For new parents, this context illuminates the verse: imagine giving your only child for people who may never appreciate the sacrifice.",
    reflection:
      "How has becoming a parent changed your understanding of God's love? What fears do you carry that you need to surrender to the God who gave everything?",
    prayer:
      "Father, thank You for this child who has shown me dimensions of love I never knew. When I'm exhausted and overwhelmed, remind me that You understand—You gave Your only Son. Give me strength to parent with the same sacrificial love. Amen.",
  },
  "parenting-teens": {
    story: {
      title: "The Locked Door",
      content:
        "The door had been locked for three hours. Lisa stood outside her daughter's room, hand raised to knock for the fifth time, then lowered it again. Something had shifted between them. Her little girl who used to run into her arms now barely made eye contact. Her husband found her on the stairs. 'She hates me,' Lisa whispered. 'No,' he said. 'She's becoming herself. And that's terrifying for both of you.' They prayed together, right there on the stairs. Lisa thought of God, watching His children choose their own paths, loving them fiercely through every rebellion. She couldn't force connection. But she could stay. She slid a note under the door: 'I love you. No matter what. Forever.' The door stayed locked. But she heard crying on the other side—and knew she'd been heard.",
    },
    poem: {
      title: "Through the Door",
      content:
        "Behind the door, a storm rages,\nTears and doubts fill teenage pages,\nAnd I, outside, with breaking heart,\nWatch my child pull apart.\n\nBut God loved worlds that turned away,\nKept loving through each rebel day.\nSo I will stay, and I will wait,\nLove stronger than a locked-door gate.",
    },
    context:
      "The context of John 3:16 is a conversation with Nicodemus, a Pharisee who came to Jesus secretly—perhaps like a teenager sneaking out at night. Jesus doesn't condemn Nicodemus for his confusion or his need for secrecy. Instead, He offers the most famous verse about love. This passage follows the story of Moses lifting up the serpent in the wilderness—a symbol of looking up for salvation when you're lost. For parents of teens, this is comforting: God specializes in meeting people in their confusion.",
    reflection:
      "Where do you see your teen 'wandering' that concerns you? How can you love them through this season without trying to control outcomes?",
    prayer:
      "God, my child is becoming someone I don't always recognize. Give me patience to love without controlling, presence without pressure. Help me trust that You are working even when I can't see it. Amen.",
  },
  "empty-nesting": {
    story: {
      title: "The Quiet House",
      content:
        "Margaret walked through the house, touching doorframes of rooms that used to echo with noise. Her youngest had left for college last week. The silence was deafening. She found herself in front of the kitchen window where she'd watched countless backyard games, wiped countless tears, said countless prayers. Now what? Her Bible lay open on the counter. John 3:16 was underlined—she'd marked it decades ago when her first child was born. But now it read differently. God so loved the world that He gave... and then let go. God's Son left home too. Margaret realized her season wasn't ending—it was transforming. She'd spent years giving. Now it was time to trust that what she'd planted would grow.",
    },
    poem: {
      title: "Letting Go",
      content:
        "The house is quiet now,\nRooms echo like a prayer.\nI raised them up, I let them go,\nI wonder if I'm still needed there.\n\nBut God released His only Son\nTo save a world He loved.\nSometimes the greatest act of love\nIs the letting go thereof.\n\nSo I will trust this silent space,\nBelieve my work was true.\nThe love I gave will multiply—\nGod, I learned it watching You.",
    },
    context:
      "In the original Greek, 'gave' (edōken) is in the aorist tense, indicating a complete, decisive action. God's giving of His Son was not hesitant but wholehearted. For empty nesters, this offers comfort: the giving we've done as parents—years of sacrifice, teaching, loving—has been complete in its way. Now, like God, we release our children into their purpose. The verse also emphasizes 'eternal life'—a reminder that our parenting has eternal implications beyond what we can see.",
    reflection:
      "What do you grieve about this new season? What possibilities does it hold that you haven't considered?",
    prayer:
      "Lord, my home feels empty but my heart is full of memories. Help me embrace this new chapter without clinging to what was. Thank You for trusting me with these children. Now help me trust You with them. Amen.",
  },
  divorced: {
    story: {
      title: "The Signature",
      content:
        "The pen felt impossibly heavy. James stared at the line where he was supposed to sign—the final paper, the end of fifteen years. His lawyer waited. The clock ticked. He thought about failure, about promises broken, about the person he thought he'd grow old with. He couldn't do it. He stepped outside for air and called his sister. 'I feel like God must be so disappointed in me,' he said. She was quiet for a moment. 'You know what I've learned? God doesn't love you less because your marriage ended. John 3:16 doesn't say God so loved the perfect, the successful, the ones who got it right. He loved the world. All of it. Including this.' James went back inside. He signed the paper. But something had shifted—shame had loosened its grip. He was still loved. Even now.",
    },
    poem: {
      title: "Still Loved",
      content:
        "The papers signed, the chapter closed,\nI am not who I supposed.\nBroken vows like scattered leaves—\nWho could love what failure leaves?\n\nYet here's the word that sets me free:\nGod loved the world—and that means me.\nNot perfect, polished, problem-solved,\nBut messy, hurting, yet... absolved.\n\nSo I will rise from ashes here,\nCarry forward, not my fear,\nBut love received that never ends,\nFrom God who calls the broken friends.",
    },
    context:
      "When John wrote his Gospel, he was writing to a community that included people with messy lives—former sinners, outcasts, those rejected by religious society. The emphasis on 'whoever believes' is radically inclusive. There are no qualifications listed, no exclusions for those whose lives haven't gone as planned. The early church was full of people finding new identity after old life collapsed. This verse was their anchor—and it remains one for anyone navigating life's hardest transitions.",
    reflection:
      "What shame are you carrying about your divorce? How might it feel to truly believe that God's love for you hasn't changed?",
    prayer:
      "God, I feel like a failure. I never imagined my life would include this pain. But I receive Your love today—not because I've earned it, but because You give it freely. Help me heal. Help me believe I'm still worthy of love. Amen.",
  },
  widowed: {
    story: {
      title: "The Other Side of the Bed",
      content:
        "Every morning, Eleanor reached across to his side of the bed before she remembered. Forty-three years of reaching, and now—nothing. The grief counselor said it would get easier. It hadn't. One Sunday, too tired to get dressed for church, she opened her Bible randomly. John 3:16. She'd read it a thousand times, but today the word 'gave' stopped her. God gave His Son. God knew loss. God knew what it was to watch someone you love die. She whispered to the empty room: 'You understand, don't You?' And in the silence, something answered—not audibly, but deep within. Not alone. Never alone. The bed was still empty, but the room felt different. Fuller. Held.",
    },
    poem: {
      title: "God Knows",
      content:
        "I reach across an empty space\nWhere warmth once filled each night,\nAnd grief becomes a second skin\nI wear from dark to light.\n\nBut God once watched His own Son die,\nHe knows this tearing pain.\nThe One who gave knows what it costs—\nLove lost is love that still remains.\n\nSo I am held by One who mourns,\nWho understands my tears.\nAnd somehow, in that sacred bond,\nI'll face the coming years.",
    },
    context:
      "The Gospel of John was written by 'the disciple whom Jesus loved,' someone who had experienced profound intimacy with Christ—and profound loss. John watched Jesus die on the cross. He understood grief firsthand. When he writes about God 'giving' His Son, he writes as someone who saw that gift cost everything. For those who grieve, this verse offers connection: God is not distant from our pain. He entered into it fully.",
    reflection:
      "How have you experienced God's presence in your grief? What would it mean to believe that He truly understands your loss?",
    prayer:
      "Lord, You know the ache of empty space, the silence where there should be voice. Meet me in my grief. Don't fix it—just be present. And help me trust that love doesn't end with death, because Yours didn't. Amen.",
  },
  senior: {
    story: {
      title: "The View from 80",
      content:
        "Walter sat on his porch, watching the sun set—his 80th birthday gift to himself, a quiet evening alone. Well, not entirely alone. His wife was inside, preparing cake. His kids and grandkids would arrive soon. But for now, he sat with decades of memories and one well-worn verse. He'd first encountered John 3:16 at age 12, in a Sunday school class he'd tried to skip. Now, nearly 70 years later, the words meant something different. Not deeper—he didn't like that word, as if faith always grew. More... settled. Like a river that stops rushing and becomes a lake. God loved. God gave. That was the whole story. His whole story. Everything else was detail. He smiled as headlights turned into the driveway. More story coming. And love, all the way down.",
    },
    poem: {
      title: "Still Here",
      content:
        "Eighty years of sun and rain,\nSome joy, a share of pain,\nAnd through it all, one truth remains:\nGod so loved—and loves again.\n\nNot just the young, the strong, the new,\nBut weathered saints like me and you.\nThe gift He gave, it has no end,\nFrom start to finish, first to amen.\n\nSo I will rest in evening light,\nTrust love to hold me through the night.\nEternal life—not earned, but given.\nThe view from here looks much like heaven.",
    },
    context:
      "John likely wrote his Gospel in his later years, as an elderly man reflecting on his experiences with Jesus decades earlier. His emphasis on 'eternal life' takes on particular poignancy when we realize he was writing near the end of his own earthly life. The Greek 'zōē aiōnios' (eternal life) doesn't just mean 'life that goes on forever'—it means life connected to God. For seniors, this offers assurance: the best is not behind, but ahead.",
    reflection:
      "As you look back on your life, where do you see God's love woven through your story? What do you want the next chapter to hold?",
    prayer:
      "Father, thank You for a life filled with Your presence—even in the moments I didn't recognize it. As I age, keep my heart young with gratitude. And when my time comes, receive me into that eternal life You promised. I trust Your love from here to forever. Amen.",
  },
  "career-transition": {
    story: {
      title: "The Cleared Desk",
      content:
        "The cardboard box was heavier than it should have been—or maybe that was just the weight of twenty-two years being carried out in one trip. David had known the layoffs were coming, but knowing didn't make the security escort easier. At home, his wife found him staring at the box, unopened. 'I don't know who I am without that job,' he admitted. She sat beside him. 'Remember what you told me when I lost my mother? That our identity isn't in what we lose—it's in being loved.' She opened her Bible app. 'God so loved the world. Not the employed world. Not the successful world. Just... the world.' David realized he'd tied his worth to a title that could be stripped. But the love that held him couldn't be put in a cardboard box—or taken out of one.",
    },
    poem: {
      title: "More Than a Title",
      content:
        "The desk is cleared, the badge returned,\nThe title that I thought I'd earned\nNow belongs to someone new—\nAnd I must find what's really true.\n\nGod loved the world, not my career,\nNot the role I played, the image here.\nHe loved the self beneath the name,\nAnd that self remains the same.\n\nSo I will grieve what I have lost,\nAnd count the years, and count the cost,\nBut rise on love that doesn't fire,\nA worth no job can acquire.",
    },
    context:
      "In Jesus' time, identity was closely tied to occupation—fishermen, tax collectors, carpenters were defined by their work. When Jesus called disciples away from their jobs, it was radical; He was saying their worth wasn't in their trade. John 3:16 reinforces this: God's love is for the 'world' (kosmos), not for people who perform certain roles. This is liberating for anyone whose identity has been shaken by career change.",
    reflection:
      "How much of your identity was tied to your previous role? What parts of yourself exist independent of any job title?",
    prayer:
      "God, I'm not sure who I am outside the work I used to do. Help me find my identity in being loved by You, not in titles or achievements. Open new doors, but more importantly, open my eyes to who I am in You. Amen.",
  },
  "chronic-illness": {
    story: {
      title: "The Waiting Room",
      content:
        "The waiting room had become too familiar—the beige walls, the outdated magazines, the careful way everyone avoided eye contact. Claire had been in and out of hospitals for three years now. Today's appointment was just another check-in, another measurement of a body that kept betraying her. A young mother sat nearby, trying to quiet a toddler. Claire smiled at the child, and the mother looked up, exhausted. 'I don't know how you do it,' she said to Claire. 'You always seem so peaceful.' Claire laughed softly. 'I'm not. I'm terrified most days.' She paused. 'But I've learned something in these rooms. God doesn't love me less because my body is broken. He loved a broken world enough to enter it. That's... enough. Most days.' The nurse called her name. She stood, still scared, still loved.",
    },
    poem: {
      title: "Broken and Beloved",
      content:
        "This body fails in ways I fear,\nEach test result, each waiting year,\nI wonder what I did to earn\nThis pain that makes my spirit yearn.\n\nBut God so loved a broken place,\nA world of pain, a fallen race,\nHe didn't wait for us to mend—\nHe came into our brokenness, a friend.\n\nSo I am loved, not when I'm whole,\nBut now, with worn and weary soul.\nThe gift was given, not to the strong,\nBut to the weak—where I belong.",
    },
    context:
      "John 3:16 follows a reference to Moses lifting up the serpent in the wilderness—a story about healing for the Israelites who had been bitten by snakes. They were healed not by their own effort but by simply looking at what God provided. For those with chronic illness, this context is powerful: salvation and love don't depend on our physical condition. Jesus would later say He came especially for the sick, not the healthy. God's love doesn't require a functioning body; it embraces the broken.",
    reflection:
      "How has your illness affected your sense of being loved by God? What would it mean to believe you are fully cherished in your current physical state?",
    prayer:
      "Lord, my body doesn't work the way I wish it did. Some days I feel forgotten. But You loved a suffering world, and You love me now—needles and waiting rooms and all. Help me receive Your love even when I can't feel it. Amen.",
  },
}

const JOHN_316_VERSE: Verse = {
  reference: "John 3:16",
  text_esv:
    "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
  url: "https://www.bible.com/bible/59/JHN.3.16",
  date: "example",
}

export default function ExamplePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [selectedLifeStage, setSelectedLifeStage] = useState<LifeStageId | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Preparing your personalized content...")
  const [year, setYear] = useState<number | null>(null)
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null)

  useEffect(() => {
    setMounted(true)
    setYear(new Date().getFullYear())

    const verseParam = params.verse as string
    console.log("[v0] Verse param from URL:", verseParam)

    const verseReference = verseParam?.replace(/-/g, (match, offset, string) => {
      const parts = verseParam.split("-")
      if (parts.length >= 3) {
        return offset === string.lastIndexOf("-") ? ":" : " "
      }
      return " "
    })

    console.log("[v0] Looking for verse:", verseReference)

    const matchedVerse = EXAMPLE_VERSES.find((v) => v.reference.replace(/\s+/g, "-").replace(/:/g, "-") === verseParam)

    console.log("[v0] Matched verse:", matchedVerse?.reference)

    if (matchedVerse) {
      setCurrentVerse({
        reference: matchedVerse.reference,
        text_esv: matchedVerse.text,
        url: matchedVerse.url,
        date: "example",
      })
    } else {
      setCurrentVerse(JOHN_316_VERSE)
    }

    const stageParam = searchParams.get("stage") as LifeStageId | null
    if (stageParam) {
      setSelectedLifeStage(stageParam)
    } else {
      setSelectedLifeStage("adult")
    }
  }, [searchParams, params.verse])

  useEffect(() => {
    if (!selectedLifeStage || !mounted || !currentVerse) return

    async function loadContent() {
      setIsLoading(true)
      try {
        setLoadingMessage(`Creating personalized content for ${selectedLifeStage?.replace("-", " ")}...`)
        console.log("[v0] Generating content for:", currentVerse.reference, selectedLifeStage)
        const generatedContent = await generateVerseContent(currentVerse, selectedLifeStage)
        setContent(generatedContent)
      } catch (err) {
        console.error("Failed to load content", err)
        setLoadingMessage("Error loading content. Please refresh.")
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [selectedLifeStage, mounted, currentVerse])

  const handleStageSelect = (stage: LifeStageId) => {
    setSelectedLifeStage(stage)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen w-full stained-glass-bg flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-glow-pulse" />
        <div
          className="absolute top-1/3 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl animate-glow-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/4 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-glow-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl animate-glow-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <header className="relative z-10 w-full p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/20 ring-1 ring-white/10">
            <Image src="/images/logo.jpg" alt="Bible for Life Stages" fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl tracking-wide text-amber-100 font-medium">Bible for Life Stages</h1>
            <span className="text-xs text-blue-300/70 hidden sm:block">Example: John 3:16</span>
          </div>
        </div>
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-blue-200/60 hover:text-amber-100">
            Back to Home
          </Button>
        </Link>
      </header>

      <div className="relative z-10 mx-4 md:mx-6 mb-4">
        <div className="bg-gradient-to-r from-amber-500/20 via-teal-500/20 to-amber-500/20 border border-amber-500/30 rounded-2xl p-4 text-center">
          <p className="text-amber-100 font-medium">This is a free preview of the full experience for John 3:16</p>
          <p className="text-blue-200/70 text-sm mt-1">
            Subscribe to unlock daily personalized content for every verse
          </p>
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 md:px-6 pt-4 pb-16 w-full max-w-7xl mx-auto">
        <LifeStageSelector selectedStage={selectedLifeStage} onSelectStage={handleStageSelect} />

        <div className="w-full max-w-7xl space-y-8">
          <VerseCard verse={currentVerse} className="animate-spring-in" />

          {isLoading ? (
            <div className="glass-card rounded-3xl p-8 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 animate-pulse" />
                </div>
              </div>
              <p className="text-amber-100/90 text-center font-medium">{loadingMessage}</p>
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-amber-500 animate-shimmer" />
              </div>
            </div>
          ) : (
            <VerseContent content={content} lifeStage={selectedLifeStage} isLoading={isLoading} />
          )}
        </div>

        {!isLoading && content && (
          <div className="mt-12 w-full max-w-2xl">
            <div className="glass-card rounded-3xl p-8 text-center space-y-6">
              <h3 className="text-2xl font-medium text-amber-100">Loved this experience?</h3>
              <p className="text-blue-200/80">
                Get personalized content like this every day, following Bible.com's Verse of the Day. Stories, poetry,
                context, and reflections tailored to your life stage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/subscribe">
                  <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold px-8 py-6 text-lg rounded-xl">
                    Start 7-Day Free Trial
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="border-blue-400/30 text-blue-200 hover:bg-blue-500/10 px-8 py-6 text-lg rounded-xl bg-transparent"
                  >
                    Back to Home
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-blue-300/50">$2/month or $12/year after trial • Cancel anytime</p>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 w-full py-8 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <p className="text-blue-300/70 text-sm mb-2">
          Helping friends better understand what the Bible means to them in various stages of life.
        </p>
        <p className="text-blue-300/50 text-sm">© {year ?? 2025} Bible for Life Stages. All rights reserved.</p>
        <p className="mt-2 text-xs text-blue-300/30">Following Bible.com's Verse of the Day • ESV Translation</p>
      </footer>
    </div>
  )
}
