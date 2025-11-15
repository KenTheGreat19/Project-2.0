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
import { Checkbox } from "@/components/ui/checkbox"
import { Job } from "@prisma/client"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import Location Picker (no API key needed, uses OpenStreetMap)
const MapboxLocationPicker = dynamic(
  () => import("@/components/MapboxLocationPicker").then((mod) => ({ default: mod.MapboxLocationPicker })),
  { ssr: false }
)

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
]

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  company: z.string().min(1, "Company name required"),
  clientCompanyName: z.string().optional().nullable().transform(val => val || undefined),
  location: z.string().optional().nullable().transform(val => val || undefined),
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
  workMode: z.enum(["remote", "onsite", "hybrid"]),
  type: z.enum(["full_time", "part_time", "contract", "internship"]),
  category: z.string().optional().nullable().transform(val => val || undefined),
  description: z.string().min(50, "Description must be at least 50 characters"),
  applyUrl: z.string().optional().nullable().transform(val => val || ""),
  acceptApplicationsHere: z.boolean().default(false),
  salaryMin: z.number().optional().nullable(),
  salaryMax: z.number().optional().nullable(),
  salaryCurrency: z.string().default("USD"),
}).refine((data) => {
  // At least one application method must be selected
  return data.acceptApplicationsHere || (data.applyUrl && data.applyUrl.length > 0)
}, {
  message: "Either enable 'Accept Applications Here' or provide an Apply URL (or both)",
  path: ["applyUrl"],
})

type JobFormData = z.infer<typeof jobSchema>

interface JobFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job?: Job | null
  companyName: string
  employerType?: string | null
  onSuccess: () => void
}

