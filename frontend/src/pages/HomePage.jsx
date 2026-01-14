import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const rooms = [
    { id: 1, name: "Deluxe Room", price: "$150/night", image: "https://via.placeholder.com/400x300" },
    { id: 2, name: "Executive Suite", price: "$250/night", image: "https://via.placeholder.com/400x300" },
    { id: 3, name: "Presidential Suite", price: "$500/night", image: "https://via.placeholder.com/400x300" }
  ];

  const amenities = [
    { icon: "🏊", title: "Swimming Pool", desc: "Heated indoor pool" },
    { icon: "🍽️", title: "Restaurant", desc: "Fine dining experience" },
    { icon: "💆", title: "Spa", desc: "Full service spa" },
    { icon: "🚗", title: "Parking", desc: "Free valet parking" },
    { icon: "🏋️", title: "Gym", desc: "24/7 fitness center" },
    { icon: "📶", title: "WiFi", desc: "High-speed internet" }
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Experience Luxury Like Never Before</h1>
          <p style={styles.heroSubtitle}>
            Book your stay at our 5-star hotel and enjoy world-class amenities
          </p>
          <Link to="/rooms" style={styles.ctaButton}>
            Book Now
          </Link>
        </div>
      </section>

      {/* Rooms Preview */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Rooms</h2>
        <p style={styles.sectionSubtitle}>Experience comfort in our premium rooms</p>
        
        <div style={styles.roomsGrid}>
          {rooms.map(room => (
            <div key={room.id} style={styles.roomCard}>
              <img src={room.image} alt={room.name} style={styles.roomImage} />
              <div style={styles.roomInfo}>
                <h3 style={styles.roomName}>{room.name}</h3>
                <p style={styles.roomPrice}>{room.price}</p>
                <Link to={`/rooms#${room.id}`} style={styles.viewButton}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <Link to="/rooms" style={styles.viewAllButton}>
          View All Rooms →
        </Link>
      </section>

      {/* Amenities */}
      <section style={styles.amenitiesSection}>
        <h2 style={styles.sectionTitle}>Our Amenities</h2>
        <p style={styles.sectionSubtitle}>Everything you need for a perfect stay</p>
        
        <div style={styles.amenitiesGrid}>
          {amenities.map((amenity, index) => (
            <div key={index} style={styles.amenityCard}>
              <div style={styles.amenityIcon}>{amenity.icon}</div>
              <h4 style={styles.amenityTitle}>{amenity.title}</h4>
              <p style={styles.amenityDesc}>{amenity.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready for an Unforgettable Experience?</h2>
          <p style={styles.ctaText}>
            Book your stay today and enjoy our special offers
          </p>
          <div style={styles.ctaButtons}>
            <Link to="/contact" style={styles.contactButton}>
              Contact Us
            </Link>
            <Link to="/register" style={styles.bookButton}>
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh'
  },
  hero: {
    background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://via.placeholder.com/1920x800)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
    padding: '20px'
  },
  heroContent: {
    maxWidth: '800px'
  },
  heroTitle: {
    fontSize: '3rem',
    marginBottom: '20px',
    fontWeight: 'bold'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '30px',
    opacity: '0.9'
  },
  ctaButton: {
    display: 'inline-block',
    padding: '15px 40px',
    backgroundColor: '#f39c12',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s'
  },
  section: {
    padding: '80px 20px',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    color: '#2c3e50'
  },
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    marginBottom: '50px'
  },
  roomsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginBottom: '40px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  roomCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s'
  },
  roomImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover'
  },
  roomInfo: {
    padding: '20px'
  },
  roomName: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#2c3e50'
  },
  roomPrice: {
    fontSize: '1.2rem',
    color: '#f39c12',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  viewButton: {
    display: 'inline-block',
    padding: '10px 20px',
    border: '2px solid #f39c12',
    color: '#f39c12',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'all 0.3s'
  },
  viewAllButton: {
    display: 'inline-block',
    padding: '12px 30px',
    backgroundColor: '#2c3e50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '16px'
  },
  amenitiesSection: {
    backgroundColor: '#f8f9fa',
    padding: '80px 20px'
  },
  amenitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  amenityCard: {
    textAlign: 'center',
    padding: '30px 20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
  },
  amenityIcon: {
    fontSize: '3rem',
    marginBottom: '20px'
  },
  amenityTitle: {
    fontSize: '1.2rem',
    marginBottom: '10px',
    color: '#2c3e50'
  },
  amenityDesc: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  ctaSection: {
    padding: '80px 20px',
    backgroundColor: '#2c3e50',
    color: 'white',
    textAlign: 'center'
  },
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  ctaTitle: {
    fontSize: '2.5rem',
    marginBottom: '20px'
  },
  ctaText: {
    fontSize: '1.1rem',
    marginBottom: '40px',
    opacity: '0.9'
  },
  ctaButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  contactButton: {
    padding: '15px 40px',
    border: '2px solid white',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'all 0.3s'
  },
  bookButton: {
    padding: '15px 40px',
    backgroundColor: '#f39c12',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s'
  }
};

export default HomePage;