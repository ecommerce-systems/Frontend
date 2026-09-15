import React, { createContext, useContext, useState } from 'react';
import { getAccessToken, setAccessToken as _setToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getAccessToken());

  const login = (token) => {
    _setToken(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    _setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
