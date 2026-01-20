"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  AlertCircle,
  Clock,
  DollarSign,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import QuickSaleModal from "../components/modals/QuickSaleModal";
import ContextTooltip from "../components/shared/ContextTooltip";
import axios from "axios";

// Helper for greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

type DashboardStats = {
    moneyIn: number;
    profit: number;
    transactions: number;
    lowStockItems: number;
    itemsOnShelves: number;
    topProducts: { name: string; count: number }[];
}

export default function Dashboard() {
  const [showQuickSaleModal, setShowQuickSaleModal] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
        const res = await axios.get("/api/dashboard/stats");
        setStats(res.data);
    } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = stats?.topProducts.map(p => ({
      name: p.name,
      sales: p.count
  })) || [];

  if (loading) {
      return (
          <div className="min-h-screen bg-cream flex items-center justify-center">
              <Loader2 className="animate-spin text-deep-forest" size={48} />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-cream text-deep-forest">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-deep-forest mb-2">
                {getGreeting()}, Owner
              </h1>
              <p className="text-deep-forest/60">
                Here's what's happening in your shop today.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuickSaleModal(true)}
              className="bg-granny-green text-deep-forest px-6 py-3 rounded-lg font-semibold shadow-lg shadow-granny-green/20 flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              New Sale
            </motion.button>
          </div>

          {/* Daily Briefing (Insights) */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white p-6 rounded-xl border border-deep-forest/10 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-granny-green/20 rounded-lg">
                  <TrendingUp className="text-deep-forest" size={24} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-deep-forest">
                            Daily Briefing
                        </h3>
                        <ContextTooltip content="A quick summary of the most important things happening right now." />
                    </div>
                </div>
              </div>
              <div className="space-y-4">
                  {stats && stats.lowStockItems > 0 ? (
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <AlertCircle className="text-alert-red shrink-0" size={20} />
                      <div>
                        <p className="font-semibold text-deep-forest">
                          Restock Needed
                        </p>
                        <p className="text-sm text-deep-forest/70">
                          {stats.lowStockItems} items are running low on stock.
                          Check the inventory page.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <TrendingUp className="text-granny-green shrink-0" size={20} />
                      <div>
                        <p className="font-semibold text-deep-forest">
                          Stock looks good
                        </p>
                        <p className="text-sm text-deep-forest/70">
                          You have {stats?.itemsOnShelves || 0} items on shelves ready to sell.
                        </p>
                      </div>
                    </div>
                  )}
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Clock className="text-blue-600 shrink-0" size={20} />
                    <div>
                        <p className="font-semibold text-deep-forest">
                            Business Activity
                        </p>
                        <p className="text-sm text-deep-forest/70">
                            {stats?.transactions && stats.transactions > 0 
                                ? `You've made ${stats.transactions} sales so far. Keep it up!` 
                                : "No sales yet today. Ready for the first customer?"}
                        </p>
                    </div>
                </div>
              </div>
            </motion.div>

            {/* Top Selling Chart */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white p-6 rounded-xl border border-deep-forest/10 shadow-sm flex flex-col"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-deep-forest">
                            Top Sellers
                        </h3>
                        <ContextTooltip content="These are your most popular items right now." />
                    </div>
                </div>
                <div className="flex-1 min-h-[200px]">
                    {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2d5f3f10" />
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                width={100} 
                                tick={{ fill: '#2d5f3f', fontSize: 12 }} 
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    backgroundColor: "#fffcf3",
                                    border: "1px solid #2d5f3f20",
                                    borderRadius: "8px",
                                }}
                            />
                            <Bar dataKey="sales" fill="#a8e063" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-deep-forest/40">
                            <p>No sales data yet.</p>
                        </div>
                    )}
                </div>
            </motion.div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Money coming in",
                  value: `₦${stats?.moneyIn.toLocaleString() || "0"}`,
                  sub: "Total Sales",
                  icon: DollarSign,
                  tooltip: "Total cash collected from sales."
                },
                {
                  label: "Money you keep",
                  value: `₦${stats?.profit.toLocaleString() || "0"}`,
                  sub: "Total Profit",
                  icon: TrendingUp,
                  tooltip: "Revenue minus the cost of items sold."
                },
                {
                  label: "Items on shelves",
                  value: (stats?.itemsOnShelves || 0).toString(),
                  sub: "Total Stock",
                  icon: Package,
                  tooltip: "Total number of physical items currently in store."
                },
                {
                  label: "Low Stock Items",
                  value: (stats?.lowStockItems || 0).toString(),
                  sub: "Needs Restock",
                  icon: AlertCircle,
                  color: (stats?.lowStockItems || 0) > 0 ? "text-alert-red" : "text-deep-forest",
                  tooltip: "Items that have reached their reorder point."
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 rounded-xl border border-deep-forest/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-cream rounded-lg">
                      <stat.icon className="text-secondary-teal" size={20} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                      <p className="text-sm text-deep-forest/60 font-medium">
                        {stat.label}
                      </p>
                      <ContextTooltip content={stat.tooltip} />
                  </div>
                  <h3 className={`text-2xl font-bold ${stat.color || "text-deep-forest"}`}>
                    {stat.value}
                  </h3>
                  <p className="text-xs text-deep-forest/40 mt-1">{stat.sub}</p>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>

      <QuickSaleModal
        isOpen={showQuickSaleModal}
        onClose={() => setShowQuickSaleModal(false)}
        onComplete={() => {
            fetchStats(); // Refresh stats after sale
        }}
      />
    </div>
  );
}
