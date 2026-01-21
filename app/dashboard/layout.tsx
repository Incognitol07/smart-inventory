"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import RestockModal from "../components/modals/RestockModal";
import AdaChat from "../components/std/AdaChat";

type TodoItem = {
  id: number;
  priority: string;
  title: string;
  description: string;
  action: string;
};

// Mock data - should be moved to a shared location eventually
const todoItems = [
  {
    id: 1,
    priority: "urgent",
    title: "Restock cooking oil",
    description:
      "You have 2 bottles left. You usually sell 5 per week. Restock today or lose ₦15,000 in weekend sales.",
    action: "Restock now",
  },
  {
    id: 2,
    priority: "high",
    title: "Expiring items alert",
    description:
      "₦12,600 worth of goods expire in 2 weeks. Move them to the front or mark down 20%.",
    action: "View list",
  },
  {
    id: 3,
    priority: "medium",
    title: "Slow-moving stock",
    description:
      "You bought 10 cartons of Peak Milk last month but only sold 4. That's ₦12,000 tied up.",
    action: "Review",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<TodoItem | null>(null);

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <Sidebar
        notificationsCount={todoItems.length}
        actionItems={todoItems.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.description,
          priority: item.priority,
          action: item.action,
        }))}
        onAction={(item) => {
          setSelectedAlert({
            id: item.id,
            title: item.title,
            description: item.message,
            priority: item.priority,
            action: item.action,
          });
          if (item.action === "Restock now") {
            setShowRestockModal(true);
          }
          // Handle other actions here
        }}
        onViewAll={() => {
          router.push("/dashboard/notifications");
        }}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-0">
        {children}

        {/* Restock Modal */}
        <RestockModal
          isOpen={showRestockModal}
          onClose={() => setShowRestockModal(false)}
          alert={selectedAlert}
          onSubmit={(alertId, quantity) => {
            console.log("Restock:", alertId, quantity);
            // Handle restock submission
          }}
        />

        {/* AI Business Advisor */}
        <AdaChat />
      </div>
    </div>
  );
}
