export const API_URL = "http://localhost:3000/api";

export async function loginUser(credentials: { email: string; password: string }, login: (token: string) => void) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  })
  if (!res.ok) throw new Error("Login failed")

  const data = await res.json()
  login(data.token)
  return data
}
  