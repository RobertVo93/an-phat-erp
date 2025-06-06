"use client"

import { UserPermissionForm } from "@/components/permissions/user-permission-form"
import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"

interface UserPermissionsPageProps {
  params: {
    id: string
  }
}

export default function UserPermissionsPage({ params }: UserPermissionsPageProps) {
  const { user } = useAuth()

  // // Only super admin can access this page
  // if (user?.role !== "super_admin") {
  //   redirect("/")
  // }

  return (
    <div className="container mx-auto p-6">
      <UserPermissionForm userId={params.id} />
    </div>
  )
}
