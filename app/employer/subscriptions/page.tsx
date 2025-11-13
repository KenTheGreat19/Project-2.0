"use client"

import { useState } from "react"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ExternalLink, Layers } from "lucide-react"

export default function SubscriptionsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Subscription management</h1>
            <p className="text-muted-foreground">Manage your subscriptions and activities</p>
          </div>

          <Tabs defaultValue="manage" className="space-y-6">
            <TabsList>
              <TabsTrigger value="manage">Manage Subscriptions</TabsTrigger>
              <TabsTrigger value="activity">Subscription Activity</TabsTrigger>
              <TabsTrigger value="report">
                Candidate sourcing report
                <ExternalLink className="ml-2 h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manage" className="space-y-6">
              <div className="flex items-center justify-center min-h-[500px]">
                <Card className="border-none shadow-none max-w-md">
                  <CardContent className="text-center space-y-6 pt-12">
                    <div className="flex justify-center">
                      <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Clock className="h-16 w-16 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">No subscriptions</h2>
                      <p className="text-muted-foreground">
                        Purchase a subscription to use Smart Sourcing
                      </p>
                    </div>
                    <Button size="lg" className="w-full max-w-xs">
                      Buy subscriptions
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle>Subscription activity</CardTitle>
                      <CardDescription>View your subscription usage and balance</CardDescription>
                    </div>
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Filter
                      </Button>
                      <span className="text-sm text-muted-foreground">1 result</span>
                    </div>
                    <Button variant="outline" size="sm">
                      All activity
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium">Date</th>
                          <th className="text-left px-4 py-3 text-sm font-medium">Source</th>
                          <th className="text-left px-4 py-3 text-sm font-medium">
                            Activity
                            <span className="ml-2 text-xs text-muted-foreground">ℹ</span>
                          </th>
                          <th className="text-left px-4 py-3 text-sm font-medium">Account</th>
                          <th className="text-left px-4 py-3 text-sm font-medium"></th>
                          <th className="text-left px-4 py-3 text-sm font-medium">Amount</th>
                          <th className="text-left px-4 py-3 text-sm font-medium">
                            Sub. balance
                            <span className="ml-2 text-xs text-muted-foreground">ℹ</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                            No activity found
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Total balance: 0</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Updated: Nov 14, 2025, 12:54 AM China Standard Time. This total balance includes activity during the period since the previously published total balance.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <span className="text-sm">1 - 1 of 1</span>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                    <div className="ml-4">
                      <select className="text-sm border rounded px-2 py-1">
                        <option>50 per page</option>
                        <option>100 per page</option>
                        <option>200 per page</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="report" className="space-y-6">
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    Candidate sourcing reports will appear here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Language Selector at bottom */}
          <div className="mt-12 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Choose the language you see on Indeed</p>
                <select className="border rounded px-3 py-2">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div className="flex gap-4 text-sm">
                <a href="#" className="text-blue-600 hover:underline">Frequently Asked Questions</a>
                <a href="#" className="text-blue-600 hover:underline">About</a>
                <a href="#" className="text-blue-600 hover:underline">Contact Indeed</a>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              © 2025 Indeed - Cookies, Privacy and Terms
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
