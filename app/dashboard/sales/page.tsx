"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Calendar, Download, Loader2 } from "lucide-react";
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
import axios from "axios";

type SaleItem = {
    id: string;
    quantity: number;
    priceAtSale: number;
    costAtSale: number;
    product: {
        name: string;
    }
}

type Sale = {
    id: string;
    date: string; // ISO date string from API
    totalAmount: number;
    totalProfit: number;
    items: SaleItem[];
}

// Chart data types
type ChartDataPoint = {
    dayOrMonth: string; // "Mon", "Jan", etc.
    sales: number;
    profit: number;
    transactions: number;
}


export default function SalesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");
  const [showExportModal, setShowExportModal] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSales = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/sales");
            setSales(res.data);
        } catch (error) {
            console.error("Failed to fetch sales", error);
        } finally {
            setLoading(false);
        }
    };
    fetchSales();
  }, []);

  const processSalesData = (): ChartDataPoint[] => {
      // Group by day for this week or month
      // Simple logic: filter sales by selected period then group
      const now = new Date();
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      const cutoff = selectedPeriod === "week" ? oneWeekAgo : oneMonthAgo;

      const filteredSales = sales.filter(s => new Date(s.date) >= cutoff);
      
      const groupedData: Record<string, ChartDataPoint> = {};

      // Initialize map based on period to ensure all days/months exist even if 0 sales?
      // For simplicity, just grouping existing sales. For better UX, we'd fill gaps.
      // Let's iterate sales and group.

      filteredSales.forEach(sale => {
          const date = new Date(sale.date);
          let key = "";
          if (selectedPeriod === "week") {
             // Mon, Tue...
             key = date.toLocaleDateString('en-US', { weekday: 'short' });
          } else {
             // Jan, Feb... (Or Day of Month: 1, 2, 3..?)
             // UI mock used Month names "Jan, Feb". If "This Month" usually implies filtering for current month and showing DAYS 1-30.
             // OR "Past 6/12 months".
             // The UI mock had "Jan, Feb, Mar, Apr, May, Jun". That looks like a "Year" view or "past 6 months".
             // Let's assume user wants "Past 30 days" grouped by day if "month" or "Past 7 days" grouped by day if "week".
             // Wait, the Mock UI labeled the button "This Month" but showed multiple months data. 
             // Let's stick to:
             // "Week" = Past 7 days (grouped by Day Name)
             // "Month" = Past 30 days (grouped by Date e.g "1st", "2nd")
             // OR to match chart mock strictly: "Month" could mean "Year to Date".
             // Given the button says "This Month", showing daily breakdown of current month makes most sense for a retailer.
             key = date.getDate().toString();
          }

          if (!groupedData[key]) {
              groupedData[key] = { dayOrMonth: key, sales: 0, profit: 0, transactions: 0 };
          }
          groupedData[key].sales += sale.totalAmount;
          groupedData[key].profit += sale.totalProfit;
          groupedData[key].transactions += 1;
      });

      // Convert to array and sort? 
      // Sorting purely by key string might fail for days (Mon vs Fri).
      // We can just return values for now, chart handles order if we provide it sorted.
      // For MVP simplicity, just returning whatever key order.
      return Object.values(groupedData);
  };

  const chartData = processSalesData();
  
  // Calculate top products explicitly from ALL filtered sales in period
  const getTopProducts = () => {
      const now = new Date();
      const cutoff = selectedPeriod === "week" 
          ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
          : new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()); // Past 30 days

      const filteredSales = sales.filter(s => new Date(s.date) >= cutoff);
      const productStats: Record<string, { name: string, sold: number, revenue: number, profit: number }> = {};
      
      filteredSales.forEach(sale => {
          sale.items.forEach(item => {
              const name = item.product?.name || "Unknown";
              if (!productStats[name]) {
                  productStats[name] = { name, sold: 0, revenue: 0, profit: 0 };
              }
              productStats[name].sold += item.quantity;
              productStats[name].revenue += (item.priceAtSale * item.quantity);
              productStats[name].profit += ((item.priceAtSale - item.costAtSale) * item.quantity);
          });
      });
      
      return Object.values(productStats).sort((a, b) => b.sold - a.sold).slice(0, 5);
  };

  const topProducts = getTopProducts();
  const rawTotalSales = chartData.reduce((acc, curr) => acc + curr.sales, 0);
  const rawTotalProfit = chartData.reduce((acc, curr) => acc + curr.profit, 0);
  const rawTotalTrans = chartData.reduce((acc, curr) => acc + curr.transactions, 0);


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
                value: `₦${rawTotalSales.toLocaleString()}`,
                icon: DollarSign,
                tooltip: "Total amount collected from customers before any expenses."
              },
              {
                label: "Money You Keep (Profit)",
                value: `₦${rawTotalProfit.toLocaleString()}`,
                icon: TrendingUp,
                tooltip: "The actual profit remaining after subtracting the cost of goods."
              },
              {
                label: "Number of Sales",
                value: rawTotalTrans.toString(),
                icon: Calendar,
                 tooltip: "Total number of individual times a customer bought something."
              },
              {
                label: "Avg. Spend per Person",
                value: `₦${Math.round(rawTotalSales / (rawTotalTrans || 1)).toLocaleString()}`,
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
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d5f3f10" />
                  <XAxis
                    dataKey="dayOrMonth"
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
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d5f3f10" />
                  <XAxis
                    dataKey="dayOrMonth"
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
                  {topProducts.length === 0 && (
                      <tr>
                          <td colSpan={4} className="text-center py-8 text-deep-forest/60">
                              No sales records found for this period.
                          </td>
                      </tr>
                  )}
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
             {topProducts.length === 0 && (
                  <div className="text-center py-8 text-deep-forest/60">
                      No sales records found for this period.
                  </div>
              )}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={(format, dateRange) => {
            const filtered = sales.filter(s => {
                const d = new Date(s.date);
                return d >= dateRange.start && d <= dateRange.end;
            });

            if (filtered.length === 0) {
                alert("No records found for this period.");
                return;
            }

            if (format === "csv") {
                const headers = ["Date", "Transaction ID", "Total Amount", "Profit", "Items"];
                const rows = filtered.map(s => [
                    new Date(s.date).toLocaleDateString(),
                    s.id,
                    s.totalAmount,
                    s.totalProfit,
                    s.items.map(i => `${i.product?.name || 'Unknown'} (x${i.quantity})`).join("; ")
                ]);

                const csvContent = [
                    headers.join(","),
                    ...rows.map(r => r.map(c => typeof c === 'string' ? `"${c.replace(/"/g, '""')}"` : c).join(","))
                ].join("\n");

                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `sales_report_${dateRange.start.toISOString().split('T')[0]}_${dateRange.end.toISOString().split('T')[0]}.csv`);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert("PDF export is coming soon! Please use CSV for now.");
            }
        }}
      />
    </div>
  );
}
