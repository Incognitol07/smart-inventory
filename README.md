# Smart Inventory

You know the Madam Sikirat at the corner selling biscuits and pure water? She's been in that same kiosk since you were in primary school. You'll graduate, get a job, and she'll probably still be there. Most small businesses in Nigeria are like this: not growing, just surviving. 79% still track sales with paper or memory. They lose money and don't even notice.

This is inventory software built for them.

## Features

- Track products, record sales, see your profit
- Smart alerts: Warns you before you run out of something, based on how fast it's selling
- Budget optimizer: "I have ₦100k, what should I stock?" and it tells you what to stock on to get MAX profit
- Ada: AI you can ask questions about your sales and inventory

## Tech Stack

- Framework: Next.js 16 (App Router)
- Database: PostgreSQL with Prisma ORM
- Auth: NextAuth.js
- Styling: Tailwind CSS
- AI: OpenAI GPT-4o via GitHub Models

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub token (for AI features)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Incognitol07/smart-inventory.git
   cd smart-inventory
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in the following:

   ```
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GITHUB_TOKEN="your-github-token"
   ```

4. Set up the database:

   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
smart-inventory/
├── app/
│   ├── api/           # API routes (auth, products, sales, ada)
│   ├── components/    # React components
│   ├── dashboard/     # Dashboard pages
│   └── database/      # Prisma client
├── prisma/
│   └── schema.prisma  # Database schema
└── public/            # Static assets
```

## License

MIT
