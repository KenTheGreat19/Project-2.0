"use client"

import { useState } from "react"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { MessageCircle, Phone, Mail, ExternalLink, Clock, HelpCircle, ChevronRight, FileText, BookOpen, Lightbulb } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export default function ContactPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
            <p className="text-muted-foreground">Get help with your employer account</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Options */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    How can we help you today?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Chat Support */}
                  <Button
                    variant={selectedOption === "chat" ? "default" : "outline"}
                    className="w-full justify-start h-auto py-4"
                    onClick={() => setSelectedOption("chat")}
                  >
                    <div className="flex items-start gap-3 text-left w-full">
                      <MessageCircle className="h-6 w-6 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold mb-1">Chat with us</div>
                        <div className="text-sm text-muted-foreground">
                          Get instant help from our support team
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                          <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                          Available now
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 mt-1" />
                    </div>
                  </Button>

                  {/* Phone Support */}
                  <Button
                    variant={selectedOption === "phone" ? "default" : "outline"}
                    className="w-full justify-start h-auto py-4"
                    onClick={() => setSelectedOption("phone")}
                  >
                    <div className="flex items-start gap-3 text-left w-full">
                      <Phone className="h-6 w-6 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold mb-1">Call us</div>
                        <div className="text-sm text-muted-foreground">
                          Speak directly with a support specialist
                        </div>
                        <div className="flex items-center gap-1 text-xs mt-2">
                          <Clock className="h-3 w-3" />
                          <span className="text-muted-foreground">Mon-Fri: 8am - 8pm ET</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 mt-1" />
                    </div>
                  </Button>

                  {/* Email Support */}
                  <Button
                    variant={selectedOption === "email" ? "default" : "outline"}
                    className="w-full justify-start h-auto py-4"
                    onClick={() => setSelectedOption("email")}
                  >
                    <div className="flex items-start gap-3 text-left w-full">
                      <Mail className="h-6 w-6 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold mb-1">Send us a message</div>
                        <div className="text-sm text-muted-foreground">
                          We&apos;ll respond within 24 hours
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 mt-1" />
                    </div>
                  </Button>
                </CardContent>
              </Card>

              {/* Support Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Monday - Friday</span>
                    <span className="text-sm font-medium">8:00 AM - 8:00 PM ET</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Saturday</span>
                    <span className="text-sm font-medium">9:00 AM - 5:00 PM ET</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sunday</span>
                    <span className="text-sm font-medium">Closed</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form / Details */}
            <div className="space-y-6">
              {selectedOption === "chat" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Start a chat</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <MessageCircle className="h-4 w-4" />
                      <AlertDescription>
                        Chat support is currently available. Average wait time: 2 minutes
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">What do you need help with?</label>
                        <Textarea
                          placeholder="Describe your issue..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          if (!message.trim()) {
                            toast.error("Please describe your issue before starting a chat.")
                            return
                          }
                          toast.info("Chat feature is being set up. Our team will contact you via email soon!")
                          setMessage("")
                          setSelectedOption(null)
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Start Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedOption === "phone" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Call us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Phone className="h-4 w-4" />
                      <AlertDescription>
                        For faster service, please have your account information ready
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground mb-2">US & Canada (Toll-free)</div>
                        <div className="text-2xl font-bold">1-800-APPLYNHIRE</div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground mb-2">International</div>
                        <div className="text-2xl font-bold">+1-512-555-0100</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Have your account ID ready: <span className="font-mono font-semibold">EMP-2024-XXXXX</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedOption === "email" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Mail className="h-4 w-4" />
                      <AlertDescription>
                        We typically respond within 24 hours during business days
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Subject</label>
                        <Input 
                          placeholder="What is this regarding?" 
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Message</label>
                        <Textarea
                          placeholder="Describe your issue in detail..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={6}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Attach files (optional)</label>
                        <Input type="file" multiple />
                        <p className="text-xs text-muted-foreground mt-1">
                          Supported: PDF, PNG, JPG (max 10MB each)
                        </p>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          if (!subject.trim() || !message.trim()) {
                            toast.error("Please fill in both subject and message fields.")
                            return
                          }
                          toast.success("Message sent successfully! We'll respond within 24 hours.")
                          setMessage("")
                          setSubject("")
                          setSelectedOption(null)
                        }}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!selectedOption && (
                <Card>
                  <CardHeader>
                    <CardTitle>Need help quickly?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Select a contact method to get started. You can also browse our resources below.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Help Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Help Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a href="/employer/help-center" target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="flex-1 text-left">Help Center</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                  <a href="/employer/hiring-guide" target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" className="w-full justify-start">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      <span className="flex-1 text-left">Hiring Best Practices</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                  <a href="/employer/community" target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span className="flex-1 text-left">Community Forum</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-semibold mb-2">How do I post a job?</h4>
                  <p className="text-sm text-muted-foreground">
                    Navigate to the Jobs section from the sidebar and click &quot;Post a Job&quot;. Fill in the required details and publish your listing.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-semibold mb-2">How do I manage applications?</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to Dashboard to see all applications. You can filter, sort, and manage candidate applications from there.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-semibold mb-2">How do I upgrade my subscription?</h4>
                  <p className="text-sm text-muted-foreground">
                    Visit the Subscriptions page from the sidebar to view available plans and upgrade options.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How do I add team members?</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to Users section from the sidebar and click &quot;Add User&quot; to invite team members to your employer account.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
