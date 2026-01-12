import React, { useState } from 'react';
import Footer from '../Components/Footer';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    feedbackType: 'general',
    message: '',
    anonymous: false
  });

  const [submitted, setSubmitted] = useState(false);

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback' },
    { value: 'service', label: 'Service Quality' },
    { value: 'rooms', label: 'Rooms & Facilities' },
    { value: 'staff', label: 'Staff Behavior' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'cleanliness', label: 'Cleanliness' },
    { value: 'suggestion', label: 'Suggestion' },
    { value: 'complaint', label: 'Complaint' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        rating: 5,
        feedbackType: 'general',
        message: '',
        anonymous: false
      });
      setSubmitted(false);
    }, 3000);
  };

  const StarIcon = ({ filled }) => (
    <svg className={`w-6 h-6 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  const FeedbackIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5FBE6' }}>
      

      {/* Header */}
      <div className="relative py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#215E61' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-white bg-opacity-20">
              <FeedbackIcon />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Share Your Feedback</h1>
          <p className="text-lg text-gray-100">Help us improve our services. Your opinion matters!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                    <CheckIcon className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Your feedback has been submitted successfully. We appreciate your time and valuable input.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 text-white rounded-lg hover:opacity-90"
                    style={{ backgroundColor: '#215E61' }}
                  >
                    Submit Another Feedback
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Feedback Form</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required={!formData.anonymous}
                          disabled={formData.anonymous}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                          style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required={!formData.anonymous}
                          disabled={formData.anonymous}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                          style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback Type
                      </label>
                      <select
                        name="feedbackType"
                        value={formData.feedbackType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                        style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                      >
                        {feedbackTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                            className="focus:outline-none"
                          >
                            <StarIcon filled={star <= formData.rating} />
                          </button>
                        ))}
                        <span className="ml-3 text-lg font-medium text-gray-700">
                          {formData.rating}/5
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Feedback *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                        style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
                        placeholder="Please share your detailed feedback here..."
                      />
                    </div>

                    <div className="mb-8">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="anonymous"
                          checked={formData.anonymous}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-gray-300"
                          style={{ accentColor: '#215E61' }}
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Submit feedback anonymously
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-4 text-lg font-medium text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
                      style={{ backgroundColor: '#215E61' }}
                    >
                      Submit Feedback
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why Your Feedback Matters</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs">1</span>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">Helps us improve our services</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs">2</span>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">Guides staff training and development</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs">3</span>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">Enhances guest experience for everyone</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs">4</span>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">Shapes future improvements</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Response Time</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">General Feedback</span>
                  <span className="text-sm font-medium text-gray-900">24-48 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Complaints</span>
                  <span className="text-sm font-medium text-gray-900">12-24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Urgent Issues</span>
                  <span className="text-sm font-medium text-gray-900">Within 6 hours</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Support</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">feedback@grandstay.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Feedback;