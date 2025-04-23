
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteProduct, fetchProducts } from "@/services/productService"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteConfirmModal } from "./DeleteConfirmModal"

interface ProductType {
  id: string
  name: string
  quantity: number
  price: number
  expireDate: string | null
  category: string
  status?: 'Active' | 'Pending' | 'Inactive' | 'On Sale' | 'Bouncing'
}

function ProductTable() {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ProductType | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })

  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  const handleSort = (key: keyof ProductType) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    })
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig.key) return 0
    
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (aValue === null) return 1
    if (bValue === null) return -1
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    return sortConfig.direction === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number)
  })

  const [deleting, setDeleting] = useState(false);

const confirmDelete = async () => {
  if (selectedProductId !== null) {
    setDeleting(true);
    try {
      await deleteProduct(selectedProductId);
      // Refetch the latest products from the backend
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setSelectedProductId(null);
    }
  }
};



  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id)
    setShowDeleteModal(true)
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'on sale':
        return 'bg-blue-100 text-blue-800'
      case 'bouncing':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const TableSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="flex items-center space-x-4 p-3 border-b">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <Skeleton className="h-8 w-[100px]" />
        </div>
      ))}
    </div>
  )

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Product</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Import</Button>
          <Button onClick={() => navigate("/product/create")} className="bg-[#8B5CF6]">Add New Product +</Button>
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left font-medium text-gray-500 cursor-pointer" 
                    onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">
                    Product Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="p-4 text-left font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('price')}>
                  <div className="flex items-center gap-2">
                    Price
                    {sortConfig.key === 'price' && (
                      sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="p-4 text-left font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('quantity')}>
                  <div className="flex items-center gap-2">
                    Stock
                    {sortConfig.key === 'quantity' && (
                      sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="p-4 text-left font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-2">
                    Type
                    {sortConfig.key === 'category' && (
                      sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="p-4 text-left font-medium text-gray-500">Status</th>
                <th className="p-4 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4">ETB {product.price.toFixed(2)}</td>
                  <td className="p-4">{product.quantity}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem onClick={() => navigate(`/product/edit/${product.id}`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(Number(product.id))}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center p-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>

        </div>
      )}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        deleting={deleting}
      />
    </div>
  )
}

export default ProductTable