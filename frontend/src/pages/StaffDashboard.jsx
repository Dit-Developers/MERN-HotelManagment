import React from 'react';

function StaffDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={styles.container}>
      <h2>Staff Dashboard</h2>
      <p>Welcome, {user?.fullName}!</p>
      <p>Role: {user?.role}</p>
      
      <div style={styles.menu}>
        <h3>Staff Menu:</h3>
        <ul style={styles.list}>
          <li>View Schedule</li>
          <li>Room Cleaning Status</li>
          <li>Service Requests</li>
          <li>Report Issues</li>
          <li>View Announcements</li>
          <li>Leave Request</li>
        </ul>
      </div>

      <button onClick={() => {
        localStorage.clear();
        window.location.href = '/login';
      }} style={styles.logoutBtn}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center'
  },
  menu: {
    margin: '30px auto',
    width: '300px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f0f0f0'
  },
  list: {
    listStyle: 'none',
    padding: '0',
    textAlign: 'left'
  },
  logoutBtn: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default StaffDashboard;