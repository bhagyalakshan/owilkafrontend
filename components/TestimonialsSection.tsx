import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const title = 'Guest Reviews';
  
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Thompson',
      location: 'New York, USA',
      content: 'Absolutely stunning hotel! The room was immaculate, the staff was incredibly attentive, and the views were breathtaking. I can\'t wait to return to Owilka.',
      avatar: 'ST',
      rating: 5,
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      location: 'Barcelona, Spain',
      content: 'Perfect getaway for our anniversary. The luxury suite exceeded all expectations. The attention to detail and personalized service made our stay unforgettable.',
      avatar: 'MR',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emily Chen',
      location: 'Singapore',
      content: 'A truly peaceful retreat. The amenities were top-notch and the breakfast buffet was exceptional. Highly recommend Owilka for anyone seeking comfort and elegance.',
      avatar: 'EC',
      rating: 5,
    },
    {
      id: 4,
      name: 'David Anderson',
      location: 'London, UK',
      content: 'Outstanding experience from check-in to check-out. The concierge team went above and beyond to ensure we had a memorable vacation. Will definitely be back!',
      avatar: 'DA',
      rating: 5,
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  return (
    <section
      ref={containerRef}
      className="py-20 px-6 bg-gradient-to-b from-white to-amber-50/30"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">{title}</h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Hear from our guests about their unforgettable experiences at Owilka.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                ))}
              </div>

              {/* Review Content */}
              <p className="text-zinc-700 leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">{testimonial.name}</div>
                  <div className="text-sm text-zinc-500">{testimonial.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
