"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, TrendingUp, Package, DollarSign, Clock, AlertTriangle } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data
const salesData = [
  { day: "Mon", sales: 2400, profit: 1200 },
  { day: "Tue", sales: 2210, profit: 1000 },
  { day: "Wed", sales: 2290, profit: 1100 },
  { day: "Thu", sales: 2000, profit: 900 },
  { day: "Fri", sales: 2181, profit: 1300 },
  { day: "Sat", sales: 2500, profit: 1400 },
  { day: "Sun", sales: 2100, profit: 1200 },
]

const todoItems = [
  {
    id: 1,
    priority: "urgent",
    title: "Restock cooking oil",
    description:
      "You have 2 bottles left. You usually sell 5 per week. Restock today or lose ₦15,000 in weekend sales.",
    action: "Restock now",
  },
  {
    id: 2,
    priority: "high",
    title: "Expiring items alert",
    description: "₦12,600 worth of goods expire in 2 weeks. Move them to the front or mark down 20%.",
    action: "View list",
  },
  {
    id: 3,
    priority: "medium",
    title: "Slow-moving stock",
    description: "You bought 10 cartons of Peak Milk last month but only sold 4. That's ₦12,000 tied up.",
    action: "Review",
  },
]

const insights = [
  {
    icon: TrendingUp,
    title: "Indomie is your money-maker",
    value: "₦45 profit per carton",
    description: "Stock more of this—rice only makes ₦28.",
    color: "bg-granny-green/10",
  },
  {
    icon: Package,
    title: "Inventory health",
    value: "78% optimal",
    description: "You're stocking efficiently this week.",
    color: "bg-blue-50",
  },
  {
    icon: DollarSign,
    title: "Hidden money leak",
    value: "₦8,500 lost",
    description: "You ran out of Coke twice—likely lost this in sales.",
    color: "bg-red-50",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("today")

  return (
    <div className="min-h-screen bg-cream text-deep-forest">
      {/* Top Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-deep-forest/10 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-deep-forest">Your Dashboard</h1>
            <p className="text-sm text-deep-forest/60">Monday, November 25, 2025</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-granny-green text-deep-forest px-4 py-2 rounded-full font-semibold text-sm transition"
          >
            <Clock size={16} />
            Last 24 hours
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
          {/* Priority Actions Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-bold text-deep-forest mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-granny-green" />
              Your Action Items Today
            </h2>
            <div className="space-y-3">
              {todoItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 rounded-xl border-l-4 backdrop-blur transition ${
                    item.priority === "urgent"
                      ? "border-l-red-500 bg-red-50/40"
                      : item.priority === "high"
                        ? "border-l-granny-green bg-granny-green/5"
                        : "border-l-blue-500 bg-blue-50/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-deep-forest mb-1">{item.title}</h3>
                      <p className="text-sm text-deep-forest/70 mb-3">{item.description}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm font-semibold text-granny-green hover:text-deep-forest transition"
                      >
                        {item.action} →
                      </motion.button>
                    </div>
                    {item.priority === "urgent" && (
                      <AlertTriangle size={20} className="text-red-500 flex-shrink-0 ml-3" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Insights Grid */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-bold text-deep-forest mb-4">Smart Insights</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {insights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className={`p-6 rounded-xl border border-deep-forest/10 ${insight.color}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-white/50 rounded-lg">
                      <insight.icon size={20} className="text-granny-green" />
                    </div>
                    <span className="text-xs font-semibold text-deep-forest/60 uppercase tracking-wide">
                      {insight.title}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-deep-forest mb-1">{insight.value}</p>
                  <p className="text-sm text-deep-forest/70">{insight.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Charts Section */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <motion.div
              className="bg-white p-6 rounded-xl border border-deep-forest/10"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold text-deep-forest mb-4">Weekly Sales</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d5f3f10" />
                  <XAxis dataKey="day" stroke="#2d5f3f60" />
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
              <h3 className="text-lg font-bold text-deep-forest mb-4">Weekly Profit</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d5f3f10" />
                  <XAxis dataKey="day" stroke="#2d5f3f60" />
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
          </motion.div>

          {/* Summary Stats */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
            {[
              { label: "Today's Revenue", value: "₦2,500", change: "+12%" },
              { label: "Items in Stock", value: "247", change: "+3" },
              { label: "Low Stock Alerts", value: "5", change: "Urgent" },
              { label: "This Month Profit", value: "₦28,400", change: "+8%" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-4 rounded-lg border border-deep-forest/10"
              >
                <p className="text-xs font-semibold text-deep-forest/60 uppercase tracking-wide mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-deep-forest mb-1">{stat.value}</p>
                <p className="text-xs text-granny-green font-semibold">{stat.change}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
