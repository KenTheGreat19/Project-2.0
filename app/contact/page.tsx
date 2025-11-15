"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Mail, 
  Send, 
  MessageSquare,
  HelpCircle,
  Briefcase,
  User,
  Clock,
  CheckCircle
} from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setLoading(false)
    setSubmitted(true)
    toast.success("Message sent successfully!")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="container max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We&apos;ve received your message and will get back to you within 24-48 hours.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Button onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A66C2] mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Have a question or need help? We&apos;re here for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#0A66C2]" />
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="employer">Employer Question</option>
                      <option value="applicant">Job Seeker Question</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#0A66C2] hover:bg-[#0A66C2]/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="mr-2">Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[#0A66C2]" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href="mailto:support@applynhire.com" 
                  className="text-[#0A66C2] hover:underline"
                >
                  support@applynhire.com
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  For general inquiries and support
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#0A66C2]" />
                  For Employers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href="mailto:employers@applynhire.com" 
                  className="text-[#0A66C2] hover:underline"
                >
                  employers@applynhire.com
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  Questions about posting jobs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#0A66C2]" />
                  For Job Seekers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href="mailto:applicants@applynhire.com" 
                  className="text-[#0A66C2] hover:underline"
                >
                  applicants@applynhire.com
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  Help with applications
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#0A66C2]" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We typically respond within 24-48 hours during business days.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-[#0A66C2]" />
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/privacy">
                  <Button variant="ghost" className="w-full justify-start text-[#0A66C2]">
                    Privacy Policy
                  </Button>
                </Link>
                <Link href="/terms">
                  <Button variant="ghost" className="w-full justify-start text-[#0A66C2]">
                    Terms of Service
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="ghost" className="w-full justify-start text-[#0A66C2]">
                    About Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
