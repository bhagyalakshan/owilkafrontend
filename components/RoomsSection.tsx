import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Maximize, Check, Calendar } from 'lucide-react';
import { rooms } from '../data/mockRooms';

interface RoomsSectionProps {
  onBookRoom?: (roomId: string) => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({ onBookRoom }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

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
            Our Premium Rooms
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Choose from our carefully designed rooms, each offering comfort, elegance, and modern amenities for the perfect stay.
          </p>
        </motion.div>

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
                  {room.features.slice(0, 3).map((feature) => (
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
      </div>
    </section>
  );
};
