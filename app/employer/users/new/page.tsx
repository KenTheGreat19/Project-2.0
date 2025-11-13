"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function NewUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "recruiter",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.role) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/employer/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success("Team member invitation sent successfully")
        router.push("/employer/dashboard")
      } else {
        const error = await res.json()
        toast.error(error.error || "Failed to send invitation")
      }
    } catch (error) {
      toast.error("Failed to send invitation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Add Team Member</h1>
              <p className="text-muted-foreground">
                Invite a new user to your employer account
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  User Information
                </CardTitle>
                <CardDescription>
                  Enter the details for the new team member
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="hiring_manager">Hiring Manager</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Invitation
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">About User Roles</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>Admin</strong>: Full access to all features and settings</li>
                  <li>• <strong>Recruiter</strong>: Can post jobs, view candidates, and schedule interviews</li>
                  <li>• <strong>Hiring Manager</strong>: Can view jobs and candidates, but cannot post</li>
                  <li>• <strong>Viewer</strong>: Read-only access to jobs and analytics</li>
                </ul>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
