import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import AdminDashboardClient from "./AdminDashboardClient"

export const metadata = {
  title: "Admin Dashboard - ApplyNHire",
  description: "Analytics and job management",
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  const adminEmail = process.env.ADMIN_EMAIL
  if (!session?.user || session.user.email !== adminEmail) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor platform analytics and manage job postings
            </p>
          </div>
        </div>

        {/* Main Dashboard with Analytics */}
        <AdminDashboardClient />
      </div>
    </div>
  )
}
