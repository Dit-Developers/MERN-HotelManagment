import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.footerContent}>
          {/* About Section */}
          <div style={styles.footerSection}>
            <h3 style={styles.sectionTitle}>Luxury Hotel</h3>
            <p style={styles.aboutText}>
              Experience luxury and comfort at our 5-star hotel. 
              Perfect for business trips, family vacations, and romantic getaways.
            </p>
          </div>

          {/* Quick Links */}
          <div style={styles.footerSection}>
            <h3 style={styles.sectionTitle}>Quick Links</h3>
            <ul style={styles.linkList}>
              <li><Link to="/" style={styles.footerLink}>Home</Link></li>
              <li><Link to="/about" style={styles.footerLink}>About Us</Link></li>
              <li><Link to="/rooms" style={styles.footerLink}>Rooms & Suites</Link></li>
              <li><Link to="/gallery" style={styles.footerLink}>Gallery</Link></li>
              <li><Link to="/contact" style={styles.footerLink}>Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div style={styles.footerSection}>
            <h3 style={styles.sectionTitle}>Contact Us</h3>
            <ul style={styles.contactList}>
              <li style={styles.contactItem}>📍 123 Luxury Street, City, Country</li>
              <li style={styles.contactItem}>📞 +1 234 567 8900</li>
              <li style={styles.contactItem}>✉️ info@luxuryhotel.com</li>
              <li style={styles.contactItem}>🕒 24/7 Reception</li>
            </ul>
          </div>

          {/* Social Media */}
          <div style={styles.footerSection}>
            <h3 style={styles.sectionTitle}>Follow Us</h3>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialLink}>Facebook</a>
              <a href="#" style={styles.socialLink}>Instagram</a>
              <a href="#" style={styles.socialLink}>Twitter</a>
              <a href="#" style={styles.socialLink}>LinkedIn</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={styles.copyright}>
          <p>© {new Date().getFullYear()} Luxury Hotel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '50px 0 20px',
    marginTop: 'auto'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '30px'
    }
  },
  footerSection: {
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#f39c12'
  },
  aboutText: {
    lineHeight: '1.6',
    opacity: '0.8'
  },
  linkList: {
    listStyle: 'none',
    padding: 0
  },
  footerLink: {
    color: 'white',
    textDecoration: 'none',
    lineHeight: '2',
    opacity: '0.8',
    transition: 'opacity 0.3s',
    '&:hover': {
      opacity: 1,
      color: '#f39c12'
    }
  },
  contactList: {
    listStyle: 'none',
    padding: 0
  },
  contactItem: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    opacity: '0.8'
  },
  socialLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  socialLink: {
    color: 'white',
    textDecoration: 'none',
    opacity: '0.8',
    transition: 'opacity 0.3s',
    '&:hover': {
      opacity: 1,
      color: '#f39c12'
    }
  },
  copyright: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    opacity: '0.6',
    fontSize: '14px'
  }
};

export default Footer;