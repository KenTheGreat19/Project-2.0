"use client"

import { useState, useCallback } from "react"
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, MapPin, Navigation } from "lucide-react"

const libraries: ("places")[] = ["places"]

const mapContainerStyle = {
  width: "100%",
  height: "400px",
}

const defaultCenter = {
  lat: 14.5995, // Philippines center
  lng: 120.9842,
}

interface GoogleMapsLocationPickerProps {
  onLocationSelect: (location: {
    address: string
    lat: number
    lng: number
  }) => void
  initialLocation?: {
    address?: string
    lat?: number
    lng?: number
  }
}

export function GoogleMapsLocationPicker({
  onLocationSelect,
  initialLocation,
}: GoogleMapsLocationPickerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialLocation?.lat && initialLocation?.lng
      ? { lat: initialLocation.lat, lng: initialLocation.lng }
      : null
  )
  const [address, setAddress] = useState(initialLocation?.address || "")
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  })

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setSearchBox(autocomplete)
  }

  const onPlaceChanged = () => {
    if (searchBox) {
      const place = searchBox.getPlace()
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        const newAddress = place.formatted_address || ""
        
        setMarker({ lat, lng })
        setAddress(newAddress)
        
        if (map) {
          map.panTo({ lat, lng })
          map.setZoom(15)
        }
        
        onLocationSelect({ address: newAddress, lat, lng })
      }
    }
  }

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()
        
        setMarker({ lat, lng })
        
        // Reverse geocode to get address
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const newAddress = results[0].formatted_address
            setAddress(newAddress)
            onLocationSelect({ address: newAddress, lat, lng })
          }
        })
      }
    },
    [onLocationSelect]
  )

  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()
        
        setMarker({ lat, lng })
        
        // Reverse geocode to get address
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const newAddress = results[0].formatted_address
            setAddress(newAddress)
            onLocationSelect({ address: newAddress, lat, lng })
          }
        })
      }
    },
    [onLocationSelect]
  )

  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          setMarker({ lat, lng })
          
          if (map) {
            map.panTo({ lat, lng })
            map.setZoom(15)
          }
          
          // Reverse geocode to get address
          const geocoder = new google.maps.Geocoder()
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const newAddress = results[0].formatted_address
              setAddress(newAddress)
              onLocationSelect({ address: newAddress, lat, lng })
            }
            setIsLoadingLocation(false)
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoadingLocation(false)
        }
      )
    }
  }

  if (loadError) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading Google Maps. Please check your API key.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {isLoaded && (
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={onPlaceChanged}
            className="flex-1"
          >
            <Input
              type="text"
              placeholder="Search for a location..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Autocomplete>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        <MapPin className="h-3 w-3 inline mr-1" />
        Click on the map to place a pin, or drag the marker to adjust location
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={marker || defaultCenter}
        zoom={marker ? 15 : 5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {marker && (
          <Marker
            position={marker}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
            animation={google.maps.Animation.DROP}
          />
        )}
      </GoogleMap>

      {marker && (
        <div className="text-xs text-muted-foreground">
          <strong>Coordinates:</strong> {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
        </div>
      )}
    </div>
  )
}
