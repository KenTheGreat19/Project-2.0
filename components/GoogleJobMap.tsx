"use client"

import { useState, useCallback, useMemo } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Navigation } from "lucide-react"

const libraries: ("places")[] = ["places"]

const mapContainerStyle = {
  width: "100%",
  height: "500px",
}

const defaultCenter = {
  lat: 14.5995,
  lng: 120.9842,
}

interface JobLocation {
  id: string
  title: string
  company: string
  location: string
  lat?: number | null
  lng?: number | null
  type: string
  salaryMin?: number | null
  salaryMax?: number | null
  salaryCurrency?: string | null
  employerType?: string | null
}

interface GoogleJobMapProps {
  jobs: JobLocation[]
  onJobClick?: (jobId: string) => void
}

export function GoogleJobMap({ jobs, onJobClick }: GoogleJobMapProps) {
  const [selectedJob, setSelectedJob] = useState<JobLocation | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [geolocating, setGeolocating] = useState(false)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  })

  // Filter jobs that have valid coordinates
  const jobsWithCoordinates = useMemo(() => {
    return jobs.filter((job) => job.lat != null && job.lng != null)
  }, [jobs])

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const getUserLocation = () => {
    setGeolocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(userPos)
          if (map) {
            map.panTo(userPos)
            map.setZoom(12)
          }
          setGeolocating(false)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setGeolocating(false)
        }
      )
    }
  }

  const getMarkerIcon = (employerType?: string | null) => {
    let color = "#2563eb" // Blue for COMPANY
    if (employerType === "AGENCY") {
      color = "#22c55e" // Green
    } else if (employerType === "CLIENT") {
      color = "#eab308" // Yellow
    }

    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: color,
      fillOpacity: 0.9,
      strokeColor: "#ffffff",
      strokeWeight: 2,
    }
  }

  if (loadError) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-500">Error loading Google Maps. Please check your API key configuration.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file
        </p>
      </Card>
    )
  }

  if (!isLoaded) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Card>
    )
  }

  if (jobsWithCoordinates.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No jobs with location coordinates available</p>
        <p className="text-sm text-muted-foreground mt-2">
          Employers need to pin their job locations on the map when posting
        </p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Showing {jobsWithCoordinates.length} job{jobsWithCoordinates.length !== 1 ? "s" : ""} on map
          </span>
        </div>
        <Button
          onClick={getUserLocation}
          variant="outline"
          size="sm"
          disabled={geolocating}
        >
          {geolocating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4 mr-2" />
          )}
          {geolocating ? "Locating..." : "My Location"}
        </Button>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || defaultCenter}
        zoom={userLocation ? 12 : 6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#dc2626",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
            title="Your Location"
          />
        )}

        {/* Job markers with clustering */}
        <MarkerClusterer>
          {(clusterer) => (
            <>
              {jobsWithCoordinates.map((job, index) => (
                <Marker
                  key={job.id}
                  position={{ lat: job.lat!, lng: job.lng! }}
                  clusterer={clusterer}
                  icon={getMarkerIcon(job.employerType)}
                  onClick={() => setSelectedJob(job)}
                  title={`${job.title} - ${job.company}`}
                  label={{
                    text: `${index + 1}`,
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
              ))}
            </>
          )}
        </MarkerClusterer>

        {/* Info Window for selected job */}
        {selectedJob && selectedJob.lat && selectedJob.lng && (
          <InfoWindow
            position={{ lat: selectedJob.lat, lng: selectedJob.lng }}
            onCloseClick={() => setSelectedJob(null)}
          >
            <div style={{ padding: "8px", minWidth: "200px" }}>
              <h3 style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
                {selectedJob.title}
              </h3>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                {selectedJob.company}
              </p>
              <p style={{ fontSize: "12px", marginBottom: "4px" }}>
                📍 {selectedJob.location}
              </p>
              {selectedJob.employerType && (
                <p style={{ fontSize: "12px", marginBottom: "4px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      color: "white",
                      fontSize: "10px",
                      backgroundColor:
                        selectedJob.employerType === "COMPANY"
                          ? "#2563eb"
                          : selectedJob.employerType === "AGENCY"
                          ? "#22c55e"
                          : "#eab308",
                    }}
                  >
                    {selectedJob.employerType}
                  </span>
                </p>
              )}
              {selectedJob.salaryMin && selectedJob.salaryMax && (
                <p style={{ fontSize: "12px", marginBottom: "8px" }}>
                  💰 {selectedJob.salaryCurrency || "$"}
                  {selectedJob.salaryMin.toLocaleString()} - {selectedJob.salaryCurrency || "$"}
                  {selectedJob.salaryMax.toLocaleString()}
                </p>
              )}
              <button
                onClick={() => onJobClick?.(selectedJob.id)}
                style={{
                  width: "100%",
                  fontSize: "12px",
                  padding: "6px 12px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#1d4ed8")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#2563eb")}
              >
                View Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </Card>
  )
}
