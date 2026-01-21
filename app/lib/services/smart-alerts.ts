import { prisma } from "../../database/client";

// Helper to get Day of Week (0-6)
const getDayOfWeek = (date: Date) => date.getDay();

export async function generateSmartAlerts(userId: string) {
  try {
    const products = await prisma.product.findMany({
      where: { userId }
    });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const sales = await prisma.saleItem.findMany({
      where: {
        sale: {
          userId: userId,
          date: { gte: thirtyDaysAgo },
        },
      },
      include: {
        sale: true,
      },
    });

    const activeNotifications: any[] = [];
    const SIMULATION_DAYS = 7;
    const ALERT_THRESHOLD = 3; 

    // Analyze each product
    for (const product of products) {
      const productSales = sales.filter((s) => s.productId === product.id);
      
      const totalSold = productSales.reduce((sum, s) => sum + s.quantity, 0);

      // A. Calculate baseline velocity
      const daysInBusiness = Math.max(
        1, 
        Math.ceil((now.getTime() - new Date(product.createdAt).getTime()) / (1000 * 3600 * 24))
      );
      const activeDays = Math.min(daysInBusiness, 30);
      
      // If product has no sales, assume 0 velocity unless new
      let baseVelocity = totalSold / activeDays;
      if (activeDays < 5 && totalSold === 0) {
           baseVelocity = 0.0; // Don't predict for brand new items with 0 sales
      }

      if (baseVelocity === 0 && product.stock > 0) continue; // Safe

      // B. Seasonality Analysis
      const salesByDay = new Array(7).fill(0);
      const salesCountByDay = new Array(7).fill(0);

      productSales.forEach(s => {
        const dayIdx = getDayOfWeek(new Date(s.sale.date));
        salesByDay[dayIdx] += s.quantity;
        salesCountByDay[dayIdx]++;
      });

      const dayFactors = salesByDay.map((totalSales, dayIdx) => {
        const occurrences = salesCountByDay[dayIdx];
        if (occurrences === 0) return 1.0; 
        const avgSalesOnThisDay = totalSales / occurrences;
        const factor = avgSalesOnThisDay / baseVelocity;
        return Math.max(0.2, Math.min(3.0, factor));
      });

      // C. Simulation
      let predictedStock = product.stock;
      let stockoutDay = -1;

      for (let day = 1; day <= SIMULATION_DAYS; day++) {
        const targetDate = new Date(now.getTime() + day * 24 * 60 * 60 * 1000);
        const dayIdx = getDayOfWeek(targetDate);
        const seasonalFactor = dayFactors[dayIdx];
        
        // Use ceil to be conservative (better to alert early)
        const predictedSales = Math.ceil(baseVelocity * seasonalFactor);
        predictedStock -= predictedSales;

        if (predictedStock <= 0 && stockoutDay === -1) {
          stockoutDay = day;
          break;
        }
      }

      // D. Define Alerts
      if (stockoutDay !== -1 && stockoutDay <= ALERT_THRESHOLD) {
        const stockoutDate = new Date(now.getTime() + stockoutDay * 24 * 60 * 60 * 1000);
        const dayName = stockoutDate.toLocaleDateString('en-US', { weekday: 'long' });
        
        const urgency = stockoutDay === 1 ? "urgent" :stockoutDay === 2 ? "high" : "medium";

        activeNotifications.push({
            userId,
            title: stockoutDay === 1 ? `⚠️ ${product.name} - Critical` : `📊 ${product.name} - Plan Restock`,
            description: `Predicted to run out by ${dayName} (${stockoutDay} day${stockoutDay>1?'s':''})`,
            priority: urgency,
            action: "Restock",
            type: "stockout_warning",
            status: "active"
        });
      }
      else if (product.stock <= 3 && baseVelocity > 0.5) {
         activeNotifications.push({
            userId,
            title: `${product.name} - Low Stock`,
            description: `Only ${product.stock} units left.`,
            priority: "medium",
            action: "Restock",
            type: "low_stock",
            status: "active"
         });
      }
    }

    // E. Persist to DB (Atomic Refresh)
    // 1. Delete old auto-generated alerts (stockout/low_stock)
    await prisma.notification.deleteMany({
        where: {
            userId,
            type: { in: ["stockout_warning", "low_stock"] }
        }
    });

    // 2. Insert new valid alerts
    if (activeNotifications.length > 0) {
        await prisma.notification.createMany({
            data: activeNotifications
        });
    }

    return activeNotifications;

  } catch (error) {
    console.error("Smart Alert Generation Error:", error);
    return [];
  }
}
