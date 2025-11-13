"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { MapPin, Navigation, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

interface JobLocation {
  id: string
  title: string
  company: string
  location: string
  lat: number
  lng: number
  distance?: number
  type: string
  salaryMin?: number | null
  salaryMax?: number | null
}

interface JobMapProps {
  jobs: Array<{
    id: string
    title: string
    company: string
    location: string
    type: string
    salaryMin?: number | null
    salaryMax?: number | null
  }>
  onJobClick?: (jobId: string) => void
}

// Simple geocoding function using Nominatim (free OpenStreetMap service)
async function geocodeLocation(location: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
      { headers: { "User-Agent": "ApplyNHire/1.0" } }
    )
    const data = await response.json()
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      }
    }
  } catch (error) {
    console.error("Geocoding error:", error)
  }
  return null
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function JobMap({ jobs, onJobClick }: JobMapProps) {
  const [jobLocations, setJobLocations] = useState<JobLocation[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]) // World center
  const [mapZoom, setMapZoom] = useState(2)
  const [isLoading, setIsLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  // Load Leaflet CSS
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("leaflet/dist/leaflet.css")
      // Fix for default marker icons in Next.js
      import("leaflet").then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })
        setLeafletLoaded(true)
      })
    }
  }, [])

  // Get user's location
  const getUserLocation = () => {
    setLocationError(null)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(userPos)
          setMapCenter([userPos.lat, userPos.lng])
          setMapZoom(10)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setLocationError("Unable to get your location. Please enable location services.")
        }
      )
    } else {
      setLocationError("Geolocation is not supported by your browser.")
    }
  }

  // Geocode all job locations
  useEffect(() => {
    let isMounted = true

    async function geocodeJobs() {
      setIsLoading(true)
      const locationsMap = new Map<string, { lat: number; lng: number }>()
      const geocoded: JobLocation[] = []

      for (const job of jobs.slice(0, 50)) { // Limit to 50 jobs to avoid rate limiting
        let coords = locationsMap.get(job.location)
        
        if (!coords) {
          const geocoded = await geocodeLocation(job.location)
          if (geocoded) {
            coords = geocoded
            locationsMap.set(job.location, coords)
          }
          // Rate limiting: wait 1 second between requests
          await new Promise(resolve => setTimeout(resolve, 1000))
        }

        if (coords && isMounted) {
          const jobLoc: JobLocation = {
            ...job,
            lat: coords.lat,
            lng: coords.lng,
          }

          // Calculate distance if user location is available
          if (userLocation) {
            jobLoc.distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              coords.lat,
              coords.lng
            )
          }

          geocoded.push(jobLoc)
        }
      }

      if (isMounted) {
        // Sort by distance if user location is available
        if (userLocation) {
          geocoded.sort((a, b) => (a.distance || 0) - (b.distance || 0))
        }
        setJobLocations(geocoded)
        setIsLoading(false)
      }
    }

    if (jobs.length > 0) {
      geocodeJobs()
    } else {
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [jobs, userLocation])

  if (!leafletLoaded) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Jobs Near You</h2>
          <p className="text-sm text-muted-foreground">
            {jobLocations.length > 0
              ? `Showing ${jobLocations.length} job locations on the map`
              : "Loading job locations..."}
          </p>
        </div>
        <Button onClick={getUserLocation} variant="outline" size="sm">
          <Navigation className="h-4 w-4 mr-2" />
          Use My Location
        </Button>
      </div>

      {locationError && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-sm text-yellow-800 dark:text-yellow-200">
          {locationError}
        </div>
      )}

      {isLoading ? (
        <Card className="h-[500px] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading job locations...</p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="h-[500px] relative">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User location marker */}
              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>
                    <div className="text-center font-semibold">
                      <MapPin className="h-4 w-4 inline-block mr-1" />
                      Your Location
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Job location markers */}
              {jobLocations.map((job) => (
                <Marker key={job.id} position={[job.lat, job.lng]}>
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-semibold text-sm mb-1">{job.title}</h3>
                      <p className="text-xs text-muted-foreground mb-1">{job.company}</p>
                      <p className="text-xs mb-1">
                        <MapPin className="h-3 w-3 inline-block mr-1" />
                        {job.location}
                      </p>
                      {job.distance && (
                        <p className="text-xs text-blue-600 mb-2">
                          📍 {job.distance.toFixed(1)} km away
                        </p>
                      )}
                      {job.salaryMin && job.salaryMax && (
                        <p className="text-xs mb-2">
                          💰 ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                        </p>
                      )}
                      <Button
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => onJobClick?.(job.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Card>
      )}

      {/* Nearest jobs list */}
      {jobLocations.length > 0 && userLocation && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Nearest Jobs</h3>
          <div className="space-y-2">
            {jobLocations.slice(0, 5).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                onClick={() => onJobClick?.(job.id)}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.company} • {job.location}</p>
                </div>
                {job.distance && (
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">
                      {job.distance.toFixed(1)} km
                    </p>
                    <p className="text-xs text-muted-foreground">away</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
