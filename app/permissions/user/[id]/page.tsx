"use client"

import { UserPermissionForm } from "@/components/permissions/user-permission-form"
import { ADMIN_ROUTES } from "@/constants"
import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"
import { use } from "react"

interface UserPermissionsPageProps {
  params: Promise<{
    id: string
  }>
}

export default function UserPermissionsPage({ params }: UserPermissionsPageProps) {
  const { isSuperAdmin } = useAuth()
  const resolvedParams = use(params)

  if (!isSuperAdmin) {
    redirect(ADMIN_ROUTES.home())
  }

  return (
    <div className="container mx-auto p-6">
      <UserPermissionForm userId={resolvedParams.id} />
    </div>
  )
}
