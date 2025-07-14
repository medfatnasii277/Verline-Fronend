import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  VictorianCard, 
  VictorianButton, 
  VictorianInput, 
  VictorianHeading,
  VictorianContainer,
  VictorianTextarea
} from '../theme/styledComponents';
import { useAuth } from '../contexts/AuthContext';
import { victorianTheme } from '../theme/victorianTheme';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${victorianTheme.spacing.lg};
  
  // Victorian background pattern
  background-image: 
    linear-gradient(45deg, ${victorianTheme.colors.secondary}20 25%, transparent 25%),
    linear-gradient(-45deg, ${victorianTheme.colors.secondary}20 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${victorianTheme.colors.secondary}20 75%),
    linear-gradient(-45deg, transparent 75%, ${victorianTheme.colors.secondary}20 75%);
  background-size: 60px 60px;
  background-position: 0 0, 0 30px, 30px -30px, -30px 0px;
`;

const RegisterCard = styled(VictorianCard)`
  width: 100%;
  max-width: 500px;
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
  font-family: ${victorianTheme.typography.primaryFont};
  font-weight: ${victorianTheme.typography.semibold};
  color: ${victorianTheme.colors.textPrimary};
  font-size: ${victorianTheme.typography.small};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const RoleContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${victorianTheme.spacing.md};
`;

const RoleCard = styled.div<{ selected: boolean }>`
  border: 2px solid ${props => props.selected ? victorianTheme.colors.accent : victorianTheme.colors.border};
  border-radius: ${victorianTheme.borderRadius.medium};
  padding: ${victorianTheme.spacing.md};
  cursor: pointer;
  transition: all ${victorianTheme.transitions.normal};
  background: ${props => props.selected ? `${victorianTheme.colors.accent}20` : 'transparent'};
  
  &:hover {
    border-color: ${victorianTheme.colors.accent};
    background: ${`${victorianTheme.colors.accent}10`};
  }
`;

const RoleTitle = styled.h4`
  font-family: ${victorianTheme.typography.decorativeFont};
  color: ${victorianTheme.colors.textPrimary};
  margin-bottom: ${victorianTheme.spacing.sm};
  font-size: ${victorianTheme.typography.body};
`;

const RoleDescription = styled.p`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textMuted};
  font-size: ${victorianTheme.typography.small};
  line-height: 1.4;
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #8B0000, #DC143C);
  color: white;
  padding: ${victorianTheme.spacing.md};
  border-radius: ${victorianTheme.borderRadius.medium};
  font-size: ${victorianTheme.typography.small};
  text-align: center;
  border: 1px solid #DC143C;
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${victorianTheme.spacing.lg};
`;

const StyledLink = styled(Link)`
  color: ${victorianTheme.colors.accent};
  text-decoration: none;
  font-family: ${victorianTheme.typography.primaryFont};
  font-size: ${victorianTheme.typography.small};
  transition: color ${victorianTheme.transitions.normal};
  
  &:hover {
    color: ${victorianTheme.colors.gold};
    text-shadow: 0 0 5px ${victorianTheme.colors.gold}40;
  }
`;

const WelcomeText = styled.p`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textMuted};
  margin-bottom: ${victorianTheme.spacing.lg};
  font-style: italic;
  line-height: 1.6;
`;

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'enthusiast' as 'enthusiast' | 'artist',
    bio: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role: 'enthusiast' | 'artist') => {
    setFormData({
      ...formData,
      role
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      const success = register(registrationData);
      
      if (success) {
        navigate('/');
      } else {
        setError('Username already exists. Please choose a different username.');
      }
    } catch (err: any) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <VictorianContainer maxWidth="500px">
        <RegisterCard elevated>
          <VictorianHeading level={2} decorative>
            Join Our Gallery
          </VictorianHeading>
          
          <WelcomeText>
            Become part of our distinguished community of art enthusiasts and creators.
          </WelcomeText>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="username">Username *</Label>
              <VictorianInput
                id="username"
                name="username"
                type="text"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="email">Email Address *</Label>
              <VictorianInput
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="full_name">Full Name *</Label>
              <VictorianInput
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Your full name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Account Type *</Label>
              <RoleContainer>
                <RoleCard 
                  selected={formData.role === 'enthusiast'}
                  onClick={() => handleRoleSelect('enthusiast')}
                >
                  <RoleTitle>Art Enthusiast</RoleTitle>
                  <RoleDescription>
                    Browse, rate, and comment on artwork. Perfect for art lovers and collectors.
                  </RoleDescription>
                </RoleCard>
                <RoleCard 
                  selected={formData.role === 'artist'}
                  onClick={() => handleRoleSelect('artist')}
                >
                  <RoleTitle>Artist</RoleTitle>
                  <RoleDescription>
                    Upload and showcase your artwork. Share your creative vision with the world.
                  </RoleDescription>
                </RoleCard>
              </RoleContainer>
            </InputGroup>

            {formData.role === 'artist' && (
              <InputGroup>
                <Label htmlFor="bio">Artist Bio</Label>
                <VictorianTextarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about your artistic journey and style..."
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </InputGroup>
            )}

            <InputGroup>
              <Label htmlFor="password">Password *</Label>
              <VictorianInput
                id="password"
                name="password"
                type="password"
                placeholder="Choose a secure password (min. 8 characters)"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <VictorianInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </InputGroup>

            <VictorianButton
              type="submit"
              variant="accent"
              size="large"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Join the Gallery'}
            </VictorianButton>
          </Form>

          <LinksContainer>
            <StyledLink to="/login">
              Already have an account? Sign in here
            </StyledLink>
          </LinksContainer>
        </RegisterCard>
      </VictorianContainer>
    </RegisterContainer>
  );
};

export default Register;
