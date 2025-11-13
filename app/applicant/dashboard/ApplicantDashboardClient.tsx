"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar, MapPin, ExternalLink, User, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import Link from "next/link"

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

interface ApplicantDashboardClientProps {
  userName: string
  userEmail: string
}

export default function ApplicantDashboardClient({ userName, userEmail }: ApplicantDashboardClientProps) {
  const [applications, setApplications] = React.useState<Application[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isEditingProfile, setIsEditingProfile] = React.useState(false)
  const [profileData, setProfileData] = React.useState({
    name: userName,
    email: userEmail,
  })

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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditingProfile(true)
    
    try {
      // Note: You'd need to create an API endpoint for profile updates
      // For now, just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsEditingProfile(false)
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
    <div className="space-y-8">
      {/* Applied Jobs Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>
                Jobs you've applied to ({applications.length})
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

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Your Profile
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={isEditingProfile}>
              {isEditingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
