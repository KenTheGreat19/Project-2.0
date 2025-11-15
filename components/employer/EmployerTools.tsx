"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Zap, 
  Grid3x3, 
  Building2, 
  PlayCircle, 
  ExternalLink,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function EmployerTools() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Tools</h1>
        <p className="text-muted-foreground">
          Streamline your hiring workflow with integrations and automations
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="action-center">Action Center</TabsTrigger>
          <TabsTrigger value="integrations">ATS Integrations</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Grid3x3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Action Center</CardTitle>
                <CardDescription>
                  Manage all your hiring tasks in one place. Stay organized with centralized workflow management.
                </CardDescription>
              </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="gap-2 p-0 h-auto" asChild>
                    <Link href="/employer/tools/action-center">
                      Go to Action Center
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
                  <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>ATS Integrations</CardTitle>
                <CardDescription>
                  Connect your Applicant Tracking System to sync candidates and streamline your workflow.
                </CardDescription>
              </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="gap-2 p-0 h-auto" asChild>
                    <Link href="/employer/tools/integrations">
                      View Integrations
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Automations</CardTitle>
                <CardDescription>
                  Set up automated workflows to save time on repetitive tasks and speed up hiring.
                </CardDescription>
              </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="gap-2 p-0 h-auto" asChild>
                    <Link href="/employer/tools/automations">
                      Configure Automations
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resource Library */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Resource Library
                  <ExternalLink className="h-4 w-4" />
                </CardTitle>
                <CardDescription>
                  Learn how to maximize your hiring efficiency
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Getting Started Guide</h4>
                    <p className="text-sm text-muted-foreground">
                      Learn the basics of setting up your employer account and posting jobs
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                    <PlayCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Integration Setup</h4>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step guide to connecting your ATS and other tools
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                    <PlayCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Automation Best Practices</h4>
                    <p className="text-sm text-muted-foreground">
                      Optimize your hiring workflow with smart automation strategies
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center shrink-0">
                    <PlayCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Advanced Features</h4>
                    <p className="text-sm text-muted-foreground">
                      Unlock the full potential of ApplyNHire&apos;s employer tools
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Why Use ApplyNHire Tools?</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Save Time</div>
                    <div className="text-sm text-muted-foreground">
                      Automate repetitive tasks and focus on finding the right candidates
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Stay Organized</div>
                    <div className="text-sm text-muted-foreground">
                      Centralize your hiring workflow in one powerful platform
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Integrate Seamlessly</div>
                    <div className="text-sm text-muted-foreground">
                      Connect with your existing ATS and HR tools effortlessly
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Make Better Decisions</div>
                    <div className="text-sm text-muted-foreground">
                      Access insights and analytics to optimize your hiring strategy
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="action-center">
          <Card>
            <CardHeader>
              <CardTitle>Action Center</CardTitle>
              <CardDescription>
                Manage all your hiring tasks in one centralized location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Grid3x3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No active tasks</h3>
                <p className="text-muted-foreground">
                  Your action center will display pending tasks and important updates
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>ATS Integrations</CardTitle>
              <CardDescription>
                Connect your Applicant Tracking System to ApplyNHire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Integrate with popular ATS platforms to automatically sync candidates and streamline your workflow.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {["Greenhouse", "Lever", "Workday", "BambooHR", "JazzHR", "iCIMS"].map((ats) => (
                    <div key={ats} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{ats}</div>
                          <div className="text-sm text-muted-foreground">ATS Platform</div>
                        </div>
                      </div>
                        <Button variant="secondary" size="sm" asChild>
                          <Link href={`/employer/tools/integrations?ats=${encodeURIComponent(ats)}`}>
                            Connect
                          </Link>
                        </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automations">
          <Card>
            <CardHeader>
              <CardTitle>Automations</CardTitle>
              <CardDescription>
                Create automated workflows to speed up your hiring process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Zap className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No automations configured</h3>
                <p className="text-muted-foreground mb-4">
                  Set up automations to handle repetitive tasks automatically
                </p>
                  <Button className="gap-2" asChild>
                    <Link href="/employer/tools/automations">
                      <Zap className="h-4 w-4" />
                      Create Automation
                    </Link>
                  </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
