"use client"

import { useState } from "react"
import Link from "next/link"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Star, UserPlus, Download } from "lucide-react"

interface UsersManagementClientProps {
  user: {
    id: string
    employerId?: string | null
    name?: string | null
    email?: string | null
    companyName?: string | null
  }
}

export default function UsersManagementClient({ user }: UsersManagementClientProps) {
  const [activeTab, setActiveTab] = useState("approved")

  const displayCompany = user.companyName || user.name || "Your company"
  const ownerDisplay = user.name ? `${user.name} • ${user.email}` : user.email || "-"
  const displayEmployerId = user.employerId || user.id || "-"

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Users</h1>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-1">
                  <Star className="h-6 w-6 text-orange-500 fill-orange-500" />
                  <Star className="h-6 w-6 text-orange-500 fill-orange-500" />
                  <Star className="h-6 w-6 text-orange-500 fill-orange-500" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Admins, better controls are here</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                    <span>New <strong>Limited</strong> permissions allow you to choose who can view candidates for specific jobs, but not any others</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                    <span>Set permissions when you add users or update current user access under <strong>Actions</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                    <span>Invite users individually or in bulk - you can always add more people at no cost</span>
                  </li>
                </ul>
              </div>
              <Button variant="ghost" size="sm">✕</Button>
            </div>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Users: {displayCompany}</CardTitle>
                  <CardDescription className="mt-1">Owner: {ownerDisplay}</CardDescription>
                </div>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add users
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="flex items-center justify-between border-b">
                  <TabsList className="border-none bg-transparent">
                    <TabsTrigger value="approved" className="relative">
                      <span className="font-semibold mr-2">1</span>
                      Approved
                    </TabsTrigger>
                    <TabsTrigger value="requests" className="relative">
                      <span className="font-semibold mr-2">0</span>
                      Requests
                    </TabsTrigger>
                  </TabsList>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <TabsContent value="approved" className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium">
                            Users
                            <button className="ml-2">⇅</button>
                          </th>
                          <th className="text-left px-4 py-3 text-sm font-medium">Access</th>
                          <th className="text-left px-4 py-3 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t hover:bg-muted/30">
                          <td className="px-4 py-4">
                            <span className="font-medium">{user.email}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-blue-500 text-blue-500" />
                                Admin
                              </Badge>
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-blue-500 text-blue-500" />
                                Owner
                              </Badge>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-muted-foreground text-sm">-</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" disabled>
                        ← Prev
                      </Button>
                      <span className="text-sm text-muted-foreground">1</span>
                      <Button variant="ghost" size="sm" disabled>
                        Next →
                      </Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <p className="text-xs text-muted-foreground">
                      By adding roles for users, I agree that this user&apos;s access will match the roles I have selected, and that I am authorized to grant such access. Pending invitations expire after 15 days. Need to change the owner of your ApplyNHire employer account?{" "}
                      <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link>.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {displayCompany}{displayEmployerId ? `, Employer ID: ${displayEmployerId}` : ""}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="requests" className="space-y-4">
                  <div className="text-center py-12">
                    <UserPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                    <p className="text-muted-foreground">User access requests will appear here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">©2025 Indeed</p>
              <div className="flex gap-4 text-sm">
                <Link href="/privacy" className="text-blue-600 hover:underline">Cookies, privacy and terms</Link>
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy center</Link>
                <Link href="/security" className="text-blue-600 hover:underline">Security</Link>
                <Link href="/employer/billing" className="text-blue-600 hover:underline">Billing</Link>
                <Link href="/contact" className="text-blue-600 hover:underline">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
