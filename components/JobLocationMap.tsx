"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { MapPin, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"

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

interface JobLocationMapProps {
  location: string
  jobTitle: string
  company: string
}

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

export function JobLocationMap({ location, jobTitle, company }: JobLocationMapProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      require("leaflet/dist/leaflet.css")
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

  useEffect(() => {
    async function loadLocation() {
      setIsLoading(true)
      setError(null)
      
      const coords = await geocodeLocation(location)
      if (coords) {
        setCoordinates(coords)
      } else {
        setError("Unable to locate this address on the map")
      }
      setIsLoading(false)
    }

    if (location) {
      loadLocation()
    }
  }, [location])

  if (!leafletLoaded || isLoading) {
    return (
      <Card className="p-6 flex items-center justify-center h-[300px]">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading location map...</p>
        </div>
      </Card>
    )
  }

  if (error || !coordinates) {
    return (
      <Card className="p-6 flex items-center justify-center h-[300px]">
        <div className="text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{location}</p>
          {error && <p className="text-xs text-muted-foreground mt-1">{error}</p>}
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-[300px] relative">
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>
              <div className="min-w-[150px]">
                <h3 className="font-semibold text-sm mb-1">{jobTitle}</h3>
                <p className="text-xs text-muted-foreground mb-1">{company}</p>
                <p className="text-xs">
                  <MapPin className="h-3 w-3 inline-block mr-1" />
                  {location}
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="p-3 bg-muted/50 flex items-center text-sm">
        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-muted-foreground">{location}</span>
      </div>
    </Card>
  )
}
