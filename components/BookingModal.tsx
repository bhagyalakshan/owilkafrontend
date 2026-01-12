import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Check, Mail, Phone, User } from 'lucide-react';
import { rooms } from '../data/mockRooms';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, roomId }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<any>(null);

  // Set minimum dates
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Fetch room data from backend
    const fetchRoom = async () => {
      if (roomId) {
        try {
          const response = await fetch(`http://localhost:8080/api/rooms/${roomId}`);
          if (response.ok) {
            const data = await response.json();
            setRoom({
              id: data.id,
              name: data.roomTypeName,
              category: data.bedType ? data.bedType.charAt(0).toUpperCase() + data.bedType.slice(1) : 'Standard',
              price: data.pricePerNight,
              description: data.description || 'Experience luxury and comfort.',
              image: data.imageUrl || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
              maxGuests: data.maxOccupancy || 2,
              size: data.roomSize || '350 sq ft',
              features: data.amenities || []
            });
          }
        } catch (error) {
          console.error('Error fetching room:', error);
          // Fallback to mockRooms if backend fails
          const fallbackRoom = rooms.find(r => r.id === roomId);
          setRoom(fallbackRoom);
        }
      }
    };
    
    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setTimeout(() => {
        setCheckIn('');
        setCheckOut('');
        setGuests(1);
        setGuestName('');
        setGuestEmail('');
        setGuestPhone('');
        setSpecialRequests('');
        setBookingSuccess(false);
        setError(null);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create booking object
      const bookingData = {
        roomId: roomId,
        guestName,
        guestEmail,
        guestPhone,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        totalPrice: calculateTotalPrice(),
        specialRequests: specialRequests || null,
        status: 'CONFIRMED'
      };

      // Send to Spring Boot backend
      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const result = await response.json();
      console.log('Booking created successfully:', result);

      setIsSubmitting(false);
      setBookingSuccess(true);

      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setError(error.message || 'Failed to create booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!room || !checkIn || !checkOut) return 0;
    const days = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return days * room.price;
  };

  if (!room) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {bookingSuccess ? (
                // Success State
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-zinc-900 mb-3">Booking Confirmed!</h3>
                  <p className="text-zinc-600 mb-6">
                    Your reservation at Owilka has been successfully confirmed. We look forward to welcoming you!
                  </p>
                  <div className="bg-amber-50 p-4 rounded-lg mb-4">
                    <div className="text-sm text-zinc-700">
                      <p><strong>Guest:</strong> {guestName}</p>
                      <p><strong>Check-in:</strong> {new Date(checkIn).toLocaleDateString()}</p>
                      <p><strong>Check-out:</strong> {new Date(checkOut).toLocaleDateString()}</p>
                      <p><strong>Total:</strong> ${calculateTotalPrice()}</p>
                    </div>
                  </div>
                  <div className="text-sm text-zinc-500">
                    A confirmation email has been sent to {guestEmail}
                  </div>
                </div>
              ) : (
                // Booking Form
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between p-6 border-b border-zinc-200">
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900 mb-1">Book Your Stay</h3>
                      <p className="text-zinc-600">{room?.name}</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-zinc-500" />
                    </button>
                  </div>

                  {/* Room Preview */}
                  {room && (
                  <div className="p-6 border-b border-zinc-200">
                    <div className="flex gap-4">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="text-sm text-zinc-500 mb-1">{room.category}</div>
                        <div className="font-semibold text-zinc-900 mb-2">{room.name}</div>
                        <div className="text-sm text-zinc-600">
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Up to {room.maxGuests} guests
                          </span>
                          <span className="mx-2">•</span>
                          {room.size}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-600">${room.price}</div>
                        <div className="text-sm text-zinc-500">per night</div>
                      </div>
                    </div>
                  </div>
                  )}

                  {/* Booking Form */}
                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    {/* Guest Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-zinc-800">Guest Information</h4>
                      
                      <div>
                        <label htmlFor="guestName" className="block text-sm font-semibold text-zinc-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                          <input
                            type="text"
                            id="guestName"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="guestEmail" className="block text-sm font-semibold text-zinc-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                          <input
                            type="email"
                            id="guestEmail"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="guestPhone" className="block text-sm font-semibold text-zinc-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                          <input
                            type="tel"
                            id="guestPhone"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-4 pt-4 border-t border-zinc-200">
                      <h4 className="text-lg font-semibold text-zinc-800">Booking Details</h4>
                      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="checkIn" className="block text-sm font-semibold text-zinc-700 mb-2">
                          Check-in Date *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                          <input
                            type="date"
                            id="checkIn"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            min={today}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="checkOut" className="block text-sm font-semibold text-zinc-700 mb-2">
                          Check-out Date *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                          <input
                            type="date"
                            id="checkOut"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={checkIn || today}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="guests" className="block text-sm font-semibold text-zinc-700 mb-2">
                        Number of Guests *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <select
                          id="guests"
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                        >
                          {room && [...Array(room.maxGuests)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="specialRequests" className="block text-sm font-semibold text-zinc-700 mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        id="specialRequests"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none resize-none"
                        placeholder="Any special requests or requirements..."
                      />
                    </div>
                    </div>

                    {/* Price Summary */}
                    {checkIn && checkOut && room && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-zinc-600">Total Price</div>
                            <div className="text-xs text-zinc-500">
                              {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights × ${room.price}
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-amber-600">
                            ${calculateTotalPrice()}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 rounded-lg font-semibold transition-all shadow-md ${
                        isSubmitting
                          ? 'bg-zinc-400 text-white cursor-not-allowed'
                          : 'bg-amber-600 text-white hover:bg-amber-700 cursor-pointer'
                      }`}
                      whileHover={isSubmitting ? {} : { scale: 1.02 }}
                      whileTap={isSubmitting ? {} : { scale: 0.98 }}
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
