"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target, Users, Zap, Globe, Shield, Heart } from "lucide-react"

export default function AboutPage() {

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
            About ApplyNHire
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Connecting talent with opportunity, completely free. Forever.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-[#0A66C2]" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground">
              ApplyNHire is dedicated to revolutionizing the job search experience by providing a 100% free platform 
              that connects job seekers with employers worldwide. We believe that finding the right job or the perfect 
              candidate should never come with a price tag.
            </p>
          </CardContent>
        </Card>

        {/* Core Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#0A66C2]" />
                Global Reach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Supporting job seekers and employers across the world with multi-language support and location-based search.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#0A66C2]" />
                Privacy First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your data security and privacy are our top priorities. We use industry-standard security measures to protect your information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#0A66C2]" />
                Easy to Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Intuitive design and powerful features make job searching and candidate recruitment effortless.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#0A66C2]" />
                Community Driven
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Built with feedback from job seekers and employers to create the best experience for everyone.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-[#0A66C2]" />
                Always Free
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No hidden fees, no premium tiers. Every feature is available to everyone, free forever.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#0A66C2]" />
                Smart Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced algorithms help match candidates with the right opportunities based on skills, location, and preferences.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Choose ApplyNHire?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-[#0A66C2]">For Job Seekers</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ Browse thousands of job listings</li>
                  <li>✓ Apply to multiple jobs with one profile</li>
                  <li>✓ Track your applications in real-time</li>
                  <li>✓ Get personalized job recommendations</li>
                  <li>✓ Access interactive job location maps</li>
                  <li>✓ Multi-language support</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-[#0A66C2]">For Employers</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ Post unlimited job listings</li>
                  <li>✓ Access a global talent pool</li>
                  <li>✓ Advanced candidate search tools</li>
                  <li>✓ Manage interviews and schedules</li>
                  <li>✓ Track analytics and insights</li>
                  <li>✓ Team collaboration features</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-[#0A66C2] mb-2">100%</div>
              <div className="text-muted-foreground">Free Forever</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-[#0A66C2] mb-2">190+</div>
              <div className="text-muted-foreground">Countries Supported</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-[#0A66C2] mb-2">24/7</div>
              <div className="text-muted-foreground">Platform Access</div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
            <p className="text-muted-foreground mb-6">
              We&apos;re here to help! Reach out to us anytime.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-[#0A66C2] hover:bg-[#0A66C2]/90">
                Contact Us
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
