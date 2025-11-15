import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Wifi, Coffee, Utensils, Car, Waves, Dumbbell } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { 
    once: true, 
    margin: "-100px 0px -100px 0px"
  });
  
  const title = 'Premium Amenities & Services';
  const description = 'Everything you need for a comfortable and memorable stay, thoughtfully provided for your convenience.';
  
  const features = [
    {
      icon: <Wifi className="w-8 h-8" />,
      title: 'High-Speed WiFi',
      description: 'Stay connected with complimentary high-speed internet access throughout the hotel.',
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: 'Fine Dining',
      description: 'Experience exquisite cuisine at our on-site restaurant with international and local flavors.',
    },
    {
      icon: <Waves className="w-8 h-8" />,
      title: 'Swimming Pool',
      description: 'Relax and unwind in our stunning outdoor pool with panoramic views.',
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: 'Fitness Center',
      description: 'Maintain your workout routine with our state-of-the-art fitness facilities.',
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: 'Free Parking',
      description: 'Complimentary secure parking available for all guests during their stay.',
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: 'Room Service',
      description: '24/7 room service delivering comfort and convenience right to your door.',
    },
  ];

  return (
    <section 
      ref={containerRef}
      id="features" 
      className="py-20 px-6 bg-zinc-50"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h2>
          
          <motion.p 
            className="text-lg text-zinc-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-default"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: 0.2 + index * 0.1,
                ease: "easeOut" 
              }}
              whileHover={{ y: -8 }}
            >
              <motion.div 
                className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300"
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                {feature.icon}
              </motion.div>
              
              <h3 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-zinc-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
