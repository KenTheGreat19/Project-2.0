import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import ApplicantDashboardClient from "./ApplicantDashboardClient"

export const metadata = {
  title: "Applicant Dashboard - ApplyNHire",
  description: "View your job applications",
}

export default async function ApplicantDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user as any).role !== "APPLICANT") {
    redirect("/auth/applicant")
  }

  const user = session.user as any

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Track your job applications and manage your profile
          </p>
        </div>

        <ApplicantDashboardClient />
      </div>
    </div>
  )
}
