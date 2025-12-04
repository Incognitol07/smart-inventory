"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import ViewExpiringItemsModal from "../../components/modals/ViewExpiringItemsModal";
import RestockModal from "../../components/modals/RestockModal";
import AlertResolutionModal from "../../components/modals/AlertResolutionModal";

type NotificationItem = {
  id: number;
  priority: string;
  title: string;
  description: string;
  action: string;
  status: "active" | "resolved";
  createdAt: string;
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "urgent" | "high" | "medium">(
    "all"
  );
  const [showViewExpiringModal, setShowViewExpiringModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<NotificationItem | null>(
    null
  );

  // Mock notifications data
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      priority: "urgent",
      title: "Restock cooking oil",
      description:
        "You have 2 bottles left. You usually sell 5 per week. Restock today or lose ₦15,000 in weekend sales.",
      action: "Restock now",
      status: "active",
      createdAt: "2025-11-25T10:00:00Z",
    },
    {
      id: 2,
      priority: "high",
      title: "Expiring items alert",
      description:
        "₦12,600 worth of goods expire in 2 weeks. Move them to the front or mark down 20%.",
      action: "View list",
      status: "active",
      createdAt: "2025-11-25T09:30:00Z",
    },
    {
      id: 3,
      priority: "medium",
      title: "Slow-moving stock",
      description:
        "You bought 10 cartons of Peak Milk last month but only sold 4. That's ₦12,000 tied up.",
      action: "Review",
      status: "active",
      createdAt: "2025-11-24T14:00:00Z",
    },
    {
      id: 4,
      priority: "urgent",
      title: "Low stock: Indomie Noodles",
      description: "Only 5 packs remaining. Expected to sell out by tomorrow.",
      action: "Order more",
      status: "resolved",
      createdAt: "2025-11-23T16:00:00Z",
    },
  ]);

  const filteredAlerts = notifications.filter((alert) => {
    if (filter === "all") return true;
    return alert.priority === filter && alert.status === "active";
  });

  const handleResolveAlert = (id: number) => {
    setNotifications(
      notifications.map((alert) =>
        alert.id === id ? { ...alert, status: "resolved" as const } : alert
      )
    );
  };

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
                Notifications
              </h1>
              <p className="text-deep-forest/60">Manage your notifications</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-deep-forest/60">
                {notifications.filter((a) => a.status === "active").length}{" "}
                active notifications
              </span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {[
              { key: "all", label: "All Alerts", count: notifications.length },
              {
                key: "urgent",
                label: "Urgent",
                count: notifications.filter(
                  (a) => a.priority === "urgent" && a.status === "active"
                ).length,
              },
              {
                key: "high",
                label: "High Priority",
                count: notifications.filter(
                  (a) => a.priority === "high" && a.status === "active"
                ).length,
              },
              {
                key: "medium",
                label: "Medium",
                count: notifications.filter(
                  (a) => a.priority === "medium" && a.status === "active"
                ).length,
              },
            ].map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setFilter(tab.key as "all" | "urgent" | "high" | "medium")
                }
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base flex items-center gap-2 ${
                  filter === tab.key
                    ? "bg-granny-green text-deep-forest"
                    : "bg-white text-deep-forest border border-deep-forest/20"
                }`}
              >
                {tab.label}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    filter === tab.key
                      ? "bg-deep-forest/20"
                      : "bg-deep-forest/10"
                  }`}
                >
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert, idx) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 sm:p-6 rounded-xl border border-deep-forest/20`}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 w-full">
                    <div className={`w-3 h-3 rounded-full mt-1`}></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-deep-forest text-lg">
                          {alert.title}
                        </h3>
                        {alert.status === "resolved" && (
                          <CheckCircle
                            size={16}
                            className="text-granny-green"
                          />
                        )}
                      </div>
                      <p className="text-deep-forest/70 mb-4">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-deep-forest/60">
                        <span>
                          Created:{" "}
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            alert.priority === "urgent"
                              ? "bg-red-100 text-red-700"
                              : alert.priority === "high"
                              ? "bg-granny-green/20 text-deep-forest"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {alert.priority.charAt(0).toUpperCase() +
                            alert.priority.slice(1)}{" "}
                          Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {alert.status === "active" && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedAlert(alert);
                            if (alert.action === "View list") {
                              setShowViewExpiringModal(true);
                            } else if (alert.action === "Restock now") {
                              setShowRestockModal(true);
                            }
                          }}
                          className="flex-1 sm:flex-none px-4 py-2 bg-granny-green text-deep-forest rounded-lg font-semibold text-sm"
                        >
                          {alert.action}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedAlert(alert);
                            setShowResolveModal(true);
                          }}
                          className="flex-1 sm:flex-none px-4 py-2 border border-deep-forest/20 text-deep-forest rounded-lg font-semibold text-sm hover:bg-deep-forest/5"
                        >
                          Mark Done
                        </motion.button>
                      </>
                    )}
                    {alert.status === "resolved" && (
                      <span className="px-4 py-2 bg-granny-green/20 text-granny-green rounded-lg font-semibold text-sm">
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CheckCircle
                size={48}
                className="text-granny-green mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-deep-forest mb-2">
                All caught up!
              </h3>
              <p className="text-deep-forest/60">
                No notifications match your current filter.
              </p>
            </motion.div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Active Alerts",
                value: notifications
                  .filter((a) => a.status === "active")
                  .length.toString(),
                color: "text-deep-forest",
              },
              {
                label: "Urgent",
                value: notifications
                  .filter(
                    (a) => a.priority === "urgent" && a.status === "active"
                  )
                  .length.toString(),
                color: "text-red-500",
              },
              {
                label: "Resolved Today",
                value: "2",
                color: "text-granny-green",
              },
              {
                label: "Avg Response Time",
                value: "4.2 hrs",
                color: "text-deep-forest",
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-4 rounded-lg border border-deep-forest/10"
              >
                <p className="text-xs font-semibold text-deep-forest/60 uppercase tracking-wide mb-2">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <ViewExpiringItemsModal
        isOpen={showViewExpiringModal}
        onClose={() => setShowViewExpiringModal(false)}
        items={[
          {
            id: 1,
            name: "Milk",
            quantity: 5,
            expiryDate: new Date("2025-12-01"),
            value: 2500,
          },
          {
            id: 2,
            name: "Bread",
            quantity: 3,
            expiryDate: new Date("2025-11-30"),
            value: 1200,
          },
        ]}
      />

      <RestockModal
        isOpen={showRestockModal}
        onClose={() => setShowRestockModal(false)}
        alert={selectedAlert}
        onSubmit={(alertId: number, quantity: number) => {
          console.log("Restock:", alertId, quantity);
          // Handle restock
        }}
      />

      <AlertResolutionModal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        alert={selectedAlert}
        onResolve={(alertId) => {
          handleResolveAlert(alertId);
        }}
      />
    </div>
  );
}
