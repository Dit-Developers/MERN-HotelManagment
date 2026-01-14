import React from 'react';

function AboutPage() {
  const features = [
    { title: "Luxury Rooms", desc: "200+ premium rooms and suites" },
    { title: "Fine Dining", desc: "5 restaurants and bars" },
    { title: "Event Spaces", desc: "10,000 sq ft conference facilities" },
    { title: "Award Winning", desc: "5-star rating for 10 consecutive years" }
  ];

  const team = [
    { name: "John Smith", position: "General Manager", img: "https://via.placeholder.com/150" },
    { name: "Sarah Johnson", position: "Head Chef", img: "https://via.placeholder.com/150" },
    { name: "Mike Wilson", position: "Head of Hospitality", img: "https://via.placeholder.com/150" },
    { name: "Emma Davis", position: "Event Manager", img: "https://via.placeholder.com/150" }
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>About Luxury Hotel</h1>
        <p style={styles.heroSubtitle}>Where Luxury Meets Comfort</p>
      </section>

      {/* About Content */}
      <section style={styles.section}>
        <div style={styles.content}>
          <div style={styles.textContent}>
            <h2 style={styles.title}>Our Story</h2>
            <p style={styles.paragraph}>
              Established in 1995, Luxury Hotel has been providing exceptional hospitality 
              for over 25 years. Located in the heart of the city, we've hosted thousands 
              of satisfied guests from around the world.
            </p>
            <p style={styles.paragraph}>
              Our mission is to create unforgettable experiences through personalized service, 
              luxurious accommodations, and world-class amenities.
            </p>
          </div>
          <img 
            src="https://via.placeholder.com/500x300" 
            alt="Hotel" 
            style={styles.image}
          />
        </div>
      </section>

      {/* Features */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why Choose Us</h2>
        <p style={styles.sectionSubtitle}>What makes us special</p>
        
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Meet Our Team</h2>
        <p style={styles.sectionSubtitle}>Dedicated professionals committed to your comfort</p>
        
        <div style={styles.teamGrid}>
          {team.map((member, index) => (
            <div key={index} style={styles.teamCard}>
              <img src={member.img} alt={member.name} style={styles.teamImage} />
              <h4 style={styles.teamName}>{member.name}</h4>
              <p style={styles.teamPosition}>{member.position}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={styles.valuesSection}>
        <div style={styles.valuesContent}>
          <h2 style={styles.valuesTitle}>Our Values</h2>
          <div style={styles.valuesList}>
            <div style={styles.valueItem}>
              <h3>Excellence</h3>
              <p>We strive for perfection in everything we do</p>
            </div>
            <div style={styles.valueItem}>
              <h3>Hospitality</h3>
              <p>Treating every guest like family</p>
            </div>
            <div style={styles.valueItem}>
              <h3>Sustainability</h3>
              <p>Committed to eco-friendly practices</p>
            </div>
            <div style={styles.valueItem}>
              <h3>Innovation</h3>
              <p>Continuously improving our services</p>
            </div>
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
  section: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '50px',
    alignItems: 'center',
    marginBottom: '60px'
  },
  textContent: {
    paddingRight: '30px'
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '30px'
  },
  paragraph: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#555',
    marginBottom: '20px'
  },
  image: {
    width: '100%',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  },
  featuresSection: {
    backgroundColor: '#f8f9fa',
    padding: '80px 20px'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2c3e50'
  },
  sectionSubtitle: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: '50px',
    fontSize: '1.1rem'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '40px 30px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
  },
  featureTitle: {
    fontSize: '1.5rem',
    marginBottom: '15px',
    color: '#2c3e50'
  },
  featureDesc: {
    color: '#7f8c8d',
    fontSize: '1rem'
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginTop: '50px'
  },
  teamCard: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
  },
  teamImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    marginBottom: '20px',
    objectFit: 'cover'
  },
  teamName: {
    fontSize: '1.3rem',
    marginBottom: '10px',
    color: '#2c3e50'
  },
  teamPosition: {
    color: '#f39c12',
    fontWeight: 'bold'
  },
  valuesSection: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '80px 20px'
  },
  valuesContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  valuesTitle: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '50px'
  },
  valuesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px'
  },
  valueItem: {
    textAlign: 'center',
    padding: '30px'
  },
  valueItem: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '10px'
  }
};

export default AboutPage;