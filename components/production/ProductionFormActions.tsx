import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Loader2 } from "lucide-react"
import React from "react"

interface ProductionFormActionsProps {
    onSubmit: () => void
    isLoading: boolean
}

export const ProductionFormActions = ({
    onSubmit,
    isLoading
}: ProductionFormActionsProps) => {
    const { t } = useLanguage()
    return (
        <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button onClick={onSubmit} className="w-full sm:w-auto" disabled={isLoading}>
                {t("production.form.saveProductionSheet")} {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            </Button>
        </div>
    )
}
