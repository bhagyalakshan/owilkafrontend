import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Tag, Calendar, ArrowRight } from 'lucide-react';
import { specialOffers } from '../data/mockRooms';

export const SpecialOffersSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section ref={containerRef} id="offers" className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            Special Offers
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Take advantage of our exclusive deals and limited-time offers for an even more memorable stay.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {specialOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-2/5 h-48 md:h-auto relative overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-md transform -rotate-3">
                    {offer.discount}
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-3/5 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-amber-700 mb-2">
                      <Tag className="w-4 h-4" />
                      <span className="text-sm font-semibold">Limited Time Offer</span>
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 mb-3">{offer.title}</h3>
                    <p className="text-zinc-600 mb-4">{offer.description}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>Valid until {new Date(offer.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>

                    <motion.a
                      href="#rooms"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-md cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Claim Offer</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
