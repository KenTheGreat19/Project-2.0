"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Star, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  reviewer: {
    name: string
  }
  isAnonymous?: boolean
}

interface EmployerPublicReviewsProps {
  employerId: string
  companyName: string
}

export function EmployerPublicReviews({ employerId, companyName }: EmployerPublicReviewsProps) {
  const { data: session, status } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)

  const isApplicant = (session?.user as any)?.role === "APPLICANT"

  useEffect(() => {
    fetchReviews()
  }, [employerId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/public?employerId=${employerId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
        setAverageRating(data.averageRating)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!rating || !comment.trim() || !isApplicant) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/reviews/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerId,
          rating,
          comment,
          isAnonymous,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setReviews([data, ...reviews])
        setRating(0)
        setComment("")
        setIsAnonymous(false)
        fetchReviews() // Refresh to update average
      } else {
        const error = await response.json()
        alert(error.error || "Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= (interactive ? (hoveredRating || rating) : count)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer transition-colors" : ""}`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Employer Reviews</span>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({reviews.length})
              </span>
            </div>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Reviews for {companyName}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Review Form */}
        {status === "authenticated" && isApplicant ? (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <Label className="mb-2 block">Your Rating *</Label>
              {renderStars(rating, true)}
              {rating === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Click to rate
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="review-comment">Your Review *</Label>
              <Textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience working with this employer..."
                className="min-h-[100px] mt-2"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="review-anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="review-anonymous" className="text-sm cursor-pointer">
                  Post anonymously
                </Label>
              </div>
              <Button type="submit" disabled={isSubmitting || !rating || !comment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        ) : status === "authenticated" && !isApplicant ? (
          <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Only applicants can review employers.
            </p>
          </div>
        ) : (
          <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">
              Sign in as an applicant to leave a review
            </p>
            <Link href="/auth/applicant">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No reviews yet. Be the first to review this employer!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 border dark:border-gray-700 rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {(review as any).showName === false
                          ? "Anonymous Applicant"
                          : review.reviewer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(review.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
