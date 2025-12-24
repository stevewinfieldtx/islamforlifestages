/**
 * Aladhan API Wrapper
 * Free API for Islamic prayer times and Qibla direction
 * Documentation: https://aladhan.com/prayer-times-api
 */

import type { PrayerTimes, PrayerSettings, QiblaData, CalculationMethod } from "./types"

const ALADHAN_API_BASE = "https://api.aladhan.com/v1"

// Kaaba coordinates for Qibla calculation
const KAABA_LAT = 21.4225
const KAABA_LNG = 39.8262

interface AladhanTimings {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Sunset: string
  Maghrib: string
  Isha: string
  Imsak: string
  Midnight: string
  Firstthird: string
  Lastthird: string
}

interface AladhanResponse {
  code: number
  status: string
  data: {
    timings: AladhanTimings
    date: {
      readable: string
      timestamp: string
      gregorian: {
        date: string
        format: string
        day: string
        weekday: { en: string }
        month: { number: number; en: string }
        year: string
      }
      hijri: {
        date: string
        format: string
        day: string
        weekday: { en: string; ar: string }
        month: { number: number; en: string; ar: string }
        year: string
        holidays: string[]
      }
    }
    meta: {
      latitude: number
      longitude: number
      timezone: string
      method: {
        id: number
        name: string
      }
    }
  }
}

/**
 * Get prayer times for a specific date and location
 */
export async function getPrayerTimes(
  latitude: number,
  longitude: number,
  date?: Date,
  method: CalculationMethod = 2, // ISNA default
  school: 0 | 1 = 0 // 0 = Shafi, 1 = Hanafi
): Promise<PrayerTimes | null> {
  try {
    const targetDate = date || new Date()
    const timestamp = Math.floor(targetDate.getTime() / 1000)

    const response = await fetch(
      `${ALADHAN_API_BASE}/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`
    )

    if (!response.ok) {
      console.error("[Aladhan API] Error fetching prayer times:", response.status)
      return null
    }

    const data: AladhanResponse = await response.json()

    return {
      date: data.data.date.gregorian.date,
      fajr: data.data.timings.Fajr,
      sunrise: data.data.timings.Sunrise,
      dhuhr: data.data.timings.Dhuhr,
      asr: data.data.timings.Asr,
      maghrib: data.data.timings.Maghrib,
      isha: data.data.timings.Isha,
      timezone: data.data.meta.timezone,
    }
  } catch (error) {
    console.error("[Aladhan API] Error:", error)
    return null
  }
}

/**
 * Get prayer times for the current month
 */
export async function getMonthlyPrayerTimes(
  latitude: number,
  longitude: number,
  year?: number,
  month?: number,
  method: CalculationMethod = 2
): Promise<PrayerTimes[]> {
  try {
    const now = new Date()
    const targetYear = year || now.getFullYear()
    const targetMonth = month || now.getMonth() + 1

    const response = await fetch(
      `${ALADHAN_API_BASE}/calendar/${targetYear}/${targetMonth}?latitude=${latitude}&longitude=${longitude}&method=${method}`
    )

    if (!response.ok) {
      console.error("[Aladhan API] Error fetching monthly times:", response.status)
      return []
    }

    const data = await response.json()

    return data.data.map((day: any) => ({
      date: day.date.gregorian.date,
      fajr: day.timings.Fajr,
      sunrise: day.timings.Sunrise,
      dhuhr: day.timings.Dhuhr,
      asr: day.timings.Asr,
      maghrib: day.timings.Maghrib,
      isha: day.timings.Isha,
      timezone: day.meta.timezone,
    }))
  } catch (error) {
    console.error("[Aladhan API] Error:", error)
    return []
  }
}

/**
 * Get Qibla direction from a location
 */
export async function getQiblaDirection(
  latitude: number,
  longitude: number
): Promise<QiblaData | null> {
  try {
    const response = await fetch(
      `${ALADHAN_API_BASE}/qibla/${latitude}/${longitude}`
    )

    if (!response.ok) {
      console.error("[Aladhan API] Error fetching Qibla:", response.status)
      return null
    }

    const data = await response.json()

    return {
      latitude,
      longitude,
      direction: data.data.direction,
      distance: calculateDistanceToKaaba(latitude, longitude),
    }
  } catch (error) {
    console.error("[Aladhan API] Error:", error)
    return null
  }
}

/**
 * Calculate distance to Kaaba using Haversine formula
 */
