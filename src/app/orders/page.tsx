"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sess = localStorage.getItem("b2b_session")
    if (!sess) { router.push("/auth/login?redirect=/orders"); return }
    const c = JSON.parse(sess)
    setCustomer(c)
    fetch(`/api/orders?customerId=${c.id}`)
      .then(r => r.json())
      .then(json => { if (json.data) setOrders(json.data) })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusColor = (s: string) => {
    const map: Record<string, string> = { DELIVERED: "delivered", PENDING: "pending", CONFIRMED: "active", PROCESSING: "processing", SHIPPED: "shipped", CANCELLED: "cancelled" }
    return map[s] || "pending"
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-20 flex justify-center"><Loader2 className="h-8 w-8 text-blue-500 animate-spin" /></div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pesanan Saya</h1>
          <p className="text-sm text-gray-500">{customer?.companyName}</p>
        </div>
        <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Toko</Button></Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-base font-medium text-gray-500">Belum ada pesanan</p>
          <Link href="/"><Button className="mt-4">Mulai Belanja</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-mono text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                </div>
                <Badge variant="status" status={statusColor(order.status)}>{order.status}</Badge>
              </div>
              <div className="space-y-1">
                {order.items.slice(0, 3).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.productName} × {item.quantity}</span>
                    <span className="font-medium">{formatCurrency(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
                {order.items.length > 3 && <p className="text-xs text-gray-400">+{order.items.length - 3} item lainnya</p>}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                {order.invoice && <span className="text-xs text-gray-500">Invoice: {order.invoice.invoiceNumber} ({order.invoice.status})</span>}
                <p className="font-bold">{formatCurrency(order.totalAmount)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
