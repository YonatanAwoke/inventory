// services/revenueService.ts
import { API_URL } from "@/lib/constants";

export type RevenueData = {
  saleId: number;
  productName?: string;
  revenue: number;
  salePrice: number;
  costPrice: number;
  quantity: number;
  saleDate?: string;
};

type RevenueApiResponse = {
  saleId: number;
  revenue: number;
  salePrice: number;
  costPrice: number;
  quantity: number;
  saleDate?: string;
  productName?: string;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "Unknown Date";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export async function fetchAllRevenue(): Promise<RevenueData[]> {
  const res = await fetch(`${API_URL}/revenue`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch revenue data");

  const revenueList: RevenueApiResponse[] = await res.json();

  return revenueList.map((entry: RevenueApiResponse) => ({
    saleId: entry.saleId,
    revenue: entry.revenue,
    salePrice: entry.salePrice,
    costPrice: entry.costPrice,
    quantity: entry.quantity,
    productName: entry.productName || "Unknown",
    saleDate: formatDate(entry.saleDate),
  }));
}

export async function fetchRevenueBySaleId(saleId: number): Promise<RevenueData> {
  const res = await fetch(`${API_URL}/revenue/${saleId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch revenue for sale");

  const data: RevenueApiResponse = await res.json();

  return {
    saleId: data.saleId,
    revenue: data.revenue,
    salePrice: data.salePrice,
    costPrice: data.costPrice,
    quantity: data.quantity,
    productName: data?.productName || "Unknown",
    saleDate: formatDate(data.saleDate),
  };
}
