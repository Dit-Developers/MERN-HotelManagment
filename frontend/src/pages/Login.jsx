import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        // Immediately redirect to dashboard if already logged in
        redirectToDashboard(user.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.clear(); // Clear invalid data
      }
    }
  }, [navigate]); // Add navigate to dependency array

  const redirectToDashboard = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'manager':
        navigate('/manager-dashboard');
        break;
      case 'receptionist':
        navigate('/reception-dashboard');
        break;
      case 'staff':
        navigate('/staff-dashboard');
        break;

      case 'user':  
      case 'guest':
        navigate('/');
        break;
      default:
        navigate('/guest-dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email: email,
        password: password
      });

      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setMessage('Login successful!');

      // Redirect based on user role after 1 second
      setTimeout(() => {
        redirectToDashboard(response.data.user.role);
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Hotel Management System - Login</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <button 
          type="submit" 
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {message && (
          <div style={message.includes('successful') ? styles.success : styles.error}>
            {message}
          </div>
        )}

        <p style={styles.registerLink}>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: '400px',
    margin: '100px auto',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center'
  },
  form: {
    marginTop: '20px'
  },
  inputGroup: {
    marginBottom: '20px',
    textAlign: 'left'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  error: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#ffcccc',
    color: '#cc0000',
    borderRadius: '4px'
  },
  success: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#ccffcc',
    color: '#006600',
    borderRadius: '4px'
  },
  registerLink: {
    marginTop: '20px'
  }
};

export default Login;