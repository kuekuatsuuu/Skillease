"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Navigation,
  ArrowLeft,
} from "lucide-react";


export default function ServicesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  const categories = [
    "all",
    "electrician",
    "plumber",
    "tutor",
    "cleaner",
    "fitness trainer",
    "photographer",
    "gardener",
    "painter",
  ];

  // Get user location on mount (if allowed)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          setUserLocation(null);
        }
      );
    }
    fetchServices();
  }, []);

  useEffect(() => {
    filterAndSortServices();
  }, [services, searchTerm, selectedCategory, sortBy]);

  // Haversine formula for distance in km
  function calculateDistance(lat1, lon1, lat2, lon2) {
    if (
      lat1 == null ||
      lon1 == null ||
      lat2 == null ||
      lon2 == null
    )
      return null;
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const fetchServices = async () => {
    setLoading(true);
    // Fetch services with provider info and aggregate ratings
    let { data, error } = await supabase
      .from("services")
      .select(
        `
        *,
        profiles:provider_id (full_name, city, phone, latitude, longitude),
        reviews:reviews(id, rating)
      `
      )
      .eq("is_active", true);

    if (error) {
      setServices([]);
      setLoading(false);
      return;
    }

    // Calculate average rating, total reviews, and flatten provider info
    const servicesWithRatings = data.map((service) => {
      const ratings = service.reviews || [];
      const average_rating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) /
            ratings.length
          : 0;
      const total_reviews = ratings.length;
      // Calculate distance if user location and provider location are available
      let distance = null;
      if (
        userLocation &&
        service.profiles?.latitude != null &&
        service.profiles?.longitude != null
      ) {
        distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          service.profiles.latitude,
          service.profiles.longitude
        );
      }
      return {
        ...service,
        provider_name: service.profiles?.full_name || "",
        provider_city: service.profiles?.city || "",
        phone: service.profiles?.phone || "",
        average_rating,
        total_reviews,
        distance: distance !== null ? Number(distance.toFixed(2)) : null,
        availability_hours: service.availability_hours || "Flexible",
      };
    });
    setServices(servicesWithRatings);
    setLoading(false);
  };

  const filterAndSortServices = () => {
    let filtered = [...services];
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          service.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.provider_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (service) =>
          service.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.average_rating || 0) - (a.average_rating || 0);
        case "price_low":
          return (a.price_per_hour || 0) - (b.price_per_hour || 0);
        case "price_high":
          return (b.price_per_hour || 0) - (a.price_per_hour || 0);
        case "distance":
          return (a.distance || 0) - (b.distance || 0);
        case "reviews":
          return (b.total_reviews || 0) - (a.total_reviews || 0);
        default:
          return 0;
      }
    });
    setFilteredServices(filtered);
  };

  const handleBookService = (service) => {
    if (!user) {
      alert("Please login to book a service");
      return;
    }
    alert(
      `Booking ${service.title}!\n\nThis will be connected to the booking system once it's ready.`
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="h-4 w-4 text-yellow-500 fill-current opacity-50"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
      <div className="h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative">
        <div className="text-6xl">
          {service.category === "electrician" && "⚡"}
          {service.category === "plumber" && "🔧"}
          {service.category === "tutor" && "📚"}
          {service.category === "cleaner" && "🧹"}
          {service.category === "fitness trainer" && "💪"}
          {service.category === "photographer" && "📸"}
          {service.category === "gardener" && "🌱"}
          {service.category === "painter" && "🎨"}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
          <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
          <span className="text-sm font-bold">
            {service.average_rating?.toFixed(1)}
          </span>
        </div>

        {/* Distance Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
          <Navigation className="h-4 w-4 text-blue-500 mr-1" />
          <span className="text-sm font-medium">{service.distance}km</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 flex-1">
            {service.title}
          </h3>
        </div>

        {/* Star Rating Display */}
        <div className="flex items-center mb-3">
          <div className="flex mr-2">{renderStars(service.average_rating)}</div>
          <span className="text-sm text-gray-600">
            ({service.total_reviews} review
            {service.total_reviews !== 1 ? "s" : ""})
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            <span>{service.provider_city}</span>
            <span className="ml-2 text-blue-600 font-medium">
              • {service.distance}km away
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
            <span className="font-semibold text-green-600">
              ₹{service.price_per_hour}/hour
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2 text-purple-500" />
            {service.availability_hours}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm">
            <p className="font-semibold text-gray-900">
              {service.provider_name}
            </p>
            <p className="text-gray-500 capitalize">{service.category}</p>
          </div>
          <button
            onClick={() => handleBookService(service)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-4">
            <Link
              href="/"
              className="mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold mb-2">Find Local Services</h1>
              <p className="text-xl text-blue-100">
                Discover trusted professionals in your area
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">→</span>
            <span className="text-gray-900 font-medium">Services</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search services, providers, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="capitalize">
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="distance">Nearest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600 flex items-center">
            <span className="font-semibold text-gray-900">
              {filteredServices.length}
            </span>
            <span className="ml-1">
              services found
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </span>
          </p>

          <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <Navigation className="h-4 w-4 mr-2" />
            Location: Kochi area
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No services found
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Try adjusting your search criteria or exploring different
              categories
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of customers finding amazing local services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link
                  href="/signup"
                  className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Sign Up to Book
                </Link>
                <Link
                  href="/login"
                  className="bg-transparent hover:bg-white/10 text-white px-8 py-3 rounded-xl font-semibold border-2 border-white transition-colors"
                >
                  Already have an account?
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
