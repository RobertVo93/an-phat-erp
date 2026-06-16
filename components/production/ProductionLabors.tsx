import { Button } from "@/components/ui/button"
import { FormattedCurrency } from "@/components/ui/formatted-currency"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { Employee } from "@/types"
import { IProductionElement } from "@/types/production"

interface ProductionLaborsProps {
    selectedEmployees: IProductionElement[]
    addEmployee: () => void
    updateEmployee: (index: number, field: string, value: any) => void
    removeEmployee: (index: number) => void
    availableEmployees: Employee[]
    error: string
}

export const ProductionLabors = ({
    selectedEmployees,
    addEmployee,
    updateEmployee,
    removeEmployee,
    availableEmployees,
    error
}: ProductionLaborsProps) => {
    const { t } = useLanguage()
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold">{t("production.form.labor")}</h3>
                <Button variant="outline" size="sm" onClick={addEmployee} className="text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    {t("production.form.add")}
                </Button>
            </div>
            <div className="space-y-3">
                {selectedEmployees.map((selectedEmployee, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs">{t("production.form.employee")}</Label>
                                <Select value={selectedEmployee.id} onValueChange={(value) => updateEmployee(index, "id", value)}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder={t("production.form.select")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableEmployees
                                            .filter((emp) =>
                                                emp.id === selectedEmployee?.id ||
                                                !selectedEmployees.some((selected, i) =>
                                                    i !== index && selected?.id === emp.id
                                                )
                                            )
                                            .map((emp, ind) => (
                                                <SelectItem key={ind} value={emp.id!}>
                                                    {emp.number} - {emp.name} {emp.position ? `(${emp.position})` : ""}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">{t("production.form.employeeSalary")}</Label>
                                <FormattedCurrency
                                    as="input"
                                    placeholder="1"
                                    value={selectedEmployee.totalCost}
                                    onValueChange={(value) => {
                                        updateEmployee(index, "totalCost", value);
                                    }}
                                    className="h-9"
                                />
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeEmployee(index)}
                            className="w-full text-red-600 text-xs"
                        >
                            {t("production.form.remove")}
                        </Button>
                    </div>
                ))}
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        </div>
    )
}
