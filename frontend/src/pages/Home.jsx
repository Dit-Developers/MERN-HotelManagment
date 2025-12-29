// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BookingWidget from '../components/BookingWidget';
import Rooms from '../components/Rooms';
import Amenities from '../components/Amenities';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import '../App.css';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Handle hash in URL for direct navigation to sections
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check for hash on initial load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-page">
      <Navbar scrolled={scrolled} />
      <section id="home">
        <Hero />
      </section>
      <section id="booking">
        <BookingWidget />
      </section>
      <section id="rooms">
        <Rooms />
      </section>
      <section id="amenities">
        <Amenities />
      </section>
      <Testimonials />
      <section id="contact">
        <Footer />
      </section>
    </div>
  );
};

export default Home;