import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchProducts } from "@/services/productService"
import { fetchPurchaseById, updatePurchase } from "@/services/purchaseService"
import { fetchBudgets } from "@/services/budgetService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

function EditPurchase() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [products, setProducts] = useState<{ id: string; name: string }[]>([])
  const [budgets, setBudgets] = useState<{ id: string; name: string }[]>([])

  const [formData, setFormData] = useState({
    productId: "",
    budgetId: "",
    quantity: "",
    costPrice: "",
    purchaseDate: "",
    expireDate: "",
  })

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      const [productData, budgetData] = await Promise.all([
        fetchProducts(),
        fetchBudgets(),
      ])
      setProducts(productData)
      setBudgets(budgetData)

      if (id) {
        const data = await fetchPurchaseById(Number(id))
        setFormData({
          productId: data.productId.toString(),
          budgetId: data.budgetId.toString(),
          quantity: data.quantity.toString(),
          costPrice: data.costPrice.toString(),
          purchaseDate: data.purchaseDate?.slice(0, 10) || "",
          expireDate: data.expireDate?.slice(0, 10) || "",
        })
      }
      setLoading(false)
    }

    fetchAll()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.productId || !formData.budgetId || !formData.quantity || !formData.costPrice || !formData.purchaseDate) {
      setError("Please fill out all required fields.")
      return
    }

    try {
      await updatePurchase(Number(id), {
        productId: Number(formData.productId),
        budgetId: Number(formData.budgetId),
        quantity: Number(formData.quantity),
        costPrice: Number(formData.costPrice),
        purchaseDate: new Date(formData.purchaseDate).toISOString(),
        expireDate: formData.expireDate ? new Date(formData.expireDate).toISOString() : undefined,
      })
      navigate("/purchase")
    } catch {
      setError("Failed to update purchase.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-3">
        <div className="w-full max-w-md bg-[#1A1F2C] rounded-2xl shadow-xl p-8 md:p-10 flex flex-col animate-fade-in">
          <div className="h-8 bg-gray-700 rounded w-2/3 mb-7 animate-pulse" />
          <div className="flex flex-col gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="h-5 bg-gray-800 rounded w-1/3 mb-2 animate-pulse" />
                <div className="h-11 bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
            <div className="h-11 bg-gray-800 rounded mt-6 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-3">
      <div className="w-full max-w-md bg-[#1A1F2C] rounded-2xl shadow-xl p-8 md:p-10 flex flex-col animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-7">Edit Purchase</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <Label htmlFor="productId" className="text-gray-300 mb-2 font-medium block">Product</Label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full bg-[#15171E] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              required
            >
              <option value="">Select a product</option>
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>{prod.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="budgetId" className="text-gray-300 mb-2 font-medium block">Budget</Label>
            <select
              name="budgetId"
              value={formData.budgetId}
              onChange={handleChange}
              className="w-full bg-[#15171E] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              required
            >
              <option value="">Select a budget</option>
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.id}>{budget.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="quantity" className="text-gray-300 mb-2 font-medium block">Quantity</Label>
            <Input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6]"
              required
            />
          </div>

          <div>
            <Label htmlFor="costPrice" className="text-gray-300 mb-2 font-medium block">Cost Price</Label>
            <Input
              name="costPrice"
              type="number"
              step="0.01"
              value={formData.costPrice}
              onChange={handleChange}
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6]"
              required
            />
          </div>

          <div>
            <Label htmlFor="purchaseDate" className="text-gray-300 mb-2 font-medium block">Purchase Date</Label>
            <Input
              name="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="bg-[#15171E] text-white border-gray-700 focus:border-[#8B5CF6]"
              required
            />
          </div>

          <div>
            <Label htmlFor="expireDate" className="text-gray-300 mb-2 font-medium block">Expire Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full bg-[#15171E] text-white text-left px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                >
                  {formData.expireDate ? format(new Date(formData.expireDate), "PPP") : "Pick a date"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#1A1F2C] border-gray-700 text-white">
                <Calendar
                  mode="single"
                  selected={formData.expireDate ? new Date(formData.expireDate) : undefined}
                  onSelect={(date: Date | undefined) =>
                    setFormData((prev) => ({
                      ...prev,
                      expireDate: date ? format(date, "yyyy-MM-dd") : "",
                    }))
                  }
                  className="rounded-md border bg-[#1A1F2C]"
                />
              </PopoverContent>
            </Popover>
          </div>

          {error && (
            <div className="text-sm text-red-400 font-medium bg-red-900 bg-opacity-20 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <Button type="submit" className="mt-4">
            Update Purchase
          </Button>
        </form>
      </div>
    </div>
  )
}

export default EditPurchase
