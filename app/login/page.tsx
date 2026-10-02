import { LoginForm } from "@/components/auth/login-form"
import { getSafeReturnPath, parseLoginReason } from "@/lib/auth/return-path"

interface ILoginPageProps {
  searchParams: Promise<{
    next?: string | string[]
    reason?: string | string[]
  }>
}

export default async function LoginPage({ searchParams }: ILoginPageProps) {
  const params = await searchParams
  const nextPath = getSafeReturnPath(params.next) ?? undefined
  const reason = parseLoginReason(params.reason) ?? undefined

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm nextPath={nextPath} reason={reason} />
    </div>
  )
}
