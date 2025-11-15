import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { EmployerProfileSettings } from "@/components/employer/EmployerProfileSettings"

export const metadata = {
  title: "Profile Settings - ApplyNHire",
  description: "Manage your employer profile",
}

export default async function EmployerProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user as any).role !== "EMPLOYER") {
    redirect("/auth/employer")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <EmployerProfileSettings user={session.user as any} />
        </div>
      </div>
    </div>
  )
}
