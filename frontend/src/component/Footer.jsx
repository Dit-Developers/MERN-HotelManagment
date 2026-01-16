import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaArrowRight, FaRegNewspaper } from 'react-icons/fa';

function Footer() {
  // Custom color styles matching homepage and header
  const customStyles = {
    navy: {
      50: '#f0f4f8',
      100: '#d9e2ec',
      200: '#bcccdc',
      300: '#9fb3c8',
      400: '#829ab1',
      500: '#627d98',
      600: '#486581',
      700: '#334e68',
      800: '#243b53',
      900: '#102a43',
    },
    gold: {
      50: '#fff9e6',
      100: '#ffefbf',
      200: '#ffe599',
      300: '#ffdb73',
      400: '#ffd14d',
      500: '#c7a53f',
      600: '#b89434',
      700: '#9e7b2e',
      800: '#856328',
      900: '#6c4c22',
    }
  };

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/rooms", label: "Rooms & Suites" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact Us" },
    { to: "/login", label: "Guest Login" },
    { to: "/register", label: "Register" }
  ];

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, text: "123 Luxury Avenue, Metropolitan City 10001" },
    { icon: <FaPhone />, text: "+1 (234) 567-8900" },
    { icon: <FaEnvelope />, text: "reservations@luxuryhotel.com" },
    { icon: <FaClock />, text: "24/7 Reception & Concierge" }
  ];

  const socialLinks = [
    { icon: <FaFacebook />, label: "Facebook", href: "#" },
    { icon: <FaInstagram />, label: "Instagram", href: "#" },
    { icon: <FaTwitter />, label: "Twitter", href: "#" },
    { icon: <FaLinkedin />, label: "LinkedIn", href: "#" }
  ];

  return (
    <footer className="mt-auto">
      {/* Main Footer Content */}
      <div 
        className="w-full"
        style={{ 
          backgroundColor: customStyles.navy[900],
          borderTop: `1px solid ${customStyles.navy[800]}`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Responsive Grid - Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Hotel Info - Full width on mobile, half on tablet, quarter on desktop */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-light tracking-wider text-white">
                  <span style={{ color: customStyles.gold[500] }} className="font-normal">LUXURY</span> HOTEL
                </h2>
                <div className="flex items-center mt-1 sm:mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaArrowRight 
                      key={i} 
                      className="text-xs transform rotate-45 mr-1"
                      style={{ color: customStyles.gold[500] }}
                    />
                  ))}
                  <span className="text-xs sm:text-sm text-gray-400 ml-2 tracking-widest uppercase">5-Star Experience</span>
                </div>
              </div>
              
              <p className="text-gray-400 font-light leading-relaxed text-sm sm:text-base">
                Experience unparalleled luxury at our 5-star sanctuary, where timeless 
                sophistication meets contemporary comfort in the heart of the city.
              </p>
              
              {/* Newsletter Signup - Responsive form */}
              <div className="pt-2 sm:pt-4">
                <h4 className="text-white font-light mb-2 sm:mb-3 tracking-wider uppercase text-xs sm:text-sm flex items-center">
                  <FaRegNewspaper className="mr-2" style={{ color: customStyles.gold[400] }} />
                  Newsletter
                </h4>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input 
                    type="email" 
                    placeholder="Your email"
                    className="flex-grow px-3 sm:px-4 py-2 text-sm bg-transparent border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold-600 transition-colors duration-300 rounded-sm"
                    style={{ 
                      borderColor: customStyles.navy[700],
                      backgroundColor: customStyles.navy[800]
                    }}
                  />
                  <button 
                    className="px-4 py-2 text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:shadow-lg whitespace-nowrap rounded-sm"
                    style={{ 
                      backgroundColor: customStyles.gold[600],
                      color: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links - Full width on mobile, half on tablet, quarter on desktop */}
            <div>
              <h3 
                className="text-base sm:text-lg font-light tracking-widest uppercase mb-4 sm:mb-6 pb-2"
                style={{ 
                  color: customStyles.gold[400],
                  borderBottom: `1px solid ${customStyles.navy[700]}`
                }}
              >
                Quick Links
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to}
                      className="flex items-center text-gray-400 hover:text-white font-light text-xs sm:text-sm tracking-wider uppercase transition-colors duration-300 group py-1 sm:py-2"
                      onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[500]}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
                    >
                      <FaArrowRight 
                        className="mr-2 sm:mr-3 text-xs transform group-hover:translate-x-1 transition-transform duration-300"
                        style={{ color: customStyles.gold[600] }}
                      />
                      <span className="truncate">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info - Full width on mobile, half on tablet, quarter on desktop */}
            <div>
              <h3 
                className="text-base sm:text-lg font-light tracking-widest uppercase mb-4 sm:mb-6 pb-2"
                style={{ 
                  color: customStyles.gold[400],
                  borderBottom: `1px solid ${customStyles.navy[700]}`
                }}
              >
                Contact Us
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div 
                      className="flex-shrink-0 mt-0.5 sm:mt-1 mr-2 sm:mr-3"
                      style={{ color: customStyles.gold[500] }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-gray-400 font-light text-xs sm:text-sm leading-relaxed break-words">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              {/* Emergency Contact */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t" style={{ borderColor: customStyles.navy[700] }}>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 sm:mb-2">Emergency Contact</div>
                <div className="flex items-center">
                  <div 
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-sm mr-2 sm:mr-3"
                    style={{ 
                      backgroundColor: customStyles.gold[900],
                      color: customStyles.gold[300]
                    }}
                  >
                    24/7
                  </div>
                  <span className="text-white font-medium text-sm sm:text-base">+1 (234) 911-9999</span>
                </div>
              </div>
            </div>

            {/* Social Media & Awards - Full width on mobile, half on tablet, quarter on desktop */}
            <div>
              <h3 
                className="text-base sm:text-lg font-light tracking-widest uppercase mb-4 sm:mb-6 pb-2"
                style={{ 
                  color: customStyles.gold[400],
                  borderBottom: `1px solid ${customStyles.navy[700]}`
                }}
              >
                Connect With Us
              </h3>
              
              {/* Social Links */}
              <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-sm transition-all duration-300 hover:scale-110"
                    style={{ 
                      backgroundColor: customStyles.navy[800],
                      color: customStyles.gold[400]
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = customStyles.gold[600];
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = customStyles.navy[800];
                      e.currentTarget.style.color = customStyles.gold[400];
                    }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              
              {/* Awards & Recognition */}
              <div className="pt-4 sm:pt-6 border-t" style={{ borderColor: customStyles.navy[700] }}>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 sm:mb-3">Awards & Recognition</div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3">
                      <span style={{ color: customStyles.gold[500] }}>🏆</span>
                    </div>
                    <span className="text-gray-400 text-xs sm:text-sm">World Luxury Hotel Awards 2023</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3">
                      <span style={{ color: customStyles.gold[500] }}>⭐</span>
                    </div>
                    <span className="text-gray-400 text-xs sm:text-sm">Forbes Travel Guide 5-Star</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright & Bottom Bar */}
      <div 
        className="w-full py-4 sm:py-6 border-t"
        style={{ 
          backgroundColor: customStyles.navy[950],
          borderColor: customStyles.navy[800]
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Responsive layout for copyright and links */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
            {/* Copyright - Centered on mobile, left on desktop */}
            <div className="text-center md:text-left order-2 md:order-1">
              <p className="text-gray-500 text-xs sm:text-sm font-light tracking-wider">
                © {new Date().getFullYear()} <span style={{ color: customStyles.gold[400] }}>Luxury Hotel</span>. All rights reserved.
              </p>
            </div>
            
            {/* Additional Links - Centered on mobile, right on desktop */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 sm:space-x-6 order-1 md:order-2">
              <Link 
                to="/privacy"
                className="text-gray-500 hover:text-white text-xs font-light tracking-wider uppercase transition-colors duration-300 py-1"
                onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[500]}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
              >
                Privacy
              </Link>
              <Link 
                to="/terms"
                className="text-gray-500 hover:text-white text-xs font-light tracking-wider uppercase transition-colors duration-300 py-1"
                onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[500]}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
              >
                Terms
              </Link>
              <Link 
                to="/sitemap"
                className="text-gray-500 hover:text-white text-xs font-light tracking-wider uppercase transition-colors duration-300 py-1"
                onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[500]}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
              >
                Sitemap
              </Link>
              <Link 
                to="/careers"
                className="text-gray-500 hover:text-white text-xs font-light tracking-wider uppercase transition-colors duration-300 py-1"
                onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[500]}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
              >
                Careers
              </Link>
            </div>
          </div>
          
          {/* Payment Methods - Always centered */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t text-center" style={{ borderColor: customStyles.navy[800] }}>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 sm:mb-3">Accepted Payment Methods</div>
            <div className="flex justify-center space-x-3 sm:space-x-4">
              {['💳', '💵', '🏦', '🔗', '📱'].map((icon, index) => (
                <div 
                  key={index}
                  className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-base sm:text-lg opacity-70 hover:opacity-100 transition-opacity duration-300"
                  style={{ color: customStyles.gold[300] }}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;