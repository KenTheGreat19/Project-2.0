"use client"

import { Suspense } from "react"
import { SearchBar } from "@/components/SearchBar"
import { JobList } from "@/components/JobList"
import { JobListSkeleton } from "@/components/JobCardSkeleton"
import { AdDisplay } from "@/components/AdDisplay"
import { JobMapSection } from "@/components/JobMapSection"
import { TrendingJobs } from "@/components/TrendingJobs"
import { JobCategories } from "@/components/JobCategories"
import { useLanguage } from "@/contexts/LanguageContext"

export default function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Ad Banner for Guests */}
      <AdDisplay position="banner" />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 dark:from-blue-900 dark:via-blue-950 dark:to-cyan-950 py-20 md:py-28 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-lg animate-fade-in">
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-blue-50 mb-10 max-w-3xl mx-auto font-light">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="container mx-auto px-4 -mt-12 mb-16 relative z-20">
        <div className="glass-effect rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
          <SearchBar />
        </div>
      </section>

      {/* Job Map Section */}
      <section className="container mx-auto px-4 mb-16">
        <Suspense fallback={<JobListSkeleton />}>
          <JobMapSection searchParams={searchParams} />
        </Suspense>
      </section>

      {/* Job Listings Section */}
      <section className="container mx-auto px-4 pb-12">
        <Suspense fallback={<JobListSkeleton />}>
          <JobList searchParams={searchParams} />
        </Suspense>
      </section>

      {/* Trending Jobs Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<JobListSkeleton />}>
            <TrendingJobs />
          </Suspense>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <JobCategories />
      </section>
    </div>
  )
}
