// components/Hero.js
import React from 'react';

const Hero = () => {
  return (
    <header className="hero-section">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="row">
          <div className="col-lg-8">
            <h5 className="hero-subtitle">Experience Unparalleled Luxury</h5>

            <h1 className="hero-title">
              Welcome to <span className="highlight">LuxuryStay</span>
            </h1>

            <div className="hero-divider" />

            <p className="hero-description">
              Where timeless elegance meets modern comfort. Our five-star
              accommodations offer breathtaking views, world-class amenities,
              and personalized service tailored to your every need.
            </p>

            <a href="#booking" className="btn hero-cta">
              Book Your Stay
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
