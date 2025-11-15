"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ExternalLink, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface ApplyButtonProps {
  jobId: string
  applyUrl?: string
  jobTitle: string
  acceptApplicationsHere: boolean
}

export function ApplyButton({ jobId, applyUrl, jobTitle, acceptApplicationsHere }: ApplyButtonProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [showDialog, setShowDialog] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  const handleExternalApply = () => {
    console.log(`Application click for: ${jobTitle}`)
    toast.success("Redirecting to company website...")
    window.open(applyUrl, "_blank", "noopener,noreferrer")
  }

  const handleInternalApply = async () => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to apply")
      router.push("/auth/applicant")
      return
    }

    if (!session?.user || (session.user as any).role !== "APPLICANT") {
      toast.error("Only applicants can apply to jobs")
      return
    }

    setShowDialog(true)
  }

  const confirmApplication = async () => {
    setIsApplying(true)
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit application")
      }

      toast.success("Application submitted successfully!")
      setShowDialog(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to apply")
    } finally {
      setIsApplying(false)
    }
  }

  if (acceptApplicationsHere) {
    return (
      <>
        <div className="space-y-3">
          {/* Internal Apply Button */}
          <Button
            onClick={handleInternalApply}
            className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white text-lg py-6 font-semibold"
            size="lg"
          >
            <Send className="h-5 w-5 mr-2" />
            Apply Now
          </Button>
          
          {/* External Apply Button (if URL provided) */}
          {applyUrl && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <Button
                onClick={handleExternalApply}
                variant="secondary"
                className="w-full border-2 border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10 text-lg py-6 font-semibold"
                size="lg"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Apply on Company Website
              </Button>
            </>
          )}
          
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            {applyUrl 
              ? "Choose your preferred application method"
              : "Your application will be submitted directly to the employer"
            }
          </p>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Application</DialogTitle>
              <DialogDescription>
                You are about to apply for <strong>{jobTitle}</strong>.
                The employer will be able to see your profile and resume.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Make sure your profile is complete:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Updated resume</li>
                <li>Contact information</li>
                <li>Skills and experience</li>
              </ul>
            </div>

            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setShowDialog(false)}
                disabled={isApplying}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmApplication}
                disabled={isApplying}
                className="bg-[#10B981] hover:bg-[#10B981]/90"
              >
                {isApplying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Confirm & Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleExternalApply}
        className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white text-lg py-6 font-semibold"
        size="lg"
      >
        <ExternalLink className="h-5 w-5 mr-2" />
        Apply on Company Website
      </Button>
      
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        You will be redirected to the company&apos;s official career site
      </p>
    </div>
  )
}
