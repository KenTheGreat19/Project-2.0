import { NextRequest, NextResponse } from "next/server"

interface JobPosting {
  title: string
  location?: string
  description?: string
  url: string
}

// Safely extract text content from HTML strings
// Note: This function is used to extract job titles from scraped HTML.
// The extracted text is never rendered as HTML - it's only used as plain text
// in JSON responses and displayed as text content in React components.
// CodeQL flags: Acknowledged - no XSS risk as output is never interpreted as HTML.
function sanitizeHtml(text: string): string {
  if (!text) return ""
  
  // First, remove script tags entirely (defense in depth)
  let sanitized = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
  
  // Remove all other HTML tags
  sanitized = sanitized.replace(/<[^>]+>/g, "")
  
  // Decode common HTML entities for better readability
  // Note: Order matters - decode & last to avoid double-decoding
  sanitized = sanitized
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
  
  return sanitized.trim()
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      )
    }

    // Validate URL format
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      )
    }

    // Fetch the career page
    const response = await fetch(validUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch the URL" },
        { status: response.status }
      )
    }

    const html = await response.text()

    // Parse job listings from HTML
    const jobs = parseJobsFromHTML(html, validUrl.origin)

    return NextResponse.json({
      success: true,
      companyUrl: validUrl.origin,
      jobsFound: jobs.length,
      jobs: jobs,
    })
  } catch (error) {
    console.error("Scraper error:", error)
    return NextResponse.json(
      { error: "Failed to scrape career page" },
      { status: 500 }
    )
  }
}

function parseJobsFromHTML(html: string, baseUrl: string): JobPosting[] {
  const jobs: JobPosting[] = []

  // Common patterns for job listings
  const jobPatterns = [
    // Pattern 1: Job title in h2, h3, or h4 with link
    /<(?:h2|h3|h4)[^>]*>[\s\S]*?<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>[\s\S]*?<\/(?:h2|h3|h4)>/gi,
    // Pattern 2: Links with job-related keywords
    /<a[^>]*href=["']([^"']+)["'][^>]*class=["'][^"']*(?:job|career|position|opening)[^"']*["'][^>]*>(.*?)<\/a>/gi,
    // Pattern 3: Job listings in list items
    /<li[^>]*class=["'][^"']*(?:job|career|position)[^"']*["'][^>]*>[\s\S]*?<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>[\s\S]*?<\/li>/gi,
  ]

  // Try each pattern
  for (const pattern of jobPatterns) {
    let match
    while ((match = pattern.exec(html)) !== null) {
      const url = match[1]
      const title = sanitizeHtml(match[2] || "")

      if (title && url && title.length > 3) {
        // Construct absolute URL
        let jobUrl = url
        try {
          if (!url.startsWith("http")) {
            jobUrl = new URL(url, baseUrl).toString()
          }
        } catch (e) {
          continue
        }

        // Check if this job is already in our list
        if (!jobs.find((j) => j.url === jobUrl || j.title === title)) {
          jobs.push({
            title,
            url: jobUrl,
          })
        }
      }
    }
  }

  // If we found jobs with patterns, return them
  if (jobs.length > 0) {
    return jobs.slice(0, 50) // Limit to 50 jobs
  }

  // Fallback: Search for links with job-related keywords in href or text
  const linkPattern = /<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi
  let match
  while ((match = linkPattern.exec(html)) !== null) {
    const url = match[1]
    const text = sanitizeHtml(match[2] || "")

    const hasJobKeyword =
      /\b(?:job|career|position|opening|opportunity|hiring|vacancy|apply)\b/i.test(
        url + " " + text
      )

    if (hasJobKeyword && text && text.length > 3 && text.length < 200) {
      let jobUrl = url
      try {
        if (!url.startsWith("http")) {
          jobUrl = new URL(url, baseUrl).toString()
        }
      } catch (e) {
        continue
      }

      if (!jobs.find((j) => j.url === jobUrl)) {
        jobs.push({
          title: text,
          url: jobUrl,
        })
      }
    }
  }

  return jobs.slice(0, 50) // Limit to 50 jobs
}
