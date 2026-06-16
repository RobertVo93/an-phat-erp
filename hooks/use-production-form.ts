import { useEffect, useState } from "react"
import type { IProductionElement, ProductionRecord } from "@/types/production"
import { Employee, Product, ProductionElementType, ProductionStatus, Utility, Warehouse, WarehouseProduct } from "@/types"
import { hasValidArray } from "@/lib/utils"

const defaultFormData: ProductionRecord = {
    id: "",
    date: new Date(),
    quantity: 1,
    status: ProductionStatus.inProgress,
    totalCost: 0,
    totalExpense: 0,
    product: undefined,
    warehouse: undefined,
    materials: [],
    utilities: [],
    labors: [],
}
export function useProductionForm(
    products: Product[],
    materials: Product[],
    utilities: Utility[],
    employees: Employee[],
    warehouses: Warehouse[],
    record: ProductionRecord | undefined,
    onSubmit: (data: ProductionRecord) => Promise<void>,
) {
    const [formData, setFormData] = useState<ProductionRecord>(record || defaultFormData)
    const [warehouseProducts, setWarehouseProducts] = useState<WarehouseProduct[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (warehouses.length > 0 && !formData.warehouse) {
            setFormData({ ...formData, warehouse: warehouses.find((wh) => wh.main) })
        }
    }, [warehouses])

    useEffect(() => {
        if (record) {
            const warehouse = warehouses.find((wh) => wh.id === record.warehouse?.id)
            setFormData({ ...record, warehouse: warehouse })
        }
    }, [record])

    useEffect(() => {
        if (formData.warehouse) {
            setWarehouseProducts(formData.warehouse.warehouseProducts || [])
        }
    }, [formData.warehouse])

    const addMaterial = () => {
        const addedMaterial: IProductionElement = {}
        setFormData({ ...formData, materials: [...(formData.materials || []), addedMaterial] })
    }
    const updateMaterial = (index: number, field: string, value: any) => {
        const updated = [...(formData.materials || [])]
        if (field === "id") {
            const material = materials.find((m) => m.id === value)
            if (material) {
                updated[index] = {
                    ...updated[index],
                    quantity: 1,
                    id: material.id,
                    totalCost: material.cost,
                    name: material.name,
                    unit: material.unit,
                    type: ProductionElementType.material,
                    number: material.sku,
                    unitCost: material.cost
                }
            }
        } else if (field === "quantity") {
            updated[index].quantity = Number.parseFloat(value) || 0
            updated[index].totalCost = updated[index].quantity! * updated[index].unitCost!
        }
        else if (field === "unitCost") {
            updated[index].unitCost = Number.parseFloat(value) || 0
            updated[index].totalCost = updated[index].quantity! * updated[index].unitCost!
        }
        setFormData({ ...formData, materials: updated })
    }
    const removeMaterial = (index: number) => {
        setFormData({ ...formData, materials: (formData.materials || []).filter((_, i) => i !== index) })
    }

    const addUtility = () => {
        const addedUtility: IProductionElement = {}
        setFormData({ ...formData, utilities: [...(formData.utilities || []), addedUtility] })
    }
    const updateUtility = (index: number, field: string, value: any) => {
        const updated = [...(formData.utilities || [])]
        if (field === "id") {
            const findUtility = utilities.find((u) => u.id === value)
            if (findUtility) {
                updated[index] = {
                    ...updated[index],
                    id: findUtility.id,
                    totalCost: findUtility.costPerUnit,
                    name: findUtility.name,
                    unit: findUtility.unit,
                    type: ProductionElementType.utility,
                    number: findUtility.id,   // TODO: update it as number later
                    unitCost: findUtility.costPerUnit
                }
            }
        } else if (field === "quantity") {
            updated[index].quantity = Number.parseFloat(value) || 0
            updated[index].totalCost = updated[index].quantity! * updated[index].unitCost!
        }
        else if (field === "unitCost") {
            updated[index].unitCost = Number.parseFloat(value) || 0
            updated[index].totalCost = updated[index].quantity! * updated[index].unitCost!
        }
        setFormData({ ...formData, utilities: updated })
    }
    const removeUtility = (index: number) => {
        setFormData({ ...formData, utilities: (formData.utilities || []).filter((_, i) => i !== index) })
    }

    const addEmployee = () => {
        const addedEmployee: IProductionElement = {}
        setFormData({ ...formData, labors: [...(formData.labors || []), addedEmployee] })
    }
    const updateEmployee = (index: number, field: string, value: any) => {
        const updated = [...(formData.labors || [])]
        if (field === "id") {
            const employee = employees.find((e) => e.id === value)
            if (employee) {
                updated[index] = {
                    ...updated[index],
                    id: employee.id,
                    totalCost: employee.salary,
                    name: employee.name,
                    unit: employee.position,
                    type: ProductionElementType.labor,
                    number: employee.number,
                    unitCost: employee.salary
                }
            }
        } else if (field === "totalCost") {
            updated[index].totalCost = Number.parseFloat(value) || 0
        }
        setFormData({ ...formData, labors: updated })
    }
    const removeEmployee = (index: number) => {
        setFormData({ ...formData, labors: (formData.labors || []).filter((_, i) => i !== index) })
    }

    const calculateTotalCost = () => {
        const materialsCost = (formData.materials || [])
            .filter((m) => typeof m?.totalCost === "number")
            .reduce((sum, m) => sum + m.totalCost!, 0)
        const utilitiesCost = (formData.utilities || [])
            .filter((u) => typeof u?.totalCost === "number")
            .reduce((sum, u) => sum + u.totalCost!, 0)
        const laborCost = (formData.labors || [])
            .filter((e) => typeof e?.totalCost === "number")
            .reduce((sum, e) => sum + e.totalCost!, 0)
        return materialsCost + utilitiesCost + laborCost
    }

    const calculateTotalProfit = () => {
        if (!formData.product || !formData.quantity) return 0
        return calculateRevenue() - calculateTotalCost()
    }

    const calculateRevenue = () => {
        if (!formData.product || !formData.quantity) return 0
        return formData.product?.price! * formData.quantity
    }

    const calculateEfficiency = () => {
        return calculateTotalProfit() / calculateRevenue() * 100
    }

    const onSelectProduct = (id: string) => {
        const selectingProduct = products.find((pro) => pro.id === id)
        setFormData({ ...formData, product: selectingProduct! })
    }

    const validateForm = (t: (key: string) => string) => {
        const newErrors: Record<string, string> = {}
        if (!formData.product) {
            newErrors.selectedProduct = t("production.form.selectedProductRequired")
        }
        if (!formData.warehouse) {
            newErrors.selectedWarehouse = t("production.form.selectedWarehouseRequired")
        }
        if (formData.quantity === 0) {
            newErrors.quantity = t("production.form.quantityMustGreaterThanZero")
        }
        if (!hasValidArray(formData.materials)) {
            newErrors.selectedMaterials = t("production.form.selectedMaterialsRequired")
        }

        // check if materials is out of stock
        for (let index = 0; index < (formData.materials?.length || 0); index++) {
            const material = formData.materials?.[index]
            const warehouseProduct = warehouseProducts.find((whProduct) => whProduct.product?.id === material?.id)
            if (warehouseProduct && warehouseProduct.quantity! < material?.quantity!) {
                newErrors[`materials_${index}`] = t("production.form.quantityOverStock")
            }
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (t: (key: string) => string) => {
        if (!validateForm(t)) return
        const production: ProductionRecord = {
            id: record?.id,
            date: formData.date,
            quantity: formData.quantity,
            status: formData.status!,
            totalCost: calculateRevenue(),
            totalExpense: calculateTotalCost(),
            product: formData.product!,
            warehouse: formData.warehouse,
            materials: formData.materials,
            utilities: formData.utilities,
            labors: formData.labors,
        }
        onSubmit(production)
    }

    return {
        availableProducts: products,
        availableUtilities: utilities,
        availableEmployees: employees,
        availableWarehouses: warehouses,
        formData,
        errors,
        warehouseProducts,
        setFormData,
        addMaterial,
        updateMaterial,
        removeMaterial,
        addUtility,
        updateUtility,
        removeUtility,
        addEmployee,
        updateEmployee,
        removeEmployee,
        calculateTotalCost,
        calculateTotalProfit,
        calculateRevenue,
        calculateEfficiency,
        onSelectProduct,
        handleSubmit,
    }
}