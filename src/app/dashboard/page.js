"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ReviewModal from "../components/ReviewModal";
import Link from "next/link";
import {
  Calendar,
  Star,
  TrendingUp,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  Search,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, signOut, handleAuthFetchError } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("customer");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
    reviewsGiven: 0,
  });

  useEffect(() => {
    if (user) {
      setUserName(
        user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
      );
      setUserType(user.user_metadata?.user_type || "customer");
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    console.log("[Dashboard] user:", user);
    console.log("[Dashboard] loading:", loading);
  }, [user, loading]);

  const fetchUserData = async () => {
    if (!user) return;
    try {
      console.log("[Dashboard] Fetching user bookings and stats...");
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select(
          `*,services!bookings_service_id_fkey(title,category,price_per_hour),profiles!bookings_provider_id_fkey(full_name,phone)`
        )
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });
      console.log("[Dashboard] Bookings data:", bookingsData);
      if (bookingsError) {
        console.error("[Dashboard] Bookings error:", bookingsError);
        await handleAuthFetchError?.(bookingsError);
        throw bookingsError;
      }
      setBookings(bookingsData || []);
      const stats = {
        totalBookings: bookingsData?.length || 0,
        pendingBookings:
          bookingsData?.filter((b) => b.status === "pending").length || 0,
        completedBookings:
          bookingsData?.filter((b) => b.status === "completed").length || 0,
        totalSpent:
          bookingsData?.reduce(
            (sum, b) => sum + (parseFloat(b.total_price) || 0),
            0
          ) || 0,
        reviewsGiven: 0,
      };
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("id")
        .eq("customer_id", user.id);
      if (reviewsError) {
        console.error("[Dashboard] Reviews error:", reviewsError);
        await handleAuthFetchError?.(reviewsError);
      }
      stats.reviewsGiven = reviewsData?.length || 0;
      setStats(stats);
      console.log("[Dashboard] Stats:", stats);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleReviewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = () => {
    fetchUserData();
    setShowReviewModal(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "completed":
        return <Award className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const isProvider = userType === "provider";

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-cover bg-center relative animate-fadeIn bg-gray-100"
        style={{ backgroundImage: "url('/mountains.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/30 z-0" />
        <div className="relative z-10 w-full">
          <nav className="sticky top-0 z-50 animate-slideUp bg-white/20 border-white/30 shadow-lg backdrop-blur-3xl border">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
              <div className="flex justify-between h-20">
                <div className="flex items-center">
                  <Link
                    href="/"
                    className="text-3xl font-bold animate-fadeInSlide text-gray-900"
                  >
                    SkilLease
                  </Link>
                  <div className="ml-12 hidden md:flex items-baseline space-x-10">
                    <span className="font-semibold text-lg flex items-center animate-fadeInSlide delay-200 text-teal-600"></span>
                    <Link
                      href="/services"
                      className="transition-colors text-lg flex items-center animate-fadeInSlide delay-200 text-gray-600 hover:text-teal-600"
                    >
                      Services
                    </Link>
                    {isProvider && (
                      <Link
                        href="/provider-dashboard"
                        className="transition-colors text-lg flex items-center animate-fadeInSlide delay-200 text-gray-600 hover:text-teal-600"
                      >
                        <TrendingUp className="h-5 w-5 mr-2 text-gray-500" />
                        Provider View
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <button
                    onClick={handleLogout}
                    className="transition-colors animate-fadeInSlide delay-200 text-gray-600 hover:text-teal-600"
                  >
                    Logout
                  </button>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-base font-semibold text-gray-900">
                        {userName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-5xl mx-auto py-10 px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Bookings
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalBookings}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.pendingBookings}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Completed
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.completedBookings}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Reviews Given
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.reviewsGiven}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Bookings
              </h2>
              {bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="border-b last:border-b-0 pb-6 mb-6 last:mb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(booking.status)}
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(booking.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-semibold text-lg text-gray-900">
                            {booking.services?.title}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {booking.services?.category}
                          </div>
                          <div className="text-gray-500 text-sm">
                            Provider: {booking.profiles?.full_name}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4 md:mt-0">
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium">
                              {new Date(
                                booking.booking_date
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Time</p>
                            <p className="font-medium">
                              {booking.booking_time}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Duration</p>
                            <p className="font-medium">
                              {booking.duration_hours}h
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Price</p>
                            <p className="font-medium text-green-600">
                              ₹{booking.total_price}
                            </p>
                          </div>
                        </div>
                      </div>
                      {booking.status === "completed" && (
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-green-600 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Service completed successfully
                          </div>
                          <button
                            onClick={() => handleReviewBooking(booking)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Write Review
                          </button>
                        </div>
                      )}
                      {booking.customer_notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <MessageSquare className="h-4 w-4 inline mr-1" />
                            <strong>Your note:</strong> {booking.customer_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  {bookings.length > 5 && (
                    <div className="text-center pt-4">
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        View all {bookings.length} bookings →
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    No bookings yet
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">
                    Discover amazing local services and make your first booking!
                  </p>
                  <Link
                    href="/services"
                    className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Browse Services
                  </Link>
                </div>
              )}
            </div>
            {/* Review Modal */}
            {showReviewModal && selectedBooking && (
              <ReviewModal
                booking={selectedBooking}
                onClose={() => {
                  setShowReviewModal(false);
                  setSelectedBooking(null);
                }}
                onReviewSubmitted={handleReviewSubmitted}
              />
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
