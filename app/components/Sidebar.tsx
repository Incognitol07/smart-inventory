"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Bell,
  Menu,
  X,
  Lightbulb,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const navigationItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Inventory",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    name: "Sales",
    href: "/dashboard/sales",
    icon: TrendingUp,
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
  },
];

interface SidebarProps {
  onActionTipsClick?: () => void;
  onNotificationsClick?: () => void;
  notificationsCount?: number;
}

export default function Sidebar({
  onActionTipsClick,
  onNotificationsClick,
  notificationsCount = 0,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-deep-forest text-cream p-2 rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </motion.button>

      {/* Mobile Overlay */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={overlayVariants}
        className="fixed inset-0 bg-deep-forest/20 z-40 md:hidden"
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-deep-forest/10 shadow-lg z-50 md:sticky md:top-0 md:h-screen md:shadow-none"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-deep-forest/10">
            <div className="flex items-center justify-between">
              <motion.h1
                className="text-xl font-bold text-deep-forest"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                SmartInventory
              </motion.h1>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="md:hidden p-1 hover:bg-deep-forest/10 rounded"
              >
                <X size={20} className="text-deep-forest" />
              </motion.button>
            </div>
            <p className="text-xs text-deep-forest/60 mt-1">
              Monday, November 25, 2025
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <motion.button
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        router.push(item.href);
                        if (window.innerWidth < 768) setIsOpen(false); // Close mobile menu
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        isActive
                          ? "bg-granny-green text-deep-forest font-semibold"
                          : "text-deep-forest/70 hover:text-deep-forest hover:bg-deep-forest/5"
                      }`}
                    >
                      <item.icon size={20} />
                      {item.name}
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Action Buttons */}
          {(onActionTipsClick || onNotificationsClick) && (
            <div className="p-4 border-t border-deep-forest/10">
              <div className="flex gap-2">
                {onActionTipsClick && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onActionTipsClick}
                    className="flex-1 p-3 bg-cream text-deep-forest rounded-lg hover:bg-cream/80 transition-colors"
                    title="Action Tips"
                  >
                    <Lightbulb size={20} className="mx-auto" />
                  </motion.button>
                )}
                {onNotificationsClick && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onNotificationsClick}
                    className="relative flex-1 p-3 bg-cream text-deep-forest rounded-lg hover:bg-cream/80 transition-colors"
                    title="Notifications"
                  >
                    <Bell size={20} className="mx-auto" />
                    {notificationsCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                      >
                        {notificationsCount}
                      </motion.div>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
