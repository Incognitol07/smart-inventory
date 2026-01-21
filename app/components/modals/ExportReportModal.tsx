"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (
    format: "pdf" | "csv",
    dateRange: { start: Date; end: Date },
  ) => void;
}

export default function ExportReportModal({
  isOpen,
  onClose,
  onExport,
}: ExportReportModalProps) {
  const [format, setFormat] = useState<"pdf" | "csv">("csv");
  const [startDate, setStartDate] = useState(
    () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  ); // 30 days ago
  const [endDate, setEndDate] = useState(() => new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(format, { start: startDate, end: endDate });
    onClose();
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
              <h3 className="text-xl font-bold text-deep-forest">
                Export Sales Report
              </h3>
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
                  Export Format
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer opacity-100">
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={true}
                      readOnly
                      className="text-granny-green focus:ring-granny-green"
                    />
                    <FileSpreadsheet size={20} className="text-deep-forest" />
                    <span className="text-deep-forest">CSV (Excel)</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-deep-forest mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-deep-forest/60 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate.toISOString().split("T")[0]}
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                      className="w-full p-2 border border-deep-forest/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-deep-forest/60 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate.toISOString().split("T")[0]}
                      onChange={(e) => setEndDate(new Date(e.target.value))}
                      className="w-full p-2 border border-deep-forest/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-1 bg-granny-green text-deep-forest py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Export Report
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
