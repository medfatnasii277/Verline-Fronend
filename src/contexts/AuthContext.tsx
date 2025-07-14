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

// Mock database of users with different roles - matching real database users
const mockUsers: User[] = [
  // Real database artists
  {
    id: 1,
    username: 'admin',
    email: 'admin@artgallery.com',
    full_name: 'Gallery Administrator',
    role: 'artist',
    bio: 'Art Gallery System Administrator',
    created_at: '2025-07-13T00:32:17',
    is_active: true
  },
  {
    id: 2,
    username: 'painter1',
    email: 'painter@artgallery.com',
    full_name: 'Sample Artist',
    role: 'artist',
    bio: 'Professional artist specializing in contemporary works',
    created_at: '2025-07-13T00:32:17',
    is_active: true
  },
  {
    id: 5,
    username: 'test',
    email: 'test@gmail.com',
    full_name: 'test',
    role: 'artist',
    bio: 'test bio',
    created_at: '2025-07-13T01:40:08',
    is_active: true
  },
  // Mock enthusiasts (using high IDs to avoid conflicts)
  {
    id: 100,
    username: 'art_lover',
    email: 'art@lover.com',
    full_name: 'Art Lover',
    role: 'enthusiast',
    bio: 'Passionate about discovering new artists',
    created_at: '2024-01-04T00:00:00Z',
    is_active: true
  },
  {
    id: 101,
    username: 'gallery_visitor',
    email: 'visitor@gallery.com',
    full_name: 'Gallery Visitor',
    role: 'enthusiast',
    bio: 'Regular gallery visitor and art appreciator',
    created_at: '2024-01-05T00:00:00Z',
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
