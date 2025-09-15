"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { ADMIN_ROUTES } from "@/constants/nav"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const publicRoutes = [ADMIN_ROUTES.login(), ADMIN_ROUTES.register()]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Short delay to ensure auth state is loaded
    const timer = setTimeout(() => {
      if (!isAuthenticated && !publicRoutes.includes(pathname)) {
        router.push(ADMIN_ROUTES.login())
      }
      setIsChecking(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, pathname, router])

  // Show nothing while checking auth state
  if (isChecking) {
    return null
  }

  // If not authenticated and not on a public route, don't render children
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return null
  }

  return <>{children}</>
}
