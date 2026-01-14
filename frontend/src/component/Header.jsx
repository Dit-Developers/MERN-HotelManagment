import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (user) {
      // User is logged in, redirect to their dashboard
      navigate(`/${user.role}-dashboard`);
    } else {
      // User is not logged in, redirect to login
      navigate('/login');
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo}>
          <Link to="/" style={styles.logoLink}>
            <h1>Luxury Hotel</h1>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          style={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        {/* Navigation */}
        <nav style={{...styles.nav, ...(isMenuOpen ? styles.navOpen : {})}}>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <Link to="/" style={styles.navLink} onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/about" style={styles.navLink} onClick={() => setIsMenuOpen(false)}>About</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/rooms" style={styles.navLink} onClick={() => setIsMenuOpen(false)}>Rooms</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/gallery" style={styles.navLink} onClick={() => setIsMenuOpen(false)}>Gallery</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/contact" style={styles.navLink} onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </li>
            
            {/* Auth Links */}
            <li style={styles.navItem}>
              {user ? (
                <>
                  {/* Dashboard Button - Goes to role-based dashboard */}
                  <button onClick={handleDashboardClick} style={styles.dashboardButton}>
                    Dashboard ({user.role})
                  </button>
                  
                  {/* Logout Button */}
                  <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout
                  </button>
                  
                  {/* User Info (optional) */}
                  <span style={styles.userName}>
                    Hi, {user.fullName}
                  </span>
                </>
              ) : (
                <>
                  {/* Always show login button */}
                  <Link to="/login" style={styles.authLink} onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" style={styles.registerLink} onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '15px 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  logoLink: {
    color: 'white',
    textDecoration: 'none'
  },
  nav: {
    display: 'flex'
  },
  navOpen: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#2c3e50',
    padding: '20px',
    zIndex: 1000
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '30px',
    alignItems: 'center'
  },
  navItem: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 0',
    transition: 'color 0.3s'
  },
  navLinkHover: {
    color: '#f39c12'
  },
  authLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 20px',
    border: '1px solid white',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s',
    backgroundColor: 'transparent'
  },
  authLinkHover: {
    backgroundColor: 'white',
    color: '#2c3e50'
  },
  registerLink: {
    color: '#2c3e50',
    textDecoration: 'none',
    padding: '8px 20px',
    backgroundColor: 'white',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  },
  registerLinkHover: {
    backgroundColor: '#f39c12',
    color: 'white'
  },
  dashboardButton: {
    padding: '8px 20px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  dashboardButtonHover: {
    backgroundColor: '#e67e22'
  },
  logoutButton: {
    padding: '8px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  logoutButtonHover: {
    backgroundColor: '#c0392b'
  },
  userName: {
    fontSize: '14px',
    color: '#f39c12',
    fontWeight: 'bold',
    marginLeft: '10px'
  },
  menuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer'
  },

  // Media queries
  '@media (max-width: 768px)': {
    nav: {
      display: 'none'
    },
    navOpen: {
      display: 'flex'
    },
    navList: {
      flexDirection: 'column',
      gap: '20px'
    },
    navItem: {
      width: '100%',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '10px'
    },
    menuToggle: {
      display: 'block'
    }
  }
};

// Add hover effects using JavaScript inline styles
const addHoverStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link:hover { color: #f39c12 !important; }
    .auth-link:hover { background-color: white !important; color: #2c3e50 !important; }
    .register-link:hover { background-color: #f39c12 !important; color: white !important; }
    .dashboard-btn:hover { background-color: #e67e22 !important; }
    .logout-btn:hover { background-color: #c0392b !important; }
  `;
  document.head.appendChild(style);
};

// Call the function to add hover styles
if (typeof window !== 'undefined') {
  addHoverStyles();
}

export default Header;