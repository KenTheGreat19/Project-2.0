"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Plus, Trash2, Save, FileText, TrendingUp, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

type Resume = {
  id: string
  title: string
  templateStyle: string
  fullName?: string
  email?: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  summary?: string
  workExperience?: string
  education?: string
  skills?: string
  certifications?: string
  projects?: string
  languages?: string
  references?: string
  atsScore: number
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

type WorkExperience = {
  company: string
  title: string
  startDate: string
  endDate: string
  description: string
  achievements: string
}

type Education = {
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
  honors?: string
}

export function ResumeBuilder() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [title, setTitle] = useState("My Resume")
  const [templateStyle, setTemplateStyle] = useState("professional")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [website, setWebsite] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [github, setGithub] = useState("")
  const [summary, setSummary] = useState("")
  const [isDefault, setIsDefault] = useState(false)

  // Work Experience
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([])

  // Education
  const [educations, setEducations] = useState<Education[]>([])

  // Skills
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes")
      if (response.ok) {
        const data = await response.json()
        setResumes(data.resumes || [])
      }
    } catch (error) {
      console.error("Error fetching resumes:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadResume = (resume: Resume) => {
    setSelectedResume(resume)
    setTitle(resume.title)
    setTemplateStyle(resume.templateStyle)
    setFullName(resume.fullName || "")
    setEmail(resume.email || "")
    setPhone(resume.phone || "")
    setLocation(resume.location || "")
    setWebsite(resume.website || "")
    setLinkedin(resume.linkedin || "")
    setGithub(resume.github || "")
    setSummary(resume.summary || "")
    setIsDefault(resume.isDefault)

    // Parse JSON fields
    try {
      setWorkExperiences(resume.workExperience ? JSON.parse(resume.workExperience) : [])
    } catch (e) {
      setWorkExperiences([])
    }

    try {
      setEducations(resume.education ? JSON.parse(resume.education) : [])
    } catch (e) {
      setEducations([])
    }

    try {
      setSkills(resume.skills ? JSON.parse(resume.skills) : [])
    } catch (e) {
      setSkills([])
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = {
        title,
        templateStyle,
        fullName,
        email,
        phone,
        location,
        website,
        linkedin,
        github,
        summary,
        workExperience: JSON.stringify(workExperiences),
        education: JSON.stringify(educations),
        skills: JSON.stringify(skills),
        isDefault,
      }

      const url = selectedResume ? `/api/resumes/${selectedResume.id}` : "/api/resumes"
      const method = selectedResume ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(selectedResume ? "Resume updated successfully!" : "Resume created successfully!")
        fetchResumes()
        if (!selectedResume) {
          resetForm()
        }
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to save resume")
      }
    } catch (error) {
      console.error("Error saving resume:", error)
      toast.error("Failed to save resume")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Resume deleted successfully!")
        fetchResumes()
        if (selectedResume?.id === id) {
          resetForm()
        }
      } else {
        toast.error("Failed to delete resume")
      }
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast.error("Failed to delete resume")
    }
  }

  const resetForm = () => {
    setSelectedResume(null)
    setTitle("My Resume")
    setTemplateStyle("professional")
    setFullName("")
    setEmail("")
    setPhone("")
    setLocation("")
    setWebsite("")
    setLinkedin("")
    setGithub("")
    setSummary("")
    setWorkExperiences([])
    setEducations([])
    setSkills([])
    setIsDefault(false)
  }

  const addWorkExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      { company: "", title: "", startDate: "", endDate: "", description: "", achievements: "" },
    ])
  }

  const removeWorkExperience = (index: number) => {
    setWorkExperiences(workExperiences.filter((_, i) => i !== index))
  }

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    const updated = [...workExperiences]
    updated[index][field] = value
    setWorkExperiences(updated)
  }

  const addEducation = () => {
    setEducations([
      ...educations,
      { school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "", honors: "" },
    ])
  }

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index))
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...educations]
    updated[index][field] = value
    setEducations(updated)
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const getATSScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getATSScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
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
            <FileText className="h-6 w-6" />
            Resume Builder
          </h2>
          <p className="text-muted-foreground">Create ATS-optimized resumes that get noticed</p>
        </div>
        <Button onClick={resetForm} variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          New Resume
        </Button>
      </div>

      {/* Existing Resumes */}
      {resumes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Resumes</CardTitle>
            <CardDescription>Click to edit or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <Card
                  key={resume.id}
                  className={`cursor-pointer transition-colors hover:border-primary ${
                    selectedResume?.id === resume.id ? "border-primary" : ""
                  }`}
                  onClick={() => loadResume(resume)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{resume.title}</CardTitle>
                        {resume.isDefault && (
                          <Badge variant="secondary" className="mt-1">Default</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(resume.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ATS Score:</span>
                      <span className={`font-bold ${getATSScoreColor(resume.atsScore)}`}>
                        {resume.atsScore}% {getATSScoreLabel(resume.atsScore)}
                      </span>
                    </div>
                    <Progress value={resume.atsScore} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resume Editor */}
      <Card>
        <CardHeader>
          <CardTitle>{selectedResume ? "Edit Resume" : "Create New Resume"}</CardTitle>
          <CardDescription>
            Fill in your information to create an ATS-optimized resume
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Resume Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Software Engineer Resume"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Template Style</Label>
                <Select value={templateStyle} onValueChange={setTemplateStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub/Portfolio</Label>
                <Input
                  id="github"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Professional Summary</h3>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a compelling summary of your experience and skills (2-3 sentences)"
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              {summary.length} characters (recommended: 100-200)
            </p>
          </div>

          {/* Work Experience */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Work Experience</h3>
              <Button onClick={addWorkExperience} variant="secondary" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </div>
            {workExperiences.map((exp, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Experience {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeWorkExperience(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                    />
                    <Input
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) => updateWorkExperience(index, "title", e.target.value)}
                    />
                    <Input
                      placeholder="Start Date (MM/YYYY)"
                      value={exp.startDate}
                      onChange={(e) => updateWorkExperience(index, "startDate", e.target.value)}
                    />
                    <Input
                      placeholder="End Date (MM/YYYY or Present)"
                      value={exp.endDate}
                      onChange={(e) => updateWorkExperience(index, "endDate", e.target.value)}
                    />
                  </div>
                  <Textarea
                    placeholder="Job Description"
                    value={exp.description}
                    onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                    rows={3}
                  />
                  <Textarea
                    placeholder="Key Achievements (bullet points)"
                    value={exp.achievements}
                    onChange={(e) => updateWorkExperience(index, "achievements", e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Education</h3>
              <Button onClick={addEducation} variant="secondary" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </div>
            {educations.map((edu, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Education {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="School/University"
                      value={edu.school}
                      onChange={(e) => updateEducation(index, "school", e.target.value)}
                    />
                    <Input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                    />
                    <Input
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) => updateEducation(index, "field", e.target.value)}
                    />
                    <Input
                      placeholder="GPA (optional)"
                      value={edu.gpa || ""}
                      onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                    />
                    <Input
                      placeholder="Start Date (MM/YYYY)"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                    />
                    <Input
                      placeholder="End Date (MM/YYYY)"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Skills</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
              />
              <Button onClick={addSkill} variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Set as Default */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="isDefault">Set as default resume</Label>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving || !title || !fullName || !email} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {selectedResume ? "Update Resume" : "Create Resume"}
                </>
              )}
            </Button>
            {selectedResume && (
              <Button onClick={resetForm} variant="secondary">
                Cancel
              </Button>
            )}
          </div>

          {/* ATS Tips */}
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                ATS Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Use standard section headings (Work Experience, Education, Skills)</p>
              <p>• Include relevant keywords from job descriptions</p>
              <p>• Use bullet points for achievements and responsibilities</p>
              <p>• Quantify achievements with numbers when possible</p>
              <p>• Keep formatting simple - avoid tables, columns, or graphics</p>
              <p>• Save as .docx or .pdf format</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
