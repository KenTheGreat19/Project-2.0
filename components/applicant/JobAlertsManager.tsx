"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Bell, Plus, Trash2, Save, Loader2, Mail } from "lucide-react"

type JobAlert = {
  id: string
  title?: string
  location?: string
  jobType?: string
  category?: string
  minSalary?: number
  experienceLevel?: string
  isActive: boolean
  frequency: string
  lastSent?: string
  createdAt: string
}

export function JobAlertsManager() {
  const [alerts, setAlerts] = useState<JobAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Form fields
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")
  const [category, setCategory] = useState("")
  const [minSalary, setMinSalary] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [frequency, setFrequency] = useState("daily")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/job-alerts")
      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts || [])
      }
    } catch (error) {
      console.error("Error fetching job alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title && !location && !jobType && !category) {
      toast.error("Please specify at least one search criterion")
      return
    }

    setSaving(true)
    try {
      const data = {
        title: title || undefined,
        location: location || undefined,
        jobType: jobType || undefined,
        category: category || undefined,
        minSalary: minSalary ? parseInt(minSalary) : undefined,
        experienceLevel: experienceLevel || undefined,
        frequency,
        isActive,
      }

      const response = await fetch("/api/job-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success("Job alert created successfully!")
        fetchAlerts()
        resetForm()
      } else {
        toast.error("Failed to create job alert")
      }
    } catch (error) {
      console.error("Error saving job alert:", error)
      toast.error("Failed to create job alert")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alert?")) return

    try {
      const response = await fetch(`/api/job-alerts?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Alert deleted successfully!")
        fetchAlerts()
      } else {
        toast.error("Failed to delete alert")
      }
    } catch (error) {
      console.error("Error deleting alert:", error)
      toast.error("Failed to delete alert")
    }
  }

  const toggleAlert = async (alert: JobAlert) => {
    try {
      const response = await fetch("/api/job-alerts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: alert.id,
          isActive: !alert.isActive,
        }),
      })

      if (response.ok) {
        toast.success(`Alert ${!alert.isActive ? "enabled" : "disabled"}`)
        fetchAlerts()
      } else {
        toast.error("Failed to update alert")
      }
    } catch (error) {
      console.error("Error toggling alert:", error)
      toast.error("Failed to update alert")
    }
  }

  const resetForm = () => {
    setTitle("")
    setLocation("")
    setJobType("")
    setCategory("")
    setMinSalary("")
    setExperienceLevel("")
    setFrequency("daily")
    setIsActive(true)
    setShowForm(false)
  }

  const getAlertDescription = (alert: JobAlert) => {
    const parts = []
    if (alert.title) parts.push(`"${alert.title}"`)
    if (alert.jobType) parts.push(alert.jobType.replace("_", " "))
    if (alert.location) parts.push(`in ${alert.location}`)
    if (alert.category) parts.push(`(${alert.category})`)
    return parts.join(" ") || "All jobs"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Job Alerts
          </h2>
          <p className="text-muted-foreground">Get notified about new job opportunities</p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="mr-2 h-4 w-4" />
          Create Alert
        </Button>
      </div>

      {/* Alert Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Job Alert</CardTitle>
            <CardDescription>Set your preferences and get notified about matching jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Job Title / Keywords</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York"
                />
              </div>

              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Type</SelectItem>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Technology"
                />
              </div>

              <div className="space-y-2">
                <Label>Minimum Salary</Label>
                <Input
                  type="number"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  placeholder="50000"
                />
              </div>

              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Level</SelectItem>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notification Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Alert
                  </>
                )}
              </Button>
              <Button onClick={resetForm} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      {getAlertDescription(alert)}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{alert.frequency}</Badge>
                        {alert.minSalary && (
                          <Badge variant="outline">Min ${alert.minSalary.toLocaleString()}</Badge>
                        )}
                        {alert.experienceLevel && (
                          <Badge variant="outline">{alert.experienceLevel}</Badge>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={alert.isActive}
                      onCheckedChange={() => toggleAlert(alert)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {alert.lastSent && (
                <CardContent>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Last sent: {new Date(alert.lastSent).toLocaleDateString()}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Job Alerts Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create job alerts to get notified about new opportunities that match your criteria
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Alert
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="text-base">How Job Alerts Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Set up multiple alerts with different criteria</p>
          <p>• Choose how often you want to receive notifications</p>
          <p>• Get instant alerts for jobs that match your preferences</p>
          <p>• Pause or delete alerts anytime</p>
          <p>• Never miss an opportunity that&apos;s right for you</p>
        </CardContent>
      </Card>
    </div>
  )
}
