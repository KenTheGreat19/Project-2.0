"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function GetStartedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Get Started</CardTitle>
          <CardDescription>Select whether you are an applicant or an employer to continue.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 items-center py-6">
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Choose the option that best describes you. You&apos;ll be taken to the appropriate sign in / sign up page.
          </p>

          <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
            <Link href="/auth/applicant" className="w-full">
              <Button className="w-full bg-[#10B981] hover:bg-[#10B981]/90">I am an Applicant</Button>
            </Link>

            <Link href="/auth/employer" className="w-full">
              <Button variant="outline" className="w-full">I am an Employer</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
