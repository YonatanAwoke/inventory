import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBudgets, updateBudget } from "../services/budgetService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudget = async () => {
      setLoading(true);
      const allBudgets = await fetchBudgets();
      const budget = allBudgets.find((b: Budget) => b.id === Number(id));
      if (budget) {
        setName(budget.name);
        setAmount(budget.amount);
      }
      setLoading(false);
    };
    fetchBudget();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-3">
        <div className="w-full max-w-md bg-[#1A1F2C] rounded-2xl shadow-xl p-8 md:p-10 flex flex-col animate-fade-in">
          <div className="h-8 bg-gray-700 rounded w-2/3 mb-7 animate-pulse" />
          <div className="flex flex-col gap-6">
            <div>
              <div className="h-5 bg-gray-800 rounded w-1/3 mb-2 animate-pulse" />
              <div className="h-11 bg-gray-700 rounded animate-pulse" />
            </div>
            <div>
              <div className="h-5 bg-gray-800 rounded w-1/3 mb-2 animate-pulse" />
              <div className="h-11 bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-11 bg-gray-800 rounded mt-6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-3">
      <div className="w-full max-w-md bg-[#1A1F2C] rounded-2xl shadow-xl p-8 md:p-10 flex flex-col animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-7">Edit Budget</h2>
        <form onSubmit={handleUpdate} className="flex flex-col gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-300 mb-2 font-medium">Budget Name</label>
            <Input
              id="name"
              type="text"
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6]"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="E.g. Marketing, Groceries..."
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-gray-300 mb-2 font-medium">Amount</label>
            <Input
              id="amount"
              type="number"
              className="bg-[#15171E] text-white placeholder:text-gray-500 border-gray-700 focus:border-[#8B5CF6]"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              min={0}
              step="0.01"
              placeholder="$0.00"
              required
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-sm text-red-400 font-medium bg-red-900 bg-opacity-20 px-3 py-2 rounded">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg text-base h-11 transition-colors"
            disabled={loading}
            size="lg"
          >
            Update Budget
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditBudget;

