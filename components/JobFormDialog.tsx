"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Job } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  company: z.string().min(2, "Company name required"),
  location: z.string().min(2, "Location required"),
  type: z.enum(["full_time", "part_time", "contract", "internship"]),
  description: z.string().min(50, "Description must be at least 50 characters"),
  applyUrl: z.string().url("Must be a valid URL"),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
})

type JobFormData = z.infer<typeof jobSchema>

interface JobFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job?: Job | null
  companyName: string
  onSuccess: () => void
}

export function JobFormDialog({ open, onOpenChange, job, companyName, onSuccess }: JobFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title || "",
      company: job?.company || companyName,
      location: job?.location || "",
      type: (job?.type as JobFormData["type"] | undefined) ?? "full_time",
      description: job?.description || "",
      applyUrl: job?.applyUrl || "",
      salaryMin: job?.salaryMin || undefined,
      salaryMax: job?.salaryMax || undefined,
    },
  })

  React.useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type as JobFormData["type"],
        description: job.description,
        applyUrl: job.applyUrl,
        salaryMin: job.salaryMin || undefined,
        salaryMax: job.salaryMax || undefined,
      })
    } else {
      reset({
        title: "",
        company: companyName,
        location: "",
        type: "full_time",
        description: "",
        applyUrl: "",
        salaryMin: undefined,
        salaryMax: undefined,
      })
    }
  }, [job, companyName, reset])

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true)
    try {
      const url = job ? `/api/jobs/${job.id}` : "/api/jobs"
      const method = job ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save job")
      }

      toast.success(job ? "Job updated successfully!" : "Job posted successfully! Waiting for admin approval.")
      onOpenChange(false)
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job ? "Edit Job" : "Post New Job"}</DialogTitle>
          <DialogDescription>
            {job ? "Update your job posting details." : "Fill in the details to post a new job. It will be reviewed before going live."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Senior Software Engineer"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              placeholder="Your company"
              {...register("company")}
            />
            {errors.company && (
              <p className="text-sm text-red-500">{errors.company.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., New York, Remote"
                {...register("location")}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Employment Type *</Label>
              <Select
                value={watch("type")}
                onValueChange={(value) =>
                  setValue("type", value as JobFormData["type"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Min Salary (optional)</Label>
              <Input
                id="salaryMin"
                type="number"
                placeholder="50000"
                {...register("salaryMin", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryMax">Max Salary (optional)</Label>
              <Input
                id="salaryMax"
                type="number"
                placeholder="100000"
                {...register("salaryMax", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applyUrl">Apply Link *</Label>
            <Input
              id="applyUrl"
              type="url"
              placeholder="https://yourcompany.com/careers/job-id"
              {...register("applyUrl")}
            />
            <p className="text-sm text-muted-foreground">
              Applicants will be redirected here to apply. Must be a direct link to your career page.
            </p>
            {errors.applyUrl && (
              <p className="text-sm text-red-500">{errors.applyUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, requirements..."
              rows={8}
              {...register("description")}
            />
            <p className="text-sm text-muted-foreground">
              Minimum 50 characters
            </p>
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {job ? "Update Job" : "Post Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
