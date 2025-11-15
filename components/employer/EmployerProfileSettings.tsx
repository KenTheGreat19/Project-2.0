"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  CreditCard, 
  RefreshCw, 
  Settings as SettingsIcon, 
  Building2, 
  Users, 
  Grid3x3, 
  Mail,
  ExternalLink
} from "lucide-react"

interface EmployerProfileSettingsProps {
  user: {
    id: string
    employerId?: string | null
    name?: string | null
    email?: string | null
    companyName?: string | null
  }
}

export function EmployerProfileSettings({ user }: EmployerProfileSettingsProps) {
  const [companyName, setCompanyName] = useState(user.companyName || "")
  const [companyDescription, setCompanyDescription] = useState("")
  const [website, setWebsite] = useState("")

  return (
    <div className="space-y-6">
      {/* Account Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{user.companyName || user.name || "No account name"}</CardTitle>
              <CardDescription className="mt-1">{user.email || "-"}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CreditCard className="h-5 w-5 text-muted-foreground mr-2" />
            <CardTitle className="text-base font-medium">Billing and invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage your billing information and view invoices
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <RefreshCw className="h-5 w-5 text-muted-foreground mr-2" />
            <CardTitle className="text-base font-medium">Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View and manage your active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <SettingsIcon className="h-5 w-5 text-muted-foreground mr-2" />
            <CardTitle className="text-base font-medium">Employer settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure your employer account preferences
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Building2 className="h-5 w-5 text-muted-foreground mr-2" />
            <CardTitle className="text-base font-medium">Company page</CardTitle>
            <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View and edit your public company profile
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Users className="h-5 w-5 text-muted-foreground mr-2" />
            <CardTitle className="text-base font-medium">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage team members and permissions
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Grid3x3 className="h-5 w-5 text-muted-foreground mr-2" />
            <CardTitle className="text-base font-medium">ATS Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect with applicant tracking systems
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Mail className="h-5 w-5 text-muted-foreground mr-2" />
            <CardTitle className="text-base font-medium">Contact us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get help from our support team
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account settings</CardTitle>
          <CardDescription>
            Manage your account preferences and security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-base">Account settings</Label>
              <p className="text-sm text-muted-foreground">
                Update your email and password
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Update your company details visible to candidates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Company Website</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              placeholder="Tell candidates about your company..."
              rows={4}
            />
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-2">
            <ExternalLink className="h-4 w-4" />
            Visit ApplyNHire for job seekers
          </Button>
          <Button variant="secondary" className="w-full justify-start gap-2 text-red-600 hover:text-red-700">
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
