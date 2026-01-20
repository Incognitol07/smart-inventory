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
import ContextTooltip from "../../components/shared/ContextTooltip";

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
  transactions?: number;
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
                Sales Records
              </h1>
              <p className="text-deep-forest/60">
                Detailed proof of every kobo you made.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExportModal(true)}
              className="bg-granny-green text-deep-forest px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Download size={20} />
              Download Report
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Money In (Sales)",
                value: `₦${salesData
                  .reduce((sum, item) => sum + item.sales, 0)
                  .toLocaleString()}`,
                icon: DollarSign,
                tooltip: "Total amount collected from customers before any expenses."
              },
              {
                label: "Money You Keep (Profit)",
                value: `₦${salesData
                  .reduce((sum, item) => sum + item.profit, 0)
                  .toLocaleString()}`,
                icon: TrendingUp,
                tooltip: "The actual profit remaining after subtracting the cost of goods."
              },
              {
                label: "Number of Sales",
                value:
                  selectedPeriod === "week"
                    ? (salesData as WeeklySale[])
                        .reduce((sum, item) => sum + item.transactions, 0)
                        .toString()
                    : "N/A",
                icon: Calendar,
                 tooltip: "Total number of individual times a customer bought something."
              },
              {
                label: "Avg. Spend per Person",
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
                tooltip: "On average, how much one customer spends in a single visit."
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl border border-deep-forest/10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <stat.icon className="text-granny-green" size={24} />
                  <span className="text-sm font-semibold text-deep-forest/60 uppercase tracking-wide">
                    {stat.label}
                  </span>
                  <ContextTooltip content={stat.tooltip} />
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
              <div className="flex items-center gap-2 mb-4">
                 <h3 className="text-lg font-bold text-deep-forest">
                    {selectedPeriod === "week" ? "Money In (This Week)" : "Money In (This Month)"}
                 </h3>
                 <ContextTooltip content="Visual tracking of your daily sales." />
              </div>
              
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
              <div className="flex items-center gap-2 mb-4">
                 <h3 className="text-lg font-bold text-deep-forest">
                    {selectedPeriod === "week" ? "Profit (This Week)" : "Profit (This Month)"}
                 </h3>
                 <ContextTooltip content="Visual tracking of your daily profit." />
              </div>
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
            className="bg-white p-6 rounded-xl border border-deep-forest/10 hidden md:block"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-bold text-deep-forest">
                 What is selling fast?
              </h3>
              <ContextTooltip content="These items are moving the fastest. Watch their stock levels closely." />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-deep-forest/10">
                    <th className="text-left py-2 text-deep-forest font-semibold">
                      Product
                    </th>
                    <th className="text-left py-2 text-deep-forest font-semibold">
                      <div className="flex items-center gap-1">
                          Quantity Sold
                          <ContextTooltip content="Total units sold in this period" />
                      </div>
                    </th>
                    <th className="text-left py-2 text-deep-forest font-semibold">
                       <div className="flex items-center gap-1">
                          Money In
                          <ContextTooltip content="Total revenue from this item" />
                      </div>
                    </th>
                    <th className="text-left py-2 text-deep-forest font-semibold">
                       <div className="flex items-center gap-1">
                          Actual Profit
                          <ContextTooltip content="Total profit from this item" />
                      </div>
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

          {/* Mobile Top Products Cards */}
          <div className="md:hidden space-y-4">
            <h3 className="text-lg font-bold text-deep-forest mb-4">
              What is selling fast?
            </h3>
            {topProducts.map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-4 rounded-xl border border-deep-forest/10"
              >
                <h4 className="text-lg font-semibold text-deep-forest mb-3">
                  {product.name}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-deep-forest/60">Quantity Sold</p>
                    <p className="font-medium text-deep-forest">
                      {product.sold}
                    </p>
                  </div>
                  <div>
                    <p className="text-deep-forest/60">Money In</p>
                    <p className="font-medium text-deep-forest">
                      ₦{product.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-deep-forest/60">Actual Profit</p>
                    <p className="font-medium text-deep-forest">
                      ₦{product.profit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
