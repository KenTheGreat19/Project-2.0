"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import Link from "next/link"

interface AdDisplayProps {
  position?: "sidebar" | "banner" | "inline"
}

export function AdDisplay({ position = "sidebar" }: AdDisplayProps) {
  const { status } = useSession()
  const [isVisible, setIsVisible] = useState(true)
  const [adDismissed, setAdDismissed] = useState(false)

  useEffect(() => {
    // Check if user dismissed the login banner
    const dismissed = localStorage.getItem("loginBannerDismissed")
    if (dismissed) {
      setAdDismissed(true)
    }
  }, [])

  // Don't show ads to logged-in users
  if (status === "authenticated") {
    return null
  }

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("loginBannerDismissed", "true")
    setAdDismissed(true)
  }

  // Login banner (appears once per session)
  if (position === "banner" && !adDismissed && isVisible) {
    return (
      <div className="bg-gradient-to-r from-[#0A66C2] to-blue-600 text-white py-3 px-4 relative">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm md:text-base font-medium">
              ✨ Sign up or log in for an <strong>ad-free experience</strong> and exclusive features!
            </p>
            <Link
              href="/auth/applicant"
              className="hidden md:inline-block bg-white text-[#0A66C2] px-4 py-1.5 rounded-md font-semibold hover:bg-gray-100 transition-colors text-sm"
            >
              Get Started Free
            </Link>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white hover:bg-white/20 rounded p-1 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  // Sidebar ad (placeholder for Google AdSense or similar)
  if (position === "sidebar" && isVisible) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Advertisement
        </p>
        <div className="bg-white dark:bg-gray-700 h-64 flex items-center justify-center rounded border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-center space-y-2 p-4">
            <p className="text-sm text-muted-foreground">
              Ad Space
              <br />
              300x250
            </p>
            <p className="text-xs text-muted-foreground">
              Sign in for ad-free browsing
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Inline ad (between job listings)
  if (position === "inline" && isVisible) {
    return (
      <div className="my-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border-2 border-dashed border-gray-200 dark:border-gray-700">
        <p className="text-xs text-center text-muted-foreground uppercase tracking-wide mb-3">
          Advertisement
        </p>
        <div className="bg-white dark:bg-gray-700 h-24 flex items-center justify-center rounded">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Ad Space - 728x90
            </p>
            <Link
              href="/auth/applicant"
              className="text-xs text-[#0A66C2] hover:underline mt-1 inline-block"
            >
              Sign in for ad-free experience
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}
