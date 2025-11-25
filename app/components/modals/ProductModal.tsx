"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Edit } from "lucide-react";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  stock: number;
  cost: number;
  price: number;
  reorderPoint: number;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  product?: Product | null;
  onSubmit?: (product: {
    name: string;
    stock: number;
    cost: number;
    price: number;
    reorderPoint: number;
  }) => void;
  onUpdate?: (productId: number, updatedProduct: Omit<Product, "id">) => void;
}

export default function ProductModal({
  isOpen,
  onClose,
  mode,
  product,
  onSubmit,
  onUpdate,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    stock: 0,
    cost: 0,
    price: 0,
    reorderPoint: 10,
  });

  useEffect(() => {
    if (mode === "edit" && product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: product.name,
        stock: product.stock,
        cost: product.cost,
        price: product.price,
        reorderPoint: product.reorderPoint,
      });
    } else if (mode === "create") {
      // Reset form for create mode
      setFormData({
        name: "",
        stock: 0,
        cost: 0,
        price: 0,
        reorderPoint: 10,
      });
    }
  }, [mode, product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create" && onSubmit) {
      onSubmit(formData);
    } else if (mode === "edit" && product && onUpdate) {
      onUpdate(product.id, formData);
    }
    onClose();
  };

  const updateFormData = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const title = mode === "create" ? "Add New Product" : "Edit Product";
  const buttonText = mode === "create" ? "Add Product" : "Update Product";
  const Icon = mode === "create" ? Plus : Edit;

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
              <h3 className="text-xl font-bold text-deep-forest">{title}</h3>
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
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  className="w-full p-3 border border-deep-forest/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-deep-forest mb-2">
                  {mode === "create" ? "Initial Stock" : "Stock"}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    updateFormData("stock", Number(e.target.value))
                  }
                  className="w-full p-3 border border-deep-forest/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-deep-forest mb-2">
                  Cost Price (₦)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) =>
                    updateFormData("cost", Number(e.target.value))
                  }
                  className="w-full p-3 border border-deep-forest/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-deep-forest mb-2">
                  Selling Price (₦)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    updateFormData("price", Number(e.target.value))
                  }
                  className="w-full p-3 border border-deep-forest/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-deep-forest mb-2">
                  Reorder Point
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.reorderPoint}
                  onChange={(e) =>
                    updateFormData("reorderPoint", Number(e.target.value))
                  }
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
                  <Icon size={20} />
                  {buttonText}
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
