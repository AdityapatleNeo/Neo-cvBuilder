

import React, { useState } from 'react';
import axios from 'axios';
import '../assets/style.css';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    contactNumber: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'contactNumber') {
      const onlyNumbers = value.replace(/\D/g, ''); 
      if (onlyNumbers.length > 10) return; 
      setForm((prev) => ({ ...prev, [name]: onlyNumbers }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const { username, email, contactNumber, password } = form;

    if (!username.trim()) {
      return 'Username is required.';
    } else if (username.length < 3) {
      return 'Username must be at least 3 characters long.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return 'Email is required.';
    } else if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (contactNumber.trim()) {
      const contactRegex = /^[0-9]{10}$/;
      if (!contactRegex.test(contactNumber)) {
        return 'Contact number must be exactly 10 digits.';
      }
    }

    if (!password.trim()) {
      return 'Password is required.';
    } else if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    } else if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    } else if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }

    return null; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const resp = await axios.post('http://localhost:5000/api/auth/register', form);
      if (resp.status === 201) {
        setSuccess('Registration successful! Please login.');
        setForm({ username: '', email: '', contactNumber: '', password: '' });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError('Unexpected server response.');
      }
    } catch (err) {
      console.error(err);
      setError('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>Neo CVs Register</h2>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <label>Username *</label>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Contact Number</label>
          <input
            name="contactNumber"
            type="text"
            value={form.contactNumber}
            onChange={handleChange}
            placeholder="10-digit number"
            maxLength="10" 
          />

          <label>Password *</label>
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="show-password">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
