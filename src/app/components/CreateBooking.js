'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Calendar, Clock, MessageSquare, X } from 'lucide-react'

export default function CreateBooking({ service, onClose, onBookingCreated }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    booking_date: '',
    booking_time: '',
    duration_hours: 1,
    customer_notes: ''
  })
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const now = new Date()
  const minDate = today
  const minTime = formData.booking_date === minDate 
    ? `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}` 
    : '00:00'

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!user?.id) {
      alert('Please log in to create a booking.')
      return
    }

    if (!service?.id || !service?.price_per_hour || !(service.provider_id || service.profiles?.id)) {
      console.error('Invalid service object:', service)
      alert('Invalid service data. Please try again.')
      return
    }

    const selectedDateTime = new Date(`${formData.booking_date}T${formData.booking_time}`)
    if (selectedDateTime < now) {
      alert('Cannot book a time in the past.')
      return
    }

    setLoading(true)
    try {
      const totalPrice = service.price_per_hour * formData.duration_hours
      const providerId = service.provider_id || service.profiles.id

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            service_id: service.id,
            customer_id: user.id,
            provider_id: providerId,
            booking_date: formData.booking_date,
            booking_time: formData.booking_time,
            duration_hours: formData.duration_hours,
            total_price: totalPrice,
            customer_notes: formData.customer_notes,
            status: 'pending'
          }
        ])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message)
      }
      if (!data || !data[0]) {
        throw new Error('No booking data returned from server.')
      }

      onBookingCreated(data[0])
      onClose()
    } catch (error) {
      console.error('Failed to create booking:', error.message)
      alert(`Failed to create booking: ${error.message}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }, [user, service, formData, onBookingCreated, onClose])

  return (
    
      <div className="relative bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-6 text-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 id="booking-modal-title" className="text-2xl font-semibold">Book Service</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-xl text-white hover:text-red-400"
          >
            <X />
          </button>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <h3 className="font-bold text-white">{service?.title || 'Service'}</h3>
          <p className="text-gray-200 capitalize">{service?.category || 'Category'}</p>
          <p className="text-green-400 font-semibold mt-2">₹{service?.price_per_hour || 0}/hour</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="booking-date" className="flex items-center gap-2 text-sm font-medium mb-1">
              <Calendar className="w-4 h-4" />
              Preferred Date
            </label>
            <input
              id="booking-date"
              type="date"
              required
              min={minDate}
              value={formData.booking_date}
              onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="booking-time" className="flex items-center gap-2 text-sm font-medium mb-1">
              <Clock className="w-4 h-4" />
              Preferred Time
            </label>
            <input
              id="booking-time"
              type="time"
              required
              min={formData.booking_date === minDate ? minTime : undefined}
              value={formData.booking_time}
              onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="duration-hours" className="flex items-center gap-2 text-sm font-medium mb-1">
              <Clock className="w-4 h-4" />
              Duration (hours)
            </label>
            <select
              id="duration-hours"
              value={formData.duration_hours}
              onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(hour => (
                <option key={hour} value={hour}>{hour} hour{hour > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="customer-notes" className="flex items-center gap-2 text-sm font-medium mb-1">
              <MessageSquare className="w-4 h-4" />
              Notes (Optional)
            </label>
            <textarea
              id="customer-notes"
              rows={3}
              value={formData.customer_notes}
              onChange={(e) => setFormData({ ...formData, customer_notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Any specific instructions..."
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-2">
            <div className="flex justify-between items-center">
              <span>Total Price</span>
              <span className="text-lg font-semibold text-green-400">
                ₹{(service?.price_per_hour * formData.duration_hours || 0).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              ₹{service?.price_per_hour || 0}/hour × {formData.duration_hours} hour{formData.duration_hours > 1 ? 's' : ''}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Booking...' : 'Book Now'}
          </button>
        </form>
      </div>
    
  )
}