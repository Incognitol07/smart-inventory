"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ContextTooltipProps {
  content: string;
}

export default function ContextTooltip({ content }: ContextTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center ml-2"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        className="text-deep-forest/40 hover:text-granny-green transition-colors cursor-help focus:outline-none"
        aria-label="What does this mean?"
      >
        <HelpCircle size={16} />
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-deep-forest text-cream text-xs rounded-lg shadow-xl z-50 text-center leading-relaxed"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-deep-forest" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
