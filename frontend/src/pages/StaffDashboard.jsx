import React, { useState, useEffect, useCallback } from 'react';
import {
  FaBed,
  FaBroom,
  FaWrench,
  FaSyncAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaExclamationTriangle,
  FaCalendarCheck,
  FaListUl,
  FaClipboardCheck,
  FaTools,
  FaFileAlt,
  FaTachometerAlt
} from 'react-icons/fa';
import FormStatus from '../component/FormStatus';
import NotificationBell from '../component/NotificationBell';
import { API_URL } from '../config/api';

function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assignedRooms, setAssignedRooms] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [maintenanceReports, setMaintenanceReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const [newMaintenance, setNewMaintenance] = useState({
    roomNumber: '',
    issueType: 'plumbing',
    description: '',
    priority: 'normal'
  });
  
  const token = localStorage.getItem('token');

  // Custom color styles matching ReceptionDashboard
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

  // Updated styles to match ReceptionDashboard
  const tabBaseClasses = "px-6 py-3 text-sm font-light tracking-wider uppercase transition-all duration-300 rounded-sm border";
  const tabActiveClasses = "font-normal shadow-lg";
  const tabInactiveClasses = "border-gray-300 text-gray-700 hover:text-gray-900";
  
  const inputClasses = "w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light transition-all duration-300 bg-white/80 backdrop-blur-sm";
  const textareaClasses = "w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light resize-y transition-all duration-300 bg-white/80 backdrop-blur-sm min-h-[100px]";
  const selectClasses = "w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light transition-all duration-300 bg-white/80 backdrop-blur-sm";
  const submitButtonClasses = "w-full mt-4 px-6 py-3 text-sm font-medium text-white rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden hover:shadow-lg";
  const tableContainerClasses = "rounded-sm border bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-all duration-500";
  const listCardClasses = "mb-3 flex items-start justify-between rounded-sm border p-4 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300";
  const badgeBaseClasses = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white";

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch rooms
      const roomsRes = await fetch(`${API_URL}/room/all-rooms`, { headers });
      const roomsData = await roomsRes.json();
      const rooms = Array.isArray(roomsData) ? roomsData : [];
      
      // Filter rooms assigned to this staff
      const assigned = rooms.filter(room => 
        room.roomStatus === 'cleaning' || 
        room.roomStatus === 'dirty' ||
        room.assignedStaff === user._id
      );
      setAssignedRooms(assigned);

      // Fetch service requests
      const requestsRes = await fetch(`${API_URL}/service-requests`, { headers });
      const requestsData = await requestsRes.json();
      const requests = Array.isArray(requestsData?.serviceRequests) ? 
                     requestsData.serviceRequests : 
                     Array.isArray(requestsData) ? requestsData : [];
      
      // Filter housekeeping requests
      const housekeepingRequests = requests.filter(req => 
        req.serviceType === 'housekeeping' || 
        req.serviceType === 'room_cleaning' ||
        (req.assignedTo === user._id || !req.assignedTo)
      );
      setServiceRequests(housekeepingRequests);

      // Filter maintenance reports
      const maintenance = requests.filter(req => 
        req.serviceType === 'maintenance' ||
        req.serviceType === 'repair'
      );
      setMaintenanceReports(maintenance);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const fetchTabData = useCallback(async (tab) => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      switch (tab) {
        case 'assigned': {
          const roomsRes = await fetch(`${API_URL}/room/all-rooms`, { headers });
          const roomsData = await roomsRes.json();
          const rooms = Array.isArray(roomsData) ? roomsData : [];
          
          const assigned = rooms.filter(room => 
            room.roomStatus === 'cleaning' || 
            room.roomStatus === 'dirty' ||
            room.assignedStaff === user._id
          );
          setAssignedRooms(assigned);
          break;
        }
        
        case 'requests': {
          const requestsRes = await fetch(`${API_URL}/service-requests`, { headers });
          const requestsData = await requestsRes.json();
          const requests = Array.isArray(requestsData?.serviceRequests) ? 
                         requestsData.serviceRequests : 
                         Array.isArray(requestsData) ? requestsData : [];
          
          const housekeepingRequests = requests.filter(req => 
            req.serviceType === 'housekeeping' || 
            req.serviceType === 'room_cleaning' ||
            (req.assignedTo === user._id || !req.assignedTo)
          );
          setServiceRequests(housekeepingRequests);
          break;
        }
        
        case 'maintenance': {
          const maintenanceRes = await fetch(`${API_URL}/service-requests`, { headers });
          const maintenanceData = await maintenanceRes.json();
          const allRequests = Array.isArray(maintenanceData?.serviceRequests) ? 
                            maintenanceData.serviceRequests : 
                            Array.isArray(maintenanceData) ? maintenanceData : [];
          
          const maintenance = allRequests.filter(req => 
            req.serviceType === 'maintenance' ||
            req.serviceType === 'repair'
          );
          setMaintenanceReports(maintenance);
          break;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  // Clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token, fetchAllData]);

  useEffect(() => {
    if (token && activeTab !== 'dashboard') {
      fetchTabData(activeTab);
    }
  }, [activeTab, token, fetchTabData]);

  useEffect(() => {
    const handleFocus = () => {
      if (token) {
        fetchAllData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [token, fetchAllData]);

  // Refresh all data
  const refreshData = () => {
    fetchAllData();
  };

  // Generic API call function
  const apiCall = async (method, endpoint, data = null) => {
    setError('');
    setSuccess('');
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const options = { method, headers };
      if (data) options.body = JSON.stringify(data);

      const response = await fetch(`${API_URL}${endpoint}`, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Request failed');
      }

      setSuccess(result.message || 'Operation successful');
      refreshData(); // Refresh all data after successful operation
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const markRoomAsCleaned = (roomId) => {
    setConfirmState({
      isOpen: true,
      title: 'Mark Room as Cleaned',
      message: 'Are you sure you want to mark this room as cleaned?',
      onConfirm: async () => {
        await apiCall('PUT', `/room/update-room-status/${roomId}`, { 
          status: 'available',
          isAvailable: true 
        });
      }
    });
  };
 
  const markRoomAsDirty = (roomId) => {
    setConfirmState({
      isOpen: true,
      title: 'Mark Room as Needs Cleaning',
      message: 'Are you sure you want to mark this room as needs cleaning?',
      onConfirm: async () => {
        await apiCall('PUT', `/room/update-room-status/${roomId}`, { 
          status: 'cleaning',
          isAvailable: false
        });
      }
    });
  };

  const handleConfirmStatusChange = async () => {
    if (confirmState.onConfirm) {
      await confirmState.onConfirm();
    }
    setConfirmState({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null
    });
  };

  const handleCancelStatusChange = () => {
    setConfirmState({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null
    });
  };

  // Update service request status
  const updateRequestStatus = async (requestId, status) => {
    await apiCall('PUT', `/service-requests/${requestId}/status`, { 
      status,
      completedBy: user._id,
      completedAt: new Date().toISOString()
    });
  };

  // Submit maintenance report
  const submitMaintenanceReport = async (e) => {
    e.preventDefault();
    const reportData = {
      serviceType: 'maintenance',
      description: newMaintenance.description,
      roomNumber: newMaintenance.roomNumber,
      priority: newMaintenance.priority || 'normal'
    };

    await apiCall('POST', '/service-requests/create', reportData);
    setNewMaintenance({
      roomNumber: '',
      issueType: 'plumbing',
      description: '',
      priority: 'normal'
    });
  };

  // Calculate statistics for dashboard
  const calculateDashboardStats = () => {
    const roomsToClean = assignedRooms.filter(room => 
      room.roomStatus === 'cleaning' || room.roomStatus === 'dirty'
    ).length;
    
    const pendingRequests = serviceRequests.filter(req => 
      req.status === 'pending'
    ).length;
    
    const todaysProgress = serviceRequests.filter(req => 
      req.status === 'completed' && 
      req.completedAt &&
      new Date(req.completedAt).toDateString() === new Date().toDateString()
    ).length;

    return {
      assignedRooms: assignedRooms.length,
      pendingRequests,
      roomsToClean,
      todaysProgress
    };
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'assigned', label: 'Assigned Rooms', icon: <FaBed /> },
    { id: 'requests', label: 'Service Requests', icon: <FaBroom /> },
    { id: 'maintenance', label: 'Maintenance Reports', icon: <FaWrench /> },
  ];

  if (!user) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: customStyles.navy[900] }}
      >
        <div className="text-center">
          <div className="text-white font-serif text-xl mb-4">Loading staff dashboard...</div>
          <div className="w-16 h-1 mx-auto" style={{ background: `linear-gradient(to right, ${customStyles.gold[600]}, transparent)` }}></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen font-serif"
      style={{ 
        background: `linear-gradient(to bottom, ${customStyles.navy[50]}, white)`
      }}
    >
      {/* Header */}
      <div 
        className="relative border-b"
        style={{ borderColor: customStyles.navy[200] }}
      >
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${customStyles.navy[900]}CC, ${customStyles.navy[800]}CC)`
            }}
          ></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-light text-white mb-2 tracking-tight">
                Hotel <span style={{ color: customStyles.gold[500] }}>Staff</span> Dashboard
              </h1>
              <p className="text-gray-300 font-light text-sm tracking-widest uppercase">Housekeeping & Maintenance System</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white/90 p-1 rounded-full shadow-sm backdrop-blur-sm">
                <NotificationBell />
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-full"
                  style={{ backgroundColor: `${customStyles.gold[600]}20` }}
                >
                  <FaUserCircle className="text-lg" style={{ color: customStyles.gold[600] }} />
                </div>
                <div className="text-right">
                  <p className="text-white font-light text-sm">
                    Welcome, <span className="font-normal" style={{ color: customStyles.gold[500] }}>{user?.fullName}</span>
                  </p>
                  <p className="text-xs text-gray-300 font-light tracking-wider uppercase">
                    Role: Housekeeping Staff
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="group px-4 py-2 text-white font-light text-sm rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden border"
                style={{ 
                  borderColor: customStyles.gold[600],
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = customStyles.gold[600];
                  e.currentTarget.style.borderColor = customStyles.gold[600];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = customStyles.gold[600];
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FaSignOutAlt />
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <FormStatus
          type={success ? 'success' : 'error'}
          message={success || error}
          onClose={() => {
            setSuccess('');
            setError('');
          }}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Overview - Only show on dashboard tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div 
              className={tableContainerClasses}
              style={{ borderLeft: `4px solid ${customStyles.gold[600]}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderLeftColor = customStyles.navy[600];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderLeftColor = customStyles.gold[600];
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.gold[600]}20` }}>
                  <FaBed className="text-xl" style={{ color: customStyles.gold[600] }} />
                </div>
              </div>
              <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Assigned Rooms</p>
              <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{calculateDashboardStats().assignedRooms}</p>
            </div>
            
            <div 
              className={tableContainerClasses}
              style={{ borderLeft: `4px solid ${customStyles.navy[600]}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderLeftColor = customStyles.gold[600];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderLeftColor = customStyles.navy[600];
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.navy[600]}20` }}>
                  <FaBroom className="text-xl" style={{ color: customStyles.navy[600] }} />
                </div>
              </div>
              <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Pending Requests</p>
              <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{calculateDashboardStats().pendingRequests}</p>
            </div>
            
            <div 
              className={tableContainerClasses}
              style={{ borderLeft: `4px solid ${customStyles.gold[600]}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderLeftColor = customStyles.navy[600];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderLeftColor = customStyles.gold[600];
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.gold[600]}20` }}>
                  <FaClipboardCheck className="text-xl" style={{ color: customStyles.gold[600] }} />
                </div>
              </div>
              <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Rooms to Clean</p>
              <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{calculateDashboardStats().roomsToClean}</p>
            </div>
            
            <div 
              className={tableContainerClasses}
              style={{ borderLeft: `4px solid ${customStyles.navy[600]}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderLeftColor = customStyles.gold[600];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderLeftColor = customStyles.navy[600];
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.navy[600]}20` }}>
                  <FaCalendarCheck className="text-xl" style={{ color: customStyles.navy[600] }} />
                </div>
              </div>
              <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Today's Progress</p>
              <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{calculateDashboardStats().todaysProgress}</p>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${tabBaseClasses} ${
                  activeTab === tab.id 
                    ? tabActiveClasses 
                    : tabInactiveClasses
                }`}
                style={
                  activeTab === tab.id
                    ? { 
                        backgroundColor: customStyles.gold[600],
                        borderColor: customStyles.gold[600],
                        color: 'white'
                      }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = customStyles.navy[900];
                    e.currentTarget.style.borderColor = customStyles.navy[900];
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = '#374151';
                    e.currentTarget.style.borderColor = '#D1D5DB';
                  }
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </span>
              </button>
            ))}
            
            <button
              onClick={refreshData}
              disabled={loading}
              className="ml-auto group px-4 py-3 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase flex items-center gap-2"
              style={{ 
                backgroundColor: customStyles.navy[900],
                color: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[800]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[900]}
            >
              <FaSyncAlt className={`${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-6">
          {loading ? (
            <div className={tableContainerClasses}>
              <div className="py-20 text-center">
                <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                <p className="mt-4 text-gray-600 font-light">Loading...</p>
              </div>
            </div>
          ) : activeTab === 'dashboard' ? (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className={tableContainerClasses}>
                <h3 className="text-xl font-light text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab('assigned')}
                    className="group px-4 py-3 text-center rounded-sm transition-all duration-300 transform hover:scale-105"
                    style={{ 
                      backgroundColor: customStyles.gold[600],
                      color: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                  >
                    <FaBed className="mx-auto mb-2 text-lg" />
                    <span className="text-sm font-light">View Assigned Rooms</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="group px-4 py-3 text-center rounded-sm transition-all duration-300 transform hover:scale-105"
                    style={{ 
                      backgroundColor: customStyles.navy[600],
                      color: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[700]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[600]}
                  >
                    <FaBroom className="mx-auto mb-2 text-lg" />
                    <span className="text-sm font-light">Service Requests</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('maintenance')}
                    className="group px-4 py-3 text-center rounded-sm transition-all duration-300 transform hover:scale-105"
                    style={{ 
                      backgroundColor: customStyles.gold[600],
                      color: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                  >
                    <FaWrench className="mx-auto mb-2 text-lg" />
                    <span className="text-sm font-light">Report Maintenance</span>
                  </button>
                  
                  <button
                    onClick={refreshData}
                    className="group px-4 py-3 text-center rounded-sm transition-all duration-300 transform hover:scale-105"
                    style={{ 
                      backgroundColor: customStyles.navy[600],
                      color: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[700]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[600]}
                  >
                    <FaSyncAlt className="mx-auto mb-2 text-lg" />
                    <span className="text-sm font-light">Refresh Data</span>
                  </button>
                </div>
              </div>

              {/* Permissions Info */}
              <div className={tableContainerClasses}>
                <h3 className="text-xl font-light text-gray-900 mb-4">Staff Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-light mb-2" style={{ color: customStyles.gold[700] }}>Allowed Actions:</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2 text-sm font-light text-gray-700">
                        <FaCheckCircle className="text-green-600" />
                        View assigned rooms
                      </li>
                      <li className="flex items-center gap-2 text-sm font-light text-gray-700">
                        <FaCheckCircle className="text-green-600" />
                        Clean and mark rooms
                      </li>
                      <li className="flex items-center gap-2 text-sm font-light text-gray-700">
                        <FaCheckCircle className="text-green-600" />
                        Report maintenance issues
                      </li>
                      <li className="flex items-center gap-2 text-sm font-light text-gray-700">
                        <FaCheckCircle className="text-green-600" />
                        Update request status
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-light mb-2" style={{ color: customStyles.navy[700] }}>Restricted Actions:</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2 text-sm font-light text-gray-700">
                        <FaExclamationTriangle className="text-red-600" />
                        No booking management
                      </li>
                      <li className="flex items-center gap-2 text-sm font-light text-gray-700">
                        <FaExclamationTriangle className="text-red-600" />
                        No billing operations
                      </li>
                      <li className="flex items-center gap-2 text-sm font-light text-gray-700">
                        <FaExclamationTriangle className="text-red-600" />
                        No guest management
                      </li>
                      <li className="flex items-center gap-2 text-sm font-light text-gray-700">
                        <FaExclamationTriangle className="text-red-600" />
                        No financial reports
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'assigned' ? (
            <div className={tableContainerClasses}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    Assigned Rooms <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({assignedRooms.length})</span>
                  </h3>
                  <p className="text-gray-600 font-light text-sm">Rooms assigned to you for cleaning and maintenance</p>
                </div>
              </div>
              
              {assignedRooms.length === 0 ? (
                <div className="text-center py-12">
                  <FaBed className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No rooms assigned to you</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assignedRooms.map(room => (
                    <div 
                      key={room._id}
                      className="rounded-sm border p-5 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300"
                      style={{ borderColor: customStyles.navy[200] }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ 
                              backgroundColor: `${customStyles.gold[600]}20`,
                              color: customStyles.gold[700]
                            }}
                          >
                            <FaBed className="text-lg" />
                          </div>
                          <div>
                            <h4 className="text-base font-light" style={{ color: customStyles.navy[900] }}>
                              Room {room.roomNumber}
                            </h4>
                            <p className="text-sm text-gray-600 font-light">{room.roomType}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-light text-gray-700">Status:</span>
                          <span className={`${badgeBaseClasses} ${
                            room.roomStatus === 'available'
                              ? 'bg-green-600'
                              : room.roomStatus === 'cleaning'
                              ? 'bg-blue-600'
                              : room.roomStatus === 'dirty'
                              ? 'bg-amber-500'
                              : room.roomStatus === 'under maintenance'
                              ? 'bg-red-600'
                              : 'bg-purple-600'
                          }`}>
                            {room.roomStatus || 'unknown'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-light text-gray-700">Availability:</span>
                          <span className={`text-xs font-light tracking-wider px-2 py-1 rounded-sm ${
                            room.isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {room.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 font-light">
                          <span className="flex items-center gap-2">
                            <FaClock className="text-gray-500" />
                            Last cleaned: {room.lastCleaned ? new Date(room.lastCleaned).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-3">
                          {(room.roomStatus === 'dirty' || room.roomStatus === 'cleaning') && (
                            <>
                              <button
                                className="px-3 py-2 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105"
                                style={{ 
                                  backgroundColor: customStyles.gold[600],
                                  color: 'white'
                                }}
                                onClick={() => markRoomAsCleaned(room._id)}
                              >
                                Mark as Cleaned
                              </button>
                              <button
                                className="px-3 py-2 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 border"
                                style={{ 
                                  borderColor: customStyles.navy[600],
                                  color: customStyles.navy[600],
                                  backgroundColor: 'transparent'
                                }}
                                onClick={() => {
                                  setNewMaintenance({
                                    ...newMaintenance,
                                    roomNumber: room.roomNumber
                                  });
                                  setActiveTab('maintenance');
                                }}
                              >
                                Report Issue
                              </button>
                            </>
                          )}
                          {room.roomStatus === 'available' && (
                            <button
                              className="px-3 py-2 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 border"
                              style={{ 
                                borderColor: customStyles.navy[600],
                                color: customStyles.navy[600],
                                backgroundColor: 'transparent'
                              }}
                              onClick={() => markRoomAsDirty(room._id)}
                            >
                              Mark as Needs Cleaning
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'requests' ? (
            <div className={tableContainerClasses}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    Service Requests <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({serviceRequests.length})</span>
                  </h3>
                  <p className="text-gray-600 font-light text-sm">Housekeeping and cleaning requests assigned to you</p>
                </div>
              </div>
              
              {serviceRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FaBroom className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No service requests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {serviceRequests.map(req => (
                    <div key={req._id} className={listCardClasses} style={{ borderColor: customStyles.navy[200] }}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ 
                              backgroundColor: `${customStyles.gold[600]}20`,
                              color: customStyles.gold[700]
                            }}
                          >
                            <FaBroom className="text-lg" />
                          </div>
                          <div>
                            <h4 className="text-base font-light" style={{ color: customStyles.navy[900] }}>
                              {req.serviceType?.toUpperCase() || 'HOUSEKEEPING'}
                            </h4>
                            <p className="text-sm text-gray-600 font-light">Room: {req.roomNumber}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 font-light">{req.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-light">
                            Priority: 
                            <span className={`ml-1 ${
                              req.priority === 'urgent'
                                ? 'text-red-600'
                                : req.priority === 'high'
                                ? 'text-amber-600'
                                : req.priority === 'medium'
                                ? 'text-blue-600'
                                : 'text-green-600'
                            }`}>
                              {req.priority || 'normal'}
                            </span>
                          </span>
                          <span className={`${badgeBaseClasses} ${
                            req.status === 'completed'
                              ? 'bg-green-600'
                              : req.status === 'in_progress'
                              ? 'bg-blue-600'
                              : req.status === 'pending'
                              ? 'bg-amber-500'
                              : 'bg-red-600'
                          }`}>
                            {req.status || 'pending'}
                          </span>
                        </div>
                        <small className="text-xs text-gray-500 font-light">
                          Requested: {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Unknown'}
                        </small>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        {req.status !== 'completed' && (
                          <button
                            className="px-3 py-2 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105"
                            style={{ 
                              backgroundColor: customStyles.gold[600],
                              color: 'white'
                            }}
                            onClick={() => updateRequestStatus(req._id, 'completed')}
                          >
                            Complete
                          </button>
                        )}
                        {req.status === 'pending' && (
                          <button
                            className="px-3 py-2 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 border"
                            style={{ 
                              borderColor: customStyles.navy[600],
                              color: customStyles.navy[600],
                              backgroundColor: 'transparent'
                            }}
                            onClick={() => updateRequestStatus(req._id, 'in_progress')}
                          >
                            Start Task
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'maintenance' ? (
            <div className="space-y-6">
              {/* Report Form */}
              <div className={tableContainerClasses}>
                <div className="flex items-center gap-3 mb-6">
                  <FaWrench className="text-xl" style={{ color: customStyles.gold[600] }} />
                  <h3 className="text-xl font-light text-gray-900">Report Maintenance Issue</h3>
                </div>
                <form onSubmit={submitMaintenanceReport} className="space-y-6">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Room Number *</label>
                    <input 
                      className={inputClasses}
                      placeholder="Room Number" 
                      value={newMaintenance.roomNumber}
                      onChange={e => setNewMaintenance({
                        ...newMaintenance,
                        roomNumber: e.target.value.replace(/[^0-9]/g, '')
                      })} 
                      required 
                      style={{ borderColor: customStyles.navy[200] }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Issue Type</label>
                    <select 
                      className={selectClasses}
                      value={newMaintenance.issueType}
                      onChange={e => setNewMaintenance({...newMaintenance, issueType: e.target.value})}
                      style={{ borderColor: customStyles.navy[200] }}
                    >
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="furniture">Furniture</option>
                      <option value="appliance">Appliance</option>
                      <option value="ac">Air Conditioning</option>
                      <option value="heating">Heating</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Description *</label>
                    <textarea 
                      className={textareaClasses}
                      placeholder="Describe the issue in detail..." 
                      value={newMaintenance.description}
                      onChange={e => setNewMaintenance({...newMaintenance, description: e.target.value})} 
                      required 
                      rows="4"
                      style={{ borderColor: customStyles.navy[200] }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Priority</label>
                    <select 
                      className={selectClasses}
                      value={newMaintenance.priority}
                      onChange={e => setNewMaintenance({...newMaintenance, priority: e.target.value})}
                      style={{ borderColor: customStyles.navy[200] }}
                    >
                      <option value="low">Low Priority</option>
                      <option value="normal">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className={submitButtonClasses}
                    style={{ backgroundColor: customStyles.gold[600] }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                  >
                    Submit Report
                  </button>
                </form>
              </div>

              {/* History */}
              <div className={tableContainerClasses}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">
                      Maintenance History <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({maintenanceReports.length})</span>
                    </h3>
                  </div>
                </div>
                
                {maintenanceReports.length === 0 ? (
                  <div className="text-center py-12">
                    <FaTools className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                    <p className="text-gray-600 font-light">No maintenance reports found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {maintenanceReports.map(report => (
                      <div key={report._id} className={listCardClasses} style={{ borderColor: customStyles.navy[200] }}>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ 
                                backgroundColor: `${customStyles.navy[600]}20`,
                                color: customStyles.navy[700]
                              }}
                            >
                              <FaTools className="text-lg" />
                            </div>
                            <div>
                              <h4 className="text-base font-light" style={{ color: customStyles.navy[900] }}>
                                Room {report.roomNumber}
                              </h4>
                              <p className="text-sm text-gray-600 font-light">Issue: {report.issueType || report.serviceType}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 font-light">{report.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-light">
                              Priority: 
                              <span className={`ml-1 ${
                                report.priority === 'urgent'
                                  ? 'text-red-600'
                                  : report.priority === 'high'
                                  ? 'text-amber-600'
                                  : report.priority === 'normal'
                                  ? 'text-blue-600'
                                  : 'text-green-600'
                              }`}>
                                {report.priority === 'normal' ? 'medium' : report.priority || 'medium'}
                              </span>
                            </span>
                            <span className={`${badgeBaseClasses} ${
                              report.status === 'completed'
                                ? 'bg-green-600'
                                : report.status === 'in_progress'
                                ? 'bg-blue-600'
                                : report.status === 'pending'
                                ? 'bg-amber-500'
                                : 'bg-red-600'
                            }`}>
                              {report.status || 'pending'}
                            </span>
                          </div>
                          <small className="text-xs text-gray-500 font-light">
                            Reported: {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Unknown'}
                            {report.reportedBy && ` | By: ${report.reportedBy}`}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Footer */}
      <div 
        className="border-t py-6"
        style={{ 
          borderColor: customStyles.navy[200],
          backgroundColor: 'white'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 font-light text-sm">
              Hotel Management System © {new Date().getFullYear()}
            </p>
            <p className="text-gray-600 font-light text-sm">
              Staff Dashboard v1.0.0
            </p>
          </div>
        </div>
      </div>

      {confirmState.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-sm shadow-lg max-w-sm w-full mx-4 p-6">
            <h3 className="text-lg font-light mb-2" style={{ color: customStyles.navy[900] }}>
              {confirmState.title}
            </h3>
            <p className="text-sm text-gray-600 font-light mb-6">
              {confirmState.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-xs font-light tracking-wider uppercase rounded-sm border transition-all duration-300"
                style={{
                  borderColor: customStyles.navy[300],
                  color: customStyles.navy[700],
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = customStyles.navy[50];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
                onClick={handleCancelStatusChange}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-xs font-light tracking-wider uppercase rounded-sm border transition-all duration-300"
                style={{
                  borderColor: customStyles.gold[600],
                  backgroundColor: customStyles.gold[600],
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = customStyles.gold[700];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = customStyles.gold[600];
                }}
                onClick={handleConfirmStatusChange}
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;
