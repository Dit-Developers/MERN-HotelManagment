// components/BookingWidget.js
import React, { useState } from 'react';

const BookingWidget = () => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('Deluxe Room');

  const handleBooking = (e) => {
    e.preventDefault();
    if (checkInDate && checkOutDate) {
      alert(`Booking request submitted for ${guests} guests in a ${roomType} from ${checkInDate} to ${checkOutDate}. We'll contact you shortly to confirm.`);
    } else {
      alert('Please select both check-in and check-out dates.');
    }
  };

  const handleGuestsChange = (operation) => {
    if (operation === 'increase') {
      setGuests(guests + 1);
    } else if (operation === 'decrease' && guests > 1) {
      setGuests(guests - 1);
    }
  };

  return (
    <section id="booking" className="booking-widget">
      <div className="container">
        <div className="booking-card">
          <h3 className="booking-title">Reserve Your Luxury Experience</h3>
          <form onSubmit={handleBooking} className="booking-form">
            <div className="row g-3">
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="checkIn">Check-In</label>
                  <input 
                    type="date" 
                    id="checkIn" 
                    className="form-control"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="checkOut">Check-Out</label>
                  <input 
                    type="date" 
                    id="checkOut" 
                    className="form-control"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group">
                  <label htmlFor="guests">Guests</label>
                  <div className="input-group">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => handleGuestsChange('decrease')}
                    >
                      -
                    </button>
                    <input 
                      type="text" 
                      id="guests" 
                      className="form-control text-center"
                      value={`${guests} Guest${guests !== 1 ? 's' : ''}`}
                      readOnly
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => handleGuestsChange('increase')}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="roomType">Room Type</label>
                  <select 
                    id="roomType" 
                    className="form-select"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                  >
                    <option value="Deluxe Room">Deluxe Room</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                    <option value="Ocean View Villa">Ocean View Villa</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary btn-lg booking-submit">Check Availability</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingWidget;