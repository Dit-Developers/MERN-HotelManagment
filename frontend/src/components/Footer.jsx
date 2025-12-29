// components/Footer.js
import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with email: ${email}. You'll receive our exclusive offers soon.`);
      setEmail('');
    } else {
      alert('Please enter your email address.');
    }
  };

  return (
    <footer id="contact" className="footer-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="footer-brand">
              <div className="logo-container">
                <div className="logo-circle">
                  <span className="logo-text">LS</span>
                </div>
                <span className="brand-name">LuxuryStay <span className="brand-subtitle">Hospitality</span></span>
              </div>
              <p className="footer-description">
                Redefining luxury hospitality with unparalleled service, exquisite accommodations, and unforgettable experiences.
              </p>
            </div>
          </div>
          
          <div className="col-lg-4">
            <h4>Contact Information</h4>
            <ul className="contact-info">
              <li><i className="fas fa-map-marker-alt"></i> 123 Luxury Avenue, Prestige District</li>
              <li><i className="fas fa-phone"></i> +1 (555) 123-4567</li>
              <li><i className="fas fa-envelope"></i> reservations@luxurystay.com</li>
            </ul>
          </div>
          
          <div className="col-lg-4">
            <h4>Stay Connected</h4>
            <p>Subscribe to our newsletter for exclusive offers and updates.</p>
            <form onSubmit={handleSubscribe} className="subscribe-form">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
            <div className="social-icons mt-4">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-tripadvisor"></i></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LuxuryStay Hospitality. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;