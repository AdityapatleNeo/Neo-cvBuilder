

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode'
import '../assets/style.css';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const resp = await axios.post('http://localhost:5000/api/auth/login', form);
      const { token } = resp.data;
      sessionStorage.setItem('token', JSON.stringify(token));
      // alert(`Welcome to Neo CVs portal ${resp.data.user.username}`)
      window.location.reload();
      navigate('/');
    } catch (err) {
      setError('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Google login failed: Missing token.');
      return;
    }

    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google user:', decoded);

      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential,
      });

      sessionStorage.setItem('token', JSON.stringify(res.data.token));
      window.location.reload();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Google login failed.');
    }
  };

  return (
    <GoogleOAuthProvider clientId="200477791837-u65ksdvpts7drj16erfjfih1rnf1b57c.apps.googleusercontent.com">
      <div className="form-wrapper">
        <div className="form-container">
          <h2>Neo CVS Login</h2>
          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>Email *</label>
            <input
              name="email"
              type="text"
              value={form.email}
              onChange={handleChange}
              required
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

            <button type="submit">Login</button>
          </form>

          <div style={{textAlign:'center',padding:'5px'}}>or</div>

          <div className="google-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed.')}
            />
          </div>

          <p>
            Create a new account <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage

