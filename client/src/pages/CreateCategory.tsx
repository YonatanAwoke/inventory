import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createCategory } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function CreateCategory() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const formErrors: Record<string, string> = {}

    // Validate name (max 50 characters)
    if (formData.name.length > 50) {
      formErrors.name = "Category name should not exceed 50 characters."
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
      await createCategory({
        name: formData.name
      })
      navigate("/")
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="flex justify-end">
          <Button type="submit">Create Category</Button>
        </div>
      </form>
    </div>
  )
}

export default CreateCategory
