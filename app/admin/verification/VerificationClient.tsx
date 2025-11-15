"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

type VerificationUser = {
  id: string
  email: string
  name: string | null
  companyName: string | null
  verificationStatus: string
  createdAt: Date
}

export default function AdminVerificationClient() {
  const [users, setUsers] = React.useState<VerificationUser[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchVerifications()
  }, [])

  const fetchVerifications = async () => {
    try {
      const response = await fetch("/api/verification/documents?status=PENDING")
      if (!response.ok) throw new Error("Failed to fetch verifications")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      toast.error("Failed to load verifications")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (userId: string, status: "VERIFIED" | "REJECTED") => {
    try {
      const response = await fetch(`/api/admin/verification/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: status }),
      })

      if (!response.ok) throw new Error("Failed to update verification")
      toast.success(`Employer ${status.toLowerCase()} successfully`)
      fetchVerifications()
    } catch (error) {
      toast.error("Failed to update verification")
    }
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
        <h2 className="text-3xl font-bold">Employer Verification</h2>
        <p className="text-muted-foreground mt-1">Review and approve employer verification requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
          <CardDescription>{users.length} employers waiting for verification</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No pending verifications</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.companyName || "N/A"}</TableCell>
                      <TableCell>{user.name || "N/A"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Pending</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            className="gap-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleVerify(user.id, "VERIFIED")}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                            onClick={() => handleVerify(user.id, "REJECTED")}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
