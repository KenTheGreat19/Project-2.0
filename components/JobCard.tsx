"use client"

import Link from "next/link"
import { MapPin, Briefcase, Clock, DollarSign, Star, CheckCircle, Zap, TrendingUp, Eye, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SaveJobButton } from "@/components/SaveJobButton"
import { LikeButton } from "@/components/LikeButton"
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
    isSponsored?: boolean
    likesCount?: number
    commentsCount?: number
    viewsCount?: number
    applicationsCount?: number
    employer?: {
      averageRating: number
      isVerified: boolean
      totalReviews: number
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
    <Card className={`hover-lift rounded-xl overflow-hidden border-2 ${job.isSponsored ? 'border-yellow-400 dark:border-yellow-600 shadow-xl' : 'border-transparent'}`}>
      <CardHeader className="pb-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="flex gap-2 flex-wrap">
          {job.isSponsored && (
            <Badge variant="warning" className="w-fit gap-1 shadow-md">
              <Zap className="h-3 w-3" />
              {t("jobs.sponsored")}
            </Badge>
          )}
          {showTrendingBadge && (
            <Badge variant="secondary" className="w-fit gap-1 bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md">
              <TrendingUp className="h-3 w-3" />
              {t("jobs.trending")}
            </Badge>
          )}
        </div>
        {(job.isSponsored || showTrendingBadge) && <div className="h-2" />}
        <Link 
          href={`/jobs/${job.id}`}
          className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
          {job.employer?.isVerified && (
            <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <CheckCircle className="h-3 w-3" />
              Verified
            </span>
          )}
          {job.employer && job.employer.averageRating > 0 && (
            <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
              <Star className="h-3 w-3 fill-current" />
              {job.employer.averageRating.toFixed(1)} ({job.employer.totalReviews})
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant={isRemote ? "success" : "secondary"} className="flex items-center gap-1 shadow-sm">
            <MapPin className="h-3 w-3" />
            {workMode}
          </Badge>

          {job.location && (
            <Badge variant="secondary" className="flex items-center gap-1 shadow-sm">
              <MapPin className="h-3 w-3" />
              {job.location}
            </Badge>
          )}

          <Badge variant="default" className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-cyan-600 shadow-sm">
            <Briefcase className="h-3 w-3" />
            {getEmploymentTypeLabel(job.type)}
          </Badge>

          {salary && (
            <Badge variant="secondary" className="flex items-center gap-1 shadow-sm bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              <DollarSign className="h-3 w-3" />
              {salary}
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
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

      <CardFooter className="flex gap-2 pt-4 bg-gray-50 dark:bg-gray-800/50">
        <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all">
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>
        <LikeButton jobId={job.id} initialLikesCount={job.likesCount || 0} />
        <SaveJobButton jobId={job.id} variant="outline" />
      </CardFooter>
    </Card>
  )
}
