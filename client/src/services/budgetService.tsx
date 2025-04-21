export async function fetchBudgets() {
    const res = await fetch("http://localhost:3000/api/budgets", {
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
  
    const res = await fetch("http://localhost:3000/api/budgets/create", {
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
    const res = await fetch(`http://localhost:3000/api/budgets/${id}`, {
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
    const res = await fetch(`http://localhost:3000/api/budgets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to delete budget");
    }
  };