import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center py-20 px-6 max-w-6xl mx-auto gap-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-bold text-deep-forest mb-4">
            Inventory management in plain English
          </h1>
          <p className="text-xl text-deep-forest/80">
            Get told what to restock, what&apos;s selling, and what&apos;s
            losing you money.
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="/hero-image.png"
            alt="SmartInventory Dashboard"
            width={320}
            height={480}
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>
    </div>
  );
}
