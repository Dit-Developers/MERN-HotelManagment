// components/Rooms.js
import React from 'react';

const Rooms = () => {
  const rooms = [
    {
      id: 1,
      name: "Deluxe Room",
      description: "Elegant room with king-size bed, marble bathroom, and panoramic city views.",
      price: "$299/night",
      features: ["Free WiFi", "Minibar", "Smart TV"],
      imageClass: "room-1"
    },
    {
      id: 2,
      name: "Executive Suite",
      description: "Spacious suite with separate living area, workspace, and exclusive lounge access.",
      price: "$499/night",
      features: ["Free WiFi", "Jacuzzi", "Butler Service"],
      imageClass: "room-2"
    },
    {
      id: 3,
      name: "Presidential Suite",
      description: "Ultimate luxury with panoramic views, private dining, and personalized concierge.",
      price: "$999/night",
      features: ["Free WiFi", "Private Chef", "Private Pool"],
      imageClass: "room-3"
    }
  ];

  const handleBookNow = (roomName) => {
    alert(`Booking request for ${roomName}. We'll redirect you to the booking page.`);
  };

  return (
    <section id="rooms" className="rooms-section">
      <div className="container">
        <div className="section-header">
          <h5 className="section-subtitle">Accommodations</h5>
          <h2 className="section-title">Rooms & Suites</h2>
          <p className="section-description">Each of our rooms and suites is designed to provide the ultimate in comfort and luxury, with attention to every detail.</p>
        </div>
        
        <div className="row g-4">
          {rooms.map(room => (
            <div key={room.id} className="col-lg-4 col-md-6">
              <div className="room-card">
                <div className={`room-image ${room.imageClass}`}></div>
                <div className="room-info">
                  <h3>{room.name}</h3>
                  <p>{room.description}</p>
                  <div className="room-features">
                    {room.features.map((feature, index) => (
                      <span key={index}>
                        <i className={getFeatureIcon(feature)}></i> {feature}
                      </span>
                    ))}
                  </div>
                  <div className="room-price">
                    <span className="price">{room.price}</span>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => handleBookNow(room.name)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper function to get appropriate icon for each feature
const getFeatureIcon = (feature) => {
  const icons = {
    "Free WiFi": "fas fa-wifi",
    "Minibar": "fas fa-wine-glass",
    "Smart TV": "fas fa-tv",
    "Jacuzzi": "fas fa-hot-tub",
    "Butler Service": "fas fa-concierge-bell",
    "Private Chef": "fas fa-utensils",
    "Private Pool": "fas fa-swimming-pool"
  };
  
  return icons[feature] || "fas fa-check";
};

export default Rooms;