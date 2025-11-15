"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export function InterviewAvailability() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 10)) // Nov 10, 2025
  const [selectedDay, setSelectedDay] = useState(13)

  // Get days in current month view
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const days = []
    const startDay = firstDay === 0 ? 6 : firstDay - 1 // Adjust for Monday start
    
    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ day: '', isOtherMonth: true })
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isOtherMonth: false })
    }
    
    return days
  }

  const days = getDaysInMonth()
  const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Interview availability</h1>
        <p className="text-muted-foreground">
          Set your availability for candidate interviews
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Left Sidebar - Availability Settings */}
        <div className="space-y-6">
          {/* Connect Calendar Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Connect your calendar</CardTitle>
              <CardDescription>
                Automatically prevent double bookings and get new events added as they&apos;re scheduled.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2" variant="outline">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                Connect your calendar
              </Button>
              <Button variant="link" className="w-full">
                Learn more
              </Button>
            </CardContent>
          </Card>

          {/* Regular Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Regular Availability</CardTitle>
              <CardDescription>
                Add times when you are typically available.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-medium w-12">{day}</span>
                    <Badge variant="secondary">Unavailable</Badge>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full w-8 h-8"
                  >
                    <Plus className="h-4 w-4 text-blue-600" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Availability Exceptions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Availability exceptions
              </CardTitle>
              <CardDescription>
                Add or remove availability for specific dates. This will replace any regular availability for those dates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm font-medium">What hours are you available?</div>
                <Button variant="outline" className="w-full">
                  Select date
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling Window */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Scheduling window
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Candidates can schedule interviews up to 7 days in advance and no later than 24 hours ahead of time.
                </p>
                <div className="flex gap-2 items-center text-sm">
                  <span className="text-muted-foreground">From</span>
                  <Select defaultValue="7">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="14">14</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">days in advance</span>
                </div>
                <div className="flex gap-2 items-center text-sm">
                  <span className="text-muted-foreground">To</span>
                  <Select defaultValue="24">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">hours ahead</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Calendar View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="text-lg font-semibold">
                  {`11/10/2025 - 11/16/2025`}
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-7 gap-2 pb-2 border-b">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((dayInfo, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg text-sm font-medium
                      ${dayInfo.isOtherMonth ? 'text-muted-foreground/30' : ''}
                      ${dayInfo.day === selectedDay && !dayInfo.isOtherMonth ? 'bg-pink-500 text-white' : 'hover:bg-accent cursor-pointer'}
                      ${!dayInfo.isOtherMonth && dayInfo.day ? 'border' : ''}
                    `}
                    onClick={() => dayInfo.day && !dayInfo.isOtherMonth && typeof dayInfo.day === 'number' && setSelectedDay(dayInfo.day)}
                  >
                    {dayInfo.day}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="mt-6 space-y-2">
                <h4 className="font-semibold">Available Time Slots</h4>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 16 }, (_, i) => {
                    const hour = 8 + i
                    return (
                      <div
                        key={i}
                        className="p-2 text-center text-sm border rounded-lg hover:bg-accent cursor-pointer"
                      >
                        {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Click on a day to view available time slots</p>
                  <p>• Set your regular availability in the left panel</p>
                  <p>• Time zone: UTC+8 (Philippine Time)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