function calculateDistanceToKaaba(lat: number, lng: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(KAABA_LAT - lat)
  const dLng = toRad(KAABA_LNG - lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat)) *
      Math.cos(toRad(KAABA_LAT)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/**
 * Calculate Qibla direction locally (without API)
 * Returns bearing in degrees from North
 */
export function calculateQiblaDirection(latitude: number, longitude: number): number {
  const lat1 = toRad(latitude)
  const lat2 = toRad(KAABA_LAT)
  const dLng = toRad(KAABA_LNG - longitude)

  const x = Math.sin(dLng) * Math.cos(lat2)
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)

  let bearing = Math.atan2(x, y)
  bearing = (bearing * 180) / Math.PI
  bearing = (bearing + 360) % 360

  return Math.round(bearing * 100) / 100
}

/**
 * Get Hijri date
 */
export async function getHijriDate(date?: Date): Promise<{
  day: string
  month: { number: number; en: string; ar: string }
  year: string
  holidays: string[]
} | null> {
  try {
    const targetDate = date || new Date()
    const dateString = `${targetDate.getDate().toString().padStart(2, "0")}-${(targetDate.getMonth() + 1).toString().padStart(2, "0")}-${targetDate.getFullYear()}`

    const response = await fetch(
      `${ALADHAN_API_BASE}/gpiToH/${dateString}`
    )

    if (!response.ok) {
      console.error("[Aladhan API] Error fetching Hijri date:", response.status)
      return null
    }

    const data = await response.json()
    const hijri = data.data.hijri

    return {
      day: hijri.day,
      month: {
        number: hijri.month.number,
        en: hijri.month.en,
        ar: hijri.month.ar,
      },
      year: hijri.year,
      holidays: hijri.holidays || [],
    }
  } catch (error) {
    console.error("[Aladhan API] Error:", error)
    return null
  }
}

/**
 * Get next prayer time
 */
export function getNextPrayer(
  prayerTimes: PrayerTimes
): { name: string; time: string; isNow: boolean } | null {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const prayers = [
    { name: "Fajr", time: prayerTimes.fajr },
    { name: "Dhuhr", time: prayerTimes.dhuhr },
    { name: "Asr", time: prayerTimes.asr },
    { name: "Maghrib", time: prayerTimes.maghrib },
    { name: "Isha", time: prayerTimes.isha },
  ]

  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(":").map(Number)
    const prayerMinutes = hours * 60 + minutes

    if (prayerMinutes > currentTime) {
      return { name: prayer.name, time: prayer.time, isNow: false }
    }
  }

  // If all prayers have passed, next is Fajr tomorrow
  return { name: "Fajr", time: prayerTimes.fajr, isNow: false }
}

/**
 * Format time for display (12-hour format with AM/PM)
 */
export function formatPrayerTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const hours12 = hours % 12 || 12
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`
}

/**
 * Get time remaining until next prayer
 */
export function getTimeUntilPrayer(prayerTime: string): string {
  const now = new Date()
  const [hours, minutes] = prayerTime.split(":").map(Number)

  const prayerDate = new Date(now)
  prayerDate.setHours(hours, minutes, 0, 0)

  // If prayer time has passed today, it's tomorrow
  if (prayerDate <= now) {
    prayerDate.setDate(prayerDate.getDate() + 1)
  }

  const diff = prayerDate.getTime() - now.getTime()
  const hoursRemaining = Math.floor(diff / (1000 * 60 * 60))
  const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hoursRemaining > 0) {
    return `${hoursRemaining}h ${minutesRemaining}m`
  }
  return `${minutesRemaining}m`
}

/**
 * Calculation method names for UI display
 */
export const CALCULATION_METHOD_NAMES: Record<CalculationMethod, string> = {
  1: "University of Islamic Sciences, Karachi",
  2: "Islamic Society of North America (ISNA)",
  3: "Muslim World League",
  4: "Umm Al-Qura University, Makkah",
  5: "Egyptian General Authority of Survey",
  7: "Institute of Geophysics, University of Tehran",
  8: "Gulf Region",
  9: "Kuwait",
  10: "Qatar",
  11: "Majlis Ugama Islam Singapura",
  12: "Union Organization Islamic de France",
  13: "Diyanet İşleri Başkanlığı, Turkey",
  14: "Spiritual Administration of Muslims of Russia",
  15: "Moonsighting Committee Worldwide",
}

/**
 * Recommended calculation method by region
 */
export function getRecommendedMethod(countryCode: string): CalculationMethod {
  const methodMap: Record<string, CalculationMethod> = {
    // North America
    US: 2,
    CA: 2,
    // Middle East
    SA: 4,
    AE: 8,
    KW: 9,
    QA: 10,
    // South Asia
    PK: 1,
    IN: 1,
    BD: 1,
    // Southeast Asia
    MY: 11,
    SG: 11,
    ID: 11,
    // Europe
    FR: 12,
    DE: 3,
    UK: 3,
    // Turkey
    TR: 13,
    // Russia
    RU: 14,
    // Iran
    IR: 7,
    // Egypt
    EG: 5,
  }

  return methodMap[countryCode.toUpperCase()] || 3 // Default to Muslim World League
}
