import Link from "next/link"
import { MapPin, Briefcase, Clock, DollarSign, Star, CheckCircle, Zap } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SaveJobButton } from "@/components/SaveJobButton"
import { LikeButton } from "@/components/LikeButton"
import { formatDistanceToNow } from "date-fns"
import { formatSalary, truncateText } from "@/lib/utils"

interface JobCardProps {
  job: {
    id: string
    title: string
    company: string
    location: string
    type: string
    description: string
    salaryMin?: number | null
    salaryMax?: number | null
    createdAt: Date
    isSponsored?: boolean
    likesCount?: number
    commentsCount?: number
    employer?: {
      averageRating: number
      isVerified: boolean
      totalReviews: number
    }
  }
}

export function JobCard({ job }: JobCardProps) {
  const employmentTypeLabels: Record<string, string> = {
    full_time: "Full Time",
    part_time: "Part Time",
    contract: "Contract",
    internship: "Internship",
  }

  const isRemote = job.location.toLowerCase().includes("remote")
  const timeAgo = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
  const salary = formatSalary(job.salaryMin, job.salaryMax)

  return (
    <Card className={`hover:shadow-lg transition-shadow ${job.isSponsored ? 'border-2 border-yellow-400 dark:border-yellow-600' : ''}`}>
      <CardHeader className="pb-3">
        {job.isSponsored && (
          <Badge variant="warning" className="w-fit mb-2 gap-1">
            <Zap className="h-3 w-3" />
            Sponsored
          </Badge>
        )}
        <Link 
          href={`/jobs/${job.id}`}
          className="text-xl font-bold text-gray-900 dark:text-white hover:text-[#0A66C2] dark:hover:text-[#0A66C2] transition-colors"
        >
          {job.title}
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {job.company}
          </p>
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

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={isRemote ? "success" : "secondary"} className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.location}
          </Badge>

          <Badge variant="default" className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {employmentTypeLabels[job.type] || job.type}
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

        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
          <Clock className="h-3 w-3" />
          <span>Posted {timeAgo}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1 bg-[#0A66C2] hover:bg-[#0A66C2]/90">
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>
        <LikeButton jobId={job.id} initialLikesCount={job.likesCount || 0} />
        <SaveJobButton jobId={job.id} variant="outline" />
      </CardFooter>
    </Card>
  )
}
