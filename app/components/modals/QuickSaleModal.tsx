"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface QuickSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void; // Callback to refresh parent data
}

type Product = {
    id: number;
    name: string;
    sellingPrice: number;
    stock: number;
};

export default function QuickSaleModal({
  isOpen,
  onClose,
  onComplete
}: QuickSaleModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0); // Display price (can be overridden or just visual)
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch products when modal opens
  useEffect(() => {
      if (isOpen) {
          fetchProducts();
          // Reset form
          setSelectedProductId("");
          setQuantity(1);
          setPrice(0);
          setError("");
      }
  }, [isOpen]);

  const fetchProducts = async () => {
      try {
          setLoadingProducts(true);
          const res = await axios.get("/api/products");
          setProducts(res.data);
      } catch (err) {
          console.error("Failed to load products", err);
          setError("Failed to load product list.");
      } finally {
          setLoadingProducts(false);
      }
  };

  const handleProductChange = (id: string) => {
      setSelectedProductId(id);
      const product = products.find(p => p.id === Number(id));
      if (product) {
          setPrice(product.sellingPrice);
      } else {
          setPrice(0);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    try {
        setSubmitting(true);
        setError("");
        
        await axios.post("/api/sales", {
            items: [
                {
                    productId: Number(selectedProductId),
                    quantity: Number(quantity)
                }
            ]
        });

        if (onComplete) onComplete();
        onClose();
    } catch (err: any) {
        console.error("Failed to record sale", err);
        setError(err.response?.data || "Failed to record sale. Check stock levels or try again.");
    } finally {
        setSubmitting(false);
    }
  };

  const selectedProduct = products.find(p => p.id === Number(selectedProductId));

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
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-alert-red text-sm rounded-lg flex items-start gap-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-deep-forest mb-2">
                  Product
                </label>
                {loadingProducts ? (
                    <div className="flex items-center gap-2 text-deep-forest/60 text-sm p-3">
                        <Loader2 className="animate-spin" size={16} />
                        Loading products...
                    </div>
                ) : (
                    <select
                    value={selectedProductId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="w-full p-3 border border-deep-forest/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green"
                    required
                    >
                    <option value="">Select a product</option>
                    {products.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name} (Stock: {p.stock})
                        </option>
                    ))}
                    </select>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-deep-forest mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct?.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-3 border border-deep-forest/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green"
                  required
                />
                {selectedProduct && (
                    <p className="text-xs text-deep-forest/50 mt-1">
                        {selectedProduct.stock} available
                    </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-deep-forest mb-2">
                  Estimated Total (₦)
                </label>
                <div className="w-full p-3 bg-gray-50 border border-deep-forest/10 rounded-lg text-deep-forest font-medium">
                    {price > 0 ? (price * quantity).toLocaleString() : "0.00"}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={submitting || !selectedProductId}
                  className="flex-1 bg-granny-green text-deep-forest py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : <DollarSign size={20} />}
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
