import React, { useState } from 'react';
import { 
  BuildingOfficeIcon, 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '#' },
    { name: 'Rooms', href: '#' },
    { name: 'Bookings', href: '#' },
    { name: 'Guests', href: '#' },
    { name: 'Housekeeping', href: '#' },
    { name: 'Reports', href: '#' },
    { name: 'Settings', href: '#' },
  ];

  const userRoles = [
    { name: 'Admin', color: 'bg-red-100 text-red-800' },
    { name: 'Manager', color: 'bg-blue-100 text-blue-800' },
    { name: 'Receptionist', color: 'bg-green-100 text-green-800' },
    { name: 'Housekeeping', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Guest', color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8" style={{ color: '#215E61' }} />
              <div className="ml-3">
                <span className="text-xl font-bold" style={{ color: '#215E61' }}>
                  GrandStay HMS
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">v1.0</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                    Live
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
                  style={{ color: '#215E61' }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* User Section and Mobile Menu Button */}
          <div className="flex items-center">
            {/* Role Selector (Desktop) */}
            <div className="hidden md:block mr-4">
              <select 
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  borderColor: '#215E61',
                  color: '#215E61',
                  backgroundColor: '#F5FBE6'
                }}
              >
                <option value="">Switch Role</option>
                {userRoles.map((role) => (
                  <option key={role.name} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* User Profile (Desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700">John Doe</p>
                  <p className="text-xs text-gray-500">Currently: Admin</p>
                </div>
              </div>
              
              <button 
                className="px-4 py-2 text-sm font-medium rounded-md text-white transition-colors duration-200 hover:opacity-90"
                style={{ backgroundColor: '#215E61' }}
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                style={{ color: '#215E61' }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            {/* Role Selector (Mobile) */}
            <div className="px-3 py-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Role</label>
              <select 
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  borderColor: '#215E61',
                  color: '#215E61',
                  backgroundColor: '#F5FBE6'
                }}
              >
                <option value="">Select Role</option>
                {userRoles.map((role) => (
                  <option key={role.name} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* User Info (Mobile) */}
            <div className="px-3 py-4 border-t border-gray-200">
              <div className="flex items-center">
                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700">John Doe</p>
                  <p className="text-sm text-gray-500">john@example.com</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <button 
                  className="w-full px-4 py-2 text-sm font-medium rounded-md text-white"
                  style={{ backgroundColor: '#215E61' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </button>
                <button 
                  className="w-full px-4 py-2 text-sm font-medium rounded-md border"
                  style={{ color: '#215E61', borderColor: '#215E61' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;