"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  Users,
  Search,
  Filter,
} from "lucide-react"
import { Job } from "@prisma/client"
import { toast } from "sonner"
import { format } from "date-fns"

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

export default function AdminJobsClient() {
  const [jobs, setJobs] = React.useState<JobWithEmployer[]>([])
  const [filteredJobs, setFilteredJobs] = React.useState<JobWithEmployer[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  
  const [selectedJob, setSelectedJob] = React.useState<JobWithEmployer | null>(null)
  const [showRejectDialog, setShowRejectDialog] = React.useState(false)
  const [rejectionReason, setRejectionReason] = React.useState("")
  const [jobToDelete, setJobToDelete] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchJobs()
  }, [])

  React.useEffect(() => {
    let filtered = jobs

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.employer.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status.toLowerCase() === statusFilter)
    }

    setFilteredJobs(filtered)
  }, [jobs, searchQuery, statusFilter])

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/admin/jobs")
      if (!response.ok) throw new Error("Failed to fetch jobs")
      const data = await response.json()
      setJobs(data)
      setFilteredJobs(data)
    } catch (error) {
      toast.error("Failed to load jobs")
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
      fetchJobs()
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
      fetchJobs()
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
      fetchJobs()
    } catch (error) {
      toast.error("Failed to delete job")
    } finally {
      setJobToDelete(null)
    }
  }

  const statusCounts = {
    all: jobs.length,
    pending: jobs.filter(j => j.status === "pending").length,
    approved: jobs.filter(j => j.status === "approved").length,
    rejected: jobs.filter(j => j.status === "rejected").length,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Job Management</h2>
        <p className="text-muted-foreground mt-1">Review, approve, and manage all job postings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.all}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Job Postings</CardTitle>
          <CardDescription>Manage and review all job postings on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, company, or employer email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Statuses" />
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Applications</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No jobs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {job.employer.companyName || job.employer.name}
                        <br />
                        <span className="text-xs">{job.employer.email}</span>
                      </TableCell>
                      <TableCell>{job.location || "Remote"}</TableCell>
                      <TableCell>{job.type}</TableCell>
                      <TableCell>
                        {job.status === "pending" && (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                        {job.status === "approved" && (
                          <Badge variant="default" className="gap-1 bg-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                            Approved
                          </Badge>
                        )}
                        {job.status === "rejected" && (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Rejected
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Users className="h-3 w-3" />
                          {job._count.applications}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(job.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <a href={`/jobs/${job.id}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          {job.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleApprove(job.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedJob(job)
                                  setShowRejectDialog(true)
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setJobToDelete(job.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

          <div className="text-sm text-muted-foreground mt-4">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Job</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this job posting. The employer will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="E.g., Job description violates our guidelines..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this job posting. This action cannot be undone.
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
    </div>
  )
}
