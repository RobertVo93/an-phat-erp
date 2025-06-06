import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto p-6 flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <h2 className="mt-4 text-xl font-semibold">Loading User Permissions...</h2>
      </div>
    </div>
  )
}
