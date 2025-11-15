"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SaveJobButtonProps {
  jobId: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "ghost" | "outline"
}

export function SaveJobButton({ jobId, size = "default", variant = "ghost" }: SaveJobButtonProps) {
  const { data: session, status } = useSession()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      checkIfSaved()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, status])

  const checkIfSaved = async () => {
    try {
      const response = await fetch("/api/saved-jobs")
      if (response.ok) {
        const savedJobs = await response.json()
        const saved = savedJobs.some((item: any) => item.jobId === jobId)
        setIsSaved(saved)
      }
    } catch (error) {
      console.error("Error checking saved status:", error)
    }
  }

  const handleToggleSave = async () => {
    if (status !== "authenticated") {
      alert("Please sign in to save jobs")
      return
    }

    setIsLoading(true)
    try {
      if (isSaved) {
        // Unsave
        const response = await fetch(`/api/saved-jobs?jobId=${jobId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setIsSaved(false)
        } else {
          alert("Failed to unsave job")
        }
      } else {
        // Save
        const response = await fetch("/api/saved-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        })

        if (response.ok) {
          setIsSaved(true)
        } else {
          const error = await response.json()
          alert(error.error || "Failed to save job")
        }
      }
    } catch (error) {
      console.error("Error toggling save:", error)
      alert("Failed to update saved status")
    } finally {
      setIsLoading(false)
    }
  }

  if (status !== "authenticated") {
    return null // Or show a disabled state
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleSave}
      disabled={isLoading}
      className="gap-2"
    >
      <Heart
        className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`}
      />
      {isSaved ? "Saved" : "Save"}
    </Button>
  )
}
