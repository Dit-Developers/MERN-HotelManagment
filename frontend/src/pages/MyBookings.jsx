import React, { useState } from 'react';


const BookNow = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    roomType: '',
    roomCount: 1,
    guestInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialRequests: ''
    },
    payment: {
      cardNumber: '',
      expiry: '',
      cvv: '',
      nameOnCard: ''
    }
  });

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const roomTypes = [
    {
      id: 'standard',
      name: 'Standard Room',
      description: 'Comfortable room with all essential amenities',
      price: 120,
      capacity: 2,
      available: 5,
      features: ['Free WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'deluxe',
      name: 'Deluxe Room',
      description: 'Spacious room with city view and premium amenities',
      price: 180,
      capacity: 3,
      available: 3,
      features: ['Free WiFi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Coffee Maker'],
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'suite',
      name: 'Executive Suite',
      description: 'Luxury suite with separate living area and panoramic views',
      price: 280,
      capacity: 4,
      available: 2,
      features: ['Free WiFi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Coffee Maker', 'Jacuzzi'],
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'presidential',
      name: 'Presidential Suite',
      description: 'Ultimate luxury with private balcony and butler service',
      price: 500,
      capacity: 4,
      available: 1,
      features: ['Free WiFi', 'Smart TV', 'Air Conditioning', 'Premium Bar', 'Coffee Maker', 'Jacuzzi', 'Private Balcony'],
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setBookingData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setBookingData(prev => ({
      ...prev,
      roomType: room.id
    }));
  };

  const checkAvailability = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const available = roomTypes.map(room => ({
        ...room,
        available: Math.floor(Math.random() * 5) + 1 // Random availability
      }));
      setAvailableRooms(available);
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    const nights = calculateNights();
    const roomPrice = selectedRoom.price * bookingData.roomCount;
    const subtotal = roomPrice * nights;
    const tax = subtotal * 0.12; // 12% tax
    const serviceFee = 25;
    return subtotal + tax + serviceFee;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Simulate booking submission
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert('Booking confirmed! Thank you for choosing our hotel.');
        // Reset form
        setStep(1);
        setBookingData({
          checkIn: '',
          checkOut: '',
          adults: 1,
          children: 0,
          roomType: '',
          roomCount: 1,
          guestInfo: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            specialRequests: ''
          },
          payment: {
            cardNumber: '',
            expiry: '',
            cvv: '',
            nameOnCard: ''
          }
        });
        setSelectedRoom(null);
      }, 1500);
    }
  };

  const steps = [
    { number: 1, title: 'Select Dates', emoji: '📅' },
    { number: 2, title: 'Choose Room', emoji: '🛏️' },
    { number: 3, title: 'Guest Details', emoji: '👤' },
    { number: 4, title: 'Payment', emoji: '💳' },
    { number: 5, title: 'Confirmation', emoji: '✅' }
  ];

  // SVG Icons as components
  const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const CreditCardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const ShieldIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const ClockIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const LockIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const BuildingIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const PrintIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5FBE6' }}>
      {/* Navigation */}
      <Navbar />

      {/* Header */}
      <div className="relative py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#215E61' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white">Book Your Stay</h1>
          <p className="mt-2 text-lg text-gray-100">Find the perfect room for your next getaway</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex justify-between items-center">
              {steps.map((stepItem, index) => (
                <React.Fragment key={stepItem.number}>
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step >= stepItem.number 
                        ? 'text-white' 
                        : 'text-gray-400 border border-gray-300'
                    }`}
                    style={step >= stepItem.number ? { backgroundColor: '#215E61' } : {}}
                    >
                      <span className="text-lg">{stepItem.emoji}</span>
                    </div>
                    <span className={`ml-2 text-sm font-medium hidden sm:block ${
                      step >= stepItem.number ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {stepItem.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      step > stepItem.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Step 1: Date Selection */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">When would you like to stay?</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in Date
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <CalendarIcon />
                        </div>
                        <input
                          type="date"
                          name="checkIn"
                          value={bookingData.checkIn}
                          onChange={handleInputChange}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                          style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out Date
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <CalendarIcon />
                        </div>
                        <input
                          type="date"
                          name="checkOut"
                          value={bookingData.checkOut}
                          onChange={handleInputChange}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                          style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adults
                      </label>
                      <div className="flex items-center">
                        <button
                          onClick={() => setBookingData(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                          className="px-3 py-1 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          name="adults"
                          value={bookingData.adults}
                          onChange={handleInputChange}
                          className="w-16 text-center py-1 border-t border-b border-gray-300"
                          min="1"
                          max="10"
                        />
                        <button
                          onClick={() => setBookingData(prev => ({ ...prev, adults: prev.adults + 1 }))}
                          className="px-3 py-1 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Children
                      </label>
                      <div className="flex items-center">
                        <button
                          onClick={() => setBookingData(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                          className="px-3 py-1 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          name="children"
                          value={bookingData.children}
                          onChange={handleInputChange}
                          className="w-16 text-center py-1 border-t border-b border-gray-300"
                          min="0"
                          max="10"
                        />
                        <button
                          onClick={() => setBookingData(prev => ({ ...prev, children: prev.children + 1 }))}
                          className="px-3 py-1 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={checkAvailability}
                      disabled={loading}
                      className="w-full px-6 py-4 text-lg font-medium text-white rounded-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#215E61' }}
                    >
                      {loading ? 'Checking Availability...' : 'Check Availability'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Room Selection */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Select Your Room</h2>
                  <p className="text-gray-600">{availableRooms.length} room types available for your dates</p>

                  <div className="space-y-6">
                    {availableRooms.map((room) => (
                      <div
                        key={room.id}
                        className={`border rounded-lg p-4 transition-all duration-200 ${
                          selectedRoom?.id === room.id 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => handleRoomSelect(room)}
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-full md:w-48 h-48 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                                <p className="text-gray-600 text-sm mt-1">{room.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold" style={{ color: '#215E61' }}>
                                  ${room.price}
                                </div>
                                <div className="text-sm text-gray-500">per night</div>
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                              {room.features.map((feature, index) => (
                                <div key={index} className="flex items-center text-sm text-gray-600">
                                  <span className="mr-2 text-green-500">✓</span>
                                  {feature}
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <span className="mr-1 text-gray-400">👤</span>
                                  <span className="text-sm text-gray-600">Sleeps {room.capacity}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="mr-1 text-green-500">✓</span>
                                  <span className="text-sm text-green-600">{room.available} rooms available</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <label className="text-sm text-gray-700">Rooms:</label>
                                <select
                                  value={bookingData.roomCount}
                                  onChange={(e) => setBookingData(prev => ({ ...prev, roomCount: parseInt(e.target.value) }))}
                                  className="border border-gray-300 rounded px-2 py-1"
                                >
                                  {[1, 2, 3, 4].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <ArrowLeftIcon />
                      <span className="ml-2">Back</span>
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!selectedRoom}
                      className="px-6 py-3 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#215E61' }}
                    >
                      Continue to Guest Details
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Guest Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Guest Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="guestInfo.firstName"
                        value={bookingData.guestInfo.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                        style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="guestInfo.lastName"
                        value={bookingData.guestInfo.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                        style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <EmailIcon />
                        </div>
                        <input
                          type="email"
                          name="guestInfo.email"
                          value={bookingData.guestInfo.email}
                          onChange={handleInputChange}
                          required
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                          style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <PhoneIcon />
                        </div>
                        <input
                          type="tel"
                          name="guestInfo.phone"
                          value={bookingData.guestInfo.phone}
                          onChange={handleInputChange}
                          required
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                          style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      name="guestInfo.specialRequests"
                      value={bookingData.guestInfo.specialRequests}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                      style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                      placeholder="Early check-in, dietary requirements, accessibility needs, etc."
                    />
                  </div>

                  <div className="pt-6 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <ArrowLeftIcon />
                      <span className="ml-2">Back</span>
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      disabled={!bookingData.guestInfo.firstName || !bookingData.guestInfo.lastName || !bookingData.guestInfo.email || !bookingData.guestInfo.phone}
                      className="px-6 py-3 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#215E61' }}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="text-green-500 mr-2">
                        <ShieldIcon />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Secure payment protected by 256-bit SSL encryption
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-gray-400">
                            <CreditCardIcon />
                          </div>
                          <input
                            type="text"
                            name="payment.cardNumber"
                            value={bookingData.payment.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            required
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                            style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="payment.expiry"
                            value={bookingData.payment.expiry}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                            style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-3 text-gray-400">
                              <LockIcon />
                            </div>
                            <input
                              type="text"
                              name="payment.cvv"
                              value={bookingData.payment.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              required
                              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                              style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          name="payment.nameOnCard"
                          value={bookingData.payment.nameOnCard}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                          style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between">
                    <button
                      onClick={() => setStep(3)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <ArrowLeftIcon />
                      <span className="ml-2">Back</span>
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !bookingData.payment.cardNumber || !bookingData.payment.expiry || !bookingData.payment.cvv || !bookingData.payment.nameOnCard}
                      className="px-6 py-3 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#215E61' }}
                    >
                      {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Confirmation */}
              {step === 5 && (
                <div className="text-center py-12">
                  <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
                    <CheckIcon className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="mt-6 text-3xl font-bold text-gray-900">Booking Confirmed!</h2>
                  <p className="mt-2 text-gray-600">
                    Your reservation has been successfully created. A confirmation email has been sent to {bookingData.guestInfo.email}.
                  </p>
                  
                  <div className="mt-8 bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Confirmation #</span>
                        <span className="font-mono">HMS{Math.floor(Math.random() * 1000000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Room</span>
                        <span>{selectedRoom?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-in</span>
                        <span>{bookingData.checkIn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out</span>
                        <span>{bookingData.checkOut}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total</span>
                        <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <button
                      onClick={() => window.print()}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center mx-auto"
                    >
                      <PrintIcon />
                      <span className="ml-2">Print Confirmation</span>
                    </button>
                    <button
                      onClick={() => setStep(1)}
                      className="ml-4 px-6 py-3 text-white rounded-lg hover:opacity-90"
                      style={{ backgroundColor: '#215E61' }}
                    >
                      Make Another Booking
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Summary</h3>
              
              {selectedRoom ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Room Details</h4>
                      <div className="mt-2 flex items-start">
                        <img
                          src={selectedRoom.image}
                          alt={selectedRoom.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">{selectedRoom.name}</p>
                          <p className="text-sm text-gray-500">{selectedRoom.description}</p>
                          <div className="flex items-center mt-1">
                            <span className="mr-1 text-gray-400">👤</span>
                            <span className="text-sm text-gray-600">Sleeps {selectedRoom.capacity}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-700">Stay Details</h4>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-in</span>
                          <span className="text-gray-900">{bookingData.checkIn || '--'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-out</span>
                          <span className="text-gray-900">{bookingData.checkOut || '--'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nights</span>
                          <span className="text-gray-900">{calculateNights()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Guests</span>
                          <span className="text-gray-900">
                            {bookingData.adults} Adult{bookingData.adults > 1 ? 's' : ''}, {bookingData.children} Child{bookingData.children > 1 ? 'ren' : ''}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rooms</span>
                          <span className="text-gray-900">{bookingData.roomCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-700">Price Summary</h4>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Room Rate</span>
                          <span className="text-gray-900">
                            ${selectedRoom.price} × {bookingData.roomCount} rooms × {calculateNights()} nights
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-gray-900">
                            ${(selectedRoom.price * bookingData.roomCount * calculateNights()).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax (12%)</span>
                          <span className="text-gray-900">
                            ${(selectedRoom.price * bookingData.roomCount * calculateNights() * 0.12).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service Fee</span>
                          <span className="text-gray-900">$25.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span className="text-gray-900">Total</span>
                          <span style={{ color: '#215E61' }}>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="mr-2 text-green-500">
                        <ShieldIcon />
                      </div>
                      Free cancellation up to 48 hours before check-in
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <BuildingIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="mt-4 text-gray-500">Select dates and room to see booking summary</p>
                </div>
              )}
            </div>

            {/* Contact Support */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="mr-3" style={{ color: '#215E61' }}>
                    <PhoneIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Call us at</p>
                    <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3" style={{ color: '#215E61' }}>
                    <EmailIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email us at</p>
                    <p className="font-medium text-gray-900">reservations@grandstay.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3" style={{ color: '#215E61' }}>
                    <ClockIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">24/7 Support</p>
                    <p className="font-medium text-gray-900">Available anytime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BuildingIcon className="h-10 w-10 mx-auto text-white" />
            <p className="mt-4 text-white">© 2024 Hotel Management System. All rights reserved.</p>
            <p className="mt-2 text-gray-400">Secure booking powered by HMS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookNow;