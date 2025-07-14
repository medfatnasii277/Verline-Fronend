import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { victorianTheme } from '../theme/victorianTheme';
import { VictorianButton } from '../theme/styledComponents';

const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, ${victorianTheme.colors.primary}, ${victorianTheme.colors.secondary});
  border-bottom: 3px solid ${victorianTheme.colors.accent};
  padding: ${victorianTheme.spacing.md} 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${victorianTheme.shadows.large};
  
  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${victorianTheme.colors.gold}, transparent);
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${victorianTheme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${victorianTheme.breakpoints.mobile}) {
    padding: 0 ${victorianTheme.spacing.md};
    flex-direction: column;
    gap: ${victorianTheme.spacing.md};
  }
`;

const Logo = styled(Link)`
  font-family: ${victorianTheme.typography.decorativeFont};
  font-size: ${victorianTheme.typography.h3};
  font-weight: ${victorianTheme.typography.bold};
  color: ${victorianTheme.colors.textPrimary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${victorianTheme.spacing.sm};
  transition: all ${victorianTheme.transitions.normal};
  
  &:hover {
    color: ${victorianTheme.colors.accent};
    text-shadow: 0 0 10px ${victorianTheme.colors.accent}40;
  }
  
  &::before {
    content: '🎨';
    font-size: 1.5em;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${victorianTheme.spacing.lg};
  
  @media (max-width: ${victorianTheme.breakpoints.tablet}) {
    gap: ${victorianTheme.spacing.md};
  }
  
  @media (max-width: ${victorianTheme.breakpoints.mobile}) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  font-family: ${victorianTheme.typography.primaryFont};
  font-weight: ${victorianTheme.typography.semibold};
  color: ${props => props.active ? victorianTheme.colors.accent : victorianTheme.colors.textPrimary};
  text-decoration: none;
  padding: ${victorianTheme.spacing.sm} ${victorianTheme.spacing.md};
  border-radius: ${victorianTheme.borderRadius.small};
  transition: all ${victorianTheme.transitions.normal};
  position: relative;
  text-transform: uppercase;
  font-size: ${victorianTheme.typography.small};
  letter-spacing: 1px;
  
  &:hover {
    color: ${victorianTheme.colors.accent};
    background: ${victorianTheme.colors.accent}10;
  }
  
  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      height: 2px;
      background: ${victorianTheme.colors.accent};
    }
  `}
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${victorianTheme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  @media (max-width: ${victorianTheme.breakpoints.mobile}) {
    align-items: center;
  }
`;

const UserName = styled.span`
  font-family: ${victorianTheme.typography.primaryFont};
  font-weight: ${victorianTheme.typography.semibold};
  color: ${victorianTheme.colors.textPrimary};
  font-size: ${victorianTheme.typography.small};
`;

const UserRole = styled.span`
  font-family: ${victorianTheme.typography.bodyFont};
  font-size: ${victorianTheme.typography.tiny};
  color: ${victorianTheme.colors.accent};
  text-transform: capitalize;
  font-style: italic;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: ${victorianTheme.spacing.sm};
  
  @media (max-width: ${victorianTheme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
  }
`;

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isArtist, isEnthusiast } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">
          Victorian Gallery
        </Logo>

        <NavLinks>
          <NavLink to="/" active={isActive('/')}>
            Home
          </NavLink>
          <NavLink to="/gallery" active={isActive('/gallery')}>
            Gallery
          </NavLink>
          <NavLink to="/artists" active={isActive('/artists')}>
            Artists
          </NavLink>
          {isAuthenticated && isArtist && (
            <>
              <NavLink to="/my-paintings" active={isActive('/my-paintings')}>
                My Artwork
              </NavLink>
              <NavLink to="/upload" active={isActive('/upload')}>
                Upload Art
              </NavLink>
            </>
          )}
        </NavLinks>

        <UserSection>
          {isAuthenticated ? (
            <>
              <UserInfo>
                <UserName>{user?.username}</UserName>
                <UserRole>{user?.role}</UserRole>
              </UserInfo>
              <AuthButtons>
                <VictorianButton
                  variant="outline"
                  size="small"
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </VictorianButton>
                <VictorianButton
                  variant="secondary"
                  size="small"
                  onClick={handleLogout}
                >
                  Logout
                </VictorianButton>
              </AuthButtons>
            </>
          ) : (
            <AuthButtons>
              <VictorianButton
                variant="outline"
                size="small"
                onClick={() => navigate('/login')}
              >
                Login
              </VictorianButton>
              <VictorianButton
                variant="accent"
                size="small"
                onClick={() => navigate('/register')}
              >
                Register
              </VictorianButton>
            </AuthButtons>
          )}
        </UserSection>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
