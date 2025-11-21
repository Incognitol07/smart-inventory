"use client";

import {
  ArrowRight,
  BarChart3,
  AlertCircle,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [stats, setStats] = useState([
    { value: 0, target: 2500, prefix: "", suffix: "+" },
    { value: 0, target: 2100000, prefix: "$", suffix: "" },
    { value: 0, target: 15, prefix: "", suffix: " hrs" },
  ]);

  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const interval = setInterval(() => {
            setStats((prev) =>
              prev.map((stat) => {
                if (stat.value < stat.target) {
                  const increment = Math.ceil(stat.target / 100);
                  return {
                    ...stat,
                    value: Math.min(stat.value + increment, stat.target),
                  };
                }
                return stat;
              })
            );
          }, 50);
          return () => clearInterval(interval);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatStat = (value: number, prefix: string, suffix: string) => {
    if (value >= 1000000) {
      return `${prefix}${(value / 1000000).toFixed(1)}M${suffix}`;
    }
    return `${prefix}${value.toLocaleString()}${suffix}`;
  };

  return (
    <div className="min-h-screen bg-cream text-deep-forest">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-deep-forest/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-deep-forest">
            SmartInventory
          </div>
          <button className="bg-granny-green text-deep-forest px-6 py-2 rounded-full font-semibold hover:bg-granny-green/90 transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-bold text-deep-forest mb-6 leading-tight">
                Your finances in plain English
              </h1>
              <p className="text-xl text-deep-forest/70 mb-8 max-w-xl leading-relaxed">
                Stop losing money to confusion. Get clear insights on
                what&apos;s selling, what&apos;s costing you, and exactly what
                to do next—without the jargon or expensive accountants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-deep-forest text-cream px-8 py-4 rounded-full font-bold text-lg hover:bg-deep-forest/90 transition flex items-center justify-center gap-2">
                  Start Now <ArrowRight size={20} />
                </button>
                <button className="border-2 border-deep-forest text-deep-forest px-8 py-4 rounded-full font-bold text-lg hover:bg-deep-forest/5 transition">
                  Login
                </button>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <Image
                src="/hero-image.png"
                alt="An happy customer"
                width={710}
                height={1110}
                className="w-full max-w-md h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

        {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-6 ">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-granny-green mb-2">
                {formatStat(stats[0].value, stats[0].prefix, stats[0].suffix)}
              </div>
              <p className="text-deep-forest/70">
                Small businesses using SmartInventory
              </p>
            </div>
            <div>
              <div className="text-5xl font-bold text-granny-green mb-2">
                {formatStat(stats[1].value, stats[1].prefix, stats[1].suffix)}
              </div>
              <p className="text-deep-forest/70">
                Money saved by our users yearly
              </p>
            </div>
            <div>
              <div className="text-5xl font-bold text-granny-green mb-2">
                {formatStat(stats[2].value, stats[2].prefix, stats[2].suffix)}
              </div>
              <p className="text-deep-forest/70">
                Time saved per month per user
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-deep-forest">
            The problem most small businesses face
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Without */}
            <div className=" p-8 rounded-2xl border border-deep-forest/10">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle size={28} className="text-deep-forest/60" />
                <h3 className="text-2xl font-bold text-deep-forest">
                  Without SmartInventory
                </h3>
              </div>
              <ul className="space-y-4 text-deep-forest/80">
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">×</span>
                  <span>Hours spent on confusing spreadsheets</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">×</span>
                  <span>Running out of stock on bestsellers</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">×</span>
                  <span>Hidden money leaks you never see</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">×</span>
                  <span>Hiring expensive accountants who use jargon</span>
                </li>
              </ul>
            </div>

            {/* With */}
            <div className="bg-granny-green/10 p-8 rounded-2xl border-2 border-granny-green/40">
              <div className="flex items-center gap-3 mb-6">
                <Zap size={28} className="text-granny-green" />
                <h3 className="text-2xl font-bold text-deep-forest">
                  With SmartInventory
                </h3>
              </div>
              <ul className="space-y-4 text-deep-forest">
                <li className="flex gap-3">
                  <span className="text-granny-green font-bold">✓</span>
                  <span>One-click answers to your business questions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-granny-green font-bold">✓</span>
                  <span>Smart alerts before you run out</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-granny-green font-bold">✓</span>
                  <span>See exactly which items are losing money</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-granny-green font-bold">✓</span>
                  <span>Daily guidance written in plain English</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-deep-forest">
            Everything you need to take control
          </h2>
          <p className="text-center text-deep-forest/70 text-lg mb-16 max-w-2xl mx-auto">
            Designed specifically for small retailers who want to understand
            their business without hiring help
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl border border-deep-forest/10 hover:border-granny-green/40 transition">
              <div className="w-14 h-14 bg-granny-green/20 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 size={28} className="text-granny-green" />
              </div>
              <h3 className="text-xl font-bold text-deep-forest mb-3">
                Real-time Dashboard
              </h3>
              <p className="text-deep-forest/70">
                See your inventory and finances at a glance. No reports to
                generate, just instant clarity on what matters.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl border border-deep-forest/10 hover:border-granny-green/40 transition">
              <div className="w-14 h-14 bg-granny-green/20 rounded-lg flex items-center justify-center mb-6">
                <AlertCircle size={28} className="text-granny-green" />
              </div>
              <h3 className="text-xl font-bold text-deep-forest mb-3">
                Smart Alerts
              </h3>
              <p className="text-deep-forest/70">
                Get notified before you run out of stock on bestsellers. Never
                miss a selling opportunity again.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl border border-deep-forest/10 hover:border-granny-green/40 transition">
              <div className="w-14 h-14 bg-granny-green/20 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp size={28} className="text-granny-green" />
              </div>
              <h3 className="text-xl font-bold text-deep-forest mb-3">
                Profit Insights
              </h3>
              <p className="text-deep-forest/70">
                Know exactly which items are making you money and which are
                draining it. Simple, honest analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

    

      {/* CTA Section */}
      <section
        id="cta"
        className="py-24 px-6 bg-linear-to-br from-deep-forest to-deep-forest/90 text-cream"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to simplify your inventory?
          </h2>
          <p className="text-xl text-cream/80 mb-8 max-w-2xl mx-auto">
            Join thousands of small retailers who finally understand their
            finances
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-granny-green text-deep-forest px-10 py-4 rounded-full font-bold text-lg hover:bg-granny-green/90 transition flex items-center justify-center gap-2">
              Start Now for Free
              <ArrowRight size={20} />
            </button>
            <button className="border-2 border-cream text-cream px-10 py-4 rounded-full font-bold text-lg hover:bg-cream/10 transition">
              Login
            </button>
          </div>
        </div>
        <div className="pt-8 text-center text-cream/60 text-sm">
          <p>&copy; 2025 SmartInventory. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
}
