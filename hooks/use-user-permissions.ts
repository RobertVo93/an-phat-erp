"use client"

import { useState, useEffect } from "react"
import {
  type UserPagePermission,
} from "@/types/user-permission"
import { type IUser } from "@/types/user"
import { UserRole } from "@/types/enums"
import { navItems, DEFAULT_ROLE_PERMISSIONS } from "@/constants/nav"

// Mock data - replace with actual API calls
const mockUsers: IUser[] = [
  {
    id: "1",
    username: "John Doe",
    email: "admin@anphat.com",
    role: UserRole.super_admin,
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    id: "2",
    username: "Jane Smith",
    email: "jane@example.com",
    role: UserRole.admin,
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    id: "3",
    username: "Mike Johnson",
    email: "mike@example.com",
    role: UserRole.manager,
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    id: "4",
    username: "Sarah Wilson",
    email: "sarah@example.com",
    role: UserRole.staff,
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    id: "5",
    username: "Tom Brown",
    email: "tom@example.com",
    role: UserRole.customer,
    createdAt: new Date(),
    lastLogin: new Date(),
  },
]

// Generate mock permissions based on default role permissions
const generateMockPermissions = (): UserPagePermission[] => {
  const permissions: UserPagePermission[] = []

  mockUsers.forEach((user) => {
    const defaultPages = DEFAULT_ROLE_PERMISSIONS[user.role as UserRole] || []
    navItems.forEach((category) => {
      category.children?.forEach((page) => {
        permissions.push({
          userId: user.id!,
          pageId: page.id || "",
          granted: defaultPages.includes(page.id || ""),
        })
      })
    })
  })

  return permissions
}

// Mock user permissions data
const mockUserPermissions = generateMockPermissions()

export function useUserPermissions() {
  const [users, setUsers] = useState<IUser[]>([])
  const [userPagePermissions, setUserPagePermissions] = useState<UserPagePermission[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers)
      setUserPagePermissions(mockUserPermissions)
      setLoading(false)
    }, 1000)
  }, [])

  const updateUserPagePermission = (userId: string, pageId: string, granted: boolean) => {
    setUserPagePermissions((prev) => {
      const existing = prev.find((up) => up.userId === userId && up.pageId === pageId)
      if (existing) {
        return prev.map((up) => (up.userId === userId && up.pageId === pageId ? { ...up, granted } : up))
      } else {
        return [...prev, { userId, pageId, granted }]
      }
    })
  }

  const getUserPagePermission = (userId: string, pageId: string): boolean => {
    const permission = userPagePermissions.find((up) => up.userId === userId && up.pageId === pageId)
    return permission?.granted || false
  }

  const savePermissions = async (userId?: string) => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Here you would make actual API calls to save permissions
      console.log("Saving permissions:", userId ? "for user " + userId : "for all users")
      setSaving(false)
      // Show success message
      return true
    } catch (error) {
      setSaving(false)
      return false
    }
  }

  const updateUserRole = (userId: string, newRole: IUser["role"]) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

    // Update permissions based on new role
    const defaultPages = DEFAULT_ROLE_PERMISSIONS[newRole as UserRole] || []
    navItems.forEach((category) => {
      category.children?.forEach((page) => {
        updateUserPagePermission(userId, page.id || "", defaultPages.includes(page.id || ""))
      })
    })
  }

  const toggleAllCategoryPermissions = (userId: string, categoryId: string, granted: boolean) => {
    const category = navItems.find((cat) => cat.id === categoryId)
    if (category) {
      category.children?.forEach((page) => {
        updateUserPagePermission(userId, page.id || "", granted)
      })
    }
  }

  const getUserCategoryPermissionCount = (userId: string, categoryId: string): { granted: number; total: number } => {
    const category = navItems.find((cat) => cat.id === categoryId)
    if (!category) return { granted: 0, total: 0 }

    const granted = category.children?.filter((page) => getUserPagePermission(userId, page.id || "")).length || 0
    return { granted, total: category.children?.length || 0 }
  }

  const getUserById = (userId: string): IUser | undefined => {
    return users.find((user) => user.id === userId)
  }

  return {
    users,
    userPagePermissions,
    loading,
    saving,
    updateUserPagePermission,
    getUserPagePermission,
    savePermissions,
    updateUserRole,
    toggleAllCategoryPermissions,
    getUserCategoryPermissionCount,
    getUserById,
  }
}
