// pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateProfile, changePassword, loading } = useAuth();
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Address: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        Name: user.Name || '',
        Email: user.Email || '',
        Phone: user.Phone || '',
        Address: user.Address || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    // Implement profile update
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    // Implement password change
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      {/* Tabs and forms for profile management */}
    </div>
  );
};

export default Profile;