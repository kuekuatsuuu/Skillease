'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import CreateBooking from '../components/CreateBooking'
import { Search, Star, MapPin, Clock, DollarSign, Navigation } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ServicesPage() {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const categories = [
    'all', 'electrician', 'plumber', 'tutor', 'cleaner',
    'fitness trainer', 'photographer', 'gardener', 'painter'
  ]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      fetchServices()
      getUserLocation()
    }
  }, [isMounted])

  useEffect(() => {
    if (isMounted) {
      filterAndSortServices()
    }
  }, [searchTerm, selectedCategory, sortBy, services, userLocation, isMounted])

  const getUserLocation = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        () => {
          setUserLocation({ latitude: 9.9312, longitude: 76.2673 }) // Kochi fallback
        }
      )
    }
  }

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        profiles!services_provider_id_fkey (
          full_name,
          city,
          phone
        )
      `)
      .eq('is_active', true)
      .order('average_rating', { ascending: false })

    if (error) {
      toast.error('Error fetching services')
      return
    }

    const servicesWithFallback = data.map(service => ({
      ...service,
      average_rating: service.average_rating || (4.0 + Math.random()),
      total_reviews: service.total_reviews || Math.floor(Math.random() * 50) + 5
    }))

    setServices(servicesWithFallback)
    setFilteredServices(servicesWithFallback)
    setLoading(false)
  }

  const calculateDistance = (lat, lon) => {
    if (!userLocation || !lat || !lon) return null
    const R = 6371
    const dLat = (lat - userLocation.latitude) * Math.PI / 180
    const dLon = (lon - userLocation.longitude) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(userLocation.latitude * Math.PI / 180) *
      Math.cos(lat * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const filterAndSortServices = () => {
    let filtered = [...services]

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category?.toLowerCase() === selectedCategory.toLowerCase())
    }

    filtered = filtered.map(service => ({
      ...service,
      distance: calculateDistance(service.latitude, service.longitude)
    }))

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.average_rating - a.average_rating
        case 'price_low':
          return a.price_per_hour - b.price_per_hour
        case 'price_high':
          return b.price_per_hour - a.price_per_hour
        case 'distance':
          return (a.distance ?? Infinity) - (b.distance ?? Infinity)
        case 'reviews':
          return b.total_reviews - a.total_reviews
        default:
          return 0
      }
    })

    setFilteredServices(filtered)
  }

  const handleBookService = (service) => {
    if (!user) {
      toast.error('Please login to book a service')
      return
    }
    setSelectedService(service)
    setShowBookingModal(true)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 text-yellow-400 opacity-50" />)
    }

    const empty = 5 - Math.ceil(rating)
    for (let i = 0; i < empty; i++) {
      stars.push(<Star key={`e-${i}`} className="h-4 w-4 text-white/50" />)
    }

    return stars
  }

  const ServiceCard = ({ service }) => (
    <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white hover:scale-105 transition-transform animate-slideUp">
      <div className="flex items-center mb-2">
        <div className="flex mr-2">{renderStars(service.average_rating)}</div>
        <span className="text-xs text-white/70">
          ({service.total_reviews} review{service.total_reviews !== 1 ? 's' : ''})
        </span>
      </div>
      <p className="text-sm mb-3 text-white/70 line-clamp-2">{service.description}</p>
      <div className="text-xs space-y-2 mb-4">
        <div className="flex items-center text-white/70">
          <MapPin className="h-4 w-4 mr-2 text-teal-300" />
          {service.profiles?.city || service.city}
          {service.distance && <span className="ml-2 text-teal-300">• {service.distance.toFixed(1)} km</span>}
        </div>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-teal-300" />
          ₹{service.price_per_hour}/hr
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-teal-300" />
          {service.availability_hours || 'Flexible'}
        </div>
      </div>
      <div className="flex items-center justify-between border-t pt-3 border-white/20">
        <div>
          <p className="font-semibold text-white">{service.profiles?.full_name}</p>
          <p className="capitalize text-white/70">{service.category}</p>
        </div>
        <button
          onClick={() => handleBookService(service)}
          className="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 px-4 py-1.5 text-sm rounded-lg text-white font-semibold hover:scale-105 transition-all animate-fadeInSlide delay-200"
        >
          Book Now
        </button>
      </div>
    </div>
  )

  if (loading || !isMounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative animate-fadeIn"
        style={{
          backgroundImage: "url('/mountains.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative z-10 w-full backdrop-blur-lg bg-black/50 min-h-screen px-4 py-8">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-white/70 animate-pulse">Loading services...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative animate-fadeIn"
      style={{
        backgroundImage: "url('/mountains.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div className="relative z-10 w-full backdrop-blur-lg bg-black/50 min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2 animate-fadeInSlide">Find Trusted Services</h1>
          <p className="text-white/70 mb-6 animate-fadeInSlide delay-200">
            {userLocation ? "Top-rated professionals near you." : "Browse services by category."}
          </p>

          <div className="relative mb-6 max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
            <input
              type="text"
              placeholder="Search for services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-teal-300 focus:animate-bounceOnce outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-sm rounded-lg capitalize transition animate-fadeInSlide delay-200 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black/10 backdrop-blur-xl border border-white/20 text-sm rounded-lg px-3 py-1 text-white focus:ring-2 focus:ring-teal-300 focus:animate-bounceOnce animate-fadeInSlide delay-200"
            >
              <option value="rating">Top Rated</option>
              <option value="distance">Nearest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="reviews">Most Reviewed</option>
            </select>
            {userLocation && (
              <div className="flex items-center text-teal-300 text-xs bg-white/10 backdrop-blur-xl px-3 py-1 rounded-lg border border-white/20 animate-fadeInSlide delay-200">
                <Navigation className="h-3 w-3 mr-1 text-teal-300" /> Location On
              </div>
            )}
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center text-white/70 animate-fadeInSlide">No services found.</div>
          )}
        </div>
      </div>

      {showBookingModal && selectedService && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slideUp">
            <CreateBooking
              service={selectedService}
              onClose={() => setShowBookingModal(false)}
              onBookingCreated={() => {
                toast.success('Booking created!')
                setShowBookingModal(false)
              }}
            />
          </div>
        </div>
      )}

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

        @keyframes bounceOnce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounceOnce {
          animation: bounceOnce 0.3s ease-out;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 1s infinite;
        }

        select option {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  )
}