import { formatCurrency, formatDateTime, getProductStatusColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Product } from "@/types"

interface Props {
  product: Product
  t: (key: string) => string
}

export default function ProductDetailInformation({product, t}: Props) {
  const productImages = [product.image, ...(product.subImages || [])]
    .filter((image): image is string => typeof image === "string" && image.trim().length > 0)

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Product Image */}
        <div className="space-y-3 mb-5">
          <label className="text-sm font-medium text-gray-500">{t("products.form.image")}</label>
          <div className="flex flex-wrap gap-3">
            {productImages.length > 0 ? (
              productImages.map((image, index) => (
                <div key={`${image}-${index}`} className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">{t("products.noImage")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">{t("products.form.name")}</label>
            <p className="text-lg font-semibold">{product.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t("products.form.sku")}</label>
            <p className="font-mono">{product.sku}</p>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div>
            <label className="text-sm font-medium text-gray-500">{t("products.form.description")}</label>
            <p className="text-gray-700">{product.description}</p>
          </div>
        )}

        {/* Category and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">{t("products.form.collections")}</label>
            {product.collections &&
              <div>
                {product.collections?.map((col, ind) => (
                  <p key={ind}>
                    {col.name}
                  </p>
                ))}
              </div>
            }
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t("products.form.status")}</label> <br />
            <Badge className={getProductStatusColor(product.status!)}>{t(`products.status.${product.status}`)}</Badge>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">{t("products.form.price")}</label>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(product.price!)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t("products.form.cost")}</label>
            <p className="text-lg">{formatCurrency(product.cost!)}</p>
          </div>
        </div>

        {/* Stock Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">{t("products.form.stock")}</label>
            <p className="text-lg font-semibold">{product.stock}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t("products.form.minStock")}</label>
            <p>{product.minStock}</p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-2 gap-4">
          {product.barcode && (
            <div>
              <label className="text-sm font-medium text-gray-500">{t("products.form.barcode")}</label>
              <p className="font-mono">{product.barcode}</p>
            </div>
          )}
          {product.supplier && (
            <div>
              <label className="text-sm font-medium text-gray-500">{t("products.form.supplier")}</label>
              <p>{product.supplier}</p>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <label className="font-medium">{t("products.createdAt")}</label>
            <p>{formatDateTime(product.createdAt!)}</p>
          </div>
          <div>
            <label className="font-medium">{t("products.updatedAt")}</label>
            <p>{formatDateTime(product.updatedAt!)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
