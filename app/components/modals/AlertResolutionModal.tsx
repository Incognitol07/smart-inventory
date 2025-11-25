"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";

interface AlertItem {
  id: number;
  priority: string;
  title: string;
  description: string;
  action: string;
  status: "active" | "resolved";
  createdAt: string;
}

interface AlertResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: AlertItem | null;
  onResolve: (alertId: number) => void;
}

export default function AlertResolutionModal({
  isOpen,
  onClose,
  alert,
  onResolve,
}: AlertResolutionModalProps) {
  const handleResolve = () => {
    if (alert) {
      onResolve(alert.id);
      onClose();
    }
  };

  if (!alert) return null;

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
                <CheckCircle size={24} className="text-granny-green" />
                <h3 className="text-xl font-bold text-deep-forest">
                  Resolve Alert
                </h3>
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
            <div className="mb-6">
              <h4 className="font-semibold text-deep-forest mb-2">
                {alert.title}
              </h4>
              <p className="text-deep-forest/70 mb-4">{alert.description}</p>
              <div className="flex items-center gap-2 p-3 bg-granny-green/10 rounded-lg">
                <AlertCircle size={16} className="text-granny-green" />
                <p className="text-sm text-deep-forest">
                  Are you sure you want to mark this alert as resolved?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResolve}
                className="flex-1 bg-granny-green text-deep-forest py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Mark as Resolved
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 border border-deep-forest/20 text-deep-forest py-3 rounded-lg font-semibold hover:bg-deep-forest/5"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
