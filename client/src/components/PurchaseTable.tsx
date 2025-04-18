import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  deletePurchase,
  fetchPurchases,
} from "@/services/purchaseService"
import { fetchProducts } from "@/services/productService"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

interface PurchaseType {
  id: string
  productId: number
  quantity: number
  costPrice: number
  expireDate: string | null
  purchaseDate: string
}

interface ProductMap {
  [key: number]: string
}

function PurchaseTable() {
  const [purchases, setPurchases] = useState<PurchaseType[]>([])
  const [productMap, setProductMap] = useState<ProductMap>({})
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseData, productData] = await Promise.all([
          fetchPurchases(),
          fetchProducts(),
        ])
        setPurchases(purchaseData)

        // Create a map from productId to product name
        const map: ProductMap = {}
        productData.forEach((p: { id: number; name: string }) => {
          map[p.id] = p.name
        })
        setProductMap(map)
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deletePurchase(Number(id))
      setPurchases((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Error deleting purchase:", error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Purchase Records</h2>
        <Button onClick={() => navigate("/purchase/create")}>Create Purchase</Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full text-sm text-left border border-gray-200 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Cost Price</th>
              <th className="p-3">Expire Date</th>
              <th className="p-3">Purchase Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{productMap[purchase.productId] || "Unknown"}</td>
                <td className="p-3">{purchase.quantity}</td>
                <td className="p-3">${purchase.costPrice.toFixed(2)}</td>
                <td className="p-3">
                  {purchase.expireDate
                    ? new Date(purchase.expireDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-3">{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/purchase/edit/${purchase.id}`)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(purchase.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default PurchaseTable
