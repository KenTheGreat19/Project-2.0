"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-[1.75rem] font-bold text-[#0A66C2] hover:opacity-80 transition-opacity"
        >
          ApplyNHire
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}

          <Button
            variant="outline"
            asChild
            className="border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
          >
            <Link href="/auth/employer">For Employers</Link>
          </Button>

          <Button
            asChild
            className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90"
          >
            <Link href="/auth/applicant">For Applicants</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-gray-900 z-40 p-4 flex flex-col gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full p-3 flex items-center justify-center gap-2 rounded-md bg-gray-100 dark:bg-gray-800"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-5 w-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          )}

          <Button
            variant="outline"
            asChild
            className="w-full border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Link href="/auth/employer">For Employers</Link>
          </Button>

          <Button
            asChild
            className="w-full bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Link href="/auth/applicant">For Applicants</Link>
          </Button>
        </div>
      )}
    </header>
  )
}
