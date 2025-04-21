import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { fetchAllRevenue, RevenueData } from "@/services/revenueService";
import { TrendingDown, TrendingUp } from "lucide-react";

interface TopSale {
  name: string;
  quantity: number;
  difference: number;
  growth: string;
  icon: string;
}

export default function RevenueOverview() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [topSales, setTopSales] = useState<TopSale[]>([]);

  const productIcons: Record<string, string> = {
    "Pisang Kepok": "🍌",
    "Kelapa Ijo": "🥥",
    // Add more if needed
  };

  useEffect(() => {
    fetchAllRevenue()
      .then((data) => {
        setRevenueData(data);
        setTopSales(getTopSales(data));
      })
      .finally(() => setLoading(false));
  }, []);

  const getMonthlySummary = () => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const summary = Array(12).fill(null).map((_, index) => ({
      month: months[index],
      bills: 0,
      income: 0,
      revenue: 0,
    }));

    revenueData.forEach((item) => {
      const date = new Date(item.saleDate ?? 0);
      const month = date.getMonth();
      summary[month].bills += item.costPrice * item.quantity;
      summary[month].income += item.salePrice * item.quantity;
      summary[month].revenue += item.revenue;
    });

    return summary;
  };

  const getTopSales = (data: RevenueData[]): TopSale[] => {
    const monthNow = new Date().getMonth();
    const prevMonth = monthNow === 0 ? 11 : monthNow - 1;

    const monthlyProductMap: Record<string, { current: number; previous: number }> = {};

    data.forEach((item) => {
      const date = new Date(item.saleDate ?? 0);
      const month = date.getMonth();
      const name = item.productName ?? "Unknown Product";

      if (!monthlyProductMap[name]) {
        monthlyProductMap[name] = { current: 0, previous: 0 };
      }

      if (month === monthNow) {
        monthlyProductMap[name].current += item.quantity;
      } else if (month === prevMonth) {
        monthlyProductMap[name].previous += item.quantity;
      }
    });

    const products = Object.entries(monthlyProductMap).map(([name, { current, previous }]) => {
      const diff = current - previous;
      const growth = previous === 0 ? "NEW" : `${((diff / previous) * 100).toFixed(1)}%`;
      return {
        name,
        quantity: current,
        difference: diff,
        growth,
        icon: productIcons[name] || "📦",
      };
    });

    return products.sort((a, b) => b.quantity - a.quantity).slice(0, 5)
  };

  const chartData = getMonthlySummary();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-2 bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Balance</h2>
        {loading ? (
          <p>Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bills" fill="#cbd5e1" name="Bills" />
              <Bar dataKey="income" fill="#93c5fd" name="Income" />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Top Sales Product</h2>
        </div>
        {topSales.length === 0 && !loading && (
          <p className="text-sm text-gray-500">No sales data available.</p>
        )}
        {topSales.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b last:border-none">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.quantity.toLocaleString()} sold</p>
              </div>
            </div>
            <div className="text-right text-sm">
              {item.difference > 0 ? (
                <p className="text-green-500 flex items-center justify-end">
                  <TrendingUp size={14} className="mr-1" />
                  {item.growth}
                </p>
              ) : item.difference < 0 ? (
                <p className="text-red-500 flex items-center justify-end">
                  <TrendingDown size={14} className="mr-1" />
                  {item.growth}
                </p>
              ) : (
                <p className="text-gray-400 text-xs">No change</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
