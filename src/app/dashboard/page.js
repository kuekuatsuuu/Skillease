'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import Link from 'next/link'
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
  Award
} from 'lucide-react'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  // Simplified state - no complex loading
  const [userName, setUserName] = useState('')
  const [userType, setUserType] = useState('customer')

  useEffect(() => {
    if (user) {
      // Set user info immediately from auth data
      setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
      setUserType(user.user_metadata?.user_type || 'customer')
      console.log('Dashboard loaded for:', user.email)
    }
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  const isProvider = userType === 'provider'

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LocalConnect
                </Link>
                <div className="ml-10 hidden md:flex items-baseline space-x-8">
                  <span className="text-blue-600 font-semibold flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    Dashboard
                  </span>
                  <Link href="/services" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                    <Search className="h-4 w-4 mr-1" />
                    Browse Services
                  </Link>
                  {isProvider && (
                    <Link href="/provider-dashboard" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Provider View
                    </Link>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Bell className="h-6 w-6" />
                </button>
                <button className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Settings className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{userName}</div>
                    <div className="text-xs text-gray-500 capitalize flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {userType}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-3">
                  🎉 Welcome, {userName}!
                </h1>
                <p className="text-blue-100 text-lg mb-6">
                  {isProvider 
                    ? "🏢 Ready to manage your services and connect with customers!" 
                    : "🔍 Discover amazing local services in your area!"
                  }
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href="/services"
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {isProvider ? 'Add New Service' : 'Book New Service'}
                  </Link>
                  {isProvider && (
                    <Link 
                      href="/provider-dashboard"
                      className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center"
                    >
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Provider Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-green-900">Account Setup Complete! 🎉</h3>
                  <p className="text-green-700">
                    Your LocalConnect account is ready to use. Start exploring local services or offer your own!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Starting values for new users */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="bg-blue-100 p-4 rounded-xl">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isProvider ? 'Services Offered' : 'Total Bookings'}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-xs text-blue-600">Ready to start!</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-4 rounded-xl">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isProvider ? 'Pending Requests' : 'Pending Bookings'}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-xs text-yellow-600">All caught up!</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="bg-green-100 p-4 rounded-xl">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isProvider ? 'Avg Rating' : 'Reviews Given'}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{isProvider ? '5.0' : '0'}</p>
                  <p className="text-xs text-green-600">
                    {isProvider ? 'Perfect start!' : 'Share your experience!'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="bg-purple-100 p-4 rounded-xl">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isProvider ? 'Total Earnings' : 'Total Spent'}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">₹0</p>
                  <p className="text-xs text-purple-600">Let's get started!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Primary Actions */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="h-6 w-6 mr-2 text-blue-600" />
                Quick Actions
              </h3>
              <div className="space-y-4">
                <Link 
                  href="/services"
                  className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                >
                  <div className="flex items-center">
                    <Plus className="h-5 w-5 mr-3" />
                    {isProvider ? 'Add Your First Service' : 'Book Your First Service'}
                  </div>
                  <span className="text-blue-200">→</span>
                </Link>
                
                <Link
                  href="/services"
                  className="w-full flex items-center justify-between px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  <div className="flex items-center">
                    <Search className="h-5 w-5 mr-3" />
                    Browse All Services
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>

                {isProvider && (
                  <Link
                    href="/provider-dashboard"
                    className="w-full flex items-center justify-between px-6 py-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl font-medium transition-colors"
                  >
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-3" />
                      Go to Provider Dashboard
                    </div>
                    <span className="text-green-400">→</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Getting Started Guide */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Getting Started</h3>
              <div className="space-y-4">
                {isProvider ? (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-2 text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Create Your Services</h4>
                        <p className="text-sm text-gray-600">Add the services you want to offer to customers</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 text-green-600 rounded-full p-2 text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Get Bookings</h4>
                        <p className="text-sm text-gray-600">Customers will find and book your services</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 text-purple-600 rounded-full p-2 text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Track Earnings</h4>
                        <p className="text-sm text-gray-600">Monitor your bookings and grow your business</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-2 text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Browse Services</h4>
                        <p className="text-sm text-gray-600">Find local providers for any service you need</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 text-green-600 rounded-full p-2 text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Book Instantly</h4>
                        <p className="text-sm text-gray-600">Choose your preferred time and book with one click</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 text-purple-600 rounded-full p-2 text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Leave Reviews</h4>
                        <p className="text-sm text-gray-600">Help others by sharing your experience</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* No Activity Message */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">
              {isProvider ? '🏢' : '🛍️'}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {isProvider ? 'Ready to Start Your Business!' : 'Ready to Discover Services!'}
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              {isProvider 
                ? 'Your journey as a service provider begins here. Add your first service and start connecting with customers!'
                : 'Explore hundreds of local services in your area. From home repairs to tutoring, find exactly what you need!'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/services"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                {isProvider ? 'Add Your First Service' : 'Browse Services'}
              </Link>
              {isProvider && (
                <Link 
                  href="/provider-dashboard"
                  className="inline-flex items-center bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-xl font-semibold border-2 border-blue-600 transition-colors"
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Provider Dashboard
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}