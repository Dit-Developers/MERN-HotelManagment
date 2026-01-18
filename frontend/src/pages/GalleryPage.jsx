import React, { useState, useEffect, useCallback } from 'react';
import { FaExpand, FaCamera, FaPlay, FaChevronLeft, FaChevronRight, FaStar, FaSwimmingPool, FaBed, FaUtensils, FaGlassCheers, FaSpa, FaBuilding } from 'react-icons/fa';

function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomMode, setZoomMode] = useState(false);

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

  const categories = [
    { id: 'all', name: 'All', icon: <FaCamera />, count: 24 },
    { id: 'rooms', name: 'Rooms & Suites', icon: <FaBed />, count: 8 },
    { id: 'restaurant', name: 'Restaurant', icon: <FaUtensils />, count: 6 },
    { id: 'pool', name: 'Pool & Spa', icon: <FaSwimmingPool />, count: 5 },
    { id: 'events', name: 'Events', icon: <FaGlassCheers />, count: 4 },
    { id: 'lobby', name: 'Lobby & Amenities', icon: <FaBuilding />, count: 7 }
  ];

  const images = [
    { 
      id: 1, 
      category: 'rooms', 
      url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Deluxe Ocean View Room',
      description: 'Luxurious room with panoramic ocean views and premium amenities'
    },
    { 
      id: 2, 
      category: 'rooms', 
      url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Presidential Suite',
      description: 'Ultimate luxury with private lounge and butler service'
    },
    { 
      id: 3, 
      category: 'restaurant', 
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Michelin-Star Dining',
      description: 'Elegant fine dining experience with curated wine selection'
    },
    { 
      id: 4, 
      category: 'restaurant', 
      url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Sky Lounge & Bar',
      description: 'Rooftop bar with panoramic city views and craft cocktails'
    },
    { 
      id: 5, 
      category: 'pool', 
      url: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Infinity Pool',
      description: 'Heated infinity pool overlooking the coastline'
    },
    { 
      id: 6, 
      category: 'pool', 
      url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Luxury Spa Center',
      description: 'Award-winning spa with world-class treatments'
    },
    { 
      id: 7, 
      category: 'events', 
      url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Grand Ballroom',
      description: 'Elegant venue for weddings and corporate events'
    },
    { 
      id: 8, 
      category: 'events', 
      url: 'https://images.unsplash.com/photo-1492684223066-e9e4aab4d25e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Conference Facilities',
      description: 'State-of-the-art conference rooms with modern technology'
    },
    { 
      id: 9, 
      category: 'lobby', 
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Grand Lobby',
      description: 'Opulent lobby with crystal chandeliers and marble floors'
    },
    { 
      id: 10, 
      category: 'lobby', 
      url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: '24/7 Concierge',
      description: 'Personalized service at our dedicated concierge desk'
    },
    { 
      id: 11, 
      category: 'rooms', 
      url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Executive Suite',
      description: 'Spacious suite with separate living area and work space'
    },
    { 
      id: 12, 
      category: 'restaurant', 
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Outdoor Terrace Dining',
      description: 'Al fresco dining experience in our garden terrace'
    },
    { 
      id: 13, 
      category: 'pool', 
      url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Poolside Cabanas',
      description: 'Private cabanas with personalized service'
    },
    { 
      id: 14, 
      category: 'lobby', 
      url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Art Collection',
      description: 'Curated collection of contemporary art throughout the hotel'
    },
    { 
      id: 15, 
      category: 'events', 
      url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Private Dining Room',
      description: 'Intimate setting for exclusive gatherings'
    },
    { 
      id: 16, 
      category: 'rooms', 
      url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      title: 'Royal Suite',
      description: 'Ultimate luxury with panoramic city views'
    }
  ];

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleNext = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  }, [selectedImage, filteredImages]);

  const handlePrev = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  }, [selectedImage, filteredImages]);

  const handleClose = useCallback(() => {
    setSelectedImage(null);
    setZoomMode(false);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      switch(e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        default:
          break;
      }
    };

    // Click outside modal to close
    const handleClickOutside = (e) => {
      if (selectedImage && e.target.classList.contains('modal-background')) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedImage, handleClose, handlePrev, handleNext]);

  const videoTours = [
    {
      title: "360° Hotel Tour",
      description: "Complete virtual tour of our property",
      duration: "5:30",
      thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Room Experience",
      description: "Walkthrough of our luxury suites",
      duration: "3:45",
      thumbnail: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Dining Experience",
      description: "Behind the scenes at our restaurants",
      duration: "4:20",
      thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 lg:py-36 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Hotel Gallery"
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
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} style={{ color: customStyles.gold[500] }} className="text-lg sm:text-xl" />
            ))}
            <span className="text-gray-300 ml-2 sm:ml-3 text-sm sm:text-lg tracking-widest uppercase font-light">
              Visual Journey
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-white mb-6 sm:mb-8 leading-tight tracking-tight">
            Through Our <span style={{ color: customStyles.gold[500] }} className="font-normal">Lens</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed font-light tracking-wide px-4">
            Explore the elegance and sophistication of Luxury Hotel through our curated collection of photographs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button 
              onClick={() => setActiveCategory('all')}
              style={{ backgroundColor: customStyles.gold[600] }}
              className="group px-8 sm:px-10 lg:px-12 py-3 sm:py-4 text-white font-medium rounded-sm transition-all duration-300 transform hover:scale-105 text-sm sm:text-base tracking-wider uppercase relative overflow-hidden hover:shadow-xl sm:hover:shadow-2xl w-full sm:w-auto text-center"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
            >
              <span className="relative z-10">View All Photos</span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to right, ${customStyles.gold[600]}, ${customStyles.gold[700]})`
                }}
              ></div>
            </button>
            <button 
              onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-transparent border border-gray-400 hover:border-white text-gray-300 hover:text-white font-medium rounded-sm transition-all duration-300 text-sm sm:text-base tracking-wider uppercase w-full sm:w-auto text-center"
            >
              Browse Categories
            </button>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 sm:py-12 bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <span 
              className="font-light tracking-[0.3em] uppercase text-xs"
              style={{ color: customStyles.gold[600] }}
            >
              Browse Categories
            </span>
          </div>
          
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group flex items-center px-4 sm:px-6 py-3 rounded-sm transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'transform scale-105 shadow-lg' 
                    : 'hover:scale-105 hover:shadow-md'
                }`}
                style={{
                  backgroundColor: activeCategory === category.id ? customStyles.gold[600] : 'white',
                  border: activeCategory === category.id ? 'none' : `1px solid ${customStyles.gold[200]}`,
                  color: activeCategory === category.id ? 'white' : customStyles.navy[800]
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== category.id) {
                    e.currentTarget.style.backgroundColor = customStyles.navy[50];
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== category.id) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <span className="mr-3">{category.icon}</span>
                <span className="text-sm sm:text-base font-medium">{category.name}</span>
                <span 
                  className="ml-3 text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: activeCategory === category.id ? 'rgba(255,255,255,0.2)' : customStyles.gold[100],
                    color: activeCategory === category.id ? 'white' : customStyles.gold[700]
                  }}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section id="gallery" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <span 
                className="font-light tracking-[0.3em] uppercase text-xs"
                style={{ color: customStyles.gold[600] }}
              >
                Photo Gallery
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-6 sm:mb-8 tracking-tight"
              style={{ color: customStyles.navy[900] }}
            >
              Visual <span style={{ color: customStyles.gold[500] }} className="font-normal">Excellence</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed px-4">
              {filteredImages.length} photos in this category
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredImages.map(image => (
              <div 
                key={image.id} 
                className="group relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                onClick={() => handleImageClick(image)}
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img 
                    src={image.url} 
                    alt={image.title}
                    className="w-full h-64 sm:h-72 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-white text-lg sm:text-xl font-light mb-1 tracking-wide">
                          {image.title}
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm font-light">
                          {image.description}
                        </p>
                      </div>
                      <button 
                        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(image);
                          setZoomMode(true);
                        }}
                      >
                        <FaExpand className="text-white text-xs sm:text-sm" />
                      </button>
                    </div>
                    
                    <div className="flex items-center mt-4">
                      <div 
                        className="px-3 py-1 text-xs font-medium rounded-full mr-3"
                        style={{ 
                          backgroundColor: customStyles.gold[900],
                          color: customStyles.gold[300]
                        }}
                      >
                        {categories.find(c => c.id === image.category)?.name}
                      </div>
                      <div className="text-xs text-gray-300">
                        View Details →
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tours Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6" style={{ backgroundColor: customStyles.navy[50] }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <span 
                className="font-light tracking-[0.3em] uppercase text-xs"
                style={{ color: customStyles.gold[600] }}
              >
                Virtual Experience
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-6 sm:mb-8 tracking-tight"
              style={{ color: customStyles.navy[900] }}
            >
              360° <span style={{ color: customStyles.gold[500] }} className="font-normal">Virtual Tours</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed px-4">
              Experience our hotel from the comfort of your home
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoTours.map((video, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-black/60 text-white">
                      {video.duration}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
                      <FaPlay className="text-white text-2xl ml-1" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-light mb-2 tracking-wide" style={{ color: customStyles.navy[900] }}>
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {video.description}
                  </p>
                  <button 
                    className="w-full px-6 py-3 text-sm font-medium rounded-sm transition-all duration-300 hover:shadow-lg"
                    style={{ 
                      backgroundColor: customStyles.gold[600],
                      color: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                  >
                    <span className="flex items-center justify-center">
                      <FaPlay className="mr-2" />
                      Watch Now
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Features */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div 
                className="w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6"
                style={{ backgroundColor: customStyles.gold[100] }}
              >
                <FaCamera className="text-2xl" style={{ color: customStyles.gold[600] }} />
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide" style={{ color: customStyles.navy[900] }}>
                Professional Photography
              </h3>
              <p className="text-gray-600 text-sm">
                All photos captured by award-winning photographers using state-of-the-art equipment
              </p>
            </div>
            
            <div className="text-center p-8 rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div 
                className="w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6"
                style={{ backgroundColor: customStyles.gold[100] }}
              >
                <FaExpand className="text-2xl" style={{ color: customStyles.gold[600] }} />
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide" style={{ color: customStyles.navy[900] }}>
                4K Resolution
              </h3>
              <p className="text-gray-600 text-sm">
                High-resolution images available for viewing in stunning 4K quality on compatible devices
              </p>
            </div>
            
            <div className="text-center p-8 rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div 
                className="w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6"
                style={{ backgroundColor: customStyles.gold[100] }}
              >
                <FaPlay className="text-2xl" style={{ color: customStyles.gold[600] }} />
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide" style={{ color: customStyles.navy[900] }}>
                Interactive Experience
              </h3>
              <p className="text-gray-600 text-sm">
                Interactive virtual tours and 360° views provide immersive hotel exploration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Image View */}
      {selectedImage && (
        <div 
          className="modal-background fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={(e) => {
            if (e.target.classList.contains('modal-background')) {
              handleClose();
            }
          }}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-300 backdrop-blur-sm"
            >
              <span className="text-white text-2xl font-light">×</span>
            </button>
            
            {/* Navigation Arrows */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-300 backdrop-blur-sm"
            >
              <FaChevronLeft className="text-white text-xl" />
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-300 backdrop-blur-sm"
            >
              <FaChevronRight className="text-white text-xl" />
            </button>
            
            {/* Image and Content */}
            <div className="flex flex-col lg:flex-row gap-6 max-h-[80vh] overflow-y-auto">
              <div className="lg:w-2/3 flex items-center justify-center">
                <div 
                  className="relative w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img 
                    src={selectedImage.url} 
                    alt={selectedImage.title}
                    className={`w-full max-h-[60vh] object-contain rounded-lg transition-transform duration-300 ${
                      zoomMode ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setZoomMode(!zoomMode)}
                  />
                  <button 
                    onClick={() => setZoomMode(!zoomMode)}
                    className="absolute bottom-4 right-4 px-4 py-2 text-sm font-medium rounded-lg bg-black/50 hover:bg-black/70 transition-colors duration-300 backdrop-blur-sm text-white"
                  >
                    {zoomMode ? 'Zoom Out' : 'Zoom In'}
                  </button>
                </div>
              </div>
              
              {/* Image Details */}
              <div className="lg:w-1/3">
                <div 
                  className="bg-white rounded-lg p-6 max-h-[60vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-serif font-light mb-3 tracking-wide" style={{ color: customStyles.navy[900] }}>
                      {selectedImage.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedImage.description}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500 font-medium">Category</span>
                      <div className="mt-2">
                        <span 
                          className="inline-block px-4 py-2 text-sm font-medium rounded-full"
                          style={{ 
                            backgroundColor: customStyles.gold[100],
                            color: customStyles.gold[700]
                          }}
                        >
                          {categories.find(c => c.id === selectedImage.category)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500 font-medium">Image Details</span>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-center text-sm text-gray-700">
                          <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: customStyles.gold[500] }}></span>
                          4K Ultra HD Resolution
                        </li>
                        <li className="flex items-center text-sm text-gray-700">
                          <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: customStyles.gold[500] }}></span>
                          Professional Photography
                        </li>
                        <li className="flex items-center text-sm text-gray-700">
                          <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: customStyles.gold[500] }}></span>
                          Color Corrected & Enhanced
                        </li>
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        <strong>Navigation Tips:</strong>
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-gray-600">
                        <li>• Use ← → arrow keys or click arrows to navigate</li>
                        <li>• Click image to zoom in/out</li>
                        <li>• Press ESC or click outside to close</li>
                        <li>• Touch screen: swipe left/right to navigate</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button 
                      onClick={() => {
                        handleClose();
                        window.location.href = '/rooms';
                      }}
                      className="w-full px-6 py-3 text-sm font-medium rounded-sm transition-all duration-300 hover:shadow-lg"
                      style={{ 
                        backgroundColor: customStyles.gold[600],
                        color: 'white'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                    >
                      Book This Room Type
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Image Counter */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
                <span>
                  {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} / {filteredImages.length}
                </span>
                <span className="mx-2">•</span>
                <span>Press ESC to close</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
              backgroundImage: `url('https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
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
              Experience Luxury
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white mb-8 sm:mb-10 tracking-tight leading-tight">
            See is <span style={{ color: customStyles.gold[500] }} className="font-normal">Believing</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-10 sm:mb-12 lg:mb-14 max-w-2xl mx-auto leading-relaxed font-light px-4">
            Book your stay to experience the luxury you've seen in our gallery
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button 
              onClick={() => window.location.href = '/rooms'}
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
            </button>
            <button 
              onClick={() => window.location.href = '/contact'}
              className="px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-transparent border border-gray-400 hover:border-white text-gray-300 hover:text-white font-medium rounded-sm transition-all duration-300 text-sm sm:text-base tracking-wider uppercase w-full sm:w-auto text-center"
            >
              Schedule a Tour
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GalleryPage;
