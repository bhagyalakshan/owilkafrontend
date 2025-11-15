import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Hotel } from 'lucide-react';

export const Footer: React.FC = () => {
  const companyName = 'Owilka Hotel';
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { name: 'Facebook', href: '#', icon: <Facebook className="w-5 h-5" /> },
    { name: 'Instagram', href: '#', icon: <Instagram className="w-5 h-5" /> },
    { name: 'Twitter', href: '#', icon: <Twitter className="w-5 h-5" /> },
  ];

  const quickLinks = [
    { name: 'Rooms', href: '#rooms' },
    { name: 'Features', href: '#features' },
    { name: 'Special Offers', href: '#offers' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-zinc-900 text-white py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="w-7 h-7 text-amber-500" />
              <div className="font-bold text-2xl">{companyName}</div>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Experience luxury, comfort, and tranquility at Owilka. Your perfect getaway destination for unforgettable memories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-zinc-300 hover:text-amber-500 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-zinc-300">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-300">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>reservations@owilka.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-300">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Paradise Lane<br />Luxury District, Resort City</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-zinc-300 text-sm mb-4">
              Subscribe to receive special offers and updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-zinc-400 text-sm text-center md:text-left">
              © {currentYear} {companyName}. All rights reserved.
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-amber-600 transition-all cursor-pointer"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
