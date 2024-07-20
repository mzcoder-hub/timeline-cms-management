// src/AuthContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token') // Initialize based on the token presence
  });

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setAuth({ token: res.data.token, isAuthenticated: true });
  };

  const register = async (name, email, password) => {
    await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
