'use client'

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { getCurrentLocation } from '../lib/locationUtils'
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  FileText, 
  Save,
  Loader,
  Navigation
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateService({ onClose, onServiceCreated }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price_per_hour: '',
    location: '',
    city: 'Kochi',
    availability_days: '',
    availability_hours: '',
    latitude: null,
    longitude: null,
    images: ''
  })

  const categories = [
    'electrician',
    'plumber', 
    'tutor',
    'cleaner',
    'fitness trainer',
    'photographer',
    'gardener',
    'painter',
    'carpenter',
    'mechanic'
  ]

  const handleGetLocation = async () => {
    try {
      setGettingLocation(true)
      toast.loading('Getting your location...')
      
      const location = await getCurrentLocation()
      
      setFormData(prev => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude
      }))
      
      toast.dismiss()
      toast.success('Location captured successfully!')
    } catch (error) {
      console.error('Location error:', error)
      toast.dismiss()
      toast.error('Could not get location. Please enter manually.')
    } finally {
      setGettingLocation(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.latitude || !formData.longitude) {
      toast.error('Please capture your location first!')
      return
    }
    
    if (!user) {
      toast.error('User not authenticated!')
      return
    }
    
    setLoading(true)
    console.log('🚀 Starting service creation...')
    
    try {
      // Clean and validate data before sending
      const priceValue = parseFloat(formData.price_per_hour)
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Invalid price value')
      }

      const serviceData = {
        provider_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price_per_hour: priceValue,
        location: formData.location.trim(),
        city: formData.city.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        is_active: true,
        average_rating: 5.0,
        total_reviews: 0
      }

      // Handle ARRAY fields properly
      if (formData.availability_days?.trim()) {
        // Convert string to array - split by comma or use as single item
        const daysArray = formData.availability_days.trim().split(',').map(day => day.trim()).filter(day => day)
        serviceData.availability_days = daysArray
      }
      
      if (formData.availability_hours?.trim()) {
        serviceData.availability_hours = formData.availability_hours.trim()
      }
      
      if (formData.images?.trim()) {
        // Convert string to array for images too
        const imagesArray = formData.images.trim().split(',').map(img => img.trim()).filter(img => img)
        serviceData.images = imagesArray
      }

      console.log('📝 Clean service data:', serviceData)
      console.log('🔄 Calling Supabase insert...')
      
      // Add more detailed logging
      console.log('🔍 User details:', {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      })
      
      // Try the insert
      const { data, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select()
      
      console.log('📊 Full Supabase response:', { data, error })
      console.log('📊 Error type:', typeof error)
      console.log('📊 Error keys:', error ? Object.keys(error) : 'No error keys')
      
      if (error) {
        console.error('❌ Supabase error details:', error)
        console.error('❌ Error message:', error?.message)
        console.error('❌ Error code:', error?.code)
        console.error('❌ Error details:', error?.details)
        console.error('❌ Error hint:', error?.hint)
        
        // Try to get more info from the error
        const errorString = JSON.stringify(error, null, 2)
        console.error('❌ Error as JSON:', errorString)
        
        // Handle specific error cases
        if (error.code === '23505') {
          throw new Error('A service with this information already exists')
        } else if (error.code === '23503') {
          throw new Error('Invalid user or reference data')
        } else if (error.code === '42501') {
          throw new Error('Permission denied - check RLS policies')
        } else {
          throw new Error(`Database error: ${error.message || 'Unknown error occurred'}`)
        }
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned from insert operation')
      }
      
      console.log('✅ Service created successfully:', data[0])
      toast.success('Service created successfully!')
      onServiceCreated(data[0])
      onClose()
    } catch (error) {
      console.error('❌ Error creating service:', error)
      toast.error(`Failed to create service: ${error.message}`)
    } finally {
      setLoading(false)
      console.log('🏁 Loading state reset')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Service</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Professional Electrical Services"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 mr-2" />
              Service Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your service, experience, and what makes you special..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="h-4 w-4 mr-2" />
              Price per Hour (₹) *
            </label>
            <input
              type="number"
              required
              min="50"
              max="10000"
              value={formData.price_per_hour}
              onChange={(e) => setFormData({...formData, price_per_hour: e.target.value})}
              placeholder="500"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              Service Location *
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Your service location address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingLocation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
              >
                {gettingLocation ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Navigation className="h-5 w-5" />
                )}
              </button>
            </div>
            {formData.latitude && formData.longitude && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Location captured: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Days
              </label>
              <input
                type="text"
                value={formData.availability_days}
                onChange={(e) => setFormData({...formData, availability_days: e.target.value})}
                placeholder="Monday,Tuesday,Wednesday (comma separated)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 mr-2" />
                Available Hours
              </label>
              <input
                type="text"
                value={formData.availability_hours}
                onChange={(e) => setFormData({...formData, availability_hours: e.target.value})}
                placeholder="9:00 AM - 6:00 PM"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.latitude}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                Creating Service...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Create Service
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}