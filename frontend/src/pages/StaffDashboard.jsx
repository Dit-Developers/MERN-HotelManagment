import React, { useState, useEffect } from 'react';

function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assignedRooms, setAssignedRooms] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [maintenanceReports, setMaintenanceReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [newMaintenance, setNewMaintenance] = useState({
    roomNumber: '',
    issueType: 'plumbing',
    description: '',
    priority: 'medium'
  });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

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

  // Fetch all initial data on component mount
  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, []);

  // Fetch data when tab changes to non-dashboard tabs
  useEffect(() => {
    if (token && activeTab !== 'dashboard') {
      fetchTabData(activeTab);
    }
  }, [activeTab]);

  // Fetch all data needed for dashboard
  const fetchAllData = async () => {
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
  };

  // Fetch data for specific tab
  const fetchTabData = async (tab) => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      switch(tab) {
        case 'assigned':
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
        
        case 'requests':
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
        
        case 'maintenance':
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
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

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

  // Mark room as cleaned
  const markRoomAsCleaned = async (roomId) => {
    if (window.confirm('Mark this room as cleaned?')) {
      await apiCall('PUT', `/room/update-room-status/${roomId}`, { 
        roomStatus: 'available',
        isAvailable: true 
      });
    }
  };

  // Mark room as dirty (needs cleaning)
  const markRoomAsDirty = async (roomId) => {
    if (window.confirm('Mark this room as needs cleaning?')) {
      await apiCall('PUT', `/room/update-room-status/${roomId}`, { 
        roomStatus: 'cleaning' 
      });
    }
  };

  // 
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
      ...newMaintenance,
      userId: user._id,
      serviceType: 'maintenance',
      status: 'pending',
      reportedBy: user.fullName,
      reportedAt: new Date().toISOString()
    };
    
    await apiCall('POST', '/service-requests/create', reportData);
    setNewMaintenance({
      roomNumber: '',
      issueType: 'plumbing',
      description: '',
      priority: 'medium'
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

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Render content based on active tab
  const renderContent = () => {
    if (loading && activeTab === 'dashboard') return <div style={styles.loading}>Loading dashboard...</div>;

    switch(activeTab) {
      case 'dashboard':
        const stats = calculateDashboardStats();
        
        return (
          <div style={styles.dashboard}>
            <h3>Housekeeping Dashboard</h3>
            <p>Welcome back, <strong>{user.fullName}</strong>!</p>
            
            <div style={styles.stats}>
              <div style={styles.statCard}>
                <h4>Rooms Assigned</h4>
                <p>{stats.assignedRooms}</p>
              </div>
              <div style={styles.statCard}>
                <h4>Pending Requests</h4>
                <p>{stats.pendingRequests}</p>
              </div>
              <div style={styles.statCard}>
                <h4>Rooms to Clean</h4>
                <p>{stats.roomsToClean}</p>
              </div>
              <div style={styles.statCard}>
                <h4>Today's Progress</h4>
                <p>{stats.todaysProgress}</p>
              </div>
            </div>

            <div style={styles.quickActions}>
              <h4>Quick Actions</h4>
              <div style={styles.actionGrid}>
                <button 
                  style={styles.actionBtn}
                  onClick={() => setActiveTab('assigned')}
                >
                  🏨 View Assigned Rooms
                </button>
                <button 
                  style={styles.actionBtn}
                  onClick={() => setActiveTab('requests')}
                >
                  🧹 Service Requests
                </button>
                <button 
                  style={styles.actionBtn}
                  onClick={() => setActiveTab('maintenance')}
                >
                  🔧 Report Maintenance
                </button>
                <button 
                  style={styles.actionBtn}
                  onClick={refreshData}
                >
                  🔄 Refresh Data
                </button>
              </div>
            </div>
          </div>
        );

      case 'assigned':
        return (
          <div>
            <h3>Assigned Rooms</h3>
            <p style={styles.subtitle}>Rooms assigned to you for cleaning and maintenance</p>
            
            <div style={styles.listContainer}>
              <div style={styles.headerRow}>
                <h4>Your Rooms ({assignedRooms.length})</h4>
                <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
              </div>
              {loading ? (
                <div style={styles.loading}>Loading rooms...</div>
              ) : assignedRooms.length === 0 ? (
                <div style={styles.noData}>No rooms assigned</div>
              ) : (
                assignedRooms.map(room => (
                  <div key={room._id} style={styles.roomCard}>
                    <div style={styles.roomInfo}>
                      <strong>Room {room.roomNumber}</strong>
                      <p>Type: {room.roomType}</p>
                      <p>Status: 
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: 
                            room.roomStatus === 'available' ? '#4CAF50' :
                            room.roomStatus === 'cleaning' ? '#2196F3' :
                            room.roomStatus === 'dirty' ? '#FF9800' :
                            room.roomStatus === 'under maintenance' ? '#F44336' : '#9C27B0'
                        }}>
                          {room.roomStatus}
                        </span>
                      </p>
                      <p>Last cleaned: {room.lastCleaned ? 
                        new Date(room.lastCleaned).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                    <div style={styles.roomActions}>
                      {room.roomStatus === 'dirty' || room.roomStatus === 'cleaning' ? (
                        <>
                          <button 
                            style={styles.completeBtn}
                            onClick={() => markRoomAsCleaned(room._id)}
                          >
                            ✅ Mark as Cleaned
                          </button>
                          <button 
                            style={styles.reportBtn}
                            onClick={() => {
                              setNewMaintenance({
                                ...newMaintenance,
                                roomNumber: room.roomNumber
                              });
                              setActiveTab('maintenance');
                            }}
                          >
                            🔧 Report Issue
                          </button>
                        </>
                      ) : room.roomStatus === 'available' ? (
                        <button 
                          style={styles.dirtyBtn}
                          onClick={() => markRoomAsDirty(room._id)}
                        >
                          🧹 Needs Cleaning
                        </button>
                      ) : (
                        <span style={styles.inProgress}>Action in progress...</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'requests':
        return (
          <div>
            <h3>Service Requests</h3>
            <p style={styles.subtitle}>Housekeeping and cleaning requests assigned to you</p>
            
            <div style={styles.listContainer}>
              <div style={styles.headerRow}>
                <h4>Your Requests ({serviceRequests.length})</h4>
                <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
              </div>
              {loading ? (
                <div style={styles.loading}>Loading requests...</div>
              ) : serviceRequests.length === 0 ? (
                <div style={styles.noData}>No service requests</div>
              ) : (
                serviceRequests.map(req => (
                  <div key={req._id} style={styles.requestCard}>
                    <div style={styles.requestInfo}>
                      <strong>{req.serviceType?.toUpperCase()}</strong>
                      <p>Room: {req.roomNumber}</p>
                      <p>{req.description}</p>
                      <p>Priority: 
                        <span style={{
                          color: req.priority === 'urgent' ? '#F44336' :
                                 req.priority === 'high' ? '#FF9800' :
                                 req.priority === 'medium' ? '#2196F3' : '#4CAF50'
                        }}>
                          {' ' + req.priority}
                        </span>
                      </p>
                      <small>
                        Requested: {req.createdAt ? 
                        new Date(req.createdAt).toLocaleDateString() : 'Unknown'}
                      </small>
                    </div>
                    <div style={styles.requestActions}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: 
                          req.status === 'completed' ? '#4CAF50' :
                          req.status === 'in_progress' ? '#2196F3' :
                          req.status === 'pending' ? '#FF9800' : '#F44336'
                      }}>
                        {req.status}
                      </span>
                      <div style={styles.statusButtons}>
                        {req.status !== 'completed' && (
                          <button 
                            style={styles.completeBtn}
                            onClick={() => updateRequestStatus(req._id, 'completed')}
                          >
                            ✅ Complete
                          </button>
                        )}
                        {req.status === 'pending' && (
                          <button 
                            style={styles.progressBtn}
                            onClick={() => updateRequestStatus(req._id, 'in_progress')}
                          >
                            ⏳ Start
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div>
            <h3>Maintenance Reports</h3>
            <p style={styles.subtitle}>Report maintenance issues and track repairs</p>
            
            <form onSubmit={submitMaintenanceReport} style={styles.form}>
              <h4>Report New Maintenance Issue</h4>
              <input 
                style={styles.input} 
                placeholder="Room Number" 
                value={newMaintenance.roomNumber}
                onChange={e => setNewMaintenance({...newMaintenance, roomNumber: e.target.value})} 
                required 
              />
              <select 
                style={styles.input} 
                value={newMaintenance.issueType}
                onChange={e => setNewMaintenance({...newMaintenance, issueType: e.target.value})}
              >
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="furniture">Furniture</option>
                <option value="appliance">Appliance</option>
                <option value="ac">Air Conditioning</option>
                <option value="heating">Heating</option>
                <option value="other">Other</option>
              </select>
              <textarea 
                style={styles.textarea} 
                placeholder="Describe the issue in detail..." 
                value={newMaintenance.description}
                onChange={e => setNewMaintenance({...newMaintenance, description: e.target.value})} 
                required 
                rows="4"
              />
              <select 
                style={styles.input} 
                value={newMaintenance.priority}
                onChange={e => setNewMaintenance({...newMaintenance, priority: e.target.value})}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
              <button type="submit" style={styles.submitBtn}>Submit Report</button>
            </form>

            <div style={styles.listContainer}>
              <div style={styles.headerRow}>
                <h4>Maintenance History ({maintenanceReports.length})</h4>
                <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
              </div>
              {loading ? (
                <div style={styles.loading}>Loading maintenance reports...</div>
              ) : maintenanceReports.length === 0 ? (
                <div style={styles.noData}>No maintenance reports</div>
              ) : (
                maintenanceReports.map(report => (
                  <div key={report._id} style={styles.maintenanceCard}>
                    <div>
                      <strong>Room {report.roomNumber}</strong>
                      <p>Issue: {report.issueType || report.serviceType}</p>
                      <p>{report.description}</p>
                      <p>Priority: 
                        <span style={{
                          color: report.priority === 'urgent' ? '#F44336' :
                                 report.priority === 'high' ? '#FF9800' :
                                 report.priority === 'medium' ? '#2196F3' : '#4CAF50'
                        }}>
                          {' ' + (report.priority || 'medium')}
                        </span>
                      </p>
                      <p>Status: 
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: 
                            report.status === 'completed' ? '#4CAF50' :
                            report.status === 'in_progress' ? '#2196F3' :
                            report.status === 'pending' ? '#FF9800' : '#F44336'
                        }}>
                          {report.status}
                        </span>
                      </p>
                      <small>
                        Reported: {report.createdAt ? 
                        new Date(report.createdAt).toLocaleDateString() : 'Unknown'} |
                        By: {report.reportedBy || 'Staff'}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>🏨 Hotel Housekeeping Dashboard</h2>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.fullName}!</span>
          <span style={styles.role}>Role: Housekeeping Staff</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <button 
            style={activeTab === 'dashboard' ? styles.activeTab : styles.tab} 
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            style={activeTab === 'assigned' ? styles.activeTab : styles.tab} 
            onClick={() => setActiveTab('assigned')}
          >
            🏨 Assigned Rooms
          </button>
          <button 
            style={activeTab === 'requests' ? styles.activeTab : styles.tab} 
            onClick={() => setActiveTab('requests')}
          >
            🧹 Service Requests
          </button>
          <button 
            style={activeTab === 'maintenance' ? styles.activeTab : styles.tab} 
            onClick={() => setActiveTab('maintenance')}
          >
            🔧 Maintenance Reports
          </button>
          <div style={styles.sidebarNote}>
            <p><strong>Staff Permissions:</strong></p>
            <ul style={styles.permissionList}>
              <li>✅ View assigned rooms</li>
              <li>✅ Clean rooms</li>
              <li>✅ Report maintenance</li>
              <li>❌ No bookings</li>
              <li>❌ No billing</li>
            </ul>
          </div>
        </div>

        <div style={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  role: {
    backgroundColor: '#3498db',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '14px'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  errorMessage: {
    backgroundColor: '#ffeaea',
    color: '#d32f2f',
    padding: '12px 20px',
    margin: '0 20px 20px',
    borderRadius: '4px',
    borderLeft: '4px solid #d32f2f'
  },
  successMessage: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '12px 20px',
    margin: '0 20px 20px',
    borderRadius: '4px',
    borderLeft: '4px solid #2e7d32'
  },
  layout: {
    display: 'flex',
    minHeight: 'calc(100vh - 80px)'
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#34495e',
    padding: '20px 0',
    position: 'relative'
  },
  tab: {
    display: 'block',
    width: '100%',
    padding: '15px 20px',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    textAlign: 'left',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    borderLeft: '4px solid transparent'
  },
  activeTab: {
    display: 'block',
    width: '100%',
    padding: '15px 20px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    textAlign: 'left',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    borderLeft: '4px solid #3498db'
  },
  sidebarNote: {
    position: 'absolute',
    bottom: '20px',
    left: '0',
    right: '0',
    padding: '15px',
    backgroundColor: '#2c3e50',
    color: 'white',
    fontSize: '12px',
    borderTop: '1px solid #4a6278'
  },
  permissionList: {
    listStyle: 'none',
    padding: '0',
    margin: '10px 0 0 0',
    fontSize: '11px'
  },
  content: {
    flex: '1',
    padding: '30px',
    overflowY: 'auto'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666'
  },
  dashboard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  subtitle: {
    color: '#666',
    marginBottom: '20px'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    margin: '20px 0'
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #dee2e6',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  quickActions: {
    marginTop: '30px'
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginTop: '15px'
  },
  actionBtn: {
    padding: '15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'transform 0.2s'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  refreshBtn: {
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  listContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginTop: '20px'
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '16px'
  },
  roomCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '6px',
    marginBottom: '10px',
    backgroundColor: '#fafafa'
  },
  requestCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '6px',
    marginBottom: '10px',
    backgroundColor: '#fafafa'
  },
  maintenanceCard: {
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '6px',
    marginBottom: '10px',
    backgroundColor: '#fafafa'
  },
  roomInfo: {
    flex: '1'
  },
  requestInfo: {
    flex: '1'
  },
  roomActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minWidth: '150px'
  },
  requestActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    minWidth: '150px'
  },
  statusButtons: {
    display: 'flex',
    gap: '10px'
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
    marginLeft: '5px'
  },
  completeBtn: {
    padding: '8px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  progressBtn: {
    padding: '8px 15px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  dirtyBtn: {
    padding: '8px 15px',
    backgroundColor: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  reportBtn: {
    padding: '8px 15px',
    backgroundColor: '#F44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  inProgress: {
    color: '#666',
    fontSize: '14px',
    fontStyle: 'italic'
  },
  form: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  textarea: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box',
    minHeight: '100px',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical'
  },
  submitBtn: {
    padding: '12px 24px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px'
  }
};

export default StaffDashboard;