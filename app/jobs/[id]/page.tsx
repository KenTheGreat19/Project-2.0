import { notFound } from "next/navigation"
import { MapPin, Briefcase, DollarSign, Building2, Calendar, Eye, Users } from "lucide-react"
import prisma from "@/lib/prisma"
import { ApplyButton } from "@/components/ApplyButton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PublicComments } from "@/components/PublicComments"
import { EmployerPublicReviews } from "@/components/EmployerPublicReviews"
import { JobFitGradingWidget } from "@/components/JobFitGradingWidget"
import { ViewTracker } from "@/components/ViewTracker"
import { formatDistanceToNow } from "date-fns"
import { formatSalary } from "@/lib/utils"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id, status: "approved" },
  })

  if (!job) {
    return {
      title: "Job Not Found - ApplyNHire",
    }
  }

  return {
    title: `${job.title} at ${job.company} - ApplyNHire`,
    description: job.description.substring(0, 155),
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: job.description.substring(0, 155),
      type: "website",
    },
  }
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: {
      id: params.id,
      status: "approved",
    },
    include: {
      employer: {
        select: {
          id: true,
          name: true,
          companyName: true,
          employerType: true,
        },
      },
    },
  })

  if (!job) {
    notFound()
  }

  const employmentTypeLabels: Record<string, string> = {
    full_time: "Full Time",
    part_time: "Part Time",
    contract: "Contract",
    internship: "Internship",
  }

  const workModeLabels: Record<string, string> = {
    remote: "Remote",
    onsite: "Onsite",
    hybrid: "Hybrid",
  }

  const employerTypeLabels: Record<string, string> = {
    COMPANY: "Company",
    AGENCY: "Recruitment Agency",
    CLIENT: "Direct Client",
  }

  const isRemote = job.location?.toLowerCase().includes("remote") || (job as any).workMode === "remote"
  const timeAgo = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
  const salary = formatSalary(job.salaryMin, job.salaryMax, (job as any).salaryCurrency || "USD")
  const workMode = workModeLabels[(job as any).workMode || "onsite"] || "Onsite"
  const employerType = employerTypeLabels[job.employer.employerType as string] || "Company"
  const clientCompanyName = (job as any).clientCompanyName

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <ViewTracker jobId={job.id} />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {job.title}
                </h1>

                <div className="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-400 mb-4">
                  <Building2 className="h-5 w-5" />
                  <span className="font-semibold">{job.company}</span>
                  {clientCompanyName && job.employer.employerType === "AGENCY" && (
                    <span className="text-sm text-gray-500">for {clientCompanyName}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {/* Employer Type Badge */}
                  <Badge 
                    variant={job.employer.employerType === "COMPANY" ? "default" : "secondary"}
                    className="py-1.5"
                  >
                    {employerType}
                  </Badge>

                  {/* Work Mode Badge */}
                  <Badge variant={isRemote ? "success" : "secondary"} className="flex items-center gap-1 py-1.5">
                    <MapPin className="h-4 w-4" />
                    {workMode}
                  </Badge>

                  {job.location && (
                    <Badge variant="secondary" className="flex items-center gap-1 py-1.5">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </Badge>
                  )}

                  <Badge variant="default" className="flex items-center gap-1 py-1.5">
                    <Briefcase className="h-4 w-4" />
                    {employmentTypeLabels[job.type] || job.type}
                  </Badge>

                  {salary && (
                    <Badge variant="secondary" className="flex items-center gap-1 py-1.5">
                      <DollarSign className="h-4 w-4" />
                      {salary}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-4">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {timeAgo}</span>
                  <span className="mx-2">•</span>
                  <Eye className="h-4 w-4" />
                  <span>{job.viewsCount || 0} views</span>
                  <span className="mx-2">•</span>
                  <Users className="h-4 w-4" />
                  <span>{job.applicationsCount || 0} applied</span>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Job Description</h2>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Public Comments */}
            <PublicComments jobId={job.id} />

            {/* Employer Reviews */}
            <EmployerPublicReviews 
              employerId={job.employer.id} 
              companyName={job.company}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Fit Grading Widget - Only visible to logged-in applicants */}
            <JobFitGradingWidget jobId={job.id} />

            {/* Job Location Map */}
            {job.location && (job as any).locationLat && (job as any).locationLng && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Job Location</h3>
                <div className="rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800">
                  <iframe
                    width="100%"
                    height="300"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${(job as any).locationLng - 0.01},${(job as any).locationLat - 0.01},${(job as any).locationLng + 0.01},${(job as any).locationLat + 0.01}&layer=mapnik&marker=${(job as any).locationLat},${(job as any).locationLng}`}
                    style={{ border: 0 }}
                  />
                  <div className="p-2 text-sm text-gray-600 dark:text-gray-400">
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${(job as any).locationLat}&mlon=${(job as any).locationLng}#map=15/${(job as any).locationLat}/${(job as any).locationLng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      View Larger Map →
                    </a>
                  </div>
                </div>
              </div>
            )}
            {/* Apply Button Card */}
            <Card>
              <CardContent className="pt-6">
                <ApplyButton 
                  jobId={job.id}
                  applyUrl={job.applyUrl} 
                  jobTitle={job.title}
                  acceptApplicationsHere={(job as any).acceptApplicationsHere || false}
                />
              </CardContent>
            </Card>

            {/* Company Info Card */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Job Details</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Posted By</p>
                  <p className="font-medium">{employerType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                  <p className="font-medium">{job.company}</p>
                  {clientCompanyName && job.employer.employerType === "AGENCY" && (
                    <p className="text-sm text-gray-500 mt-1">Recruiting for: {clientCompanyName}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Work Mode</p>
                  <p className="font-medium">{workMode}</p>
                </div>
                {job.location && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Employment Type</p>
                  <p className="font-medium">{employmentTypeLabels[job.type] || job.type}</p>
                </div>
                {salary && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Salary Range</p>
                    <p className="font-medium">{salary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
