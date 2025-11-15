"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, AlertTriangle, ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

type FitStatus = "passed" | "partially" | "failed" | "not_calculated"

type JobFitData = {
  overallScore: number
  categories: {
    education: { score: number; status: FitStatus }
    experience: { score: number; status: FitStatus }
    essentialSkills: { score: number; status: FitStatus }
    technicalSkills: { score: number; status: FitStatus }
    attributes: { score: number; status: FitStatus }
    culturalFit: { score: number; status: FitStatus }
  }
  calculatedAt: string | null
}

type Props = {
  jobId: string
}

export function JobFitGradingWidget({ jobId }: Props) {
  const { data: session, status } = useSession()
  const [fitData, setFitData] = useState<JobFitData | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && (session.user as any)?.role === "APPLICANT") {
      fetchFitScore()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, jobId])

  const fetchFitScore = async () => {
    try {
      const response = await fetch(`/api/job-fit/${jobId}`)
      const data = await response.json()
      
      if (response.ok) {
        setFitData(data.fitScore)
        setHasProfile(data.hasProfile)
      }
    } catch (error) {
      console.error("Error fetching fit score:", error)
    } finally {
      setLoading(false)
    }
  }

  // Show promotional widget for non-logged-in users
  if (status === "unauthenticated") {
    return (
      <Card className="border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <TrendingUp className="h-5 w-5" />
            Job Fit Grading System
          </CardTitle>
          <CardDescription className="text-purple-600 dark:text-purple-400">
            Unlock your personalized job match score!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Create a free account to see:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Overall Match Score</strong> - See your percentage fit for this job</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>6 Category Analysis</strong> - Education, Experience, Skills, and more</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Personalized Insights</strong> - Know exactly where you stand</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Profile Improvement Tips</strong> - Boost your chances of getting hired</span>
              </li>
            </ul>
          </div>

          {/* Sample Visual */}
          <div className="space-y-3 pt-4 border-t">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Preview: Sample Job Fit Analysis
            </p>
            <div className="space-y-2 opacity-60">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Match</span>
                <span className="text-2xl font-bold text-green-600">85%</span>
              </div>
              <Progress value={85} className="h-3" />
            </div>
            
            <div className="space-y-2 opacity-60">
              {[
                { label: "Education", score: 90, status: "passed" },
                { label: "Experience", score: 80, status: "passed" },
                { label: "Essential Skills", score: 75, status: "partially" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.status === "passed" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      )}
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                    <span className="text-xs">{item.score}%</span>
                  </div>
                  <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full ${
                        item.status === "passed" ? "bg-green-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                + 3 more categories...
              </p>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Link href="/auth/applicant/signin">
                Sign In to See Your Score
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950">
              <Link href="/auth/applicant/signup">
                Create Free Account
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Don't show widget if logged in but not an applicant
  if (status === "authenticated" && (session.user as any)?.role !== "APPLICANT") {
    return null
  }

  if (loading) {
    return (
      <Card className="border-2 border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Job Fit Analysis
          </CardTitle>
          <CardDescription>Analyzing your profile match...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!hasProfile) {
    return (
      <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <AlertCircle className="h-5 w-5" />
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-amber-600 dark:text-amber-400">
            See how well you match this job!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            To see your Job Fit Score and increase your chances of getting hired, 
            complete your applicant profile with your education, experience, and skills.
          </p>
          <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
            <Link href="/applicant/dashboard?tab=profile">
              Complete Profile Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!fitData) {
    return null
  }

  const getStatusIcon = (status: FitStatus) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "partially":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: FitStatus) => {
    switch (status) {
      case "passed":
        return "bg-green-500"
      case "partially":
        return "bg-amber-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-300"
    }
  }

  const getStatusText = (status: FitStatus) => {
    switch (status) {
      case "passed":
        return "Passed"
      case "partially":
        return "Partially"
      case "failed":
        return "Needs Improvement"
      default:
        return "Not Assessed"
    }
  }

  const getStatusTextColor = (status: FitStatus) => {
    switch (status) {
      case "passed":
        return "text-green-700 dark:text-green-400"
      case "partially":
        return "text-amber-700 dark:text-amber-400"
      case "failed":
        return "text-red-700 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const categories = [
    { key: "education", label: "Education", data: fitData.categories.education },
    { key: "experience", label: "Experience", data: fitData.categories.experience },
    { key: "essentialSkills", label: "Essential Skills (Soft Skills)", data: fitData.categories.essentialSkills },
    { key: "technicalSkills", label: "Technical Skills (Hard Skills)", data: fitData.categories.technicalSkills },
    { key: "attributes", label: "Personal Attributes", data: fitData.categories.attributes },
    { key: "culturalFit", label: "Cultural Fit", data: fitData.categories.culturalFit },
  ]

  const getOverallMessage = () => {
    if (fitData.overallScore >= 80) {
      return "Excellent match! Your profile aligns very well with this job."
    } else if (fitData.overallScore >= 60) {
      return "Good match! Consider improving a few areas to strengthen your application."
    } else if (fitData.overallScore >= 40) {
      return "Partial match. Enhancing your profile could significantly improve your fit."
    } else {
      return "This role may be challenging. Focus on building relevant skills and experience."
    }
  }

  return (
    <Card className="border-2 border-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Your Job Fit Score
        </CardTitle>
        <CardDescription>
          See how well your profile matches this position
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Match</span>
            <span className="text-2xl font-bold text-green-600">{fitData.overallScore}%</span>
          </div>
          <Progress value={fitData.overallScore} className="h-3" />
          <p className="text-sm text-muted-foreground">{getOverallMessage()}</p>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Category Breakdown</h4>
          {categories.map((category) => (
            <div key={category.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(category.data.status)}
                  <span className="font-medium text-sm">{category.label}</span>
                </div>
                <span className={`text-sm font-semibold ${getStatusTextColor(category.data.status)}`}>
                  {getStatusText(category.data.status)}
                </span>
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full ${getStatusColor(category.data.status)} transition-all duration-500`}
                  style={{ width: `${category.data.score}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{category.data.score}% match</span>
                <span>
                  {category.data.status === "passed"
                    ? "✓ Meets requirements"
                    : category.data.status === "partially"
                    ? "△ Partially meets"
                    : "✗ Below requirements"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="pt-4 border-t">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <h5 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                  Improve Your Fit Score!
                </h5>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Edit or enhance your profile in your Applicant Dashboard to improve your match 
                  and increase your chances of getting this job.
                </p>
                <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/applicant/dashboard?tab=profile">
                    Update Profile Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {fitData.calculatedAt && (
          <p className="text-xs text-center text-muted-foreground">
            Last updated: {new Date(fitData.calculatedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
