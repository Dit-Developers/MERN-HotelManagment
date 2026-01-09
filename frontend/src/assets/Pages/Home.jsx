import React from 'react';
import Navbar from '../Components/Navbar.jsx';
import { 
  ShieldCheckIcon, 
  CreditCardIcon, 
  WifiIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5FBE6' }}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                  <span className="block" style={{ color: '#215E61' }}>Hotel Management</span>
                  <span className="block" style={{ color: '#215E61' }}>System</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Complete solution for managing hotel operations, guest services, room reservations, billing, and housekeeping tasks efficiently.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="#"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white md:py-4 md:text-lg md:px-10"
                      style={{ backgroundColor: '#215E61' }}
                    >
                      Get Started
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md md:py-4 md:text-lg md:px-10"
                      style={{ color: '#215E61', borderColor: '#215E61' }}
                    >
                      View Demo
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
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your hotel
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Based on the complete HMS project guide with role-based access control
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md text-white" style={{ backgroundColor: '#215E61' }}>
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
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

      {/* Role-Based Access Section */}
      <div className="py-12" style={{ backgroundColor: '#F5FBE6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              <span style={{ color: '#215E61' }}>Role-Based</span> Access Control
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Different permissions for different user roles as per HMS specifications
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {roles.map((role) => (
                <div key={role.name} className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg h-full">
                    <div className="-mt-6">
                      <div className="inline-flex items-center justify-center p-3 rounded-md shadow-lg" style={{ backgroundColor: '#215E61' }}>
                        <role.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900 tracking-tight">{role.name}</h3>
                      <ul className="mt-4 space-y-2">
                        {role.permissions.slice(0, 3).map((permission, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                            <span className="ml-2 text-sm text-gray-500">{permission}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to transform your hotel management?</span>
            <span className="block" style={{ color: '#215E61' }}>Start using HMS today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white"
                style={{ backgroundColor: '#215E61' }}
              >
                Get started
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md"
                style={{ color: '#215E61', borderColor: '#215E61' }}
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BuildingOfficeIcon className="h-10 w-10 mx-auto text-white" />
            <p className="mt-4 text-white">© 2024 Hotel Management System. All rights reserved.</p>
            <p className="mt-2 text-gray-400">Based on the complete HMS project guide documentation</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    name: 'Secure Authentication',
    description: 'Role-based access control with password encryption and session management',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Guest Management',
    description: 'Complete CRUD operations for guest profiles and history tracking',
    icon: UserGroupIcon,
  },
  {
    name: 'Room & Reservation',
    description: 'Manage room inventory, pricing, and handle booking workflows',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Billing & Invoicing',
    description: 'Automated billing, service charges, and invoice generation',
    icon: CreditCardIcon,
  },
  {
    name: 'Housekeeping',
    description: 'Track cleaning tasks and maintenance requests',
    icon: WifiIcon,
  },
  {
    name: 'Reports & Analytics',
    description: 'Generate occupancy, revenue, and room status reports',
    icon: ChartBarIcon,
  },
];

const roles = [
  {
    name: 'Admin',
    permissions: ['Create Users', 'Assign Roles', 'Configure Rooms', 'View All Reports', 'System Settings'],
    icon: ShieldCheckIcon,
  },
  {
    name: 'Manager',
    permissions: ['View Bookings', 'Revenue Reports', 'Monitor Housekeeping', 'View Feedback'],
    icon: ChartBarIcon,
  },
  {
    name: 'Receptionist',
    permissions: ['Create Guests', 'Book Rooms', 'Check-in/out', 'Generate Bills'],
    icon: UserGroupIcon,
  },
  {
    name: 'Housekeeping',
    permissions: ['View Assigned Rooms', 'Clean Rooms', 'Report Maintenance'],
    icon: WifiIcon,
  },
  {
    name: 'Guest',
    permissions: ['View Rooms', 'Make Bookings', 'Request Services', 'Give Feedback'],
    icon: UserGroupIcon,
  },
];

export default Home;