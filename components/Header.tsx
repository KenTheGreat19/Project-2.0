"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, Moon, Sun, LogOut, LayoutDashboard } from "lucide-react"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage, languages } from "@/contexts/LanguageContext"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()
  const { currentLanguage, setLanguage, t } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="apply n hire logo" width={44} height={44} />
          <span className="text-[1.25rem] font-bold text-[#0A66C2] hover:opacity-80 transition-opacity" suppressHydrationWarning>
            {mounted ? t("header.logo") : "apply n hire"}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                aria-label="Select language"
              >
                <Image 
                  src={currentLanguage.flagIcon} 
                  alt={currentLanguage.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto">
              <DropdownMenuLabel>{t("header.selectLanguage")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onSelect={() => {
                    setLanguage(language)
                  }}
                  className="cursor-pointer"
                >
                  <Image 
                    src={language.flagIcon} 
                    alt={language.name}
                    width={24}
                    height={24}
                    className="rounded-full mr-3"
                  />
                  <span className={currentLanguage.code === language.code ? "font-semibold" : ""}>
                    {language.name}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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

          {status === "authenticated" && (session.user as any)?.role === "ADMIN" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {session.user?.name || "Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{session.user?.name}</span>
                    <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin"
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t("header.dashboard")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("header.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
        <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-gray-900 z-40 p-4 flex flex-col gap-4 overflow-y-auto">
          {/* Language Selector - Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full p-3 flex items-center justify-center gap-2 rounded-md bg-gray-100 dark:bg-gray-800">
                <Image 
                  src={currentLanguage.flagIcon} 
                  alt={currentLanguage.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span>{currentLanguage.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 max-h-96 overflow-y-auto">
              <DropdownMenuLabel>{t("header.selectLanguage")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onSelect={() => {
                    setLanguage(language)
                  }}
                  className="cursor-pointer"
                >
                  <Image 
                    src={language.flagIcon} 
                    alt={language.name}
                    width={24}
                    height={24}
                    className="rounded-full mr-3"
                  />
                  <span className={currentLanguage.code === language.code ? "font-semibold" : ""}>
                    {language.name}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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

          {status === "authenticated" && (session.user as any)?.role === "ADMIN" && (
            <>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="font-semibold">{session.user?.name}</p>
                <p className="text-sm text-muted-foreground">{session.user?.email}</p>
              </div>
              <Button
                variant="outline"
                asChild
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/admin">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t("header.dashboard")}
                </Link>
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false)
                  signOut({ callbackUrl: "/" })
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("header.signOut")}
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
