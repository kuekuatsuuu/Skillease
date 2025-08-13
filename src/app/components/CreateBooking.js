"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CreateBooking({ service, onClose, onBookingCreated }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    booking_date: "",
    booking_time: "",
    duration_hours: 1,
    customer_current_lat: null,
    customer_current_lng: null,
    customer_notes: "",
    total_price: service?.price_per_hour || 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };
    if (name === "duration_hours") {
      const hours = parseInt(value) || 1;
      updatedData.total_price = hours * (service?.price_per_hour || 0);
    }
    setFormData(updatedData);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            customer_current_lat: position.coords.latitude,
            customer_current_lng: position.coords.longitude,
          }));
          toast.success("Location captured successfully");
        },
        (error) => {
          console.log("Location error:", error);
          toast.error("Could not get your location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    console.log("User:", user);
    console.log("Service:", service);
    if (!user) {
      toast.error("Please login to create a booking");
      return;
    }
    if (!service) {
      toast.error("Service information is missing");
      return;
    }
    if (!formData.booking_date || !formData.booking_time) {
      toast.error("Please fill in date and time");
      return;
    }
    setLoading(true);
    try {
      const bookingData = {
        service_id: service.id,
        customer_id: user.id,
        provider_id: service.provider_id,
        booking_date: formData.booking_date,
        booking_time: formData.booking_time,
        duration_hours: parseInt(formData.duration_hours),
        status: "pending",
        total_price: formData.total_price,
        customer_notes: formData.customer_notes || null,
        provider_notes: null,
        customer_current_lat: formData.customer_current_lat,
        customer_current_lng: formData.customer_current_lng,
        distance_km: null,
        estimated_travel_time: null,
        payment_status: "pending",
        payment_id: null,
      };
      console.log("Inserting booking data:", bookingData);
      const { data, error } = await supabase
        .from("bookings")
        .insert([bookingData])
        .select();
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      console.log("Booking created successfully:", data);
      if (onBookingCreated && data && data[0]) {
        onBookingCreated(data[0]);
      }
      toast.success("Booking request sent successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return null;
  }


  return (
    <div className="relative bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-6 text-white max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 id="booking-modal-title" className="text-2xl font-semibold">
          Book Service
        </h2>
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="text-xl text-white hover:text-red-400"
        >
          <X />
        </button>
      </div>

      <div className="bg-white/10 border border-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm">
        <h3 className="font-bold text-white">{service?.title || "Service"}</h3>
        <p className="text-gray-200 capitalize">
          {service?.category || "Category"}
        </p>
        <p className="text-green-400 font-semibold mt-2">
          ₹{service?.price_per_hour || 0}/hour
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="booking-date"
            className="flex items-center gap-2 text-sm font-medium mb-1"
          >
            <Calendar className="w-4 h-4" />
            Preferred Date
          </label>
          <input
            id="booking-date"
            type="date"
            name="booking_date"
            required
            min={new Date().toISOString().split("T")[0]}
            value={formData.booking_date}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label
            htmlFor="booking-time"
            className="flex items-center gap-2 text-sm font-medium mb-1"
          >
            <Clock className="w-4 h-4" />
            Preferred Time
          </label>
          <input
            id="booking-time"
            type="time"
            name="booking_time"
            required
            value={formData.booking_time}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label
            htmlFor="duration-hours"
            className="flex items-center gap-2 text-sm font-medium mb-1"
          >
            <Clock className="w-4 h-4" />
            Duration (hours)
          </label>
          <select
            id="duration-hours"
            name="duration_hours"
            value={formData.duration_hours}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
              <option key={hour} value={hour}>
                {hour} hour{hour > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="customer-location"
            className="flex items-center gap-2 text-sm font-medium mb-1"
          >
            <MapPin className="w-4 h-4" />
            Your Location (Optional)
          </label>
          <button
            type="button"
            onClick={getCurrentLocation}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
          >
            {formData.customer_current_lat && formData.customer_current_lng
              ? `Location captured (${formData.customer_current_lat.toFixed(
                  4
                )}, ${formData.customer_current_lng.toFixed(4)})`
              : "Click to capture current location"}
          </button>
        </div>

        <div>
          <label
            htmlFor="customer-notes"
            className="flex items-center gap-2 text-sm font-medium mb-1"
          >
            <MessageSquare className="w-4 h-4" />
            Notes (Optional)
          </label>
          <textarea
            id="customer-notes"
            name="customer_notes"
            rows={3}
            value={formData.customer_notes}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Any specific instructions..."
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-2">
          <div className="flex justify-between items-center">
            <span>Total Price</span>
            <span className="text-lg font-semibold text-green-400">
              ₹{formData.total_price.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            ₹{service?.price_per_hour || 0}/hour × {formData.duration_hours}{" "}
            hour{formData.duration_hours > 1 ? "s" : ""}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
        >
          {loading ? "Creating Booking..." : "Book Now"}
        </button>
      </form>
    </div>
  );
}
