import { Suspense } from "react"
import { SearchBar } from "@/components/SearchBar"
import { JobList } from "@/components/JobList"
import { JobListSkeleton } from "@/components/JobCardSkeleton"
import { AdDisplay } from "@/components/AdDisplay"
import { JobMapSection } from "@/components/JobMapSection"

export default function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="min-h-screen">
      {/* Ad Banner for Guests */}
      <AdDisplay position="banner" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A66C2] mb-4">
            Find Jobs. Hire Talent. 100% Free.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
            Post unlimited jobs. Apply instantly. No fees. Ever.
          </p>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="container mx-auto px-4 -mt-8 mb-12">
        <SearchBar />
      </section>

      {/* Job Map Section */}
      <section className="container mx-auto px-4 mb-12">
        <Suspense fallback={<JobListSkeleton />}>
          <JobMapSection searchParams={searchParams} />
        </Suspense>
      </section>

      {/* Job Listings Section */}
      <section className="container mx-auto px-4 pb-16">
        <Suspense fallback={<JobListSkeleton />}>
          <JobList searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  )
}
