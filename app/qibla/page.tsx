"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { calculateQiblaDirection, getQiblaDirection } from "@/lib/aladhan"
import type { QiblaData } from "@/lib/types"

export default function QiblaPage() {
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null)
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationName, setLocationName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [permissionGranted, setPermissionGranted] = useState(false)

  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    if (location) {
      loadQiblaData()
      reverseGeocode()
    }
  }, [location])

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        },
        () => {
          setLocation({ lat: 40.7128, lng: -74.006 })
          setLocationName("New York, USA")
        }
      )
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
      console.error("Error:", error)
    }
  }

  const loadQiblaData = async () => {
    if (!location) return
    setLoading(true)
    try {
      const direction = calculateQiblaDirection(location.lat, location.lng)
      const apiData = await getQiblaDirection(location.lat, location.lng)
      setQiblaData({
        latitude: location.lat,
        longitude: location.lng,
        direction: apiData?.direction || direction,
        distance: apiData?.distance || 0,
      })
    } catch (error) {
      if (location) {
        const direction = calculateQiblaDirection(location.lat, location.lng)
        setQiblaData({ latitude: location.lat, longitude: location.lng, direction, distance: 0 })
      }
    } finally {
      setLoading(false)
    }
  }

  const requestCompassPermission = async () => {
    if (typeof DeviceOrientationEvent !== "undefined") {
      if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          if (permission === "granted") {
            setPermissionGranted(true)
            startCompass()
          }
        } catch (error) {
          console.error("Error:", error)
        }
      } else {
        setPermissionGranted(true)
        startCompass()
      }
    }
  }

  const startCompass = () => {
    window.addEventListener("deviceorientation", (event: DeviceOrientationEvent) => {
      let heading = (event as any).webkitCompassHeading || event.alpha
      if (heading !== null) {
        if (!(event as any).webkitCompassHeading && event.alpha) {
          heading = 360 - event.alpha
        }
        setDeviceHeading(heading)
      }
    }, true)
  }

  const getQiblaRotation = () => {
    if (!qiblaData || deviceHeading === null) return qiblaData?.direction || 0
    return qiblaData.direction - deviceHeading
  }

  return (
    <div className="min-h-screen islamic-gradient-bg">
      <header className="w-full p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center">
            <span className="text-xl">🧭</span>
          </div>
          <span className="text-emerald-100 font-medium">Qibla Direction</span>
        </div>
        <Link href="/"><Button variant="ghost" className="text-teal-200/60 hover:text-emerald-100">Home</Button></Link>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-16 text-center">
        {locationName && <p className="text-teal-300/70 mb-8 flex items-center justify-center gap-2"><span>📍</span> {locationName}</p>}

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
            <p className="text-emerald-100/80">Finding Qibla direction...</p>
          </div>
        ) : qiblaData ? (
          <>
            <div className="relative w-72 h-72 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-teal-900/20" />
              <div className="absolute inset-4 rounded-full border border-emerald-500/20">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-emerald-400 font-bold">N</div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-teal-400">E</div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-teal-400">S</div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-teal-400">W</div>
              </div>
              <div className="absolute inset-8 flex items-center justify-center transition-transform duration-300" style={{ transform: `rotate(${getQiblaRotation()}deg)` }}>
                <div className="relative">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[80px] border-b-emerald-500 drop-shadow-lg" />
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">🕋</div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
            </div>

            <div className="glass-card rounded-2xl p-6 mb-6">
              <p className="text-teal-300/60 text-sm mb-1">Qibla Direction</p>
              <p className="text-3xl font-bold text-emerald-100 mb-4">{Math.round(qiblaData.direction)}°</p>
              {qiblaData.distance > 0 && (<><p className="text-teal-300/60 text-sm mb-1">Distance to Kaaba</p><p className="text-xl text-emerald-100">{qiblaData.distance.toLocaleString()} km</p></>)}
            </div>

            {!permissionGranted && <Button onClick={requestCompassPermission} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">Enable Live Compass</Button>}
            {permissionGranted && deviceHeading !== null && <p className="text-teal-300/60 text-sm">Device heading: {Math.round(deviceHeading)}°</p>}
          </>
        ) : <p className="text-red-400">Unable to determine Qibla direction</p>}

        <div className="mt-8 flex gap-4">
          <Link href="/prayer-times" className="flex-1"><Button variant="outline" className="w-full border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/10 bg-transparent">🕌 Prayer Times</Button></Link>
          <Link href="/daily" className="flex-1"><Button variant="outline" className="w-full border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/10 bg-transparent">📖 Daily Ayah</Button></Link>
        </div>
      </main>
    </div>
  )
}
