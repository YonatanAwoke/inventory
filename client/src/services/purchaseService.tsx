// services/purchaseService.ts

export async function fetchPurchases() {
    const res = await fetch("http://localhost:3000/api/purchases", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    if (!res.ok) throw new Error("Failed to fetch purchases");
    return res.json();
  }
  
  export async function fetchPurchaseById(id: number) {
    const res = await fetch(`http://localhost:3000/api/purchases/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch purchase");
    }
  
    return res.json();
  }
  
  export async function createPurchase(data: {
    productId: number;
    quantity: number;
    costPrice: number;
    expireDate?: string;
    purchaseDate?: string;
  }) {
    const res = await fetch("http://localhost:3000/api/purchases/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create purchase");
    }
  
    return res.json();
  }
  
  export async function updatePurchase(id: number, data: {
    productId?: number;
    quantity?: number;
    costPrice?: number;
    expireDate?: string;
    purchaseDate?: string;
  }) {
    const res = await fetch(`http://localhost:3000/api/purchases/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update purchase");
    }
  
    return res.json();
  }
  
  export async function deletePurchase(id: number) {
    const res = await fetch(`http://localhost:3000/api/purchases/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete purchase");
    }
  
    return res.json();
  }
  