"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, MapPin, Briefcase, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/contexts/LanguageContext"

function SearchBarInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  const [title, setTitle] = useState(searchParams.get("title") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [type, setType] = useState(searchParams.get("type") || "")
  const [minSalary, setMinSalary] = useState(searchParams.get("minSalary") || "")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (title) params.set("title", title)
    if (location) params.set("location", location)
    if (type) params.set("type", type)
    if (minSalary) params.set("minSalary", minSalary)

    router.push(`/?${params.toString()}`)
  }

  const handleClear = () => {
    setTitle("")
    setLocation("")
    setType("")
    setMinSalary("")
    router.push("/")
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Job Title */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("search.jobTitle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>

        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("search.location")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>

        {/* Employment Type */}
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="pl-10">
              <SelectValue placeholder={t("search.jobType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("search.allTypes")}</SelectItem>
              <SelectItem value="full_time">{t("search.fullTime")}</SelectItem>
              <SelectItem value="part_time">{t("search.partTime")}</SelectItem>
              <SelectItem value="contract">{t("search.contract")}</SelectItem>
              <SelectItem value="internship">{t("search.internship")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Minimum Salary */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="number"
            placeholder={t("search.minSalary")}
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSearch}
          className="flex-1 bg-[#0A66C2] hover:bg-[#0A66C2]/90"
        >
          <Search className="h-4 w-4 mr-2" />
          {t("search.searchJobs")}
        </Button>
        <Button
          onClick={handleClear}
          variant="outline"
          className="px-6"
        >
          {t("search.clearFilters")}
        </Button>
      </div>
    </div>
  )
}

export function SearchBar() {
  return (
    <Suspense fallback={<div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 h-32 animate-pulse" />}>
      <SearchBarInner />
    </Suspense>
  )
}
