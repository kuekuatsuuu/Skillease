'use client'

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Star, MessageSquare, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReviewModal({ booking, onClose, onReviewSubmitted }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setLoading(true)

    try {
      // Insert review
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .insert([
          {
            booking_id: booking.id,
            service_id: booking.service_id,
            customer_id: user.id,
            provider_id: booking.provider_id,
            rating: rating,
            comment: comment.trim() || null
          }
        ])
        .select()

      if (reviewError) throw reviewError

      // Update service average rating
      const { data: existingReviews, error: fetchError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('service_id', booking.service_id)

      if (fetchError) throw fetchError

      const totalRating = existingReviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / existingReviews.length
      const totalReviews = existingReviews.length

      const { error: updateError } = await supabase
        .from('services')
        .update({
          average_rating: averageRating,
          total_reviews: totalReviews
        })
        .eq('id', booking.service_id)

      if (updateError) throw updateError

      // Mark booking as reviewed
      const { error: bookingUpdateError } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', booking.id)

      if (bookingUpdateError) throw bookingUpdateError

      toast.success('Review submitted successfully!')
      onReviewSubmitted(reviewData[0])
      onClose()

    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
        className="focus:outline-none transition-colors"
      >
        <Star
          className={`h-8 w-8 ${
            star <= (hoveredRating || rating)
              ? 'text-yellow-500 fill-current'
              : 'text-gray-300'
          }`}
        />
      </button>
    ))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Completed!</h2>
          <p className="text-gray-600">How was your experience?</p>
        </div>

        {/* Service Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-1">{booking.services?.title}</h3>
          <p className="text-gray-600 text-sm capitalize">{booking.services?.category}</p>
          <p className="text-green-600 font-semibold mt-2">₹{booking.total_price} • {booking.duration_hours}h</p>
        </div>

        <form onSubmit={handleSubmitReview} className="space-y-6">
          {/* Rating */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rate this service
            </label>
            <div className="flex justify-center space-x-1 mb-2">
              {renderStars()}
            </div>
            <p className="text-sm text-gray-500">
              {rating === 0 && 'Click to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="h-4 w-4 mr-2" />
              Share your experience (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about the quality of service, professionalism, and overall experience..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Skip Review
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}