export function JobFormDialog({ open, onOpenChange, job, companyName, employerType, onSuccess }: JobFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title || "",
      company: job?.company || companyName,
      clientCompanyName: (job as any)?.clientCompanyName || "",
      location: job?.location || "",
      locationLat: (job as any)?.locationLat || undefined,
      locationLng: (job as any)?.locationLng || undefined,
      workMode: (job as any)?.workMode || "onsite",
      type: (job?.type as JobFormData["type"] | undefined) ?? "full_time",
      category: (job as any)?.category || undefined,
      description: job?.description || "",
      applyUrl: job?.applyUrl || "",
      acceptApplicationsHere: (job as any)?.acceptApplicationsHere || false,
      salaryMin: job?.salaryMin || undefined,
      salaryMax: job?.salaryMax || undefined,
      salaryCurrency: (job as any)?.salaryCurrency || "USD",
    },
  })

  const acceptApplicationsHere = watch("acceptApplicationsHere")

  React.useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        company: job.company,
        clientCompanyName: (job as any).clientCompanyName || "",
        location: job.location || undefined,
        locationLat: (job as any).locationLat || undefined,
        locationLng: (job as any).locationLng || undefined,
        workMode: (job as any).workMode || "onsite",
        type: job.type as JobFormData["type"],
        category: (job as any).category || undefined,
        description: job.description,
        applyUrl: job.applyUrl,
        acceptApplicationsHere: (job as any).acceptApplicationsHere || false,
        salaryMin: job.salaryMin || undefined,
        salaryMax: job.salaryMax || undefined,
        salaryCurrency: (job as any).salaryCurrency || "USD",
      })
    } else {
      reset({
        title: "",
        company: companyName,
        clientCompanyName: "",
        location: "",
        locationLat: undefined,
        locationLng: undefined,
        workMode: "onsite",
        type: "full_time",
        category: undefined,
        description: "",
        applyUrl: "",
        acceptApplicationsHere: false,
        salaryMin: undefined,
        salaryMax: undefined,
        salaryCurrency: "USD",
      })
    }
  }, [job, companyName, reset])

  // Ensure company name is always set in the form
  React.useEffect(() => {
    if (companyName) {
      setValue("company", companyName)
    }
  }, [companyName, setValue])

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true)
    try {
      // Ensure company name is set
      const submitData = {
        ...data,
        company: data.company || companyName,
        workMode: data.workMode || "onsite",
        location: data.location || "",
      }
      
      console.log("Form data being submitted:", submitData)
      
      const url = job ? `/api/jobs/${job.id}` : "/api/jobs"
      const method = job ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Job creation error:", error)
        if (error.details && Array.isArray(error.details)) {
          const errorMessages = error.details.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
          throw new Error(errorMessages)
        }
        throw new Error(error.error || "Failed to save job")
      }

      toast.success(job ? "Job updated successfully!" : "Job posted successfully and is now live!")
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
            {job ? "Update your job posting details." : "Fill in the details to post a new job. Your job will be live immediately."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Hidden company field - always set the value */}
          <input type="hidden" {...register("company")} value={companyName} />
          
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

          {/* Company name field - Always visible but handled differently by employer type */}
          {employerType !== "CLIENT" && employerType !== "AGENCY" && (
            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                placeholder="Your company"
                value={companyName}
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
              <p className="text-sm text-muted-foreground">
                This is your registered company name
              </p>
            </div>
          )}

          {/* Company name field - Hidden for COMPANY, visible for AGENCY and CLIENT */}
          {employerType === "AGENCY" && (
            <div className="space-y-2">
              <Label htmlFor="clientCompanyName">Client Company Name (Optional)</Label>
              <Input
                id="clientCompanyName"
                placeholder="Company you're recruiting for"
                {...register("clientCompanyName")}
              />
              <p className="text-sm text-muted-foreground">
                Your agency name will be displayed along with this company name
              </p>
              {errors.clientCompanyName && (
                <p className="text-sm text-red-500">{errors.clientCompanyName.message}</p>
              )}
            </div>
          )}

          {employerType === "CLIENT" && (
            <div className="space-y-2 rounded-lg border bg-blue-50 dark:bg-blue-950/30 p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Privacy Notice:</strong> Your name will be displayed as &quot;{companyName?.split(' ')[0]} {companyName?.split(' ')[1]?.[0]}.&quot; to protect your privacy.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="workMode">Work Mode *</Label>
            <Select
              value={watch("workMode")}
              onValueChange={(value) =>
                setValue("workMode", value as "remote" | "onsite" | "hybrid")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">Onsite</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            {errors.workMode && (
              <p className="text-sm text-red-500">{errors.workMode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">
              Location {employerType === "CLIENT" ? "(Optional)" : "*"}
            </Label>
            
            <MapboxLocationPicker
              onLocationSelect={(location) => {
                setValue("location", location.address)
                setValue("locationLat", location.lat)
                setValue("locationLng", location.lng)
              }}
              initialLocation={{
                address: watch("location") || undefined,
                lat: watch("locationLat") || undefined,
                lng: watch("locationLng") || undefined,
              }}
            />
            
            {employerType === "CLIENT" && (
              <p className="text-sm text-muted-foreground">
                You can skip this field if you prefer not to share your location
              </p>
            )}
            
            {errors.location && (
              <p className="text-sm text-red-500 mt-2">{errors.location.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watch("category") || ""}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Salary Range (optional)</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="salaryCurrency" className="text-xs">Currency</Label>
                <Select
                  value={watch("salaryCurrency")}
                  onValueChange={(value) => setValue("salaryCurrency", value)}
                >
                  <SelectTrigger id="salaryCurrency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMin" className="text-xs">Min Salary</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="50000"
                  {...register("salaryMin", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMax" className="text-xs">Max Salary</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  placeholder="100000"
                  {...register("salaryMax", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t pt-4">
            <div className="flex items-start space-x-3 rounded-lg border p-4 bg-blue-50 dark:bg-blue-950/30">
              <Controller
                name="acceptApplicationsHere"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="acceptApplicationsHere"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div className="space-y-1 flex-1">
                <Label
                  htmlFor="acceptApplicationsHere"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Accept Applications Here
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable this to receive applications directly in your ApplyNHire dashboard. 
                  An &quot;Apply Now&quot; button will appear on the job post.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applyUrl">
                External Apply Link {!acceptApplicationsHere && "*"}
              </Label>
              <Input
                id="applyUrl"
                type="url"
                placeholder="https://yourcompany.com/careers/job-id"
                {...register("applyUrl")}
              />
              <p className="text-sm text-muted-foreground">
                {acceptApplicationsHere 
                  ? "Optional: Add your career page link to give applicants both options"
                  : "Required: Applicants will be redirected here to apply"
                }
              </p>
              {errors.applyUrl && (
                <p className="text-sm text-red-500">{errors.applyUrl.message}</p>
              )}
            </div>
            
            {acceptApplicationsHere && watch("applyUrl") && (
              <div className="rounded-lg border bg-green-50 dark:bg-green-950/30 p-3">
                <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Both options enabled!</strong> Applicants can choose to apply through ApplyNHire or visit your career page.</span>
                </p>
              </div>
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
