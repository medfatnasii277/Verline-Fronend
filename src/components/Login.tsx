import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  VictorianCard, 
  VictorianButton, 
  VictorianInput, 
  VictorianHeading,
  VictorianContainer 
} from '../theme/styledComponents';
import { useAuth } from '../contexts/AuthContext';
import { victorianTheme } from '../theme/victorianTheme';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${victorianTheme.spacing.lg};
  background-image: 
    linear-gradient(45deg, ${victorianTheme.colors.secondary}20 25%, transparent 25%),
    linear-gradient(-45deg, ${victorianTheme.colors.secondary}20 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${victorianTheme.colors.secondary}20 75%),
    linear-gradient(-45deg, transparent 75%, ${victorianTheme.colors.secondary}20 75%);
  background-size: 60px 60px;
  background-position: 0 0, 0 30px, 30px -30px, -30px 0px;
`;

const LoginCard = styled(VictorianCard)`
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${victorianTheme.spacing.lg};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${victorianTheme.spacing.sm};
  text-align: left;
`;

const Label = styled.label`
  font-family: ${victorianTheme.typography.bodyFont};
  font-weight: ${victorianTheme.typography.semibold};
  color: ${victorianTheme.colors.textSecondary};
  font-size: ${victorianTheme.typography.small};
`;

const ErrorMessage = styled.div`
  color: ${victorianTheme.colors.error};
  font-family: ${victorianTheme.typography.bodyFont};
  font-size: ${victorianTheme.typography.small};
  text-align: center;
  padding: ${victorianTheme.spacing.sm};
  background: ${victorianTheme.colors.error}10;
  border-radius: ${victorianTheme.borderRadius.small};
  border: 1px solid ${victorianTheme.colors.error}30;
`;

const DemoUsersSection = styled.div`
  margin-top: ${victorianTheme.spacing.lg};
  padding: ${victorianTheme.spacing.lg};
  background: ${victorianTheme.colors.accent}05;
  border-radius: ${victorianTheme.borderRadius.medium};
  border: 1px solid ${victorianTheme.colors.accent}20;
`;

const DemoUserGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${victorianTheme.spacing.md};
  margin-top: ${victorianTheme.spacing.md};
`;

const DemoUserCard = styled.div`
  padding: ${victorianTheme.spacing.sm};
  background: white;
  border-radius: ${victorianTheme.borderRadius.small};
  border: 1px solid ${victorianTheme.colors.accent}30;
  cursor: pointer;
  transition: all ${victorianTheme.transitions.normal};
  
  &:hover {
    background: ${victorianTheme.colors.accent}05;
    border-color: ${victorianTheme.colors.accent}50;
    transform: translateY(-2px);
  }
`;

const RoleBadge = styled.span<{ role: 'artist' | 'enthusiast' }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${victorianTheme.typography.tiny};
  font-weight: ${victorianTheme.typography.semibold};
  text-transform: uppercase;
  background: ${props => props.role === 'artist' ? victorianTheme.colors.accent : victorianTheme.colors.secondary};
  color: white;
`;

const StyledLink = styled(Link)`
  color: ${victorianTheme.colors.accent};
  text-decoration: none;
  font-weight: ${victorianTheme.typography.semibold};
  
  &:hover {
    text-decoration: underline;
  }
`;

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, users } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.username.trim()) {
      setError('Username is required');
      setIsLoading(false);
      return;
    }

    const success = login(formData.username, formData.password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username. Please try again or use one of the demo accounts below.');
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (username: string) => {
    const success = login(username);
    if (success) {
      navigate('/');
    }
  };

  return (
    <LoginContainer>
      <LoginCard elevated>
        <VictorianHeading level={2} style={{ marginBottom: victorianTheme.spacing.lg }}>
          Welcome to Victorian Gallery
        </VictorianHeading>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Username</Label>
            <VictorianInput
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <VictorianInput
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password (optional for demo)"
            />
          </InputGroup>

          <VictorianButton
            type="submit"
            variant="accent"
            size="large"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </VictorianButton>
        </Form>

        <DemoUsersSection>
          <VictorianHeading level={4} style={{ margin: 0, marginBottom: victorianTheme.spacing.sm }}>
            Demo Accounts
          </VictorianHeading>
          <p style={{ 
            margin: 0, 
            fontSize: victorianTheme.typography.small,
            color: victorianTheme.colors.textMuted 
          }}>
            Click any account below to login instantly:
          </p>
          
          <DemoUserGrid>
            {users.map(user => (
              <DemoUserCard key={user.id} onClick={() => handleDemoLogin(user.username)}>
                <div style={{ fontWeight: victorianTheme.typography.semibold, marginBottom: '4px' }}>
                  {user.username}
                </div>
                <RoleBadge role={user.role}>{user.role}</RoleBadge>
                <div style={{ 
                  fontSize: victorianTheme.typography.tiny, 
                  color: victorianTheme.colors.textMuted,
                  marginTop: '4px'
                }}>
                  {user.full_name}
                </div>
              </DemoUserCard>
            ))}
          </DemoUserGrid>
        </DemoUsersSection>

        <p style={{ 
          marginTop: victorianTheme.spacing.lg, 
          fontSize: victorianTheme.typography.small,
          color: victorianTheme.colors.textSecondary 
        }}>
          Don't have an account? <StyledLink to="/register">Register here</StyledLink>
        </p>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
