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
import { UserCheck, Search, Star } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

type User = {
  id: string
  email: string
  name: string | null
  role: string
  companyName: string | null
  location: string | null
  isVerified: boolean
  verificationStatus: string | null
  averageRating: number
  totalReviews: number
  createdAt: Date
  _count: {
    jobsPosted: number
    applications: number
  }
}

export default function AdminUsersClient() {
  const [users, setUsers] = React.useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = React.useState<User[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState("all")

  React.useEffect(() => {
    fetchUsers()
  }, [])

  React.useEffect(() => {
    let filtered = users

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchQuery, roleFilter])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      toast.error("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  const roleCounts = {
    all: users.length,
    EMPLOYER: users.filter(u => u.role === "EMPLOYER").length,
    APPLICANT: users.filter(u => u.role === "APPLICANT").length,
    ADMIN: users.filter(u => u.role === "ADMIN").length,
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
        <h2 className="text-3xl font-bold">User Management</h2>
        <p className="text-muted-foreground mt-1">Manage all users on the platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.all}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Employers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.EMPLOYER}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.APPLICANT}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.ADMIN}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="EMPLOYER">Employers</SelectItem>
                <SelectItem value="APPLICANT">Applicants</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "EMPLOYER" ? "default" : user.role === "APPLICANT" ? "secondary" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.companyName || "-"}</TableCell>
                      <TableCell>{user.location || "-"}</TableCell>
                      <TableCell>
                        {user.totalReviews > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{user.averageRating.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">({user.totalReviews})</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No reviews</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {user.role === "EMPLOYER" && `${user._count.jobsPosted} jobs`}
                        {user.role === "APPLICANT" && `${user._count.applications} applications`}
                        {user.role === "ADMIN" && "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {user.isVerified ? (
                          <Badge variant="default" className="gap-1 bg-green-600">
                            <UserCheck className="h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Not Verified</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="text-sm text-muted-foreground mt-4">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
