"use client"

import { useEffect } from "react"

interface ViewTrackerProps {
  jobId: string
}

export function ViewTracker({ jobId }: ViewTrackerProps) {
  useEffect(() => {
    // Track view when component mounts
    const trackView = async () => {
      try {
        await fetch(`/api/jobs/${jobId}/impression`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
      } catch (error) {
        console.error("Failed to track view:", error)
      }
    }

    trackView()
  }, [jobId])

  return null // This component doesn't render anything
}
