'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { CreditCard, Shield, Clock, CheckCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function PaymentModal({ booking, onClose, onPaymentSuccess }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    loadRazorpayScript().then(setScriptLoaded)
  }, [])

  const createRazorpayOrder = async () => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: booking.total_price * 100, // Razorpay expects amount in paise
          currency: 'INR',
          bookingId: booking.id
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      return data.orderId
    } catch (error) {
      console.error('Error creating Razorpay order:', error)
      throw error
    }
  }

  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast.error('Payment system is loading. Please try again.')
      return
    }

    setLoading(true)

    try {
      // Create order
      const orderId = await createRazorpayOrder()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: booking.total_price * 100,
        currency: 'INR',
        name: 'LocalConnect',
        description: `Payment for ${booking.services?.title}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: booking.id
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              // Update booking status in database
              await supabase
                .from('bookings')
                .update({
                  status: 'confirmed',
                  payment_status: 'paid',
                  payment_id: response.razorpay_payment_id,
                  updated_at: new Date().toISOString()
                })
                .eq('id', booking.id)

              toast.success('Payment successful! Booking confirmed.')
              onPaymentSuccess(booking.id)
            } else {
              throw new Error(verifyData.error || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
          email: user.email,
          contact: user.phone || '9999999999'
        },
        notes: {
          booking_id: booking.id,
          service_title: booking.services?.title,
          customer_id: user.id
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error)
        toast.error('Payment failed. Please try again.')
        setLoading(false)
      })

      rzp.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Failed to initialize payment. Please try again.')
      setLoading(false)
    }
  }

  if (!booking) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">Complete payment to secure your booking</p>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">{booking.services?.title}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium capitalize">{booking.services?.category}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-medium">
                {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{booking.duration_hours} hour(s)</span>
            </div>
            
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-3">
              <span className="text-gray-900 font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-green-600">₹{booking.total_price}</span>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-center mb-2">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-900">Secure Payment</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 256-bit SSL encryption</li>
            <li>• PCI DSS compliant</li>
            <li>• Instant refund on cancellation</li>
          </ul>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={loading || !scriptLoaded}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Pay ₹{booking.total_price} Now
            </>
          )}
        </button>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="w-full mt-3 text-gray-600 hover:text-gray-800 py-2 font-medium transition-colors"
        >
          Cancel Payment
        </button>

        {/* Payment Methods */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-2">Powered by Razorpay</p>
          <div className="flex justify-center space-x-2 text-xs text-gray-400">
            <span>UPI</span> • <span>Cards</span> • <span>Net Banking</span> • <span>Wallets</span>
          </div>
        </div>
      </div>
    </div>
  )
}