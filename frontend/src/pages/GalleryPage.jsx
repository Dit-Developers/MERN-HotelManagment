import React, { useState } from 'react';

function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'rooms', name: 'Rooms & Suites' },
    { id: 'restaurant', name: 'Restaurant' },
    { id: 'pool', name: 'Pool & Spa' },
    { id: 'events', name: 'Events' },
    { id: 'lobby', name: 'Lobby' }
  ];

  const images = [
    { id: 1, category: 'rooms', url: 'https://via.placeholder.com/400x300/2c3e50/ffffff', title: 'Deluxe Room' },
    { id: 2, category: 'rooms', url: 'https://via.placeholder.com/400x300/3498db/ffffff', title: 'Presidential Suite' },
    { id: 3, category: 'restaurant', url: 'https://via.placeholder.com/400x300/e74c3c/ffffff', title: 'Main Restaurant' },
    { id: 4, category: 'restaurant', url: 'https://via.placeholder.com/400x300/2ecc71/ffffff', title: 'Bar Area' },
    { id: 5, category: 'pool', url: 'https://via.placeholder.com/400x300/9b59b6/ffffff', title: 'Swimming Pool' },
    { id: 6, category: 'pool', url: 'https://via.placeholder.com/400x300/1abc9c/ffffff', title: 'Spa Center' },
    { id: 7, category: 'events', url: 'https://via.placeholder.com/400x300/f39c12/ffffff', title: 'Conference Hall' },
    { id: 8, category: 'events', url: 'https://via.placeholder.com/400x300/34495e/ffffff', title: 'Wedding Venue' },
    { id: 9, category: 'lobby', url: 'https://via.placeholder.com/400x300/16a085/ffffff', title: 'Main Lobby' },
    { id: 10, category: 'lobby', url: 'https://via.placeholder.com/400x300/8e44ad/ffffff', title: 'Reception' },
    { id: 11, category: 'rooms', url: 'https://via.placeholder.com/400x300/27ae60/ffffff', title: 'Family Room' },
    { id: 12, category: 'restaurant', url: 'https://via.placeholder.com/400x300/2980b9/ffffff', title: 'Outdoor Dining' }
  ];

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Photo Gallery</h1>
        <p style={styles.heroSubtitle}>Explore our hotel through photos</p>
      </section>

      {/* Category Filters */}
      <section style={styles.filterSection}>
        <div style={styles.filters}>
          {categories.map(category => (
            <button
              key={category.id}
              style={activeCategory === category.id ? styles.activeCategory : styles.categoryButton}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section style={styles.gallerySection}>
        <div style={styles.galleryGrid}>
          {filteredImages.map(image => (
            <div key={image.id} style={styles.galleryItem}>
              <img 
                src={image.url} 
                alt={image.title} 
                style={styles.galleryImage}
              />
              <div style={styles.imageOverlay}>
                <h4 style={styles.imageTitle}>{image.title}</h4>
                <span style={styles.imageCategory}>
                  {categories.find(c => c.id === image.category)?.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Virtual Tour */}
      <section style={styles.virtualTour}>
        <div style={styles.virtualContent}>
          <h2 style={styles.virtualTitle}>Virtual Tour</h2>
          <p style={styles.virtualText}>
            Take a 360° virtual tour of our hotel facilities
          </p>
          <button style={styles.virtualButton}>
            Start Virtual Tour
          </button>
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
  filterSection: {
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
  categoryButton: {
    padding: '12px 30px',
    border: '2px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s'
  },
  activeCategory: {
    padding: '12px 30px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  gallerySection: {
    padding: '80px 20px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  galleryItem: {
    position: 'relative',
    borderRadius: '10px',
    overflow: 'hidden',
    height: '250px',
    cursor: 'pointer'
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s'
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    color: 'white',
    padding: '20px',
    transform: 'translateY(100%)',
    transition: 'transform 0.3s'
  },
  imageTitle: {
    margin: 0,
    fontSize: '1.2rem'
  },
  imageCategory: {
    fontSize: '0.9rem',
    opacity: '0.8'
  },
  virtualTour: {
    background: 'linear-gradient(rgba(44, 62, 80, 0.9), rgba(44, 62, 80, 0.9)), url(https://via.placeholder.com/1920x400)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '100px 20px',
    textAlign: 'center',
    color: 'white'
  },
  virtualContent: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  virtualTitle: {
    fontSize: '2.5rem',
    marginBottom: '20px'
  },
  virtualText: {
    fontSize: '1.2rem',
    marginBottom: '40px',
    opacity: '0.9'
  },
  virtualButton: {
    padding: '15px 50px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default GalleryPage;