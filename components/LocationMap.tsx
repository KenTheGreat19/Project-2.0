"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface LocationMapProps {
  initialLat: number
  initialLng: number
  onLocationSelect: (lat: number, lng: number, address: string) => void
}

export function LocationMap({ initialLat, initialLng, onLocationSelect }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let map: any = null
    let marker: any = null

    const initMap = async () => {
      if (!mapRef.current) return
      
      // Clear any existing map
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
          markerRef.current = null
        } catch (e) {
          console.error("Error removing existing map:", e)
        }
      }

      try {
        // Dynamically import Leaflet to avoid SSR issues
        const L = (await import("leaflet")).default
        // await import("leaflet/dist/leaflet.css")

        if (!mounted || !mapRef.current) return

        // Fix Leaflet default marker icon issue
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })

        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100))

        if (!mounted || !mapRef.current) return

        // Initialize map with error handling
        map = L.map(mapRef.current, {
          center: [initialLat, initialLng],
          zoom: 15,
          zoomControl: true,
          attributionControl: true,
        })
        
        mapInstanceRef.current = map

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map)

        // Wait for tiles to load
        await new Promise(resolve => setTimeout(resolve, 100))

        if (!mounted) return

        // Add marker
        marker = L.marker([initialLat, initialLng], {
          draggable: true,
        }).addTo(map)
        markerRef.current = marker

        // Invalidate size after initialization
        setTimeout(() => {
          if (map && mounted) {
            map.invalidateSize()
          }
        }, 200)

        // Reverse geocoding function
        const reverseGeocode = async (lat: number, lng: number) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?` +
              `format=json&` +
              `lat=${lat}&` +
              `lon=${lng}&` +
              `zoom=18&` +
              `addressdetails=1`,
              {
                headers: {
                  "User-Agent": "ApplyNHire/1.0",
                }
              }
            )
            const data = await response.json()
            return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          } catch (error) {
            return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          }
        }

        // Handle marker drag end
        marker.on("dragend", async () => {
          if (!mounted) return
          try {
            const position = marker.getLatLng()
            const address = await reverseGeocode(position.lat, position.lng)
            onLocationSelect(position.lat, position.lng, address)
          } catch (err) {
            console.error("Error on marker drag:", err)
          }
        })

        // Handle map click
        map.on("click", async (e: any) => {
          if (!mounted) return
          try {
            const { lat, lng } = e.latlng
            marker.setLatLng([lat, lng])
            const address = await reverseGeocode(lat, lng)
            onLocationSelect(lat, lng, address)
          } catch (err) {
            console.error("Error on map click:", err)
          }
        })

        setLoading(false)
      } catch (error) {
        console.error("Error loading map:", error)
        setError("Failed to load map. Please try again.")
        setLoading(false)
      }
    }

    initMap()

    return () => {
      mounted = false
      
      // Cleanup
      if (markerRef.current) {
        try {
          markerRef.current.remove()
          markerRef.current = null
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.off()
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }, [initialLat, initialLng, onLocationSelect])

  if (error) {
    return (
      <div className="w-full h-[400px] rounded-lg border flex items-center justify-center bg-muted">
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-lg border"
        style={{ zIndex: 0 }}
      />
    </div>
  )
}
