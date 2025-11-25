"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Receipt, Calendar } from "lucide-react";

interface Transaction {
  id: string;
  date: Date;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  total: number;
  paymentMethod: string;
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction,
}: TransactionDetailsModalProps) {
  if (!transaction) return null;

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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl border border-deep-forest/10 shadow-lg z-50 w-[500px] max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Receipt size={24} className="text-granny-green" />
                <h3 className="text-xl font-bold text-deep-forest">
                  Transaction Details
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

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-deep-forest/60">
                <Calendar size={16} />
                <span>{transaction.date.toLocaleDateString()}</span>
              </div>

              <div className="border-t border-deep-forest/10 pt-4">
                <h4 className="font-semibold text-deep-forest mb-3">
                  Items Sold
                </h4>
                <div className="space-y-2">
                  {transaction.products.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-deep-forest/5"
                    >
                      <div>
                        <span className="font-medium text-deep-forest">
                          {item.name}
                        </span>
                        <span className="text-deep-forest/60 ml-2">
                          x{item.quantity}
                        </span>
                      </div>
                      <span className="text-deep-forest">
                        ₦{item.total.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-deep-forest/10 pt-4">
                <div className="flex justify-between items-center text-lg font-bold text-deep-forest">
                  <span>Total</span>
                  <span>₦{transaction.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-deep-forest/60">
                  <span>Payment Method</span>
                  <span>{transaction.paymentMethod}</span>
                </div>
              </div>
            </div>

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
