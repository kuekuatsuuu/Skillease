'use client'

import Link from 'next/link'
import { useAuth } from './context/AuthContext'
import { Search, Star, Clock, Shield, Users, Zap, ArrowRight, MapPin } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()

  const categories = [
    { name: 'Electricians', icon: '⚡', count: '150+', color: 'from-yellow-400 to-orange-500' },
    { name: 'Plumbers', icon: '🔧', count: '120+', color: 'from-blue-400 to-blue-600' },
    { name: 'Tutors', icon: '📚', count: '200+', color: 'from-green-400 to-green-600' },
    { name: 'Cleaners', icon: '🧹', count: '180+', color: 'from-purple-400 to-purple-600' },
    { name: 'Fitness Trainers', icon: '💪', count: '90+', color: 'from-red-400 to-red-600' },
    { name: 'Photographers', icon: '📸', count: '75+', color: 'from-pink-400 to-pink-600' }
  ]

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Location-Based Matching",
      description: "Find services near you with real-time distance tracking",
      gradient: "from-blue-100 to-blue-50"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Verified Providers",
      description: "All service providers are background-checked and verified",
      gradient: "from-green-100 to-green-50"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: "Real Reviews & Ratings",
      description: "Authentic reviews from real customers to help you decide",
      gradient: "from-yellow-100 to-yellow-50"
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: "Instant Booking",
      description: "Book services instantly with real-time availability",
      gradient: "from-purple-100 to-purple-50"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LocalConnect
              </div>
              <div className="ml-2 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full">
                LIVE
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Browse Services
              </Link>
              <Link href="/provider-dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                For Providers
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">Hi, {user.email?.split('@')[0]}!</span>
                  <Link 
                    href="/dashboard"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/login"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/signup"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Find Local Services
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Near You
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Connect with trusted local service providers. From electricians to tutors, 
              find the perfect professional with real-time location tracking.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-xl transition-all duration-300"
                />
                <Link
                  href="/services"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center"
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
                className="group bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-2xl font-semibold border-2 border-blue-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex items-center justify-center"
              >
                <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Browse Services
              </Link>
              <Link 
                href="/provider-dashboard"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex items-center justify-center"
              >
                <Users className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Become a Provider
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Popular Categories</h2>
            <p className="text-xl text-gray-600">Discover services across different categories</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                href="/services"
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent transform hover:-translate-y-4 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">{category.count} providers available</p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
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
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose LocalConnect?</h2>
            <p className="text-xl text-gray-600">Built for the modern local service economy</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className={`bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                1000+
              </div>
              <p className="text-gray-600 font-medium">Verified Providers</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                50K+
              </div>
              <p className="text-gray-600 font-medium">Happy Customers</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                4.9★
              </div>
              <p className="text-gray-600 font-medium">Average Rating</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                24/7
              </div>
              <p className="text-gray-600 font-medium">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of customers and providers already using LocalConnect to grow their business and find amazing services
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/services"
              className="group bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center"
            >
              <Search className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
              Find Services Now
            </Link>
            <Link 
              href="/provider-dashboard"
              className="group bg-transparent hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg border-2 border-white transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
            >
              <Users className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
              Start Earning Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LocalConnect
              </div>
              <p className="text-gray-400">
                Connecting communities, one service at a time. The future of local services is here.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/services" className="hover:text-white transition-colors">Browse Services</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/provider-dashboard" className="hover:text-white transition-colors">Provider Dashboard</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Join as Provider</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 SkilLease. Built with ❤️ for connecting communities.
            </p>
          </div>
        </div>
         </footer>
    </div>
  )
}