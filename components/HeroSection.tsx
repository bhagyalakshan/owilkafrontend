import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1569664370706-e26397378b09?auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white leading-tight md:leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to Owilka
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Your perfect getaway awaits. Experience luxury, comfort, and tranquility in our premium rooms designed for an unforgettable stay.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.a
              href="#rooms"
              className="flex items-center justify-center px-8 py-4 bg-amber-600 text-white rounded-lg shadow-lg hover:bg-amber-700 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span className="mr-2">Book Your Stay</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>

            <motion.a
              href="#features"
              className="flex items-center justify-center px-8 py-4 border-2 border-white bg-white/10 backdrop-blur-sm text-white rounded-lg shadow-md hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span>Explore Features</span>
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            {[
              { number: '200+', label: 'Premium Rooms' },
              { number: '4.9★', label: 'Guest Rating' },
              { number: '24/7', label: 'Concierge Service' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="text-center hover:-translate-y-0.5 transition-transform duration-200"
              >
                <div className="text-3xl font-bold text-white drop-shadow-md">{stat.number}</div>
                <div className="text-sm text-white/80 mt-1 drop-shadow-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-white/70" />
      </motion.div>
    </section>
  );
};
