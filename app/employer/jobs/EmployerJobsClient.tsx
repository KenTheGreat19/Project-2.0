"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { JobsDataTable } from "@/components/JobsDataTable"
import { Job } from "@prisma/client"
import { JobFormDialog } from "@/components/JobFormDialog"
import { toast } from "sonner"
import { Briefcase, Filter, MapPin, Zap } from "lucide-react"
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

interface EmployerJobsClientProps {
  user: {
    name?: string | null
    companyName?: string | null
    employerType?: string | null
  }
}

type JobWithEmployer = Job & {
  employer?: {
    employerType?: string | null
    isVerified?: boolean
  }
  _count: {
    applications: number
  }
}

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
]

const MODES = [
  { value: "all", label: "Any work mode" },
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
]

export default function EmployerJobsClient({ user }: EmployerJobsClientProps) {
  const [jobs, setJobs] = useState<JobWithEmployer[]>([])
  const [loading, setLoading] = useState(true)
  const [showComposer, setShowComposer] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)

  const [statusFilter, setStatusFilter] = useState("all")
  const [modeFilter, setModeFilter] = useState("all")
  const [query, setQuery] = useState("")

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const status = searchParams.get("status")
    if (status && STATUS_FILTERS.some((s) => s.value === status)) {
      setStatusFilter(status)
    }
  }, [searchParams])

  useEffect(() => {
    let active = true
    const loadJobs = async () => {
      try {
        const res = await fetch("/api/jobs")
        if (!res.ok) throw new Error("Failed to fetch jobs")
        const data = await res.json()
        if (active) {
          const normalized = data.map((job: any) => ({
            ...job,
            _count: { applications: job._count?.applications ?? 0 },
          }))
          setJobs(normalized)
        }
      } catch (err) {
        toast.error("Unable to load jobs")
      } finally {
        if (active) setLoading(false)
      }
    }
    loadJobs()
    return () => {
      active = false
    }
  }, [])

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const statusPass = statusFilter === "all" ? true : job.status === statusFilter
      const modePass = modeFilter === "all" ? true : (job as any).workMode === modeFilter
      const queryPass = query
        ? job.title.toLowerCase().includes(query.toLowerCase()) ||
          (job.location || "").toLowerCase().includes(query.toLowerCase())
        : true
      return statusPass && modePass && queryPass
    })
  }, [jobs, statusFilter, modeFilter, query])

  const metrics = useMemo(() => {
    const total = jobs.length
    const approved = jobs.filter((job) => job.status === "approved").length
    const pending = jobs.filter((job) => job.status === "pending").length
    const needsLocation = jobs.filter((job) => !(job as any).locationLat || !(job as any).locationLng).length
    return { total, approved, pending, needsLocation }
  }, [jobs])

  const companyName = user.companyName || user.name || "Your company"

  const refreshJobs = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/jobs")
      if (!res.ok) throw new Error("Failed to refresh jobs")
      const data = await res.json()
      const normalized = data.map((job: any) => ({
        ...job,
        _count: { applications: job._count?.applications ?? 0 },
      }))
      setJobs(normalized)
      toast.success("Job list updated")
    } catch (err) {
      toast.error("Could not refresh jobs")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl space-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Jobs workspace</p>
            <h1 className="text-3xl font-bold">{companyName} · Job portfolio</h1>
            <p className="text-muted-foreground">
              Filter, analyze, and publish openings without leaving ApplyNHire.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total jobs</CardDescription>
                <CardTitle className="text-3xl">{metrics.total}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Across every status</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Approved</CardDescription>
                <CardTitle className="text-3xl">{metrics.approved}</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">Live</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending review</CardDescription>
                <CardTitle className="text-3xl">{metrics.pending}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Usually under 1 business day</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Missing map pin</CardDescription>
                <CardTitle className="text-3xl">{metrics.needsLocation}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Add a location to appear on maps</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Job portfolio</CardTitle>
                <CardDescription>Search and filter every posting</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={refreshJobs}>
                  <Zap className="mr-2 h-4 w-4" />
                  Refresh data
                </Button>
                <Button onClick={() => setShowComposer(true)}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Post job
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-4">
                <Input
                  placeholder="Search title or location"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <Select value={statusFilter} onValueChange={(value) => {
                  setStatusFilter(value)
                  const params = new URLSearchParams(searchParams)
                  if (value === "all") params.delete("status")
                  else params.set("status", value)
                  router.replace(`?${params.toString()}`)
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_FILTERS.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={modeFilter} onValueChange={setModeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODES.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => {
                  setStatusFilter("all")
                  setModeFilter("all")
                  setQuery("")
                  router.replace("/employer/jobs")
                }}>
                  <Filter className="mr-2 h-4 w-4" />
                  Reset filters
                </Button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((key) => (
                    <Skeleton key={key} className="h-24 w-full" />
                  ))}
                </div>
              ) : (
                <JobsDataTable
                  data={filteredJobs as any}
                  onEdit={(job) => {
                    setSelectedJob(job as Job)
                    setShowComposer(true)
                  }}
                  onDelete={(jobId) => setJobToDelete(jobId)}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location coverage</CardTitle>
              <CardDescription>Fill in missing coordinates to activate the job map</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredJobs.slice(0, 5).map((job) => {
                const hasCoordinates = Boolean((job as any).locationLat && (job as any).locationLng)
                return (
                  <div key={job.id} className="flex flex-wrap items-center gap-3 rounded-lg border p-4">
                    <div className="flex-1">
                      <p className="font-semibold">{job.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location || "No location provided"}
                      </p>
                    </div>
                    <Badge variant={hasCoordinates ? "default" : "secondary"}>
                      {hasCoordinates ? "Pinned" : "Needs pin"}
                    </Badge>
                  </div>
                )
              })}
              {filteredJobs.length === 0 && (
                <p className="text-sm text-muted-foreground">No jobs match the filters above.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <JobFormDialog
        open={showComposer}
        onOpenChange={(open) => {
          setShowComposer(open)
          if (!open) setSelectedJob(null)
        }}
        job={selectedJob ?? undefined}
        companyName={companyName}
        employerType={user.employerType}
        onSuccess={() => {
          setShowComposer(false)
          setSelectedJob(null)
          refreshJobs()
        }}
      />

      <AlertDialog open={!!jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone and will remove the posting from search results immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={async () => {
                if (!jobToDelete) return
                try {
                  const res = await fetch(`/api/jobs/${jobToDelete}`, { method: "DELETE" })
                  if (!res.ok) throw new Error("Failed to delete job")
                  toast.success("Job deleted")
                  setJobToDelete(null)
                  refreshJobs()
                } catch (err) {
                  toast.error("Could not delete job")
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
