"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getTodaysAyah } from "@/lib/quran"
import { getPrayerTimes, getNextPrayer, formatPrayerTime, getTimeUntilPrayer } from "@/lib/aladhan"
import type { DailyAyah, PrayerTimes, LifeStageId } from "@/lib/types"
import { LifeStageSelector } from "@/components/ui/life-stage-selector"
import { LIFE_STAGES } from "@/lib/data/life-stages"

export default function DailyPage() {
  const [dailyAyah, setDailyAyah] = useState<DailyAyah | null>(null)
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [selectedLifeStage, setSelectedLifeStage] = useState<LifeStageId | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    loadDailyContent()
    getLocation()
  }, [])

  useEffect(() => {
    if (location) {
      loadPrayerTimes()
    }
  }, [location])

  const loadDailyContent = async () => {
    try {
      const ayah = await getTodaysAyah()
      setDailyAyah(ayah)
    } catch (error) {
      console.error("Error loading daily ayah:", error)
    } finally {
      setLoading(false)
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          // Default to Mecca coordinates
          setLocation({ lat: 21.4225, lng: 39.8262 })
        }
      )
    }
  }

  const loadPrayerTimes = async () => {
    if (!location) return
    try {
      const times = await getPrayerTimes(location.lat, location.lng)
      setPrayerTimes(times)
    } catch (error) {
      console.error("Error loading prayer times:", error)
    }
  }

  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null

  if (loading) {
    return (
      <div className="min-h-screen islamic-gradient-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
          <p className="text-emerald-100/80">Loading today's guidance...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen islamic-gradient-bg">
      {/* Header */}
      <header className="w-full p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center">
            <span className="text-xl">🌙</span>
          </div>
          <span className="text-emerald-100 font-medium">Today's Guidance</span>
        </div>
        <Link href="/">
          <Button variant="ghost" className="text-teal-200/60 hover:text-emerald-100">
            Home
          </Button>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        {/* Prayer Times Banner */}
        {prayerTimes && nextPrayer && (
          <div className="glass-card rounded-2xl p-4 mb-8 flex items-center justify-between">
            <div>
              <p className="text-teal-300/60 text-sm">Next Prayer</p>
              <p className="text-emerald-100 text-xl font-medium">{nextPrayer.name}</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-400 text-2xl font-bold">
                {formatPrayerTime(nextPrayer.time)}
              </p>
              <p className="text-teal-300/60 text-sm">
                in {getTimeUntilPrayer(nextPrayer.time)}
              </p>
            </div>
          </div>
        )}

        {/* Life Stage Selector */}
        <LifeStageSelector
          selectedStage={selectedLifeStage}
          onSelectStage={setSelectedLifeStage}
        />

        {/* Daily Ayah */}
        {dailyAyah && (
          <div className="glass-card rounded-3xl p-8 mb-8">
            <div className="text-center mb-6">
              <p className="text-teal-300/60 text-sm mb-2">Today's Ayah</p>
              <p className="text-emerald-400 font-medium">
                {dailyAyah.surah.name} ({dailyAyah.surah.name_arabic}) - Ayah {dailyAyah.ayah.verse_number}
              </p>
            </div>

            {/* Arabic */}
            <p className="text-2xl md:text-3xl text-emerald-100 font-amiri leading-loose mb-6 text-center" dir="rtl">
              {dailyAyah.ayah.text_arabic}
            </p>

            {/* Translation */}
            <p className="text-lg text-teal-100/80 italic leading-relaxed text-center mb-6">
              "{dailyAyah.ayah.text_translation}"
            </p>

            {/* CTA */}
            {selectedLifeStage ? (
              <div className="text-center">
                <Link
                  href={`/example/Surah-${dailyAyah.ayah.surah_id}-Ayah-${dailyAyah.ayah.verse_number}?stage=${selectedLifeStage}`}
                >
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8">
                    Explore Deeper
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-center text-teal-300/60 text-sm">
                Select your life stage above to see personalized content
              </p>
            )}
          </div>
        )}

        {/* All Prayer Times */}
        {prayerTimes && (
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-medium text-emerald-100 mb-4 flex items-center gap-2">
              <span>🕌</span> Today's Prayer Times
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: "Fajr", time: prayerTimes.fajr },
                { name: "Dhuhr", time: prayerTimes.dhuhr },
                { name: "Asr", time: prayerTimes.asr },
                { name: "Maghrib", time: prayerTimes.maghrib },
                { name: "Isha", time: prayerTimes.isha },
              ].map((prayer) => (
                <div
                  key={prayer.name}
                  className={`p-4 rounded-xl text-center ${
                    nextPrayer?.name === prayer.name
                      ? "bg-emerald-500/20 border border-emerald-500/30"
                      : "bg-white/5"
                  }`}
                >
                  <p className="text-teal-300/70 text-sm mb-1">{prayer.name}</p>
                  <p className="text-emerald-100 font-medium">
                    {formatPrayerTime(prayer.time)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
