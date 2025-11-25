"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Package, TrendingDown } from "lucide-react";
import { useState } from "react";

interface TodoItem {
  id: number;
  priority: string;
  title: string;
  description: string;
  action: string;
}

interface AlertItem {
  id: number;
  priority: string;
  title: string;
  description: string;
  action: string;
  status: "active" | "resolved";
  createdAt: string;
}

type AlertData = TodoItem | AlertItem;

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: AlertData | null;
  onSubmit: (alertId: number, quantity: number) => void;
}

export default function RestockModal({
  isOpen,
  onClose,
  alert,
  onSubmit,
}: RestockModalProps) {
  const [quantity, setQuantity] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alert) {
      onSubmit(alert.id, quantity);
      onClose();
      setQuantity(10);
    }
  };

  if (!alert) return null;

  // Determine if this is an AlertItem (has status property)
  const isAlertItem = "status" in alert;

  // Configure title and icon based on alert type
  const title = isAlertItem
    ? "Restock Details"
    : alert.title.replace("Restock ", "");
  const Icon = isAlertItem ? TrendingDown : Package;
  const iconColor = isAlertItem ? "text-red-500" : "text-deep-forest";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-deep-forest/20 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl border border-deep-forest/10 shadow-lg z-50 w-96"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon size={24} className={iconColor} />
                <h3 className="text-xl font-bold text-deep-forest">{title}</h3>
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
            <div className="mb-4">
              {isAlertItem ? (
                <>
                  <h4 className="font-semibold text-deep-forest mb-2">
                    {alert.title}
                  </h4>
                  <p className="text-deep-forest/70">{alert.description}</p>
                </>
              ) : (
                <p className="text-deep-forest/70">{alert.description}</p>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-deep-forest mb-2">
                  Restock Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-3 border border-deep-forest/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-1 bg-granny-green text-deep-forest py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Package size={20} />
                  Restock Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-deep-forest/20 text-deep-forest py-3 rounded-lg font-semibold hover:bg-deep-forest/5"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
