import { redirect } from "next/navigation"

export default async function EmployerJobsPage() {
  // Redirect to dashboard since that's where jobs are managed
  redirect("/employer/dashboard")
}
