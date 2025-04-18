import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { updateProduct } from "@/services/productService"
import { fetchProductById } from "@/services/productService"
import { fetchCategories } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function EditProduct() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    expireDate: "",
    categoryId: "",
  })

  useEffect(() => {
    if (id) {
      fetchProductById(Number(id)).then((data) =>
        setFormData({
          name: data.name,
          quantity: data.quantity.toString(),
          price: data.price.toString(),
          expireDate: data.expireDate ? data.expireDate.slice(0, 10) : "",
          categoryId: data.categoryId.toString(),
        })
      )
    }

    fetchCategories().then(setCategories)
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProduct(Number(id), {
      name: formData.name,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      expireDate: formData.expireDate || null,
      categoryId: Number(formData.categoryId),
    })
    navigate("/")
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="mb-4">Product Name</Label>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="quantity" className="mb-4">Quantity</Label>
          <Input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="price" className="mb-4">Price</Label>
          <Input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="expireDate" className="mb-4">Expire Date</Label>
          <Input
            name="expireDate"
            type="date"
            value={formData.expireDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="categoryId" className="mb-4">Category</Label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Update Product</Button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct
