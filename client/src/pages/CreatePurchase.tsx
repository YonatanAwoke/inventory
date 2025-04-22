import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchProducts } from "@/services/productService"
import { fetchBudgets } from "@/services/budgetService"
import { createPurchase } from "@/services/purchaseService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function CreatePurchase() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<{ id: string; name: string }[]>([])
  const [budgets, setBudgets] = useState<{ id: string; name: string }[]>([])
  const [formData, setFormData] = useState({
    productId: "",
    budgetId: "",
    quantity: "",
    costPrice: "",
    purchaseDate: "",
    expireDate: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchProducts().then(setProducts)
    fetchBudgets().then(setBudgets)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.productId) errors.productId = "Please select a product."
    if (!formData.budgetId) errors.budgetId = "Please select a budget."
    if (Number(formData.quantity) <= 0) errors.quantity = "Quantity must be greater than 0."
    if (Number(formData.costPrice) <= 0) errors.costPrice = "Cost price must be greater than 0."
    if (!formData.purchaseDate) errors.purchaseDate = "Purchase date is required."
    if (formData.expireDate && formData.expireDate < formData.purchaseDate)
      errors.expireDate = "Expire date cannot be before purchase date."
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formErrors = validateForm()
    setErrors(formErrors)

    if (Object.keys(formErrors).length === 0) {
      await createPurchase({
        productId: Number(formData.productId),
        budgetId: Number(formData.budgetId),
        quantity: Number(formData.quantity),
        costPrice: Number(formData.costPrice),
        purchaseDate: new Date(formData.purchaseDate).toISOString(),
        expireDate: formData.expireDate ? new Date(formData.expireDate).toISOString() : undefined
      })
      navigate("/purchase")
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Purchase</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Select */}
        <div>
          <Label htmlFor="productId">Product</Label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className={`w-full border p-2 rounded-md ${errors.productId ? "border-red-500" : ""}`}
          >
            <option value="">Select a product</option>
            {products.map((prod) => (
              <option key={prod.id} value={prod.id}>{prod.name}</option>
            ))}
          </select>
          {errors.productId && <p className="text-red-500 text-sm">{errors.productId}</p>}
        </div>

        {/* Budget Select */}
        <div>
          <Label htmlFor="budgetId">Budget</Label>
          <select
            name="budgetId"
            value={formData.budgetId}
            onChange={handleChange}
            className={`w-full border p-2 rounded-md ${errors.budgetId ? "border-red-500" : ""}`}
          >
            <option value="">Select a budget</option>
            {budgets.map((budget) => (
              <option key={budget.id} value={budget.id}>{budget.name}</option>
            ))}
          </select>
          {errors.budgetId && <p className="text-red-500 text-sm">{errors.budgetId}</p>}
        </div>

        {/* Quantity */}
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            className={errors.quantity ? "border-red-500" : ""}
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>

        {/* Cost Price */}
        <div>
          <Label htmlFor="costPrice">Cost Price</Label>
          <Input
            name="costPrice"
            type="number"
            step="0.01"
            value={formData.costPrice}
            onChange={handleChange}
            className={errors.costPrice ? "border-red-500" : ""}
          />
          {errors.costPrice && <p className="text-red-500 text-sm">{errors.costPrice}</p>}
        </div>

        {/* Purchase Date */}
        <div>
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            name="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={handleChange}
            className={errors.purchaseDate ? "border-red-500" : ""}
          />
          {errors.purchaseDate && <p className="text-red-500 text-sm">{errors.purchaseDate}</p>}
        </div>

        {/* Expire Date */}
        <div>
          <Label htmlFor="expireDate">Expire Date (optional)</Label>
          <Input
            name="expireDate"
            type="date"
            value={formData.expireDate}
            onChange={handleChange}
            className={errors.expireDate ? "border-red-500" : ""}
          />
          {errors.expireDate && <p className="text-red-500 text-sm">{errors.expireDate}</p>}
        </div>

        <div className="flex justify-end">
          <Button type="submit">Create Purchase</Button>
        </div>
      </form>
    </div>
  )
}

export default CreatePurchase
