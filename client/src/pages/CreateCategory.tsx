import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createCategory } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function CreateCategory() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const formErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      formErrors.name = "Category name is required."
    } else if (formData.name.length > 50) {
      formErrors.name = "Category name should not exceed 50 characters."
    }
    return formErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formErrors = validateForm()
    setErrors(formErrors)

    if (Object.keys(formErrors).length === 0) {
      setSubmitting(true)
      try {
        await createCategory({ name: formData.name.trim() })
        navigate("/category")
      } catch {
        setErrors({ submit: "Failed to create category." })
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-3">
      <div className="w-full max-w-xl bg-[#1A1F2C] rounded-2xl shadow-xl p-8 md:p-10 flex flex-col animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-7">Create New Category</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <Label htmlFor="name" className="text-white mb-2 block font-medium">Category Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6] ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
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
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="loader border-4 border-t-4 border-gray-200 h-5 w-5 animate-spin border-t-[#8B5CF6]"></span>
                Creating...
              </span>
            ) : (
              "Create Category"
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

export default CreateCategory
