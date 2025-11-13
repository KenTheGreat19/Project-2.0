"use client"

import { useState, useEffect } from "react"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Copy, Edit, Users as UsersIcon, Building2 } from "lucide-react"
import { toast } from "sonner"

export default function EmployerSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [editNameDialog, setEditNameDialog] = useState(false)
  const [editEmailDialog, setEditEmailDialog] = useState(false)
  const [editPhoneDialog, setEditPhoneDialog] = useState(false)
  const [editOrgDialog, setEditOrgDialog] = useState(false)
  
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
  })

  const [orgInfo, setOrgInfo] = useState({
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
    companySize: "",
    industry: "",
    contactPhone: "",
  })

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [orgForm, setOrgForm] = useState({
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
    companySize: "",
    industry: "",
    contactPhone: "",
  })

  useEffect(() => {
    fetchProfile()
    fetchOrganization()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/employer/profile")
      if (response.ok) {
        const data = await response.json()
        setPersonalInfo({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          jobTitle: data.jobTitle || "",
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const fetchOrganization = async () => {
    try {
      const response = await fetch("/api/employer/organization")
      if (response.ok) {
        const data = await response.json()
        setOrgInfo(data)
      }
    } catch (error) {
      console.error("Error fetching organization:", error)
    }
  }

  const handleSaveName = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/employer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...personalInfo, name: editForm.name }),
      })

      if (response.ok) {
        const data = await response.json()
        setPersonalInfo(prev => ({ ...prev, name: data.name }))
        setEditNameDialog(false)
        toast.success("Name updated successfully")
      } else {
        toast.error("Failed to update name")
      }
    } catch (error) {
      toast.error("Failed to update name")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEmail = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/employer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...personalInfo, email: editForm.email }),
      })

      if (response.ok) {
        const data = await response.json()
        setPersonalInfo(prev => ({ ...prev, email: data.email }))
        setEditEmailDialog(false)
        toast.success("Email updated successfully")
      } else {
        toast.error("Failed to update email")
      }
    } catch (error) {
      toast.error("Failed to update email")
    } finally {
      setLoading(false)
    }
  }

  const handleSavePhone = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/employer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...personalInfo, phone: editForm.phone }),
      })

      if (response.ok) {
        const data = await response.json()
        setPersonalInfo(prev => ({ ...prev, phone: data.phone || "" }))
        setEditPhoneDialog(false)
        toast.success("Phone updated successfully")
      } else {
        toast.error("Failed to update phone")
      }
    } catch (error) {
      toast.error("Failed to update phone")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveOrganization = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/employer/organization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orgForm),
      })

      if (response.ok) {
        const data = await response.json()
        setOrgInfo(data)
        setEditOrgDialog(false)
        toast.success("Organization updated successfully")
      } else {
        toast.error("Failed to update organization")
      }
    } catch (error) {
      toast.error("Failed to update organization")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/employer/invite`
    navigator.clipboard.writeText(inviteLink)
    toast.success("Invite link copied to clipboard")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Employer settings</h1>
            <p className="text-muted-foreground">Manage your employer account settings</p>
          </div>

          <Tabs defaultValue="account" className="space-y-6">
            <TabsList>
              <TabsTrigger value="account">Your account</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="access">Access & permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">Your employer account</h2>
                <p className="text-muted-foreground">Options to manage your personal info and preferences</p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5" />
                    <CardTitle>Personal info</CardTitle>
                  </div>
                  <CardDescription>
                    Your name and/or role may be visible to job seekers and other members of your organization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <div className="flex items-center justify-between">
                        <span>{personalInfo.name || "Not set"}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEditForm(prev => ({ ...prev, name: personalInfo.name }))
                            setEditNameDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600">{personalInfo.email}</span>
                        <Button 
                          variant="link" 
                          size="sm"
                          onClick={() => {
                            setEditForm(prev => ({ ...prev, email: personalInfo.email }))
                            setEditEmailDialog(true)
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <div className="flex items-center justify-between">
                        <span>{personalInfo.phone || "Not set"}</span>
                        <Button 
                          variant="link" 
                          size="sm"
                          onClick={() => {
                            setEditForm(prev => ({ ...prev, phone: personalInfo.phone || "" }))
                            setEditPhoneDialog(true)
                          }}
                        >
                          {personalInfo.phone ? "Change" : "Add"}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <div className="flex items-center justify-between">
                        <span>{personalInfo.jobTitle || "Not set"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organization" className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">Organization settings</h2>
                <p className="text-muted-foreground">Manage your organization contact information</p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      <CardTitle>Organization contact info</CardTitle>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setOrgForm(orgInfo)
                        setEditOrgDialog(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-muted-foreground">Company name</Label>
                      <p className="font-medium">{orgInfo.companyName || "Not set"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-medium">{orgInfo.contactPhone || "Not set"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Website</Label>
                      <p className="font-medium text-blue-600">{orgInfo.companyWebsite || "Not set"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Industry</Label>
                      <p className="font-medium">{orgInfo.industry || "Not set"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="access" className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">Access & permissions</h2>
                <p className="text-muted-foreground">Manage access requests and user permissions</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Invite link</CardTitle>
                  <CardDescription>
                    Share this link with team members to join your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/employer/invite`}
                      readOnly
                      className="flex-1"
                    />
                    <Button onClick={handleCopyLink}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Name Dialog */}
      <Dialog open={editNameDialog} onOpenChange={setEditNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Name</DialogTitle>
            <DialogDescription>Update your display name</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditNameDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveName} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Email Dialog */}
      <Dialog open={editEmailDialog} onOpenChange={setEditEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
            <DialogDescription>Update your email address</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEmailDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEmail} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Phone Dialog */}
      <Dialog open={editPhoneDialog} onOpenChange={setEditPhoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Phone Number</DialogTitle>
            <DialogDescription>Update your phone number</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPhoneDialog(false)}>Cancel</Button>
            <Button onClick={handleSavePhone} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Organization Dialog */}
      <Dialog open={editOrgDialog} onOpenChange={setEditOrgDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Organization Information</DialogTitle>
            <DialogDescription>Update your organization contact details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={orgForm.companyName}
                  onChange={(e) => setOrgForm(prev => ({ ...prev, companyName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={orgForm.contactPhone}
                  onChange={(e) => setOrgForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="companyWebsite">Website</Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  value={orgForm.companyWebsite}
                  onChange={(e) => setOrgForm(prev => ({ ...prev, companyWebsite: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={orgForm.industry}
                  onChange={(e) => setOrgForm(prev => ({ ...prev, industry: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Input
                  id="companySize"
                  value={orgForm.companySize}
                  onChange={(e) => setOrgForm(prev => ({ ...prev, companySize: e.target.value }))}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="companyDescription">Description</Label>
                <Textarea
                  id="companyDescription"
                  value={orgForm.companyDescription}
                  onChange={(e) => setOrgForm(prev => ({ ...prev, companyDescription: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOrgDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveOrganization} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
