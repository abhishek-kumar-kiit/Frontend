// src/contexts/AuthContext.tsx

 import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';



interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      // Clear potentially corrupt data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      // --- IMPORTANT: Set loading to false after we've checked ---
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, userToken: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
   <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};