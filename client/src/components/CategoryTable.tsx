import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteCategory, fetchCategories } from "@/services/categoryService"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreHorizontal, ChevronLeft, ChevronRight, ArrowDown, ArrowUp } from "lucide-react"
import { DeleteConfirmModal } from "./DeleteConfirmModal"

interface CategoryType {
  id: string
  name: string
  description?: string
}

const ITEMS_PER_PAGE = 5

function CategoryTable() {
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<keyof CategoryType | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (err) {
        console.error("Error fetching categories:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDeleteClick = (id: string) => {
    setSelectedCategoryId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (selectedCategoryId) {
      try {
        await deleteCategory(Number(selectedCategoryId))
        setCategories((prev) => prev.filter((category) => category.id !== selectedCategoryId))
      } catch (err) {
        console.error("Error deleting category:", err)
      } finally {
        setShowDeleteModal(false)
        setSelectedCategoryId(null)
      }
    }
  }

  const sortedCategories = useMemo(() => {
    const sorted = [...categories]
    if (sortKey) {
      sorted.sort((a, b) => {
        const aValue = a[sortKey]
        const bValue = b[sortKey]
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        return 0
      })
    }
    return sorted
  }, [categories, sortKey, sortOrder])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedCategories.slice(start, start + ITEMS_PER_PAGE)
  }, [sortedCategories, currentPage])

  const toggleSort = (key: keyof CategoryType) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE)

  const TableSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-3 border-b">
          <Skeleton className="h-6 w-[120px]" />
          <Skeleton className="h-6 w-[100px]" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Button onClick={() => navigate("/category/create")} className="bg-[#8B5CF6]">
          Add New Category +
        </Button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="p-4 text-left font-medium text-gray-500 cursor-pointer"
                  onClick={() => toggleSort("name")}
                >
                  Name {sortKey === "name" && (sortOrder === "asc" ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />)}
                </th>
                <th
                  className="p-4 text-left font-medium text-gray-500 cursor-pointer"
                  onClick={() => toggleSort("description")}
                >
                  Description {sortKey === "description" && (sortOrder === "asc" ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />)}
                </th>
                <th className="p-4 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((category) => (
                <tr key={category.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{category.name}</td>
                  <td className="p-4">{category.description || "—"}</td>
                  <td className="p-4 text-right">
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
                        <DropdownMenuItem onClick={() => handleDeleteClick(category.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedCategoryId(null)
        }}
        onConfirm={confirmDelete}
        deleting={false}
      />
    </div>
  )
}

export default CategoryTable
