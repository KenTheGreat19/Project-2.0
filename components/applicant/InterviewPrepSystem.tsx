"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  Video, Calendar, Plus, Trash2, Save, Target, Loader2, PlayCircle 
} from "lucide-react"
import { format } from "date-fns"

type InterviewPrep = {
  id: string
  jobId?: string
  companyName?: string
  position?: string
  interviewDate?: string
  interviewType?: string
  companyResearch?: string
  questionsToAsk?: string
  answersPrepped?: string
  practiceCount: number
  status: string
  outcome?: string
  notes?: string
  createdAt: string
}

const commonQuestions = [
  "Tell me about yourself",
  "Why do you want to work here?",
  "What are your greatest strengths?",
  "What are your weaknesses?",
  "Where do you see yourself in 5 years?",
  "Why should we hire you?",
  "Tell me about a challenge you overcame",
  "Describe a time you worked in a team",
  "What's your leadership style?",
  "Do you have any questions for us?",
]

export function InterviewPrepSystem() {
  const [preps, setPreps] = useState<InterviewPrep[]>([])
  const [selectedPrep, setSelectedPrep] = useState<InterviewPrep | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Form fields
  const [companyName, setCompanyName] = useState("")
  const [position, setPosition] = useState("")
  const [interviewDate, setInterviewDate] = useState("")
  const [interviewType, setInterviewType] = useState<string>("video")
  const [companyResearch, setCompanyResearch] = useState("")
  const [questionsToAsk, setQuestionsToAsk] = useState<string[]>([])
  const [newQuestion, setNewQuestion] = useState("")
  const [answersPrepped, setAnswersPrepped] = useState<{ question: string; answer: string }[]>([])
  const [status, setStatus] = useState("preparing")

  useEffect(() => {
    fetchPreps()
  }, [])

  const fetchPreps = async () => {
    try {
      const response = await fetch("/api/interview-prep")
      if (response.ok) {
        const data = await response.json()
        setPreps(data.interviewPreps || [])
      }
    } catch (error) {
      console.error("Error fetching interview preps:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadPrep = (prep: InterviewPrep) => {
    setSelectedPrep(prep)
    setCompanyName(prep.companyName || "")
    setPosition(prep.position || "")
    setInterviewDate(prep.interviewDate ? prep.interviewDate.split('T')[0] : "")
    setInterviewType(prep.interviewType || "video")
    setCompanyResearch(prep.companyResearch || "")
    setStatus(prep.status)

    try {
      setQuestionsToAsk(prep.questionsToAsk ? JSON.parse(prep.questionsToAsk) : [])
    } catch (e) {
      setQuestionsToAsk([])
    }

    try {
      setAnswersPrepped(prep.answersPrepped ? JSON.parse(prep.answersPrepped) : [])
    } catch (e) {
      setAnswersPrepped([])
    }

    setShowForm(true)
  }

  const handleSave = async () => {
    if (!companyName || !position) {
      toast.error("Please fill in company name and position")
      return
    }

    setSaving(true)
    try {
      const data = {
        companyName,
        position,
        interviewDate: interviewDate ? new Date(interviewDate).toISOString() : undefined,
        interviewType,
        companyResearch,
        questionsToAsk: JSON.stringify(questionsToAsk),
        answersPrepped: JSON.stringify(answersPrepped),
        status,
      }

      const url = selectedPrep ? `/api/interview-prep` : "/api/interview-prep"
      const method = selectedPrep ? "PUT" : "POST"
      const body = selectedPrep ? { ...data, id: selectedPrep.id } : data

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast.success(selectedPrep ? "Interview prep updated!" : "Interview prep created!")
        fetchPreps()
        if (!selectedPrep) {
          resetForm()
        }
      } else {
        toast.error("Failed to save interview prep")
      }
    } catch (error) {
      console.error("Error saving interview prep:", error)
      toast.error("Failed to save interview prep")
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setSelectedPrep(null)
    setCompanyName("")
    setPosition("")
    setInterviewDate("")
    setInterviewType("video")
    setCompanyResearch("")
    setQuestionsToAsk([])
    setAnswersPrepped([])
    setStatus("preparing")
    setShowForm(false)
  }

  const addQuestion = () => {
    if (newQuestion.trim() && !questionsToAsk.includes(newQuestion.trim())) {
      setQuestionsToAsk([...questionsToAsk, newQuestion.trim()])
      setNewQuestion("")
    }
  }

  const addAnswer = (question: string) => {
    if (!answersPrepped.find(a => a.question === question)) {
      setAnswersPrepped([...answersPrepped, { question, answer: "" }])
    }
  }

  const updateAnswer = (question: string, answer: string) => {
    setAnswersPrepped(
      answersPrepped.map(a => a.question === question ? { ...a, answer } : a)
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "cancelled": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Video className="h-6 w-6" />
            Interview Preparation
          </h2>
          <p className="text-muted-foreground">Practice and prepare for your interviews</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          New Preparation
        </Button>
      </div>

      {/* Interview List */}
      {!showForm && preps.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {preps.map((prep) => (
            <Card key={prep.id} className="cursor-pointer hover:border-primary" onClick={() => loadPrep(prep)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{prep.position}</CardTitle>
                    <CardDescription>{prep.companyName}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(prep.status)}>
                    {prep.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {prep.interviewDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(prep.interviewDate), "MMM d, yyyy")}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PlayCircle className="h-4 w-4" />
                  Practiced {prep.practiceCount} times
                </div>
                {prep.interviewType && (
                  <Badge variant="secondary">{prep.interviewType}</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Interview Prep Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedPrep ? "Edit Interview Prep" : "New Interview Preparation"}</CardTitle>
            <CardDescription>Prepare thoroughly to ace your interview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Google"
                />
              </div>
              <div className="space-y-2">
                <Label>Position *</Label>
                <Input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label>Interview Date</Label>
                <Input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Interview Type</Label>
                <Select value={interviewType} onValueChange={setInterviewType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Company Research */}
            <div className="space-y-2">
              <Label>Company Research</Label>
              <Textarea
                value={companyResearch}
                onChange={(e) => setCompanyResearch(e.target.value)}
                placeholder="What do you know about the company? Products, culture, recent news..."
                rows={4}
              />
            </div>

            {/* Questions to Ask */}
            <div className="space-y-4">
              <Label>Questions to Ask the Interviewer</Label>
              <div className="flex gap-2">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Add a question"
                  onKeyDown={(e) => e.key === "Enter" && addQuestion()}
                />
                <Button onClick={addQuestion} variant="secondary" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {questionsToAsk.map((q, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-secondary rounded">
                    <span className="flex-1 text-sm">{q}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setQuestionsToAsk(questionsToAsk.filter((_, idx) => idx !== i))}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Interview Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Practice Common Questions</Label>
                <Badge variant="secondary">{answersPrepped.length} prepared</Badge>
              </div>
              <div className="space-y-3">
                {commonQuestions.map((question, i) => {
                  const answer = answersPrepped.find(a => a.question === question)
                  return (
                    <Card key={i}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">{question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {answer ? (
                          <Textarea
                            value={answer.answer}
                            onChange={(e) => updateAnswer(question, e.target.value)}
                            placeholder="Your answer..."
                            rows={3}
                          />
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => addAnswer(question)}
                          >
                            Prepare Answer
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving || !companyName || !position} className="flex-1">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Preparation
                  </>
                )}
              </Button>
              <Button onClick={resetForm} variant="secondary">
                Back to List
              </Button>
            </div>

            {/* Tips */}
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Interview Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Use the STAR method (Situation, Task, Action, Result) for behavioral questions</p>
                <p>• Research the company&apos;s recent news and achievements</p>
                <p>• Prepare 3-5 thoughtful questions to ask the interviewer</p>
                <p>• Practice your answers out loud multiple times</p>
                <p>• Test your tech setup 15 minutes before virtual interviews</p>
                <p>• Send a thank-you email within 24 hours after the interview</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!showForm && preps.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Interview Preparations Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start preparing for your interviews to increase your chances of success
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Prep
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
