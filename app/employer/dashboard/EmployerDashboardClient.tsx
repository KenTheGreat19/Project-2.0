"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { JobsDataTable } from "@/components/JobsDataTable"
import { JobFormDialog } from "@/components/JobFormDialog"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Plus, Briefcase, CheckCircle2, XCircle, Users } from "lucide-react"
import { Job } from "@prisma/client"
import { toast } from "sonner"

type JobWithApplications = Job & {
  _count: {
    applications: number
  }
}

interface EmployerDashboardClientProps {
  user: {
    name: string
    email: string
    companyName?: string
    employerType?: string | null
  }
}

export default function EmployerDashboardClient({ user }: EmployerDashboardClientProps) {
  const [jobs, setJobs] = React.useState<JobWithApplications[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [showJobDialog, setShowJobDialog] = React.useState(false)
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null)
  const [jobToDelete, setJobToDelete] = React.useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const companyName = user.companyName || user.name

  const fetchJobs = React.useCallback(async () => {
    try {
      const response = await fetch("/api/jobs")
      if (!response.ok) throw new Error("Failed to fetch jobs")
      const data = await response.json()
      setJobs(data)
    } catch (error) {
      toast.error("Failed to load jobs")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleEditJob = (job: Job) => {
    setSelectedJob(job)
    setShowJobDialog(true)
  }

  const handleDeleteJob = async () => {
    if (!jobToDelete) return

    try {
      const response = await fetch(`/api/jobs/${jobToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete job")

      toast.success("Job deleted successfully")
      fetchJobs()
    } catch (error) {
      toast.error("Failed to delete job")
    } finally {
      setJobToDelete(null)
    }
  }

  const handleNewJob = () => {
    setSelectedJob(null)
    setShowJobDialog(true)
  }

  const stats = React.useMemo(() => {
    const totalApplications = jobs.reduce((sum, job) => sum + (job._count?.applications || 0), 0)
    return {
      total: jobs.length,
      pending: jobs.filter((j) => j.status === "pending").length,
      approved: jobs.filter((j) => j.status === "approved").length,
      rejected: jobs.filter((j) => j.status === "rejected").length,
      totalApplications,
    }
  }, [jobs])

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <EmployerSidebar 
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileToggle={setMobileMenuOpen}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-30 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome back, {user.name || user.email}!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {companyName} • Manage your job postings
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground mt-1">Live on platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">Total received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Job Postings</CardTitle>
              <CardDescription>Manage all your job listings</CardDescription>
            </div>
            <Button onClick={handleNewJob}>
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <JobsDataTable
            data={jobs}
            onEdit={handleEditJob}
            onDelete={setJobToDelete}
          />
        </CardContent>
      </Card>

      <JobFormDialog
        open={showJobDialog}
        onOpenChange={setShowJobDialog}
        job={selectedJob}
        companyName={companyName}
        employerType={user.employerType}
        onSuccess={fetchJobs}
      />

      <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your job posting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteJob} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
