"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Home, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings,
  DollarSign,
  TrendingUp,
  Hotel,
  Star,
  Menu,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  
  // Room form state
  const [roomForm, setRoomForm] = useState({
    roomTypeName: '',
    pricePerNight: '',
    totalRooms: '',
    roomSize: '',
    bedType: '',
    maxOccupancy: '',
    viewType: '',
    floorNumber: '',
    description: '',
    amenities: [] as string[],
    imageUrl: '',
    status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoomForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle amenity checkbox changes
  const handleAmenityChange = (amenity: string) => {
    setRoomForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Handle form submission
  const handleSubmitRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomTypeName: roomForm.roomTypeName,
          pricePerNight: parseFloat(roomForm.pricePerNight),
          totalRooms: parseInt(roomForm.totalRooms),
          roomSize: roomForm.roomSize ? parseInt(roomForm.roomSize) : null,
          bedType: roomForm.bedType,
          maxOccupancy: parseInt(roomForm.maxOccupancy),
          viewType: roomForm.viewType || null,
          floorNumber: roomForm.floorNumber ? parseInt(roomForm.floorNumber) : null,
          description: roomForm.description,
          amenities: roomForm.amenities,
          imageUrl: roomForm.imageUrl || null,
          status: roomForm.status
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotification({
          show: true,
          type: 'success',
          message: 'Room type added successfully!'
        });
        handleResetForm();
        setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
      } else {
        const error = await response.json();
        setNotification({
          show: true,
          type: 'error',
          message: error.message || 'Failed to add room type'
        });
        setTimeout(() => setNotification({ show: false, type: 'error', message: '' }), 4000);
      }
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to connect to server. Please make sure the backend is running on http://localhost:8080'
      });
      setTimeout(() => setNotification({ show: false, type: 'error', message: '' }), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleResetForm = () => {
    setRoomForm({
      roomTypeName: '',
      pricePerNight: '',
      totalRooms: '',
      roomSize: '',
      bedType: '',
      maxOccupancy: '',
      viewType: '',
      floorNumber: '',
      description: '',
      amenities: [],
      imageUrl: '',
      status: 'active'
    });
  };

  useEffect(() => {
    // Check screen size and update state
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    { label: 'Total Bookings', value: '245', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: '$45,890', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Active Rooms', value: '186', icon: Hotel, color: 'bg-amber-500' },
    { label: 'Avg. Rating', value: '4.9', icon: Star, color: 'bg-purple-500' },
  ];

  const recentBookings = [
    { id: 1, guest: 'John Smith', room: 'Deluxe Suite', checkIn: '2025-11-20', status: 'Confirmed' },
    { id: 2, guest: 'Emma Wilson', room: 'Premium Room', checkIn: '2025-11-22', status: 'Pending' },
    { id: 3, guest: 'Michael Brown', room: 'Executive Suite', checkIn: '2025-11-25', status: 'Confirmed' },
    { id: 4, guest: 'Sarah Davis', room: 'Standard Room', checkIn: '2025-11-28', status: 'Confirmed' },
  ];

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Header */}
            <div className="mb-6 lg:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-2 sm:p-3 rounded-lg`}>
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 lg:mb-8"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Recent Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guest Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room Type
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-In Date
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.guest}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{booking.room}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{booking.checkIn}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'Confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
            >
              <button className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:border-amber-600 transition-all text-left">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 mb-3" />
                <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">New Booking</h4>
                <p className="text-xs sm:text-sm text-gray-600">Create a new reservation</p>
              </button>

              <button className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:border-amber-600 transition-all text-left">
                <Hotel className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 mb-3" />
                <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Manage Rooms</h4>
                <p className="text-xs sm:text-sm text-gray-600">Update room availability</p>
              </button>

              <button className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:border-amber-600 transition-all text-left sm:col-span-2 lg:col-span-1">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 mb-3" />
                <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">View Messages</h4>
                <p className="text-xs sm:text-sm text-gray-600">Check customer inquiries</p>
              </button>
            </motion.div>
          </>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Bookings Management</h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">View and manage all room reservations</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">All Bookings</h3>
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm">
                  + New Booking
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">#{booking.id}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">{booking.guest}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{booking.room}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{booking.checkIn}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={`px-3 py-1 text-xs rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          <button className="text-amber-600 hover:text-amber-800">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'rooms':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Rooms Management</h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage room inventory and availability</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
              {[
                { type: 'Deluxe Suite', total: 50, occupied: 38, price: '$299' },
                { type: 'Premium Room', total: 80, occupied: 62, price: '$199' },
                { type: 'Executive Suite', total: 30, occupied: 18, price: '$399' },
                { type: 'Standard Room', total: 100, occupied: 68, price: '$149' },
              ].map((room, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Hotel className="w-8 h-8 text-amber-600" />
                    <span className="text-lg font-bold text-amber-600">{room.price}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{room.type}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Total Rooms: <span className="font-semibold">{room.total}</span></p>
                    <p>Occupied: <span className="font-semibold text-green-600">{room.occupied}</span></p>
                    <p>Available: <span className="font-semibold text-blue-600">{room.total - room.occupied}</span></p>
                  </div>
                  <button className="mt-4 w-full py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-all">
                    Manage
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Room Type Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Add New Room Type</h3>
                <p className="text-sm text-gray-600">Create a new room category with all essential details</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmitRoom}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Room Type Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Type Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="roomTypeName"
                      value={roomForm.roomTypeName}
                      onChange={handleInputChange}
                      placeholder="e.g., Deluxe Suite"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Price per Night */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Night ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="pricePerNight"
                      value={roomForm.pricePerNight}
                      onChange={handleInputChange}
                      placeholder="299"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Total Rooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Rooms <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="totalRooms"
                      value={roomForm.totalRooms}
                      onChange={handleInputChange}
                      placeholder="50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Room Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Size (sq ft)
                    </label>
                    <input
                      type="number"
                      name="roomSize"
                      value={roomForm.roomSize}
                      onChange={handleInputChange}
                      placeholder="450"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Bed Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bed Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="bedType"
                      value={roomForm.bedType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      required
                    >
                      <option value="">Select bed type</option>
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="queen">Queen</option>
                      <option value="king">King</option>
                      <option value="twin">Twin Beds</option>
                    </select>
                  </div>

                  {/* Max Occupancy */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Occupancy <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="maxOccupancy"
                      value={roomForm.maxOccupancy}
                      onChange={handleInputChange}
                      placeholder="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>

                  {/* View Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      View Type
                    </label>
                    <select
                      name="viewType"
                      value={roomForm.viewType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select view type</option>
                      <option value="ocean">Ocean View</option>
                      <option value="city">City View</option>
                      <option value="garden">Garden View</option>
                      <option value="pool">Pool View</option>
                      <option value="mountain">Mountain View</option>
                    </select>
                  </div>

                  {/* Floor Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floor Number
                    </label>
                    <input
                      type="number"
                      name="floorNumber"
                      value={roomForm.floorNumber}
                      onChange={handleInputChange}
                      placeholder="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={roomForm.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe the room features, amenities, and highlights..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                    required
                  />
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Amenities & Features
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      'WiFi',
                      'TV',
                      'Air Conditioning',
                      'Mini Bar',
                      'Room Service',
                      'Safe',
                      'Balcony',
                      'Coffee Maker',
                      'Hair Dryer',
                      'Iron',
                      'Work Desk',
                      'Bathtub',
                    ].map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roomForm.amenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={roomForm.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/room-image.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter the URL of the room image or Google Drive direct link</p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={roomForm.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 focus:ring-4 focus:ring-amber-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Room Type'}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'guests':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Guest Management</h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">View and manage guest information</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">1,234</p>
                  <p className="text-sm text-gray-600 mt-1">Total Guests</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">856</p>
                  <p className="text-sm text-gray-600 mt-1">Active Guests</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">4.8</p>
                  <p className="text-sm text-gray-600 mt-1">Avg. Rating</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Guests</h3>
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.guest}</p>
                          <p className="text-xs text-gray-500">{booking.room}</p>
                        </div>
                      </div>
                      <button className="text-sm text-amber-600 hover:text-amber-800">View Profile</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages & Inquiries</h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage customer communications</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Inbox</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { name: 'John Smith', subject: 'Booking Inquiry', message: 'Hi, I would like to book a room...', time: '2h ago', unread: true },
                  { name: 'Emma Wilson', subject: 'Special Request', message: 'Can I get a room with ocean view?', time: '5h ago', unread: true },
                  { name: 'Michael Brown', subject: 'Cancellation', message: 'I need to cancel my booking...', time: '1d ago', unread: false },
                  { name: 'Sarah Davis', subject: 'Thank you', message: 'Thanks for the wonderful stay!', time: '2d ago', unread: false },
                ].map((msg, index) => (
                  <div key={index} className={`p-4 hover:bg-gray-50 cursor-pointer ${msg.unread ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-medium ${msg.unread ? 'text-gray-900' : 'text-gray-600'}`}>{msg.name}</p>
                          {msg.unread && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{msg.subject}</p>
                        <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 ml-4">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your account and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue="Admin User" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue="admin@owilka.com" />
                  </div>
                  <button className="w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all">
                    Update Profile
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <button className="w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all">
                    Change Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-3">
                  {['Email notifications for new bookings', 'SMS alerts for cancellations', 'Weekly performance reports'].map((item, index) => (
                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-amber-600" defaultChecked />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-2xl">
            <img 
              src="/assets/pulse-multiple.svg" 
              alt="Loading" 
              className="w-16 h-16 animate-pulse"
            />
            <p className="text-amber-600 font-semibold text-lg">Loading...</p>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notification.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className={`bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all ${
            notification.type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {notification.type === 'success' ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${
                  notification.type === 'success' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {notification.type === 'success' ? 'Success!' : 'Error'}
                </h3>
                <p className="text-gray-700 leading-relaxed">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification({ show: false, type: 'success', message: '' })}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setNotification({ show: false, type: 'success', message: '' })}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  notification.type === 'success'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {!isLargeScreen && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: (isLargeScreen || isSidebarOpen) ? 0 : -300 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="w-64 bg-white shadow-lg fixed h-full z-40 lg:relative lg:z-10"
        style={{ display: !isLargeScreen && !isSidebarOpen ? 'none' : 'block' }}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Hotel className="w-8 h-8 text-amber-600" />
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Owilka Admin</h1>
          </div>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'rooms', label: 'Rooms', icon: Hotel },
            { id: 'guests', label: 'Guests', icon: Users },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (!isLargeScreen) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative cursor-pointer ${
                activeTab === item.id
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{ pointerEvents: 'auto', zIndex: 1 }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => {
              handleLogout();
              if (!isLargeScreen) setIsSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium whitespace-nowrap">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8" style={{ marginLeft: isLargeScreen ? '256px' : '0' }}>
        {renderContent()}
      </main>
    </div>
  );
}
