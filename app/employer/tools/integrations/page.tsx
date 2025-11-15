"use client"

import { useState } from "react"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Building2, CheckCircle2, Search, HelpCircle, ArrowRight, Briefcase, Users } from "lucide-react"

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Integrations</h1>
          </div>

          <Tabs defaultValue="discover" className="space-y-6">
            <TabsList>
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="my-integrations">My Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-6">
              {/* Hero Section */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">
                      Securely sync your ATS with Indeed <span className="text-blue-600">for free</span>—and hire faster
                    </h2>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <span>Reduce time spent switching between platforms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <span>Spend more time connecting with candidates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <span>Let top talent apply easily using their Indeed profiles</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-shrink-0 ml-8">
                    <div className="relative">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                          <Building2 className="h-12 w-12 text-blue-600" />
                          <p className="text-xs mt-2 font-semibold">ATS</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="h-1 w-16 bg-purple-600 rounded"></div>
                          <div className="h-1 w-16 bg-purple-600 rounded"></div>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                          <div className="h-12 w-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl">
                            i
                          </div>
                          <p className="text-xs mt-2 font-semibold">Indeed</p>
                        </div>
                      </div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                          <Briefcase className="h-6 w-6 text-green-600" />
                          <p className="text-xs text-center mt-1">Jobs</p>
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                          <Users className="h-6 w-6 text-purple-600" />
                          <p className="text-xs text-center mt-1">Candidates</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ATS Sync Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6" />
                    <CardTitle>ATS Sync</CardTitle>
                  </div>
                  <CardDescription>
                    ATS Sync seamlessly transfers job and candidate data between Indeed and your ATS to make hiring faster and easier. While exact functionality varies for each ATS system, here&apos;s a closer look at the integrations that may be available when you connect your ATS with Indeed.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Integration Cards */}
                    <div className="grid gap-4">
                      {/* Indeed Apply Sync */}
                      <Card className="border-2">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                              <Briefcase className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg">Indeed Apply Sync</h3>
                                <Button variant="ghost" size="sm">
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">
                                Candidates can apply to your ATS jobs on Indeed with our easy application process. Indeed Apply. Indeed applications automatically sync to your ATS and some ATS platforms support screener questions.
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                <Badge variant="secondary">Easy application</Badge>
                                <Badge variant="secondary">Auto sync</Badge>
                                <Badge variant="secondary">Screener support</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Disposition Sync */}
                      <Card className="border-2">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                              <CheckCircle2 className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg">Disposition Sync</h3>
                                <Button variant="ghost" size="sm">
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">
                                Update candidate status in your ATS and it automatically syncs to Indeed. Keep candidates informed about their application status.
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                <Badge variant="secondary">Status updates</Badge>
                                <Badge variant="secondary">Real-time sync</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                      <Button variant="ghost" size="icon" disabled>
                        ←
                      </Button>
                      <div className="flex gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                      </div>
                      <Button variant="ghost" size="icon">
                        →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search ATS Integrations */}
              <Card>
                <CardHeader>
                  <CardTitle>Search ATS integrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for your ATS"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Showing 301 results</p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Platinum Partners</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {["Workday", "SAP SuccessFactors", "Oracle Taleo", "iCIMS", "Greenhouse", "Lever"].map((ats) => (
                          <Card key={ats} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                                <Building2 className="h-6 w-6" />
                              </div>
                              <span className="font-medium">{ats}</span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="my-integrations" className="space-y-6">
              <div className="flex items-center justify-center min-h-[400px]">
                <Card className="border-none shadow-none max-w-md">
                  <CardContent className="text-center space-y-4 pt-12">
                    <div className="flex justify-center">
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <HelpCircle className="h-12 w-12 text-muted-foreground" />
                        <ArrowRight className="h-6 w-6 text-muted-foreground mx-auto mt-2" />
                        <div className="h-8 w-8 bg-blue-600 rounded mx-auto mt-2 flex items-center justify-center text-white font-bold">
                          i
                        </div>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold">You don&apos;t have any integrations</h2>
                    <p className="text-muted-foreground">
                      Get started on an integration to see it here.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      If you initiated an integration from your ATS, it may not show up here.
                    </p>
                    <Button>Discover integrations</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
