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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen || window.innerWidth >= 1024 ? 0 : -300 }}
        className={`w-64 bg-white shadow-lg fixed h-full z-40 lg:z-10 ${
          isSidebarOpen ? 'block' : 'hidden lg:block'
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Hotel className="w-8 h-8 text-amber-600" />
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Owilka Admin</h1>
          </div>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
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
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => {
              handleLogout();
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
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
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
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
          className="mt-6 lg:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
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
      </main>
    </div>
  );
}
