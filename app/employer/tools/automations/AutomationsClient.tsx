"use client"

import { useState } from "react"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Workflow, Zap, BellRing, ArrowRight } from "lucide-react"

interface AutomationsClientProps {
  user: {
    name?: string | null
    companyName?: string | null
  }
}

type Automation = {
  id: string
  name: string
  description: string
  metric: string
  enabled: boolean
  lastRun: string
  category: "messaging" | "screening" | "nurture"
}

const INITIAL_AUTOMATIONS: Automation[] = [
  {
    id: "1",
    name: "Instant applicant reply",
    description: "Send a branded acknowledgement email within 5 minutes of every application.",
    metric: "Avg. response 3m",
    enabled: true,
    lastRun: "5 minutes ago",
    category: "messaging",
  },
  {
    id: "2",
    name: "Screening question routing",
    description: "Auto-label candidates that pass knockout questions and push them to interviews.",
    metric: "12 passes this week",
    enabled: false,
    lastRun: "Yesterday",
    category: "screening",
  },
  {
    id: "3",
    name: "Silent candidate nurture",
    description: "Follow up with qualified talent that has been idle for more than 3 days.",
    metric: "7 follow-ups queued",
    enabled: true,
    lastRun: "Today",
    category: "nurture",
  },
]

const TEMPLATE_LIBRARY = [
  {
    title: "Interview reminders",
    copy: "Keep candidates informed with SMS + email nudges.",
  },
  {
    title: "Offer fast-track",
    copy: "Alert HR when approvals are complete so offers go out instantly.",
  },
  {
    title: "Re-engage silver medalists",
    copy: "Send new roles to finalists who narrowly missed out.",
  },
]

export default function AutomationsClient({ user }: AutomationsClientProps) {
  const [automations, setAutomations] = useState(INITIAL_AUTOMATIONS)
  const [activeTab, setActiveTab] = useState("active")

  const toggleAutomation = (id: string) => {
    setAutomations((prev) => prev.map((automation) => (automation.id === id ? { ...automation, enabled: !automation.enabled } : automation)))
  }

  const filteredAutomations = automations.filter((automation) => {
    if (activeTab === "active") return automation.enabled
    if (activeTab === "paused") return !automation.enabled
    return true
  })

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl space-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Automations</p>
            <h1 className="text-3xl font-bold">Let workflows handle the busywork</h1>
            <p className="text-muted-foreground">
              {user.companyName || user.name || "Your company"} · Automate messaging, routing, and reminders
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Active workflows</CardTitle>
                <CardDescription>Running in the background</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{automations.filter((a) => a.enabled).length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Time saved this week</CardTitle>
                <CardDescription>Based on historical averages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">6.5 hrs</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Candidate touchpoints</CardTitle>
                <CardDescription>Automated comms sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">28</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Workflow library</CardTitle>
                <CardDescription>Toggle automations on or off at any time</CardDescription>
              </div>
              <Button className="w-full lg:w-auto">
                <Zap className="mr-2 h-4 w-4" />
                Build custom workflow
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="paused">Paused</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="mt-6 space-y-4">
                {filteredAutomations.length === 0 && (
                  <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                    Nothing to show here yet.
                  </div>
                )}
                {filteredAutomations.map((automation) => (
                  <div key={automation.id} className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-lg font-semibold">{automation.name}</p>
                        <Badge variant={automation.enabled ? "default" : "secondary"}>
                          {automation.enabled ? "Live" : "Paused"}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{automation.description}</p>
                      <p className="mt-2 text-xs text-muted-foreground uppercase tracking-wide">{automation.metric}</p>
                    </div>
                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <span className="text-sm text-muted-foreground">Last run: {automation.lastRun}</span>
                      <div className="flex items-center gap-2">
                        <Switch checked={automation.enabled} onCheckedChange={() => toggleAutomation(automation.id)} />
                        <span className="text-sm">{automation.enabled ? "Enabled" : "Enable"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Template starter kits</CardTitle>
                <CardDescription>Popular recipes loved by high-volume teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {TEMPLATE_LIBRARY.map((template) => (
                  <div key={template.title} className="flex items-start gap-3 rounded-lg border p-3">
                    <BellRing className="mt-1 h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-semibold">{template.title}</p>
                      <p className="text-sm text-muted-foreground">{template.copy}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality safeguards</CardTitle>
                <CardDescription>Let automations work while you stay in control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Require human approval before offers are sent", "Log every touchpoint to your ATS timeline", "Pause campaigns when response rate dips below target"].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-lg border p-3">
                    <Workflow className="mt-1 h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full justify-between">
                  Explore advanced guardrails
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
