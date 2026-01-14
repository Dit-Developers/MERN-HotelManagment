import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RoomsPage() {
  const [filter, setFilter] = useState('all');
  
  const rooms = [
    { id: 1, name: "Standard Room", type: "standard", price: "$99/night", size: "300 sq ft", beds: "1 Queen", amenities: ["WiFi", "TV", "AC"], image: "https://via.placeholder.com/400x300" },
    { id: 2, name: "Deluxe Room", type: "deluxe", price: "$150/night", size: "400 sq ft", beds: "1 King", amenities: ["WiFi", "TV", "AC", "Minibar"], image: "https://via.placeholder.com/400x300" },
    { id: 3, name: "Executive Suite", type: "suite", price: "$250/night", size: "600 sq ft", beds: "1 King + Sofa", amenities: ["WiFi", "TV", "AC", "Minibar", "Jacuzzi"], image: "https://via.placeholder.com/400x300" },
    { id: 4, name: "Presidential Suite", type: "suite", price: "$500/night", size: "1000 sq ft", beds: "2 Kings", amenities: ["WiFi", "TV", "AC", "Minibar", "Jacuzzi", "Butler"], image: "https://via.placeholder.com/400x300" },
    { id: 5, name: "Family Room", type: "family", price: "$180/night", size: "450 sq ft", beds: "2 Queens", amenities: ["WiFi", "TV", "AC", "Kids Area"], image: "https://via.placeholder.com/400x300" },
    { id: 6, name: "Honeymoon Suite", type: "suite", price: "$350/night", size: "550 sq ft", beds: "1 King", amenities: ["WiFi", "TV", "AC", "Minibar", "Romantic Decor"], image: "https://via.placeholder.com/400x300" }
  ];

  const filteredRooms = filter === 'all' 
    ? rooms 
    : rooms.filter(room => room.type === filter);

  const filters = [
    { id: 'all', label: 'All Rooms' },
    { id: 'standard', label: 'Standard' },
    { id: 'deluxe', label: 'Deluxe' },
    { id: 'suite', label: 'Suites' },
    { id: 'family', label: 'Family' }
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Rooms & Suites</h1>
        <p style={styles.heroSubtitle}>Choose from our luxurious accommodations</p>
      </section>

      {/* Filters */}
      <section style={styles.filtersSection}>
        <div style={styles.filters}>
          {filters.map(f => (
            <button
              key={f.id}
              style={filter === f.id ? styles.activeFilter : styles.filterButton}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Rooms Grid */}
      <section style={styles.roomsSection}>
        <div style={styles.roomsGrid}>
          {filteredRooms.map(room => (
            <div key={room.id} style={styles.roomCard}>
              <img src={room.image} alt={room.name} style={styles.roomImage} />
              <div style={styles.roomInfo}>
                <div style={styles.roomHeader}>
                  <h3 style={styles.roomName}>{room.name}</h3>
                  <span style={styles.roomPrice}>{room.price}</span>
                </div>
                
                <div style={styles.roomDetails}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Size:</span>
                    <span style={styles.detailValue}>{room.size}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Beds:</span>
                    <span style={styles.detailValue}>{room.beds}</span>
                  </div>
                </div>

                <div style={styles.amenities}>
                  <p style={styles.amenitiesTitle}>Amenities:</p>
                  <div style={styles.amenitiesList}>
                    {room.amenities.map((amenity, index) => (
                      <span key={index} style={styles.amenityTag}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={styles.roomActions}>
                  <Link 
                    to="/register" 
                    style={styles.bookButton}
                  >
                    Book Now
                  </Link>
                  <button style={styles.detailsButton}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Room Features</h2>
        
        <div style={styles.featuresGrid}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🛏️</div>
            <h4>Luxury Bedding</h4>
            <p>Premium mattresses and linens</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🚿</div>
            <h4>Spa Bathrooms</h4>
            <p>Rain showers and premium toiletries</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>📶</div>
            <h4>High-Speed WiFi</h4>
            <p>Complimentary high-speed internet</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🍽️</div>
            <h4>Room Service</h4>
            <p>24/7 dining options</p>
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
    background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://via.placeholder.com/1920x600)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '50vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    padding: '20px'
  },
  heroTitle: {
    fontSize: '3rem',
    marginBottom: '20px'
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    opacity: '0.9'
  },
  filtersSection: {
    backgroundColor: '#f8f9fa',
    padding: '30px 20px'
  },
  filters: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  filterButton: {
    padding: '12px 30px',
    border: '2px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s'
  },
  activeFilter: {
    padding: '12px 30px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  roomsSection: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  roomsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '40px'
  },
  roomCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s'
  },
  roomImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover'
  },
  roomInfo: {
    padding: '25px'
  },
  roomHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  roomName: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    margin: 0
  },
  roomPrice: {
    fontSize: '1.3rem',
    color: '#f39c12',
    fontWeight: 'bold'
  },
  roomDetails: {
    display: 'flex',
    gap: '30px',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee'
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  detailLabel: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    marginBottom: '5px'
  },
  detailValue: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  amenities: {
    marginBottom: '25px'
  },
  amenitiesTitle: {
    fontSize: '1rem',
    color: '#2c3e50',
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  amenitiesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  amenityTag: {
    backgroundColor: '#f8f9fa',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    color: '#555'
  },
  roomActions: {
    display: 'flex',
    gap: '15px'
  },
  bookButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#f39c12',
    color: 'white',
    textDecoration: 'none',
    textAlign: 'center',
    borderRadius: '5px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  },
  detailsButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#2c3e50',
    color: 'white',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  },
  featuresSection: {
    backgroundColor: '#f8f9fa',
    padding: '80px 20px'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '50px',
    color: '#2c3e50'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  feature: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '20px'
  }
};

export default RoomsPage;