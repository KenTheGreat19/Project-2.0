"use client"

import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { Card } from "@/components/ui/card"
import { Loader2, MapPin } from "lucide-react"
import { useState, useEffect } from "react"

const libraries: ("places")[] = ["places"]

const mapContainerStyle = {
  width: "100%",
  height: "300px",
}

interface GoogleJobLocationMapProps {
  location: string
  locationLat?: number | null
  locationLng?: number | null
  jobTitle: string
  company: string
}

export function GoogleJobLocationMap({ 
  location, 
  locationLat, 
  locationLng, 
  jobTitle, 
  company 
}: GoogleJobLocationMapProps) {
  const [showInfo, setShowInfo] = useState(true)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
    locationLat && locationLng ? { lat: locationLat, lng: locationLng } : null
  )
  const [geocoding, setGeocoding] = useState(false)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  })

  // If no coordinates provided, try to geocode the location string
  useEffect(() => {
    if (!coordinates && location && isLoaded && window.google) {
      setGeocoding(true)
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const loc = results[0].geometry.location
          setCoordinates({
            lat: loc.lat(),
            lng: loc.lng(),
          })
        }
        setGeocoding(false)
      })
    }
  }, [location, isLoaded, coordinates])

  if (loadError) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5" />
          <div>
            <p className="font-medium">{location}</p>
            <p className="text-xs text-red-500 mt-1">
              Google Maps could not be loaded. Check API key configuration.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  if (!isLoaded || geocoding) {
    return (
      <Card className="p-6 flex items-center justify-center h-[300px]">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </Card>
    )
  }

  if (!coordinates) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5" />
          <div>
            <p className="font-medium">{location}</p>
            <p className="text-xs mt-1">Location map not available</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={coordinates}
        zoom={13}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        <Marker
          position={coordinates}
          onClick={() => setShowInfo(true)}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#2563eb",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          }}
        />

        {showInfo && (
          <InfoWindow
            position={coordinates}
            onCloseClick={() => setShowInfo(false)}
          >
            <div style={{ padding: "8px", minWidth: "200px" }}>
              <h3 style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
                {jobTitle}
              </h3>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                {company}
              </p>
              <p style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                📍 {location}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </Card>
  )
}
