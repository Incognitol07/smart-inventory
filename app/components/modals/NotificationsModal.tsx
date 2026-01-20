"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bell } from "lucide-react";

interface ActionItem {
  id: number;
  title: string;
  message: string;
  priority: string;
  action: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionItems: ActionItem[];
  onAction: (item: ActionItem) => void;
  onViewAll?: () => void;
  title?: string;
  className?: string;
}

export default function NotificationsModal({
  isOpen,
  onClose,
  actionItems,
  onAction,
  onViewAll,
  title = "Notifications",
  className = "fixed top-16 right-6",
}: NotificationsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-deep-forest/20 z-55"
          />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`${className} z-60 w-96 max-h-[600px] bg-white rounded-xl border border-deep-forest/10 shadow-lg overflow-hidden`}
          >
            <div className="flex items-center justify-between p-4 border-b border-deep-forest/10 bg-granny-green/5">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-deep-forest" />
                <h3 className="font-semibold text-deep-forest">
                  {title}
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
            <div className="overflow-y-auto max-h-[550px] space-y-2 p-4">
              {actionItems.length === 0 ? (
                <div className="text-center py-8">
                  <Bell
                    size={32}
                    className="text-deep-forest/40 mx-auto mb-2"
                  />
                  <p className="text-deep-forest/60">No action items</p>
                </div>
              ) : (
                actionItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ x: 4 }}
                    className={`p-3 rounded-lg border-l-4 cursor-pointer transition ${
                      item.priority === "urgent"
                        ? "bg-red-50/40 hover:bg-red-50/60"
                        : item.priority === "high"
                        ? "bg-granny-green/5 hover:bg-granny-green/10"
                        : "bg-blue-50/40 hover:bg-blue-50/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-deep-forest text-sm mb-1">
                          {item.title}
                        </h4>
                        <p className="text-deep-forest/70 text-sm mb-2">
                          {item.message}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onAction(item)}
                          className="text-xs font-semibold text-granny-green hover:text-deep-forest transition"
                        >
                          {item.action} →
                        </motion.button>
                      </div>
                      {item.priority === "urgent" && (
                        <div className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-2"></div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              {onViewAll && (
                <div className="mt-4 pt-4 border-t border-deep-forest/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onViewAll}
                    className="w-full text-left p-3 rounded-lg hover:bg-deep-forest/5 transition-colors text-deep-forest font-semibold"
                  >
                    View All Notifications →
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
