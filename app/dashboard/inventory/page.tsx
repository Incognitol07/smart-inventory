"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, Loader2, RefreshCw } from "lucide-react";
import ProductModal from "../../components/modals/ProductModal";
import DeleteProductModal from "../../components/modals/DeleteProductModal";
import axios from "axios";

type Product = {
  id: number;
  name: string;
  stock: number;
  costPrice: number;
  sellingPrice: number;
  reorderPoint: number;
};

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/products");
      setProducts(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Could not load inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (data: any) => {
      try {
          // Map modal data to API expected body
          // Modal returns: { name, stock, cost, price, reorderPoint }
          // API expects: { name, stock, cost, price, reorderPoint } -> mapped to costPrice/sellingPrice in server
          await axios.post("/api/products", data);
          fetchProducts();
          setShowAddModal(false);
      } catch (err) {
          console.error("Failed to create product", err);
          alert("Failed to add product");
      }
  };

  const handleUpdateProduct = async (id: number, data: any) => {
      try {
          // data from modal: { name, stock, cost, price, reorderPoint }
          await axios.put(`/api/products/${id}`, data);
          fetchProducts();
          setShowEditModal(false);
      } catch (err) {
          console.error("Failed to update product", err);
          alert("Failed to update product");
      }
  };

  const handleDeleteProduct = async (id: number) => {
      try {
          await axios.delete(`/api/products/${id}`);
          fetchProducts();
          setShowDeleteModal(false);
      } catch (err) {
           console.error("Failed to delete product", err);
           alert("Failed to delete product");
      }
  };

  const getStatus = (product: Product) => {
      if (product.stock === 0) return "critical";
      if (product.stock <= product.reorderPoint) return "low";
      return "good";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-granny-green";
      case "low":
        return "text-warning-amber";
      case "critical":
        return "text-alert-red";
      default:
        return "text-deep-forest";
    }
  };

  const filteredInventory = products.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && products.length === 0) {
      return (
          <div className="min-h-screen bg-cream flex items-center justify-center">
              <Loader2 className="animate-spin text-deep-forest" size={48} />
          </div>
      );
  }

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
                Inventory
              </h1>
              <p className="text-deep-forest/60">
                Manage your products and stock levels
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="bg-granny-green text-deep-forest px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Add Product
            </motion.button>
          </div>

          {/* Search */}
          <div className="max-w-md flex gap-2">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-deep-forest/60"
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-deep-forest/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green"
              />
            </div>
            <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={fetchProducts} 
                className="p-3 bg-white border border-deep-forest/10 rounded-lg hover:bg-gray-50 flex items-center justify-center"
            >
                <motion.div
                    animate={{ rotate: loading ? 360 : 0 }}
                    transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                >
                    <RefreshCw size={20} className="text-deep-forest/70" />
                </motion.div>
            </motion.button>
          </div>

          {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                  {error}
              </div>
          )}

          {/* Inventory Table */}
          <motion.div
            className="bg-white rounded-xl border border-deep-forest/10 overflow-hidden hidden md:block"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-deep-forest/5">
                  <tr>
                    <th className="text-left py-4 px-6 text-deep-forest font-semibold">
                      Product
                    </th>
                    <th className="text-left py-4 px-6 text-deep-forest font-semibold">
                      Stock
                    </th>
                    <th className="text-left py-4 px-6 text-deep-forest font-semibold">
                      Cost
                    </th>
                    <th className="text-left py-4 px-6 text-deep-forest font-semibold">
                      Price
                    </th>
                    <th className="text-left py-4 px-6 text-deep-forest font-semibold">
                      Profit
                    </th>
                    <th className="text-left py-4 px-6 text-deep-forest font-semibold">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-deep-forest font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item, idx) => {
                    const status = getStatus(item);
                    return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-t border-deep-forest/5 hover:bg-deep-forest/5"
                      onClick={() => {
                        setSelectedProduct(item);
                        setShowViewModal(true);
                      }}
                    >
                      <td className="py-4 px-6 text-deep-forest font-medium">
                        {item.name}
                      </td>
                      <td className="py-4 px-6 text-deep-forest">
                        {item.stock}
                      </td>
                      <td className="py-4 px-6 text-deep-forest">
                        ₦{item.costPrice.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-deep-forest">
                        ₦{item.sellingPrice.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-deep-forest">
                        ₦{(item.sellingPrice - item.costPrice).toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-semibold ${getStatusColor(
                            status
                          )}`}
                        >
                          {status.charAt(0).toUpperCase() +
                            status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedProduct(item);
                              setShowEditModal(true);
                            }}
                            className="p-2 text-deep-forest/60 hover:text-deep-forest hover:bg-deep-forest/10 rounded"
                          >
                            <Edit size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedProduct(item);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-deep-forest/60 hover:text-alert-red hover:bg-alert-red/10 rounded"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  )})}
                  {filteredInventory.length === 0 && (
                      <tr>
                          <td colSpan={7} className="text-center py-8 text-deep-forest/60">
                              No products found. Add one to get started!
                          </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Mobile Inventory Cards */}
          <div className="md:hidden space-y-4">
            {filteredInventory.map((item, idx) => {
                 const status = getStatus(item);
                 return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-4 rounded-xl border border-deep-forest/10"
                onClick={() => {
                  setSelectedProduct(item);
                  setShowViewModal(true);
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-deep-forest">
                    {item.name}
                  </h3>
                  <span
                    className={`font-semibold ${getStatusColor(status)}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-deep-forest/60">Stock</p>
                    <p className="font-medium text-deep-forest">{item.stock}</p>
                  </div>
                  <div>
                    <p className="text-deep-forest/60">Cost</p>
                    <p className="font-medium text-deep-forest">₦{item.costPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-deep-forest/60">Price</p>
                    <p className="font-medium text-deep-forest">
                      ₦{item.sellingPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-deep-forest/60">Profit</p>
                    <p className="font-medium text-deep-forest">
                      ₦{(item.sellingPrice - item.costPrice).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedProduct(item);
                      setShowEditModal(true);
                    }}
                    className="flex-1 bg-deep-forest/10 text-deep-forest py-2 px-4 rounded-lg font-medium hover:bg-deep-forest/20"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedProduct(item);
                      setShowDeleteModal(true);
                    }}
                    className="flex-1 bg-alert-red/10 text-alert-red py-2 px-4 rounded-lg font-medium hover:bg-alert-red/20"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            )})}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Products",
                value: products.length.toString(),
              },
              {
                label: "Low Stock Items",
                value: products
                  .filter((i) => i.stock <= i.reorderPoint)
                  .length.toString(),
              },
              {
                label: "Total Value",
                value: `₦${products
                  .reduce((sum, item) => sum + item.stock * item.costPrice, 0)
                  .toLocaleString()}`,
              },
              {
                label: "Average Profit",
                value: `₦${products.length > 0 ? Math.round(
                  products.reduce(
                    (sum, item) => sum + (item.sellingPrice - item.costPrice),
                    0
                  ) / products.length
                ).toLocaleString() : 0}`,
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
                <p className="text-2xl font-bold text-deep-forest">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        mode="create"
        onSubmit={handleCreateProduct}
      />

      <ProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        mode="edit"
        // Adapt product keys for modal which expects cost vs costPrice
        product={selectedProduct ? {
            ...selectedProduct,
            cost: selectedProduct.costPrice,
            price: selectedProduct.sellingPrice
        } : null}
        onUpdate={handleUpdateProduct}
      />
      
      <ProductModal
        isOpen={showViewModal}
        mode="view"
         // Adapt product keys for modal
        product={selectedProduct ? {
            ...selectedProduct,
            cost: selectedProduct.costPrice,
            price: selectedProduct.sellingPrice
        } : null}
        onClose={() => {
          setShowViewModal(false);
        }}
      />

      <DeleteProductModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        product={selectedProduct ? { ...selectedProduct, cost: selectedProduct.costPrice, price: selectedProduct.sellingPrice} : null}
        onConfirm={(id) => handleDeleteProduct(id)}
      />
    </div>
  );
}
