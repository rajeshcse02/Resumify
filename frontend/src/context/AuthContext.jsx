import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    return stored || null;
  });

  const login = ({ user, token }) => {
    localStorage.setItem('user', JSON.stringify({ ...user, token }));
    setUser({ ...user, token });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
