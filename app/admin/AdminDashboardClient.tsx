"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Users, 
  UserCheck,
  ExternalLink,
  Trash2,
  Edit,
  BarChart3
} from "lucide-react"
import { Job } from "@prisma/client"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { JobFormDialog } from "@/components/JobFormDialog"
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
import { StatsCards } from "@/components/admin/StatsCards"
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts"
import { VisitorMap } from "@/components/admin/VisitorMap"

type JobWithEmployer = Job & {
  employer: {
    name: string
    email: string
    companyName: string | null
  }
  _count: {
    applications: number
  }
}

interface Stats {
  totalJobs: number
  pendingJobs: number
  approvedJobs: number
  rejectedJobs: number
  totalEmployers: number
  totalApplicants: number
  totalUsers: number
  totalRevenue: number
  totalViews: number
  totalLikes: number
  jobsChange: number
  usersChange: number
  revenueChange: number
  viewsChange: number
  likesChange: number
}

interface MonthlyData {
  month: string
  jobs: number
  applications: number
  views: number
}

interface VisitorData {
  country: string
  countryCode: string
  visitors: number
  percentage: number
  color: string
}

export default function AdminDashboardClient() {
  const [stats, setStats] = React.useState<Stats | null>(null)
  const [monthlyData, setMonthlyData] = React.useState<MonthlyData[]>([])
  const [visitorData, setVisitorData] = React.useState<VisitorData[]>([])
  const [jobs, setJobs] = React.useState<JobWithEmployer[]>([])
  const [filteredJobs, setFilteredJobs] = React.useState<JobWithEmployer[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [showAnalytics, setShowAnalytics] = React.useState(true)
  
  // Dialogs
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null)
  const [showEditDialog, setShowEditDialog] = React.useState(false)
  const [showRejectDialog, setShowRejectDialog] = React.useState(false)
  const [rejectionReason, setRejectionReason] = React.useState("")
  const [jobToDelete, setJobToDelete] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchData()
  }, [])

  React.useEffect(() => {
    let filtered = jobs

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.employer.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter)
    }

    setFilteredJobs(filtered)
  }, [jobs, searchQuery, statusFilter])

  const fetchData = async () => {
    try {
      const [statsRes, jobsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/jobs"),
      ])

      if (!statsRes.ok || !jobsRes.ok) throw new Error("Failed to fetch data")

      const statsData = await statsRes.json()
      const jobsData = await jobsRes.json()

      setStats(statsData.stats)
      setMonthlyData(statsData.monthlyData)
      setVisitorData(statsData.visitorData)
      setJobs(jobsData)
      setFilteredJobs(jobsData)
    } catch (error) {
      toast.error("Failed to load admin data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (jobId: string) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      })

      if (!response.ok) throw new Error("Failed to approve job")

      toast.success("Job approved successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to approve job")
    }
  }

  const handleReject = async () => {
    if (!selectedJob || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    try {
      const response = await fetch(`/api/admin/jobs/${selectedJob.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "rejected",
          rejectionReason 
        }),
      })

      if (!response.ok) throw new Error("Failed to reject job")

      toast.success("Job rejected successfully")
      setShowRejectDialog(false)
      setRejectionReason("")
      setSelectedJob(null)
      fetchData()
    } catch (error) {
      toast.error("Failed to reject job")
    }
  }

  const handleDelete = async () => {
    if (!jobToDelete) return

    try {
      const response = await fetch(`/api/jobs/${jobToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete job")

      toast.success("Job deleted successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to delete job")
    } finally {
      setJobToDelete(null)
    }
  }

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    if (newStatus === "rejected") {
      const job = jobs.find((j) => j.id === jobId)
      setSelectedJob(job || null)
      setShowRejectDialog(true)
      return
    }

    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      toast.success("Status updated successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const openEditDialog = (job: Job) => {
    setSelectedJob(job)
    setShowEditDialog(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      {/* View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant={showAnalytics ? "default" : "outline"}
          onClick={() => setShowAnalytics(true)}
          className="gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Analytics Dashboard
        </Button>
        <Button
          variant={!showAnalytics ? "default" : "outline"}
          onClick={() => setShowAnalytics(false)}
          className="gap-2"
        >
          <Briefcase className="h-4 w-4" />
          Job Management
        </Button>
      </div>

      {/* Analytics View */}
      {showAnalytics && stats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Visitor Map */}
          <VisitorMap visitorData={visitorData} />

          {/* Analytics Charts */}
          <AnalyticsCharts monthlyData={monthlyData} />
        </div>
      )}

      {/* Job Management View */}
      {!showAnalytics && (
        <>
          {/* Quick Stats Summary */}
          <div className="grid gap-4 md:grid-cols-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingJobs || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.approvedJobs || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.rejectedJobs || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employers</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalEmployers || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applicants</CardTitle>
                <UserCheck className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalApplicants || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs Table */}
          <Card>
        <CardHeader>
          <CardTitle>All Job Postings</CardTitle>
          <CardDescription>Manage and review all job postings on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search by title, company, or employer email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Apply Link</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center h-24">
                      No jobs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>
                        <a 
                          href={`mailto:${job.employer.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {job.employer.email}
                        </a>
                      </TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {job.type.replace("_", " ").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={job.status}
                          onValueChange={(value) => handleStatusChange(job.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Link
                        </a>
                      </TableCell>
                      <TableCell>{format(new Date(job.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell>{format(new Date(job.updatedAt), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {job.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(job.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedJob(job)
                                  setShowRejectDialog(true)
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(job)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setJobToDelete(job.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
        </CardContent>
      </Card>
        </>
      )}

      {/* Edit Job Dialog */}
      <JobFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        job={selectedJob}
        companyName={selectedJob?.company || ""}
        onSuccess={fetchData}
      />

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Job Posting</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this job posting. The employer will receive this in an email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason *</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Job description is incomplete, salary information missing, etc."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false)
                setRejectionReason("")
                setSelectedJob(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job posting and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
