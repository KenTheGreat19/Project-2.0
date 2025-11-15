"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, MessageSquare, Award, TrendingUp } from "lucide-react"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <Link href="/employer/help-center">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Help Center
          </Button>
        </Link>

        <div className="text-center mb-12">
          <Users className="h-16 w-16 mx-auto mb-4 text-[#0A66C2]" />
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A66C2] mb-4">
            Community Forum
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Connect with employers, share insights, and learn from others
          </p>
        </div>

        <div className="space-y-6">
          {/* Coming Soon Notice */}
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-[#0A66C2]" />
              <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We&apos;re building an amazing community forum where employers can connect, share experiences, 
                and learn from each other. Stay tuned!
              </p>
            </CardContent>
          </Card>

          {/* What to Expect */}
          <Card>
            <CardHeader>
              <CardTitle>What to Expect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-6 w-6 text-[#0A66C2] mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Discussion Forums</h3>
                  <p className="text-sm text-muted-foreground">
                    Share hiring challenges, ask questions, and get advice from experienced employers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-6 w-6 text-[#0A66C2] mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Best Practices</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn from success stories and proven strategies shared by top employers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-6 w-6 text-[#0A66C2] mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Industry Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Stay updated with hiring trends, market insights, and platform updates.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-[#0A66C2] mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Networking</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with other employers, build relationships, and grow your network.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notify Me */}
          <Card>
            <CardHeader>
              <CardTitle>Get Notified</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Want to be the first to know when the community forum launches? 
                We&apos;ll send you an email when it&apos;s ready.
              </p>
              <Link href="/employer/contact">
                <Button className="bg-[#0A66C2] hover:bg-[#0A66C2]/90">
                  Contact Us to Join Waitlist
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Alternative Resources */}
          <Card>
            <CardHeader>
              <CardTitle>In the Meantime</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground mb-4">
                While we&apos;re building the forum, check out these resources:
              </p>
              <Link href="/employer/hiring-guide">
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Hiring Best Practices Guide
                </Button>
              </Link>
              <Link href="/employer/help-center">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Help Center
                </Button>
              </Link>
              <Link href="/employer/contact">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
