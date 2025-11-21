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
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const [stats, setStats] = useState([
    { value: 0, target: 2500, prefix: "", suffix: "+" },
    { value: 0, target: 2100000, prefix: "$", suffix: "" },
    { value: 0, target: 15, prefix: "", suffix: " hrs" },
  ]);

  const statsRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 300], [0, 100]);

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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="min-h-screen bg-cream text-deep-forest">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-deep-forest/10"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <motion.div
            className="text-xl md:text-2xl font-bold text-deep-forest"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            SmartInventory
          </motion.div>
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(168, 224, 99, 0.8)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-granny-green text-deep-forest px-4 md:px-6 py-2 rounded-full font-semibold text-sm md:text-base transition"
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY }}
        className="relative py-12 md:py-24 px-4 md:px-6 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.h1
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-deep-forest mb-4 md:mb-6 leading-tight"
              >
                Your inventory in plain English
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg md:text-xl text-deep-forest/70 mb-6 md:mb-8 max-w-xl leading-relaxed"
              >
                Stop losing money to confusion. Get clear insights on
                what&apos;s selling, what&apos;s costing you, and exactly what
                to do next—without the jargon or expensive accountants.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-deep-forest text-cream px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition flex items-center justify-center gap-2"
                >
                  Start Now <ArrowRight size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-deep-forest text-deep-forest px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition"
                >
                  Login
                </motion.button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center lg:justify-end mt-8 lg:mt-0"
            >
              <motion.div
                whileHover={{ scale: 1.02, rotateX: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/hero-image.png"
                  alt="An happy customer"
                  width={710}
                  height={1110}
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-2xl shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        ref={statsRef}
        className="py-20 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div variants={scaleIn} transition={{ duration: 0.5 }}>
              <motion.div
                className="text-5xl font-bold text-granny-green mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {formatStat(stats[0].value, stats[0].prefix, stats[0].suffix)}
              </motion.div>
              <p className="text-deep-forest/70">
                Small businesses using SmartInventory
              </p>
            </motion.div>
            <motion.div
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div
                className="text-5xl font-bold text-granny-green mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {formatStat(stats[1].value, stats[1].prefix, stats[1].suffix)}
              </motion.div>
              <p className="text-deep-forest/70">
                Money saved by our users yearly
              </p>
            </motion.div>
            <motion.div
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="text-5xl font-bold text-granny-green mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {formatStat(stats[2].value, stats[2].prefix, stats[2].suffix)}
              </motion.div>
              <p className="text-deep-forest/70">
                Time saved per month per user
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Problem Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-4xl font-bold text-center mb-16 text-deep-forest"
          >
            The problem most small businesses face
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-2xl border border-deep-forest/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle size={28} className="text-deep-forest/60" />
                <h3 className="text-2xl font-bold text-deep-forest">
                  Without SmartInventory
                </h3>
              </div>
              <motion.ul
                className="space-y-4 text-deep-forest/80"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  "Hours spent on confusing spreadsheets",
                  "Running out of stock on bestsellers",
                  "Hidden money leaks you never see",
                  "Hiring expensive accountants who use jargon",
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    variants={fadeInUp}
                    className="flex gap-3"
                  >
                    <span className="text-red-500 font-bold">×</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-granny-green/10 p-8 rounded-2xl border-2 border-granny-green/40"
            >
              <div className="flex items-center gap-3 mb-6">
                <Zap size={28} className="text-granny-green" />
                <h3 className="text-2xl font-bold text-deep-forest">
                  With SmartInventory
                </h3>
              </div>
              <motion.ul
                className="space-y-4 text-deep-forest"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  "One-click answers to your business questions",
                  "Smart alerts before you run out",
                  "See exactly which items are losing money",
                  "Daily guidance written in plain English",
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    variants={fadeInUp}
                    className="flex gap-3"
                  >
                    <span className="text-granny-green font-bold">✓</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            style={{ opacity: 0, transform: "translateY(20px)" }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-4xl font-bold text-center mb-4 text-deep-forest"
          >
            Everything you need to take control
          </motion.h2>
          <motion.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            style={{ opacity: 0, transform: "translateY(20px)" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center text-deep-forest/70 text-lg mb-16 max-w-2xl mx-auto"
          >
            Designed specifically for small retailers who want to understand
            their business without hiring help
          </motion.p>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={false}
            whileInView={{ opacity: 1 }}
            style={{ opacity: 0 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              {
                icon: BarChart3,
                title: "Real-time Dashboard",
                desc: "See your inventory and finances at a glance. No reports to generate, just instant clarity on what matters.",
              },
              {
                icon: AlertCircle,
                title: "Smart Alerts",
                desc: "Get notified before you run out of stock on bestsellers. Never miss a selling opportunity again.",
              },
              {
                icon: TrendingUp,
                title: "Profit Insights",
                desc: "Know exactly which items are making you money and which are draining it. Simple, honest analysis.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={false}
                whileInView={{ opacity: 1, scale: 1 }}
                style={{ opacity: 0, transform: "scale(0.95)" }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  y: -10,
                }}
                className="bg-white p-8 rounded-xl border border-deep-forest/10 transition"
              >
                <motion.div
                  className="w-14 h-14 bg-granny-green/20 rounded-lg flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <feature.icon size={28} className="text-granny-green" />
                </motion.div>
                <h3 className="text-xl font-bold text-deep-forest mb-3">
                  {feature.title}
                </h3>
                <p className="text-deep-forest/70">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={false}
        whileInView={{ opacity: 1 }}
        style={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
        id="cta"
        className="py-24 px-6 bg-linear-to-br from-deep-forest to-deep-forest/90 text-cream"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            style={{ opacity: 0, transform: "translateY(20px)" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Ready to simplify your inventory?
          </motion.h2>
          <motion.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            style={{ opacity: 0, transform: "translateY(20px)" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-cream/80 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of small retailers who finally understand their
            finances
          </motion.p>
          <motion.div
            initial={false}
            whileInView={{ opacity: 1 }}
            style={{ opacity: 0 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              style={{ opacity: 0, transform: "translateY(20px)" }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-granny-green text-deep-forest px-10 py-4 rounded-full font-bold text-lg transition flex items-center justify-center gap-2"
            >
              Start Now for Free
              <ArrowRight size={20} />
            </motion.button>
            <motion.button
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              style={{ opacity: 0, transform: "translateY(20px)" }}
              transition={{ duration: 0.6, delay: 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-cream text-cream px-10 py-4 rounded-full font-bold text-lg transition"
            >
              Login
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.section
        initial={false}
        whileInView={{ opacity: 1 }}
        style={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
        className="py-12 px-4 md:px-6 bg-cream border-t border-deep-forest/10"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            style={{ opacity: 0, transform: "translateY(20px)" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-deep-forest">
              SmartInventory
            </h2>
          </motion.div>
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            style={{ opacity: 0, transform: "translateY(20px)" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-deep-forest/60 text-sm"
          >
            <p>&copy; 2025 SmartInventory. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
