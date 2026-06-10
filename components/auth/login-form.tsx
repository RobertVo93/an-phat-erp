"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { loginUser } from "@/lib/httpclient"
import { ADMIN_ROUTES } from "@/constants/nav"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      setIsLoading(true)
      setError("")

      const res = await loginUser({ username, password })
      if (res.success) {
        login(res.user!)
        router.push(ADMIN_ROUTES.home()); // or your dashboard
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Login failed. Please try again.")
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">AN PHAT</CardTitle>
        <CardDescription>{t("login.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm font-medium text-blue-800 mb-1">Demo Credentials:</p>
          <p className="text-xs text-blue-600">Email: admin@anphat.com</p>
          <p className="text-xs text-blue-600">Password: admin123</p>
          <p className="text-xs text-blue-500 mt-1">Or use any email/password to login</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="email">{t("login.username")}</Label>
            <Input
              id="username"
              type="text"
              placeholder={t("login.usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">{t("login.password")}</Label>
              <Link href={ADMIN_ROUTES.forgotPassword()} className="text-sm text-blue-600 hover:underline">
                {t("login.forgotPassword")}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("common.loading") : t("login.signIn")}
          </Button>
          <div className="mt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setUsername("admin@anphat.com")
                setPassword("admin123")
              }}
            >
              Use Demo Credentials
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          {t("login.noAccount")}{" "}
          <Link href={ADMIN_ROUTES.register()} className="text-blue-600 hover:underline">
            {t("login.signUp")}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
