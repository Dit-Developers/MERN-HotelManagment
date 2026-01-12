import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // SVG Icons
  const BuildingIcon = () => (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const ClockIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const SocialIcon = ({ children }) => (
    <div className="w-8 h-8 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-colors duration-200 cursor-pointer">
      {children}
    </div>
  );

  const FooterSection = ({ title, children }) => (
    <div>
      <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <footer className="bg-gray-900">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & About */}
          <FooterSection title="GrandStay Hotel">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-white bg-opacity-10 mr-3">
                <BuildingIcon />
              </div>
              <span className="text-xl font-bold text-white">GrandStay</span>
            </div>
            <p className="text-gray-400 mb-4">
              Experience luxury redefined. Where comfort meets elegance and every stay becomes a memory.
            </p>
            <div className="flex space-x-3">
              <SocialIcon>FB</SocialIcon>
              <SocialIcon>TW</SocialIcon>
              <SocialIcon>IG</SocialIcon>
              <SocialIcon>IN</SocialIcon>
            </div>
          </FooterSection>

          {/* Contact Info */}
          <FooterSection title="Contact Us">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="mt-1 mr-3" style={{ color: '#215E61' }}>
                  <LocationIcon />
                </div>
                <div>
                  <p className="text-gray-400">123 Luxury Avenue</p>
                  <p className="text-gray-400">New York, NY 10001</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-3" style={{ color: '#215E61' }}>
                  <PhoneIcon />
                </div>
                <p className="text-gray-400">(555) 123-4567</p>
              </div>
              <div className="flex items-center">
                <div className="mr-3" style={{ color: '#215E61' }}>
                  <EmailIcon />
                </div>
                <p className="text-gray-400">info@grandstay.com</p>
              </div>
              <div className="flex items-center">
                <div className="mr-3" style={{ color: '#215E61' }}>
                  <ClockIcon />
                </div>
                <p className="text-gray-400">24/7 Reception</p>
              </div>
            </div>
          </FooterSection>

          {/* Quick Links */}
          <FooterSection title="Quick Links">
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/booknow" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Book Now
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link to="/dining" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Dining
                </Link>
              </li>
              <li>
                <Link to="/spa" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Spa & Wellness
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Feedback
                </Link>
              </li>
            </ul>
          </FooterSection>

          {/* Newsletter */}
          <FooterSection title="Stay Updated">
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <form className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity duration-200"
                style={{ backgroundColor: '#215E61' }}
              >
                Subscribe
              </button>
            </form>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </FooterSection>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm mb-2">We Accept:</p>
              <div className="flex space-x-2">
                <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-xs text-white">VISA</div>
                <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-xs text-white">MC</div>
                <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-xs text-white">AMEX</div>
                <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-xs text-white">PP</div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a href="/privacy" className="text-gray-400 text-sm hover:text-white">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 text-sm hover:text-white">Terms of Service</a>
              <a href="/cookies" className="text-gray-400 text-sm hover:text-white">Cookie Policy</a>
              <a href="/sitemap" className="text-gray-400 text-sm hover:text-white">Sitemap</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-2 md:mb-0">
              © {currentYear} GrandStay Hotel. All rights reserved.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">✓</span>
              </div>
              <span className="text-sm text-gray-400">SSL Secured • Verified Hotel</span>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              GrandStay Hotel is part of the Luxury Hotels International Group
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;