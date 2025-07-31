'use client'

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Calendar, Clock, DollarSign, MessageSquare, User } from 'lucide-react'

export default function CreateBooking({ service, onClose, onBookingCreated }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    booking_date: '',
    booking_time: '',
    duration_hours: 1,
    customer_notes: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      const totalPrice = service.price_per_hour * formData.duration_hours

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            service_id: service.id,
            customer_id: user.id,
            provider_id: service.provider_id,
            booking_date: formData.booking_date,
            booking_time: formData.booking_time,
            duration_hours: formData.duration_hours,
            total_price: totalPrice,
            customer_notes: formData.customer_notes,
            status: 'pending'
          }
        ])
        .select()

      if (error) throw error

      onBookingCreated(data[0])
      onClose()
    } catch (error) {
      console.error('Failed to create booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-90vh overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Book Service</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Service Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-gray-900">{service.title}</h3>
          <p className="text-gray-600 capitalize">{service.category}</p>
          <p className="text-green-600 font-semibold mt-2">₹{service.price_per_hour}/hour</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Preferred Date
            </label>
            <input
              type="date"
              required
              min={today}
              value={formData.booking_date}
              onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 mr-2" />
              Preferred Time
            </label>
            <input
              type="time"
              required
              value={formData.booking_time}
              onChange={(e) => setFormData({...formData, booking_time: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 mr-2" />
              Duration (hours)
            </label>
            <select
              value={formData.duration_hours}
              onChange={(e) => setFormData({...formData, duration_hours: parseInt(e.target.value)})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1,2,3,4,5,6,7,8].map(hour => (
                <option key={hour} value={hour}>{hour} hour{hour > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="h-4 w-4 mr-2" />
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.customer_notes}
              onChange={(e) => setFormData({...formData, customer_notes: e.target.value})}
              placeholder="Any specific requirements or instructions..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Price:</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{(service.price_per_hour * formData.duration_hours).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              ₹{service.price_per_hour}/hour × {formData.duration_hours} hour{formData.duration_hours > 1 ? 's' : ''}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Creating Booking...' : 'Book Now'}
          </button>
        </form>
      </div>
    </div>
  )
}