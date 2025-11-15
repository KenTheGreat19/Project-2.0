import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import UsersManagementClient from "./UsersManagementClient"

export const metadata = {
  title: "Users - ApplyNHire",
  description: "Manage company users",
}

export default async function UsersManagementPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user as any).role !== "EMPLOYER") {
    redirect("/auth/employer")
  }

  const user = session.user as any

  return <UsersManagementClient user={user} />
}
