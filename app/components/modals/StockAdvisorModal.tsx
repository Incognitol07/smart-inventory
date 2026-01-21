"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  TrendingUp,
  ShoppingCart,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface StockAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Recommendation = {
  productId: number;
  name: string;
  quantity: number;
  cost: number;
  profit: number;
};

type OptimizationResult = {
  recommendations: Recommendation[];
  summary: {
    totalCost: number;
    totalExpectedProfit: number;
    budgetUtilization: number;
  };
};

export default function StockAdvisorModal({
  isOpen,
  onClose,
}: StockAdvisorModalProps) {
  const [budget, setBudget] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<OptimizationResult | null>(null);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || Number(budget) <= 0) return;

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await axios.post("/api/advisor/optimize", {
        budget: Number(budget),
      });

      setResult(res.data);
    } catch (err) {
      console.error("Optimization failed", err);
      setError("Failed to generate recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-deep-forest/20 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl border border-deep-forest/10 shadow-2xl z-50 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 p-6 pb-0">
              <div>
                <h3 className="text-xl font-bold text-deep-forest">
                  Smart Restock
                </h3>
                <p className="text-sm text-deep-forest/60">
                  Safely maximize your profit
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 hover:bg-deep-forest/10 rounded"
              >
                <X size={20} className="text-deep-forest" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 overflow-y-auto flex-1">
              {!result ? (
                <div className="max-w-md mx-auto mt-4">
                  <p className="text-deep-forest/80 mb-6 leading-relaxed">
                    Enter your budget below. We'll analyze your sales history to
                    tell you exactly what to stock to{" "}
                    <span className="font-bold text-deep-forest">
                      maximize your profit
                    </span>
                    .
                  </p>

                  <form onSubmit={handleOptimize} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-deep-forest mb-2">
                        Budget (₦)
                      </label>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="e.g. 50000"
                        className="w-full p-3 border border-deep-forest/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green text-lg"
                        autoFocus
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 text-alert-red rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading || !budget}
                      className="w-full bg-granny-green text-deep-forest py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <TrendingUp size={20} />
                          Calculate Plan
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-deep-forest/5">
                      <p className="text-xs font-bold text-deep-forest/50 uppercase tracking-wide">
                        Total Cost
                      </p>
                      <p className="text-2xl font-bold text-deep-forest">
                        ₦{result.summary.totalCost.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <p className="text-xs font-bold text-green-700/70 uppercase tracking-wide">
                        Exp. Profit
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        +₦{result.summary.totalExpectedProfit.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-deep-forest/5">
                      <p className="text-xs font-bold text-deep-forest/50 uppercase tracking-wide">
                        ROI
                      </p>
                      <p className="text-2xl font-bold text-deep-forest">
                        {result.summary.totalCost > 0
                          ? Math.round(
                              (result.summary.totalExpectedProfit /
                                result.summary.totalCost) *
                                100,
                            )
                          : 0}
                        %
                      </p>
                    </div>
                  </div>

                  {/* Recommendations Table */}
                  <div>
                    <h4 className="font-bold text-deep-forest mb-4 flex items-center gap-2">
                      <ShoppingCart size={20} className="text-deep-forest/60" />
                      Recommended Order
                    </h4>
                    <div className="border border-deep-forest/10 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-deep-forest/5">
                          <tr>
                            <th className="text-left p-3 font-semibold text-deep-forest">
                              Product
                            </th>
                            <th className="text-center p-3 font-semibold text-deep-forest">
                              Qty
                            </th>
                            <th className="text-right p-3 font-semibold text-deep-forest">
                              Cost
                            </th>
                            <th className="text-right p-3 font-semibold text-deep-forest">
                              Profit
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-deep-forest/5">
                          {result.recommendations.map((item) => (
                            <tr
                              key={item.productId}
                              className="hover:bg-deep-forest/[0.02]"
                            >
                              <td className="p-3 font-medium text-deep-forest">
                                {item.name}
                              </td>
                              <td className="p-3 text-center">
                                <span className="bg-white border border-deep-forest/10 px-2 py-1 rounded-md font-bold">
                                  x{item.quantity}
                                </span>
                              </td>
                              <td className="p-3 text-right text-deep-forest/70">
                                ₦{item.cost.toLocaleString()}
                              </td>
                              <td className="p-3 text-right font-medium text-green-600">
                                +₦{item.profit.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          {result.recommendations.length === 0 && (
                            <tr>
                              <td
                                colSpan={4}
                                className="p-8 text-center text-deep-forest/50"
                              >
                                No items recommended. This usually means your
                                budget is too low for any available products.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setResult(null)}
                      className="flex-1 py-3 border border-deep-forest/10 rounded-lg font-semibold hover:bg-gray-50 text-deep-forest/70"
                    >
                      Recalculate
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 bg-granny-green text-deep-forest rounded-lg font-bold shadow-lg shadow-granny-green/20 hover:scale-[1.02] transition-transform"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
