import React, { useEffect, useState } from "react";
import { deleteBudget, fetchBudgets } from "../services/budgetService";
import { DollarSign, Pencil, ShoppingBasket, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

type Budget = {
  id: number;
  name: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

const BudgetCard: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const getBudgets = async () => {
    try {
      const fetchedBudgets = await fetchBudgets();
      setBudgets(fetchedBudgets);
    } catch (err) {
      console.error("Error fetching budgets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBudgets();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      await deleteBudget(id);
      getBudgets(); 
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {budgets.map((budget) => (
            <div key={budget.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
                <ShoppingBasket className="text-xl text-green-500 mr-3" />
                <h2 className="text-xl font-semibold">{budget.name}</h2>
            </div>
            <div className="flex items-center justify-between">
                <p className="text-gray-700">Amount:</p>
                <div className="flex items-center">
                <DollarSign className="text-yellow-500 mr-1" />
                <p className="text-xl font-bold">${budget.amount.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => navigate(`/budget/edit/${budget.id}`)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Pencil />
              </button>
              <button
                onClick={() => handleDelete(budget.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 />
              </button>
            </div>
            </div>
        ))}
        </div>
        <Button onClick={() => navigate("/budget/create")}>Create Budget</Button>
    </>
  );
};

export default BudgetCard;

