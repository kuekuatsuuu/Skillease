'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import BookingCard from '../components/BookingCard'
import CreateService from '../components/CreateService'
import { 
  Calendar, 
  Bell, 
  MapPin, 
  Star, 
  DollarSign, 
  Users, 
  Settings, 
  LogOut, 
  Plus,
  Edit,
  Eye,
  TrendingUp
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ProviderDashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateService, setShowCreateService] = useState(false)
  const [stats, setStats] = useState({
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
    totalServices: 0
  })

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    if (!user) return

    try {
      // Fetch bookings
      const { data: bookingsData } = await supabase
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

      if (bookingsData) {
        setBookings(bookingsData)
      }

      // Fetch services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false })

      if (servicesData) {
        setServices(servicesData)
      }

      // Calculate stats
      if (bookingsData) {
        const stats = bookingsData.reduce((acc, booking) => {
          if (booking.status === 'pending') acc.pendingBookings++
          if (booking.status === 'confirmed') acc.confirmedBookings++
          if (booking.status === 'completed') {
            acc.completedBookings++
            acc.totalEarnings += parseFloat(booking.total_price || 0)
          }
          return acc
        }, { 
          pendingBookings: 0, 
          confirmedBookings: 0, 
          completedBookings: 0, 
          totalEarnings: 0,
          totalServices: servicesData?.length || 0
        })

        setStats(stats)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleBookingStatusUpdate = (bookingId, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ))
    fetchData() // Refresh stats
  }

  const handleServiceCreated = (newService) => {
    setServices([newService, ...services])
    setStats(prev => ({ ...prev, totalServices: prev.totalServices + 1 }))
    toast.success('Service created successfully!')
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
                <p className="text-blue-100">Manage services • Track bookings • Grow your business</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowCreateService(true)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </button>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-purple-100 p-4 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">My Services</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalServices}</p>
                </div>
              </div>
            </div>

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

          {/* My Services Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="h-7 w-7 mr-3 text-blue-500" />
                My Services
                <span className="ml-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {services.length}
                </span>
              </h2>
              <button
                onClick={() => setShowCreateService(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Service
              </button>
            </div>

            {services.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{service.city}</span>
                        </div>
                        <div className="flex items-center text-sm text-green-600 font-semibold">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>₹{service.price_per_hour}/hour</span>
                        </div>
                      </div>
                      <div className="text-6xl ml-4">
                        {service.category === 'electrician' && '⚡'}
                        {service.category === 'plumber' && '🔧'}
                        {service.category === 'tutor' && '📚'}
                        {service.category === 'cleaner' && '🧹'}
                        {service.category === 'fitness trainer' && '💪'}
                        {service.category === 'photographer' && '📸'}
                        {service.category === 'gardener' && '🌱'}
                        {service.category === 'painter' && '🎨'}
                        {service.category === 'carpenter' && '🔨'}
                        {service.category === 'mechanic' && '⚙️'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{service.average_rating?.toFixed(1)}</span>
                        <span className="text-gray-500 ml-1">({service.total_reviews} reviews)</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 p-2">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 p-2">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                <div className="text-6xl mb-4">🏢</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No services yet</h3>
                <p className="text-gray-600 mb-6">Create your first service to start receiving bookings</p>
                <button
                  onClick={() => setShowCreateService(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  Create Your First Service
                </button>
              </div>
            )}
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

          {/* Confirmed Bookings */}
          {confirmedBookings.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-7 w-7 mr-3 text-blue-500" />
                Upcoming Bookings
                <span className="ml-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {confirmedBookings.length}
                </span>
              </h2>
              
              <div className="grid gap-6">
                {confirmedBookings.map((booking) => (
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
          {bookings.length === 0 && services.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl p-12 shadow-sm">
                <MapPin className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Provider Dashboard!</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Start by creating your first service to begin receiving bookings
                </p>
                <button
                  onClick={() => setShowCreateService(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2 inline" />
                  Create Your First Service
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Service Modal */}
        {showCreateService && (
          <CreateService
            onClose={() => setShowCreateService(false)}
            onServiceCreated={handleServiceCreated}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}