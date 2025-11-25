"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Calendar } from "lucide-react";

interface ExpiringItem {
  id: number;
  name: string;
  quantity: number;
  expiryDate: Date;
  value: number;
}

interface ViewExpiringItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ExpiringItem[];
}

export default function ViewExpiringItemsModal({
  isOpen,
  onClose,
  items,
}: ViewExpiringItemsModalProps) {
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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl border border-deep-forest/10 shadow-lg z-50 w-[600px] max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle size={24} className="text-red-500" />
                <h3 className="text-xl font-bold text-deep-forest">
                  Expiring Items
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

            <div className="mb-4">
              <p className="text-deep-forest/70">
                Items expiring within 2 weeks. Consider moving them to the front
                or marking down prices.
              </p>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-deep-forest/60">No expiring items found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-deep-forest/10 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-deep-forest">
                          {item.name}
                        </h4>
                        <p className="text-deep-forest/60">
                          Quantity: {item.quantity}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar size={14} className="text-red-500" />
                          <span className="text-sm text-red-600">
                            Expires: {item.expiryDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-deep-forest">
                          ₦{item.value.toLocaleString()}
                        </p>
                        <p className="text-xs text-deep-forest/60">Value</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 bg-granny-green text-deep-forest rounded-lg font-semibold"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
