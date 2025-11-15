"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Navigation, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import "leaflet/dist/leaflet.css"

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

interface LocationCluster {
  lat: number
  lng: number
  count: number
  jobs: JobLocation[]
  label: string
  level: 'country' | 'state' | 'city' | 'street'
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
        streetAddress: address.road || address.street || address.house_number || address.suburb,
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

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
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

// Group jobs by location level based on zoom
function clusterJobsByZoom(jobs: JobLocation[], zoom: number): LocationCluster[] {
  const clusters: Map<string, LocationCluster> = new Map()
  
  jobs.forEach(job => {
    let key: string
    let label: string
    let level: 'country' | 'state' | 'city' | 'street'
    let lat = job.lat
    let lng = job.lng
    
    // Zoom levels: 0-4 = country, 5-8 = state, 9-13 = city, 14+ = street
    if (zoom >= 14 && job.streetAddress) {
      // Street level - show individual jobs with specific addresses
      key = `${job.lat}-${job.lng}`
      label = job.streetAddress
      level = 'street'
    } else if (zoom >= 9 && job.city) {
      // City level - group by city
      key = `city-${job.city}-${job.country}`
      label = job.city
      level = 'city'
    } else if (zoom >= 5 && job.state) {
      // State level - group by state
      key = `state-${job.state}-${job.country}`
      label = job.state
      level = 'state'
    } else if (job.country) {
      // Country level - group by country
      key = `country-${job.country}`
      label = job.country
      level = 'country'
    } else {
      // Fallback to exact location
      key = `${job.lat}-${job.lng}`
      label = job.location
      level = 'street'
    }
    
    if (!clusters.has(key)) {
      clusters.set(key, {
        lat,
        lng,
        count: 0,
        jobs: [],
        label,
        level
      })
    }
    
    const cluster = clusters.get(key)!
    cluster.count++
    cluster.jobs.push(job)
    
    // Update cluster center to average of all jobs
    if (cluster.jobs.length > 1) {
      const avgLat = cluster.jobs.reduce((sum, j) => sum + j.lat, 0) / cluster.jobs.length
      const avgLng = cluster.jobs.reduce((sum, j) => sum + j.lng, 0) / cluster.jobs.length
      cluster.lat = avgLat
      cluster.lng = avgLng
    }
  })
  
  return Array.from(clusters.values())
}

export function JobMap({ jobs, onJobClick: _onJobClick, height: _height = 600 }: JobMapProps) {
  const [jobLocations, setJobLocations] = useState<JobLocation[]>([])
  const [clusters, setClusters] = useState<LocationCluster[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0])
  const [mapZoom, setMapZoom] = useState(2)
  const [currentZoom, setCurrentZoom] = useState(2)
  const [isLoading, setIsLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [geolocating, setGeolocating] = useState(false)
  
  // Load Leaflet icons
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("leaflet/dist/leaflet.css")
      
      const style = document.createElement('style')
      style.id = 'map-custom-styles'
      style.innerHTML = `
        .leaflet-control-attribution { display: none !important; }
        .leaflet-container { z-index: 0 !important; }
        .custom-user-marker, .custom-cluster-marker { background: transparent; border: none; }
      `
      if (!document.getElementById('map-custom-styles')) {
        document.head.appendChild(style)
      }
      
      import("leaflet").then((L) => {
        const userIconHtml = `
          <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C12 0 6 6 6 14c0 10 14 36 14 36s14-26 14-36c0-8-6-14-14-14z" 
                  fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
            <circle cx="20" cy="14" r="8" fill="white"/>
            <circle cx="20" cy="12" r="2.5" fill="#dc2626"/>
            <path d="M20 14.5c-2.5 0-4 1.2-4 3.2h8c0-2-1.5-3.2-4-3.2z" fill="#dc2626"/>
          </svg>`
        
        ;(window as any).userIcon = L.default.divIcon({
          html: userIconHtml,
          className: 'custom-user-marker',
          iconSize: [40, 50],
          iconAnchor: [20, 50],
          popupAnchor: [0, -50]
        })

        // Create color-coded job pin for individual jobs (street level)
        ;(window as any).createJobIcon = (employerType: string) => {
          let color = '#f97316' // Orange for Company
          let strokeColor = '#ea580c'
          
          if (employerType === 'AGENCY') {
            color = '#22c55e' // Green for Agency
            strokeColor = '#16a34a'
          } else if (employerType === 'CLIENT') {
            color = '#eab308' // Yellow for Client
            strokeColor = '#ca8a04'
          }
          
          const jobIconHtml = `
            <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 0C11 0 5 6 5 13c0 9 13 35 13 35s13-26 13-35c0-7-6-13-13-13z" 
                    fill="${color}" 
                    stroke="${strokeColor}" 
                    stroke-width="2.5"/>
              <circle cx="18" cy="13" r="7" fill="white"/>
              <circle cx="18" cy="11.5" r="2" fill="${color}"/>
              <path d="M18 13.5c-2 0-3.5 1-3.5 2.8h7c0-1.8-1.5-2.8-3.5-2.8z" fill="${color}"/>
            </svg>`
          
          return L.default.divIcon({
            html: jobIconHtml,
            className: 'custom-user-marker',
            iconSize: [36, 48],
            iconAnchor: [18, 48],
            popupAnchor: [0, -48]
          })
        }

        // Create blue circle for aggregated clusters (city/state/country)
        ;(window as any).createClusterIcon = (count: number, _level: string) => {
          // Blue color for all aggregation levels (country/state/city)
          const color = '#2563eb'
          const strokeColor = '#1e40af'
          
          // Size based on count
          const size = Math.min(60, 30 + Math.log(count) * 8)
          
          const clusterIconHtml = `
            <div style="position: relative; width: ${size}px; height: ${size}px;">
              <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
                <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" 
                        fill="${color}" 
                        stroke="${strokeColor}" 
                        stroke-width="3" 
                        opacity="0.9"/>
                <text x="${size/2}" y="${size/2 + 6}" 
                      font-family="Arial, sans-serif" 
                      font-size="${Math.min(18, size * 0.4)}" 
                      font-weight="bold" 
                      fill="white" 
                      text-anchor="middle">${count}</text>
              </svg>
            </div>`
          
          return L.default.divIcon({
            html: clusterIconHtml,
            className: 'custom-cluster-marker',
            iconSize: [size, size],
            iconAnchor: [size/2, size/2],
            popupAnchor: [0, -size/2]
          })
        }
      })
    }
  }, [])

  // Geocode jobs
  useEffect(() => {
    const geocodeJobs = async () => {
      setIsLoading(true)
      const geocodedJobs: JobLocation[] = []
      
      for (const job of jobs) {
        const coords = await geocodeLocation(job.location)
        if (coords) {
          geocodedJobs.push({
            ...job,
            ...coords,
            distance: userLocation
              ? calculateDistance(userLocation.lat, userLocation.lng, coords.lat, coords.lng)
              : undefined
          })
        }
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      setJobLocations(geocodedJobs)
      setIsLoading(false)
    }
    
    if (jobs.length > 0) {
      geocodeJobs()
    }
  }, [jobs])

  // Update clusters when zoom or jobs change
  useEffect(() => {
    if (jobLocations.length > 0) {
      const newClusters = clusterJobsByZoom(jobLocations, currentZoom)
      setClusters(newClusters)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobLocations, currentZoom])

  // Get user location
  const getUserLocation = () => {
    setGeolocating(true)
    setLocationError(null)
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(userLoc)
          setMapCenter([userLoc.lat, userLoc.lng])
          setMapZoom(13)
          setCurrentZoom(13)
          setGeolocating(false)
        },
        (_error) => {
          setLocationError("Unable to get your location. Please enable location services.")
          setGeolocating(false)
        }
      )
    } else {
      setLocationError("Geolocation is not supported by your browser")
      setGeolocating(false)
    }
  }


  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
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
        
        <div className="text-sm text-muted-foreground">
          Zoom level: {currentZoom} | 
          {currentZoom >= 14 ? " Showing street addresses" : 
           currentZoom >= 9 ? " Showing cities" : 
           currentZoom >= 5 ? " Showing states/provinces" : 
           " Showing countries"}
        </div>
      </div>

      {locationError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
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
          <div className="h-[500px]">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
                attribution='&copy; OpenStreetMap contributors'
              />
              
              {userLocation && (
                <Marker 
                  position={[userLocation.lat, userLocation.lng]}
                  icon={(window as any).userIcon}
                  eventHandlers={{
                    add: (e) => {
                      e.target.bindPopup(`
                        <div style="text-align: center; font-weight: 600;">
                          📍 Your Location
                        </div>
                      `);
                    }
                  }}
                />
              )}

              {clusters.map((cluster, idx) => {
                // Determine if this is a single job (use colored pin) or aggregate (use blue circle)
                const isSingleJob = cluster.count === 1 && cluster.jobs[0]
                const job = isSingleJob ? cluster.jobs[0] : null
                
                const popupHTML = isSingleJob && job ? `
                  <div style="min-width: 220px; padding: 8px; font-family: system-ui;">
                    <h3 style="font-weight: 600; font-size: 1rem; margin-bottom: 8px;">
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
                        <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; color: white; font-size: 0.75rem; font-weight: 500; background-color: ${
                          job.employerType === 'COMPANY' ? '#f97316' : 
                          job.employerType === 'AGENCY' ? '#22c55e' : '#eab308'
                        };">
                          ${job.employerType}
                        </span>
                      </p>
                    ` : ''}
                    ${job.salaryMin && job.salaryMax ? `
                      <p style="font-size: 0.875rem; color: #059669; margin-bottom: 12px;">
                        💰 $${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}
                      </p>
                    ` : ''}
                    <a 
                      href="/jobs/${job.id}"
                      style="display: block; text-align: center; padding: 8px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;"
                    >
                      View Details →
                    </a>
                  </div>
                ` : `
                  <div style="min-width: 200px; padding: 8px; font-family: system-ui;">
                    <h3 style="font-weight: 600; font-size: 1.1rem; margin-bottom: 8px; color: #2563eb;">
                      ${cluster.label}
                    </h3>
                    <p style="font-size: 0.875rem; margin-bottom: 8px;">
                      <strong>${cluster.count}</strong> job opening${cluster.count > 1 ? 's' : ''}
                    </p>
                    <p style="font-size: 0.75rem; color: #6b7280; text-transform: capitalize;">
                      ${cluster.level} level
                    </p>
                    <div style="margin-top: 10px; max-height: 150px; overflow-y: auto;">
                      ${cluster.jobs.slice(0, 5).map(j => `
                        <div style="margin-bottom: 8px; padding: 6px; background: #f3f4f6; border-radius: 4px;">
                          <p style="font-size: 0.8rem; font-weight: 600;">${j.title}</p>
                          <p style="font-size: 0.7rem; color: #6b7280;">${j.company}</p>
                        </div>
                      `).join('')}
                      ${cluster.count > 5 ? `<p style="font-size: 0.75rem; color: #6b7280;">+ ${cluster.count - 5} more</p>` : ''}
                    </div>
                    <p style="font-size: 0.75rem; margin-top: 8px; color: #2563eb;">
                      Zoom in to see more detail
                    </p>
                  </div>
                `;
                
                // Use colored pin for single jobs, blue circle for aggregates
                const markerIcon = isSingleJob && job
                  ? (window as any).createJobIcon?.(job.employerType || 'COMPANY')
                  : (window as any).createClusterIcon?.(cluster.count, cluster.level)
                
                return (
                  <Marker 
                    key={`${cluster.level}-${cluster.label}-${idx}`}
                    position={[cluster.lat, cluster.lng]}
                    icon={markerIcon}
                    eventHandlers={{
                      add: (e) => {
                        e.target.bindPopup(popupHTML, { maxWidth: 300 });
                      }
                    }}
                  />
                )
              })}
            </MapContainer>
          </div>
        </Card>
      )}
    </div>
  )
}
