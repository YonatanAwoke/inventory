import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBudgetById } from "../services/budgetService";
import { format } from "date-fns";

type BudgetDetailType = {
  id: number;
  name: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  purchases: {
    id: number;
    quantity: number;
    product: {
      name: string;
      price: number;
    };
  }[];
};

const BudgetDetail = () => {
  const { id } = useParams();
  const [budget, setBudget] = useState<BudgetDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const data = await getBudgetById(Number(id));
        setBudget(data);
      } catch (err) {
        console.error("Failed to fetch budget", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!budget) return <div>Budget not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">{budget.name}</h1>
      <p><strong>Amount Remaining:</strong> ${budget.amount.toFixed(2)}</p>
      <p><strong>Budget Created:</strong> {format(new Date(budget.createdAt), "PPpp")}</p>
      <p><strong>Last Updated:</strong> {format(new Date(budget.updatedAt), "PPpp")}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Purchases:</h2>
      {budget.purchases.length > 0 ? (
        <ul className="space-y-2">
          {budget.purchases.map((purchase) => (
            <li key={purchase.id} className="border p-3 rounded-md">
              <p><strong>Product:</strong> {purchase.product.name}</p>
              <p><strong>Price:</strong> ${purchase.product.price.toFixed(2)}</p>
              <p><strong>Quantity:</strong> {purchase.quantity}</p>
              <p><strong>Total Spent:</strong> ${(purchase.product.price * purchase.quantity).toFixed(2)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No purchases linked to this budget.</p>
      )}
    </div>
  );
};

export default BudgetDetail;
