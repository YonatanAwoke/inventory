import { useAuth } from "../../context/UseAuth"
import { useNavigate } from "react-router-dom"

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
    <header className="w-full bg-white p-4">
      <div className="flex justify-end items-center">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-8 py-2 rounded-3xl hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-black text-white px-8 py-2 rounded-3xl hover:bg-gray-600"
          >
            Login
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
