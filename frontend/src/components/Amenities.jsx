// components/Amenities.js
import React from 'react';

const Amenities = () => {
  const amenities = [
    {
      id: 1,
      icon: "fas fa-utensils",
      title: "Fine Dining",
      description: "Multiple award-winning restaurants offering international and local cuisine."
    },
    {
      id: 2,
      icon: "fas fa-spa",
      title: "Luxury Spa",
      description: "Revitalize your senses with our holistic treatments and wellness therapies."
    },
    {
      id: 3,
      icon: "fas fa-swimming-pool",
      title: "Infinity Pool",
      description: "Stunning rooftop pool with panoramic views of the city skyline."
    },
    {
      id: 4,
      icon: "fas fa-dumbbell",
      title: "Fitness Center",
      description: "State-of-the-art equipment with personal training sessions available."
    }
  ];

  return (
    <section id="amenities" className="amenities-section">
      <div className="container">
        <div className="section-header">
          <h5 className="section-subtitle">Luxury Experience</h5>
          <h2 className="section-title">World-Class Amenities</h2>
          <p className="section-description">We provide exceptional facilities to ensure your stay is nothing short of perfect.</p>
        </div>
        
        <div className="row g-4">
          {amenities.map(amenity => (
            <div key={amenity.id} className="col-lg-3 col-md-6">
              <div className="amenity-card">
                <div className="amenity-icon">
                  <i className={amenity.icon}></i>
                </div>
                <h4>{amenity.title}</h4>
                <p>{amenity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;