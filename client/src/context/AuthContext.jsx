import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    return token ? { token, role, name } : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('name', data.name);
    setUser({ token: data.token, role: data.role, name: data.name });
  };

  const logout = () => { localStorage.clear(); setUser(null); };

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}
