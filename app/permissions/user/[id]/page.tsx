"use client"

import { UserPermissionForm } from "@/components/permissions/user-permission-form"
import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"
import { use } from "react"

interface UserPermissionsPageProps {
  params: Promise<{
    id: string
  }>
}

export default function UserPermissionsPage({ params }: UserPermissionsPageProps) {
  const { user } = useAuth()
  const resolvedParams = use(params)

  // // Only super admin can access this page
  // if (user?.role !== "super_admin") {
  //   redirect("/")
  // }

  return (
    <div className="container mx-auto p-6">
      <UserPermissionForm userId={resolvedParams.id} />
    </div>
  )
}
