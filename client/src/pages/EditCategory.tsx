import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchCategoryById, updateCategory } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function EditCategory() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: ""
  })

  useEffect(() => {
    if (id) {
      fetchCategoryById(Number(id)).then((data) =>
        setFormData({
          name: data.name
        })
      )
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateCategory(Number(id), {
      name: formData.name
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
        <div className="flex justify-end">
          <Button type="submit">Update Product</Button>
        </div>
      </form>
    </div>
  )
}

export default EditCategory
