"use client"

import Link from "next/link"
import { MapPin, Briefcase, Clock, DollarSign, TrendingUp, Eye, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { formatSalary, truncateText } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"

interface JobCardProps {
  job: {
    id: string
    title: string
    company: string
    clientCompanyName?: string | null
    location?: string | null
    workMode?: string
    type: string
    description: string
    salaryMin?: number | null
    salaryMax?: number | null
    createdAt: Date
    viewsCount?: number
    applicationsCount?: number
    employer?: {
      employerType?: string | null
    }
  }
  showTrendingBadge?: boolean
}

export function JobCard({ job, showTrendingBadge }: JobCardProps) {
  const { t } = useLanguage()
  
  const getEmploymentTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      full_time: t("jobType.full_time"),
      part_time: t("jobType.part_time"),
      contract: t("jobType.contract"),
      internship: t("jobType.internship"),
    }
    return typeMap[type] || type
  }

  const getWorkModeLabel = (mode: string) => {
    const modeMap: Record<string, string> = {
      remote: t("workMode.remote"),
      onsite: t("workMode.onsite"),
      hybrid: t("workMode.hybrid"),
    }
    return modeMap[mode] || t("workMode.onsite")
  }

  const getEmployerTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      COMPANY: t("jobs.company"),
      AGENCY: t("jobs.agency"),
      CLIENT: t("jobs.client"),
    }
    return typeMap[type] || null
  }

  const isRemote = job.location?.toLowerCase().includes("remote") || job.workMode === "remote"
  const timeAgo = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
  const salary = formatSalary(job.salaryMin, job.salaryMax)
  const workMode = getWorkModeLabel(job.workMode || "onsite")
  const employerType = getEmployerTypeLabel(job.employer?.employerType as string)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex gap-2 flex-wrap">
          {showTrendingBadge && (
            <Badge variant="secondary" className="w-fit gap-1 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
              <TrendingUp className="h-3 w-3" />
              {t("jobs.trending")}
            </Badge>
          )}
        </div>
        {showTrendingBadge && <div className="h-2" />}
        <Link 
          href={`/jobs/${job.id}`}
          className="text-xl font-bold text-gray-900 dark:text-white hover:text-[#0A66C2] dark:hover:text-[#0A66C2] transition-colors"
        >
          {job.title}
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {job.company}
            {job.clientCompanyName && job.employer?.employerType === "AGENCY" && (
              <span className="text-sm text-gray-500 ml-1">→ {job.clientCompanyName}</span>
            )}
          </p>
          {employerType && (
            <Badge variant="secondary" className="text-xs">
              {employerType}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={isRemote ? "success" : "secondary"} className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {workMode}
          </Badge>

          {job.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </Badge>
          )}

          <Badge variant="default" className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {getEmploymentTypeLabel(job.type)}
          </Badge>

          {salary && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {salary}
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {truncateText(job.description, 120)}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{job.viewsCount || 0} {t("jobs.views")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{job.applicationsCount || 0} {t("jobs.applications")}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1 bg-[#0A66C2] hover:bg-[#0A66C2]/90">
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
