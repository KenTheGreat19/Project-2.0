"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Search } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

type Application = {
  id: string
  status: string
  appliedAt: Date
  applicant: {
    id: string
    name: string | null
    email: string
  }
  job: {
    id: string
    title: string
    company: string
    employer: {
      id: string
      name: string | null
      email: string
    }
  }
}

export default function AdminApplicationsClient() {
  const [applications, setApplications] = React.useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = React.useState<Application[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")

  React.useEffect(() => {
    fetchApplications()
  }, [])

  React.useEffect(() => {
    let filtered = applications

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.applicant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    setFilteredApplications(filtered)
  }, [applications, searchQuery, statusFilter])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/admin/applications")
      if (!response.ok) throw new Error("Failed to fetch applications")
      const data = await response.json()
      setApplications(data)
      setFilteredApplications(data)
    } catch (error) {
      toast.error("Failed to load applications")
    } finally {
      setIsLoading(false)
    }
  }

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    accepted: applications.filter(a => a.status === "accepted").length,
    rejected: applications.filter(a => a.status === "rejected").length,
    hired: applications.filter(a => a.status === "hired").length,
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
      <div>
        <h2 className="text-3xl font-bold">Applications Management</h2>
        <p className="text-muted-foreground mt-1">Monitor all job applications</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(statusCounts).map(([key, value]) => (
          <Card key={key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium capitalize">{key}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>View all job applications on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title or applicant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{app.applicant.name || "N/A"}</div>
                          <div className="text-xs text-muted-foreground">{app.applicant.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{app.job.title}</TableCell>
                      <TableCell>{app.job.company}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{app.job.employer.name || "N/A"}</div>
                          <div className="text-xs text-muted-foreground">{app.job.employer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            app.status === "hired" ? "default" :
                            app.status === "accepted" ? "secondary" :
                            app.status === "rejected" ? "destructive" :
                            "secondary"
                          }
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(app.appliedAt), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="text-sm text-muted-foreground mt-4">
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
