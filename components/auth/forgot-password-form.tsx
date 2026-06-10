"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ADMIN_ROUTES } from "@/constants/nav"
import { useLanguage } from "@/contexts/language-context"
import { forgotPassword } from "@/lib/httpclient"

export function ForgotPasswordForm() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      setError("")
      setSuccess("")

      const normalizedUsername = username.trim()
      if (!normalizedUsername) {
        setError(t("forgotPassword.failed"))
        return
      }

      setIsLoading(true)
      const res = await forgotPassword({ username: normalizedUsername })
      if (res.success) {
        setSuccess(t("forgotPassword.success"))
      } else {
        setError(t("forgotPassword.failed"))
      }
    } catch (error) {
      console.error("Error requesting password reset:", error)
      const isUsernameNotFound = error instanceof Error && error.message === "Username does not exist"
      setError(isUsernameNotFound
        ? t("forgotPassword.usernameNotFound")
        : t("forgotPassword.failed"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">AN PHAT</CardTitle>
        <CardDescription>{t("forgotPassword.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            {t("forgotPassword.description")}
          </p>
          <div className="space-y-2">
            <Label htmlFor="username">{t("forgotPassword.username")}</Label>
            <Input
              id="username"
              type="text"
              placeholder={t("forgotPassword.usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("common.loading") : t("forgotPassword.submit")}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href={ADMIN_ROUTES.login()} className="text-blue-600 hover:underline">
            {t("forgotPassword.backToLogin")}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
