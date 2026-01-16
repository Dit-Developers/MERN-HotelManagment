import React from 'react';
import { Link } from 'react-router-dom';
import { FaSwimmingPool, FaUtensils, FaSpa, FaParking, FaDumbbell, FaWifi, FaStar, FaConciergeBell, FaWineGlassAlt, FaBed, FaChevronRight } from 'react-icons/fa';

function HomePage() {
  const rooms = [
    { 
      id: 1, 
      name: "Deluxe Room", 
      price: "$150/night", 
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Elegant room with premium amenities"
    },
    { 
      id: 2, 
      name: "Executive Suite", 
      price: "$250/night", 
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Spacious suite with separate living area"
    },
    { 
      id: 3, 
      name: "Presidential Suite", 
      price: "$500/night", 
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Ultimate luxury with panoramic views"
    }
  ];

  const amenities = [
    { icon: <FaSwimmingPool />, title: "Infinity Pool", desc: "Heated infinity pool with ocean view" },
    { icon: <FaUtensils />, title: "Fine Dining", desc: "Michelin-starred restaurant & bar" },
    { icon: <FaSpa />, title: "Luxury Spa", desc: "Award-winning spa treatments" },
    { icon: <FaParking />, title: "Valet Service", desc: "24/7 complimentary valet parking" },
    { icon: <FaDumbbell />, title: "Fitness Center", desc: "State-of-the-art gym equipment" },
    { icon: <FaWifi />, title: "High-Speed WiFi", desc: "Complimentary high-speed internet" },
    { icon: <FaConciergeBell />, title: "24/7 Concierge", desc: "Personalized concierge service" },
    { icon: <FaWineGlassAlt />, title: "Wine Cellar", desc: "Curated wine selection & tasting" }
  ];

  const features = [
    { number: "24/7", text: "Room Service" },
    { number: "100+", text: "Luxury Rooms" },
    { number: "5★", text: "Rating" },
    { number: "10+", text: "Restaurants" }
  ];

  // Custom color styles
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Responsive */}
      <section className="relative h-[80vh] sm:h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80&blend=111827&blend-alpha=50"
            alt="Luxury Hotel"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.9)' }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${customStyles.navy[900]}CC, ${customStyles.navy[800]}CC)`
            }}
          ></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl">
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} style={{ color: customStyles.gold[500] }} className="text-lg sm:text-xl" />
            ))}
            <span className="text-gray-300 ml-2 sm:ml-3 text-sm sm:text-lg tracking-widest uppercase font-light">
              Luxury Collection
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-white mb-6 sm:mb-8 leading-tight tracking-tight">
            Where <span style={{ color: customStyles.gold[500] }} className="font-normal">Elegance</span> <br className="hidden sm:block" />Meets Comfort
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed font-light tracking-wide px-4">
            Discover unparalleled luxury at our 5-star sanctuary, where timeless sophistication meets contemporary comfort
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <Link 
              to="/rooms" 
              style={{ backgroundColor: customStyles.gold[600] }}
              className="group px-8 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 text-white font-medium rounded-sm transition-all duration-300 transform hover:scale-105 text-sm sm:text-base lg:text-lg tracking-wider uppercase relative overflow-hidden hover:shadow-xl sm:hover:shadow-2xl w-full sm:w-auto text-center"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
            >
              <span className="relative z-10">Reserve Your Stay</span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to right, ${customStyles.gold[600]}, ${customStyles.gold[700]})`
                }}
              ></div>
            </Link>
            <Link 
              to="/contact" 
              className="px-8 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 bg-transparent border border-gray-400 hover:border-white text-gray-300 hover:text-white font-medium rounded-sm transition-all duration-300 text-sm sm:text-base lg:text-lg tracking-wider uppercase w-full sm:w-auto text-center"
            >
              Explore Property
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 tracking-widest">SCROLL</span>
            <div 
              className="w-px h-10 sm:h-16"
              style={{
                background: `linear-gradient(to bottom, ${customStyles.gold[500]}, transparent)`
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Features Section - Responsive */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div 
                  style={{ color: customStyles.navy[900] }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-light mb-3 sm:mb-4 font-serif group-hover:scale-110 transition-all duration-500"
                  onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[600]}
                  onMouseLeave={(e) => e.currentTarget.style.color = customStyles.navy[900]}
                >
                  {feature.number}
                </div>
                <div className="text-gray-600 font-light tracking-widest text-xs sm:text-sm uppercase border-t border-gray-200 pt-3 sm:pt-4">
                  {feature.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Preview - Responsive */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block mb-3 sm:mb-4">
              <span 
                style={{ color: customStyles.gold[600] }}
                className="font-light tracking-[0.2em] sm:tracking-[0.3em] uppercase text-xs sm:text-xs"
              >
                Accommodations
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-gray-900 mb-6 sm:mb-8 tracking-tight">
              Refined <span style={{ color: customStyles.navy[900] }} className="font-normal">Sanctuary</span> Retreats
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed px-4">
              Each space is meticulously crafted to provide an atmosphere of serene luxury
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16 lg:mb-20">
            {rooms.map(room => (
              <div key={room.id} className="group">
                <div className="relative overflow-hidden mb-6 sm:mb-8">
                  <div className="aspect-w-4 aspect-h-3">
                    <img 
                      src={room.image} 
                      alt={room.name} 
                      className="w-full h-[250px] sm:h-[300px] lg:h-[350px] xl:h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 lg:p-6 rounded-sm shadow-lg sm:shadow-xl lg:shadow-2xl">
                      <div className="flex justify-between items-start mb-3 sm:mb-4 flex-col sm:flex-row">
                        <div className="mb-2 sm:mb-0">
                          <h3 
                            style={{ color: customStyles.navy[900] }}
                            className="text-lg sm:text-xl lg:text-2xl font-serif font-normal mb-1 sm:mb-2"
                          >
                            {room.name}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm font-light">{room.description}</p>
                        </div>
                        <span 
                          style={{ color: customStyles.gold[700] }}
                          className="text-lg sm:text-xl font-light whitespace-nowrap"
                        >
                          {room.price}
                        </span>
                      </div>
                      <Link 
                        to={`/rooms#${room.id}`}
                        className="inline-flex items-center gap-2 font-light text-xs sm:text-sm tracking-widest uppercase group/link"
                        style={{ color: customStyles.navy[900] }}
                        onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[700]}
                        onMouseLeave={(e) => e.currentTarget.style.color = customStyles.navy[900]}
                      >
                        Discover More
                        <FaChevronRight className="transform group-hover/link:translate-x-2 transition-transform duration-300 text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              to="/rooms" 
              className="inline-flex items-center gap-3 sm:gap-4 font-light tracking-widest uppercase text-xs sm:text-sm group"
              style={{ color: customStyles.navy[900] }}
              onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[700]}
              onMouseLeave={(e) => e.currentTarget.style.color = customStyles.navy[900]}
            >
              <span 
                className="h-px w-6 sm:w-8 lg:w-12 transition-colors duration-300"
                style={{ backgroundColor: customStyles.navy[900] }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[900]}
              ></span>
              View All Suites
              <span 
                className="h-px w-6 sm:w-8 lg:w-12 transition-colors duration-300"
                style={{ backgroundColor: customStyles.navy[900] }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[900]}
              ></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities - Responsive */}
      <section 
        className="py-12 sm:py-16 lg:py-20 xl:py-24"
        style={{ backgroundColor: customStyles.navy[900] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block mb-3 sm:mb-4">
              <span className="text-gray-400 font-light tracking-[0.2em] sm:tracking-[0.3em] uppercase text-xs sm:text-xs">
                Distinguished Amenities
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white mb-6 sm:mb-8 tracking-tight">
              Unparalleled <span className="text-gray-300 font-normal">Facilities</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed px-4">
              Experience excellence through our curated collection of premium services
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {amenities.map((amenity, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden border border-gray-800 rounded-sm p-6 sm:p-8 transition-all duration-500"
                style={{ 
                  backgroundColor: customStyles.navy[800],
                  borderColor: `${customStyles.navy[700]}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${customStyles.gold[600]}4D`;
                  e.currentTarget.style.transform = 'translateY(-6px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = customStyles.navy[700];
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div 
                  className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full -translate-y-8 translate-x-8 sm:-translate-y-10 sm:translate-x-10 lg:-translate-y-12 lg:translate-x-12 group-hover:scale-125 sm:group-hover:scale-150 transition-transform duration-700"
                  style={{ backgroundColor: `${customStyles.gold[600]}1A` }}
                ></div>
                
                <div className="relative z-10">
                  <div 
                    style={{ color: customStyles.gold[600] }}
                    className="text-2xl sm:text-3xl mb-6 sm:mb-8 transform group-hover:scale-110 transition-transform duration-500"
                  >
                    {amenity.icon}
                  </div>
                  <h4 className="text-white text-lg sm:text-xl font-light mb-3 sm:mb-4 tracking-wide">{amenity.title}</h4>
                  <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">{amenity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Responsive */}
      <section className="relative py-16 sm:py-20 lg:py-24 xl:py-32 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${customStyles.navy[900]}, ${customStyles.navy[800]}, ${customStyles.navy[900]})`
          }}
        >
          <div 
            className="absolute inset-0 opacity-5 sm:opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block mb-4 sm:mb-6">
            <span 
              style={{ color: customStyles.gold[600] }}
              className="font-light tracking-[0.2em] sm:tracking-[0.3em] uppercase text-xs"
            >
              Exclusive Offer
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-light text-white mb-8 sm:mb-10 tracking-tight leading-tight">
            Elevate Your <span style={{ color: customStyles.gold[500] }} className="font-normal">Experience</span><br />With Us
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-10 sm:mb-12 lg:mb-14 max-w-2xl mx-auto leading-relaxed font-light px-4">
            Reserve directly through our website to receive complimentary benefits including 
            priority check-in, spa credit, and gourmet breakfast
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-14 lg:mb-16">
            <Link 
              to="/register" 
              style={{ backgroundColor: customStyles.gold[600] }}
              className="group px-8 sm:px-10 lg:px-12 xl:px-14 py-3 sm:py-4 lg:py-5 xl:py-6 text-white font-medium rounded-sm transition-all duration-300 transform hover:scale-105 text-sm sm:text-base lg:text-lg tracking-wider uppercase relative overflow-hidden hover:shadow-xl sm:hover:shadow-2xl w-full sm:w-auto text-center"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
            >
              <span className="relative z-10">Book Direct & Save 20%</span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to right, ${customStyles.gold[700]}, ${customStyles.gold[800]})`
                }}
              ></div>
            </Link>
            <Link 
              to="/contact" 
              className="px-8 sm:px-10 lg:px-12 xl:px-14 py-3 sm:py-4 lg:py-5 xl:py-6 bg-transparent border border-gray-600 hover:border-white text-gray-300 hover:text-white font-medium rounded-sm transition-all duration-300 text-sm sm:text-base lg:text-lg tracking-wider uppercase w-full sm:w-auto text-center"
            >
              Request Proposal
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 max-w-3xl mx-auto pt-8 sm:pt-10 lg:pt-12 border-t border-gray-800">
            <div className="text-center">
              <div 
                style={{ color: customStyles.gold[600] }}
                className="text-xl sm:text-2xl font-light mb-2 sm:mb-3 font-serif"
              >
                Complimentary
              </div>
              <div className="text-gray-400 text-xs sm:text-sm tracking-widest uppercase font-light">Airport Transfer</div>
            </div>
            <div className="text-center">
              <div 
                style={{ color: customStyles.gold[600] }}
                className="text-xl sm:text-2xl font-light mb-2 sm:mb-3 font-serif"
              >
                Flexible
              </div>
              <div className="text-gray-400 text-xs sm:text-sm tracking-widest uppercase font-light">Cancellation Policy</div>
            </div>
            <div className="text-center">
              <div 
                style={{ color: customStyles.gold[600] }}
                className="text-xl sm:text-2xl font-light mb-2 sm:mb-3 font-serif"
              >
                24-Hour
              </div>
              <div className="text-gray-400 text-xs sm:text-sm tracking-widest uppercase font-light">Butler Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA - Responsive */}
      <section className="py-12 sm:py-14 lg:py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="text-center md:text-left">
              <h3 
                style={{ color: customStyles.navy[900] }}
                className="text-xl sm:text-2xl font-serif font-light mb-2"
              >
                Ready to Experience Excellence?
              </h3>
              <p className="text-gray-600 font-light text-sm sm:text-base">Contact our concierge for personalized assistance</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link 
                to="/contact" 
                className="px-6 sm:px-8 py-2 sm:py-3 border text-xs sm:text-sm tracking-widest uppercase rounded-sm transition-all duration-300 font-medium text-center"
                style={{ 
                  borderColor: customStyles.navy[900],
                  color: customStyles.navy[900]
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = customStyles.navy[900];
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = customStyles.navy[900];
                }}
              >
                Contact Us
              </Link>
              <Link 
                to="tel:+1234567890" 
                style={{ backgroundColor: customStyles.navy[900] }}
                className="px-6 sm:px-8 py-2 sm:py-3 text-white font-medium rounded-sm transition-all duration-300 text-xs sm:text-sm tracking-widest uppercase text-center"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[800]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[900]}
              >
                +1 (234) 567-890
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;