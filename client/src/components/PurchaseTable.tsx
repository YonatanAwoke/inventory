import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deletePurchase, fetchPurchases } from "@/services/purchaseService"
import { fetchProducts } from "@/services/productService"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreHorizontal, ChevronLeft, ChevronRight, ArrowDown, ArrowUp } from "lucide-react"
import { DeleteConfirmModal } from "./DeleteConfirmModal"

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

const ITEMS_PER_PAGE = 5

function PurchaseTable() {
  const [purchases, setPurchases] = useState<PurchaseType[]>([])
  const [productMap, setProductMap] = useState<ProductMap>({})
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<keyof PurchaseType | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseData, productData] = await Promise.all([
          fetchPurchases(),
          fetchProducts(),
        ])
        setPurchases(purchaseData)
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

  const handleDeleteClick = (id: string) => {
    setSelectedPurchaseId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (selectedPurchaseId) {
      try {
        await deletePurchase(Number(selectedPurchaseId))
        const updatedPurchases = await fetchPurchases()
        setPurchases(updatedPurchases)
      } catch (err) {
        console.error("Failed to delete purchase:", err)
      } finally {
        setShowDeleteModal(false)
        setSelectedPurchaseId(null)
      }
    }
  }

  const sortedPurchases = useMemo(() => {
    const sorted = [...purchases]
    if (sortKey) {
      sorted.sort((a, b) => {
        const aValue = a[sortKey]
        const bValue = b[sortKey]
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue
        }
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        return 0
      })
    }
    return sorted
  }, [purchases, sortKey, sortOrder])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedPurchases.slice(start, start + ITEMS_PER_PAGE)
  }, [sortedPurchases, currentPage])

  const toggleSort = (key: keyof PurchaseType) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const totalPages = Math.ceil(purchases.length / ITEMS_PER_PAGE)

  const TableSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-3 border-b">
          <Skeleton className="h-6 w-[120px]" />
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-6 w-[120px]" />
          <Skeleton className="h-6 w-[120px]" />
          <Skeleton className="h-6 w-[40px]" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Purchases</h2>
        <Button onClick={() => navigate("/purchase/create")} className="bg-[#8B5CF6]">
          Add New Purchase +
        </Button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left font-medium text-gray-500 cursor-pointer"
                 onClick={() => toggleSort("productId")}>
                  Product {sortKey === "productId" && (sortOrder === "asc" ? <ArrowUp size={14} className="inline ml-1"/>  : <ArrowDown size={14} className="inline ml-1" />)} 
                  </th>
                <th
                  className="p-4 text-left font-medium text-gray-500 cursor-pointer"
                  onClick={() => toggleSort("quantity")}
                >
                  Quantity {sortKey === "quantity" && (sortOrder === "asc" ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />)}
                </th>
                <th
                  className="p-4 text-left font-medium text-gray-500 cursor-pointer"
                  onClick={() => toggleSort("costPrice")}
                >
                  Cost Price {sortKey === "costPrice" && (sortOrder === "asc" ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />)}
                </th>
                <th className="p-4 text-left font-medium text-gray-500">Expire Date</th>
                <th
                  className="p-4 text-left font-medium text-gray-500 cursor-pointer"
                  onClick={() => toggleSort("purchaseDate")}
                >
                  Purchase Date {sortKey === "purchaseDate" && (sortOrder === "asc" ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />)}
                </th>
                <th className="p-4 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((purchase) => (
                <tr key={purchase.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{productMap[purchase.productId] || "Unknown"}</td>
                  <td className="p-4">{purchase.quantity}</td>
                  <td className="p-4">${purchase.costPrice.toFixed(2)}</td>
                  <td className="p-4">
                    {purchase.expireDate
                      ? new Date(purchase.expireDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-4">{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
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
                        <DropdownMenuItem onClick={() => handleDeleteClick(purchase.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedPurchaseId(null)
        }}
        onConfirm={confirmDelete}
        deleting={false}
      />
    </div>
  )
}

export default PurchaseTable
