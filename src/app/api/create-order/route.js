// src/app/api/create-order/route.js
import Razorpay from 'razorpay'
import { NextResponse } from 'next/server'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export async function POST(request) {
  try {
    const { amount, currency, bookingId } = await request.json()

    const options = {
      amount: amount, // amount in paise
      currency: currency || 'INR',
      receipt: `booking_${bookingId}_${Date.now()}`,
      notes: {
        booking_id: bookingId
      }
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}