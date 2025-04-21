import { useEffect, useState } from "react";
import { fetchAllRevenue, RevenueData } from "@/services/revenueService";
import {  Minus, ArrowRight, ArrowLeft, TrendingUp, TrendingDownIcon } from "lucide-react"; 

const PAGE_SIZE = 10;

export default function RevenueList() {
  const [revenues, setRevenues] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchAllRevenue()
      .then(setRevenues)
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(revenues.length / PAGE_SIZE);
  const currentData = revenues.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(!selectAll ? currentData.map((r) => r.saleId) : []);
  };

  const toggleSelectRow = (saleId: number) => {
    setSelectedRows((prev) =>
      prev.includes(saleId) ? prev.filter((id) => id !== saleId) : [...prev, saleId]
    );
  };

  const getRevenueStyle = (revenue: number) => {
    if (revenue > 0) return "text-green-600";
    if (revenue < 0) return "text-red-600";
    return "text-gray-500";
  };

  const getRevenueIcon = (revenue: number) => {
    if (revenue > 0) return <TrendingUp size={14} className="inline ml-1" />;
    if (revenue < 0) return <TrendingDownIcon size={14} className="inline ml-1" />;
    return <Minus size={14} className="inline ml-1" />;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm w-full">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <table className="w-full text-sm text-left">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="px-3 py-2">
              <input
                type="checkbox"
                className="accent-indigo-500"
                checked={selectAll}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="px-3 py-2">Product</th>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Cost Price</th>
            <th className="px-3 py-2">Sale Price</th>
            <th className="px-3 py-2">Quantity</th>
            <th className="px-3 py-2">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-6">Loading...</td>
            </tr>
          ) : currentData.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6">No revenue data found.</td>
            </tr>
          ) : (
            currentData.map((rev) => (
              <tr key={rev.saleId} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    className="accent-indigo-500"
                    checked={selectedRows.includes(rev.saleId)}
                    onChange={() => toggleSelectRow(rev.saleId)}
                  />
                </td>
                <td className="px-3 py-2">{rev.productName}</td>
                <td className="px-3 py-2">{rev.saleDate}</td>
                <td className="px-3 py-2">{rev.costPrice}</td>
                <td className="px-3 py-2">{rev.salePrice}</td>
                <td className="px-3 py-2">{rev.quantity}</td>
                <td className={`px-3 py-2 font-medium ${getRevenueStyle(rev.revenue)}`}>
                  {rev.revenue}
                  {getRevenueIcon(rev.revenue)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            className="text-indigo-600 disabled:text-gray-400"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeft size={16} className="inline ml-1" />
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="text-indigo-600 disabled:text-gray-400"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ArrowRight size={16} className="inline ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
