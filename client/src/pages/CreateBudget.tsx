import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createBudget } from "@/services/budgetService";

const CreateBudget: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || amount <= 0) {
      setError("Please enter a valid name and amount.");
      return;
    }
    setSubmitting(true);
    try {
      await createBudget(name, amount);
      navigate("/budget");
    } catch {
      setError("Failed to create budget.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3">
      <div className="w-full max-w-md bg-[#1A1F2C] rounded-2xl shadow-xl p-8 md:p-10 flex flex-col animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-7">Create Budget</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
              disabled={submitting}
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
              disabled={submitting}
            />
          </div>
          {error && (
            <div className="text-sm text-red-400 font-medium bg-red-900 bg-opacity-20 px-3 py-2 rounded">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-[#8B5CF6] hover:bg-[#9b87f5] text-white font-semibold rounded-lg text-base h-11 transition-colors"
            disabled={submitting}
            size="lg"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-5 w-5 animate-spin border-t-[#8B5CF6]"></span>
                Creating...
              </span>
            ) : (
              "Create Budget"
            )}
          </Button>
        </form>
      </div>
      <style>
        {`
          .loader {
            border-top-color: #8B5CF6;
            border-radius: 50%;
            width: 1.25rem;
            height: 1.25rem;
            border-width: 0.25rem;
          }
        `}
      </style>
    </div>
  );
};

export default CreateBudget;

