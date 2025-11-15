"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar, MapPin, ExternalLink, UserCircle } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import Link from "next/link"
import { ApplicantProfileForm } from "@/components/applicant/ApplicantProfileForm"
import { ResumeBuilder } from "@/components/applicant/ResumeBuilder"
import { InterviewPrepSystem } from "@/components/applicant/InterviewPrepSystem"
import { ApplicationAnalyticsDashboard } from "@/components/applicant/ApplicationAnalyticsDashboard"
import { JobAlertsManager } from "@/components/applicant/JobAlertsManager"
import { CareerResourcesHub } from "@/components/applicant/CareerResourcesHub"

interface Application {
  id: string
  appliedAt: Date
  job: {
    id: string
    title: string
    company: string
    location: string
    type: string
    applyUrl: string
  }
}

export default function ApplicantDashboardClient() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "applications"
  const [applications, setApplications] = React.useState<Application[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications")
      if (!response.ok) throw new Error("Failed to fetch applications")
      const data = await response.json()
      setApplications(data)
    } catch (error) {
      toast.error("Failed to load applications")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-7 lg:max-w-5xl">
        <TabsTrigger value="applications" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          <span className="hidden sm:inline">Applications</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="resume" className="flex items-center gap-2">
          📄
          <span className="hidden sm:inline">Resume</span>
        </TabsTrigger>
        <TabsTrigger value="interview" className="flex items-center gap-2">
          🎥
          <span className="hidden sm:inline">Interview</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          📊
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="alerts" className="flex items-center gap-2">
          🔔
          <span className="hidden sm:inline">Alerts</span>
        </TabsTrigger>
        <TabsTrigger value="resources" className="flex items-center gap-2">
          📚
          <span className="hidden sm:inline">Resources</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="applications" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Applications</CardTitle>
                <CardDescription>
                  Jobs you&apos;ve applied to ({applications.length})
                </CardDescription>
              </div>
              <Link href="/">
                <Button>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse All Jobs
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start applying to jobs to see them here
                </p>
                <Link href="/">
                  <Button>Browse Jobs</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {application.job.title}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {application.job.company}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {application.job.location}
                        </Badge>
                        <Badge variant="default">
                          {application.job.type.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Applied {format(new Date(application.appliedAt), "MMM d, yyyy")}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={`/jobs/${application.job.id}`} target="_blank">
                        <Button variant="outline" size="sm">
                          View Job
                        </Button>
                      </Link>
                      <a href={application.job.applyUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="w-full">
                          <ExternalLink className="mr-2 h-3 w-3" />
                          Application Link
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="profile" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Job Fit Profile
            </CardTitle>
            <CardDescription>
              Complete your profile to see how well you match job requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicantProfileForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="resume" className="space-y-4">
        <ResumeBuilder />
      </TabsContent>

      <TabsContent value="interview" className="space-y-4">
        <InterviewPrepSystem />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <ApplicationAnalyticsDashboard />
      </TabsContent>

      <TabsContent value="alerts" className="space-y-4">
        <JobAlertsManager />
      </TabsContent>

      <TabsContent value="resources" className="space-y-4">
        <CareerResourcesHub />
      </TabsContent>
    </Tabs>
  )
}
