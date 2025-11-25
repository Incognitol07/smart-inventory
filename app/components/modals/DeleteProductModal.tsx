"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle } from "lucide-react";

interface Product {
  id: number;
  name: string;
  stock: number;
  cost: number;
  price: number;
  reorderPoint: number;
}

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (productId: number) => void;
}

export default function DeleteProductModal({
  isOpen,
  onClose,
  product,
  onConfirm,
}: DeleteProductModalProps) {
  const handleConfirm = () => {
    if (product) {
      onConfirm(product.id);
      onClose();
    }
  };

  if (!product) return null;

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
                <AlertTriangle size={24} className="text-red-500" />
                <h3 className="text-xl font-bold text-deep-forest">
                  Delete Product
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
              <p className="text-deep-forest/70 mb-4">
                Are you sure you want to delete <strong>{product.name}</strong>?
              </p>
              <p className="text-deep-forest/60 text-sm">
                This action cannot be undone. All stock data for this product
                will be permanently removed.
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirm}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Trash2 size={20} />
                Delete Product
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
