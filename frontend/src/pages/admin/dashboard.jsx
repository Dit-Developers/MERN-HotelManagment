import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard Stats
  const dashboardStats = [
    { 
      title: 'Total Revenue', 
      value: '$142,560', 
      change: '+12.5%', 
      trend: 'up',
      icon: '💰',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700'
    },
    { 
      title: 'Occupancy Rate', 
      value: '87%', 
      change: '+5.2%', 
      trend: 'up',
      icon: '🏨',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700'
    },
    { 
      title: 'Total Bookings', 
      value: '1,248', 
      change: '+8.3%', 
      trend: 'up',
      icon: '📅',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700'
    },
    { 
      title: 'Avg. Guest Rating', 
      value: '4.8/5', 
      change: '+0.3', 
      trend: 'up',
      icon: '⭐',
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700'
    },
    { 
      title: 'Check-ins Today', 
      value: '42', 
      change: '+7', 
      trend: 'up',
      icon: '🔑',
      color: 'bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-700'
    },
    { 
      title: 'Pending Tasks', 
      value: '18', 
      change: '-3', 
      trend: 'down',
      icon: '📋',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700'
    }
  ];

  // Recent Bookings
  const recentBookings = [
    { id: 'BK1001', guest: 'Michael Chen', room: 'Presidential Suite', checkIn: 'Today', checkOut: '2024-02-10', amount: '$2,450', status: 'checked-in' },
    { id: 'BK1002', guest: 'Sarah Johnson', room: 'Executive Suite', checkIn: 'Today', checkOut: '2024-02-08', amount: '$1,850', status: 'confirmed' },
    { id: 'BK1003', guest: 'Robert Wilson', room: 'Deluxe Room', checkIn: 'Tomorrow', checkOut: '2024-02-09', amount: '$1,250', status: 'confirmed' },
    { id: 'BK1004', guest: 'Emma Davis', room: 'Standard Room', checkIn: 'Yesterday', checkOut: '2024-02-07', amount: '$850', status: 'checked-out' },
    { id: 'BK1005', guest: 'James Miller', room: 'Executive Suite', checkIn: 'Today', checkOut: '2024-02-12', amount: '$1,950', status: 'pending' }
  ];

  // Room Status
  const roomStatus = [
    { type: 'Occupied', count: 42, color: '#ef4444', percentage: 70 },
    { type: 'Available', count: 12, color: '#10b981', percentage: 20 },
    { type: 'Cleaning', count: 4, color: '#f59e0b', percentage: 6.7 },
    { type: 'Maintenance', count: 2, color: '#8b5cf6', percentage: 3.3 }
  ];

  // Staff Activity
  const staffActivity = [
    { name: 'John Smith', role: 'Receptionist', tasks: 12, status: 'active' },
    { name: 'Maria Garcia', role: 'Housekeeping', tasks: 8, status: 'active' },
    { name: 'David Brown', role: 'Manager', tasks: 6, status: 'break' },
    { name: 'Lisa Wong', role: 'Concierge', tasks: 4, status: 'active' }
  ];

  // Revenue Chart Data
  const revenueData = [
    { month: 'Jan', revenue: 125000 },
    { month: 'Feb', revenue: 132000 },
    { month: 'Mar', revenue: 128000 },
    { month: 'Apr', revenue: 145000 },
    { month: 'May', revenue: 152000 },
    { month: 'Jun', revenue: 142000 },
    { month: 'Jul', revenue: 148000 }
  ];

  // Custom SVG Icons
  const DashboardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const NotificationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const RevenueIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const RoomIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const QuickActions = () => [
    { title: 'New Booking', icon: '➕', link: '/admin/bookings/new' },
    { title: 'Check-in Guest', icon: '🔑', link: '/admin/checkin' },
    { title: 'Room Assignment', icon: '🏨', link: '/admin/rooms/assign' },
    { title: 'Generate Report', icon: '📊', link: '/admin/reports' },
    { title: 'Staff Schedule', icon: '👥', link: '/admin/staff/schedule' },
    { title: 'System Settings', icon: '⚙️', link: '/admin/settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#215E61' }}>
                <DashboardIcon className="text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">LuxuryStay Hospitality Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Period Selector */}
              <select 
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                style={{ borderColor: '#215E61', focusBorderColor: '#215E61' }}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <NotificationIcon />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className={`${stat.color} border rounded-xl p-4 hover:shadow-md transition-shadow duration-200`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className={`text-2xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last period</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts & Recent Bookings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
                <div className="flex space-x-2">
                  {['Day', 'Week', 'Month', 'Year'].map((period) => (
                    <button
                      key={period}
                      className={`px-3 py-1 text-sm rounded-lg ${activeTab === period.toLowerCase() ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveTab(period.toLowerCase())}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="h-64 flex items-end space-x-2 mt-8">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-8 rounded-t-lg hover:opacity-80 transition-opacity cursor-pointer"
                      style={{ 
                        backgroundColor: '#215E61',
                        height: `${(item.revenue / 160000) * 100}%`
                      }}
                      title={`$${item.revenue.toLocaleString()}`}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                Monthly Revenue (Last 7 Months)
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
                <Link 
                  to="/admin/bookings" 
                  className="text-sm font-medium hover:text-opacity-80"
                  style={{ color: '#215E61' }}
                >
                  View All →
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentBookings.map((booking, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          <Link to={`/admin/bookings/${booking.id}`} className="hover:text-blue-600">
                            {booking.id}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{booking.guest}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{booking.room}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{booking.checkIn}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{booking.amount}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'checked-in' ? 'bg-green-100 text-green-800' :
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Room Status & Quick Actions */}
          <div className="space-y-8">
            {/* Room Status */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Room Status</h2>
                <span className="text-sm text-gray-500">Total: 60 Rooms</span>
              </div>
              
              <div className="space-y-4">
                {roomStatus.map((status, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{status.type}</span>
                      <span className="text-gray-900">{status.count} rooms</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          backgroundColor: status.color,
                          width: `${status.percentage}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {status.percentage}% of total rooms
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Maintenance Requests</span>
                  <span className="text-sm font-bold text-gray-900">3 Active</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {QuickActions().map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                  >
                    <span className="text-2xl mb-2">{action.icon}</span>
                    <span className="text-sm font-medium text-gray-700 text-center">{action.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Staff Activity */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Staff Activity</h2>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  All Active
                </span>
              </div>
              
              <div className="space-y-4">
                {staffActivity.map((staff, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                        <p className="text-xs text-gray-500">{staff.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${
                          staff.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-xs text-gray-500">{staff.status}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{staff.tasks} tasks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">System Alerts</h2>
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              3 Active Alerts
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <span className="text-red-600">⚠️</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Database backup overdue</p>
                <p className="text-xs text-gray-600">Last backup: 48 hours ago</p>
              </div>
              <button className="text-sm font-medium hover:text-opacity-80" style={{ color: '#215E61' }}>
                Fix Now
              </button>
            </div>
            
            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <span className="text-yellow-600">📊</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Monthly reports pending</p>
                <p className="text-xs text-gray-600">Generate financial reports for January</p>
              </div>
              <button className="text-sm font-medium hover:text-opacity-80" style={{ color: '#215E61' }}>
                Generate
              </button>
            </div>
            
            <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-blue-600">🔄</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">System update available</p>
                <p className="text-xs text-gray-600">Version 2.1.0 ready for installation</p>
              </div>
              <button className="text-sm font-medium hover:text-opacity-80" style={{ color: '#215E61' }}>
                Update
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm">
              <p>© 2024 LuxuryStay Hospitality Management System</p>
              <p className="mt-1">Version 2.0.1 • Last updated: Today 10:30 AM</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <span className="text-sm text-gray-500">System Status:</span>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-green-600">All Systems Operational</span>
              </div>
              <button className="text-sm px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;