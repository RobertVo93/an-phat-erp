"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { navItems as defaultNavItems } from "@/constants/nav"
import type { NavItem } from "@/types/nav.interface"

// Hook để kiểm tra kích thước màn hình
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  navItems?: NavItem[]
}

export function Sidebar({ collapsed, onToggle, navItems = defaultNavItems }: SidebarProps) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const isMobile = useIsMobile()

  // Auto-expand menu based on current route
  useEffect(() => {
    const currentPath = pathname
    const activeMenu = navItems.find((item) => item.children?.some((child) => child.href === currentPath))

    if (activeMenu) {
      setExpandedItems([activeMenu.title])
    } else {
      setExpandedItems([])
    }
  }, [pathname, navItems])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={onToggle} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
          // Desktop behavior
          !isMobile && "hidden lg:flex",
          !isMobile && (collapsed ? "w-16" : "w-64"),
          // Mobile behavior - overlay
          isMobile && "fixed inset-y-0 left-0 z-40 w-64 flex",
          isMobile && (collapsed ? "-translate-x-full" : "translate-x-0"),
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 min-h-[73px]">
          {!collapsed && <h2 className="text-xl font-bold text-gray-900">AN PHAT</h2>}
          <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="py-2">
            {navItems.map((item) => (
              <div key={item.title} className="mb-1">
                {!collapsed && (
                  <button
                    className="flex items-center justify-between w-full px-4 sm:px-6 py-3 text-gray-600 hover:bg-gray-100 touch-manipulation"
                    onClick={() => toggleExpanded(item.title)}
                  >
                    <span className="text-sm sm:text-base font-medium">{t(item.translationKey)}</span>
                    {expandedItems.includes(item.title) ? (
                      <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                )}

                {!collapsed && expandedItems.includes(item.title) && item.children && (
                  <div className="mt-1">
                    {item.children.map((child) => {
                      const isActive = pathname === child.href
                      return (
                        <Link
                          key={child.title}
                          href={child.href || "#"}
                          className={cn(
                            "flex items-center px-4 sm:px-6 py-3 text-gray-600 hover:bg-gray-100 touch-manipulation",
                            isActive && "bg-blue-50 text-blue-600 border-r-2 border-blue-600",
                          )}
                          onClick={() => {
                            if (isMobile) {
                              onToggle()
                            }
                          }}
                        >
                          {child.icon && (
                            <child.icon className={cn("h-4 w-4 sm:h-5 sm:w-5 mr-3", isActive && "text-blue-600")} />
                          )}
                          <span className="text-sm sm:text-base">{t(child.translationKey)}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}

                {collapsed && item.children && (
                  <div className="space-y-1">
                    {item.children.map((child) => {
                      const isActive = pathname === child.href
                      return (
                        <Link
                          key={child.title}
                          href={child.href || "#"}
                          className={cn(
                            "flex items-center px-2 py-3 justify-center text-gray-600 hover:bg-gray-100",
                            isActive && "bg-blue-50 text-blue-600",
                          )}
                          title={t(child.translationKey)}
                        >
                          {child.icon && <child.icon className={cn("h-5 w-5", isActive && "text-blue-600")} />}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 lg:hidden bg-white border border-gray-200 rounded-md p-2 shadow-sm"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
    </>
  )
}
