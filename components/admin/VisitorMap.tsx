"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface VisitorStats {
  country: string
  countryCode: string
  visitors: number
  percentage: number
  color: string
}

interface VisitorMapProps {
  visitorData: VisitorStats[]
}

export function VisitorMap({ visitorData }: VisitorMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Visits by Country</CardTitle>
          <CardDescription>Geographic distribution of visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            Loading map...
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalVisitors = visitorData.reduce((sum, country) => sum + country.visitors, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Visits by Country</CardTitle>
        <CardDescription>
          Total visitors: {totalVisitors.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* World Map Placeholder */}
          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg overflow-hidden h-[300px] flex items-center justify-center border border-border">
            <div className="absolute inset-0 opacity-10">
              <svg viewBox="0 0 800 400" className="w-full h-full">
                {/* Simple world map outline */}
                <path
                  d="M 100 150 Q 150 120 200 150 L 250 140 L 300 160 L 350 150 L 400 170 L 450 160 L 500 150 L 550 140 L 600 150 L 650 160 L 700 150"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M 150 200 L 200 210 L 250 200 L 300 220 L 350 210 L 400 230 L 450 220 L 500 210 L 550 220 L 600 210 L 650 220"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Continents outlines */}
                <ellipse cx="250" cy="180" rx="80" ry="50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
                <ellipse cx="450" cy="190" rx="100" ry="60" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
                <ellipse cx="600" cy="200" rx="70" ry="45" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
              </svg>
            </div>
            
            {/* Visitor markers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-8">
                {visitorData.slice(0, 5).map((country, index) => (
                  <div
                    key={country.countryCode}
                    className="flex flex-col items-center animate-pulse"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div
                      className="w-3 h-3 rounded-full shadow-lg"
                      style={{ backgroundColor: country.color }}
                    />
                    <div className="text-xs font-medium mt-1">{country.countryCode}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Country Statistics */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {visitorData.map((country) => (
              <div
                key={country.countryCode}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${country.color}20` }}
                  >
                    <MapPin className="w-5 h-5" style={{ color: country.color }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{country.country}</div>
                    <div className="text-xs text-muted-foreground">
                      {country.visitors.toLocaleString()} visitors
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg" style={{ color: country.color }}>
                    {country.percentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">of total</div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Countries Bar */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Top Countries by Traffic</h4>
            {visitorData.slice(0, 5).map((country) => (
              <div key={country.countryCode} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{country.country}</span>
                  <span className="text-muted-foreground">{country.visitors} visits</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${country.percentage}%`,
                      backgroundColor: country.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
