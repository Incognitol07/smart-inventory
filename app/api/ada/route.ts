import { NextResponse } from "next/server";
import {prisma} from "../../database/client";
import OpenAI from "openai";


// Configure OpenAI for GitHub Models
const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o";

const client = new OpenAI({
  baseURL: endpoint,
  apiKey: token,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Gather Context (The "Health Check")
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch Products with Stock & Profit info
    const products = await prisma.product.findMany();
    const lowStock = products.filter((p) => p.stock <= p.reorderPoint);
    const deadStock = products.filter((p) => p.stock > 0); // Simplified for MVP (real dead stock needs sales history per item)

    // Calculate Total Inventory Value
    const totalInventoryValue = products.reduce(
      (sum, p) => sum + p.stock * p.costPrice,
      0
    );

    // Fetch Recent Sales (30 Days)
    const recentSales = await prisma.sale.findMany({
      where: {
        date: { gte: thirtyDaysAgo },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const totalRevenue30Days = recentSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalProfit30Days = recentSales.reduce((sum, s) => sum + s.totalProfit, 0);

    // Identify Best Sellers
    const productSales: { [key: string]: number } = {};
    recentSales.forEach((sale) => {
      sale.items.forEach((item) => {
        productSales[item.product.name] = (productSales[item.product.name] || 0) + item.quantity;
      });
    });

    const bestSellers = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, qty]) => `${name} (${qty} sold)`);

    // 2. Construct System Prompt
    const systemPrompt = `
      You are Ada, a proactive and friendly business advisor for a small retail store owner.
      You are NOT just a chatbot. You are a partner. Speak plainly, avoid jargon, and focus on PROFIT.

      Here is the REAL-TIME health snapshot of the business:

      ### 💰 30-Day Financials
      - Revenue: ₦${totalRevenue30Days.toLocaleString()}
      - Profit: ₦${totalProfit30Days.toLocaleString()}
      - Inventory Value: ₦${totalInventoryValue.toLocaleString()}

      ### 📉 Critical Attention Needed (Low Stock)
      ${lowStock.length > 0 ? lowStock.map((p) => `- ${p.name}: ${p.stock} left (Reorder at ${p.reorderPoint})`).join("\n") : "None! Stock is healthy."}

      ### 🏆 Best Sellers (Last 30 Days)
      ${bestSellers.length > 0 ? bestSellers.map((s) => `- ${s}`).join("\n") : "No significant sales details yet."}

      ### 💡 Your Guidelines
      1. **Be Actionable**: If profit is low, suggest selling high-margin items. If stock is low, remind them to reorder.
      2. **Be Empathetic**: Retail is hard. validatetheir hard work.
      3. **Keep it Short**: The user is busy. Don't write essays.
      4. **Context Aware**: Use the data above. If they ask "How am I doing?", quote the Revenue and Profit numbers.

      Answer the user's message now.
    `;

    // 3. Call OpenAI (GitHub Models)
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      model: modelName,
      temperature: 0.7, // Balance creativity and facts
    });

    return NextResponse.json({
      content: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Ada Error:", error);
    return NextResponse.json(
      { error: "Ada is taking a nap. Try again in a moment." },
      { status: 500 }
    );
  }
}
