import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Islam for Life Stages",
  description:
    "Daily Quranic guidance personalized for your season of life. Stories, poetry, context, and reflections that speak to where you are right now.",
  keywords: [
    "Quran",
    "Islamic guidance",
    "Muslim app",
    "daily ayah",
    "Quran reflection",
    "Islamic stories",
    "Muslim life stages",
    "prayer times",
    "Qibla",
  ],
  authors: [{ name: "Islam for Life Stages" }],
  openGraph: {
    title: "Islam for Life Stages",
    description: "Daily Quranic guidance personalized for your season of life.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
