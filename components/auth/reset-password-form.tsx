"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ADMIN_ROUTES } from "@/constants/nav"
import { useLanguage } from "@/contexts/language-context"
import { resetPassword } from "@/lib/httpclient"

type ResetPasswordFormProps = {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [shouldRequestNewLink, setShouldRequestNewLink] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      setError("")
      setSuccess("")
      setShouldRequestNewLink(false)

      if (!token) {
        setError(t("resetPassword.invalidLink"))
        return
      }

      if (password !== confirmPassword) {
        setError(t("resetPassword.passwordMismatch"))
        return
      }

      setIsLoading(true)
      const res = await resetPassword({ token, password })
      if (res.success) {
        setSuccess(t("resetPassword.success"))
        setTimeout(() => router.push(ADMIN_ROUTES.login()), 1200)
      } else {
        setError(t("resetPassword.failed"))
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      const isInvalidOrExpiredToken = error instanceof Error && error.message === "Invalid or expired reset token"
      setShouldRequestNewLink(isInvalidOrExpiredToken)
      setError(isInvalidOrExpiredToken
        ? t("resetPassword.invalidOrExpiredLink")
        : t("resetPassword.failed"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">AN PHAT</CardTitle>
        <CardDescription>{t("resetPassword.subtitle")}</CardDescription>
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
          {shouldRequestNewLink && (
            <div className="text-center text-sm">
              <Link href={ADMIN_ROUTES.forgotPassword()} className="text-blue-600 hover:underline">
                {t("resetPassword.requestNewLink")}
              </Link>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">{t("resetPassword.password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("resetPassword.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("resetPassword.confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t("resetPassword.confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || Boolean(success)}>
            {isLoading ? t("common.loading") : t("resetPassword.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function InvalidResetPasswordLink() {
  const { t } = useLanguage()

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">AN PHAT</CardTitle>
        <CardDescription>{t("resetPassword.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {t("resetPassword.invalidOrExpiredLink")}
        </div>
        <div className="mt-4 text-center text-sm">
          <Link href={ADMIN_ROUTES.forgotPassword()} className="text-blue-600 hover:underline">
            {t("resetPassword.requestNewLink")}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
