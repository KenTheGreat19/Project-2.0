"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Loader2, MapPin, Search } from "lucide-react"
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api"

const libraries: ("places")[] = ["places"]

interface LocationAutocompleteProps {
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

export function LocationAutocomplete({
  onLocationSelect,
  initialLocation,
}: LocationAutocompleteProps) {
  const [address, setAddress] = useState(initialLocation?.address || "")
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  })

  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete)
  }

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace()
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        const newAddress = place.formatted_address || ""
        
        setAddress(newAddress)
        setShowSuggestions(false)
        onLocationSelect({ address: newAddress, lat, lng })
      }
    }
  }

  // Fallback: Use Nominatim (OpenStreetMap) if Google Maps fails
  const searchWithNominatim = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: { "User-Agent": "ApplyNHire/1.0" }
        }
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        const results = data.map((item: any) => item.display_name)
        setSuggestions(results)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Nominatim search error:", error)
    }
  }

  const handleNominatimSelect = async (selectedAddress: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(selectedAddress)}&limit=1`,
        {
          headers: { "User-Agent": "ApplyNHire/1.0" }
        }
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        
        setAddress(selectedAddress)
        setShowSuggestions(false)
        onLocationSelect({ address: selectedAddress, lat, lng })
      }
    } catch (error) {
      console.error("Nominatim geocoding error:", error)
    }
  }

  if (loadError) {
    // Fallback to Nominatim if Google Maps fails
    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for a location (e.g., Manila, Philippines)"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
              searchWithNominatim(e.target.value)
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="border rounded-md bg-background shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left px-4 py-2 hover:bg-accent text-sm"
                onClick={() => handleNominatimSelect(suggestion)}
              >
                <MapPin className="inline h-3 w-3 mr-2 text-muted-foreground" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 inline mr-1" />
          Using OpenStreetMap geocoding service
        </p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading location search...</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Autocomplete
        onLoad={onAutocompleteLoad}
        onPlaceChanged={onPlaceChanged}
      >
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for a location (e.g., Manila, Philippines)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
      </Autocomplete>
      
      <p className="text-xs text-muted-foreground">
        <MapPin className="h-3 w-3 inline mr-1" />
        Type to search and select a location from the dropdown
      </p>
    </div>
  )
}
