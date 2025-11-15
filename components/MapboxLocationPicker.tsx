"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Search, Loader2, X, Map } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import map component to avoid SSR issues
const LocationMap = dynamic(
  () => import("./LocationMap").then(mod => ({ default: mod.LocationMap })),
  { ssr: false }
)

interface LocationPickerProps {
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

interface Suggestion {
  place_name: string
  center: [number, number]
}

export function MapboxLocationPicker({
  onLocationSelect,
  initialLocation,
}: LocationPickerProps) {
  const [address, setAddress] = useState(initialLocation?.address || "")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(
    initialLocation?.lat && initialLocation?.lng 
      ? { lat: initialLocation.lat, lng: initialLocation.lng }
      : null
  )
  const debounceTimer = useRef<NodeJS.Timeout>()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setLoading(true)

    // Use Nominatim (OpenStreetMap) - Free and no API key required
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&` +
        `q=${encodeURIComponent(query)}&` +
        `limit=5&` +
        `addressdetails=1`,
        {
          headers: {
            "User-Agent": "ApplyNHire/1.0",
            "Accept-Language": "en"
          }
        }
      )

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const data = await response.json()
      
      const formattedSuggestions: Suggestion[] = data.map((item: any) => ({
        place_name: item.display_name,
        center: [parseFloat(item.lon), parseFloat(item.lat)]
      }))

      setSuggestions(formattedSuggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error("Location search error:", error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setAddress(value)

    // Debounce the search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      searchLocation(value)
    }, 500) // Wait 500ms after user stops typing
  }

  const handleSelect = (suggestion: Suggestion) => {
    const lat = suggestion.center[1]
    const lng = suggestion.center[0]
    
    setAddress(suggestion.place_name)
    setShowSuggestions(false)
    setSuggestions([])
    setSelectedLocation({ lat, lng })
    
    onLocationSelect({
      address: suggestion.place_name,
      lng: lng,
      lat: lat
    })
  }

  const handleMapLocationSelect = (lat: number, lng: number, address: string) => {
    setAddress(address)
    setSelectedLocation({ lat, lng })
    setShowMap(false)
    
    onLocationSelect({
      address,
      lat,
      lng
    })
  }

  const clearLocation = () => {
    setAddress("")
    setSelectedLocation(null)
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search for a location (e.g., Pasay City, Manila)"
            value={address}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="pr-20"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {address && (
              <button
                type="button"
                onClick={clearLocation}
                className="hover:bg-accent rounded p-0.5"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        
        {selectedLocation && (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => setShowMap(!showMap)}
            title={showMap ? "Hide map" : "View and adjust on map"}
            className="flex-shrink-0"
          >
            <Map className={`h-4 w-4 ${showMap ? 'text-primary' : ''}`} />
          </Button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="relative z-50">
          <div className="absolute top-0 left-0 right-0 border rounded-md bg-background shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0 focus:bg-accent focus:outline-none"
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelect(suggestion)
                }}
                onClick={(e) => {
                  e.preventDefault()
                  handleSelect(suggestion)
                }}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-sm">{suggestion.place_name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {showMap && selectedLocation && (
        <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Adjust Location on Map
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowMap(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-2">
            💡 <strong>Tip:</strong> Click anywhere on the map or drag the marker to pinpoint the exact location
          </div>
          
          <LocationMap
            key={`${selectedLocation.lat}-${selectedLocation.lng}`}
            initialLat={selectedLocation.lat}
            initialLng={selectedLocation.lng}
            onLocationSelect={handleMapLocationSelect}
          />
        </div>
      )}

      {address && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          Powered by OpenStreetMap
        </p>
      )}
    </div>
  )
}
