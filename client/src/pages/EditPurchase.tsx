// pages/purchase/EditPurchase.tsx
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchProducts } from "@/services/productService"
import { fetchPurchaseById, updatePurchase } from "@/services/purchaseService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function EditPurchase() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [products, setProducts] = useState<{ id: string; name: string }[]>([])
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    costPrice: "",
    purchaseDate: "",
    expireDate: ""
  })

  useEffect(() => {
    fetchProducts().then(setProducts)

    if (id) {
      fetchPurchaseById(Number(id)).then((data) =>
        setFormData({
          productId: data.productId.toString(),
          quantity: data.quantity.toString(),
          costPrice: data.costPrice.toString(),
          purchaseDate: data.purchaseDate?.slice(0, 10) || "",
          expireDate: data.expireDate?.slice(0, 10) || ""
        })
      )
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updatePurchase(Number(id), {
      productId: Number(formData.productId),
      quantity: Number(formData.quantity),
      costPrice: Number(formData.costPrice),
      purchaseDate: new Date(formData.purchaseDate).toISOString(),
      expireDate: formData.expireDate ? new Date(formData.expireDate).toISOString() : undefined,
    })
    navigate("/purchase")
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Purchase</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="productId">Product</Label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select a product</option>
            {products.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="costPrice">Cost Price</Label>
          <Input
            name="costPrice"
            type="number"
            step="0.01"
            value={formData.costPrice}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            name="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="expireDate">Expire Date</Label>
          <Input
            name="expireDate"
            type="date"
            value={formData.expireDate}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Update Purchase</Button>
        </div>
      </form>
    </div>
  )
}

export default EditPurchase
