import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchCategoryById, updateCategory } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function EditCategory() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
  })

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true)
      if (id) {
        try {
          const data = await fetchCategoryById(Number(id))
          setFormData({
            name: data.name,
          })
        } catch {
          setError("Failed to fetch category data.")
        }
      }
      setLoading(false)
    }
    fetchCategory()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name) {
      setError("Category name is required.")
      return
    }

    try {
      await updateCategory(Number(id), {
        name: formData.name,
      })
      navigate("/category")
    } catch {
      setError("Failed to update category.")
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
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-7">Edit Category</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <Label htmlFor="name" className="text-gray-300 mb-2 font-medium block">Category Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6]"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 font-medium bg-red-900 bg-opacity-20 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <Button type="submit" className="mt-4">
            Update Category
          </Button>
        </form>
      </div>
    </div>
  )
}

export default EditCategory
