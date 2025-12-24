import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a time string to 12-hour format
 */
export function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const hours12 = hours % 12 || 12
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`
}

/**
 * Get time remaining until a specific time
 */
export function getTimeUntil(targetTime: string): string {
  const now = new Date()
  const [hours, minutes] = targetTime.split(":").map(Number)
  
  const target = new Date(now)
  target.setHours(hours, minutes, 0, 0)
  
  if (target <= now) {
    target.setDate(target.getDate() + 1)
  }
  
  const diff = target.getTime() - now.getTime()
  const hoursRemaining = Math.floor(diff / (1000 * 60 * 60))
  const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hoursRemaining > 0) {
    return `${hoursRemaining}h ${minutesRemaining}m`
  }
  return `${minutesRemaining}m`
}

/**
 * Generate a simple UUID
 */
export function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + "..."
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * Calculate bearing between two coordinates
 */
export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  
  const dLng = toRad(lng2 - lng1)
  const y = Math.sin(dLng) * Math.cos(toRad(lat2))
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng)
  
  let bearing = Math.atan2(y, x)
  bearing = (bearing * 180) / Math.PI
  bearing = (bearing + 360) % 360
  
  return Math.round(bearing * 100) / 100
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180
  
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return Math.round(R * c)
}
