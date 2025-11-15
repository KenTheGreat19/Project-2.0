"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { getTranslation, type TranslationKey } from "@/lib/translations"

export type Language = {
  code: string
  name: string
  flagIcon: string
}

export const languages: Language[] = [
  { code: "en", name: "English", flagIcon: "/flags/uk.png" },
  { code: "vi", name: "Tiếng Việt", flagIcon: "/flags/vietnam.png" },
  { code: "pt", name: "Português", flagIcon: "/flags/brazil.png" },
  { code: "zh", name: "中文", flagIcon: "/flags/china.png" },
  { code: "fr", name: "Français", flagIcon: "/flags/france.png" },
  { code: "de", name: "Deutsch", flagIcon: "/flags/germany.png" },
  { code: "zh-HK", name: "繁體中文", flagIcon: "/flags/hongkong.png" },
  { code: "id", name: "Bahasa Indonesia", flagIcon: "/flags/indonesia.png" },
  { code: "ja", name: "日本語", flagIcon: "/flags/japan.png" },
  { code: "ms", name: "Bahasa Melayu", flagIcon: "/flags/malaysia.png" },
  { code: "fil", name: "Filipino", flagIcon: "/flags/philippines.png" },
  { code: "ko", name: "한국어", flagIcon: "/flags/korea.png" },
  { code: "th", name: "ไทย", flagIcon: "/flags/thailand.png" },
]

type LanguageContextType = {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey, variables?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Initialize from localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem("preferredLanguage")
      if (savedLanguage) {
        const language = languages.find(lang => lang.code === savedLanguage)
        if (language) {
          return language
        }
      }
    }
    return languages[0]
  })
  const [_mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    if (typeof window !== 'undefined') {
      localStorage.setItem("preferredLanguage", language.code)
    }
  }

  // Translation function with support for variables
  const t = (key: TranslationKey, variables?: Record<string, string | number>) => {
    return getTranslation(currentLanguage.code, key, variables)
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
