import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GlobalStyles } from './theme/styledComponents';
import { victorianTheme } from './theme/victorianTheme';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Gallery from './components/Gallery';
import PaintingDetail from './components/PaintingDetail';
import Profile from './components/Profile';
import UploadPainting from './components/UploadPainting';
import MyPaintings from './components/MyPaintings';
import Artists from './components/Artists';
import Login from './components/Login';
import Register from './components/Register';

// Protected route component for authenticated users
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Role-based route protection for artists only
const ArtistRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isArtist, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isArtist) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2 style={{ color: '#8B4513' }}>Artist Access Required</h2>
        <p>This section is only available for artists.</p>
        <p>You are currently logged in as: <strong>{user?.username}</strong> ({user?.role})</p>
        <p>Only users with "artist" role can access this feature.</p>
      </div>
    );
  }
  
  return <>{children}</>;
};

// Public route component (redirects authenticated users away from auth pages)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <GlobalStyles />
      {isAuthenticated && <Navbar />}
      <main>
        <Routes>
          {/* Public Auth Routes - only accessible when not logged in */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Protected Routes - require authentication */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/gallery" element={
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          } />
          <Route path="/paintings/:id" element={
            <ProtectedRoute>
              <PaintingDetail />
            </ProtectedRoute>
          } />
          <Route path="/artists" element={
            <ProtectedRoute>
              <Artists />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Artist-Only Routes */}
          <Route path="/upload" element={
            <ArtistRoute>
              <UploadPainting />
            </ArtistRoute>
          } />
          <Route path="/my-paintings" element={
            <ArtistRoute>
              <MyPaintings />
            </ArtistRoute>
          } />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={victorianTheme}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
