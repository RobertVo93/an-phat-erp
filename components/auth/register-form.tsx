"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { registerUser } from "@/lib/httpclient"
import { ADMIN_ROUTES } from "@/constants/nav"
import { checkUsernameType } from "@/lib/utils"
import { UsernameType } from "@/types/enums"

export function RegisterForm() {
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { t } = useLanguage()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      setError("")
      if (password !== confirmPassword) {
        setError(t("register.passwordMismatch"))
        return
      }
      const usernameType = checkUsernameType(username)
      if (usernameType === UsernameType.invalid) {
        setError(t("register.wrongFormat"))
        return
      }
      setIsLoading(true)

      const res = await registerUser({ fullName, password, username })
      if (res.success) {
        router.push(ADMIN_ROUTES.login())
      } else {
        setError(t("register.failed"))
      }
    } catch (error) {
      console.error("Error registering:", error);
      setError(t("register.failed"))
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">AN PHAT</CardTitle>
        <CardDescription>{t("register.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error &&
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          }
          <div className="space-y-2">
            <Label htmlFor="fullName">{t("register.name")}</Label>
            <Input
              id="fullName"
              type="text"
              placeholder={t("register.namePlaceholder")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">{t("register.username")}</Label>
            <Input
              id="username"
              type="text"
              placeholder={t("register.usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("register.password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("register.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("register.confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t("register.confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("common.loading") : t("register.signUp")}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {t("register.hasAccount")}{" "}
          <Link href={ADMIN_ROUTES.login()} className="text-blue-600 hover:underline">
            {t("register.signIn")}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
