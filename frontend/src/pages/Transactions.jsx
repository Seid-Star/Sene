import { useState, useEffect } from "react";

import { formatCurrency, formatDate, capitalize } from "../utils/formatters";
import { getTransactions } from "../services/transactionService";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions();

        setTransactions(response.transactions || []);
      } catch (err) {
        setError(err.message || "Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";

      case "paid":
        return "bg-blue-100 text-blue-800 border-blue-200";

      case "accepted":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";

      case "requested":
        return "bg-amber-100 text-amber-800 border-amber-200";

      case "rejected":
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";

      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Transaction History
          </h1>

          <p className="text-sm text-gray-500">
            Track all your buy and sell activities on SENE.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 animate-pulse space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-12 bg-gray-100 rounded-lg w-full"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-center text-sm">
            {error}
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
            <div className="text-4xl">📜</div>

            <h3 className="text-lg font-bold text-gray-800">
              No transactions recorded
            </h3>

            <p className="text-sm text-gray-500">
              When you purchase or sell produce, details will show up here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-4 font-semibold">
                      Transaction ID
                    </th>

                    <th className="py-3.5 px-4 font-semibold">
                      Produce
                    </th>

                    <th className="py-3.5 px-4 font-semibold">
                      Quantity
                    </th>

                    <th className="py-3.5 px-4 font-semibold">
                      Amount
                    </th>

                    <th className="py-3.5 px-4 font-semibold">
                      Date
                    </th>

                    <th className="py-3.5 px-4 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-mono text-xs text-gray-400">
                        #{tx.id?.slice(-6) || "N/A"}
                      </td>

                      <td className="py-4 px-4 font-medium text-gray-900">
                        {capitalize(tx.crop || "Unknown")}
                      </td>

                      <td className="py-4 px-4">
                        {tx.quantityKg
                          ? `${tx.quantityKg.toLocaleString()} kg`
                          : "N/A"}
                      </td>

                      <td className="py-4 px-4 font-bold text-emerald-700">
                        {formatCurrency(tx.totalPrice || 0)}
                      </td>

                      <td className="py-4 px-4 text-gray-500">
                        {formatDate(tx.createdAt)}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(
                            tx.status,
                          )}`}
                        >
                          {capitalize(tx.status || "Unknown")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
