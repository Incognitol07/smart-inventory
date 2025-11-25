"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import ProductModal from "../../components/modals/ProductModal";
import DeleteProductModal from "../../components/modals/DeleteProductModal";

type Product = {
  id: number;
  name: string;
  stock: number;
  cost: number;
  price: number;
  reorderPoint: number;
  status: string;
};

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Mock inventory data
  const inventoryData = [
    {
      id: 1,
      name: "Indomie Noodles",
      stock: 45,
      cost: 120,
      price: 150,
      reorderPoint: 20,
      status: "good",
    },
    {
      id: 2,
      name: "Cooking Oil",
      stock: 2,
      cost: 800,
      price: 1000,
      reorderPoint: 5,
      status: "critical",
    },
    {
      id: 3,
      name: "Coke 50cl",
      stock: 12,
      cost: 150,
      price: 200,
      reorderPoint: 10,
      status: "low",
    },
    {
      id: 4,
      name: "Peak Milk",
      stock: 8,
      cost: 400,
      price: 500,
      reorderPoint: 15,
      status: "low",
    },
    {
      id: 5,
      name: "Bread",
      stock: 25,
      cost: 300,
      price: 400,
      reorderPoint: 10,
      status: "good",
    },
  ];

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

  const filteredInventory = inventoryData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream text-deep-forest">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-deep-forest mb-2">
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
          <div className="max-w-md">
            <div className="relative">
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
          </div>

          {/* Inventory Table */}
          <motion.div
            className="bg-white rounded-xl border border-deep-forest/10 overflow-hidden"
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
                  {filteredInventory.map((item, idx) => (
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
                        ₦{item.cost}
                      </td>
                      <td className="py-4 px-6 text-deep-forest">
                        ₦{item.price}
                      </td>
                      <td className="py-4 px-6 text-deep-forest">
                        ₦{item.price - item.cost}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-semibold ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
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
                            onClick={() => {
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
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Products",
                value: inventoryData.length.toString(),
              },
              {
                label: "Low Stock Items",
                value: inventoryData
                  .filter((i) => i.status === "low" || i.status === "critical")
                  .length.toString(),
              },
              {
                label: "Total Value",
                value: `₦${inventoryData
                  .reduce((sum, item) => sum + item.stock * item.cost, 0)
                  .toLocaleString()}`,
              },
              {
                label: "Average Profit",
                value: `₦${Math.round(
                  inventoryData.reduce(
                    (sum, item) => sum + (item.price - item.cost),
                    0
                  ) / inventoryData.length
                )}`,
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
        onSubmit={(product) => {
          console.log("Add product:", product);
          // Handle adding product
        }}
      />

      <ProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        mode="edit"
        product={selectedProduct}
        onUpdate={(id, updatedProduct) => {
          console.log("Update product:", id, updatedProduct);
          // Handle updating product
        }}
      />
      <ProductModal
        isOpen={showViewModal}
        mode="view"
        product={selectedProduct}
        onClose={() => {
          setShowViewModal(false);
        }}
      />

      <DeleteProductModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        product={selectedProduct}
        onConfirm={(id) => {
          console.log("Delete product:", id);
          // Handle deleting product
        }}
      />
    </div>
  );
}
