import React, { useState } from 'react';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  const contactInfo = [
    { icon: "📍", title: "Address", info: "123 Luxury Street, City, Country 12345" },
    { icon: "📞", title: "Phone", info: "+1 234 567 8900\n+1 234 567 8901" },
    { icon: "✉️", title: "Email", info: "info@luxuryhotel.com\nreservations@luxuryhotel.com" },
    { icon: "🕒", title: "Hours", info: "Reception: 24/7\nRestaurant: 6AM - 11PM" }
  ];

  const departments = [
    { name: "Reservations", email: "reservations@luxuryhotel.com", phone: "+1 234 567 8902" },
    { name: "Events", email: "events@luxuryhotel.com", phone: "+1 234 567 8903" },
    { name: "Human Resources", email: "hr@luxuryhotel.com", phone: "+1 234 567 8904" },
    { name: "Sales", email: "sales@luxuryhotel.com", phone: "+1 234 567 8905" }
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Contact Us</h1>
        <p style={styles.heroSubtitle}>We're here to help you</p>
      </section>

      <div style={styles.content}>
        {/* Contact Info */}
        <section style={styles.infoSection}>
          <h2 style={styles.sectionTitle}>Get in Touch</h2>
          
          <div style={styles.infoGrid}>
            {contactInfo.map((item, index) => (
              <div key={index} style={styles.infoCard}>
                <div style={styles.infoIcon}>{item.icon}</div>
                <h3 style={styles.infoTitle}>{item.title}</h3>
                <p style={styles.infoText}>{item.info}</p>
              </div>
            ))}
          </div>

          {/* Map */}
          <div style={styles.mapContainer}>
            <h3 style={styles.mapTitle}>Our Location</h3>
            <div style={styles.map}>
              {/* Replace with actual map */}
              <div style={styles.mapPlaceholder}>
                <p>📍 Map Location</p>
                <p>123 Luxury Street, City, Country</p>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div style={styles.departments}>
            <h3 style={styles.departmentsTitle}>Contact Departments</h3>
            <div style={styles.departmentsGrid}>
              {departments.map((dept, index) => (
                <div key={index} style={styles.departmentCard}>
                  <h4>{dept.name}</h4>
                  <p>Email: {dept.email}</p>
                  <p>Phone: {dept.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Send us a Message</h2>
          
          {submitted ? (
            <div style={styles.successMessage}>
              <h3>Thank You!</h3>
              <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
              <button 
                onClick={() => setSubmitted(false)}
                style={styles.newMessageButton}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  placeholder="Your Name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="reservation">Room Reservation</option>
                  <option value="event">Event Booking</option>
                  <option value="feedback">Feedback/Suggestion</option>
                  <option value="complaint">Complaint</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows="6"
                  required
                  placeholder="Your message here..."
                />
              </div>

              <button 
                type="submit" 
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </section>
      </div>

      {/* FAQ Section */}
      <section style={styles.faqSection}>
        <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
        
        <div style={styles.faqList}>
          <div style={styles.faqItem}>
            <h4>What are your check-in and check-out times?</h4>
            <p>Check-in: 3:00 PM | Check-out: 12:00 PM</p>
          </div>
          <div style={styles.faqItem}>
            <h4>Do you offer airport transportation?</h4>
            <p>Yes, we offer airport pickup and drop-off service. Please contact us in advance.</p>
          </div>
          <div style={styles.faqItem}>
            <h4>Is parking available?</h4>
            <p>Yes, we have complimentary valet parking for all guests.</p>
          </div>
          <div style={styles.faqItem}>
            <h4>Do you have pet-friendly rooms?</h4>
            <p>Yes, we have designated pet-friendly rooms with additional amenities.</p>
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
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '50px',
    maxWidth: '1200px',
    margin: '80px auto',
    padding: '0 20px'
  },
  infoSection: {
    paddingRight: '30px'
  },
  formSection: {
    paddingLeft: '30px',
    borderLeft: '1px solid #eee'
  },
  sectionTitle: {
    fontSize: '2rem',
    marginBottom: '30px',
    color: '#2c3e50'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  infoCard: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px'
  },
  infoIcon: {
    fontSize: '2rem',
    marginBottom: '15px'
  },
  infoTitle: {
    fontSize: '1.2rem',
    marginBottom: '10px',
    color: '#2c3e50'
  },
  infoText: {
    color: '#7f8c8d',
    lineHeight: '1.6',
    whiteSpace: 'pre-line'
  },
  mapContainer: {
    marginBottom: '40px'
  },
  mapTitle: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    color: '#2c3e50'
  },
  map: {
    height: '300px',
    backgroundColor: '#eee',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapPlaceholder: {
    textAlign: 'center',
    color: '#7f8c8d'
  },
  departments: {
    marginBottom: '40px'
  },
  departmentsTitle: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    color: '#2c3e50'
  },
  departmentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  departmentCard: {
    padding: '20px',
    backgroundColor: 'white',
    border: '1px solid #eee',
    borderRadius: '10px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '25px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px'
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    backgroundColor: 'white'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    resize: 'vertical'
  },
  submitButton: {
    padding: '15px 40px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  successMessage: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '10px'
  },
  newMessageButton: {
    marginTop: '20px',
    padding: '10px 30px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  faqSection: {
    backgroundColor: '#f8f9fa',
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  faqList: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  faqItem: {
    marginBottom: '25px',
    paddingBottom: '25px',
    borderBottom: '1px solid #eee'
  },
  faqItem: {
    marginBottom: '25px',
    paddingBottom: '25px',
    borderBottom: '1px solid #eee'
  }
};

export default ContactPage;