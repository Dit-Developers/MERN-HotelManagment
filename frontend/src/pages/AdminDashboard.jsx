import React from 'react';

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user?.fullName}!</p>
      <p>Role: {user?.role}</p>
      <p>Email: {user?.email}</p>
      
      <div style={styles.menu}>
        <h3>Admin Menu:</h3>
        <ul style={styles.list}>
          <li>Manage All Users</li>
          <li>View All Bookings</li>
          <li>Hotel Settings</li>
          <li>Financial Reports</li>
          <li>Staff Management</li>
          <li>Room Management</li>
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

export default AdminDashboard;