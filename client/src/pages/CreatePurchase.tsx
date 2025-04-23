import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchProducts } from "@/services/productService"
import { fetchBudgets } from "@/services/budgetService"
import { createPurchase } from "@/services/purchaseService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const CreatePurchase: React.FC = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<{ id: string; name: string }[]>([])
  const [budgets, setBudgets] = useState<{ id: string; name: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    productId: "",
    budgetId: "",
    quantity: "",
    costPrice: "",
    purchaseDate: "",
    expireDate: "",
  })

  const [selectedExpireDate, setSelectedExpireDate] = useState<Date | undefined>()

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
      setSubmitting(true)
      try {
        await createPurchase({
          productId: Number(formData.productId),
          budgetId: Number(formData.budgetId),
          quantity: Number(formData.quantity),
          costPrice: Number(formData.costPrice),
          purchaseDate: new Date(formData.purchaseDate).toISOString(),
          expireDate: formData.expireDate ? new Date(formData.expireDate).toISOString() : undefined,
        })
        navigate("/purchase")
      } catch {
        setErrors({ submit: "Failed to create purchase." })
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-3">
      <div className="w-full max-w-xl bg-[#1A1F2C] rounded-2xl shadow-xl p-8 md:p-10 flex flex-col animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-7">Create Purchase</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Product Select */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Product</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6] p-2 w-full"
              required
            >
              <option value="">Select a product</option>
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>{prod.name}</option>
              ))}
            </select>
            {errors.productId && <p className="text-red-400 text-sm mt-1">{errors.productId}</p>}
          </div>

          {/* Budget Select */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Budget</label>
            <select
              name="budgetId"
              value={formData.budgetId}
              onChange={handleChange}
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6] p-2 w-full"
              required
            >
              <option value="">Select a budget</option>
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.id}>{budget.name}</option>
              ))}
            </select>
            {errors.budgetId && <p className="text-red-400 text-sm mt-1">{errors.budgetId}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Quantity</label>
            <Input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6]"
              required
            />
            {errors.quantity && <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>}
          </div>

          {/* Cost Price */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Cost Price</label>
            <Input
              name="costPrice"
              type="number"
              step="0.01"
              value={formData.costPrice}
              onChange={handleChange}
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6]"
              required
            />
            {errors.costPrice && <p className="text-red-400 text-sm mt-1">{errors.costPrice}</p>}
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Purchase Date</label>
            <Input
              name="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6]"
              required
            />
            {errors.purchaseDate && <p className="text-red-400 text-sm mt-1">{errors.purchaseDate}</p>}
          </div>

          {/* Expire Date */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Expire Date (optional)</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full text-left text-white border border-gray-700 rounded-md px-3 py-2 flex items-center justify-between",
                    !selectedExpireDate && "text-gray-500"
                  )}
                >
                  {selectedExpireDate ? format(selectedExpireDate, "PPP") : "Pick a date"}
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border border-gray-700">
                <Calendar
                  mode="single"
                  selected={selectedExpireDate}
                  onSelect={(date) => {
                    setSelectedExpireDate(date)
                    setFormData((prev) => ({
                      ...prev,
                      expireDate: date ? date.toISOString().split("T")[0] : "",
                    }))
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.expireDate && <p className="text-red-400 text-sm mt-1">{errors.expireDate}</p>}
          </div>

          {errors.submit && (
            <div className="text-sm text-red-400 font-medium bg-red-900 bg-opacity-20 px-3 py-2 rounded">
              {errors.submit}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#8B5CF6] hover:bg-[#9b87f5] text-white font-semibold rounded-lg text-base h-11 transition-colors"
            disabled={submitting}
            size="lg"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="loader border-4 border-t-4 border-gray-200 h-5 w-5 animate-spin border-t-[#8B5CF6]"></span>
                Creating...
              </span>
            ) : (
              "Create Purchase"
            )}
          </Button>
        </form>
      </div>
      <style>
        {`
          .loader {
            border-top-color: #8B5CF6;
            border-radius: 50%;
            width: 1.25rem;
            height: 1.25rem;
            border-width: 0.25rem;
          }
        `}
      </style>
    </div>
  )
}

export default CreatePurchase
