"use client";

import { useState } from 'react';
import { FloatingActionButton, ScrollProgress } from '../components/ScrollComponents';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { RoomsSection } from '../components/RoomsSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { SpecialOffersSection } from '../components/SpecialOffersSection';
import { ContactForm } from '../components/ContactForm';
import { Footer } from '../components/Footer';
import { BookingModal } from '../components/BookingModal';


function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const handleBookRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <main className="min-h-screen bg-white text-black overflow-x-hidden relative">
        <ScrollProgress/>
        <div className="relative z-10">
          <Header/>
          <HeroSection />
          <RoomsSection onBookRoom={handleBookRoom} />
          <FeaturesSection />
          <TestimonialsSection />
          <SpecialOffersSection />
          <ContactForm />
          <Footer />
        </div>
        <FloatingActionButton />
      </main>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        roomId={selectedRoomId}
      />
    </>
  );
}

export default App;
