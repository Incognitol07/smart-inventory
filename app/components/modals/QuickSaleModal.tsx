"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign } from "lucide-react";
import { useState } from "react";

interface QuickSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sale: {
    product: string;
    quantity: number;
    price: number;
  }) => void;
}

export default function QuickSaleModal({
  isOpen,
  onClose,
  onSubmit,
}: QuickSaleModalProps) {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ product, quantity, price });
    onClose();
    // Reset form
    setProduct("");
    setQuantity(1);
    setPrice(0);
  };

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
              <h3 className="text-xl font-bold text-deep-forest">Quick Sale</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 hover:bg-deep-forest/10 rounded"
              >
                <X size={20} className="text-deep-forest" />
              </motion.button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-deep-forest mb-2">
                  Product
                </label>
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full p-3 border border-deep-forest/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green"
                  required
                >
                  <option value="">Select a product</option>
                  <option value="Indomie Noodles">Indomie Noodles</option>
                  <option value="Cooking Oil">Cooking Oil</option>
                  <option value="Coke 50cl">Coke 50cl</option>
                  <option value="Peak Milk">Peak Milk</option>
                  <option value="Bread">Bread</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-deep-forest mb-2">
                  Quantity
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
              <div>
                <label className="block text-sm font-semibold text-deep-forest mb-2">
                  Price per unit (₦)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
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
                  <DollarSign size={20} />
                  Record Sale
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
