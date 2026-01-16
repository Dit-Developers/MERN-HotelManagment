import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaAward, FaCertificate, FaUsers, FaShieldAlt, FaLeaf, FaLightbulb, FaHeart, FaStar, FaBuilding, FaHistory, FaMapMarkerAlt } from 'react-icons/fa';

function AboutPage() {
  const customStyles = {
    navy: {
      50: '#f0f4f8',
      100: '#d9e2ec',
      200: '#bcccdc',
      300: '#9fb3c8',
      400: '#829ab1',
      500: '#627d98',
      600: '#486581',
      700: '#334e68',
      800: '#243b53',
      900: '#102a43',
    },
    gold: {
      50: '#fff9e6',
      100: '#ffefbf',
      200: '#ffe599',
      300: '#ffdb73',
      400: '#ffd14d',
      500: '#c7a53f',
      600: '#b89434',
      700: '#9e7b2e',
      800: '#856328',
      900: '#6c4c22',
    }
  };

  const features = [
    { 
      icon: <FaBuilding />, 
      title: "Luxury Rooms", 
      desc: "200+ premium rooms and suites with bespoke furnishings",
      count: "200+"
    },
    { 
      icon: <FaTrophy />, 
      title: "Fine Dining", 
      desc: "5 Michelin-starred restaurants and curated bars",
      count: "5"
    },
    { 
      icon: <FaAward />, 
      title: "Event Spaces", 
      desc: "10,000 sq ft of flexible conference facilities",
      count: "10K"
    },
    { 
      icon: <FaCertificate />, 
      title: "Award Winning", 
      desc: "5-star rating maintained for 10 consecutive years",
      count: "10"
    }
  ];

  const team = [
    { 
      name: "Alexander Sterling", 
      position: "General Manager", 
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      experience: "20+ years in luxury hospitality",
      quote: "Excellence is not a skill, it's an attitude."
    },
    { 
      name: "Isabelle Laurent", 
      position: "Executive Head Chef", 
      img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      experience: "Michelin-star chef",
      quote: "Culinary art is the poetry of the palate."
    },
    { 
      name: "Jonathan Wright", 
      position: "Director of Hospitality", 
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      experience: "15 years in guest relations",
      quote: "True luxury is in the details."
    },
    { 
      name: "Sophia Chen", 
      position: "Event Director", 
      img: "https://images.unsplash.com/photo-1494790108755-2616b786d4b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      experience: "12 years in luxury events",
      quote: "Creating memories that last a lifetime."
    }
  ];

  const values = [
    {
      icon: <FaTrophy />,
      title: "Excellence",
      description: "We strive for perfection in every detail, from service to amenities",
      color: customStyles.gold[500]
    },
    {
      icon: <FaHeart />,
      title: "Hospitality",
      description: "Treating every guest as family with genuine care and attention",
      color: customStyles.gold[500]
    },
    {
      icon: <FaLeaf />,
      title: "Sustainability",
      description: "Committed to eco-friendly practices and responsible luxury",
      color: customStyles.gold[500]
    },
    {
      icon: <FaLightbulb />,
      title: "Innovation",
      description: "Continuously evolving to exceed guest expectations",
      color: customStyles.gold[500]
    },
    {
      icon: <FaShieldAlt />,
      title: "Integrity",
      description: "Maintaining the highest ethical standards in all operations",
      color: customStyles.gold[500]
    },
    {
      icon: <FaUsers />,
      title: "Collaboration",
      description: "Our team works together to create exceptional experiences",
      color: customStyles.gold[500]
    }
  ];

  const milestones = [
    { year: "1995", title: "Foundation", description: "Luxury Hotel established with 50 rooms" },
    { year: "2005", title: "Expansion", description: "First major renovation adding spa and conference facilities" },
    { year: "2010", title: "Recognition", description: "Awarded first 5-star rating" },
    { year: "2015", title: "Growth", description: "Added Michelin-star restaurant" },
    { year: "2020", title: "Innovation", description: "Complete sustainable renovation" },
    { year: "2023", title: "Excellence", description: "10th consecutive 5-star rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 lg:py-36 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Hotel Lobby"
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${customStyles.navy[900]}CC, ${customStyles.navy[800]}CC)`
            }}
          ></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl">
          <div className="inline-block mb-4 sm:mb-6">
            <span 
              className="font-light tracking-[0.3em] uppercase text-xs sm:text-sm"
              style={{ color: customStyles.gold[400] }}
            >
              Our Legacy
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-white mb-6 sm:mb-8 leading-tight tracking-tight">
            Crafting <span style={{ color: customStyles.gold[500] }} className="font-normal">Timeless</span> <br className="hidden sm:block" />Experiences
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed font-light tracking-wide px-4">
            For over 25 years, we've been redefining luxury hospitality with uncompromising 
            excellence and heartfelt service
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button 
              onClick={() => document.getElementById('story').scrollIntoView({ behavior: 'smooth' })}
              style={{ backgroundColor: customStyles.gold[600] }}
              className="group px-8 sm:px-10 lg:px-12 py-3 sm:py-4 text-white font-medium rounded-sm transition-all duration-300 transform hover:scale-105 text-sm sm:text-base tracking-wider uppercase relative overflow-hidden hover:shadow-xl sm:hover:shadow-2xl w-full sm:w-auto text-center"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
            >
              <span className="relative z-10">Discover Our Story</span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to right, ${customStyles.gold[600]}, ${customStyles.gold[700]})`
                }}
              ></div>
            </button>
            <Link 
              to="/contact"
              className="px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-transparent border border-gray-400 hover:border-white text-gray-300 hover:text-white font-medium rounded-sm transition-all duration-300 text-sm sm:text-base tracking-wider uppercase w-full sm:w-auto text-center"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div>
              <div className="inline-block mb-4">
                <span 
                  className="font-light tracking-[0.3em] uppercase text-xs"
                  style={{ color: customStyles.gold[600] }}
                >
                  Our Heritage
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-6 sm:mb-8 tracking-tight"
                style={{ color: customStyles.navy[900] }}
              >
                A Legacy of <span style={{ color: customStyles.gold[500] }} className="font-normal">Excellence</span>
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed font-light">
                  Established in 1995, Luxury Hotel began as a vision to create an unparalleled 
                  sanctuary in the heart of the city. What started as a boutique property with 
                  50 rooms has evolved into a landmark destination, celebrated for its timeless 
                  elegance and innovative approach to luxury hospitality.
                </p>
                
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed font-light">
                  Over the past quarter-century, we've hosted dignitaries, celebrities, and 
                  discerning travelers from around the globe, each leaving with memories that 
                  last a lifetime. Our commitment to excellence has earned us recognition as 
                  one of the world's premier luxury hotels.
                </p>
                
                <div className="pt-4 sm:pt-6">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-center">
                      <div 
                        className="text-3xl sm:text-4xl font-serif font-bold mb-1"
                        style={{ color: customStyles.gold[500] }}
                      >
                        25+
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-widest font-light">
                        Years Experience
                      </div>
                    </div>
                    <div className="h-12 w-px bg-gray-300"></div>
                    <div className="text-center">
                      <div 
                        className="text-3xl sm:text-4xl font-serif font-bold mb-1"
                        style={{ color: customStyles.gold[500] }}
                      >
                        50K+
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-widest font-light">
                        Happy Guests
                      </div>
                    </div>
                    <div className="h-12 w-px bg-gray-300"></div>
                    <div className="text-center">
                      <div 
                        className="text-3xl sm:text-4xl font-serif font-bold mb-1"
                        style={{ color: customStyles.gold[500] }}
                      >
                        150+
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-widest font-light">
                        Awards Won
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Image */}
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Historic Hotel Building"
                  className="w-full h-[400px] sm:h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"
                ></div>
              </div>
              
              {/* Decorative Element */}
              <div 
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full hidden lg:block"
                style={{ backgroundColor: customStyles.gold[900] }}
              ></div>
              <div 
                className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full hidden lg:block"
                style={{ backgroundColor: customStyles.navy[800] }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block mb-4">
              <span 
                className="font-light tracking-[0.3em] uppercase text-xs"
                style={{ color: customStyles.gold[600] }}
              >
                Distinguished Features
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-6 sm:mb-8 tracking-tight"
              style={{ color: customStyles.navy[900] }}
            >
              Unmatched <span style={{ color: customStyles.gold[500] }} className="font-normal">Excellence</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed px-4">
              Experience the pinnacle of luxury with our world-class facilities and services
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden border border-gray-200 rounded-lg p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = customStyles.gold[500];
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div 
                  className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"
                  style={{ backgroundColor: `${customStyles.gold[600]}1A` }}
                ></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div 
                      className="text-2xl sm:text-3xl"
                      style={{ color: customStyles.gold[600] }}
                    >
                      {feature.icon}
                    </div>
                    <div 
                      className="text-2xl sm:text-3xl font-serif font-bold"
                      style={{ color: customStyles.navy[900] }}
                    >
                      {feature.count}
                    </div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-light mb-3 tracking-wide"
                    style={{ color: customStyles.navy[900] }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section 
        className="py-12 sm:py-16 lg:py-20 xl:py-24"
        style={{ backgroundColor: customStyles.navy[900] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block mb-4">
              <span className="font-light tracking-[0.3em] uppercase text-xs"
                style={{ color: customStyles.gold[400] }}
              >
                Our Philosophy
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white mb-6 sm:mb-8 tracking-tight">
              Core <span style={{ color: customStyles.gold[500] }} className="font-normal">Values</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed px-4">
              The principles that guide every aspect of our service and operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-gray-800 rounded-lg p-6 sm:p-8 transition-all duration-500 hover:bg-white/10"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${customStyles.gold[500]}80`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#374151';
                }}
              >
                <div 
                  className="text-3xl mb-6 transform group-hover:scale-110 transition-transform duration-500"
                  style={{ color: value.color }}
                >
                  {value.icon}
                </div>
                
                <h3 className="text-xl font-light mb-3 tracking-wide text-white">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block mb-4">
              <span 
                className="font-light tracking-[0.3em] uppercase text-xs"
                style={{ color: customStyles.gold[600] }}
              >
                Leadership Team
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-6 sm:mb-8 tracking-tight"
              style={{ color: customStyles.navy[900] }}
            >
              Meet Our <span style={{ color: customStyles.gold[500] }} className="font-normal">Experts</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed px-4">
              Dedicated professionals committed to delivering exceptional experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <div className="aspect-w-3 aspect-h-4">
                    <img 
                      src={member.img} 
                      alt={member.name}
                      className="w-full h-[300px] sm:h-[350px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div 
                      className="bg-white/90 backdrop-blur-sm p-4 rounded-lg"
                    >
                      <p className="text-xs sm:text-sm text-gray-600 font-light italic">
                        "{member.quote}"
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 
                    className="text-lg sm:text-xl font-light mb-1"
                    style={{ color: customStyles.navy[900] }}
                  >
                    {member.name}
                  </h3>
                  <p 
                    className="text-sm font-medium mb-2"
                    style={{ color: customStyles.gold[600] }}
                  >
                    {member.position}
                  </p>
                  <p className="text-xs text-gray-500 font-light">
                    {member.experience}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <span 
                className="font-light tracking-[0.3em] uppercase text-xs"
                style={{ color: customStyles.gold[600] }}
              >
                Our Journey
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-6 sm:mb-8 tracking-tight"
              style={{ color: customStyles.navy[900] }}
            >
              Milestones of <span style={{ color: customStyles.gold[500] }} className="font-normal">Excellence</span>
            </h2>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-px"
              style={{ backgroundColor: customStyles.gold[300] }}
            ></div>
            
            <div className="space-y-12 lg:space-y-0">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`relative lg:flex lg:items-center lg:justify-between ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full z-10"
                    style={{ backgroundColor: customStyles.gold[500] }}
                  ></div>
                  
                  {/* Content */}
                  <div className={`lg:w-5/12 ${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                    <div 
                      className="inline-block px-4 py-2 rounded-full mb-4"
                      style={{ 
                        backgroundColor: customStyles.gold[100],
                        color: customStyles.gold[700]
                      }}
                    >
                      <span className="text-sm font-medium">{milestone.year}</span>
                    </div>
                    <h3 
                      className="text-xl font-light mb-2"
                      style={{ color: customStyles.navy[900] }}
                    >
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-light">
                      {milestone.description}
                    </p>
                  </div>
                  
                  {/* Empty space for opposite side */}
                  <div className="hidden lg:block lg:w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${customStyles.navy[900]}, ${customStyles.navy[800]}, ${customStyles.navy[900]})`
          }}
        >
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1615460549969-36fa19521a4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block mb-6">
            <span 
              className="font-light tracking-[0.3em] uppercase text-xs"
              style={{ color: customStyles.gold[400] }}
            >
              Experience Excellence
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white mb-8 sm:mb-10 tracking-tight leading-tight">
            Become Part of Our <span style={{ color: customStyles.gold[500] }} className="font-normal">Story</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-10 sm:mb-12 lg:mb-14 max-w-2xl mx-auto leading-relaxed font-light px-4">
            Experience the legacy of luxury hospitality that has been cherished for generations
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link 
              to="/rooms"
              style={{ backgroundColor: customStyles.gold[600] }}
              className="group px-8 sm:px-10 lg:px-12 py-3 sm:py-4 text-white font-medium rounded-sm transition-all duration-300 transform hover:scale-105 text-sm sm:text-base tracking-wider uppercase relative overflow-hidden hover:shadow-xl sm:hover:shadow-2xl w-full sm:w-auto text-center"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
            >
              <span className="relative z-10">Book Your Stay</span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to right, ${customStyles.gold[600]}, ${customStyles.gold[700]})`
                }}
              ></div>
            </Link>
            <Link 
              to="/contact"
              className="px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-transparent border border-gray-400 hover:border-white text-gray-300 hover:text-white font-medium rounded-sm transition-all duration-300 text-sm sm:text-base tracking-wider uppercase w-full sm:w-auto text-center"
            >
              Schedule a Tour
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;