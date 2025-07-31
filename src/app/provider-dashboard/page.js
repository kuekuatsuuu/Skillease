'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import BookingCard from '../components/BookingCard'
import { Calendar, Bell, MapPin, Star, DollarSign, Users, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProviderDashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    totalEarnings: 0
  })

  useEffect(() => {
    fetchBookings()
    fetchStats()
  }, [user])

  const fetchBookings = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services!bookings_service_id_fkey (
          title,
          category,
          price_per_hour,
          latitude,
          longitude
        ),
        profiles!bookings_customer_id_fkey (
          full_name,
          phone,
          email
        )
      `)
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setBookings(data)
    }
    setLoading(false)
  }

  const fetchStats = async () => {
    if (!user) return

    const { data } = await supabase
      .from('bookings')
      .select('status, total_price')
      .eq('provider_id', user.id)

    if (data) {
      const stats = data.reduce((acc, booking) => {
        if (booking.status === 'pending') acc.pendingBookings++
        if (booking.status === 'confirmed') acc.confirmedBookings++
        if (booking.status === 'completed') {
          acc.completedBookings++
          acc.totalEarnings += parseFloat(booking.total_price || 0)
        }
        return acc
      }, { pendingBookings: 0, confirmedBookings: 0, completedBookings: 0, totalEarnings: 0 })

      setStats(stats)
    }
  }

  const handleBookingStatusUpdate = (bookingId, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ))
    fetchStats() // Refresh stats
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
  const otherBookings = bookings.filter(b => !['pending', 'confirmed'].includes(b.status))

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
                <p className="text-blue-100">Manage bookings • Track customer locations • Grow your business</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="text-blue-100 hover:text-white transition-colors">
                  <Settings className="h-6 w-6" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-orange-100 p-4 rounded-xl">
                  <Bell className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Requests</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-blue-100 p-4 rounded-xl">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.confirmedBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-green-100 p-4 rounded-xl">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completedBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-purple-100 p-4 rounded-xl">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-3xl font-bold text-purple-600">₹{stats.totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Urgent Pending Bookings */}
          {pendingBookings.length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <Bell className="h-7 w-7 mr-3 text-orange-500 animate-bounce" />
                  🚨 Urgent: New Booking Requests
                  <span className="ml-3 bg-orange-500 text-white px-3 py-1 rounded-full text-lg font-bold">
                    {pendingBookings.length}
                  </span>
                </h2>
                <p className="text-gray-700">
                  Customers are waiting! Accept bookings quickly to provide excellent service.
                </p>
              </div>
              
              <div className="grid gap-6">
                {pendingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onStatusUpdate={handleBookingStatusUpdate}
                    isProvider={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {bookings.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl p-12 shadow-sm">
                <MapPin className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready for Your First Booking!</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Your booking requests will appear here with detailed customer location information
                </p>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-blue-800 font-medium">
                    ✨ When customers book your services, you'll see:
                  </p>
                  <ul className="text-blue-700 mt-2 space-y-1">
                    <li>• Exact distance to customer location</li>
                    <li>• Estimated travel time</li>
                    <li>• One-click navigation to their address</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}