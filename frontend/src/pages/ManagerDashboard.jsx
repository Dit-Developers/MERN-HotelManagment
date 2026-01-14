import React from 'react';

function ManagerDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={styles.container}>
      <h2>Manager Dashboard</h2>
      <p>Welcome, {user?.fullName}!</p>
      <p>Role: {user?.role}</p>
      
      <div style={styles.menu}>
        <h3>Manager Menu:</h3>
        <ul style={styles.list}>
          <li>View Daily Reports</li>
          <li>Manage Staff Schedule</li>
          <li>Approve Leave Requests</li>
          <li>Monitor Occupancy</li>
          <li>View Revenue</li>
          <li>Inventory Management</li>
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

export default ManagerDashboard;