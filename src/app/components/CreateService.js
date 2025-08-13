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
  Navigation,
  X,
  Sun,
  Moon
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateService({ onClose, onServiceCreated }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
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

      // Handle ARRAY fields properly with better parsing
      if (formData.availability_days?.trim()) {
        const daysInput = formData.availability_days.trim()
        let daysArray = []
        
        // Handle different input formats
        if (daysInput.toLowerCase().includes('mon-fri') || daysInput.toLowerCase().includes('weekdays')) {
          daysArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        } else if (daysInput.toLowerCase().includes('weekend')) {
          daysArray = ['Saturday', 'Sunday']
        } else if (daysInput.toLowerCase().includes('daily') || daysInput.toLowerCase().includes('all days')) {
          daysArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        } else {
          // Split by comma and clean up
          daysArray = daysInput.split(',').map(day => day.trim()).filter(day => day)
          
          // If still just one item and no comma, make it an array
          if (daysArray.length === 1 && !daysInput.includes(',')) {
            daysArray = [daysInput]
          }
        }
        
        serviceData.availability_days = daysArray
      }
      
      if (formData.availability_hours?.trim()) {
        serviceData.availability_hours = formData.availability_hours.trim()
      }
      
      if (formData.images?.trim()) {
        const imagesInput = formData.images.trim()
        // Only split if there are commas, otherwise single item array
        const imagesArray = imagesInput.includes(',') 
          ? imagesInput.split(',').map(img => img.trim()).filter(img => img)
          : [imagesInput]
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`fixed inset-0 bg-cover bg-center z-50 flex items-center justify-center p-4 animate-fadeIn ${
      isDarkMode ? 'bg-gray-950' : 'bg-gray-100'
    }`}
    style={{
      backgroundImage: "url('/mountains.jpg')",
    }}>
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-white/30'} z-0`} />
      
      <div className={`relative z-10 backdrop-blur-2xl ${
        isDarkMode 
          ? 'bg-black/30 border-white/10' 
          : 'bg-white/20 border-white/30 shadow-lg backdrop-blur-3xl'
      } border rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      } animate-slideUp`}>
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold animate-fadeInSlide">Create New Service</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/20'
              } transition`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
            <button
              onClick={onClose}
              className={`${
                isDarkMode ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-800'
              } text-2xl transition`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Service Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Professional Electrical Services"
              className={`w-full px-4 py-3 rounded-xl ${
                isDarkMode
                  ? 'bg-white/5 border-white/10 text-white placeholder-white/50'
                  : 'bg-white/30 border-white/40 text-gray-900 placeholder-gray-400 backdrop-blur-md'
              } border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition`}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Service Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl ${
                isDarkMode
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white/30 border-white/40 text-gray-900 backdrop-blur-md'
              } border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition capitalize`}
            >
              <option value="" className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>Select a category</option>
              {categories.map(category => (
                <option key={category} value={category} className={`capitalize ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`flex items-center text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <FileText className="h-4 w-4 mr-2" />
              Service Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your service, experience, and what makes you special..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl ${
                isDarkMode
                  ? 'bg-white/5 border-white/10 text-white placeholder-white/50'
                  : 'bg-white/30 border-white/40 text-gray-900 placeholder-gray-400 backdrop-blur-md'
              } border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none`}
            />
          </div>

          <div>
            <label className={`flex items-center text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
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
              className={`w-full px-4 py-3 rounded-xl ${
                isDarkMode
                  ? 'bg-white/5 border-white/10 text-white placeholder-white/50'
                  : 'bg-white/30 border-white/40 text-gray-900 placeholder-gray-400 backdrop-blur-md'
              } border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition`}
            />
          </div>

          <div>
            <label className={`flex items-center text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
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
                className={`flex-1 px-4 py-3 rounded-xl ${
                  isDarkMode
                    ? 'bg-white/5 border-white/10 text-white placeholder-white/50'
                    : 'bg-white/30 border-white/40 text-gray-900 placeholder-gray-400 backdrop-blur-md'
                } border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition`}
              />
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingLocation}
                className={`${
                  isDarkMode
                    ? 'bg-teal-500/80 hover:bg-teal-500'
                    : 'bg-teal-600 hover:bg-teal-700'
                } text-white px-4 py-3 rounded-xl font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center backdrop-blur-md`}
              >
                {gettingLocation ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Navigation className="h-5 w-5" />
                )}
              </button>
            </div>
            {formData.latitude && formData.longitude && (
              <p className="text-sm text-teal-400 mt-2 font-medium">
                ✓ Location captured: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Available Days
              </label>
              <input
                type="text"
                value={formData.availability_days}
                onChange={(e) => setFormData({...formData, availability_days: e.target.value})}
                placeholder="Mon-Fri, Weekends, etc."
                className={`w-full px-4 py-3 rounded-xl ${
                  isDarkMode
                    ? 'bg-white/5 border-white/10 text-white placeholder-white/50'
                    : 'bg-white/30 border-white/40 text-gray-900 placeholder-gray-400 backdrop-blur-md'
                } border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition`}
              />
            </div>
            
            <div>
              <label className={`flex items-center text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <Clock className="h-4 w-4 mr-2" />
                Available Hours
              </label>
              <input
                type="text"
                value={formData.availability_hours}
                onChange={(e) => setFormData({...formData, availability_hours: e.target.value})}
                placeholder="9:00 AM - 6:00 PM"
                className={`w-full px-4 py-3 rounded-xl ${
                  isDarkMode
                    ? 'bg-white/5 border-white/10 text-white placeholder-white/50'
                    : 'bg-white/30 border-white/40 text-gray-900 placeholder-gray-400 backdrop-blur-md'
                } border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.latitude}
            className={`w-full ${
              isDarkMode
                ? 'bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600'
                : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700'
            } text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center ${
              loading ? 'animate-pulse' : ''
            }`}
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

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        @keyframes fadeInSlide {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeInSlide {
          animation: fadeInSlide 0.4s ease-out;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse {
          animation: pulse 1s infinite;
        }
      `}</style>
    </div>
  )
}
