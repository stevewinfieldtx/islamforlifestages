import type { Metadata } from "next"
import { RELIGION } from "@/config/religion"
import "./globals.css"

// Dynamic metadata from config
export const metadata: Metadata = {
  title: RELIGION.name,
  description: `${RELIGION.tagline}. ${RELIGION.description}`,
  keywords: [
    RELIGION.terms.scripture,
    RELIGION.terms.holyBook,
    RELIGION.shortName,
    "life stages",
    "daily guidance",
    "spiritual growth",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = RELIGION.theme
  const features = RELIGION.features
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Load original language font if needed */}
        {features.originalLanguage && features.originalLanguageFont && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
              href={`https://fonts.googleapis.com/css2?family=${features.originalLanguageFont}:wght@400;700&display=swap`}
              rel="stylesheet"
            />
          </>
        )}
        
        {/* Set CSS variables from theme */}
        <style>{`
          :root {
            --color-primary: ${theme.colors.primary};
            --color-primary-dark: ${theme.colors.primaryDark};
            --color-secondary: ${theme.colors.secondary};
            --color-accent: ${theme.colors.accent};
            --color-background: ${theme.colors.background};
            --font-original: "${features.originalLanguageFont || 'serif'}";
          }
        `}</style>
      </head>
      <body 
        className={`min-h-screen bg-gradient-to-br ${theme.background.gradient} text-white antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
