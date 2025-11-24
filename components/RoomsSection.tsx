import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Maximize, Check, Calendar } from 'lucide-react';

interface RoomsSectionProps {
  onBookRoom?: (roomId: string) => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({ onBookRoom }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/rooms');
        if (response.ok) {
          const data = await response.json();
          // Filter only active rooms and map to match component structure
          const activeRooms = data
            .filter((room: any) => room.status === 'active')
            .map((room: any) => ({
              id: room.id,
              name: room.roomTypeName,
              category: room.bedType ? room.bedType.charAt(0).toUpperCase() + room.bedType.slice(1) : 'Standard',
              price: room.pricePerNight,
              description: room.description || 'Experience luxury and comfort in our well-appointed rooms.',
              image: room.imageUrl || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
              maxGuests: room.maxOccupancy || 2,
              size: room.roomSize || '350 sq ft',
              features: room.amenities || [],
              available: (room.totalRooms - (room.occupiedRooms || 0)) > 0
            }));
          setRooms(activeRooms);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <section ref={containerRef} id="rooms" className="py-20 px-6 bg-gradient-to-b from-white to-amber-50/30">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            Our Premium Guest Houses
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Choose from our carefully designed rooms, each offering comfort, elegance, and modern amenities for the perfect stay.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No rooms available at the moment.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Room Image */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                  {room.category}
                </div>
                {room.available && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Available
                  </div>
                )}
              </div>

              {/* Room Details */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">{room.name}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">{room.description}</p>
                </div>

                {/* Room Info */}
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{room.maxGuests} Guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    <span>{room.size}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {room.features.slice(0, 3).map((feature: string) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {room.features.length > 3 && (
                    <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs rounded-full">
                      +{room.features.length - 3} more
                    </span>
                  )}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
                  <div>
                    <div className="text-sm text-zinc-500">Starting from</div>
                    <div className="text-2xl font-bold text-amber-600">
                      ${room.price}
                      <span className="text-sm text-zinc-500 font-normal">/night</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => onBookRoom?.(room.id)}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Calendar className="w-4 h-4" />
                    Book
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};
