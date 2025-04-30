import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { updateProduct, fetchProductById } from "@/services/productService"
import { fetchCategories } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

function EditProduct() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    expireDate: "",
    categoryId: "",
    status: "inStock",
    image: "",
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      if (id) {
        const data = await fetchProductById(Number(id))
        setFormData({
          name: data.name,
          expireDate: data.expireDate ? data.expireDate.slice(0, 10) : "",
          categoryId: data.categoryId.toString(),
          status: data.status, 
          image: data.image || "", 
        })
      }

      const categoryData = await fetchCategories()
      setCategories(categoryData)
      setLoading(false)
    }
    fetchData()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle the file upload and convert the image to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        if (reader.result) {
          setFormData((prev) => ({ ...prev, image: reader.result as string }))
        }
      }
      reader.readAsDataURL(file) 
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim() || !formData.categoryId) {
      setError("Please fill out all required fields.")
      return
    }

    try {
      await updateProduct(Number(id), {
        name: formData.name,
        expireDate: formData.expireDate || null,
        categoryId: Number(formData.categoryId),
        status: formData.status === "inStock" ? "IN_STOCK" : "OUT_OF_STOCK",
        image: formData.image, 
      })
      navigate("/product")
    } catch {
      setError("Failed to update product.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-3">
        <div className="w-full max-w-md bg-[#1A1F2C] rounded-2xl shadow-xl p-8 md:p-10 flex flex-col animate-fade-in">
          <div className="h-8 bg-gray-700 rounded w-2/3 mb-7 animate-pulse" />
          <div className="flex flex-col gap-6">
            {[1, 2, 3, 4, 5].map((_, i) => (
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
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-7">Edit Product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <Label htmlFor="name" className="text-gray-300 mb-2 font-medium block">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6]"
              placeholder="Product Name"
              required
            />
          </div>
          <div>
            <Label htmlFor="image" className="text-gray-300 mb-2 font-medium block">Product Image</Label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6]"
            />
            {formData.image && (
              <img
                src={formData.image} // This is the base64 image string
                alt="Product"
                className="mt-4 rounded-md w-full max-h-60 object-cover"
              />
            )}
          </div>
          <div>
            <Label htmlFor="status" className="text-gray-300 mb-2 font-medium block">Status</Label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-[#15171E] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              required
            >
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
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
          <div>
            <Label htmlFor="categoryId" className="text-gray-300 mb-2 font-medium block">Category</Label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full bg-[#15171E] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
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
          {error && (
            <div className="text-sm text-red-400 font-medium bg-red-900 bg-opacity-20 px-3 py-2 rounded">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg text-base h-11 transition-colors"
          >
            Update Product
          </Button>
        </form>
      </div>
    </div>
  )
}

export default EditProduct
