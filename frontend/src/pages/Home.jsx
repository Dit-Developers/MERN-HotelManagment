import React from 'react';
import Footer from '../components/Footer';

const Home = () => {
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5FBE6' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                  <span className="block" style={{ color: '#215E61' }}>Welcome to</span>
                  <span className="block" style={{ color: '#215E61' }}>GrandStay Hotel</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Experience luxury, comfort, and exceptional service at our premier hotel. Your perfect getaway awaits.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="/booknow"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white md:py-4 md:text-lg md:px-10"
                      style={{ backgroundColor: '#215E61' }}
                    >
                      Book Now
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="/gallery"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md md:py-4 md:text-lg md:px-10"
                      style={{ color: '#215E61', borderColor: '#215E61' }}
                    >
                      View Gallery
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            alt="Hotel lobby"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold tracking-wide uppercase" style={{ color: '#215E61' }}>
              Why Choose Us
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Unforgettable Hotel Experience
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Discover what makes GrandStay the perfect choice for your stay
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md text-white" style={{ backgroundColor: '#215E61' }}>
                    <span className="text-lg">{feature.emoji}</span>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Preview Section */}
      <div className="py-12" style={{ backgroundColor: '#F5FBE6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              <span style={{ color: '#215E61' }}>Our Rooms</span> & Suites
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Luxurious accommodations designed for your comfort
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <div key={room.name} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                      <div>
                        <div className="text-xl font-bold" style={{ color: '#215E61' }}>
                          ${room.price}
                        </div>
                        <div className="text-sm text-gray-500">per night</div>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{room.description}</p>
                    <div className="mt-4 flex items-center">
                      <span className="text-sm text-gray-500">🎯 {room.features}</span>
                    </div>
                    <a
                      href="/booknow"
                      className="mt-4 inline-block px-4 py-2 text-sm font-medium rounded-md text-white hover:opacity-90"
                      style={{ backgroundColor: '#215E61' }}
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our <span style={{ color: '#215E61' }}>Guests Say</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Real experiences from our valued guests
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                  <div className="mt-4 flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12" style={{ backgroundColor: '#215E61' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready for an Unforgettable Stay?
          </h2>
          <p className="mt-4 text-lg text-gray-100">
            Book your stay now and experience the GrandStay difference
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <a
              href="/booknow"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100"
            >
              Book Your Room
            </a>
            <a
              href="/gallery"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:bg-opacity-10"
            >
              Virtual Tour
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

// Custom SVG Icons (no external dependencies)
const ArrowRightIcon = () => (
  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const features = [
  {
    name: 'Luxury Accommodation',
    description: 'Spacious rooms with modern amenities and breathtaking views',
    emoji: '🏨'
  },
  {
    name: 'Fine Dining',
    description: 'Multiple restaurants serving international and local cuisine',
    emoji: '🍽️'
  },
  {
    name: 'Spa & Wellness',
    description: 'Full-service spa, fitness center, and swimming pool',
    emoji: '💆'
  },
  {
    name: 'Conference Facilities',
    description: 'State-of-the-art meeting rooms and event spaces',
    emoji: '🎯'
  },
  {
    name: '24/7 Service',
    description: 'Round-the-clock concierge and room service',
    emoji: '🕒'
  },
  {
    name: 'Prime Location',
    description: 'Centrally located with easy access to major attractions',
    emoji: '📍'
  }
];

const rooms = [
  {
    name: 'Deluxe Room',
    price: 199,
    description: 'Comfortable room with city view and premium amenities',
    features: '2 Guests • 35 m² • King Bed',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Executive Suite',
    price: 349,
    description: 'Spacious suite with separate living area and panoramic views',
    features: '4 Guests • 65 m² • 2 King Beds',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Presidential Suite',
    price: 599,
    description: 'Ultimate luxury with private balcony and butler service',
    features: '4 Guests • 120 m² • Private Balcony',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Business Traveler',
    comment: 'Exceptional service and luxurious rooms. The perfect business hotel with all the amenities I needed.'
  },
  {
    name: 'Michael Chen',
    role: 'Family Vacation',
    comment: 'Our family had an amazing time! The kids loved the pool and the staff was incredibly friendly.'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Honeymoon',
    comment: 'Romantic getaway beyond expectations. The spa treatments and room service were perfect!'
  }
];

export default Home;