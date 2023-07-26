import React, { useState } from 'react';
import { AuthContext } from '../contexts';

const AuthProvider = ({ children }) => {
  const localUserData = JSON.parse(localStorage.getItem('userData'));
  const [userData, setUserData] = useState(localUserData ?? null);
  const loggedIn = !!userData;
  const getAuthHeader = () => {
    if (userData?.token) {
      return { Authorization: `Bearer ${userData.token}` };
    }
    return {};
  };
  const logIn = (usrData) => {
    setUserData(usrData);
    localStorage.setItem('userData', JSON.stringify(usrData));
  };
  const logOut = () => {
    localStorage.removeItem('userData');
    setUserData(null);
  };

  const authContextValue = {
    loggedIn,
    logIn,
    logOut,
    getAuthHeader,
    userData,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      { children }
    </AuthContext.Provider>
  );
};

export default AuthProvider;
