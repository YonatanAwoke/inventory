import { useEffect, useState } from "react";
import { DollarSign, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { deleteBudget, fetchBudgets } from "@/services/budgetService";
import { DeleteConfirmModal } from "./DeleteConfirmModal";


type Budget = {
  id: number;
  name: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};


const BudgetSkeletonCard = () => (
  <div className="relative bg-[#1A1F2C] w-full max-w-xs rounded-2xl shadow-lg p-6 min-h-[215px] animate-pulse flex flex-col">
    <div className="h-7 bg-gray-700 rounded w-1/3 mb-2" />
    <div className="h-4 bg-gray-800 rounded w-1/4 mb-4" />
    <div className="flex items-center space-x-2 mb-8">
      <div className="h-4 w-4 bg-gray-700 rounded-full" />
      <div className="h-5 bg-gray-700 rounded w-1/3" />
    </div>
    <div className="mt-auto h-8 bg-gray-700 rounded w-1/3" />
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <svg width="100%" height="100%">
        <rect x="0" y="0" width="100%" height="100%" rx="25" fill="#232634" />
      </svg>
    </div>
  </div>
);

const BudgetItemCard = ({ budget, onEdit, onDelete, onClick }: {
  budget: Budget;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="relative bg-[#1A1F2C] w-full max-w-xs rounded-2xl shadow-lg p-6 min-h-[215px] flex flex-col justify-between overflow-hidden transition-all hover:shadow-2xl cursor-pointer group animate-fade-in mx-auto"
  >

    <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-80 group-hover:opacity-100">
      <button
        onClick={e => { e.stopPropagation(); onEdit(); }}
        className="text-white hover:text-[#8B5CF6] transition"
        aria-label="Edit"
      >
        <Pencil size={18} />
      </button>
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="text-white hover:text-red-400 transition"
        aria-label="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>

    <div>
      <div className="text-lg md:text-xl font-bold text-white leading-none">{budget.name}</div>
      <div className="text-[15px] text-gray-400 font-medium mt-0.5">{budget.name}</div>
    </div>

    <div className="mt-6 flex items-center gap-2">
      <DollarSign className="text-[#8B5CF6] mr-1" />
      <span className="text-2xl md:text-3xl font-semibold text-white tracking-tight">ETB {budget.amount.toFixed(2)}</span>
    </div>
  </div>
);

const BudgetCard = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchBudgets().then(data => {
      setBudgets(data);
      setLoading(false);
    });
  }, []);

  const confirmDelete = async () => {
    if (selectedBudgetId !== null) {
      try {
        await deleteBudget(selectedBudgetId);
        setBudgets(current => current.filter(b => b.id !== selectedBudgetId));
      } catch (error) {
        console.error("Failed to delete budget:", error);
      } finally {
        setShowDeleteModal(false);
      }
    }
  };
  
  
  const handleDeleteClick = (id: number) => {
    setSelectedBudgetId(id);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-3 py-8">
      <div className="w-full flex justify-end max-w-6xl mb-6">
        <Button onClick={() => navigate("/budget/create")} size="lg" className="bg-[#8B5CF6] hover:bg-[#9b87f5] text-white font-semibold rounded-lg px-6 shadow transition">Create Budget +</Button>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <BudgetSkeletonCard key={i} />)
          : budgets.map(budget => (
              <BudgetItemCard
                key={budget.id}
                budget={budget}
                onEdit={() => navigate(`/budget/edit/${budget.id}`)}
                onDelete={() => handleDeleteClick(budget.id)}
                onClick={() => navigate(`/budget/${budget.id}`)}
              />
            ))
        }
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete} deleting={false}        />
      </div>
    </div>
  );
};

export default BudgetCard;

