"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb } from "lucide-react";

interface ActionTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActionTipsModal({
  isOpen,
  onClose,
}: ActionTipsModalProps) {
  const tips = [
    {
      title: "Restock cooking oil today",
      description:
        "You have 2 bottles left. Based on sales trends, you'll run out in 2 days. Restock today or lose ₦15,000 in weekend sales.",
      action: "Restock now",
    },
    {
      title: "Move expiring items to front",
      description:
        "₦12,600 worth of goods expire in 2 weeks. Move them to the front or mark down 20%.",
      action: "View list",
    },
    {
      title: "Review slow-moving stock",
      description:
        "You bought 10 cartons of Peak Milk last month but only sold 4. That's ₦12,000 tied up.",
      action: "Review",
    },
  ];

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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl border border-deep-forest/10 shadow-lg z-50 w-96 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb size={24} className="text-granny-green" />
                <h3 className="text-xl font-bold text-deep-forest">
                  Action Tips
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
            <p className="text-deep-forest/70 mb-4">
              Here are your top priorities for today:
            </p>
            <div className="space-y-4">
              {tips.map((tip, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 bg-cream rounded-lg border border-deep-forest/10"
                >
                  <h4 className="font-semibold text-deep-forest mb-2">
                    {tip.title}
                  </h4>
                  <p className="text-deep-forest/70 text-sm mb-3">
                    {tip.description}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-granny-green text-deep-forest rounded-lg font-semibold text-sm"
                  >
                    {tip.action}
                  </motion.button>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="flex-1 border border-deep-forest/20 text-deep-forest py-3 rounded-lg font-semibold hover:bg-deep-forest/5"
              >
                Got it
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
