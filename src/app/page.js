"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

// Mobile search bar component
function MobileSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const q = query.trim();
    router.push(q ? `/services?search=${encodeURIComponent(q)}` : "/services");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative group sm:hidden">
      <input
        type="text"
        placeholder="Search services..."
        className="w-full pl-12 pr-4 py-4 text-base bg-white/10 text-white rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all duration-300"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        aria-label="Search"
        onClick={handleSearch}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-teal-300 h-5 w-5 p-0 m-0 bg-transparent border-none"
        tabIndex={-1}
      >
        <Search className="h-5 w-5 pointer-events-none" />
      </button>
    </div>
  );
}

// Desktop search bar component
function DesktopSearch() {
  const [query, setQuery] = useState("");
  return (
    <div className="relative group hidden sm:block">
      <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/60 h-6 w-6 group-focus-within:text-teal-300 transition-colors" />
      <input
        type="text"
        placeholder="What service do you need?"
        className="w-full pl-16 pr-6 py-5 text-lg bg-white/10 text-white rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all duration-300"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            window.location.href = query.trim()
              ? `/services?search=${encodeURIComponent(query.trim())}`
              : "/services";
          }
        }}
      />
      <Link
        href={
          query.trim()
            ? `/services?search=${encodeURIComponent(query.trim())}`
            : "/services"
        }
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center"
      >
        Search
        <ArrowRight className="h-4 w-4 ml-2" />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();

  const categories = [
    {
      name: "Electricians",
      icon: "⚡",
      color: "from-yellow-400 to-orange-500",
    },
    { name: "Plumbers", icon: "🔧", color: "from-blue-400 to-blue-600" },
    { name: "Tutors", icon: "📚", color: "from-green-400 to-green-600" },
    { name: "Cleaners", icon: "🧹", color: "from-purple-400 to-purple-600" },
    { name: "Fitness Trainers", icon: "💪", color: "from-red-400 to-red-600" },
    { name: "Photographers", icon: "📸", color: "from-pink-400 to-pink-600" },
  ];

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-teal-300" />,
      title: "Location-Based Matching",
      description: "Find services near you with real-time distance tracking",
      gradient: "from-teal-100/20 to-teal-50/20",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-300" />,
      title: "Verified Providers",
      description: "All service providers are background-checked and verified",
      gradient: "from-green-100/20 to-green-50/20",
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-300" />,
      title: "Real Reviews & Ratings",
      description: "Authentic reviews from real customers to help you decide",
      gradient: "from-yellow-100/20 to-yellow-50/20",
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-300" />,
      title: "Instant Booking",
      description: "Book services instantly with real-time availability",
      gradient: "from-purple-100/20 to-purple-50/20",
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center relative animate-fadeIn"
      style={{
        backgroundImage: "url('/mountains.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 min-h-screen">
        {/* Navigation */}
        <nav className="bg-black/30 backdrop-blur-xl border border-white/10 sticky top-0 z-50 animate-slideUp">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="text-2xl font-bold text-white animate-fadeInSlide"
                >
                  SkilLease
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="/services"
                  className="text-white/70 hover:text-teal-300 font-medium transition-colors animate-fadeInSlide delay-200"
                >
                  Browse Services
                </Link>
                <Link
                  href="/provider-dashboard"
                  className="text-white/70 hover:text-teal-300 font-medium transition-colors animate-fadeInSlide delay-200"
                >
                  For Providers
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-white/70 animate-fadeInSlide delay-200">
                      Hi, {user.email?.split("@")[0]}!
                    </span>
                    <Link
                      href="/dashboard"
                      className="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 animate-fadeInSlide delay-200"
                    >
                      Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/login"
                      className="text-white/70 hover:text-teal-300 font-medium transition-colors animate-fadeInSlide delay-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 animate-fadeInSlide delay-200"
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
            <div className="text-center bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-10 animate-slideUp">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeInSlide">
                Find Local Services
                <span className="block text-teal-300">Near You</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-4xl mx-auto animate-fadeInSlide delay-200">
                Connect with trusted local service providers. From electricians
                to tutors, find the perfect professional with real-time location
                tracking.
              </p>
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-12">
                {/* Mobile: input + icon only */}
                <MobileSearch />
                {/* Desktop: input + button as before */}
                <DesktopSearch />
              </div>
              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/services"
                  className="group bg-white/5 border border-white/10 hover:bg-white/10 text-teal-300 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center animate-fadeInSlide delay-200"
                >
                  <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Browse Services
                </Link>
                <Link
                  href="/provider-dashboard"
                  className="group bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center animate-fadeInSlide delay-200"
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
            <div className="text-center bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-16 animate-slideUp">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fadeInSlide">
                Popular Categories
              </h2>
              <p className="text-xl text-white/70 animate-fadeInSlide delay-200">
                Discover services across different categories
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href="/services"
                  className="group relative bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-teal-300 transition-all duration-300 hover:scale-105 animate-slideUp"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  <div className="relative z-10">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-white/70 mb-6 text-lg">
                      {category.count} providers available
                    </p>
                    <div className="flex items-center text-teal-300 font-semibold group-hover:text-teal-200 transition-colors">
                      <span>Explore services</span>
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform" />
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
            <div className="text-center bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-16 animate-slideUp">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fadeInSlide">
                Why Choose Skillease?
              </h2>
              <p className="text-xl text-white/70 animate-fadeInSlide delay-200">
                Built for the modern local service economy
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group text-center bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-teal-300 transition-all duration-300 hover:scale-105 animate-slideUp"
                >
                  <div
                    className={`bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-10 animate-slideUp">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fadeInSlide">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto animate-fadeInSlide delay-200">
                Join thousands of customers and providers already using
                Skillease to grow their business and find amazing services
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/services"
                  className="group bg-white/5 border border-white/10 hover:bg-white/10 text-teal-300 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center animate-fadeInSlide delay-200"
                >
                  <Search className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                  Find Services Now
                </Link>
                <Link
                  href="/provider-dashboard"
                  className="group bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center animate-fadeInSlide delay-200"
                >
                  <Users className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                  Start Earning Today
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/30 backdrop-blur-xl border-t border-white/10 py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="text-2xl font-bold mb-4 text-teal-300">
                  SkilLease
                </div>
                <p className="text-white/70">
                  Connecting communities, one service at a time. The future of
                  local services is here.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">For Customers</h4>
                <ul className="space-y-2 text-white/70">
                  <li>
                    <Link
                      href="/services"
                      className="hover:text-teal-300 transition-colors"
                    >
                      Browse Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="hover:text-teal-300 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="hover:text-teal-300 transition-colors"
                    >
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">For Providers</h4>
                <ul className="space-y-2 text-white/70">
                  <li>
                    <Link
                      href="/provider-dashboard"
                      className="hover:text-teal-300 transition-colors"
                    >
                      Provider Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="hover:text-teal-300 transition-colors"
                    >
                      Join as Provider
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Support</h4>
                <ul className="space-y-2 text-white/70">
                  <li>
                    <a
                      href="#"
                      className="hover:text-teal-300 transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-teal-300 transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center">
              <p className="text-white/70">
                © 2025 SkilLease. Built with ❤️ for connecting communities.
              </p>
            </div>
          </div>
        </footer>
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
      `}</style>
    </div>
  );
}
