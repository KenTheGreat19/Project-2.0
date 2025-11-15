import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/SessionProvider"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "ApplyNHire - Free Job Portal | Find Jobs & Hire Talent",
  description: "100% Free job portal. Post unlimited jobs. Apply instantly. No fees. Ever. Find your dream job or hire top talent on ApplyNHire.com",
  keywords: ["jobs", "career", "hiring", "recruitment", "free job portal", "job search", "employment"],
  authors: [{ name: "ApplyNHire" }],
  creator: "ApplyNHire",
  publisher: "ApplyNHire",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "ApplyNHire - Free Job Portal",
    description: "Find Jobs. Hire Talent. 100% Free.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "ApplyNHire",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyNHire - Free Job Portal",
    description: "Find Jobs. Hire Talent. 100% Free.",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans" suppressHydrationWarning>
        <ErrorBoundary>
          <SessionProvider>
            <LanguageProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
                disableTransitionOnChange
              >
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <Toaster position="top-center" richColors />
              </ThemeProvider>
            </LanguageProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
