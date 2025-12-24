"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  getPrayerTimes,
  getNextPrayer,
  formatPrayerTime,
  getTimeUntilPrayer,
  getHijriDate,
  CALCULATION_METHOD_NAMES,
} from "@/lib/aladhan"
import type { PrayerTimes, CalculationMethod } from "@/lib/types"

export default function PrayerTimesPage() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [hijriDate, setHijriDate] = useState<any>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationName, setLocationName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [method, setMethod] = useState<CalculationMethod>(2) // ISNA default
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    getLocation()
    loadHijriDate()

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (location) {
      loadPrayerTimes()
      reverseGeocode()
    }
  }, [location, method])

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
          // Default to Mecca
          setLocation({ lat: 21.4225, lng: 39.8262 })
          setLocationName("Makkah, Saudi Arabia")
        }
      )
    } else {
      setLocation({ lat: 21.4225, lng: 39.8262 })
      setLocationName("Makkah, Saudi Arabia")
    }
  }

  const reverseGeocode = async () => {
    if (!location) return
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`
      )
      const data = await response.json()
      const city = data.address.city || data.address.town || data.address.village || ""
      const country = data.address.country || ""
      setLocationName(`${city}${city && country ? ", " : ""}${country}`)
    } catch (error) {
      console.error("Error reverse geocoding:", error)
    }
  }

  const loadPrayerTimes = async () => {
    if (!location) return
    setLoading(true)
    try {
      const times = await getPrayerTimes(location.lat, location.lng, undefined, method)
      setPrayerTimes(times)
    } catch (error) {
      console.error("Error loading prayer times:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadHijriDate = async () => {
    try {
      const hijri = await getHijriDate()
      setHijriDate(hijri)
    } catch (error) {
      console.error("Error loading Hijri date:", error)
    }
  }

  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null

  const prayers = prayerTimes
    ? [
        { name: "Fajr", arabic: "الفجر", time: prayerTimes.fajr, icon: "🌅" },
        { name: "Sunrise", arabic: "الشروق", time: prayerTimes.sunrise, icon: "☀️", isNonPrayer: true },
        { name: "Dhuhr", arabic: "الظهر", time: prayerTimes.dhuhr, icon: "🌤️" },
        { name: "Asr", arabic: "العصر", time: prayerTimes.asr, icon: "⛅" },
        { name: "Maghrib", arabic: "المغرب", time: prayerTimes.maghrib, icon: "🌅" },
        { name: "Isha", arabic: "العشاء", time: prayerTimes.isha, icon: "🌙" },
      ]
    : []

  return (
    <div className="min-h-screen islamic-gradient-bg">
      {/* Header */}
      <header className="w-full p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center">
            <span className="text-xl">🕌</span>
          </div>
          <span className="text-emerald-100 font-medium">Prayer Times</span>
        </div>
        <Link href="/">
          <Button variant="ghost" className="text-teal-200/60 hover:text-emerald-100">
            Home
          </Button>
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-16">
        {/* Date Display */}
        <div className="text-center mb-8">
          <p className="text-3xl font-bold text-emerald-100">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          {hijriDate && (
            <p className="text-teal-300/70 mt-2">
              {hijriDate.day} {hijriDate.month.en} {hijriDate.year} AH
            </p>
          )}
          {locationName && (
            <p className="text-teal-300/60 text-sm mt-1 flex items-center justify-center gap-1">
              <span>📍</span> {locationName}
            </p>
          )}
        </div>

        {/* Next Prayer Highlight */}
        {nextPrayer && (
          <div className="glass-card rounded-3xl p-8 mb-8 text-center bg-gradient-to-br from-emerald-900/30 to-teal-900/20">
            <p className="text-teal-300/60 text-sm mb-2">Next Prayer</p>
            <p className="text-4xl font-bold text-emerald-100 mb-2">{nextPrayer.name}</p>
            <p className="text-3xl text-emerald-400 font-medium mb-2">
              {formatPrayerTime(nextPrayer.time)}
            </p>
            <p className="text-teal-300/70">
              in {getTimeUntilPrayer(nextPrayer.time)}
            </p>
          </div>
        )}

        {/* All Prayer Times */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {prayers.map((prayer) => (
              <div
                key={prayer.name}
                className={`glass-card rounded-2xl p-4 flex items-center justify-between ${
                  nextPrayer?.name === prayer.name && !prayer.isNonPrayer
                    ? "ring-2 ring-emerald-500/30 bg-emerald-500/10"
                    : ""
                } ${prayer.isNonPrayer ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{prayer.icon}</span>
                  <div>
                    <p className="text-emerald-100 font-medium">{prayer.name}</p>
                    <p className="text-teal-300/60 text-sm font-amiri">{prayer.arabic}</p>
                  </div>
                </div>
                <p className="text-xl text-emerald-100 font-medium">
                  {formatPrayerTime(prayer.time)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Calculation Method Selector */}
        <div className="mt-8 glass-card rounded-2xl p-4">
          <label className="text-teal-300/60 text-sm mb-2 block">Calculation Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(Number(e.target.value) as CalculationMethod)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {Object.entries(CALCULATION_METHOD_NAMES).map(([key, name]) => (
              <option key={key} value={key} className="bg-slate-900">
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex gap-4">
          <Link href="/qibla" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/10 bg-transparent"
            >
              🧭 Qibla Direction
            </Button>
          </Link>
          <Link href="/daily" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/10 bg-transparent"
            >
              📖 Daily Ayah
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
