import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Megaphone } from "lucide-react"

export const metadata = {
  title: "Employer Branding Ads Analytics - ApplyNHire",
  description: "Monitor branding campaign performance",
}

export default async function BrandingAnalyticsPage() {
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
              <h1 className="text-3xl font-bold mb-2">Employer Branding Ads</h1>
              <p className="text-muted-foreground">
                Monitor your employer branding campaign performance
              </p>
            </div>

            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <Megaphone className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Branding Ads Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Employer branding campaign metrics will be available here
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
