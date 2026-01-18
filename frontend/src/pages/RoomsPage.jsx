import React, { useState } from 'react';

function RoomsPage() {
  const [filter, setFilter] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const customColors = {
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

  const rooms = [
    { 
      id: 1, 
      name: "Standard Room", 
      type: "standard", 
      price: "$99/night", 
      size: "300 sq ft", 
      beds: "1 Queen Bed", 
      capacity: "2 Adults",
      view: "City View",
      amenities: ["Free WiFi", "Flat-screen TV", "Air Conditioning", "Coffee Maker", "Safe", "Work Desk"],
      description: "Our cozy Standard Room offers comfortable accommodation with essential amenities for a pleasant stay. Perfect for business travelers and solo adventurers.",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ]
    },
    { 
      id: 2, 
      name: "Deluxe Room", 
      type: "deluxe", 
      price: "$150/night", 
      size: "400 sq ft", 
      beds: "1 King Bed", 
      capacity: "2 Adults",
      view: "Garden View",
      amenities: ["Free WiFi", "Smart TV", "Air Conditioning", "Mini Bar", "Coffee Maker", "Safe", "Work Desk", "Sitting Area"],
      description: "Spacious Deluxe Room with elegant decor and additional seating area for your comfort. Features premium furnishings and enhanced amenities.",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ]
    },
    { 
      id: 3, 
      name: "Executive Suite", 
      type: "suite", 
      price: "$250/night", 
      size: "600 sq ft", 
      beds: "1 King Bed + Sofa Bed", 
      capacity: "3 Adults",
      view: "Ocean View",
      amenities: ["Free WiFi", "Smart TV", "Air Conditioning", "Mini Bar", "Jacuzzi", "Coffee Maker", "Safe", "Work Desk", "Separate Living Area", "Dining Table"],
      description: "Luxurious suite with separate living area, perfect for business travelers or extended stays. Offers panoramic ocean views and premium services.",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1615873968403-89e068629265?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ]
    },
    { 
      id: 4, 
      name: "Presidential Suite", 
      type: "suite", 
      price: "$500/night", 
      size: "1000 sq ft", 
      beds: "2 King Beds", 
      capacity: "4 Adults",
      view: "Panoramic City View",
      amenities: ["Free WiFi", "Smart TVs (2)", "Air Conditioning", "Full Bar", "Jacuzzi", "Coffee Maker", "Safe", "Work Desk", "Separate Living Area", "Dining Area", "Kitchenette", "Butler Service", "Private Balcony"],
      description: "Our most luxurious accommodation featuring expansive space, premium amenities, and exclusive services. Experience ultimate luxury and privacy.",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1615873968403-89e068629265?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ]
    },
    { 
      id: 5, 
      name: "Family Room", 
      type: "family", 
      price: "$180/night", 
      size: "450 sq ft", 
      beds: "2 Queen Beds", 
      capacity: "4 Adults",
      view: "Pool View",
      amenities: ["Free WiFi", "Smart TV", "Air Conditioning", "Coffee Maker", "Safe", "Kids Amenities", "Board Games", "Extra Storage"],
      description: "Perfect for families, featuring two comfortable beds and family-friendly amenities. Spacious layout with convenient access to pool area.",
      image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ]
    },
    { 
      id: 6, 
      name: "Honeymoon Suite", 
      type: "suite", 
      price: "$350/night", 
      size: "550 sq ft", 
      beds: "1 King Bed", 
      capacity: "2 Adults",
      view: "Romantic Garden View",
      amenities: ["Free WiFi", "Smart TV", "Air Conditioning", "Mini Bar", "Jacuzzi", "Coffee Maker", "Safe", "Romantic Decor", "Champagne on Arrival", "Flower Arrangement"],
      description: "Specially designed for couples, featuring romantic decor and special amenities for a memorable stay. Perfect for honeymooners and anniversary celebrations.",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ]
    }
  ];

  const filteredRooms = filter === 'all' 
    ? rooms 
    : rooms.filter(room => room.type === filter);

  const filters = [
    { id: 'all', label: 'All Rooms' },
    { id: 'standard', label: 'Standard' },
    { id: 'deluxe', label: 'Deluxe' },
    { id: 'suite', label: 'Suites' },
    { id: 'family', label: 'Family' }
  ];

  const closeDetailView = () => {
    setSelectedRoom(null);
  };

  return (
    <div 
      className="min-h-screen font-serif"
      style={{ 
        background: `linear-gradient(to bottom, ${customColors.navy[50]}, white)`
      }}
    >
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden border-b"
        style={{ borderColor: customColors.navy[200] }}
      >
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${customColors.navy[900]}CC, ${customColors.navy[800]}CC)`
            }}
          ></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white mb-4 tracking-tight">
              Hotel <span style={{ color: customColors.gold[500] }}>Rooms</span> & Suites
            </h1>
            <p className="text-gray-300 font-light text-sm sm:text-base tracking-widest uppercase max-w-2xl mx-auto">
              Experience luxury and comfort in our beautifully designed accommodations
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b" style={{ borderColor: customColors.navy[200] }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map(f => (
              <button
                key={f.id}
                className={`px-6 py-3 text-sm font-light tracking-wider uppercase transition-all duration-300 rounded-sm border ${
                  filter === f.id
                    ? 'font-normal shadow-lg'
                    : 'border-gray-300 text-gray-700 hover:text-gray-900'
                }`}
                style={
                  filter === f.id
                    ? { 
                        backgroundColor: customColors.gold[600],
                        borderColor: customColors.gold[600],
                        color: 'white'
                      }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (filter !== f.id) {
                    e.currentTarget.style.color = customColors.navy[900];
                    e.currentTarget.style.borderColor = customColors.navy[900];
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== f.id) {
                    e.currentTarget.style.color = '#374151';
                    e.currentTarget.style.borderColor = '#D1D5DB';
                  }
                }}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Room Detail Modal */}
      {selectedRoom && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeDetailView}
        >
          <div 
            className="bg-white rounded-sm shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
            style={{ borderColor: customColors.navy[200] }}
          >
            {/* Close Button */}
            <button
              onClick={closeDetailView}
              className="absolute top-6 right-6 text-3xl text-gray-500 hover:text-gray-700 z-10 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: customColors.navy[600] }}
            >
              ×
            </button>

            {/* Modal Header */}
            <div className="p-8 border-b" style={{ borderColor: customColors.navy[200] }}>
              <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">
                {selectedRoom.name}
              </h2>
              <p className="text-2xl font-light" style={{ color: customColors.gold[600] }}>
                {selectedRoom.price}
              </p>
            </div>

            {/* Image Gallery */}
            <div className="p-8">
              <img 
                src={selectedRoom.image} 
                alt={selectedRoom.name}
                className="w-full h-96 object-cover rounded-sm mb-4"
                style={{ borderColor: customColors.navy[200] }}
              />
              <div className="flex gap-3 overflow-x-auto pb-2">
                {selectedRoom.images.map((img, index) => (
                  <img 
                    key={index}
                    src={img}
                    alt={`${selectedRoom.name} ${index + 1}`}
                    className="w-24 h-20 object-cover rounded-sm cursor-pointer border-2 hover:opacity-80 transition-opacity"
                    style={{ borderColor: customColors.navy[200] }}
                  />
                ))}
              </div>
            </div>

            {/* Room Details */}
            <div className="px-8 pb-8">
              {/* Description */}
              <p className="text-gray-600 font-light leading-relaxed mb-8">
                {selectedRoom.description}
              </p>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div 
                  className="p-4 rounded-sm text-center"
                  style={{ backgroundColor: `${customColors.navy[50]}` }}
                >
                  <div className="text-sm font-light mb-1" style={{ color: customColors.navy[600] }}>
                    Room Size
                  </div>
                  <div className="text-lg font-light" style={{ color: customColors.navy[900] }}>
                    {selectedRoom.size}
                  </div>
                </div>
                <div 
                  className="p-4 rounded-sm text-center"
                  style={{ backgroundColor: `${customColors.gold[50]}` }}
                >
                  <div className="text-sm font-light mb-1" style={{ color: customColors.gold[600] }}>
                    Bed Configuration
                  </div>
                  <div className="text-lg font-light" style={{ color: customColors.navy[900] }}>
                    {selectedRoom.beds}
                  </div>
                </div>
                <div 
                  className="p-4 rounded-sm text-center"
                  style={{ backgroundColor: `${customColors.navy[50]}` }}
                >
                  <div className="text-sm font-light mb-1" style={{ color: customColors.navy[600] }}>
                    Capacity
                  </div>
                  <div className="text-lg font-light" style={{ color: customColors.navy[900] }}>
                    {selectedRoom.capacity}
                  </div>
                </div>
                <div 
                  className="p-4 rounded-sm text-center"
                  style={{ backgroundColor: `${customColors.gold[50]}` }}
                >
                  <div className="text-sm font-light mb-1" style={{ color: customColors.gold[600] }}>
                    View
                  </div>
                  <div className="text-lg font-light" style={{ color: customColors.navy[900] }}>
                    {selectedRoom.view}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-xl font-light mb-4" style={{ color: customColors.navy[900] }}>
                  Amenities & Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedRoom.amenities.map((amenity, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-sm"
                      style={{ 
                        backgroundColor: `${customColors.navy[50]}80`,
                        border: `1px solid ${customColors.navy[200]}`
                      }}
                    >
                      <div className="w-5 h-5 flex items-center justify-center rounded-full" style={{ backgroundColor: customColors.gold[600], color: 'white' }}>
                        ✓
                      </div>
                      <span className="font-light text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div 
                className="p-6 rounded-sm"
                style={{ 
                  backgroundColor: `${customColors.navy[50]}`,
                  border: `1px solid ${customColors.navy[200]}`
                }}
              >
                <h3 className="text-lg font-light mb-4" style={{ color: customColors.navy[900] }}>
                  Additional Information
                </h3>
                <ul className="space-y-2">
                  {[
                    "Check-in: 3:00 PM | Check-out: 11:00 AM",
                    "Non-smoking room",
                    "Daily housekeeping included",
                    "24/7 room service available",
                    "Complimentary bottled water",
                    "Late check-out available upon request"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-600 font-light">
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: customColors.gold[600] }}></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map(room => (
            <div 
              key={room.id}
              className="rounded-sm border bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl overflow-hidden"
              style={{ borderColor: customColors.navy[200] }}
            >
              {/* Room Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.name}
                  className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
                />
                <div 
                  className="absolute top-4 right-4 px-3 py-1 text-xs font-light tracking-wider uppercase text-white"
                  style={{ backgroundColor: customColors.gold[600] }}
                >
                  {room.type}
                </div>
              </div>

              {/* Room Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-light" style={{ color: customColors.navy[900] }}>
                    {room.name}
                  </h3>
                  <p className="text-lg font-light whitespace-nowrap" style={{ color: customColors.gold[600] }}>
                    {room.price}
                  </p>
                </div>

                <div className="flex gap-6 mb-4 pb-4 border-b" style={{ borderColor: customColors.navy[200] }}>
                  <div>
                    <div className="text-xs font-light tracking-wider uppercase mb-1" style={{ color: customColors.navy[600] }}>
                      Size
                    </div>
                    <div className="font-light" style={{ color: customColors.navy[900] }}>
                      {room.size}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-light tracking-wider uppercase mb-1" style={{ color: customColors.navy[600] }}>
                      Beds
                    </div>
                    <div className="font-light" style={{ color: customColors.navy[900] }}>
                      {room.beds}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm font-light mb-3" style={{ color: customColors.navy[900] }}>
                    Key Amenities
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-xs font-light rounded-sm"
                        style={{ 
                          backgroundColor: `${customColors.navy[50]}`,
                          color: customColors.navy[700],
                          border: `1px solid ${customColors.navy[200]}`
                        }}
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span 
                        className="px-3 py-1 text-xs font-light rounded-sm"
                        style={{ 
                          backgroundColor: `${customColors.gold[50]}`,
                          color: customColors.gold[700],
                          border: `1px solid ${customColors.gold[200]}`
                        }}
                      >
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRoom(room)}
                  className="w-full px-6 py-3 text-sm font-medium text-white rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden hover:shadow-lg"
                  style={{ backgroundColor: customColors.navy[900] }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customColors.navy[800]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customColors.navy[900]}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div 
        className="border-t py-12"
        style={{ 
          borderColor: customColors.navy[200],
          backgroundColor: 'white'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-light text-center mb-12" style={{ color: customColors.navy[900] }}>
            Why Choose Our Rooms
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '⭐', title: 'Premium Quality', desc: 'Highest quality furnishings and decor for ultimate comfort' },
              { icon: '🛌', title: 'Luxury Bedding', desc: 'Premium mattresses and linens for restful sleep' },
              { icon: '🚿', title: 'Spa Bathrooms', desc: 'Rain showers and premium toiletries' },
              { icon: '📶', title: 'High-Speed WiFi', desc: 'Complimentary high-speed internet access' }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-sm border transition-all duration-300 hover:shadow-lg"
                style={{ 
                  borderColor: customColors.navy[200],
                  backgroundColor: `${customColors.navy[50]}80`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = customColors.gold[600];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = customColors.navy[200];
                }}
              >
                <div 
                  className="text-3xl mb-4 w-16 h-16 flex items-center justify-center rounded-full mx-auto"
                  style={{ 
                    backgroundColor: `${customColors.gold[600]}20`,
                    color: customColors.gold[600]
                  }}
                >
                  {feature.icon}
                </div>
                <h4 className="text-lg font-light mb-2" style={{ color: customColors.navy[900] }}>
                  {feature.title}
                </h4>
                <p className="text-gray-600 font-light text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="border-t py-6"
        style={{ 
          borderColor: customColors.navy[200],
          backgroundColor: 'white'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 font-light text-sm">
              Hotel Management System © {new Date().getFullYear()}
            </p>
            <p className="text-gray-600 font-light text-sm">
              Rooms & Suites v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomsPage;