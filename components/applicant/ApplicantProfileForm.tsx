"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Loader2, Save, CheckCircle } from "lucide-react"
import { toast } from "sonner"

const educationLevels = [
  { value: "high_school", label: "High School" },
  { value: "associate", label: "Associate Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "phd", label: "PhD/Doctorate" },
]

const commonEssentialSkills = [
  "Communication", "Teamwork", "Problem Solving", "Leadership", 
  "Time Management", "Adaptability", "Critical Thinking", "Creativity"
]

const commonTechnicalSkills = [
  "JavaScript", "Python", "React", "Node.js", "SQL", "AWS", 
  "Docker", "Git", "TypeScript", "Java"
]

const commonAttributes = [
  "Self-motivated", "Detail-oriented", "Fast learner", "Team player",
  "Results-driven", "Proactive", "Analytical", "Innovative"
]

const commonValues = [
  "Innovation", "Collaboration", "Integrity", "Excellence",
  "Diversity", "Work-life balance", "Growth mindset", "Customer focus"
]

export function ApplicantProfileForm() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // Form state
  const [education, setEducation] = useState("")
  const [yearsExperience, setYearsExperience] = useState("0")
  const [bio, setBio] = useState("")
  const [resume, setResume] = useState("")
  
  // Skills arrays
  const [essentialSkills, setEssentialSkills] = useState<string[]>([])
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([])
  const [personalAttributes, setPersonalAttributes] = useState<string[]>([])
  const [culturalValues, setCulturalValues] = useState<string[]>([])
  
  // Input fields
  const [newEssentialSkill, setNewEssentialSkill] = useState("")
  const [newTechnicalSkill, setNewTechnicalSkill] = useState("")
  const [newAttribute, setNewAttribute] = useState("")
  const [newValue, setNewValue] = useState("")

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/applicant/profile")
      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          const profile = data.profile
          setEducation(profile.educationLevel || "")
          setYearsExperience(profile.totalYearsExperience?.toString() || "0")
          setBio(profile.workStyle || "")
          setResume(profile.currentRole || "")
          
          // Parse JSON arrays
          const softSkills = profile.softSkills || []
          const hardSkills = profile.hardSkills || []
          const personalTraits = profile.personalTraits || []
          const values = profile.values || []
          
          // Extract skill names from objects
          setEssentialSkills(Array.isArray(softSkills) ? softSkills.map((s: any) => typeof s === 'string' ? s : s.skill) : [])
          setTechnicalSkills(Array.isArray(hardSkills) ? hardSkills.map((s: any) => typeof s === 'string' ? s : s.name) : [])
          setPersonalAttributes(Array.isArray(personalTraits) ? personalTraits : [])
          setCulturalValues(Array.isArray(values) ? values : [])
        }
      }
    } catch (error) {
      console.error("Failed to load profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const addItem = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, inputSetter: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim()) {
      setter(prev => [...prev, value.trim()])
      inputSetter("")
    }
  }

  const removeItem = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const addPredefinedItem = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => {
      if (!prev.includes(value)) {
        return [...prev, value]
      }
      return prev
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    try {
      const response = await fetch("/api/applicant/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          educationLevel: education,
          totalYearsExperience: parseInt(yearsExperience) || 0,
          workStyle: bio,
          currentRole: resume,
          softSkills: essentialSkills.map(skill => ({ skill, rating: 4 })),
          hardSkills: technicalSkills.map(skill => ({ name: skill, proficiency: "intermediate" })),
          personalTraits: personalAttributes,
          values: culturalValues,
        }),
      })

      if (!response.ok) throw new Error("Failed to save profile")

      setSaved(true)
      toast.success("Profile saved successfully! Your job fit scores will now be calculated.")
      
      // Reset saved indicator after 3 seconds
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error(error)
      toast.error("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your profile? This will clear all your data.")) {
      setEducation("")
      setYearsExperience("0")
      setBio("")
      setResume("")
      setEssentialSkills([])
      setTechnicalSkills([])
      setPersonalAttributes([])
      setCulturalValues([])
      toast.success("Profile reset successfully")
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          📊 Complete Your Profile for Job Fit Scoring
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Fill out your profile details to see how well you match job requirements. The more complete your profile, the more accurate your fit scores will be!
        </p>
      </div>

      {/* Education & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Education Level *</Label>
          <Select value={education} onValueChange={setEducation}>
            <SelectTrigger>
              <SelectValue placeholder="Select your education level" />
            </SelectTrigger>
            <SelectContent>
              {educationLevels.map(level => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Years of Experience *</Label>
          <Input
            type="number"
            min="0"
            max="50"
            value={yearsExperience}
            onChange={(e) => setYearsExperience(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label>Professional Summary</Label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell employers about your experience, skills, and career goals..."
          rows={4}
        />
      </div>

      {/* Essential Skills */}
      <div className="space-y-3">
        <Label>Essential Skills (Soft Skills) *</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {commonEssentialSkills.map(skill => (
            <Badge
              key={skill}
              variant={essentialSkills.includes(skill) ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => addPredefinedItem(skill, setEssentialSkills)}
            >
              {essentialSkills.includes(skill) ? <CheckCircle className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
              {skill}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newEssentialSkill}
            onChange={(e) => setNewEssentialSkill(e.target.value)}
            placeholder="Add custom skill..."
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem(newEssentialSkill, setEssentialSkills, setNewEssentialSkill))}
          />
          <Button type="button" onClick={() => addItem(newEssentialSkill, setEssentialSkills, setNewEssentialSkill)}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {essentialSkills.filter(s => !commonEssentialSkills.includes(s)).map((skill, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem(essentialSkills.indexOf(skill), setEssentialSkills)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div className="space-y-3">
        <Label>Technical Skills (Hard Skills) *</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {commonTechnicalSkills.map(skill => (
            <Badge
              key={skill}
              variant={technicalSkills.includes(skill) ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => addPredefinedItem(skill, setTechnicalSkills)}
            >
              {technicalSkills.includes(skill) ? <CheckCircle className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
              {skill}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTechnicalSkill}
            onChange={(e) => setNewTechnicalSkill(e.target.value)}
            placeholder="Add custom skill..."
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem(newTechnicalSkill, setTechnicalSkills, setNewTechnicalSkill))}
          />
          <Button type="button" onClick={() => addItem(newTechnicalSkill, setTechnicalSkills, setNewTechnicalSkill)}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {technicalSkills.filter(s => !commonTechnicalSkills.includes(s)).map((skill, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem(technicalSkills.indexOf(skill), setTechnicalSkills)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Personal Attributes */}
      <div className="space-y-3">
        <Label>Personal Attributes *</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {commonAttributes.map(attr => (
            <Badge
              key={attr}
              variant={personalAttributes.includes(attr) ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => addPredefinedItem(attr, setPersonalAttributes)}
            >
              {personalAttributes.includes(attr) ? <CheckCircle className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
              {attr}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newAttribute}
            onChange={(e) => setNewAttribute(e.target.value)}
            placeholder="Add custom attribute..."
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem(newAttribute, setPersonalAttributes, setNewAttribute))}
          />
          <Button type="button" onClick={() => addItem(newAttribute, setPersonalAttributes, setNewAttribute)}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {personalAttributes.filter(a => !commonAttributes.includes(a)).map((attr, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {attr}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem(personalAttributes.indexOf(attr), setPersonalAttributes)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Cultural Values */}
      <div className="space-y-3">
        <Label>Cultural Values</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {commonValues.map(value => (
            <Badge
              key={value}
              variant={culturalValues.includes(value) ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => addPredefinedItem(value, setCulturalValues)}
            >
              {culturalValues.includes(value) ? <CheckCircle className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
              {value}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Add custom value..."
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem(newValue, setCulturalValues, setNewValue))}
          />
          <Button type="button" onClick={() => addItem(newValue, setCulturalValues, setNewValue)}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {culturalValues.filter(v => !commonValues.includes(v)).map((value, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {value}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem(culturalValues.indexOf(value), setCulturalValues)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Resume Link */}
      <div className="space-y-2">
        <Label>Resume/Portfolio URL</Label>
        <Input
          type="url"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="https://..."
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3">
        <Button 
          type="submit" 
          disabled={saving || !education || essentialSkills.length === 0 || technicalSkills.length === 0 || personalAttributes.length === 0} 
          className="flex-1"
          size="lg"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Profile Saved!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile & Calculate Job Fit Scores
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="secondary"
          onClick={handleReset}
          disabled={saving}
          size="lg"
          className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        * Required fields for job fit scoring
      </p>
    </form>
  )
}
