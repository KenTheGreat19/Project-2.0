"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { 
  Target, TrendingUp, BookOpen, Award, AlertTriangle, 
  CheckCircle2, XCircle, Clock, Loader2 
} from "lucide-react"

type SkillsGapAnalysis = {
  missingSkills: string[]
  weakSkills: string[]
  matchingSkills: string[]
  coursesRecommended: any[]
  certificationsRecommended: any[]
  booksRecommended: any[]
  improvementPlan: string
  estimatedTimeToReady: number
}

type Props = {
  jobId: string
  jobTitle: string
}

export function SkillsGapViewer({ jobId, jobTitle }: Props) {
  const [analysis, setAnalysis] = useState<SkillsGapAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchAnalysis = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/skills-gap/${jobId}`)
      if (response.ok) {
        const data = await response.json()
        setAnalysis(data.analysis)
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to analyze skills gap")
      }
    } catch (error) {
      console.error("Error fetching skills gap analysis:", error)
      toast.error("Failed to analyze skills gap")
    } finally {
      setLoading(false)
    }
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Skills Gap Analysis
          </CardTitle>
          <CardDescription>
            See what skills you need to develop for this position
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            Get a personalized analysis of your skill gaps for {jobTitle}
          </p>
          <Button onClick={fetchAnalysis} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="mr-2 h-4 w-4" />
                Analyze Skills Gap
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const totalSkills = analysis.missingSkills.length + analysis.weakSkills.length + analysis.matchingSkills.length
  const matchPercentage = totalSkills > 0 ? (analysis.matchingSkills.length / totalSkills) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Skills Gap Analysis for {jobTitle}
          </CardTitle>
          <CardDescription>
            Based on your profile and job requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Match Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Match</span>
              <span className="text-2xl font-bold text-green-600">{matchPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={matchPercentage} className="h-3" />
          </div>

          {/* Skills Breakdown */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Matching Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analysis.matchingSkills.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  Weak Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analysis.weakSkills.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  Missing Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analysis.missingSkills.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Estimated Time */}
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated time to job-ready</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {analysis.estimatedTimeToReady} weeks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Skills Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Matching Skills */}
        {analysis.matchingSkills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.matchingSkills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weak Skills */}
        {analysis.weakSkills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                Skills to Improve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.weakSkills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Missing Skills */}
        {analysis.missingSkills.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                Skills to Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Improvement Plan */}
      {analysis.improvementPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Personalized Improvement Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {analysis.improvementPlan}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Courses */}
      {analysis.coursesRecommended.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recommended Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.coursesRecommended.map((course, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm">{course.title}</h4>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{course.platform}</span>
                    <span>•</span>
                    <span>{course.duration}</span>
                    {course.skill && (
                      <>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">{course.skill}</Badge>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Certifications */}
      {analysis.certificationsRecommended.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recommended Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.certificationsRecommended.map((cert, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm">{cert.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Provider: {cert.provider}</p>
                  {cert.relevantSkills && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cert.relevantSkills.map((skill: string, j: number) => (
                        <Badge key={j} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <Button onClick={fetchAnalysis} disabled={loading} variant="secondary" className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Re-analyzing...
          </>
        ) : (
          <>
            <Target className="mr-2 h-4 w-4" />
            Refresh Analysis
          </>
        )}
      </Button>
    </div>
  )
}
