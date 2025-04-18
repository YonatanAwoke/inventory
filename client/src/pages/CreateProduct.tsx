import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createProduct } from "@/services/productService"
import { fetchCategories } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function CreateProduct() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    expireDate: "",
    categoryId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const currentDate = new Date().toISOString().split("T")[0] // Today's date in YYYY-MM-DD format
    const formErrors: Record<string, string> = {}

    // Validate name (max 50 characters)
    if (formData.name.length > 50) {
      formErrors.name = "Product name should not exceed 50 characters."
    }

    // Validate quantity (must be greater than 0)
    if (Number(formData.quantity) <= 0) {
      formErrors.quantity = "Quantity must be greater than 0."
    }

    // Validate price (must be greater than 0)
    if (Number(formData.price) <= 0) {
      formErrors.price = "Price must be greater than 0."
    }

    // Validate expire date (must be today or later)
    if (formData.expireDate && formData.expireDate < currentDate) {
      formErrors.expireDate = "Expire date must be today or in the future."
    }

    // Validate category selection (must be selected)
    if (!formData.categoryId) {
      formErrors.categoryId = "Please select a category."
    }

    return formErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate the form inputs
    const formErrors = validateForm()
    setErrors(formErrors)

    // If no errors, submit the form
    if (Object.keys(formErrors).length === 0) {
      await createProduct({
        name: formData.name,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        expireDate: formData.expireDate || null,
        categoryId: Number(formData.categoryId),
      })
      navigate("/")
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
            className={errors.quantity ? "border-red-500" : ""}
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <div>
          <Label htmlFor="expireDate">Expire Date</Label>
          <Input
            name="expireDate"
            type="date"
            value={formData.expireDate}
            onChange={handleChange}
            className={errors.expireDate ? "border-red-500" : ""}
          />
          {errors.expireDate && <p className="text-red-500 text-sm">{errors.expireDate}</p>}
        </div>

        <div>
          <Label htmlFor="categoryId">Category</Label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className={`w-full border border-gray-300 rounded-md p-2 ${errors.categoryId ? "border-red-500" : ""}`}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
        </div>

        <div className="flex justify-end">
          <Button type="submit">Create Product</Button>
        </div>
      </form>
    </div>
  )
}

export default CreateProduct
