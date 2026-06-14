import { InvalidResetPasswordLink, ResetPasswordForm } from "@/components/auth/reset-password-form"
import { PasswordResetService } from "@/lib/services/passwordResetService"

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[]
  }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams
  const tokenParam = Array.isArray(params.token) ? params.token[0] : params.token
  const token = tokenParam?.trim() || ""
  const isTokenValid = token
    ? await new PasswordResetService().validateResetToken(token)
    : false

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {isTokenValid ? <ResetPasswordForm token={token} /> : <InvalidResetPasswordLink />}
    </div>
  )
}
