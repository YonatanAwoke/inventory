import { useState } from "react"
import { useSearch } from "../context/useContext"

function SearchBar() {
  const [query, setQuery] = useState("")
  const { setSearchKeyword } = useSearch()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchKeyword(query.trim())
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="border border-gray-300 px-4 py-2 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-[#8B5CF6] text-white px-4 py-2 rounded-3xl hover:bg-black"
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar
