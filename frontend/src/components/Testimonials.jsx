// components/Testimonials.js
import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: "\"The epitome of luxury! From the breathtaking views to the impeccable service, every moment was perfect.\"",
      name: "Michael Rodriguez",
      role: "Business Executive",
      avatarClass: "avatar-1"
    },
    {
      id: 2,
      text: "\"Our anniversary celebration was made unforgettable by the staff's attention to detail and exceptional hospitality.\"",
      name: "Sarah Johnson",
      role: "Celebrating 10th Anniversary",
      avatarClass: "avatar-2"
    },
    {
      id: 3,
      text: "\"The spa treatments were divine, and the suite was beyond luxurious. We'll definitely be returning soon!\"",
      name: "James & Emily Chen",
      role: "Honeymoon Vacation",
      avatarClass: "avatar-3"
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h5 className="section-subtitle">Guest Experiences</h5>
          <h2 className="section-title">What Our Guests Say</h2>
        </div>
        
        <div className="row g-4">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="col-lg-4">
              <div className="testimonial-card">
                <div className="testimonial-text">
                  <p>{testimonial.text}</p>
                </div>
                <div className="testimonial-author">
                  <div className={`author-avatar ${testimonial.avatarClass}`}></div>
                  <div className="author-info">
                    <h5>{testimonial.name}</h5>
                    <p>{testimonial.role}</p>
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

export default Testimonials;