"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import RestockModal from "../components/modals/RestockModal";
import AdaChat from "../components/std/AdaChat";

type TodoItem = {
  id: number;
  priority: string;
  title: string;
  description: string;
  message?: string;
  action: string;
};


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<TodoItem | null>(null);
  const [notifications, setNotifications] = useState<TodoItem[]>([]);

  useEffect(() => {
    // Fetch Smart Notifications
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Normalize data to ensure description is set
          const normalized = data.map((item: any) => ({
            ...item,
            description: item.description || item.message || "",
          }));
          setNotifications(normalized);
        }
      })
      .catch((err) => console.error("Failed to fetch notifications", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <Sidebar
        notificationsCount={notifications.length}
        actionItems={notifications.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.description, // Guaranteed string now
          priority: item.priority,
          action: item.action,
        }))}
        onAction={(item) => {
          setSelectedAlert({
            id: item.id,
            title: item.title,
            description: item.message, // Map back from ActionItem
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
