import { notFound } from "next/navigation"
import { MapPin, Briefcase, DollarSign, Building2, Calendar } from "lucide-react"
import prisma from "@/lib/prisma"
import { ApplyButton } from "@/components/ApplyButton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PublicComments } from "@/components/PublicComments"
import { EmployerPublicReviews } from "@/components/EmployerPublicReviews"
import { JobLocationMap } from "@/components/JobLocationMap"
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

  const isRemote = job.location.toLowerCase().includes("remote")
  const timeAgo = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
  const salary = formatSalary(job.salaryMin, job.salaryMax)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
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
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge variant={isRemote ? "success" : "secondary"} className="flex items-center gap-1 py-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </Badge>

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
            {/* Job Location Map */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Job Location</h3>
              <JobLocationMap 
                location={job.location}
                jobTitle={job.title}
                company={job.company}
              />
            </div>
            {/* Apply Button Card */}
            <Card>
              <CardContent className="pt-6">
                <ApplyButton applyUrl={job.applyUrl} jobTitle={job.title} />
              </CardContent>
            </Card>

            {/* Company Info Card */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">About the Company</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                  <p className="font-medium">{job.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="font-medium">{job.location}</p>
                </div>
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
