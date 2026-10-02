"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { IUser } from "@/types/user"
import { logoutUser } from "@/lib/httpclient"
import {
  markSessionEnded,
  markSessionStarted,
  onSessionRefreshed,
  refreshSession,
  waitForPendingRefresh,
  withAuthLock,
} from "@/lib/httpclient/base"
import {
  ADMIN_SESSION_STORAGE_KEY,
  ADMIN_USER_STORAGE_KEY,
  buildLoginHref,
  clearClientSession,
  getCurrentPath,
  isAccessTokenStale,
  readClientSession,
  readSessionEndMarker,
  saveClientSession,
} from "@/lib/auth/client-session"
import { getSafeReturnPath, isAuthPagePath } from "@/lib/auth/return-path"
import { ADMIN_ROUTES } from "@/constants/nav"
import { UserRole } from "@/types"
import type { IAuthSession, ISessionUser } from "@/types"

interface AuthContextType {
  user: IUser | null
  login: (user: ISessionUser, session: IAuthSession) => void
  logout: () => Promise<void>
  isAuthenticated: boolean
  isSuperAdmin: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// setTimeout overflows above 2^31-1 ms (about 24.8 days); longer waits are re-armed.
const MAX_TIMEOUT_MS = 2_147_483_647

function isSameSessionUser(current: IUser | null, next: IUser | ISessionUser | null): boolean {
  if (!current || !next) return current === next
  return (
    current.id === next.id &&
    current.email === next.email &&
    current.username === next.username &&
    current.role === next.role &&
    current.active === next.active &&
    String(current.lastLogin ?? "") === String(next.lastLogin ?? "")
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [sessionVersion, setSessionVersion] = useState(0)
  const userRef = useRef<IUser | null>(null)
  userRef.current = user
  const userId = user?.id
  const isSuperAdmin = user?.role === UserRole.super_admin
  const isAdmin = (user?.role === UserRole.admin) || isSuperAdmin

  useEffect(() => {
    // Check for stored user data on mount
    let storedUser: IUser | null = null
    try {
      const raw = localStorage.getItem(ADMIN_USER_STORAGE_KEY)
      if (raw) storedUser = JSON.parse(raw)
    } catch (error) {
      console.error("Error reading from localStorage:", error)
    }

    if (storedUser) {
      setUser(storedUser)
      // Sessions from before refresh tokens have no metadata: this refresh sends them to login once.
      const meta = readClientSession()
      if (!meta || meta.userId !== storedUser.id || isAccessTokenStale(meta)) {
        void refreshSession("bootstrap")
      }
    }
    setIsInitialized(true)
  }, [])

  // Refreshes made by this tab: keep the same user object unless something changed (ERPLayout re-fetches on change).
  useEffect(() => onSessionRefreshed(({ user: sessionUser }) => {
    setUser((prev) => (isSameSessionUser(prev, sessionUser) ? prev : { ...prev, ...sessionUser }))
    setSessionVersion((version) => version + 1)
  }), [])

  // Coming back to the tab (focus, wake from sleep, bfcache, network back): refresh if stale, or end the session.
  useEffect(() => {
    if (!userId) return
    const checkSession = () => {
      if (document.visibilityState === "hidden") return
      if (isAccessTokenStale(readClientSession())) void refreshSession("resume")
    }
    window.addEventListener("focus", checkSession)
    window.addEventListener("pageshow", checkSession)
    window.addEventListener("online", checkSession)
    document.addEventListener("visibilitychange", checkSession)
    return () => {
      window.removeEventListener("focus", checkSession)
      window.removeEventListener("pageshow", checkSession)
      window.removeEventListener("online", checkSession)
      document.removeEventListener("visibilitychange", checkSession)
    }
  }, [userId])

  // Redirect an idle tab to login when the refresh token expires. No keep-alive: an untouched tab never extends the session.
  useEffect(() => {
    if (!userId) return
    const meta = readClientSession()
    if (!meta) return

    let timer: ReturnType<typeof setTimeout> | undefined
    const arm = () => {
      const delay = Math.min(Math.max(meta.refreshExpiresAt + 1000 - Date.now(), 0), MAX_TIMEOUT_MS)
      timer = setTimeout(() => {
        if (Date.now() < meta.refreshExpiresAt) {
          arm()
          return
        }
        void refreshSession("timer")
      }, delay)
    }
    arm()
    return () => clearTimeout(timer)
  }, [userId, sessionVersion])

  // Other tabs: follow their logins, logouts, expiries and refreshes.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage) return
      if (event.key === ADMIN_SESSION_STORAGE_KEY) {
        setSessionVersion((version) => version + 1)
        return
      }
      if (event.key !== ADMIN_USER_STORAGE_KEY && event.key !== null) return

      const onAuthPage = isAuthPagePath(window.location.pathname)
      const raw = window.localStorage.getItem(ADMIN_USER_STORAGE_KEY)
      if (!raw) {
        if (onAuthPage) return
        markSessionEnded()
        const marker = readSessionEndMarker()
        window.location.replace(
          marker?.reason === "session_expired"
            ? buildLoginHref({ reason: "session_expired", next: getCurrentPath() })
            : ADMIN_ROUTES.login()
        )
        return
      }

      let nextUser: IUser | null = null
      try {
        nextUser = JSON.parse(raw)
      } catch {
        return
      }
      if (onAuthPage) {
        // Signed in from another tab: continue to where this tab was headed.
        const next = getSafeReturnPath(new URLSearchParams(window.location.search).get("next"))
        window.location.replace(next ?? ADMIN_ROUTES.home())
        return
      }
      if (nextUser?.id !== userRef.current?.id) {
        window.location.replace(window.location.href)
        return
      }
      setUser((prev) => (isSameSessionUser(prev, nextUser) ? prev : nextUser))
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const login = useCallback((sessionUser: ISessionUser, session: IAuthSession) => {
    markSessionStarted()
    saveClientSession(sessionUser, session)
    setUser(sessionUser)
    setSessionVersion((version) => version + 1)
  }, [])

  const logout = useCallback(async () => {
    // Let an in-flight refresh finish first so its response cannot re-create cookies after logout.
    await waitForPendingRefresh()
    await withAuthLock(async () => {
      markSessionEnded()
      const ok = await logoutUser()
      if (!ok) console.error("[auth] Logout request failed; the local session is cleared anyway")
    })
    clearClientSession("logout")
    // Full navigation: resets every in-memory state (no race with AuthGuard's router.push).
    window.location.replace(ADMIN_ROUTES.login())
  }, [])

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
