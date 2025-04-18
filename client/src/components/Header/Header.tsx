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
    <div>
      <main className="p-4 max-w-4xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Inventory Manager</h1>
          <p className="text-gray-700">Manage your inventory with ease.</p>
        </div>
        <div>
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
      </main>
    </div>
  )
}

export default Header
