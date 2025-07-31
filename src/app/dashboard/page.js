"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Link from "next/link";
import {
  Calendar,
  Star,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Settings,
  Bell,
  Plus,
  LogOut,
  User,
  Home,
  Search,
  Activity,
  Award,
  Sun,
  Moon,
} from "lucide-react";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("customer");
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (user) {
      setUserName(
        user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
      );
      setUserType(user.user_metadata?.user_type || "customer");
      console.log("Dashboard loaded for:", user.email);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const isProvider = userType === "provider";

  return (
    <ProtectedRoute>
      <div
        className={`min-h-screen bg-cover bg-center relative animate-fadeIn ${
          isDarkMode ? "bg-gray-950" : "bg-gray-100"
        }`}
        style={{
          backgroundImage: "url('/mountains.jpg')",
        }}
      >
        <div
          className={`absolute inset-0 ${
            isDarkMode ? "bg-black/60" : "bg-white/30"
          } z-0`}
        />

        <div className="relative z-10 w-full">
          <nav
            className={`sticky top-0 z-50 animate-slideUp ${
              isDarkMode
                ? "bg-black/30 border-white/10 backdrop-blur-xl"
                : "bg-white/20 border-white/30 shadow-lg backdrop-blur-3xl"
            } border`}
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
              <div className="flex justify-between h-20">
                <div className="flex items-center">
                  <Link
                    href="/"
                    className={`text-3xl font-bold animate-fadeInSlide ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    SkilLease
                  </Link>
                  <div className="ml-12 hidden md:flex items-baseline space-x-10">
                    <span
                      className={`font-semibold text-lg flex items-center animate-fadeInSlide delay-200 ${
                        isDarkMode ? "text-teal-300" : "text-teal-600"
                      }`}
                    >
                      {/* <Home
                        className={`h-5 w-5 mr-2 ${
                          isDarkMode ? "text-white/60" : "text-gray-500"
                        }`}
                      /> */}
                      {/* Dashboard */}
                    </span>
                    <Link
                      href="/services"
                      className={`transition-colors text-lg flex items-center animate-fadeInSlide delay-200 ${
                        isDarkMode
                          ? "text-white/70 hover:text-teal-300"
                          : "text-gray-600 hover:text-teal-600"
                      }`}
                    >
                      {/* <Search
                        className={`h-5 w-5 mr-2 ${
                          isDarkMode ? "text-white/60" : "text-gray-500"
                        }`}
                      /> */}
                      {/* Browse Services */}
                    </Link>
                    {isProvider && (
                      <Link
                        href="/provider-dashboard"
                        className={`transition-colors text-lg flex items-center animate-fadeInSlide delay-200 ${
                          isDarkMode
                            ? "text-white/70 hover:text-teal-300"
                            : "text-gray-600 hover:text-teal-600"
                        }`}
                      >
                        <TrendingUp
                          className={`h-5 w-5 mr-2 ${
                            isDarkMode ? "text-white/60" : "text-gray-500"
                          }`}
                        />
                        Provider View
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <button
                    className={`transition-colors animate-fadeInSlide delay-200 ${
                      isDarkMode
                        ? "text-white/60 hover:text-teal-300"
                        : "text-gray-600 hover:text-teal-600"
                    }`}
                  >
                    {/* <Bell className="h-7 w-7" /> */}
                  </button>
                  <button
                    className={`transition-colors animate-fadeInSlide delay-200 ${
                      isDarkMode
                        ? "text-white/60 hover:text-teal-300"
                        : "text-gray-600 hover:text-teal-600"
                    }`}
                  >
                    {/* <Settings className="h-7 w-7" /> */}
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-200/30 transition"
                    aria-label="Toggle theme"
                  >
                    {isDarkMode ? (
                      <Sun className="h-6 w-6 text-yellow-400" />
                    ) : (
                      <Moon className="h-6 w-6 text-gray-700" />
                    )}
                  </button>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div
                        className={`text-base font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {userName}
                      </div>
                      <div
                        className={`text-sm capitalize flex items-center ${
                          isDarkMode ? "text-white/70" : "text-gray-600"
                        }`}
                      >
                        <User
                          className={`h-4 w-4 mr-1 ${
                            isDarkMode ? "text-white/60" : "text-gray-500"
                          }`}
                        />
                        {userType}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`px-4 py-3 rounded-lg font-semibold transition-colors hover:scale-105 flex items-center animate-fadeInSlide delay-200 ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                          : "bg-white/30 border-white/40 text-gray-900 hover:bg-white/40 backdrop-blur-md"
                      } border`}
                    >
                      <LogOut
                        className={`h-5 w-5 mr-2 ${
                          isDarkMode ? "text-white/60" : "text-gray-500"
                        }`}
                      />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-10 px-6 sm:px-8 lg:px-10">
            <div className="mb-10">
              <div
                className={`rounded-2xl p-10 border shadow-2xl animate-slideUp ${
                  isDarkMode
                    ? "bg-black/30 border-white/10 backdrop-blur-xl text-white"
                    : "bg-white/20 border-white/30 shadow-lg backdrop-blur-3xl text-gray-900"
                }`}
              >
                <h1 className="text-5xl font-bold mb-6 animate-fadeInSlide">
                  🎉 Welcome, {userName}!
                </h1>
                <p
                  className={`text-xl mb-8 animate-fadeInSlide delay-200 ${
                    isDarkMode ? "text-white/70" : "text-gray-600"
                  }`}
                >
                  {isProvider
                    ? "🏢 Ready to manage your services and connect with customers!"
                    : "🔍 Discover amazing local services in your area!"}
                </p>
                <div className="flex flex-wrap gap-5">
                  <Link
                    href="/services"
                    className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 animate-fadeInSlide delay-200 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white"
                        : "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                    }`}
                  >
                    <span className="flex items-center">
                      <Plus className="h-6 w-6 mr-2 text-white/60" />
                      {isProvider ? "Add New Service" : "Book New Service"}
                    </span>
                  </Link>
                  {isProvider && (
                    <Link
                      href="/provider-dashboard"
                      className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 animate-fadeInSlide delay-200 ${
                        isDarkMode
                          ? "bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white"
                          : "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                      }`}
                    >
                      <span className="flex items-center">
                        <TrendingUp className="h-6 w-6 mr-2 text-white/60" />
                        Provider Dashboard
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-10">
              <div
                className={`border rounded-2xl p-6 animate-slideUp ${
                  isDarkMode
                    ? "bg-black/30 border-white/10 backdrop-blur-xl text-white"
                    : "bg-white/20 border-white/30 shadow-lg backdrop-blur-3xl text-gray-900"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-4 rounded-full ${
                      isDarkMode
                        ? "bg-white/10"
                        : "bg-white/30 backdrop-blur-md"
                    }`}
                  >
                    <Award
                      className={`h-9 w-9 ${
                        isDarkMode ? "text-teal-300" : "text-teal-600"
                      }`}
                    />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold animate-fadeInSlide">
                      Account Setup Complete! 🎉
                    </h3>
                    <p
                      className={`text-lg animate-fadeInSlide delay-200 ${
                        isDarkMode ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      Your SkilLease account is ready to use. Start exploring
                      local services or offer your own!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <div
                className={`rounded-2xl p-6 border shadow-2xl hover:scale-105 transition-transform animate-slideUp ${
                  isDarkMode
                    ? "bg-black/30 border-white/10 backdrop-blur-xl"
                    : "bg-white/20 border-white/30 backdrop-blur-3xl"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-5 rounded-lg ${
                      isDarkMode
                        ? "bg-white/10"
                        : "bg-white/30 backdrop-blur-md"
                    }`}
                  >
                    <Calendar
                      className={`h-9 w-9 ${
                        isDarkMode ? "text-teal-300" : "text-teal-600"
                      }`}
                    />
                  </div>
                  <div className="ml-6">
                    <p
                      className={`text-base font-semibold ${
                        isDarkMode ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      {isProvider ? "Services Offered" : "Total Bookings"}
                    </p>
                    <p
                      className={`text-4xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      0
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-teal-300" : "text-teal-600"
                      }`}
                    >
                      Ready to start!
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-2xl p-6 border shadow-2xl hover:scale-105 transition-transform animate-slideUp ${
                  isDarkMode
                    ? "bg-black/30 border-white/10 backdrop-blur-xl"
                    : "bg-white/20 border-white/30 backdrop-blur-3xl"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-5 rounded-lg ${
                      isDarkMode
                        ? "bg-white/10"
                        : "bg-white/30 backdrop-blur-md"
                    }`}
                  >
                    <Clock
                      className={`h-9 w-9 ${
                        isDarkMode ? "text-teal-300" : "text-teal-600"
                      }`}
                    />
                  </div>
                  <div className="ml-6">
                    <p
                      className={`text-base font-semibold ${
                        isDarkMode ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      {isProvider ? "Pending Requests" : "Pending Bookings"}
                    </p>
                    <p
                      className={`text-4xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      0
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-teal-300" : "text-teal-600"
                      }`}
                    >
                      All caught up!
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-2xl p-6 border shadow-2xl hover:scale-105 transition-transform animate-slideUp ${
                  isDarkMode
                    ? "bg-black/30 border-white/10 backdrop-blur-xl"
                    : "bg-white/20 border-white/30 backdrop-blur-3xl"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-5 rounded-lg ${
                      isDarkMode
                        ? "bg-white/10"
                        : "bg-white/30 backdrop-blur-md"
                    }`}
                  >
                    <Star
                      className={`h-9 w-9 ${
                        isDarkMode ? "text-teal-300" : "text-teal-600"
                      }`}
                    />
                  </div>
                  <div className="ml-6">
                    <p
                      className={`text-base font-semibold ${
                        isDarkMode ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      {isProvider ? "Avg Rating" : "Reviews Given"}
                    </p>
                    <p
                      className={`text-4xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {isProvider ? "5.0" : "0"}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-teal-300" : "text-teal-600"
                      }`}
                    >
                      {isProvider ? "Perfect start!" : "Share your experience!"}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-2xl p-6 border shadow-2xl hover:scale-105 transition-transform animate-slideUp ${
                  isDarkMode
                    ? "bg-black/30 border-white/10 backdrop-blur-xl"
                    : "bg-white/20 border-white/30 backdrop-blur-3xl"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-5 rounded-lg ${
                      isDarkMode
                        ? "bg-white/10"
                        : "bg-white/30 backdrop-blur-md"
                    }`}
                  >
                    <DollarSign
                      className={`h-9 w-9 ${
                        isDarkMode ? "text-teal-300" : "text-teal-600"
                      }`}
                    />
                  </div>
                  <div className="ml-6">
                    <p
                      className={`text-base font-semibold ${
                        isDarkMode ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      {isProvider ? "Total Earnings" : "Total Spent"}
                    </p>
                    <p
                      className={`text-4xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ₹0
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-teal-300" : "text-teal-600"
                      }`}
                    >
                      Let's get started!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div
                className={`rounded-2xl shadow-2xl border p-6 animate-slideUp ${
                  isDarkMode
                    ? "bg-black/30 border-white/10 backdrop-blur-xl"
                    : "bg-white/20 border-white/30 backdrop-blur-3xl"
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-8 flex items-center animate-fadeInSlide ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Activity
                    className={`h-7 w-7 mr-3 ${
                      isDarkMode ? "text-teal-300" : "text-teal-600"
                    }`}
                  />
                  Quick Actions
                </h3>
                <div className="space-y-6">
                  <Link
                    href="/services"
                    className={`w-full flex items-center justify-between px-8 py-5 rounded-lg font-semibold text-xl transition-all duration-300 hover:scale-105 animate-fadeInSlide delay-200 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white"
                        : "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                    }`}
                  >
                    <span className="flex items-center">
                      <Plus className="h-6 w-6 mr-2 text-white/60" />
                      {isProvider
                        ? "Add Your First Service"
                        : "Book Your First Service"}
                    </span>
                    <span className="text-white/70 text-lg">→</span>
                  </Link>

                  <Link
                    href="/services"
                    className={`w-full flex items-center justify-between px-8 py-5 rounded-lg font-semibold text-xl transition-colors border hover:scale-105 animate-fadeInSlide delay-200 ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                        : "bg-white/30 border-white/40 text-gray-900 hover:bg-white/40 backdrop-blur-md"
                    }`}
                  >
                    <span className="flex items-center">
                      <Search
                        className={`h-6 w-6 mr-2 ${
                          isDarkMode ? "text-white/60" : "text-gray-500"
                        }`}
                      />
                      Browse All Services
                    </span>
                    <span
                      className={`text-lg ${
                        isDarkMode ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      →
                    </span>
                  </Link>

                  {isProvider && (
                    <Link
                      href="/provider-dashboard"
                      className={`w-full flex items-center justify-between px-8 py-5 rounded-lg font-semibold text-xl transition-colors border hover:scale-105 animate-fadeInSlide delay-200 ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                          : "bg-white/30 border-white/40 text-gray-900 hover:bg-white/40 backdrop-blur-md"
                      }`}
                    >
                      <span className="flex items-center">
                        <TrendingUp
                          className={`h-6 w-6 mr-2 ${
                            isDarkMode ? "text-white/60" : "text-gray-500"
                          }`}
                        />
                        Go to Provider Dashboard
                      </span>
                      <span
                        className={`text-lg ${
                          isDarkMode ? "text-white/70" : "text-gray-600"
                        }`}
                      >
                        →
                      </span>
                    </Link>
                  )}
                </div>
              </div>

              <div
                className={`rounded-2xl shadow-2xl border p-6 animate-slideUp ${
                  isDarkMode
                    ? "bg-black/30 border-white/10 backdrop-blur-xl"
                    : "bg-white/20 border-white/30 backdrop-blur-3xl"
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-8 animate-fadeInSlide ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Getting Started
                </h3>
                <div className="space-y-6">
                  {isProvider ? (
                    <>
                      <div className="flex items-start space-x-4 animate-fadeInSlide delay-200">
                        <div
                          className={`rounded-full p-3 text-base font-bold ${
                            isDarkMode
                              ? "bg-white/10 text-teal-300"
                              : "bg-white/30 text-teal-600 backdrop-blur-md"
                          }`}
                        >
                          1
                        </div>
                        <div>
                          <h4
                            className={`font-semibold text-lg ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Create Your Services
                          </h4>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-white/70" : "text-gray-600"
                            }`}
                          >
                            Add the services you want to offer to customers
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 animate-fadeInSlide delay-200">
                        <div
                          className={`rounded-full p-3 text-base font-bold ${
                            isDarkMode
                              ? "bg-white/10 text-teal-300"
                              : "bg-white/30 text-teal-600 backdrop-blur-md"
                          }`}
                        >
                          2
                        </div>
                        <div>
                          <h4
                            className={`font-semibold text-lg ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Get Bookings
                          </h4>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-white/70" : "text-gray-600"
                            }`}
                          >
                            Customers will find and book your services
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 animate-fadeInSlide delay-200">
                        <div
                          className={`rounded-full p-3 text-base font-bold ${
                            isDarkMode
                              ? "bg-white/10 text-teal-300"
                              : "bg-white/30 text-teal-600 backdrop-blur-md"
                          }`}
                        >
                          3
                        </div>
                        <div>
                          <h4
                            className={`font-semibold text-lg ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Track Earnings
                          </h4>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-white/70" : "text-gray-600"
                            }`}
                          >
                            Monitor your bookings and grow your business
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start space-x-4 animate-fadeInSlide delay-200">
                        <div
                          className={`rounded-full p-3 text-base font-bold ${
                            isDarkMode
                              ? "bg-white/10 text-teal-300"
                              : "bg-white/30 text-teal-600 backdrop-blur-md"
                          }`}
                        >
                          1
                        </div>
                        <div>
                          <h4
                            className={`font-semibold text-lg ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Browse Services
                          </h4>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-white/70" : "text-gray-600"
                            }`}
                          >
                            Find local providers for any service you need
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 animate-fadeInSlide delay-200">
                        <div
                          className={`rounded-full p-3 text-base font-bold ${
                            isDarkMode
                              ? "bg-white/10 text-teal-300"
                              : "bg-white/30 text-teal-600 backdrop-blur-md"
                          }`}
                        >
                          2
                        </div>
                        <div>
                          <h4
                            className={`font-semibold text-lg ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Book Instantly
                          </h4>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-white/70" : "text-gray-600"
                            }`}
                          >
                            Choose your preferred time and book with one click
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 animate-fadeInSlide delay-200">
                        <div
                          className={`rounded-full p-3 text-base font-bold ${
                            isDarkMode
                              ? "bg-white/10 text-teal-300"
                              : "bg-white/30 text-teal-600 backdrop-blur-md"
                          }`}
                        >
                          3
                        </div>
                        <div>
                          <h4
                            className={`font-semibold text-lg ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Leave Reviews
                          </h4>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-white/70" : "text-gray-600"
                            }`}
                          >
                            Help others by sharing your experience
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`rounded-2xl shadow-2xl border p-12 text-center animate-slideUp ${
                isDarkMode
                  ? "bg-black/30 border-white/10 backdrop-blur-xl"
                  : "bg-white/20 border-white/30 backdrop-blur-3xl"
              }`}
            >
              <div className="text-7xl mb-6 animate-fadeInSlide">
                {isProvider ? "🏢" : "🛍️"}
              </div>
              <h3
                className={`text-3xl font-bold mb-6 animate-fadeInSlide ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {isProvider
                  ? "Ready to Start Your Business!"
                  : "Ready to Discover Services!"}
              </h3>
              <p
                className={`text-xl mb-10 animate-fadeInSlide delay-200 ${
                  isDarkMode ? "text-white/70" : "text-gray-600"
                }`}
              >
                {isProvider
                  ? "Your journey as a service provider begins here. Add your first service and start connecting with customers!"
                  : "Explore hundreds of local services in your area. From home repairs to tutoring, find exactly what you need!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/services"
                  className={`inline-flex items-center px-10 py-5 rounded-lg font-semibold text-xl transition-all duration-300 hover:scale-105 animate-fadeInSlide delay-200 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white"
                      : "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                  }`}
                >
                  <span className="flex items-center">
                    <Plus className="h-6 w-6 mr-2 text-white/60" />
                    {isProvider ? "Add Your First Service" : "Browse Services"}
                  </span>
                </Link>
                {isProvider && (
                  <Link
                    href="/provider-dashboard"
                    className={`inline-flex items-center px-10 py-5 rounded-lg font-semibold text-xl transition-colors border hover:scale-105 animate-fadeInSlide delay-200 ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                        : "bg-white/30 border-white/40 text-gray-900 hover:bg-white/40 backdrop-blur-md"
                    }`}
                  >
                    <span className="flex items-center">
                      <TrendingUp
                        className={`h-6 w-6 mr-2 ${
                          isDarkMode ? "text-white/60" : "text-gray-500"
                        }`}
                      />
                      Provider Dashboard
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </main>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease-in-out;
          }

          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-slideUp {
            animation: slideUp 0.8s ease-out;
          }

          @keyframes fadeInSlide {
            from {
              transform: translateY(10px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-fadeInSlide {
            animation: fadeInSlide 0.6s ease-out;
          }

          @keyframes bounceOnce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
          .animate-bounceOnce {
            animation: bounceOnce 0.3s ease-out;
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
          }
          .animate-pulse {
            animation: pulse 1s infinite;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}
