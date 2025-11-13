"use client"

import { useState } from "react"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Shield, Smartphone, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function AccountSettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account security and preferences</p>
          </div>

          <Tabs defaultValue="security" className="space-y-6">
            <TabsList>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="devices">Device Management</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    <CardTitle>Password</CardTitle>
                  </div>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button onClick={() => toast.success("Password updated successfully")}>
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </div>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">Enable 2FA</div>
                      <div className="text-sm text-muted-foreground">
                        Require a verification code in addition to your password
                      </div>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                  </div>
                  {twoFactorEnabled && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm mb-3">
                        Scan this QR code with your authenticator app
                      </p>
                      <div className="flex justify-center p-4 bg-white rounded">
                        <div className="h-48 w-48 bg-gray-200 flex items-center justify-center">
                          QR Code Placeholder
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 text-center">
                        Or enter this code manually: XXXX-XXXX-XXXX-XXXX
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Communications Tab */}
            <TabsContent value="communications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Choose what emails you'd like to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">New Applications</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified when candidates apply to your jobs
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Application Updates</div>
                      <div className="text-sm text-muted-foreground">
                        Updates about candidates you've contacted
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Marketing Emails</div>
                      <div className="text-sm text-muted-foreground">
                        Tips, guides, and product updates
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Weekly Summary</div>
                      <div className="text-sm text-muted-foreground">
                        Weekly report of your hiring activity
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Device Management Tab */}
            <TabsContent value="devices" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    <CardTitle>Active Sessions</CardTitle>
                  </div>
                  <CardDescription>Manage devices where you're currently logged in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex gap-3">
                      <Smartphone className="h-5 w-5 mt-1" />
                      <div>
                        <div className="font-medium">Current Device</div>
                        <div className="text-sm text-muted-foreground">
                          Windows • Chrome • Manila, Philippines
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Last active: Just now
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Current
                    </Button>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No other active sessions</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your data and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Profile Visibility</div>
                      <div className="text-sm text-muted-foreground">
                        Make your company profile visible to candidates
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Show in Search Results</div>
                      <div className="text-sm text-muted-foreground">
                        Allow your company to appear in job board searches
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Analytics Tracking</div>
                      <div className="text-sm text-muted-foreground">
                        Help us improve by sharing usage data
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="pt-4 border-t">
                    <Button variant="destructive">Delete Account</Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
