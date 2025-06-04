"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { IUser } from "@/types/user"
import { useRouter } from "next/navigation"
import { logoutUser } from "@/lib/httpclient"

interface AuthContextType {
  user: IUser | null
  login: (user: IUser) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

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
      router.push("/login")
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  }

  // Don't render children until we've checked localStorage
  if (!isInitialized) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
