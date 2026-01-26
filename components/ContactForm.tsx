import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      message: ''
    };
    
    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
      isValid = false;
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Name must not exceed 100 characters';
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Validate message
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      errors.message = `Message must be at least 10 characters (currently ${formData.message.trim().length})`;
      isValid = false;
    } else if (formData.message.trim().length > 1000) {
      errors.message = 'Message must not exceed 1000 characters';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      // Log the data being sent for debugging
      console.log('Sending contact form data:', formData);
      
      // Replace with your actual Spring Boot backend URL
      const response = await fetch('http://localhost:8080/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server error response:', errorData);
        
        // Handle validation errors
        if (response.status === 400 && errorData) {
          if (errorData.errors && Array.isArray(errorData.errors)) {
            // Spring Boot validation error format - errors is an array
            const validationErrors = errorData.errors
              .map((err: any) => `${err.field}: ${err.defaultMessage}`)
              .join('; ');
            throw new Error(validationErrors);
          } else if (errorData.message) {
            throw new Error(errorData.message);
          }
        }
        
        throw new Error(errorData?.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);
      
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      setSubmitStatus('error');
      
      // Set specific error message
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          setErrorMessage('Cannot connect to server. Please ensure backend is running on port 8080.');
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <section ref={containerRef} id="contact" className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help make your stay perfect.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-6">Contact Information</h3>
              <p className="text-zinc-600 mb-8">
                Reach out to our team and we'll respond as soon as possible to assist with your booking or inquiries.
              </p>
            </div>

            <div className="space-y-6">
              <a href="tel:+94762865399" className="flex items-start gap-4 group hover:bg-amber-50 p-4 rounded-lg transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0 group-hover:bg-amber-200 transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 mb-1">Phone</div>
                  <div className="text-zinc-600 group-hover:text-amber-600 transition-colors">076 2865399</div>
                  <div className="text-sm text-zinc-500">Available 24/7 - Click to call</div>
                </div>
              </a>

              <a href="mailto:reservations@owilka.com" className="flex items-start gap-4 group hover:bg-amber-50 p-4 rounded-lg transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0 group-hover:bg-amber-200 transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 mb-1">Email</div>
                  <div className="text-zinc-600 group-hover:text-amber-600 transition-colors">reservations@owilka.com</div>
                  <div className="text-sm text-zinc-500">Click to send email - We'll respond within 24 hours</div>
                </div>
              </a>

              <a href="https://www.google.com/maps/search/?api=1&query=6.759938793236707,81.81199277476875" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group hover:bg-amber-50 p-4 rounded-lg transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0 group-hover:bg-amber-200 transition-all">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 mb-1">Address</div>
                  <div className="text-zinc-600 group-hover:text-amber-600 transition-colors">50/B Panama West,</div>
                  <div className="text-zinc-600 group-hover:text-amber-600 transition-colors">Panama</div>
                  <div className="text-sm text-zinc-500">Click to view on Google Maps</div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-zinc-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all outline-none ${
                    validationErrors.name 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-zinc-300 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                  placeholder="Owilka Guest"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all outline-none ${
                    validationErrors.email 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-zinc-300 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                  placeholder="Owilkaguest@owilka.com"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-zinc-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  placeholder="+94 76 2865399"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-zinc-700 mb-2">
                  Message <span className="text-zinc-500 text-xs">(minimum 10 characters)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all outline-none resize-none ${
                    validationErrors.message 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-zinc-300 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                  placeholder="How can we help you?"
                />
                <div className="flex justify-between items-center mt-1">
                  {validationErrors.message ? (
                    <p className="text-sm text-red-600">{validationErrors.message}</p>
                  ) : (
                    <p className="text-xs text-zinc-500">
                      {formData.message.length}/1000 characters
                      {formData.message.length > 0 && formData.message.length < 10 && (
                        <span className="text-amber-600 ml-2">
                          ({10 - formData.message.length} more needed)
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all shadow-md ${
                  submitStatus === 'success'
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : submitStatus === 'error'
                    ? 'bg-red-600 text-white cursor-pointer'
                    : isSubmitting
                    ? 'bg-amber-500 text-white cursor-not-allowed'
                    : 'bg-amber-600 text-white hover:bg-amber-700 cursor-pointer'
                }`}
                whileHover={isSubmitting || submitStatus === 'success' ? {} : { scale: 1.02 }}
                whileTap={isSubmitting || submitStatus === 'success' ? {} : { scale: 0.98 }}
              >
                {submitStatus === 'success' ? (
                  <>✓ Message Sent Successfully!</>
                ) : submitStatus === 'error' ? (
                  <>✗ Failed to Send. Try Again</>
                ) : isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>

              {/* Error Message Display */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  <strong>Error:</strong> {errorMessage}
                </motion.div>
              )}

              {/* Success Message Display */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
                >
                  Thank you for contacting us! We'll respond within 24 hours.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>

        {/* Google Maps Embed */}
        <motion.div
          className="mt-16 rounded-2xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.0813164965557!2d81.8145677!3d6.759938800000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae5bf0022645e85%3A0x1972e7f7ed54f9e5!2sOwilka%20Village%20Resort!5e0!3m2!1sen!2slk!4v1768034059226!5m2!1sen!2slk" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </motion.div>
      </div>
    </section>
  );
};
