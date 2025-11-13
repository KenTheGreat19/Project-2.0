import { z } from "zod"

/**
 * Common validation schemas
 */

export const emailSchema = z.string().email("Invalid email address").min(3).max(254)

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")

export const phoneSchema = z
  .string()
  .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number format")
  .min(10, "Phone number is too short")
  .max(20, "Phone number is too long")
  .optional()
  .or(z.literal(""))

export const urlSchema = z
  .string()
  .url("Invalid URL format")
  .max(2048, "URL is too long")
  .optional()
  .or(z.literal(""))

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name is too long")
  .regex(/^[a-zA-Z\s\-\.\']+$/, "Name contains invalid characters")

export const companyNameSchema = z
  .string()
  .min(2, "Company name must be at least 2 characters")
  .max(200, "Company name is too long")

export const locationSchema = z
  .string()
  .min(2, "Location must be at least 2 characters")
  .max(200, "Location is too long")

export const coordinateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export const salarySchema = z.object({
  min: z.number().int().min(0).max(10000000).nullable().optional(),
  max: z.number().int().min(0).max(10000000).nullable().optional(),
  currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD", "INR"]).default("USD"),
})

export const jobTypeSchema = z.enum(["full_time", "part_time", "contract", "internship"])

export const experienceLevelSchema = z.enum(["ENTRY_LEVEL", "MID_LEVEL", "SENIOR", "MANAGER"])

export const degreeTypeSchema = z.enum(["BACHELORS", "MASTERS", "ASSOCIATES", "HIGH_SCHOOL", "NONE"])

/**
 * Validation helper functions
 */

export function validateId(id: string): boolean {
  // Validate CUID format
  return /^[a-z0-9]{25}$/i.test(id)
}

export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .slice(0, maxLength)
}

export function validateDateRange(startDate: Date, endDate: Date): boolean {
  return startDate < endDate
}

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

export function validateFileSize(size: number, maxSizeMB: number = 10): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024
  return size <= maxBytes
}

export function validateFileType(
  filename: string,
  allowedExtensions: string[]
): boolean {
  const ext = filename.split(".").pop()?.toLowerCase()
  return ext ? allowedExtensions.includes(ext) : false
}

/**
 * Complex validation schemas for API requests
 */

export const createJobSchema = z
  .object({
    title: z.string().min(3).max(200),
    company: companyNameSchema,
    location: locationSchema,
    locationLat: z.number().min(-90).max(90).nullable().optional(),
    locationLng: z.number().min(-180).max(180).nullable().optional(),
    type: jobTypeSchema,
    category: z.string().max(100).optional(),
    description: z.string().min(50).max(10000),
    applyUrl: urlSchema,
    acceptApplicationsHere: z.boolean().default(false),
    salaryMin: z.number().int().min(0).nullable().optional(),
    salaryMax: z.number().int().min(0).nullable().optional(),
    salaryCurrency: z.string().length(3).default("USD"),
    careerLink: urlSchema,
    contactEmail: emailSchema.optional().or(z.literal("")),
    contactPhone: phoneSchema,
    degreeRequired: z.boolean().optional(),
    degreeType: degreeTypeSchema.optional(),
    experienceRequired: experienceLevelSchema.optional(),
    yearsOfExperience: z.number().int().min(0).max(50).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.acceptApplicationsHere) return true
      return data.applyUrl && data.applyUrl.length > 0
    },
    {
      message: "Either enable 'Accept Applications Here' or provide an Apply URL",
      path: ["applyUrl"],
    }
  )
  .refine(
    (data) => {
      if (data.salaryMin && data.salaryMax) {
        return data.salaryMax >= data.salaryMin
      }
      return true
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["salaryMax"],
    }
  )

export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  bio: z.string().max(1000).optional(),
  phone: phoneSchema,
  location: locationSchema.optional(),
  website: urlSchema,
  education: z.string().max(500).optional(),
  experienceLevel: z.enum(["entry", "mid", "senior", "executive"]).optional(),
  skills: z.string().max(1000).optional(),
})

export const createReviewSchema = z.object({
  applicationId: z.string().min(1),
  overallRating: z.number().int().min(1).max(5),
  communication: z.number().int().min(1).max(5).optional(),
  professionalism: z.number().int().min(1).max(5).optional(),
  punctuality: z.number().int().min(1).max(5).optional(),
  skills: z.number().int().min(1).max(5).optional(),
  fairness: z.number().int().min(1).max(5).optional(),
  workEnvironment: z.number().int().min(1).max(5).optional(),
  paymentTimeliness: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(2000).optional(),
})
