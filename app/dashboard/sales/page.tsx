"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Calendar, Download } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ExportReportModal from "../../components/modals/ExportReportModal";

type WeeklySale = {
  day: string;
  sales: number;
  profit: number;
  transactions: number;
};

type MonthlySale = {
  month: string;
  sales: number;
  profit: number;
};

export default function SalesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [showExportModal, setShowExportModal] = useState(false);
  // Mock sales data
  const weeklySales = [
    { day: "Mon", sales: 2400, profit: 1200, transactions: 24 },
    { day: "Tue", sales: 2210, profit: 1000, transactions: 22 },
    { day: "Wed", sales: 2290, profit: 1100, transactions: 23 },
    { day: "Thu", sales: 2000, profit: 900, transactions: 20 },
    { day: "Fri", sales: 2181, profit: 1300, transactions: 25 },
    { day: "Sat", sales: 2500, profit: 1400, transactions: 28 },
    { day: "Sun", sales: 2100, profit: 1200, transactions: 21 },
  ];

  const monthlySales = [
    { month: "Jan", sales: 45000, profit: 18000 },
    { month: "Feb", sales: 52000, profit: 21000 },
    { month: "Mar", sales: 48000, profit: 19000 },
    { month: "Apr", sales: 55000, profit: 22000 },
    { month: "May", sales: 60000, profit: 24000 },
    { month: "Jun", sales: 58000, profit: 23000 },
  ];

  const topProducts = [
    { name: "Indomie Noodles", sold: 145, revenue: 21750, profit: 4350 },
    { name: "Cooking Oil", sold: 32, revenue: 32000, profit: 6400 },
    { name: "Coke 50cl", sold: 89, revenue: 17800, profit: 3560 },
    { name: "Peak Milk", sold: 45, revenue: 22500, profit: 4500 },
    { name: "Bread", sold: 67, revenue: 26800, profit: 5360 },
  ];

  const salesData: (WeeklySale | MonthlySale)[] =
    selectedPeriod === "week" ? weeklySales : monthlySales;

  return (
    <div className="min-h-screen bg-cream text-deep-forest">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-deep-forest mb-2">
                Sales
              </h1>
              <p className="text-deep-forest/60">
                Track your sales performance and revenue
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExportModal(true)}
              className="bg-granny-green text-deep-forest px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Download size={20} />
              Export Report
            </motion.button>
          </div>

          {/* Period Selector */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPeriod("week")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                selectedPeriod === "week"
                  ? "bg-granny-green text-deep-forest"
                  : "bg-white text-deep-forest border border-deep-forest/20"
              }`}
            >
              This Week
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPeriod("month")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                selectedPeriod === "month"
                  ? "bg-granny-green text-deep-forest"
                  : "bg-white text-deep-forest border border-deep-forest/20"
              }`}
            >
              This Month
            </motion.button>
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Sales",
                value: `₦${salesData
                  .reduce((sum, item) => sum + item.sales, 0)
                  .toLocaleString()}`,
                icon: DollarSign,
              },
              {
                label: "Total Profit",
                value: `₦${salesData
                  .reduce((sum, item) => sum + item.profit, 0)
                  .toLocaleString()}`,
                icon: TrendingUp,
              },
              {
                label: "Transactions",
                value:
                  selectedPeriod === "week"
                    ? (salesData as WeeklySale[])
                        .reduce((sum, item) => sum + item.transactions, 0)
                        .toString()
                    : "N/A",
                icon: Calendar,
              },
              {
                label: "Avg Transaction",
                value: `₦${Math.round(
                  salesData.reduce((sum, item) => sum + item.sales, 0) /
                    (selectedPeriod === "week"
                      ? (salesData as WeeklySale[]).reduce(
                          (sum, item) => sum + item.transactions,
                          0
                        )
                      : salesData.length)
                )}`,
                icon: DollarSign,
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl border border-deep-forest/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <stat.icon className="text-granny-green" size={24} />
                  <span className="text-sm font-semibold text-deep-forest/60 uppercase tracking-wide">
                    {stat.label}
                  </span>
                </div>
                <p className="text-3xl font-bold text-deep-forest">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <motion.div
              className="bg-white p-6 rounded-xl border border-deep-forest/10"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold text-deep-forest mb-4">
                {selectedPeriod === "week" ? "Weekly Sales" : "Monthly Sales"}
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d5f3f10" />
                  <XAxis
                    dataKey={selectedPeriod === "week" ? "day" : "month"}
                    stroke="#2d5f3f60"
                  />
                  <YAxis stroke="#2d5f3f60" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fffcf3",
                      border: "1px solid #2d5f3f20",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#a8e063"
                    strokeWidth={2}
                    dot={{ fill: "#2d5f3f", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Profit Chart */}
            <motion.div
              className="bg-white p-6 rounded-xl border border-deep-forest/10"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold text-deep-forest mb-4">
                {selectedPeriod === "week" ? "Weekly Profit" : "Monthly Profit"}
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d5f3f10" />
                  <XAxis
                    dataKey={selectedPeriod === "week" ? "day" : "month"}
                    stroke="#2d5f3f60"
                  />
                  <YAxis stroke="#2d5f3f60" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fffcf3",
                      border: "1px solid #2d5f3f20",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="profit" fill="#a8e063" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Top Products */}
          <motion.div
            className="bg-white p-6 rounded-xl border border-deep-forest/10"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold text-deep-forest mb-4">
              Top Selling Products
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-deep-forest/10">
                    <th className="text-left py-2 text-deep-forest font-semibold">
                      Product
                    </th>
                    <th className="text-left py-2 text-deep-forest font-semibold">
                      Sold
                    </th>
                    <th className="text-left py-2 text-deep-forest font-semibold">
                      Revenue
                    </th>
                    <th className="text-left py-2 text-deep-forest font-semibold">
                      Profit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-deep-forest/5"
                    >
                      <td className="py-3 text-deep-forest font-medium">
                        {product.name}
                      </td>
                      <td className="py-3 text-deep-forest">{product.sold}</td>
                      <td className="py-3 text-deep-forest">
                        ₦{product.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 text-deep-forest">
                        ₦{product.profit.toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modals */}
      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={(format, dateRange) => {
          console.log("Export:", format, dateRange);
          // Handle export
        }}
      />

    </div>
  );
}
