"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Please enter your email"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (activeTab === "signup") {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match"
      }
      if (!formData.businessName) {
        newErrors.businessName = "Please enter your business name"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log(`${activeTab} attempt:`, formData)
    setIsLoading(false)
    setSuccess(true)

    // Reset success after 3 seconds
    setTimeout(() => setSuccess(false), 3000)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <Link href="/" className="inline-flex items-center text-deep-forest hover:text-granny-green transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.h1
              className="text-3xl font-bold text-deep-forest mb-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              SmartInventory
            </motion.h1>
            <p className="text-deep-forest/70">Your inventory, simplified</p>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === "login"
                  ? "bg-granny-green text-deep-forest"
                  : "text-deep-forest/60 hover:text-deep-forest"
              }`}
            >
              Welcome Back
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === "signup"
                  ? "bg-granny-green text-deep-forest"
                  : "text-deep-forest/60 hover:text-deep-forest"
              }`}
            >
              Get Started
            </button>
          </div>

          {/* Form */}
          <motion.form
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-deep-forest mb-2">
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green transition-colors ${
                  errors.email ? "border-red-500" : "border-deep-forest/20"
                }`}
                placeholder="you@yourstore.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {activeTab === "signup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="businessName" className="block text-sm font-medium text-deep-forest mb-2">
                  Business name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green transition-colors ${
                    errors.businessName ? "border-red-500" : "border-deep-forest/20"
                  }`}
                  placeholder="Your Store Name"
                />
                {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
              </motion.div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-deep-forest mb-2">
                Your password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green transition-colors ${
                    errors.password ? "border-red-500" : "border-deep-forest/20"
                  }`}
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-deep-forest/60 hover:text-deep-forest"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {activeTab === "signup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-deep-forest mb-2">
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-granny-green transition-colors ${
                    errors.confirmPassword ? "border-red-500" : "border-deep-forest/20"
                  }`}
                  placeholder="Repeat your password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              type="submit"
              className="w-full bg-granny-green text-deep-forest py-3 px-6 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-deep-forest border-t-transparent rounded-full animate-spin"></div>
                  {activeTab === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : success ? (
                <>
                  <CheckCircle size={20} />
                  {activeTab === "login" ? "Welcome back!" : "Account created!"}
                </>
              ) : activeTab === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </motion.button>

            {activeTab === "login" && (
              <div className="text-center">
                <a href="#" className="text-sm text-deep-forest/60 hover:text-deep-forest transition-colors">
                  Need help with your password?
                </a>
              </div>
            )}
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center mt-8 text-sm text-deep-forest/60"
          >
            <p>&copy; 2025 SmartInventory. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
