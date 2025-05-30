
import { API_URL } from "@/lib/constants";

type Sale = {
  id: number;
  purchase?: { product?: { name: string } };
  quantity: number;
  salePrice: number;
  saleDate: string;
  total: number;
  purchaseId: number;
};

export async function fetchSales() {
  const res = await fetch(`${API_URL}/sales`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch sales");

  const sales = await res.json();

  return sales.map((sale: Sale) => ({
    id: sale.id,
    productName: sale.purchase?.product?.name || "Unknown",
    quantity: sale.quantity,
    salePrice: sale.salePrice,
    saleDate: sale.saleDate,
    total: sale.total,
    purchaseId: sale.purchaseId,
  }));
}

export async function createSale(data: {
  purchaseId: number;
  quantity: number;
  salePrice: number;
  saleDate?: string;
}) {
  if (data.quantity <= 0) {
    throw new Error("Sale quantity must be greater than 0");
  }

  const purchaseRes = await fetch(`${API_URL}/purchases/${data.purchaseId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!purchaseRes.ok) {
    const errorData = await purchaseRes.json();
    throw new Error(errorData.message || "Failed to fetch purchase data");
  }

  const purchase = await purchaseRes.json();

  if (purchase.quantity <= 0) {
    throw new Error("Cannot create sale: purchase has no remaining stock");
  }

  if (data.quantity > purchase.quantity) {
    throw new Error("Sale quantity cannot exceed remaining purchase quantity");
  }

  const res = await fetch(`${API_URL}/sales/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create sale");
  }

  return res.json();
}
