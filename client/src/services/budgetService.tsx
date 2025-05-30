
import { API_URL } from "@/lib/constants";

export async function fetchBudgets() {
  const res = await fetch(`${API_URL}/budgets`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch budgets");

  const budgets = await res.json();

  type Budget = {
    id: number;
    name: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
  };

  return budgets.map((budget: Budget) => ({
    id: budget.id,
    name: budget.name,
    amount: budget.amount,
    createdAt: budget.createdAt,
    updatedAt: budget.updatedAt,
  }));
}

export async function createBudget(name: string, amount: number) {
  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  const res = await fetch(`${API_URL}/budgets/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ name, amount }),
  });

  if (!res.ok) throw new Error("Failed to create budget");

  const budget = await res.json();

  return {
    id: budget.id,
    name: budget.name,
    amount: budget.amount,
    createdAt: budget.createdAt,
    updatedAt: budget.updatedAt,
  };
}

export const updateBudget = async (id: number, name: string, amount: number) => {
  const res = await fetch(`${API_URL}/budgets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ name, amount }),
  });

  if (!res.ok) {
    throw new Error("Failed to update budget");
  }

  return res.json();
};

export const deleteBudget = async (id: number) => {
  const res = await fetch(`${API_URL}/budgets/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete budget");
  }
};

export async function getBudgetById(id: number) {
  const res = await fetch(`${API_URL}/budgets/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch budget");
  }

  return res.json();
}
