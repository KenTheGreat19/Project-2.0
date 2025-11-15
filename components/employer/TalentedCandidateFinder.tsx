"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Filter } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function TalentedCandidateFinder() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Talented</h1>
        <p className="text-muted-foreground">
          Discover quality candidates instantly with Talented. Get tailored matches from millions of resumes for your job.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="find" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="find">Find candidates</TabsTrigger>
          <TabsTrigger value="plans">Plans and Pricing</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="saved">Saved searches</TabsTrigger>
        </TabsList>

        <TabsContent value="find" className="space-y-6">
          {/* Country Selector */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <Select defaultValue="philippines">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="philippines">Philippines</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Hero Section */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-none">
            <CardContent className="pt-12 pb-12">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl font-bold">
                  Let us find the best matches for you!
                </h2>
                <p className="text-lg text-muted-foreground">
                  Discover quality candidates instantly with Talented. Get tailored matches from millions of resumes for your job. 
                  Start your free trial and connect with up to 5 top candidates today.
                </p>
                <Button size="lg" className="gap-2">
                  Get 5 free contacts
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle>Discover and engage with top talent</CardTitle>
              <CardDescription>
                Let us know what you&apos;re looking for. We&apos;ll find top candidates for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Job title, skills, companies, or search syntax"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary"
                    >
                      + Add your job
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="City, state, or ZIP code"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button className="gap-2">
                  <Search className="h-4 w-4" />
                  Find
                </Button>
                <Button variant="secondary" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Recent Searches */}
              <div>
                <h4 className="text-sm font-medium mb-3">Recent searches</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    customer service
                  </Badge>
                  <Button variant="link" size="sm" className="text-primary h-auto p-0">
                    Clear all
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Smart Matching</CardTitle>
                <CardDescription>
                  Our AI-powered system finds the most relevant candidates based on your job requirements and company culture.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Location-Based</CardTitle>
                <CardDescription>
                  Filter candidates by location, remote preference, and willingness to relocate for better matches.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                  <Filter className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Advanced Filters</CardTitle>
                <CardDescription>
                  Use advanced search criteria including skills, experience level, education, and more.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Plans and Pricing</CardTitle>
              <CardDescription>
                Choose the plan that works best for your hiring needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Pricing options coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Your Projects</CardTitle>
              <CardDescription>
                Manage your candidate search projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No projects yet</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Searches</CardTitle>
              <CardDescription>
                Access your previously saved candidate searches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No saved searches</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
