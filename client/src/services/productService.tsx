// services/productService.ts
export async function fetchProducts() {
    const res = await fetch("http://localhost:3000/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  }
  
export async function fetchProductById(id: number) {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to fetch product")
  }

  return res.json()
}

export async function createProduct(data: {
  name: string
  quantity: number
  price: number
  expireDate: string | null
  categoryId: number
}) {
  const res = await fetch("http://localhost:3000/api/products/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to create product")
  }

  return res.json()
}

export async function updateProduct(id: number, data: {
  name: string
  quantity: number
  price: number
  expireDate: string | null
  categoryId: number
}) {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to update product")
  }

  return res.json()
}


export async function deleteProduct(id: number) {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to delete product")
  }

  return res.json()
}





