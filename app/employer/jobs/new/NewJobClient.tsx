"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { JobFormDialog } from "@/components/JobFormDialog"
import { CheckCircle2, ClipboardList, Rocket, Clock } from "lucide-react"

interface NewJobClientProps {
  user: {
    name?: string | null
    email?: string | null
    companyName?: string | null
    employerType?: string | null
  }
}

export default function NewJobClient({ user }: NewJobClientProps) {
  const [formOpen, setFormOpen] = useState(true)
  const [jobJustPosted, setJobJustPosted] = useState(false)
  const router = useRouter()

  const companyName = user.companyName || user.name || user.email || "Your company"

  const handleSuccess = () => {
    setJobJustPosted(true)
    setFormOpen(false)
    setTimeout(() => {
      router.push("/employer/dashboard")
    }, 2000)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-6xl space-y-8">
          <div className="flex flex-col gap-3">
            <Badge variant="secondary" className="w-fit">Job composer</Badge>
            <h1 className="text-3xl font-bold">Post a new role</h1>
            <p className="text-muted-foreground">
              Publish directly to ApplyNHire and reach qualified candidates in minutes.
            </p>
          </div>

          {jobJustPosted && (
            <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="rounded-full bg-emerald-500/10 p-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle>Job posted successfully</CardTitle>
                  <CardDescription>
                    We saved the posting to your dashboard and notified subscribers in the same category.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Job details</CardTitle>
                <CardDescription>Complete the form to launch a fresh posting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We pre-filled your company information. You can save and continue later from the dashboard.
                </p>
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant="secondary" className="gap-1">
                    <ClipboardList className="h-3.5 w-3.5" />
                    Structured form
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Avg. 4 min
                  </Badge>
                </div>
                <Button onClick={() => setFormOpen(true)} className="w-full lg:w-auto">
                  Launch job form
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for faster approvals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Rocket className="mt-0.5 h-4 w-4 text-blue-500" />
                  Include salary bands so your post ranks higher in search.
                </div>
                <div className="flex items-start gap-2">
                  <Rocket className="mt-0.5 h-4 w-4 text-blue-500" />
                  Pin the exact location on the map to unlock the job map view.
                </div>
                <div className="flex items-start gap-2">
                  <Rocket className="mt-0.5 h-4 w-4 text-blue-500" />
                  Add three bullet highlights to help applicants scan quickly.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <JobFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        companyName={companyName}
        employerType={user.employerType}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
