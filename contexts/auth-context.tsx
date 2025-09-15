"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { IUser } from "@/types/user"
import { useRouter } from "next/navigation"
import { logoutUser } from "@/lib/httpclient"
import { ADMIN_ROUTES } from "@/constants/nav"
import { UserRole } from "@/types"

interface AuthContextType {
  user: IUser | null
  login: (user: IUser) => void
  logout: () => void
  isAuthenticated: boolean
  isSuperAdmin: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()
  const isSuperAdmin = user?.role === UserRole.super_admin
  const isAdmin = (user?.role === UserRole.admin) || isSuperAdmin

  useEffect(() => {
    // Check for stored user data on mount
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error)
    }
    setIsInitialized(true)
  }, [])

  const login = (userData: IUser) => {
    setUser(userData)
    try {
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }
  }

  const logout = async () => {
    setUser(null)
    try {
      localStorage.removeItem("user")
      await logoutUser()
      router.push(ADMIN_ROUTES.login())
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  }

  // Don't render children until we've checked localStorage
  if (!isInitialized) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isSuperAdmin, isAdmin }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
