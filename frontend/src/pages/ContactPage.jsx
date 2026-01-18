import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaCheckCircle, FaBuilding, FaCalendarAlt, FaUserTie, FaQuestionCircle, FaCar, FaPaw, FaUtensils, FaParking, FaWifi, FaConciergeBell } from 'react-icons/fa';
import FormStatus from '../component/FormStatus';
import { API_URL } from '../config/api';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    subject: false,
    message: false
  });

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

  const validationRules = {
    name: {
      required: 'Full name is required',
      minLength: 2,
      minLengthMessage: 'Full name must be at least 2 characters',
      maxLength: 100,
      maxLengthMessage: 'Full name cannot exceed 100 characters'
    },
    email: {
      required: 'Email is required',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
      maxLength: 100,
      maxLengthMessage: 'Email cannot exceed 100 characters'
    },
    phone: {
      pattern: /^[0-9+\-\s()]{7,20}$/,
      message: 'Please enter a valid phone number'
    },
    subject: {
      required: 'Subject is required',
      minLength: 3,
      minLengthMessage: 'Subject must be at least 3 characters',
      maxLength: 120,
      maxLengthMessage: 'Subject cannot exceed 120 characters'
    },
    message: {
      required: 'Message is required',
      minLength: 10,
      minLengthMessage: 'Message must be at least 10 characters',
      maxLength: 2000,
      maxLengthMessage: 'Message cannot exceed 2000 characters'
    }
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) {
      return '';
    }

    const trimmedValue = typeof value === 'string' ? value.trim() : value;

    if (rules.required && !trimmedValue) {
      return rules.required;
    }

    if (trimmedValue && rules.pattern && !rules.pattern.test(trimmedValue)) {
      return rules.message || rules.patternMessage;
    }

    if (rules.minLength && trimmedValue.length < rules.minLength) {
      return rules.minLengthMessage;
    }

    if (rules.maxLength && trimmedValue.length > rules.maxLength) {
      return rules.maxLengthMessage;
    }

    return '';
  };

  const validateForm = () => {
    const errors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      subject: validateField('subject', formData.subject),
      message: validateField('message', formData.message)
    };

    setFieldErrors(errors);

    return !errors.name &&
      !errors.email &&
      !errors.phone &&
      !errors.subject &&
      !errors.message;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === 'name') {
      nextValue = value.replace(/[^a-zA-Z\s.'-]/g, '');
    }

    if (name === 'phone') {
      nextValue = value.replace(/[^0-9+\-\s()]/g, '');
    }

    setFormData({
      ...formData,
      [name]: nextValue
    });

    if (touched[name]) {
      const errorMessage = validateField(name, nextValue);
      setFieldErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const errorMessage = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true
    });

    const isValid = validateForm();
    if (!isValid) {
      setError('Please fix the errors in the form before submitting.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setFieldErrors({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTouched({
        name: false,
        email: false,
        phone: false,
        subject: false,
        message: false
      });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { 
      icon: <FaMapMarkerAlt />, 
      title: "Address", 
      info: "123 Luxury Avenue, Metropolitan City 10001",
      detail: "Centrally located in the financial district"
    },
    { 
      icon: <FaPhone />, 
      title: "Phone", 
      info: "+1 (234) 567-8900",
      detail: "24/7 Reception & Reservations"
    },
    { 
      icon: <FaEnvelope />, 
      title: "Email", 
      info: "reservations@luxuryhotel.com",
      detail: "Response within 2 hours"
    },
    { 
      icon: <FaClock />, 
      title: "Hours", 
      info: "Reception: 24/7",
      detail: "Concierge available 6AM - 12AM"
    }
  ];

  const departments = [
    { 
      name: "Reservations", 
      icon: <FaCalendarAlt />,
      email: "reservations@luxuryhotel.com", 
      phone: "+1 (234) 567-8902",
      hours: "6AM - 12AM Daily"
    },
    { 
      name: "Events", 
      icon: <FaBuilding />,
      email: "events@luxuryhotel.com", 
      phone: "+1 (234) 567-8903",
      hours: "9AM - 6PM Weekdays"
    },
    { 
      name: "Executive Office", 
      icon: <FaUserTie />,
      email: "executive@luxuryhotel.com", 
      phone: "+1 (234) 567-8904",
      hours: "9AM - 5PM Weekdays"
    },
    { 
      name: "General Inquiries", 
      icon: <FaQuestionCircle />,
      email: "info@luxuryhotel.com", 
      phone: "+1 (234) 567-8901",
      hours: "8AM - 8PM Daily"
    }
  ];

  const faqs = [
    {
      question: "What are your check-in and check-out times?",
      answer: "Check-in: 3:00 PM | Check-out: 12:00 PM. Early check-in and late check-out available upon request.",
      icon: <FaClock />
    },
    {
      question: "Do you offer airport transportation?",
      answer: "Yes, we offer complimentary airport pickup and drop-off service. Please arrange 24 hours in advance.",
      icon: <FaCar />
    },
    {
      question: "Is parking available?",
      answer: "Yes, we have complimentary valet parking for all guests. Self-parking is also available.",
      icon: <FaParking />
    },
    {
      question: "Do you have pet-friendly rooms?",
      answer: "Yes, we have designated pet-friendly rooms with additional amenities. Pet fee applies.",
      icon: <FaPaw />
    },
    {
      question: "What dining options are available?",
      answer: "We have 5 restaurants including a Michelin-star restaurant, 24-hour room service, and private dining.",
      icon: <FaUtensils />
    },
    {
      question: "Is Wi-Fi available throughout the hotel?",
      answer: "Yes, complimentary high-speed Wi-Fi is available throughout the property including rooms and public areas.",
      icon: <FaWifi />
    }
  ];

  const emergencyContacts = [
    { type: "Medical Emergency", number: "+1 (234) 911-1111", available: "24/7" },
    { type: "Fire Department", number: "+1 (234) 911-2222", available: "24/7" },
    { type: "Police", number: "+1 (234) 911-3333", available: "24/7" },
    { type: "Hotel Security", number: "+1 (234) 567-9999", available: "24/7" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 lg:py-36 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Hotel Contact"
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${customStyles.navy[900]}CC, ${customStyles.navy[800]}CC)`
            }}
          ></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl">
          <div className="inline-block mb-4 sm:mb-6">
            <span 
              className="font-light tracking-[0.3em] uppercase text-xs sm:text-sm"
              style={{ color: customStyles.gold[400] }}
            >
              Get in Touch
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-white mb-6 sm:mb-8 leading-tight tracking-tight">
            Your Luxury <span style={{ color: customStyles.gold[500] }} className="font-normal">Journey</span> <br className="hidden sm:block" />Begins Here
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed font-light tracking-wide px-4">
            Our dedicated team is ready to assist with your inquiries, reservations, 
            and special requests for an unforgettable experience
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <a 
              href="#contact-form"
              style={{ backgroundColor: customStyles.gold[600] }}
              className="group px-8 sm:px-10 lg:px-12 py-3 sm:py-4 text-white font-medium rounded-sm transition-all duration-300 transform hover:scale-105 text-sm sm:text-base tracking-wider uppercase relative overflow-hidden hover:shadow-xl sm:hover:shadow-2xl w-full sm:w-auto text-center"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
            >
              <span className="relative z-10">Send Message</span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to right, ${customStyles.gold[600]}, ${customStyles.gold[700]})`
                }}
              ></div>
            </a>
            <a 
              href="tel:+12345678900"
              className="px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-transparent border border-gray-400 hover:border-white text-gray-300 hover:text-white font-medium rounded-sm transition-all duration-300 text-sm sm:text-base tracking-wider uppercase w-full sm:w-auto text-center"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left Column: Contact Info & Departments */}
          <div>
            {/* Contact Information */}
            <div className="mb-12 sm:mb-16">
              <div className="inline-block mb-6">
                <span 
                  className="font-light tracking-[0.3em] uppercase text-xs"
                  style={{ color: customStyles.gold[600] }}
                >
                  Contact Information
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((item, index) => (
                  <div 
                    key={index} 
                    className="group relative overflow-hidden border border-gray-200 rounded-lg p-6 transition-all duration-500 hover:shadow-xl"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = customStyles.gold[500];
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div 
                      className="text-2xl mb-4"
                      style={{ color: customStyles.gold[600] }}
                    >
                      {item.icon}
                    </div>
                    
                    <h3 
                      className="text-lg font-light mb-2 tracking-wide"
                      style={{ color: customStyles.navy[900] }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-gray-700 text-sm font-medium mb-2">
                      {item.info}
                    </p>
                    <p className="text-gray-500 text-xs font-light">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Departments */}
            <div className="mb-12 sm:mb-16">
              <div className="inline-block mb-6">
                <span 
                  className="font-light tracking-[0.3em] uppercase text-xs"
                  style={{ color: customStyles.gold[600] }}
                >
                  Departments
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {departments.map((dept, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start mb-4">
                      <div 
                        className="text-xl mr-4"
                        style={{ color: customStyles.gold[600] }}
                      >
                        {dept.icon}
                      </div>
                      <div>
                        <h4 
                          className="text-base font-medium mb-2"
                          style={{ color: customStyles.navy[900] }}
                        >
                          {dept.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-light mb-1">{dept.hours}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <FaEnvelope className="mr-2 text-xs" style={{ color: customStyles.gold[500] }} />
                        <span>{dept.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaPhone className="mr-2 text-xs" style={{ color: customStyles.gold[500] }} />
                        <span>{dept.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Location */}
            <div className="mb-12 sm:mb-16">
              <div className="inline-block mb-6">
                <span 
                  className="font-light tracking-[0.3em] uppercase text-xs"
                  style={{ color: customStyles.gold[600] }}
                >
                  Our Location
                </span>
              </div>
              
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <div className="aspect-w-16 aspect-h-9">
                  <div className="w-full h-64 sm:h-80 bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <FaMapMarkerAlt className="text-4xl mx-auto mb-4" style={{ color: customStyles.gold[500] }} />
                      <h3 className="text-lg font-light mb-2" style={{ color: customStyles.navy[900] }}>123 Luxury Avenue</h3>
                      <p className="text-gray-600 text-sm">Metropolitan City 10001</p>
                      <p className="text-gray-500 text-xs mt-2">Centrally located in the financial district</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4">
                  <a 
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium rounded-sm transition-all duration-300 hover:shadow-lg"
                    style={{ 
                      backgroundColor: customStyles.gold[600],
                      color: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                  >
                    Open in Maps
                  </a>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: customStyles.navy[100], color: customStyles.navy[800] }}>15 min from airport</span>
                <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: customStyles.navy[100], color: customStyles.navy[800] }}>Walking distance to attractions</span>
                <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: customStyles.navy[100], color: customStyles.navy[800] }}>Valet parking available</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div id="contact-form">
            <div className="sticky top-24">
              <div className="inline-block mb-6">
                <span 
                  className="font-light tracking-[0.3em] uppercase text-xs"
                  style={{ color: customStyles.gold[600] }}
                >
                  Send Message
                </span>
              </div>
              
              {submitted ? (
                <div 
                  className="border border-green-200 rounded-lg p-8 text-center"
                  style={{ backgroundColor: '#f0fdf4' }}
                >
                  <FaCheckCircle className="text-5xl mx-auto mb-6" style={{ color: '#16a34a' }} />
                  <h3 
                    className="text-2xl font-serif font-light mb-4"
                    style={{ color: customStyles.navy[900] }}
                  >
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting Luxury Hotel. Our team will respond to your inquiry within 24 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 text-sm font-medium rounded-sm transition-all duration-300 hover:shadow-lg"
                    style={{ 
                      backgroundColor: customStyles.navy[900],
                      color: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[800]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[900]}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-lg">
                    <div className="mb-6">
                      <h3 
                        className="text-xl font-serif font-light mb-2"
                        style={{ color: customStyles.navy[900] }}
                      >
                        Personal Information
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Fill out the form below and our team will respond promptly
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-gold-500 transition-colors duration-300"
                          style={{ color: customStyles.navy[900] }}
                          required
                          placeholder="John Smith"
                        />
                        {touched.name && fieldErrors.name && (
                          <p className="mt-1 text-xs text-red-600">
                            {fieldErrors.name}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-gold-500 transition-colors duration-300"
                          style={{ color: customStyles.navy[900] }}
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-gold-500 transition-colors duration-300"
                        style={{ color: customStyles.navy[900] }}
                        placeholder="+1 (234) 567-8900"
                      />
                      {touched.phone && fieldErrors.phone && (
                        <p className="mt-1 text-xs text-red-600">
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-gold-500 transition-colors duration-300 appearance-none"
                        style={{ color: customStyles.navy[900] }}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="reservation">Room Reservation</option>
                        <option value="event">Event & Conference Booking</option>
                        <option value="wedding">Wedding & Celebration</option>
                        <option value="spa">Spa & Wellness</option>
                        <option value="dining">Restaurant Reservation</option>
                        <option value="feedback">Feedback & Suggestions</option>
                        <option value="general">General Inquiry</option>
                      </select>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-gold-500 transition-colors duration-300 min-h-[150px] resize-none"
                        style={{ color: customStyles.navy[900] }}
                        required
                        placeholder="Please provide details about your inquiry..."
                      />
                      {touched.message && fieldErrors.message && (
                        <p className="mt-1 text-xs text-red-600">
                          {fieldErrors.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-8">
                      <button 
                        type="submit" 
                        className="group w-full px-8 py-4 text-sm font-medium tracking-wider uppercase rounded-sm transition-all duration-300 transform hover:scale-105 relative overflow-hidden hover:shadow-xl"
                        style={{ 
                          backgroundColor: customStyles.gold[600],
                          color: 'white'
                        }}
                        disabled={loading}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = customStyles.gold[700])}
                        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = customStyles.gold[600])}
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          {loading ? (
                            <>
                              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <FaPaperPlane className="mr-3" />
                              Send Message
                            </>
                          )}
                        </span>
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(to right, ${customStyles.gold[700]}, ${customStyles.gold[800]})`
                          }}
                        ></div>
                      </button>
                      <FormStatus
                        type="error"
                        message={error}
                        onClose={() => setError('')}
                      />
                      
                      <p className="text-xs text-gray-500 text-center mt-4">
                        By submitting this form, you agree to our privacy policy
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6" style={{ backgroundColor: customStyles.navy[50] }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <span 
                className="font-light tracking-[0.3em] uppercase text-xs"
                style={{ color: customStyles.gold[600] }}
              >
                Common Questions
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-6 sm:mb-8 tracking-tight"
              style={{ color: customStyles.navy[900] }}
            >
              Frequently Asked <span style={{ color: customStyles.gold[500] }} className="font-normal">Questions</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed px-4">
              Find quick answers to the most common inquiries about our services and facilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start mb-4">
                  <div 
                    className="text-xl mr-4 mt-1"
                    style={{ color: customStyles.gold[600] }}
                  >
                    {faq.icon}
                  </div>
                  <div>
                    <h4 
                      className="text-lg font-light mb-3"
                      style={{ color: customStyles.navy[900] }}
                    >
                      {faq.question}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/faq"
              className="inline-flex items-center text-sm font-medium tracking-wider uppercase group"
              style={{ color: customStyles.navy[900] }}
              onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[600]}
              onMouseLeave={(e) => e.currentTarget.style.color = customStyles.navy[900]}
            >
              View Full FAQ
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span 
                className="font-light tracking-[0.3em] uppercase text-xs"
                style={{ color: customStyles.gold[600] }}
              >
                Emergency Contacts
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-6 sm:mb-8 tracking-tight"
              style={{ color: customStyles.navy[900] }}
            >
              24/7 <span style={{ color: customStyles.gold[500] }} className="font-normal">Support</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div 
                key={index} 
                className="border border-red-100 rounded-lg p-6 text-center"
                style={{ backgroundColor: '#fef2f2' }}
              >
                <div 
                  className="text-lg font-medium mb-2"
                  style={{ color: '#dc2626' }}
                >
                  {contact.type}
                </div>
                <div className="text-2xl font-bold mb-2" style={{ color: customStyles.navy[900] }}>
                  {contact.number}
                </div>
                <div className="text-sm text-gray-600">
                  Available: {contact.available}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <FaConciergeBell className="text-gold-500" />
              <span>For non-emergencies, please contact our 24/7 concierge at +1 (234) 567-8888</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${customStyles.navy[900]}, ${customStyles.navy[800]}, ${customStyles.navy[900]})`
          }}
        >
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1564501049418-3c27787d01e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block mb-6">
            <span 
              className="font-light tracking-[0.3em] uppercase text-xs"
              style={{ color: customStyles.gold[400] }}
            >
              Need Immediate Assistance?
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white mb-8 sm:mb-10 tracking-tight leading-tight">
            We're Here to <span style={{ color: customStyles.gold[500] }} className="font-normal">Help</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-10 sm:mb-12 lg:mb-14 max-w-2xl mx-auto leading-relaxed font-light px-4">
            Our dedicated team is available 24/7 to ensure your comfort and satisfaction
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <a 
              href="tel:+12345678900"
              style={{ backgroundColor: customStyles.gold[600] }}
              className="group px-8 sm:px-10 lg:px-12 py-3 sm:py-4 text-white font-medium rounded-sm transition-all duration-300 transform hover:scale-105 text-sm sm:text-base tracking-wider uppercase relative overflow-hidden hover:shadow-xl sm:hover:shadow-2xl w-full sm:w-auto text-center"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
            >
              <span className="relative z-10 flex items-center justify-center">
                <FaPhone className="mr-3" />
                Call Now
              </span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to right, ${customStyles.gold[600]}, ${customStyles.gold[700]})`
                }}
              ></div>
            </a>
            <Link 
              to="/rooms"
              className="px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-transparent border border-gray-400 hover:border-white text-gray-300 hover:text-white font-medium rounded-sm transition-all duration-300 text-sm sm:text-base tracking-wider uppercase w-full sm:w-auto text-center"
            >
              Book Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
