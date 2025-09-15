import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Edit, Eye, ImageIcon, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import { getProductStatusColor } from "@/lib/utils"
import { Product } from "@/types/product"
import { useRouter } from "next/navigation"
import { ADMIN_ROUTES } from "@/constants/nav"

interface ProductListBodyProps {
    t: (key: string) => string
    products: Product[]
    totalProducts: number
    startIndex: number
    endIndex: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
    setCurrentPage: (page: number) => void
    setItemsPerPage: (page: number) => void
    handleCreate: () => void
    handleView: (product: Product) => void
    handleEdit: (product: Product) => void
    handleDelete: (product: Product) => void
}

export function ProductListBody({
    t,
    products,
    totalProducts,
    startIndex,
    endIndex,
    totalPages,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    handleCreate,
    handleView,
    handleEdit,
    handleDelete
}: ProductListBodyProps) {
    const router = useRouter()

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <CardTitle className="text-lg sm:text-xl">{t("products.catalog")}</CardTitle>
                            <CardDescription className="text-sm">
                                {totalProducts} {t("products.items")}
                            </CardDescription>
                        </div>

                        {/* Mobile-friendly pagination controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                            <span className="text-muted-foreground whitespace-nowrap">
                                {startIndex}-{endIndex} / {totalProducts}
                            </span>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={itemsPerPage.toString()}
                                    onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
                                >
                                    <SelectTrigger className="w-16 h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span className="text-muted-foreground text-xs">/ {t("products.page")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {products.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">{t("products.noProducts")}</p>
                        <Button onClick={handleCreate} className="mt-4">
                            <Plus className="mr-2 h-4 w-4" />
                            {t("products.addFirstProduct")}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => router.push(ADMIN_ROUTES.productDetail(product.id!))}
                            >
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        {product.image ? (
                                            <img
                                                src={product.image || "/placeholder.svg"}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="h-6 w-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0 space-y-2">
                                        {/* Header Row */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-sm sm:text-base truncate">{product.name}</h3>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <Badge className={`${getProductStatusColor(product.status!)} text-xs`}>
                                                    {t(`products.status.${product.status}`)}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleView(product)
                                                            }}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            {t("common.view")}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleEdit(product)
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            {t("common.edit")}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleDelete(product)
                                                            }}
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            {t("common.delete")}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-muted-foreground">
                                            <div>
                                                <span className="font-medium">SKU:</span>
                                                <div className="truncate">{product.sku}</div>
                                            </div>
                                            <div>
                                                <span className="font-medium">{t("products.stock")}:</span>
                                                <div>{product.stock}</div>
                                            </div>
                                            <div>
                                                <span className="font-medium">{t("products.unit")}:</span>
                                                <div>{t(`products.form.${product.unit}`)}</div>
                                            </div>
                                            <div>
                                                <span className="font-medium">{t("products.form.price")}:</span>
                                                <div className="font-medium text-foreground">{formatCurrency(product.price!)}</div>
                                            </div>
                                            <div>
                                                <span className="font-medium">{t("products.form.cost")}:</span>
                                                <div>{formatCurrency(product.cost!)}</div>
                                            </div>
                                        </div>

                                        {/* Supplier Info */}
                                        {product.supplier && (
                                            <div className="text-xs text-muted-foreground">
                                                <span className="font-medium">{t("products.form.supplier")}:</span> {product.supplier}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline ml-1">{t("products.pagination.previous")}</span>
                        </Button>

                        <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let page: number
                                if (totalPages <= 5) {
                                    page = i + 1
                                } else if (currentPage <= 3) {
                                    page = i + 1
                                } else if (currentPage >= totalPages - 2) {
                                    page = totalPages - 4 + i
                                } else {
                                    page = currentPage - 2 + i
                                }

                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        className="w-8 h-8 p-0 text-xs"
                                    >
                                        {page}
                                    </Button>
                                )
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-2"
                        >
                            <span className="hidden sm:inline mr-1">{t("products.pagination.next")}</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}