// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();

  /* Navbar scroll effect ONLY */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Handle section scroll AFTER navigation */
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.querySelector(location.state.scrollTo);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 120);
      }
    }
  }, [location]);

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
