import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase } from "lucide-react"

export const metadata = {
  title: "Jobs and Campaigns Analytics - ApplyNHire",
  description: "Track job performance",
}

export default async function JobsAnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user as any).role !== "EMPLOYER") {
    redirect("/auth/employer")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Jobs and Campaigns Analytics</h1>
              <p className="text-muted-foreground">
                Detailed performance metrics for your job postings
              </p>
            </div>

            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Jobs Analytics Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Detailed job performance metrics will be available here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
