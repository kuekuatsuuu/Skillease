'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { X, Calendar, Clock, MapPin, User, Phone, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateBooking({ service, onClose, onBookingCreated }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    booking_date: '',
    booking_time: '',
    duration_hours: 1,
    customer_current_lat: null,
    customer_current_lng: null,
    customer_notes: '',
    total_price: service?.price_per_hour || 0
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    let updatedData = { ...formData, [name]: value }
    
    // Recalculate total price when duration changes
    if (name === 'duration_hours') {
      const hours = parseInt(value) || 1
      updatedData.total_price = hours * (service?.price_per_hour || 0)
    }
    
    setFormData(updatedData)
  }

  // Get user's current location (optional)
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            customer_current_lat: position.coords.latitude,
            customer_current_lng: position.coords.longitude
          }))
          toast.success('Location captured successfully')
        },
        (error) => {
          console.log('Location error:', error)
          toast.error('Could not get your location')
        }
      )
    } else {
      toast.error('Geolocation is not supported by this browser')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('Form submitted with data:', formData) // Debug log
    console.log('User:', user) // Debug log
    console.log('Service:', service) // Debug log
    
    if (!user) {
      toast.error('Please login to create a booking')
      return
    }

    if (!service) {
      toast.error('Service information is missing')
      return
    }

    // Validation
    if (!formData.booking_date || !formData.booking_time) {
      toast.error('Please fill in date and time')
      return
    }

    setLoading(true)

    try {
      // Prepare booking data matching your database schema
      const bookingData = {
        service_id: service.id,
        customer_id: user.id,
        provider_id: service.provider_id,
        booking_date: formData.booking_date,
        booking_time: formData.booking_time,
        duration_hours: parseInt(formData.duration_hours),
        status: 'pending',
        total_price: formData.total_price,
        customer_notes: formData.customer_notes || null,
        provider_notes: null,
        customer_current_lat: formData.customer_current_lat,
        customer_current_lng: formData.customer_current_lng,
        distance_km: null, // This might be calculated server-side
        estimated_travel_time: null, // This might be calculated server-side
        payment_status: 'pending',
        payment_id: null
      }

      console.log('Inserting booking data:', bookingData) // Debug log

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Booking created successfully:', data) // Debug log
      
      // Call the callback function
      if (onBookingCreated && data && data[0]) {
        onBookingCreated(data[0])
      }
      
      toast.success('Booking request sent successfully!')
      onClose()
      
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error(error.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  if (!service) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Service</h2>
            <p className="text-gray-600">{service.title}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Service Info */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
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
            <div>
              <h3 className="font-semibold text-lg">{service.title}</h3>
              <p className="text-gray-600 capitalize">{service.category}</p>
              <p className="text-green-600 font-semibold">₹{service.price_per_hour}/hour</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Booking Date *
              </label>
              <input
                type="date"
                name="booking_date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.booking_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-2" />
                Booking Time *
              </label>
              <input
                type="time"
                name="booking_time"
                required
                value={formData.booking_time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (hours)
            </label>
            <select
              name="duration_hours"
              value={formData.duration_hours}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(hour => (
                <option key={hour} value={hour}>
                  {hour} hour{hour > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Location Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-2" />
              Your Location (Optional)
            </label>
            <button
              type="button"
              onClick={getCurrentLocation}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              {formData.customer_current_lat && formData.customer_current_lng 
                ? `Location captured (${formData.customer_current_lat.toFixed(4)}, ${formData.customer_current_lng.toFixed(4)})`
                : 'Click to capture current location'
              }
            </button>
          </div>

          {/* Customer Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Additional Notes
            </label>
            <textarea
              name="customer_notes"
              placeholder="Any specific requirements or additional information..."
              value={formData.customer_notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Total Price */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="font-medium">Estimated Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{formData.total_price}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formData.duration_hours} hour{formData.duration_hours > 1 ? 's' : ''} × ₹{service.price_per_hour}/hour
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Booking...' : 'Send Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}