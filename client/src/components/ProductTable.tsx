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
import { MoreHorizontal } from "lucide-react"

interface ProductType {
  id: string
  name: string
  quantity: number
  price: number
  expireDate: string | null
  category: string
}

function ProductTable() {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])


const handleDelete = async (id: string) => {
    try {
      await deleteProduct(Number(id))
      setProducts((prev) => prev.filter((product) => product.id !== id))
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }
  

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Product Inventory</h2>
        <Button onClick={() => navigate("/product/create")}>Create Product</Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full text-sm text-left border border-gray-200 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Price</th>
              <th className="p-3">Expire Date</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">{product.quantity}</td>
                <td className="p-3">${product.price.toFixed(2)}</td>
                <td className="p-3">
                  {product.expireDate
                    ? new Date(product.expireDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-3">{product.category}</td>
                <td className="p-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/product/edit/${product.id}`)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(product.id)}>
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

export default ProductTable
