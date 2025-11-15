"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ExternalLink, Briefcase, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface JobPosting {
  title: string
  location?: string
  description?: string
  url: string
}

interface ScraperResult {
  success: boolean
  companyUrl: string
  jobsFound: number
  jobs: JobPosting[]
  error?: string
}

export function CareerScraper() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ScraperResult | null>(null)

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url) {
      toast.error("Please enter a URL")
      return
    }

    setLoading(true)
    setResults(null)

    try {
      const response = await fetch("/api/scraper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to scrape career page")
      }

      setResults(data)
      toast.success(`Found ${data.jobsFound} job postings!`)
    } catch (error) {
      console.error("Scraper error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to scrape career page")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            Career Pages Scraper
          </CardTitle>
          <CardDescription>
            Enter any company&apos;s career page URL to discover their job openings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleScrape} className="flex gap-2">
            <Input
              type="url"
              placeholder="https://company.com/careers"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Scrape
                </>
              )}
            </Button>
          </form>
          
          {/* Example URLs */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-2">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setUrl("https://www.google.com/about/careers/applications/")}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Google Careers
              </button>
              <button
                type="button"
                onClick={() => setUrl("https://www.microsoft.com/en-us/careers")}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Microsoft Careers
              </button>
              <button
                type="button"
                onClick={() => setUrl("https://www.apple.com/careers/")}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Apple Careers
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>
              {results.jobsFound > 0 
                ? `Found ${results.jobsFound} Job Opening${results.jobsFound !== 1 ? 's' : ''}`
                : "No Jobs Found"
              }
            </CardTitle>
            <CardDescription>
              From: {results.companyUrl}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.jobsFound > 0 ? (
              <div className="space-y-3">
                {results.jobs.map((job, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      {job.location && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {job.location}
                        </p>
                      )}
                      {job.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {job.description}
                        </p>
                      )}
                    </div>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium whitespace-nowrap"
                    >
                      View Job
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No job postings were found on this page.</p>
                <p className="text-sm mt-2">Try a different URL or the company&apos;s main careers page.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
