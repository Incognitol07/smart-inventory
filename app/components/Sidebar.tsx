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
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import NotificationsModal from "./modals/NotificationsModal";

interface ActionItem {
  id: number;
  title: string;
  message: string;
  priority: string;
  action: string;
}

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
];

interface SidebarProps {
  notificationsCount?: number;
  actionItems?: ActionItem[];
  onAction?: (item: ActionItem) => void;
  onViewAll?: () => void;
}

export default function Sidebar({
  notificationsCount = 0,
  actionItems = [],
  onAction = () => {},
  onViewAll = () => {},
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  interface SidebarContentProps {
    isCollapsed: boolean;
    notificationsCount: number;
    actionItems: ActionItem[];
    onAction: (item: ActionItem) => void;
    onViewAll: () => void;
    showNotifications: boolean;
    setShowNotifications: (show: boolean) => void;
    setIsCollapsed: (collapsed: boolean) => void;
    setIsOpen: (open: boolean) => void;
  }

  function SidebarContent({
    isCollapsed,
    notificationsCount,
    actionItems,
    onAction,
    onViewAll,
    showNotifications,
    setShowNotifications,
    setIsCollapsed,
    setIsOpen,
  }: SidebarContentProps) {
    const router = useRouter();
    const pathname = usePathname();

    return (
      <div
        className="flex flex-col h-full"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {/* Header */}
        <div
          className={`${
            isCollapsed ? "p-4" : "p-6"
          } border-b border-deep-forest/10`}
        >
          <div className="flex items-center justify-between">
            <Link href="/" onClick={(e) => e.stopPropagation()}>
              <motion.h1
                className={`text-xl font-bold text-deep-forest ${
                  isCollapsed ? "hidden" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                SmartInventory
              </motion.h1>
            </Link>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                }}
                className="relative p-2 bg-cream text-deep-forest rounded-lg hover:bg-cream/80 transition-colors"
                title="Notifications"
              >
                <Bell size={20} />
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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="md:hidden p-1 hover:bg-deep-forest/10 rounded"
              >
                <X size={20} className="text-deep-forest" />
              </motion.button>
            </div>
          </div>
        </div>

        <NotificationsModal
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          actionItems={actionItems}
          onAction={onAction}
          onViewAll={() => {
            onViewAll();
            setShowNotifications(false);
          }}
          className={
            isCollapsed
              ? "fixed left-20 top-4"
              : "fixed md:left-72 left-4 top-20 md:top-4" // Mobile: below header, Desktop: side
          }
        />
        {/* Navigation */}
        <nav className={`flex-1 ${isCollapsed ? "px-2 py-6" : "px-4 py-6"}`}>
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(item.href);
                      if (window.innerWidth < 768) setIsOpen(false); // Close mobile menu
                    }}
                    className={`w-full flex items-center ${
                      isCollapsed
                        ? "justify-center px-2 py-2"
                        : "gap-3 px-4 py-3"
                    } rounded-lg text-left transition-colors ${
                      isActive
                        ? "bg-granny-green text-deep-forest font-semibold"
                        : "text-deep-forest/70 hover:text-deep-forest hover:bg-deep-forest/5"
                    }`}
                  >
                    <item.icon size={20} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 md:hidden bg-deep-forest text-cream p-2 rounded-lg shadow-lg"
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

      {/* Mobile Sidebar */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed left-0 top-0 h-screen w-64 bg-cream border-r border-deep-forest/10 shadow-lg z-50 md:hidden"
      >
        <SidebarContent
          isCollapsed={false}
          notificationsCount={notificationsCount}
          actionItems={actionItems}
          onAction={onAction}
          onViewAll={onViewAll}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          setIsCollapsed={setIsCollapsed}
          setIsOpen={setIsOpen}
        />
      </motion.div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:sticky md:top-0 md:flex md:flex-col md:h-screen bg-cream border-r border-deep-forest/10 shadow-sm transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          notificationsCount={notificationsCount}
          actionItems={actionItems}
          onAction={onAction}
          onViewAll={onViewAll}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          setIsCollapsed={setIsCollapsed}
          setIsOpen={setIsOpen}
        />
      </div>
    </>
  );
}
