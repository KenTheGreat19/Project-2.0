"use client"

import { CareerScraper } from "@/components/CareerScraper"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A66C2] mb-4">
            Career Pages Scraper
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
            Discover job openings from any company&apos;s career page
          </p>
        </div>
      </section>

      {/* Career Scraper Section */}
      <section className="container mx-auto px-4 -mt-8 mb-12">
        <CareerScraper />
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-semibold mb-2">1. Enter URL</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Paste the career page URL of any company you&apos;re interested in
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-semibold mb-2">2. Scrape Jobs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Our scraper extracts all job postings from the page
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-semibold mb-2">3. View Results</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get a clean list of all available positions with direct links
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
