import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: 'artist' | 'enthusiast';
  bio?: string;
  created_at: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'created_at' | 'is_active'>) => boolean;
  updateUser: (updatedUser: User) => void;
  isArtist: boolean;
  isEnthusiast: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock database of users with different roles - simplified to 2 accounts
const mockUsers: User[] = [
  // Artist account (real database user)
  {
    id: 1,
    username: 'admin',
    email: 'admin@artgallery.com',
    full_name: 'Gallery Artist',
    role: 'artist',
    bio: 'Professional artist with multiple paintings in the gallery',
    created_at: '2025-07-13T00:32:17',
    is_active: true
  },
  // Enthusiast account (real database user)
  {
    id: 3,
    username: 'art_lover',
    email: 'user@example.com',
    full_name: 'Art Enthusiast',
    role: 'enthusiast',
    bio: 'Passionate about discovering and rating new artwork',
    created_at: '2025-07-13T00:37:07',
    is_active: true
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const login = (username: string, password?: string): boolean => {
    // Simple mock authentication - password is optional for demo
    const foundUser = users.find(u => u.username === username && u.is_active);
    if (foundUser) {
      setUser(foundUser);
      console.log(`Logged in as ${foundUser.role}: ${foundUser.username} (ID: ${foundUser.id})`);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    console.log('Logged out');
  };

  const register = (userData: Omit<User, 'id' | 'created_at' | 'is_active'>): boolean => {
    // Check if username already exists
    if (users.find(u => u.username === userData.username)) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Math.max(...users.map(u => u.id)) + 1,
      created_at: new Date().toISOString(),
      is_active: true
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    console.log(`Registered and logged in as ${newUser.role}: ${newUser.username} (ID: ${newUser.id})`);
    return true;
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user?.id === updatedUser.id) {
      setUser(updatedUser);
    }
  };

  const isAuthenticated = user !== null;
  const isArtist = user?.role === 'artist';
  const isEnthusiast = user?.role === 'enthusiast';

  return (
    <AuthContext.Provider value={{
      user,
      users,
      isAuthenticated,
      login,
      logout,
      register,
      updateUser,
      isArtist,
      isEnthusiast
    }}>
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
