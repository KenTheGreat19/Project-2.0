import { AdminHeader } from "@/components/admin/AdminHeader"
import AdminDashboardClient from "../AdminDashboardClient"

export const metadata = {
  title: "Admin Dashboard - ApplyNHire",
  description: "Analytics and job management",
}

export default async function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8">
        <AdminDashboardClient />
      </div>
    </div>
  )
}
