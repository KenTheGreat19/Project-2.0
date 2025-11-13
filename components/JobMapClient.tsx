"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { JobMap } from "@/components/JobMap"
import { Button } from "@/components/ui/button"
import { Map, List } from "lucide-react"

interface JobMapClientProps {
  jobs: Array<{
    id: string
    title: string
    company: string
    location: string
    type: string
    salaryMin?: number | null
    salaryMax?: number | null
  }>
}

export function JobMapClient({ jobs }: JobMapClientProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"map" | "list">("list")

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Explore Jobs on Map</h2>
          <p className="text-sm text-muted-foreground">
            Find jobs near you with our interactive map
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            <Map className="h-4 w-4 mr-2" />
            Map View
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-2" />
            List View
          </Button>
        </div>
      </div>

      {viewMode === "map" ? (
        <JobMap jobs={jobs} onJobClick={handleJobClick} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>Switch to Map View to see job locations</p>
        </div>
      )}
    </div>
  )
}
