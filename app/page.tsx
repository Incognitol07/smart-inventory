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
            alt="A happy customer"
            width={320}
            height={480}
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16" >
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-deep-forest mb-12 text-center">
            Why small retailers love us
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gray-600 mb-4">Without SmartInventory</h3>
              <ul className="text-gray-600 space-y-2">
                <li>Confusing spreadsheets that take hours to update</li>
                <li>Running out of stock on your best sellers</li>
                <li>Not knowing which items are losing money</li>
                <li>Guessing when to reorder supplies</li>
              </ul>
            </div>
            <div className="bg-granny-green/10 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-deep-forest mb-4">With SmartInventory</h3>
              <ul className="text-deep-forest space-y-2">
                <li>Clear insights in plain English</li>
                <li>Alerts before you run out of popular items</li>
                <li>Know exactly what&apos;s profitable and what&apos;s not</li>
                <li>Get daily guidance on what to do next</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
