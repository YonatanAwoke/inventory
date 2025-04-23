import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createProduct } from "@/services/productService"
import { fetchCategories } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const CreateProduct: React.FC = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
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
    const currentDate = new Date().toISOString().split("T")[0]
    const formErrors: Record<string, string> = {}

    if (formData.name.length > 50) formErrors.name = "Product name should not exceed 50 characters."
    if (Number(formData.quantity) <= 0) formErrors.quantity = "Quantity must be greater than 0."
    if (Number(formData.price) <= 0) formErrors.price = "Price must be greater than 0."
    if (formData.expireDate && formData.expireDate < currentDate) {
      formErrors.expireDate = "Expire date must be today or in the future."
    }
    if (!formData.categoryId) formErrors.categoryId = "Please select a category."

    return formErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const formErrors = validateForm()
    setErrors(formErrors)

    if (Object.keys(formErrors).length === 0) {
      setSubmitting(true)
      try {
        await createProduct({
          name: formData.name,
          quantity: Number(formData.quantity),
          price: Number(formData.price),
          expireDate: formData.expireDate || null,
          categoryId: Number(formData.categoryId),
        })
        navigate("/product")
      } catch {
        setError("Failed to create product.")
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-3">
      <div className="w-full max-w-xl bg-[#1A1F2C] rounded-2xl shadow-xl p-8 md:p-10 flex flex-col animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-7">Create Product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Product Name</label>
            <Input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6]"
              placeholder="E.g. Rice, Laptop..."
              disabled={submitting}
              required
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">Quantity</label>
            <Input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6]"
              placeholder="0"
              min={1}
              disabled={submitting}
              required
            />
            {errors.quantity && <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">Price</label>
            <Input
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6]"
              placeholder="$0.00"
              disabled={submitting}
              required
            />
            {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
          <label className="block text-gray-300 mb-2 font-medium">Expire Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={submitting}
                  className={cn(
                    "w-full text-left text-white border border-gray-700 rounded-md px-3 py-2 flex items-center justify-between",
                    !selectedDate && "text-gray-500"
                  )}
                >
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border border-gray-700">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date: Date | undefined) => {
                    setSelectedDate(date)
                    setFormData((prev) => ({
                      ...prev,
                      expireDate: date ? date.toISOString().split("T")[0] : "",
                    }))
                  }}
                  disabled={(date: Date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
              </Popover>
            {errors.expireDate && <p className="text-red-400 text-sm mt-1">{errors.expireDate}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="bg-[#15171E] text-white border border-gray-700 rounded-md p-2 w-full focus:border-[#8B5CF6]"
              disabled={submitting}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-400 text-sm mt-1">{errors.categoryId}</p>}
          </div>

          {error && (
            <div className="text-sm text-red-400 font-medium bg-red-900 bg-opacity-20 px-3 py-2 rounded">
              {error}
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
              "Create Product"
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

export default CreateProduct
