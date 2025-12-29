// src/pages/BookNow.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const BookNow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  
  // Booking form state
  const [bookingData, setBookingData] = useState({
    // Step 1: Room Selection
    roomType: 'deluxe',
    guests: 2,
    rooms: 1,
    
    // Step 2: Dates
    checkIn: '',
    checkOut: '',
    
    // Step 3: Guest Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    
    // Step 4: Payment
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    agreeTerms: false
  });

  const [formErrors, setFormErrors] = useState({});

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Room data
  const rooms = [
    {
      id: 'deluxe',
      name: 'Deluxe Room',
      description: 'Elegant room with king-size bed, marble bathroom, and panoramic city views.',
      price: 299,
      size: '45 m²',
      maxGuests: 3,
      amenities: ['Free WiFi', 'Smart TV', 'Minibar', 'Marble Bathroom'],
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'executive',
      name: 'Executive Suite',
      description: 'Spacious suite with separate living area, workspace, and exclusive lounge access.',
      price: 499,
      size: '75 m²',
      maxGuests: 4,
      amenities: ['Free WiFi', 'Jacuzzi', 'Butler Service', 'Lounge Access'],
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'presidential',
      name: 'Presidential Suite',
      description: 'Ultimate luxury with panoramic views, private dining, and personalized concierge.',
      price: 999,
      size: '120 m²',
      maxGuests: 6,
      amenities: ['Free WiFi', 'Private Chef', 'Private Pool', 'Personal Concierge'],
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'villa',
      name: 'Ocean View Villa',
      description: 'Private villa with ocean views, garden, and exclusive beach access.',
      price: 1499,
      size: '200 m²',
      maxGuests: 8,
      amenities: ['Private Garden', 'Beach Access', 'Butler Service', 'Private Pool'],
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Calculate total price
  const calculateTotal = () => {
    const selectedRoom = rooms.find(room => room.id === bookingData.roomType);
    if (!selectedRoom) return 0;
    
    const nights = calculateNights();
    const roomPrice = selectedRoom.price * bookingData.rooms * nights;
    
    // Add taxes and fees (18% tax + 5% service fee)
    const tax = roomPrice * 0.18;
    const serviceFee = roomPrice * 0.05;
    
    return roomPrice + tax + serviceFee;
  };

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 1;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData({
      ...bookingData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateStep = () => {
    const errors = {};
    
    switch(step) {
      case 1:
        if (!bookingData.roomType) errors.roomType = 'Please select a room type';
        if (bookingData.guests < 1) errors.guests = 'At least 1 guest is required';
        if (bookingData.rooms < 1) errors.rooms = 'At least 1 room is required';
        break;
        
      case 2:
        if (!bookingData.checkIn) errors.checkIn = 'Check-in date is required';
        if (!bookingData.checkOut) errors.checkOut = 'Check-out date is required';
        if (bookingData.checkIn && bookingData.checkOut) {
          const checkIn = new Date(bookingData.checkIn);
          const checkOut = new Date(bookingData.checkOut);
          if (checkOut <= checkIn) {
            errors.checkOut = 'Check-out date must be after check-in date';
          }
        }
        break;
        
      case 3:
        if (!bookingData.firstName.trim()) errors.firstName = 'First name is required';
        if (!bookingData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!bookingData.email.trim()) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(bookingData.email)) {
          errors.email = 'Email is invalid';
        }
        if (!bookingData.phone.trim()) errors.phone = 'Phone number is required';
        break;
        
      case 4:
        if (!bookingData.cardNumber.trim()) errors.cardNumber = 'Card number is required';
        if (!bookingData.cardName.trim()) errors.cardName = 'Cardholder name is required';
        if (!bookingData.expiryDate.trim()) errors.expiryDate = 'Expiry date is required';
        if (!bookingData.cvv.trim()) errors.cvv = 'CVV is required';
        if (!bookingData.agreeTerms) errors.agreeTerms = 'You must agree to the terms and conditions';
        break;
    }
    
    return errors;
  };

  const nextStep = () => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setStep(step + 1);
    setFormErrors({});
    
    // Scroll to top on step change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(step - 1);
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateStep();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Simulate API call
    console.log('Submitting booking:', bookingData);
    
    // Show success message and redirect
    alert('Booking confirmed! A confirmation email has been sent to your email address.');
    navigate('/');
  };

  const selectedRoom = rooms.find(room => room.id === bookingData.roomType);
  const totalNights = calculateNights();
  const totalPrice = calculateTotal();

  return (
    <div className="booknow-page">
      <Navbar scrolled={scrolled} />
      
      {/* Hero Section */}
      <section className="booknow-hero">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="booknow-title">Book Your Luxury Stay</h1>
              <p className="booknow-subtitle">Experience unparalleled comfort and service at LuxuryStay</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Progress */}
      <section className="booking-progress">
        <div className="container">
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Room Selection</div>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Dates</div>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Guest Info</div>
            </div>
            <div className={`step ${step >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Payment</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="row">
          {/* Main Booking Form */}
          <div className="col-lg-8">
            <form onSubmit={handleSubmit} className="booking-form-main">
              
              {/* Step 1: Room Selection */}
              {step === 1 && (
                <div className="booking-step">
                  <h2 className="step-title">Select Your Room</h2>
                  <p className="step-description">Choose from our luxurious accommodations</p>
                  
                  <div className="row g-4">
                    {rooms.map(room => (
                      <div key={room.id} className="col-md-6">
                        <div 
                          className={`room-selection-card ${bookingData.roomType === room.id ? 'selected' : ''}`}
                          onClick={() => setBookingData({...bookingData, roomType: room.id})}
                        >
                          <div className="room-selection-image" style={{backgroundImage: `url(${room.image})`}}></div>
                          <div className="room-selection-info">
                            <h4>{room.name}</h4>
                            <p className="room-description">{room.description}</p>
                            <div className="room-details">
                              <span><i className="fas fa-users"></i> Up to {room.maxGuests} guests</span>
                              <span><i className="fas fa-expand"></i> {room.size}</span>
                            </div>
                            <div className="room-amenities">
                              {room.amenities.map((amenity, idx) => (
                                <span key={idx} className="amenity-tag">{amenity}</span>
                              ))}
                            </div>
                            <div className="room-price">
                              <span className="price">${room.price} <small>/ night</small></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {formErrors.roomType && <div className="error-message">{formErrors.roomType}</div>}
                  
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="guests" className="form-label">Number of Guests</label>
                        <div className="input-group">
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={() => setBookingData({...bookingData, guests: Math.max(1, bookingData.guests - 1)})}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="form-control text-center"
                            value={`${bookingData.guests} Guest${bookingData.guests !== 1 ? 's' : ''}`}
                            readOnly
                          />
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              const selectedRoom = rooms.find(r => r.id === bookingData.roomType);
                              const maxGuests = selectedRoom ? selectedRoom.maxGuests : 4;
                              if (bookingData.guests < maxGuests) {
                                setBookingData({...bookingData, guests: bookingData.guests + 1});
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                        {formErrors.guests && <div className="error-message">{formErrors.guests}</div>}
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="rooms" className="form-label">Number of Rooms</label>
                        <div className="input-group">
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={() => setBookingData({...bookingData, rooms: Math.max(1, bookingData.rooms - 1)})}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="form-control text-center"
                            value={`${bookingData.rooms} Room${bookingData.rooms !== 1 ? 's' : ''}`}
                            readOnly
                          />
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={() => setBookingData({...bookingData, rooms: bookingData.rooms + 1})}
                          >
                            +
                          </button>
                        </div>
                        {formErrors.rooms && <div className="error-message">{formErrors.rooms}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 2: Dates */}
              {step === 2 && (
                <div className="booking-step">
                  <h2 className="step-title">Select Your Dates</h2>
                  <p className="step-description">Choose your check-in and check-out dates</p>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="checkIn" className="form-label">Check-in Date</label>
                        <input
                          type="date"
                          id="checkIn"
                          name="checkIn"
                          className={`form-control ${formErrors.checkIn ? 'is-invalid' : ''}`}
                          value={bookingData.checkIn}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {formErrors.checkIn && <div className="error-message">{formErrors.checkIn}</div>}
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="checkOut" className="form-label">Check-out Date</label>
                        <input
                          type="date"
                          id="checkOut"
                          name="checkOut"
                          className={`form-control ${formErrors.checkOut ? 'is-invalid' : ''}`}
                          value={bookingData.checkOut}
                          onChange={handleInputChange}
                          min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                        />
                        {formErrors.checkOut && <div className="error-message">{formErrors.checkOut}</div>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="date-summary mt-4">
                    <h5>Stay Duration</h5>
                    <p>
                      {bookingData.checkIn && bookingData.checkOut ? (
                        <>
                          {totalNights} night{totalNights !== 1 ? 's' : ''} • 
                          Check-in: {new Date(bookingData.checkIn).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • 
                          Check-out: {new Date(bookingData.checkOut).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </>
                      ) : 'Select dates to see duration'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Step 3: Guest Information */}
              {step === 3 && (
                <div className="booking-step">
                  <h2 className="step-title">Guest Information</h2>
                  <p className="step-description">Tell us about yourself for a personalized experience</p>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="firstName" className="form-label">First Name *</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                          value={bookingData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                        />
                        {formErrors.firstName && <div className="error-message">{formErrors.firstName}</div>}
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="lastName" className="form-label">Last Name *</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                          value={bookingData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                        />
                        {formErrors.lastName && <div className="error-message">{formErrors.lastName}</div>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                          value={bookingData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                        />
                        {formErrors.email && <div className="error-message">{formErrors.email}</div>}
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="phone" className="form-label">Phone Number *</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                          value={bookingData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                        {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="specialRequests" className="form-label">Special Requests (Optional)</label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      className="form-control"
                      rows="3"
                      value={bookingData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any special requests or requirements for your stay..."
                    />
                  </div>
                </div>
              )}
              
              {/* Step 4: Payment */}
              {step === 4 && (
                <div className="booking-step">
                  <h2 className="step-title">Payment Information</h2>
                  <p className="step-description">Secure payment powered by Stripe</p>
                  
                  <div className="payment-methods mb-4">
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="paymentMethod" id="creditCard" defaultChecked />
                      <label className="form-check-label" htmlFor="creditCard">
                        <i className="fab fa-cc-visa me-2"></i> Credit Card
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="paymentMethod" id="paypal" />
                      <label className="form-check-label" htmlFor="paypal">
                        <i className="fab fa-paypal me-2"></i> PayPal
                      </label>
                    </div>
                  </div>
                  
                  <div className="card-details">
                    <div className="form-group mb-3">
                      <label htmlFor="cardNumber" className="form-label">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        className={`form-control ${formErrors.cardNumber ? 'is-invalid' : ''}`}
                        value={bookingData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {formErrors.cardNumber && <div className="error-message">{formErrors.cardNumber}</div>}
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label htmlFor="cardName" className="form-label">Cardholder Name</label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            className={`form-control ${formErrors.cardName ? 'is-invalid' : ''}`}
                            value={bookingData.cardName}
                            onChange={handleInputChange}
                            placeholder="Name on card"
                          />
                          {formErrors.cardName && <div className="error-message">{formErrors.cardName}</div>}
                        </div>
                      </div>
                      
                      <div className="col-md-3">
                        <div className="form-group mb-3">
                          <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            className={`form-control ${formErrors.expiryDate ? 'is-invalid' : ''}`}
                            value={bookingData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                          {formErrors.expiryDate && <div className="error-message">{formErrors.expiryDate}</div>}
                        </div>
                      </div>
                      
                      <div className="col-md-3">
                        <div className="form-group mb-3">
                          <label htmlFor="cvv" className="form-label">CVV</label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            className={`form-control ${formErrors.cvv ? 'is-invalid' : ''}`}
                            value={bookingData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength="4"
                          />
                          {formErrors.cvv && <div className="error-message">{formErrors.cvv}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-check mt-4">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      className={`form-check-input ${formErrors.agreeTerms ? 'is-invalid' : ''}`}
                      checked={bookingData.agreeTerms}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="agreeTerms">
                      I agree to the <a href="/terms" className="terms-link">Terms & Conditions</a> and <a href="/privacy" className="terms-link">Privacy Policy</a> *
                    </label>
                    {formErrors.agreeTerms && <div className="error-message">{formErrors.agreeTerms}</div>}
                  </div>
                  
                  <div className="secure-payment mt-4">
                    <p className="text-muted small">
                      <i className="fas fa-lock me-2"></i>
                      Your payment is secure and encrypted. We never store your card details.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="booking-navigation mt-5">
                <div className="d-flex justify-content-between">
                  {step > 1 && (
                    <button type="button" className="btn btn-outline-primary" onClick={prevStep}>
                      <i className="fas fa-arrow-left me-2"></i> Previous
                    </button>
                  )}
                  
                  {step < 4 ? (
                    <button type="button" className="btn btn-primary ms-auto" onClick={nextStep}>
                      Continue <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-success ms-auto">
                      <i className="fas fa-check-circle me-2"></i> Confirm Booking
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
          
          {/* Booking Summary Sidebar */}
          <div className="col-lg-4">
            <div className="booking-summary">
              <h3 className="summary-title">Booking Summary</h3>
              
              {selectedRoom && (
                <div className="summary-room">
                  <div className="room-image-summary" style={{backgroundImage: `url(${selectedRoom.image})`}}></div>
                  <div className="room-info-summary">
                    <h5>{selectedRoom.name}</h5>
                    <p className="small text-muted">{selectedRoom.description}</p>
                    <div className="room-details-summary">
                      <span><i className="fas fa-users"></i> {bookingData.guests} guest{bookingData.guests !== 1 ? 's' : ''}</span>
                      <span><i className="fas fa-door-open"></i> {bookingData.rooms} room{bookingData.rooms !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="summary-details">
                {bookingData.checkIn && bookingData.checkOut && (
                  <div className="summary-item">
                    <span>Dates</span>
                    <span>
                      {new Date(bookingData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                      {new Date(bookingData.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
                
                {bookingData.checkIn && bookingData.checkOut && (
                  <div className="summary-item">
                    <span>Duration</span>
                    <span>{totalNights} night{totalNights !== 1 ? 's' : ''}</span>
                  </div>
                )}
                
                <div className="summary-item">
                  <span>Room Price</span>
                  <span>${selectedRoom ? selectedRoom.price * bookingData.rooms * totalNights : 0}</span>
                </div>
                
                <div className="summary-item">
                  <span>Tax (18%)</span>
                  <span>${(selectedRoom ? selectedRoom.price * bookingData.rooms * totalNights * 0.18 : 0).toFixed(2)}</span>
                </div>
                
                <div className="summary-item">
                  <span>Service Fee (5%)</span>
                  <span>${(selectedRoom ? selectedRoom.price * bookingData.rooms * totalNights * 0.05 : 0).toFixed(2)}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-total">
                  <span>Total</span>
                  <span className="total-price">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="summary-benefits">
                <h6 className="mb-3">Your Booking Includes:</h6>
                <ul className="benefits-list">
                  <li><i className="fas fa-check text-success me-2"></i> Free WiFi</li>
                  <li><i className="fas fa-check text-success me-2"></i> Daily housekeeping</li>
                  <li><i className="fas fa-check text-success me-2"></i> Access to fitness center</li>
                  <li><i className="fas fa-check text-success me-2"></i> Complimentary breakfast</li>
                  <li><i className="fas fa-check text-success me-2"></i> 24/7 concierge service</li>
                </ul>
              </div>
              
              <div className="summary-cancellation">
                <p className="small text-muted">
                  <i className="fas fa-info-circle me-2"></i>
                  Free cancellation up to 48 hours before check-in. <a href="/cancellation" className="text-primary">Learn more</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Need Help Section */}
      <section className="need-help-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h3>Need Help with Your Booking?</h3>
              <p className="text-muted">Our dedicated team is available 24/7 to assist you</p>
              <div className="help-contact">
                <a href="tel:+15551234567" className="btn btn-outline-primary me-3">
                  <i className="fas fa-phone me-2"></i> +1 (555) 123-4567
                </a>
                <a href="mailto:bookings@luxurystay.com" className="btn btn-outline-primary">
                  <i className="fas fa-envelope me-2"></i> bookings@luxurystay.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookNow;