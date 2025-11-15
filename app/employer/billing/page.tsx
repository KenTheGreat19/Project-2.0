import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import BillingClient from "./BillingClient"

export const metadata = {
  title: "Billing - ApplyNHire",
  description: "Manage billing and invoices",
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user as any).role !== "EMPLOYER") {
    redirect("/auth/employer")
  }

  return <BillingClient user={session.user as any} />
}
