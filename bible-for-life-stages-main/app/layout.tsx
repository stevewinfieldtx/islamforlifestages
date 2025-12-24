import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Bible for Life Stages - Daily Verses for Your Journey",
  description:
    "Discover personalized daily Bible verses with AI-powered insights tailored to your life stage. From teens to seniors, find wisdom and encouragement for every season of life.",
  keywords: [
    "bible",
    "daily verse",
    "life stages",
    "faith",
    "spiritual growth",
    "personalized bible",
    "christian",
    "devotional",
  ],
  authors: [{ name: "Bible for Life Stages Team" }],
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Bible for Life Stages",
    description: "Daily Bible verses with personalized AI-powered insights for every stage of life",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0c1929",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
