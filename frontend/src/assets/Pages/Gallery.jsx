import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import { 
  BuildingOfficeIcon,
  PhotoIcon,
  VideoCameraIcon,
  CameraIcon,
  MapPinIcon,
  StarIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);

  const categories = [
    { id: 'all', name: 'All Photos', count: galleryImages.length },
    { id: 'rooms', name: 'Rooms & Suites', count: galleryImages.filter(img => img.category === 'rooms').length },
    { id: 'facilities', name: 'Hotel Facilities', count: galleryImages.filter(img => img.category === 'facilities').length },
    { id: 'dining', name: 'Dining & Bar', count: galleryImages.filter(img => img.category === 'dining').length },
    { id: 'events', name: 'Events & Meetings', count: galleryImages.filter(img => img.category === 'events').length },
    { id: 'hms', name: 'HMS Features', count: galleryImages.filter(img => img.category === 'hms').length },
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image) => {
    setSelectedImage(image);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % galleryImages.length;
    } else {
      newIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    }
    
    setSelectedImage(galleryImages[newIndex]);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5FBE6' }}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#215E61' }}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Hotel Gallery
          </h1>
          <p className="mt-4 text-xl text-gray-100 max-w-3xl mx-auto">
            Explore our luxurious accommodations, world-class amenities, and the Hotel Management System in action
          </p>
          <div className="mt-8 flex justify-center items-center space-x-4">
            <PhotoIcon className="h-8 w-8 text-white" />
            <span className="text-white text-lg">{galleryImages.length} Photos</span>
            <span className="text-white">•</span>
            <VideoCameraIcon className="h-8 w-8 text-white" />
            <span className="text-white text-lg">12 Videos</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-16 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? '#215E61' : 'transparent',
                  }}
                >
                  {category.name}
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-opacity-20"
                    style={{
                      backgroundColor: selectedCategory === category.id ? 'rgba(255,255,255,0.3)' : '#F5FBE6',
                      color: selectedCategory === category.id ? 'white' : '#215E61'
                    }}
                  >
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div 
              key={image.id} 
              className="group relative bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              onClick={() => openLightbox(image)}
            >
              {/* Image */}
              <div className="aspect-w-16 aspect-h-12 relative">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ArrowsPointingOutIcon className="h-10 w-10 text-white" />
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full text-white capitalize"
                    style={{ backgroundColor: '#215E61' }}
                  >
                    {image.category}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{image.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{image.location}</span>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-500">{image.rating}</span>
                  </div>
                </div>
                {image.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{image.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <CameraIcon className="h-20 w-20 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No images found</h3>
            <p className="mt-2 text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>

      {/* Video Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Hotel <span style={{ color: '#215E61' }}>Virtual Tour</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Take a virtual walkthrough of our facilities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <div className="aspect-w-16 aspect-h-9 relative">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Hotel Virtual Tour"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">Full Hotel Tour</h3>
                <p className="mt-2 text-gray-600">Experience our hotel from the comfort of your home</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {videoThumbnails.map((video) => (
                <div key={video.id} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white bg-opacity-90 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-blue-600 ml-1"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900">{video.title}</h4>
                    <p className="text-sm text-gray-500">{video.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HMS Features Showcase */}
      <div className="py-12" style={{ backgroundColor: '#F5FBE6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              <span style={{ color: '#215E61' }}>HMS</span> In Action
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              See how our Hotel Management System works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hmsFeatures.map((feature) => (
              <div key={feature.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <feature.icon className="h-6 w-6 mr-2" style={{ color: '#215E61' }} />
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                  <div className="mt-4">
                    <span className="text-sm font-medium" style={{ color: '#215E61' }}>
                      Module {feature.module}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BuildingOfficeIcon className="h-10 w-10 mx-auto text-white" />
            <p className="mt-4 text-white">© 2024 Hotel Management System. All rights reserved.</p>
            <p className="mt-2 text-gray-400">Gallery showcasing hotel facilities and HMS features</p>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {showLightbox && selectedImage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 transition-opacity" 
              onClick={closeLightbox}
            >
              <div className="absolute inset-0 bg-black opacity-90"></div>
            </div>

            {/* Modal */}
            <div className="inline-block align-middle h-screen w-full max-w-7xl">
              <div className="relative h-full">
                {/* Close button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6 text-white" />
                </button>

                {/* Navigation buttons */}
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors duration-200"
                >
                  <ChevronLeftIcon className="h-8 w-8 text-white" />
                </button>
                
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors duration-200"
                >
                  <ChevronRightIcon className="h-8 w-8 text-white" />
                </button>

                {/* Image */}
                <div className="flex items-center justify-center h-full">
                  <div className="max-w-4xl mx-auto">
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.title}
                      className="max-h-[80vh] w-auto mx-auto rounded-lg"
                    />
                    <div className="mt-4 text-center text-white">
                      <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
                      <p className="mt-2 text-gray-300">{selectedImage.description}</p>
                      <div className="mt-4 flex items-center justify-center space-x-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                          {selectedImage.category}
                        </span>
                        <span className="text-gray-300">{selectedImage.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sample gallery images
const galleryImages = [
  {
    id: 1,
    title: 'Deluxe Suite',
    description: 'Spacious suite with panoramic city view and luxury amenities',
    category: 'rooms',
    location: 'Floor 12',
    rating: '5.0',
    url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80'
  },
  {
    id: 2,
    title: 'Executive Lounge',
    description: 'Exclusive lounge for VIP guests and business meetings',
    category: 'facilities',
    location: 'Lobby Level',
    rating: '4.8',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 3,
    title: 'Sky Restaurant',
    description: 'Fine dining with breathtaking rooftop views',
    category: 'dining',
    location: 'Rooftop',
    rating: '4.9',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 4,
    title: 'Conference Hall',
    description: 'State-of-the-art conference facility for 500+ guests',
    category: 'events',
    location: 'Convention Wing',
    rating: '4.7',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80'
  },
  {
    id: 5,
    title: 'HMS Dashboard',
    description: 'Admin dashboard showing real-time hotel analytics',
    category: 'hms',
    location: 'System',
    rating: '5.0',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 6,
    title: 'Pool Villa',
    description: 'Private villa with infinity pool and garden',
    category: 'rooms',
    location: 'Pool Side',
    rating: '5.0',
    url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 7,
    title: 'Spa & Wellness',
    description: 'Luxury spa with traditional and modern treatments',
    category: 'facilities',
    location: 'Wellness Center',
    rating: '4.9',
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 8,
    title: 'Lobby Bar',
    description: 'Elegant bar with signature cocktails and live music',
    category: 'dining',
    location: 'Main Lobby',
    rating: '4.6',
    url: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 9,
    title: 'Wedding Venue',
    description: 'Beautiful outdoor venue for wedding ceremonies',
    category: 'events',
    location: 'Garden Area',
    rating: '4.9',
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 10,
    title: 'Room Management',
    description: 'HMS room status and housekeeping management screen',
    category: 'hms',
    location: 'System',
    rating: '5.0',
    url: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 11,
    title: 'Standard Room',
    description: 'Comfortable room with all essential amenities',
    category: 'rooms',
    location: 'Floor 5-8',
    rating: '4.5',
    url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 12,
    title: 'Fitness Center',
    description: '24/7 fitness center with modern equipment',
    category: 'facilities',
    location: 'Floor B1',
    rating: '4.7',
    url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  }
];

const videoThumbnails = [
  {
    id: 1,
    title: 'Room Tour',
    duration: '5:32',
    thumbnail: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    title: 'Dining Experience',
    duration: '3:45',
    thumbnail: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    title: 'Spa Tour',
    duration: '4:20',
    thumbnail: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    title: 'Event Spaces',
    duration: '6:15',
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }
];

const hmsFeatures = [
  {
    id: 1,
    title: 'Check-in System',
    description: 'Quick and efficient guest check-in process',
    module: 'Module 5',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: BuildingOfficeIcon
  },
  {
    id: 2,
    title: 'Billing Dashboard',
    description: 'Real-time billing and invoice management',
    module: 'Module 6',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: BuildingOfficeIcon
  },
  {
    id: 3,
    title: 'Housekeeping',
    description: 'Room cleaning status and task management',
    module: 'Module 7',
    image: 'https://images.unsplash.com/photo-1595425832163-6cbc89e2d0f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: BuildingOfficeIcon
  }
];

export default GalleryPage;