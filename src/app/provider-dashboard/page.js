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
  TrendingUp,
  Sun,
  Moon
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
  const [isDarkMode, setIsDarkMode] = useState(true)
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
  const otherBookings = bookings.filter(b => !['pending', 'confirmed'].includes(b.status))

  if (loading) {
    return (
      <ProtectedRoute>
        <div className={`min-h-screen bg-cover bg-center relative animate-fadeIn ${
          isDarkMode ? 'bg-gray-950' : 'bg-gray-100'
        }`}
        style={{
          backgroundImage: "url('/mountains.jpg')",
        }}>
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-white/30'} z-0`} />
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className={`text-center p-8 rounded-2xl backdrop-blur-2xl ${
              isDarkMode 
                ? 'bg-black/30 border-white/10' 
                : 'bg-white/20 border-white/30 shadow-lg backdrop-blur-3xl'
            } border ${isDarkMode ? 'text-white' : 'text-gray-900'} animate-slideUp`}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
              <p className={isDarkMode ? 'text-white/70' : 'text-gray-600'}>Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className={`min-h-screen bg-cover bg-center relative animate-fadeIn ${
        isDarkMode ? 'bg-gray-950' : 'bg-gray-100'
      }`}
      style={{
        backgroundImage: "url('/mountains.jpg')",
      }}>
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-white/30'} z-0`} />
        
        {/* Header */}
        <div className="relative z-10">
          <div className={`backdrop-blur-2xl ${
            isDarkMode 
              ? 'bg-black/30 border-white/10' 
              : 'bg-white/20 border-white/30 shadow-lg'
          } border-b ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="animate-fadeInSlide">
                  <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
                  <p className={isDarkMode ? 'text-white/70' : 'text-gray-600'}>
                    Manage services • Track bookings • Grow your business
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg ${
                      isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/20'
                    } transition`}
                    aria-label="Toggle theme"
                  >
                    {isDarkMode ? (
                      <Sun className="h-6 w-6 text-yellow-400" />
                    ) : (
                      <Moon className="h-6 w-6 text-gray-700" />
                    )}
                  </button>
                  <button 
                    onClick={() => setShowCreateService(true)}
                    className={`${
                      isDarkMode
                        ? 'bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700'
                    } text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 flex items-center`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </button>
                  <button className={`${isDarkMode ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors`}>
                    <Settings className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={handleLogout}
                    className={`${
                      isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/20 hover:bg-white/30'
                    } px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 flex items-center ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8 animate-slideUp">
              <div className={`backdrop-blur-2xl ${
                isDarkMode 
                  ? 'bg-black/30 border-white/10' 
                  : 'bg-white/20 border-white/30 shadow-lg'
              } border rounded-2xl p-6 hover:scale-105 transition-all duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <div className="flex items-center">
                  <div className={`${
                    isDarkMode ? 'bg-purple-500/20' : 'bg-purple-500/30'
                  } p-4 rounded-xl backdrop-blur-sm`}>
                    <TrendingUp className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>My Services</p>
                    <p className="text-3xl font-bold text-purple-400">{stats.totalServices}</p>
                  </div>
                </div>
              </div>

              <div className={`backdrop-blur-2xl ${
                isDarkMode 
                  ? 'bg-black/30 border-white/10' 
                  : 'bg-white/20 border-white/30 shadow-lg'
              } border rounded-2xl p-6 hover:scale-105 transition-all duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <div className="flex items-center">
                  <div className={`${
                    isDarkMode ? 'bg-orange-500/20' : 'bg-orange-500/30'
                  } p-4 rounded-xl backdrop-blur-sm`}>
                    <Bell className="h-8 w-8 text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>New Requests</p>
                    <p className="text-3xl font-bold text-orange-400">{stats.pendingBookings}</p>
                  </div>
                </div>
              </div>

              <div className={`backdrop-blur-2xl ${
                isDarkMode 
                  ? 'bg-black/30 border-white/10' 
                  : 'bg-white/20 border-white/30 shadow-lg'
              } border rounded-2xl p-6 hover:scale-105 transition-all duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <div className="flex items-center">
                  <div className={`${
                    isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/30'
                  } p-4 rounded-xl backdrop-blur-sm`}>
                    <Calendar className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>Confirmed</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.confirmedBookings}</p>
                  </div>
                </div>
              </div>

              <div className={`backdrop-blur-2xl ${
                isDarkMode 
                  ? 'bg-black/30 border-white/10' 
                  : 'bg-white/20 border-white/30 shadow-lg'
              } border rounded-2xl p-6 hover:scale-105 transition-all duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <div className="flex items-center">
                  <div className={`${
                    isDarkMode ? 'bg-green-500/20' : 'bg-green-500/30'
                  } p-4 rounded-xl backdrop-blur-sm`}>
                    <Users className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>Completed</p>
                    <p className="text-3xl font-bold text-green-400">{stats.completedBookings}</p>
                  </div>
                </div>
              </div>

              <div className={`backdrop-blur-2xl ${
                isDarkMode 
                  ? 'bg-black/30 border-white/10' 
                  : 'bg-white/20 border-white/30 shadow-lg'
              } border rounded-2xl p-6 hover:scale-105 transition-all duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <div className="flex items-center">
                  <div className={`${
                    isDarkMode ? 'bg-purple-500/20' : 'bg-purple-500/30'
                  } p-4 rounded-xl backdrop-blur-sm`}>
                    <DollarSign className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>Total Earnings</p>
                    <p className="text-3xl font-bold text-purple-400">₹{stats.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Services Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <TrendingUp className="h-7 w-7 mr-3 text-teal-400" />
                  My Services
                  <span className="ml-3 bg-teal-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                    {services.length}
                  </span>
                </h2>
                <button
                  onClick={() => setShowCreateService(true)}
                  className={`${
                    isDarkMode
                      ? 'bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600'
                      : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700'
                  } text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center`}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Service
                </button>
              </div>

              {services.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className={`backdrop-blur-2xl ${
                      isDarkMode 
                        ? 'bg-black/30 border-white/10' 
                        : 'bg-white/20 border-white/30 shadow-lg'
                    } border rounded-2xl p-6 hover:scale-105 transition-all duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                          <p className={`text-sm mb-3 line-clamp-2 ${
                            isDarkMode ? 'text-white/70' : 'text-gray-600'
                          }`}>{service.description}</p>
                          <div className={`flex items-center text-sm mb-2 ${
                            isDarkMode ? 'text-white/60' : 'text-gray-500'
                          }`}>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{service.city}</span>
                          </div>
                          <div className="flex items-center text-sm text-teal-400 font-semibold">
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
                      
                      <div className={`flex items-center justify-between pt-4 border-t ${
                        isDarkMode ? 'border-white/10' : 'border-white/20'
                      }`}>
                        <div className="flex items-center text-sm">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="font-medium">{service.average_rating?.toFixed(1)}</span>
                          <span className={isDarkMode ? 'text-white/60 ml-1' : 'text-gray-500 ml-1'}>
                            ({service.total_reviews} reviews)
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-teal-400 hover:text-teal-300 p-2 transition">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className={`${
                            isDarkMode ? 'text-white/60 hover:text-white/80' : 'text-gray-600 hover:text-gray-700'
                          } p-2 transition`}>
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 backdrop-blur-2xl ${
                  isDarkMode 
                    ? 'bg-black/30 border-white/10' 
                    : 'bg-white/20 border-white/30 shadow-lg'
                } border rounded-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <div className="text-6xl mb-4">🏢</div>
                  <h3 className="text-xl font-bold mb-3">No services yet</h3>
                  <p className={`mb-6 ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
                    Create your first service to start receiving bookings
                  </p>
                  <button
                    onClick={() => setShowCreateService(true)}
                    className={`${
                      isDarkMode
                        ? 'bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700'
                    } text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105`}
                  >
                    Create Your First Service
                  </button>
                </div>
              )}
            </div>

            {/* Urgent Pending Bookings */}
            {pendingBookings.length > 0 && (
              <div className="mb-8">
                <div className={`backdrop-blur-2xl ${
                  isDarkMode 
                    ? 'bg-orange-500/20 border-orange-400/20' 
                    : 'bg-orange-400/20 border-orange-500/30'
                } border rounded-2xl p-6 mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <h2 className="text-2xl font-bold mb-2 flex items-center">
                    <Bell className="h-7 w-7 mr-3 text-orange-400 animate-bounce" />
                    🚨 Urgent: New Booking Requests
                    <span className="ml-3 bg-orange-500 text-white px-3 py-1 rounded-full text-lg font-bold">
                      {pendingBookings.length}
                    </span>
                  </h2>
                  <p className={isDarkMode ? 'text-white/70' : 'text-gray-600'}>
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
                <h2 className={`text-2xl font-bold mb-6 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Calendar className="h-7 w-7 mr-3 text-blue-400" />
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
                <div className={`backdrop-blur-2xl ${
                  isDarkMode 
                    ? 'bg-black/30 border-white/10' 
                    : 'bg-white/20 border-white/30 shadow-lg'
                } border rounded-2xl p-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <MapPin className={`h-20 w-20 mx-auto mb-6 ${
                    isDarkMode ? 'text-white/40' : 'text-gray-400'
                  }`} />
                  <h3 className="text-2xl font-bold mb-4">Welcome to Your Provider Dashboard!</h3>
                  <p className={`text-lg mb-6 ${
                    isDarkMode ? 'text-white/70' : 'text-gray-600'
                  }`}>
                    Start by creating your first service to begin receiving bookings
                  </p>
                  <button
                    onClick={() => setShowCreateService(true)}
                    className={`${
                      isDarkMode
                        ? 'bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700'
                    } text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg`}
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

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease-in-out;
          }

          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slideUp {
            animation: slideUp 0.8s ease-out;
          }

          @keyframes fadeInSlide {
            from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-fadeInSlide {
            animation: fadeInSlide 0.6s ease-out;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  )
}
