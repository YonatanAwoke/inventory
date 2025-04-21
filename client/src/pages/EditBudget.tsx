import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBudgets, updateBudget } from "../services/budgetService";

interface Budget {
  id: number;
  name: string;
  amount: number;
}

const EditBudget: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudget = async () => {
      const allBudgets = await fetchBudgets();
    const budget = allBudgets.find((b: Budget) => b.id === Number(id));
      if (budget) {
        setName(budget.name);
        setAmount(budget.amount);
      }
    };
    fetchBudget();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Amount must be a positive number greater than zero.");
      return;
    }

    try {
      await updateBudget(Number(id), name, numericAmount);
      navigate("/budget");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to update budget.");
      } else {
        setError("Failed to update budget.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Budget Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition-colors"
        >
          Update Budget
        </button>
      </form>
    </div>
  );
};

export default EditBudget;
