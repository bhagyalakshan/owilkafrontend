export interface Room {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  maxGuests: number;
  size: string;
  available: boolean;
}

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Deluxe King Room',
    category: 'Deluxe',
    description: 'Spacious room with a luxurious king-size bed, modern amenities, and stunning views. Perfect for couples seeking comfort and elegance.',
    price: 189,
    image: 'https://images.unsplash.com/photo-1666813721996-42956e40788e?auto=format&fit=crop&w=1080&q=80',
    features: ['King Size Bed', 'City View', 'Free WiFi', 'Smart TV', 'Mini Bar', 'Coffee Maker'],
    maxGuests: 2,
    size: '35 m²',
    available: true
  },
  {
    id: '2',
    name: 'Executive Suite',
    category: 'Suite',
    description: 'Elegant suite featuring a separate living area, premium bedding, and exclusive amenities. Ideal for extended stays and business travelers.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1758448755969-8791367cf5c5?auto=format&fit=crop&w=1080&q=80',
    features: ['Separate Living Room', 'King Size Bed', 'Work Desk', 'Premium Bathroom', 'Complimentary Breakfast', 'Concierge Service'],
    maxGuests: 2,
    size: '55 m²',
    available: true
  },
  {
    id: '3',
    name: 'Premium Double Room',
    category: 'Premium',
    description: 'Comfortable room with two queen beds, contemporary design, and all essential amenities. Perfect for families or friends traveling together.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1729605412224-147d072d3667?auto=format&fit=crop&w=1080&q=80',
    features: ['Two Queen Beds', 'Garden View', 'Free WiFi', 'Air Conditioning', 'Room Service', 'Safe Deposit Box'],
    maxGuests: 4,
    size: '42 m²',
    available: true
  }
];

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  image: string;
}

export const specialOffers: SpecialOffer[] = [
  {
    id: '1',
    title: 'Early Bird Special',
    description: 'Book 30 days in advance and save 25% on your stay',
    discount: '25% OFF',
    validUntil: '2025-12-31',
    image: 'https://images.unsplash.com/photo-1552858725-2758b5fb1286?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '2',
    title: 'Weekend Getaway',
    description: 'Stay Friday to Sunday and get complimentary breakfast',
    discount: 'Free Breakfast',
    validUntil: '2025-11-30',
    image: 'https://images.unsplash.com/photo-1601565415267-724db0e9fbdf?auto=format&fit=crop&w=400&q=80'
  }
];
