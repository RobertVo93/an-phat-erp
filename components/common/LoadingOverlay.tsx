import { Loader2 } from "lucide-react"
import React from "react"

export const LoadingOverlay: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null
  return (
    <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}
