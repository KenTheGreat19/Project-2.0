"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lightbulb, TrendingUp, DollarSign, Users } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function HiringInsights() {
  const [country, setCountry] = useState("Philippines")
  const [jobTitle, setJobTitle] = useState("")
  const [location, setLocation] = useState("")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Lightbulb className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-3xl font-bold">Hiring Insights</h1>
          <p className="text-muted-foreground">
            Get market data relevant to your jobs
          </p>
        </div>
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Data range:</span>
        <Select defaultValue="october">
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="october">October 2025</SelectItem>
            <SelectItem value="september">September 2025</SelectItem>
            <SelectItem value="august">August 2025</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="link" className="text-primary">
          Compare to date range
        </Button>
      </div>

      {/* Search Form */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle>Get market data relevant to your jobs</CardTitle>
          <CardDescription>
            We surface insightful data, like average salary for similar jobs, how many job seekers are looking, and competing employers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Philippines">Philippines</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job title or occupational category</Label>
              <Input
                id="jobTitle"
                placeholder="e.g. Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Job location</Label>
              <Input
                id="location"
                placeholder="City or region"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <Button className="gap-2">
            Generate report
          </Button>
        </CardContent>
      </Card>

      {/* Illustration - Empty State */}
      <Card>
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="w-64 h-64 relative mb-6">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Light bulb illustration */}
                <circle cx="100" cy="120" r="40" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
                <path d="M80 120 L80 160 L120 160 L120 120" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
                <rect x="85" y="160" width="30" height="10" fill="#F59E0B" rx="2" />
                <line x1="100" y1="80" x2="100" y2="60" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                <line x1="70" y1="90" x2="55" y2="75" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                <line x1="130" y1="90" x2="145" y2="75" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                
                {/* Chart elements */}
                <rect x="20" y="40" width="15" height="30" fill="#DBEAFE" opacity="0.7" rx="2" />
                <rect x="40" y="25" width="15" height="45" fill="#BFDBFE" opacity="0.8" rx="2" />
                <rect x="160" y="30" width="15" height="40" fill="#DBEAFE" opacity="0.7" rx="2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">
              Get market data relevant to your jobs
            </h3>
            <p className="text-muted-foreground mb-6">
              We surface insightful data, like average salary for similar jobs, how many job seekers are looking, and competing employers.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle>Salary Insights</CardTitle>
            <CardDescription>
              Compare your offered salaries with market averages for similar roles in your region.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle>Candidate Pool</CardTitle>
            <CardDescription>
              Understand how many qualified candidates are actively searching for roles like yours.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle>Market Trends</CardTitle>
            <CardDescription>
              Stay informed about hiring trends, skill demand, and competitor activity in your industry.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Benefits Section */}
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-600" />
            How Hiring Insights Can Help You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">✓</span>
              <span>Make data-driven decisions about salary offerings and job requirements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">✓</span>
              <span>Understand your competition and position your job posts effectively</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">✓</span>
              <span>Identify the best times to post jobs based on candidate activity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">✓</span>
              <span>Optimize your job descriptions based on what candidates are searching for</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
