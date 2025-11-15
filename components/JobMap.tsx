"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Navigation, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Import useMap hook for cluster group
import "leaflet/dist/leaflet.css"

// Dynamically import react-leaflet components
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
  employerType?: string | null
  streetAddress?: string
  city?: string
  state?: string
  country?: string
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
    employerType?: string | null
  }>
  onJobClick?: (jobId: string) => void
  height?: number
}

// Geocoding with detailed location breakdown
async function geocodeLocation(location: string): Promise<{
  lat: number
  lng: number
  streetAddress?: string
  city?: string
  state?: string
  country?: string
} | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&addressdetails=1`,
      { headers: { "User-Agent": "ApplyNHire/1.0" } }
    )
    const data = await response.json()
    if (data && data.length > 0) {
      const result = data[0]
      const address = result.address || {}
      
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        streetAddress: address.road || address.street || address.house_number,
        city: address.city || address.town || address.village || address.municipality,
        state: address.state || address.province || address.region,
        country: address.country
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

// Extract city from location string
function extractCity(location: string): string {
  // Handle formats like "New York, NY", "London, UK", "Remote - California"
  const cleaned = location.replace(/^Remote\s*-\s*/i, '').trim()
  const parts = cleaned.split(',')
  return parts[0].trim()
}

// Component to handle map updates - can't use useMap directly with dynamic import
// So we'll control the map through state and MapContainer props instead

export function JobMap({ jobs, onJobClick, height: _height = 600 }: JobMapProps) {
  const [jobLocations, setJobLocations] = useState<JobLocation[]>([])
  const [filteredLocations, setFilteredLocations] = useState<JobLocation[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]) // World center
  const [mapZoom, setMapZoom] = useState(2)
  const [isLoading, setIsLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [cities, setCities] = useState<Array<{ name: string; count: number; distance?: number }>>([])
  const [geolocating, setGeolocating] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  // Load Leaflet CSS and create custom icons
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("leaflet/dist/leaflet.css")
      require("leaflet.markercluster/dist/MarkerCluster.css")
      require("leaflet.markercluster/dist/MarkerCluster.Default.css")
      
      // Add custom styles
      if (!document.getElementById('map-custom-styles')) {
        const style = document.createElement('style')
        style.id = 'map-custom-styles'
        style.innerHTML = `
          .leaflet-control-attribution { display: none !important; }
          .leaflet-container { z-index: 0 !important; }
          [data-radix-popper-content-wrapper] { z-index: 100 !important; }
          .custom-user-marker, .custom-job-marker { background: transparent; border: none; }
          .marker-cluster-small, .marker-cluster-medium, .marker-cluster-large {
            background-color: rgba(110, 204, 57, 0.6);
          }
          .marker-cluster-small div, .marker-cluster-medium div, .marker-cluster-large div {
            background-color: rgba(110, 204, 57, 0.8);
            color: white;
            font-weight: bold;
          }
          .marker-cluster-company { background-color: rgba(37, 99, 235, 0.6) !important; }
          .marker-cluster-company div { background-color: rgba(37, 99, 235, 0.8) !important; }
          .marker-cluster-agency { background-color: rgba(34, 197, 94, 0.6) !important; }
          .marker-cluster-agency div { background-color: rgba(34, 197, 94, 0.8) !important; }
          .marker-cluster-client { background-color: rgba(234, 179, 8, 0.6) !important; }
          .marker-cluster-client div { background-color: rgba(234, 179, 8, 0.8) !important; }
        `
        document.head.appendChild(style)
      }
      
      // Load Leaflet and create custom icons
      import("leaflet").then(async (L) => {
        await import("leaflet.markercluster")
        
        // Custom icon for user location (red inverted-teardrop pin with person silhouette)
        const userIconHtml = `
          <svg width="48" height="60" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Inverted teardrop shape -->
            <path d="M24 0C15.163 0 8 7.163 8 16c0 12 16 44 16 44s16-32 16-44c0-8.837-7.163-16-16-16z" 
                  fill="#dc2626" 
                  stroke="#991b1b" 
                  stroke-width="2.5"/>
            <!-- White circular background for icon -->
            <circle cx="24" cy="16" r="10" fill="white"/>
            <!-- Person/Man silhouette -->
            <circle cx="24" cy="13" r="3" fill="#dc2626"/>
            <path d="M24 16.5c-3 0-5 1.5-5 4h10c0-2.5-2-4-5-4z" fill="#dc2626"/>
          </svg>`
        
        ;(window as any).userIcon = L.default.divIcon({
          html: userIconHtml,
          className: 'custom-user-marker',
          iconSize: [48, 60],
          iconAnchor: [24, 60],
          popupAnchor: [0, -60]
        })

        // Function to create job icon with numbered identifier based on employer type
        ;(window as any).createJobIcon = (employerType: string, index: number) => {
          let color = '#2563eb' // Corporate blue for Company
          let strokeColor = '#1e40af'
          
          if (employerType === 'AGENCY') {
            color = '#22c55e' // Vibrant green for Agency
            strokeColor = '#16a34a'
          } else if (employerType === 'CLIENT') {
            color = '#eab308' // Bright yellow for Client
            strokeColor = '#ca8a04'
          }
          
          const jobIconHtml = `
            <svg width="44" height="56" viewBox="0 0 44 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Inverted teardrop location pin shape -->
              <path d="M22 0C13.716 0 7 6.716 7 15c0 11 15 41 15 41s15-30 15-41c0-8.284-6.716-15-15-15z" 
                    fill="${color}" 
                    stroke="${strokeColor}" 
                    stroke-width="2.5"/>
              <!-- White circular background for number -->
              <circle cx="22" cy="15" r="10" fill="white"/>
              <!-- Numbered identifier (highly legible contrasting text) -->
              <text x="22" y="19" 
                    font-family="Arial, sans-serif" 
                    font-size="11" 
                    font-weight="bold" 
                    fill="${color}" 
                    text-anchor="middle">${index + 1}</text>
            </svg>`
          
          return L.default.divIcon({
            html: jobIconHtml,
            className: 'custom-job-marker',
            iconSize: [44, 56],
            iconAnchor: [22, 56],
            popupAnchor: [0, -56]
          })
        }
        
        setLeafletLoaded(true)
      })
    }
  }, [])

  // Get user's location
  const getUserLocation = () => {
    setLocationError(null)
    setGeolocating(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(userPos)
          setMapCenter([userPos.lat, userPos.lng])
          setMapZoom(12)
          setGeolocating(false)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setLocationError("Unable to get your location. Please enable location services.")
          setGeolocating(false)
        }
      )
    } else {
      setLocationError("Geolocation is not supported by your browser.")
      setGeolocating(false)
    }
  }

  // Auto-detect location on mount
  useEffect(() => {
    getUserLocation()
  }, [])

  // Geocode all job locations
  useEffect(() => {
    let isMounted = true

    async function geocodeJobs() {
      setIsLoading(true)
      const locationsMap = new Map<string, { lat: number; lng: number }>()
      const geocoded: JobLocation[] = []
      const cityCountMap = new Map<string, number>()

      for (const job of jobs.slice(0, 50)) { // Limit to 50 jobs to avoid rate limiting
        let coords = locationsMap.get(job.location)
        
        if (!coords) {
          const geocodedCoords = await geocodeLocation(job.location)
          if (geocodedCoords) {
            coords = geocodedCoords
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

          // Count jobs per city
          const city = extractCity(job.location)
          cityCountMap.set(city, (cityCountMap.get(city) || 0) + 1)
        }
      }

      if (isMounted) {
        // Sort by distance if user location is available
        if (userLocation) {
          geocoded.sort((a, b) => (a.distance || 0) - (b.distance || 0))
        }
        setJobLocations(geocoded)

        // Build cities list with counts
        const citiesList = Array.from(cityCountMap.entries()).map(([name, count]) => {
          const cityJobs = geocoded.filter(j => extractCity(j.location) === name)
          let distance: number | undefined
          if (userLocation && cityJobs.length > 0) {
            // Use the closest job in that city
            distance = Math.min(...cityJobs.map(j => j.distance || Infinity))
          }
          return { name, count, distance }
        })

        // Sort cities by distance if user location available, otherwise by job count
        if (userLocation) {
          citiesList.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
        } else {
          citiesList.sort((a, b) => b.count - a.count)
        }

        setCities(citiesList)
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

  // Filter jobs by selected city
  useEffect(() => {
    if (selectedCity === "all") {
      setFilteredLocations(jobLocations)
    } else {
      const filtered = jobLocations.filter(job => extractCity(job.location) === selectedCity)
      setFilteredLocations(filtered)

      // Update map center
      if (filtered.length > 0) {
        const latSum = filtered.reduce((sum, job) => sum + job.lat, 0)
        const lngSum = filtered.reduce((sum, job) => sum + job.lng, 0)
        setMapCenter([latSum / filtered.length, lngSum / filtered.length])
        setMapZoom(11)
      }
    }
  }, [selectedCity, jobLocations])

  if (!leafletLoaded) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Jobs Near You</h2>
          <p className="text-sm text-muted-foreground">
            {geolocating
              ? "Detecting your location..."
              : userLocation
              ? `Showing ${filteredLocations.length} job${filteredLocations.length !== 1 ? 's' : ''} ${selectedCity !== "all" ? `in ${selectedCity}` : "near you"}`
              : jobLocations.length > 0
              ? `Showing ${jobLocations.length} job locations on the map`
              : "Loading job locations..."}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Company</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Agency</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Client</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto relative z-[100]">
          {cities.length > 0 && (
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Cities ({jobLocations.length})
                </SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name} ({city.count})
                    {city.distance && ` - ${city.distance.toFixed(1)}km`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
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
        <Card className="overflow-hidden relative z-0">
          <div className="h-[500px] relative z-0">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* User location marker */}
              {userLocation && (
                <Marker 
                  position={[userLocation.lat, userLocation.lng]}
                  icon={(window as any).userIcon}
                  eventHandlers={{
                    add: (e) => {
                      e.target.bindPopup(`
                        <div style="text-align: center; font-weight: 600; font-family: system-ui, -apple-system, sans-serif;">
                          📍 Your Location
                        </div>
                      `);
                    }
                  }}
                />
              )}

              {/* Job markers */}
              {filteredLocations.map((job, index) => {
                const typeColor = job.employerType === 'COMPANY' ? '#3b82f6' : 
                                 job.employerType === 'AGENCY' ? '#10b981' : '#eab308';
                
                const popupHTML = `
                  <div style="min-width: 220px; padding: 4px; font-family: system-ui, -apple-system, sans-serif;">
                    <h3 style="font-weight: 600; font-size: 1rem; margin-bottom: 8px; color: #111827;">
                      ${job.title}
                    </h3>
                    <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 8px;">
                      ${job.company}
                    </p>
                    <p style="font-size: 0.875rem; margin-bottom: 8px;">
                      📍 ${job.location}
                    </p>
                    ${job.employerType ? `
                      <p style="font-size: 0.75rem; margin-bottom: 8px;">
                        <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; color: white; font-size: 0.75rem; font-weight: 500; background-color: ${typeColor};">
                          ${job.employerType}
                        </span>
                      </p>
                    ` : ''}
                    ${job.distance ? `
                      <p style="font-size: 0.875rem; color: #2563eb; margin-bottom: 8px;">
                        🗺️ ${job.distance.toFixed(1)} km away
                      </p>
                    ` : ''}
                    ${job.salaryMin && job.salaryMax ? `
                      <p style="font-size: 0.875rem; margin-bottom: 12px; color: #059669;">
                        💰 $${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}
                      </p>
                    ` : ''}
                    <a 
                      href="/jobs/${job.id}"
                      style="display: block; width: 100%; text-align: center; font-size: 0.875rem; padding: 8px 16px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; cursor: pointer;"
                      onmouseover="this.style.background='#1d4ed8'"
                      onmouseout="this.style.background='#2563eb'"
                    >
                      View Details →
                    </a>
                  </div>
                `;
                
                return (
                  <Marker 
                    key={job.id} 
                    position={[job.lat, job.lng]}
                    icon={(window as any).createJobIcon?.(job.employerType || 'COMPANY', index)}
                    eventHandlers={{
                      add: (e) => {
                        e.target.bindPopup(popupHTML, { maxWidth: 280 });
                      }
                    }}
                  />
                )
              })}
            </MapContainer>
          </div>
        </Card>
      )}

      {/* Nearest jobs list */}
      {filteredLocations.length > 0 && userLocation && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">
            {selectedCity === "all" ? "Nearest Jobs" : `Jobs in ${selectedCity}`}
          </h3>
          <div className="space-y-2">
            {filteredLocations.slice(0, 5).map((job) => (
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
          {filteredLocations.length > 5 && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              + {filteredLocations.length - 5} more job{filteredLocations.length - 5 !== 1 ? 's' : ''} available
            </p>
          )}
        </Card>
      )}
    </div>
  )
}
