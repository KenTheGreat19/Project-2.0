"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg text-[#0A66C2] mb-4">ApplyNHire</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.forEmployers")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/employer" className="text-gray-600 dark:text-gray-400 hover:text-[#0A66C2]">
                  {t("footer.postJob")}
                </Link>
              </li>
              <li>
                <Link href="/employer/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-[#0A66C2]">
                  {t("footer.employerDashboard")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.forApplicants")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-[#0A66C2]">
                  {t("footer.browseJobs")}
                </Link>
              </li>
              <li>
                <Link href="/applicant/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-[#0A66C2]">
                  {t("footer.myApplications")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-[#0A66C2]">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-[#0A66C2]">
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-[#0A66C2]">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-[#0A66C2]">
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          © {currentYear} {t("footer.copyright")}
        </div>
      </div>
    </footer>
  )
}
