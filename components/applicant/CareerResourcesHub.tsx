"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, Video, FileText, DollarSign, Lightbulb, 
  TrendingUp, Award, MessageSquare, ExternalLink 
} from "lucide-react"

export function CareerResourcesHub() {
  const resources = [
    {
      category: "Resume Tips",
      icon: FileText,
      color: "text-blue-600",
      items: [
        { title: "How to Write an ATS-Friendly Resume", readTime: "5 min", link: "#" },
        { title: "Top 10 Resume Mistakes to Avoid", readTime: "4 min", link: "#" },
        { title: "Power Words for Your Resume", readTime: "3 min", link: "#" },
      ]
    },
    {
      category: "Interview Preparation",
      icon: Video,
      color: "text-purple-600",
      items: [
        { title: "Common Interview Questions & Answers", readTime: "10 min", link: "#" },
        { title: "STAR Method: Master Behavioral Interviews", readTime: "7 min", link: "#" },
        { title: "Video Interview Best Practices", readTime: "6 min", link: "#" },
      ]
    },
    {
      category: "Salary Negotiation",
      icon: DollarSign,
      color: "text-green-600",
      items: [
        { title: "How to Negotiate Your Salary", readTime: "8 min", link: "#" },
        { title: "Research Market Rates for Your Role", readTime: "5 min", link: "#" },
        { title: "When and How to Discuss Compensation", readTime: "6 min", link: "#" },
      ]
    },
    {
      category: "Career Development",
      icon: TrendingUp,
      color: "text-orange-600",
      items: [
        { title: "Building Your Personal Brand", readTime: "9 min", link: "#" },
        { title: "Networking Strategies for Job Seekers", readTime: "7 min", link: "#" },
        { title: "How to Switch Career Paths Successfully", readTime: "12 min", link: "#" },
      ]
    },
  ]

  const tools = [
    {
      title: "Salary Calculator",
      description: "Calculate your expected salary based on experience and location",
      icon: DollarSign,
      color: "bg-green-100 text-green-700",
      action: "Calculate",
    },
    {
      title: "Skills Assessment",
      description: "Identify your strengths and areas for improvement",
      icon: Award,
      color: "bg-purple-100 text-purple-700",
      action: "Assess",
    },
    {
      title: "Cover Letter Generator",
      description: "Create tailored cover letters for job applications",
      icon: FileText,
      color: "bg-blue-100 text-blue-700",
      action: "Generate",
    },
    {
      title: "Career Coaching",
      description: "Get personalized advice from career experts",
      icon: MessageSquare,
      color: "bg-orange-100 text-orange-700",
      action: "Book Session",
    },
  ]

  const certifications = [
    { name: "Google Career Certificates", provider: "Google", category: "Technology" },
    { name: "AWS Certified Solutions Architect", provider: "Amazon", category: "Cloud" },
    { name: "PMP Certification", provider: "PMI", category: "Project Management" },
    { name: "HubSpot Inbound Marketing", provider: "HubSpot", category: "Marketing" },
    { name: "Salesforce Administrator", provider: "Salesforce", category: "CRM" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Career Resources
        </h2>
        <p className="text-muted-foreground">
          Everything you need to succeed in your job search
        </p>
      </div>

      {/* Quick Tools */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Tools</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, i) => (
            <Card key={i} className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-2`}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-base">{tool.title}</CardTitle>
                <CardDescription className="text-xs">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" size="sm" className="w-full">
                  {tool.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Resources */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Learning Resources</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {resources.map((section, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className={`h-5 w-5 ${section.color}`} />
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex items-start justify-between p-3 border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          📖 {item.readTime} read
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Popular Certifications
          </CardTitle>
          <CardDescription>
            Boost your career with industry-recognized certifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {certifications.map((cert, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-sm">{cert.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{cert.provider}</span>
                    <Badge variant="secondary" className="text-xs">{cert.category}</Badge>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Search Tips */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Quick Tips for Success
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>✅ <strong>Apply Early:</strong> Be among the first 10 applicants to increase visibility</p>
          <p>✅ <strong>Tailor Your Resume:</strong> Customize for each application using keywords from the job description</p>
          <p>✅ <strong>Follow Up:</strong> Send a polite follow-up email 1-2 weeks after applying</p>
          <p>✅ <strong>Network Actively:</strong> 70% of jobs are found through networking</p>
          <p>✅ <strong>Practice Interviewing:</strong> Mock interviews improve performance by 30%</p>
          <p>✅ <strong>Stay Organized:</strong> Track all applications and follow-ups systematically</p>
          <p>✅ <strong>Keep Learning:</strong> Continuously update your skills with online courses</p>
        </CardContent>
      </Card>

      {/* External Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended External Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button variant="secondary" className="justify-start" asChild>
              <a href="https://www.linkedin.com/learning" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                LinkedIn Learning
              </a>
            </Button>
            <Button variant="secondary" className="justify-start" asChild>
              <a href="https://www.coursera.org" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Coursera
              </a>
            </Button>
            <Button variant="secondary" className="justify-start" asChild>
              <a href="https://www.udemy.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Udemy
              </a>
            </Button>
            <Button variant="secondary" className="justify-start" asChild>
              <a href="https://www.glassdoor.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Glassdoor (Company Reviews)
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
