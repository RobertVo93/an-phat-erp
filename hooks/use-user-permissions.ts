"use client"

import { useState, useEffect } from "react"
import {
  type IUser,
  type UserPagePermission,
} from "@/types"
import { navItems } from "@/constants/nav"
import { getUserById } from "@/lib/httpclient/auth.client"
import { setUserPagePermissions as setUserPagePermissionsApi } from "@/lib/httpclient/user-permission.client"

export type SortField = "username" | "email" | "role" | "createdAt" | "lastLogin"
export type SortDirection = "asc" | "desc"

export function useUserPermissions(userId: string) {
  const [user, setUser] = useState<IUser>()
  const [userPagePermissions, setUserPagePermissions] = useState<UserPagePermission[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)


  const getUserInfo = async (id: string) => {
    try {
      setLoading(true)
      const user = await getUserById(id)
      setUser(user)
      setUserPagePermissions(user?.permissions || [])
    } catch (error) {
      console.error("Error getting user info", error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      getUserInfo(userId)
    }
  }, [userId])

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

  const savePermissions = async (userId: string) => {
    setSaving(true)
    try {
      await setUserPagePermissionsApi(userId, userPagePermissions)
    } catch (error) {
      console.error("Error saving permissions", error)
    }
    finally {
      setSaving(false)
    }
  }

  const toggleAllCategoryPermissions = (userId: string, categoryId: string, granted: boolean) => {
    const category = navItems.find((cat) => cat.id === categoryId)
    if (category) {
      category.children?.forEach((page) => {
        updateUserPagePermission(userId, page.id!, granted)
      })
    }
  }

  const getUserCategoryPermissionCount = (userId: string, categoryId: string): { granted: number; total: number } => {
    const category = navItems.find((cat) => cat.id === categoryId)
    if (!category) return { granted: 0, total: 0 }

    const granted = category.children?.filter((page) => getUserPagePermission(userId, page.id!)).length
    return { granted: granted || 0, total: category.children?.length || 0 }
  }

  return {
    user: user,
    loading: loading,
    saving: saving,
    updateUserPagePermission: updateUserPagePermission,
    getUserPagePermission: getUserPagePermission,
    savePermissions: savePermissions,
    toggleAllCategoryPermissions: toggleAllCategoryPermissions,
    getUserCategoryPermissionCount: getUserCategoryPermissionCount,
  }
}
