import { useAuth } from "@/context/UseAuth"
import { JSX } from "react"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
