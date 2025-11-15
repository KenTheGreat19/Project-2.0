"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface LikeButtonProps {
  jobId: string
  initialLikesCount?: number
}

export function LikeButton({ jobId, initialLikesCount = 0 }: LikeButtonProps) {
  const { data: session, status } = useSession()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      checkLikeStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, jobId])

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`/api/jobs/like?jobId=${jobId}`)
      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
      }
    } catch (error) {
      console.error("Error checking like status:", error)
    }
  }

  const handleLike = async () => {
    if (status !== "authenticated") {
      toast.error("Please sign in to like jobs")
      return
    }

    setIsLoading(true)
    try {
      if (liked) {
        // Unlike
        const response = await fetch(`/api/jobs/like?jobId=${jobId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setLiked(false)
          setLikesCount((prev) => Math.max(0, prev - 1))
          toast.success("Job unliked")
        } else {
          const error = await response.json()
          toast.error(error.error || "Failed to unlike job")
        }
      } else {
        // Like
        const response = await fetch("/api/jobs/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        })

        if (response.ok) {
          setLiked(true)
          setLikesCount((prev) => prev + 1)
          toast.success("Job liked!")
        } else {
          const error = await response.json()
          toast.error(error.error || "Failed to like job")
        }
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={liked ? "default" : "outline"}
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className="gap-2"
    >
      <Heart
        className={`h-4 w-4 ${liked ? "fill-current" : ""}`}
      />
      <span>{likesCount}</span>
      {liked ? "Liked" : "Like"}
    </Button>
  )
}
