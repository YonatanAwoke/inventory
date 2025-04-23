import { useAuth } from "../../context/UseAuth"
import { useNavigate } from "react-router-dom"
import SearchBar from "../SearchBar"

function Header() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleLogin = () => {
    navigate("/login")
  }

  return (
    <header className="w-full bg-white p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4">
        {/* Optional: Brand or Logo can be added here */}

        {/* Search Bar - center on mobile, inline on larger screens */}
        <div className="w-full sm:w-auto">
          <SearchBar />
        </div>

        {/* Auth Buttons */}
        <div className="flex justify-end">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors w-full sm:w-auto"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors w-full sm:w-auto"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
