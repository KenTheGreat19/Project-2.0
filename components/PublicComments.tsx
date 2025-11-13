"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { MessageSquare, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Comment {
  id: string
  comment: string
  createdAt: string
  author: {
    name: string
    email: string
  }
  isAnonymous?: boolean
}

interface PublicCommentsProps {
  jobId: string
}

export function PublicComments({ jobId }: PublicCommentsProps) {
  const { data: session, status } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const isApplicant = (session?.user as any)?.role === "APPLICANT"

  useEffect(() => {
    fetchComments()
  }, [jobId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?jobId=${jobId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim() || !isApplicant) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          comment: newComment,
          isAnonymous,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments([data, ...comments])
        setNewComment("")
        setIsAnonymous(false)
      } else {
        alert("Failed to post comment")
      }
    } catch (error) {
      console.error("Error posting comment:", error)
      alert("Failed to post comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Public Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {status === "authenticated" && isApplicant ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this job..."
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                  Post anonymously
                </Label>
              </div>
              <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </form>
        ) : status === "authenticated" && !isApplicant ? (
          <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Only applicants can post comments on job listings.
            </p>
          </div>
        ) : (
          <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">
              Sign in as an applicant to leave a comment
            </p>
            <Link href="/auth/applicant">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#0A66C2] flex items-center justify-center text-white">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {(comment as any).showName === false
                        ? "Anonymous User"
                        : comment.author.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
