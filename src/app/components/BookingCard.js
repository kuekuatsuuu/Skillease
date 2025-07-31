'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getCurrentLocation, calculateDistance, getDistanceMatrix, formatDistance, getLocationName } from '../lib/locationUtils'
import { MapPin, Navigation, Clock, User, Phone, CheckCircle, XCircle, Loader, MessageSquare } from 'lucide-react'

export default function BookingCard({ booking, onStatusUpdate, isProvider = false }) {
  const [customerLocation, setCustomerLocation] = useState(null)
  const [distance, setDistance] = useState(null)
  const [travelTime, setTravelTime] = useState(null)
  const [locationName, setLocationName] = useState('')
  const [loading, setLoading] = useState(false)
  const [trackingLocation, setTrackingLocation] = useState(false)

  useEffect(() => {
    if (isProvider && booking.status === 'pending') {
      trackCustomerLocation()
    }
  }, [booking, isProvider])

  const trackCustomerLocation = async () => {
    try {
      setTrackingLocation(true)
      
      // Simulate getting customer's current location (in real app, this would be from the customer's device)
      // For demo, we'll use a location near the service provider
      let location
      
      // If we have provider coordinates, place customer randomly nearby (1-5km radius)
      if (booking.service?.latitude && booking.service?.longitude) {
        const randomDistance = 1 + Math.random() * 4 // 1-5 km
        const randomAngle = Math.random() * 2 * Math.PI
        const lat = booking.service.latitude + (randomDistance / 111) * Math.cos(randomAngle)
        const lng = booking.service.longitude + (randomDistance / 111) * Math.sin(randomAngle)
        
        location = { latitude: lat, longitude: lng }
      } else {
        // Default to Kochi area
        location = { 
          latitude: 9.9312 + (Math.random() - 0.5) * 0.1, 
          longitude: 76.2673 + (Math.random() - 0.5) * 0.1 
        }
      }
      
      setCustomerLocation(location)
      
      // Calculate distance if provider has location
      if (booking.service?.latitude && booking.service?.longitude) {
        const dist = calculateDistance(
          location.latitude,
          location.longitude,
          booking.service.latitude,
          booking.service.longitude
        )
        setDistance(dist)

        // Get travel time from Google Maps
        try {
          const distanceData = await getDistanceMatrix(
            [{ lat: booking.service.latitude, lng: booking.service.longitude }],
            [{ lat: location.latitude, lng: location.longitude }]
          )
          
          if (distanceData && distanceData.duration) {
            setTravelTime(distanceData.duration.text)
          } else {
            // Estimate travel time based on distance (rough calculation)
            const estimatedMinutes = Math.round(dist * 3) // ~3 minutes per km in city
            setTravelTime(`~${estimatedMinutes} mins`)
          }
        } catch (error) {
          console.log('Travel time estimation failed, using distance-based estimate')
          const estimatedMinutes = Math.round(dist * 3)
          setTravelTime(`~${estimatedMinutes} mins`)
        }

        // Get location name
        const name = await getLocationName(location.latitude, location.longitude)
        setLocationName(name)

        // Update booking in database
        await supabase
          .from('bookings')
          .update({
            customer_current_lat: location.latitude,
            customer_current_lng: location.longitude,
            distance_km: dist
          })
          .eq('id', booking.id)
      }
    } catch (error) {
      console.error('Location tracking failed:', error)
    } finally {
      setTrackingLocation(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          provider_notes: newStatus === 'confirmed' 
            ? `Booking confirmed. Customer is ${formatDistance(distance)} away.`
            : 'Booking cancelled by provider'
        })
        .eq('id', booking.id)

      if (!error) {
        onStatusUpdate(booking.id, newStatus)
      }
    } catch (error) {
      console.error('Failed to update booking:', error)
    } finally {
      setLoading(false)
    }
  }

  const openInMaps = () => {
    if (customerLocation && booking.service?.latitude && booking.service?.longitude) {
      const url = `https://www.google.com/maps/dir/${booking.service.latitude},${booking.service.longitude}/${customerLocation.latitude},${customerLocation.longitude}`
      window.open(url, '_blank')
    }
  }

  const callCustomer = () => {
    if (booking.profiles?.phone) {
      window.open(`tel:${booking.profiles.phone}`)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      {/* Booking Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{booking.service?.title}</h3>
          <p className="text-gray-600 capitalize">{booking.service?.category}</p>
          <p className="text-sm text-gray-500 mt-1">
            Booking ID: {booking.id.slice(0, 8)}...
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 animate-pulse' :
          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
        }`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-600" />
          Customer Details
        </h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{booking.profiles?.full_name || 'Not provided'}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Phone:</span>
            <button 
              onClick={callCustomer}
              className="font-medium text-blue-600 hover:text-blue-700 flex items-center"
            >
              <Phone className="h-4 w-4 mr-1" />
              {booking.profiles?.phone || 'Not provided'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">
              {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{booking.duration_hours || 1} hour(s)</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Price:</span>
            <span className="font-bold text-green-600">₹{booking.total_price || 'TBD'}</span>
          </div>
        </div>
      </div>

      {/* Location & Distance Info - MAIN FEATURE */}
      {isProvider && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Customer Location
          </h4>
          
          {trackingLocation ? (
            <div className="flex items-center justify-center py-4 text-blue-600">
              <Loader className="h-5 w-5 mr-2 animate-spin" />
              <span>Getting customer location...</span>
            </div>
          ) : distance ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatDistance(distance)}
                  </div>
                  <div className="text-sm text-gray-600">Distance</div>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {travelTime || 'Calculating...'}
                  </div>
                  <div className="text-sm text-gray-600">Travel Time</div>
                </div>
              </div>
              
              {locationName && (
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Customer Address:</p>
                  <p className="font-medium text-gray-900">{locationName}</p>
                </div>
              )}
              
              <button
                onClick={openInMaps}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
              >
                <Navigation className="h-5 w-5 mr-2" />
                Navigate to Customer
              </button>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Location will be available when you accept the booking</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons for Providers */}
      {isProvider && booking.status === 'pending' && (
        <div className="flex space-x-3 mb-4">
          <button
            onClick={() => handleStatusUpdate('confirmed')}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <Loader className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-5 w-5 mr-2" />
            )}
            Accept Booking
          </button>
          
          <button
            onClick={() => handleStatusUpdate('cancelled')}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <XCircle className="h-5 w-5 mr-2" />
            Decline
          </button>
        </div>
      )}

      {/* Notes Section */}
      {booking.customer_notes && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <MessageSquare className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Customer Notes:</p>
              <p className="text-sm text-yellow-700">{booking.customer_notes}</p>
            </div>
          </div>
        </div>
      )}

      {booking.provider_notes && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <MessageSquare className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">Provider Notes:</p>
              <p className="text-sm text-blue-700">{booking.provider_notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}