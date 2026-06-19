"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { usePathname, useRouter } from "next/navigation"
import { navItems, ADMIN_ROUTES } from "@/constants/nav"
import type { UserPagePermission } from "@/types/user-permission"
import type { NavItem } from "@/types/nav.interface"
import { getUserById } from "@/lib/httpclient"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface ERPLayoutProps {
  children: React.ReactNode
}

function filterNavItemsByPermissions(navItems: NavItem[], permissions: UserPagePermission[]): NavItem[] {
  return navItems
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) =>
        permissions.some((p) => p.pageId === child.id && p.granted)
      ),
    }))
    .filter((item) => item.children && item.children.length > 0)
}

export function ERPLayout({ children }: ERPLayoutProps) {
  const { t } = useLanguage()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const { user, isAdmin } = useAuth()
  const [permissions, setPermissions] = useState<UserPagePermission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasAccess, setHasAccess] = useState(true)
  const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([])
  const pathname = usePathname()
  const router = useRouter()

  const getPermissions = useCallback(async (userId: string) => {
    try {
      setIsLoading(true)
      const user = await getUserById(userId)
      setPermissions(user?.permissions || [])
    } catch (error) {
      console.error("Error getting permissions", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user && user.id) {
      getPermissions(user.id)
    }
  }, [user,])

  useEffect(() => {
    if (!user) return

    // Filter nav items for sidebar
    const filteredNavItems = isAdmin
      ? navItems
      : filterNavItemsByPermissions(navItems, permissions)
    setFilteredNavItems(filteredNavItems)

    // Find the pageId for the current route
    let foundPageId: string | null = null
    navItems.forEach((cat) => {
      cat.children?.forEach((page) => {
        if (page.href === pathname) foundPageId = page.id || null
      })
    })
    // admin always has access
    if (isAdmin) {
      setHasAccess(true)
      return
    }
    // If no pageId found, allow access (e.g. dashboard, custom pages)
    if (!foundPageId) {
      setHasAccess(true)
      return
    }
    // Check permission
    const allowed = permissions.some((p) => p.pageId === foundPageId && p.granted)
    setHasAccess(allowed)
  }, [user, permissions, pathname, isAdmin, setFilteredNavItems])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  if (!isLoading && !hasAccess) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-2">{t("common.accessDeniedTitle")}</h2>
          <p className="text-gray-600 mb-4">{t("common.accessDenied")}</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => router.push(ADMIN_ROUTES.home())}
          >
            {t("common.goHome")}
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {isLoading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} navItems={filteredNavItems} />
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
