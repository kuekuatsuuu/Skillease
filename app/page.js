"use client";

import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import {
  Search,
  Star,
  Clock,
  Shield,
  Users,
  Zap,
  ArrowRight,
  MapPin,
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  const categories = [
    {
      name: "Electricians",
      icon: "⚡",
      count: "150+",
      color: "from-yellow-400 to-orange-500",
    },
    {
      name: "Plumbers",
      icon: "🔧",
      count: "120+",
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "Tutors",
      icon: "📚",
      count: "200+",
      color: "from-green-400 to-green-600",
    },
    {
      name: "Cleaners",
      icon: "🧹",
      count: "180+",
      color: "from-purple-400 to-purple-600",
    },
    {
      name: "Fitness Trainers",
      icon: "💪",
      count: "90+",
      color: "from-red-400 to-red-600",
    },
    {
      name: "Photographers",
      icon: "📸",
      count: "75+",
      color: "from-pink-400 to-pink-600",
    },
  ];

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-teal-200" />,
      title: "Location-Based Matching",
      description: "Find services near you with real-time distance tracking",
      gradient: "from-teal-100/20 to-teal-50/20",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-200" />,
      title: "Verified Providers",
      description: "All service providers are background-checked and verified",
      gradient: "from-green-100/20 to-green-50/20",
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-200" />,
      title: "Real Reviews & Ratings",
      description: "Authentic reviews from real customers to help you decide",
      gradient: "from-yellow-100/20 to-yellow-50/20",
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-200" />,
      title: "Instant Booking",
      description: "Book services instantly with real-time availability",
      gradient: "from-purple-100/20 to-purple-50/20",
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/mountains.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10 min-h-screen">
        {/* Navigation */}
        <nav className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-3xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  SkilLease
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="/services"
                  className="text-white/80 hover:text-teal-200 font-medium transition-colors"
                >
                  Browse Services
                </Link>
                <Link
                  href="/provider-dashboard"
                  className="text-white/80 hover:text-teal-200 font-medium transition-colors"
                >
                  For Providers
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-white/80">
                      Hi, {user.email?.split("@")[0]}!
                    </span>
                    <Link
                      href="/dashboard"
                      className="bg-gradient-to-r from-teal-300 to-cyan-400 hover:from-teal-200 hover:to-cyan-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/login"
                      className="text-white/80 hover:text-teal-200 font-medium transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-gradient-to-r from-teal-300 to-cyan-400 hover:from-teal-200 hover:to-cyan-300 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center bg-white/20 backdrop-blur-xl border border-white/30 shadow-3xl rounded-2xl p-10">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Find Local Services
                <span className="block bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Near You
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl mx-auto">
                Connect with trusted local service providers. From electricians
                to tutors, find the perfect professional with real-time location
                tracking.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-12">
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/60 h-6 w-6 group-focus-within:text-teal-200 transition-colors" />
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    className="w-full pl-16 pr-6 py-5 text-lg bg-white/10 text-white rounded-2xl border border-white/30 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all duration-300"
                  />
                  <Link
                    href="/services"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-teal-300 to-cyan-400 hover:from-teal-200 hover:to-cyan-300 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center"
                  >
                    Search
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/services"
                  className="group bg-white/20 hover:bg-white/30 text-teal-200 px-8 py-4 rounded-2xl font-semibold border-2 border-teal-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center"
                >
                  <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Browse Services
                </Link>
                <Link
                  href="/provider-dashboard"
                  className="group bg-gradient-to-r from-teal-300 to-cyan-400 hover:from-teal-200 hover:to-cyan-300 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center"
                >
                  <Users className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Become a Provider
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center bg-white/20 backdrop-blur-xl border border-white/30 shadow-3xl rounded-2xl p-8 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Popular Categories
              </h2>
              <p className="text-xl text-white/80">
                Discover services across different categories
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href="/services"
                  className="group relative bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-3xl hover:shadow-2xl transition-all duration-500 border border-white/30 hover:border-transparent transform hover:-translate-y-4 overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  <div className="relative z-10">
                    <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-200 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-white/80 mb-6 text-lg">
                      {category.count} providers available
                    </p>
                    <div className="flex items-center text-teal-200 font-semibold group-hover:text-teal-100 transition-colors">
                      <span>Explore services</span>
                      <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center bg-white/20 backdrop-blur-xl border border-white/30 shadow-3xl rounded-2xl p-8 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose LocalConnect?
              </h2>
              <p className="text-xl text-white/80">
                Built for the modern local service economy
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group text-center bg-white/20 backdrop-blur-xl rounded-3xl shadow-3xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-8 border border-white/30"
                >
                  <div
                    className={`bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center bg-white/20 backdrop-blur-xl border border-white/30 shadow-3xl rounded-2xl p-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                Join thousands of customers and providers already using
                LocalConnect to grow their business and find amazing services
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/services"
                  className="group bg-white/20 hover:bg-white/30 text-teal-200 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center"
                >
                  <Search className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                  Find Services Now
                </Link>
                <Link
                  href="/provider-dashboard"
                  className="group bg-gradient-to-r from-teal-300 to-cyan-400 hover:from-teal-200 hover:to-cyan-300 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center"
                >
                  <Users className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                  Start Earning Today
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  SkilLease
                </div>
                <p className="text-gray-400">
                  Connecting communities, one service at a time. The future of
                  local services is here.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">For Customers</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      href="/services"
                      className="hover:text-white transition-colors"
                    >
                      Browse Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="hover:text-white transition-colors"
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">For Providers</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      href="/provider-dashboard"
                      className="hover:text-white transition-colors"
                    >
                      Provider Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="hover:text-white transition-colors"
                    >
                      Join as Provider
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-400">
                ©️ 2025 SkilLease. Built with ❤️ for connecting communities.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
