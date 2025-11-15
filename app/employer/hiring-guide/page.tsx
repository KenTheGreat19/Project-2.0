"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lightbulb, Target, Users, FileText, TrendingUp, CheckCircle } from "lucide-react"

export default function HiringGuidePage() {
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
          <Lightbulb className="h-16 w-16 mx-auto mb-4 text-[#0A66C2]" />
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A66C2] mb-4">
            Hiring Best Practices
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Expert tips to find and hire the best talent
          </p>
        </div>

        <div className="space-y-8">
          {/* Writing Job Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-[#0A66C2]" />
                Writing Effective Job Descriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                A great job description is clear, compelling, and attracts the right candidates.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Be Specific About Requirements</h4>
                    <p className="text-sm text-muted-foreground">
                      Clearly list required skills, experience levels, and qualifications. Avoid vague terms.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Highlight Company Culture</h4>
                    <p className="text-sm text-muted-foreground">
                      Describe your work environment, values, and what makes your company unique.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Include Salary Range</h4>
                    <p className="text-sm text-muted-foreground">
                      Transparency about compensation attracts serious candidates and saves time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Keep It Concise</h4>
                    <p className="text-sm text-muted-foreground">
                      Aim for 300-700 words. Too long and candidates lose interest.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Screening Candidates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-[#0A66C2]" />
                Screening Candidates Effectively
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Save time by implementing a structured screening process.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Create a Scorecard</h4>
                    <p className="text-sm text-muted-foreground">
                      Define key criteria and rate candidates objectively on each factor.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Review Resumes Carefully</h4>
                    <p className="text-sm text-muted-foreground">
                      Look for relevant experience, achievements, and career progression.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Phone Screen First</h4>
                    <p className="text-sm text-muted-foreground">
                      A brief call can help verify basic qualifications before scheduling full interviews.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-[#0A66C2]" />
                Conducting Great Interviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Interviews are your opportunity to assess fit and sell your company.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Prepare Structured Questions</h4>
                    <p className="text-sm text-muted-foreground">
                      Ask all candidates the same core questions for fair comparison.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Use Behavioral Questions</h4>
                    <p className="text-sm text-muted-foreground">
                      &quot;Tell me about a time when...&quot; questions reveal past behavior and decision-making.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Leave Time for Questions</h4>
                    <p className="text-sm text-muted-foreground">
                      Engaged candidates will have questions. This is a good sign of interest.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Follow Up Promptly</h4>
                    <p className="text-sm text-muted-foreground">
                      Top candidates have multiple offers. Quick communication shows you&apos;re serious.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attracting Top Talent */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-[#0A66C2]" />
                Attracting Top Talent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Stand out in a competitive market with these strategies.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Build Your Employer Brand</h4>
                    <p className="text-sm text-muted-foreground">
                      Maintain an active presence, share company updates, and showcase your culture.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Offer Competitive Benefits</h4>
                    <p className="text-sm text-muted-foreground">
                      Beyond salary, highlight perks like remote work, health benefits, and growth opportunities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Respond Quickly</h4>
                    <p className="text-sm text-muted-foreground">
                      Fast response times signal professionalism and keep candidates engaged.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Provide a Great Candidate Experience</h4>
                    <p className="text-sm text-muted-foreground">
                      Clear communication, respect for candidates&apos; time, and feedback build your reputation.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Ready to start hiring?</h3>
            <p className="text-muted-foreground mb-6">
              Post your first job and find great talent today.
            </p>
            <Link href="/employer/dashboard">
              <Button size="lg" className="bg-[#0A66C2] hover:bg-[#0A66C2]/90">
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
