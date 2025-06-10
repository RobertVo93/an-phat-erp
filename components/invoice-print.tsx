"use client"

import { Order } from "@/types/order"
import { forwardRef } from "react"

interface InvoicePrintProps {
  order: Order
}

export const InvoicePrint = forwardRef<HTMLDivElement, InvoicePrintProps>(({ order }, ref) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  const currentDate = new Date().toLocaleDateString()

  if(!order) return;
  return (
    <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto print:shadow-none print:max-w-none">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AN PHAT</h1>
          <p className="text-gray-600 mt-2">Enterprise Resource Planning</p>
          <div className="mt-4 text-sm text-gray-600">
            <p>123 Business Street</p>
            <p>Ho Chi Minh City, Vietnam</p>
            <p>Phone: +84 123 456 789</p>
            <p>Email: info@anphat.com</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
          <div className="mt-4 text-sm">
            <p>
              <span className="font-medium">Order #:</span> {order.id}
            </p>
            <p>
              <span className="font-medium">Date:</span> {currentDate}
            </p>
            <p>
              <span className="font-medium">Due Date:</span> {`${order.deliveryDate}`}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
          <div className="text-sm text-gray-700">
            <p className="font-medium">{order.customer!.name}</p>
            <p>{order.customer!.company}</p>
            <p>{order.customer!.location}</p>
            <p className="mt-2">Email: {order.customer!.email}</p>
            <p>Phone: {order.customer!.phone}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Ship To:</h3>
          <div className="text-sm text-gray-700">
            <p className="font-medium">{order.customer!.name}</p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="mb-8">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Payment Method:</span>
            <p>{order.paymentMethod}</p>
          </div>
          <div>
            <span className="font-medium">Payment Status:</span>
            <p>{order.paymentStatus}</p>
          </div>
          <div>
            <span className="font-medium">Order Status:</span>
            <p>{order.status}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">
                Item Description
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">SKU</th>
              <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-900">Qty</th>
              <th className="border border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-900">
                Unit Price
              </th>
              <th className="border border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-900">Total</th>
            </tr>
          </thead>
          <tbody>
            {order?.items!.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600 text-xs">{item.category}</p>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{item.sku}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 text-center">{item.quantity}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 text-right">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 text-right font-medium">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">{formatCurrency(order.totalAmount!)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (10%):</span>
              <span className="text-gray-900">{formatCurrency(order.tax!)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="text-gray-900">{order.shippingFee === 0 ? "Free" : formatCurrency(order.shippingFee!)}</span>
            </div>
            
            <div className="border-t border-gray-300 pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">{formatCurrency(order.totalAmount!)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes:</h3>
          <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded">{order.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-300 pt-8 text-center text-sm text-gray-600">
        <p>Thank you for your business!</p>
        <p className="mt-2">
          For questions about this invoice, please contact us at info@anphat.com or +84 123 456 789
        </p>
        <p className="mt-4 text-xs">This is a computer-generated invoice and does not require a signature.</p>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:max-w-none {
            max-width: none !important;
          }
          
          /* Hide elements that shouldn't be printed */
          button,
          .no-print {
            display: none !important;
          }
          
          /* Ensure proper page breaks */
          .page-break {
            page-break-before: always;
          }
          
          /* Optimize table printing */
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          thead {
            display: table-header-group;
          }
          
          tfoot {
            display: table-footer-group;
          }
        }
      `}</style>
    </div>
  )
})

InvoicePrint.displayName = "InvoicePrint"
