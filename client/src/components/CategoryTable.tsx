import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { deleteCategory, fetchCategories } from "@/services/categoryService" // <-- create this service
import { useNavigate } from "react-router-dom"

interface CategoryType {
  id: string
  name: string
  description?: string
}

function CategoryTable() {
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
      try {
        await deleteCategory(Number(id))
        setCategories((prev) => prev.filter((category) => category.id !== id))
      } catch (error) {
        console.error("Error deleting category:", error)
      }
    }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold mb-4">Category List</h2>
        <Button onClick={() => navigate("/category/create")}>Create Category</Button>
        </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full text-sm text-left border border-gray-200 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{category.name}</td>
                <td className="p-3">{category.description || "—"}</td>
                <td className="p-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/category/edit/${category.id}`)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(category.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default CategoryTable
