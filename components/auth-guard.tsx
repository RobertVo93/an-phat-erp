"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { buildLoginHref, getCurrentPath } from "@/lib/auth/client-session"
import { isAuthPagePath } from "@/lib/auth/return-path"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const isPublicRoute = isAuthPagePath(pathname)

  useEffect(() => {
    // Short delay to ensure auth state is loaded
    const timer = setTimeout(() => {
      if (!isAuthenticated && !isPublicRoute) {
        // Keep the deep link so the user lands back here after login.
        router.replace(buildLoginHref({ next: getCurrentPath() }))
      }
      setIsChecking(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, isPublicRoute, router])

  // Show nothing while checking auth state
  if (isChecking) {
    return null
  }

  // If not authenticated and not on a public route, don't render children
  if (!isAuthenticated && !isPublicRoute) {
    return null
  }

  return <>{children}</>
}
