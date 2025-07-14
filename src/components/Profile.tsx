import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { victorianTheme } from '../theme/victorianTheme';
import { 
  VictorianContainer, 
  VictorianCard, 
  VictorianHeading, 
  VictorianButton,
  VictorianInput,
  VictorianTextarea
} from '../theme/styledComponents';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';

const ProfileContainer = styled(VictorianContainer)`
  padding-top: ${victorianTheme.spacing.xl};
  padding-bottom: ${victorianTheme.spacing.xl};
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${victorianTheme.spacing.xl};
  
  @media (max-width: ${victorianTheme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled(VictorianCard)`
  height: fit-content;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: ${victorianTheme.spacing.lg};
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${victorianTheme.borderRadius.round};
  background: linear-gradient(135deg, ${victorianTheme.colors.accent}, ${victorianTheme.colors.gold});
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${victorianTheme.typography.decorativeFont};
  font-size: 3rem;
  font-weight: ${victorianTheme.typography.bold};
  color: ${victorianTheme.colors.background};
  margin: 0 auto ${victorianTheme.spacing.md};
  box-shadow: ${victorianTheme.shadows.large};
`;

const UserName = styled.h2`
  font-family: ${victorianTheme.typography.decorativeFont};
  color: ${victorianTheme.colors.textPrimary};
  margin-bottom: ${victorianTheme.spacing.sm};
`;

const UserRole = styled.div`
  display: inline-block;
  background: ${victorianTheme.colors.accent};
  color: ${victorianTheme.colors.background};
  padding: ${victorianTheme.spacing.xs} ${victorianTheme.spacing.sm};
  border-radius: ${victorianTheme.borderRadius.small};
  font-family: ${victorianTheme.typography.bodyFont};
  font-size: ${victorianTheme.typography.small};
  font-weight: ${victorianTheme.typography.semibold};
  text-transform: capitalize;
`;

const InfoSection = styled.div`
  margin-bottom: ${victorianTheme.spacing.lg};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${victorianTheme.spacing.sm} 0;
  border-bottom: 1px solid ${victorianTheme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-family: ${victorianTheme.typography.bodyFont};
  font-weight: ${victorianTheme.typography.semibold};
  color: ${victorianTheme.colors.textSecondary};
`;

const InfoValue = styled.span`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textPrimary};
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${victorianTheme.spacing.lg};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${victorianTheme.spacing.sm};
`;

const Label = styled.label`
  font-family: ${victorianTheme.typography.bodyFont};
  font-weight: ${victorianTheme.typography.semibold};
  color: ${victorianTheme.colors.textPrimary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${victorianTheme.spacing.md};
  justify-content: flex-end;
`;

const ErrorMessage = styled.div`
  color: ${victorianTheme.colors.error};
  font-family: ${victorianTheme.typography.bodyFont};
  font-size: ${victorianTheme.typography.small};
  margin-top: ${victorianTheme.spacing.xs};
`;

const SuccessMessage = styled.div`
  color: ${victorianTheme.colors.success};
  font-family: ${victorianTheme.typography.bodyFont};
  text-align: center;
  padding: ${victorianTheme.spacing.md};
  background: ${victorianTheme.colors.success}20;
  border-radius: ${victorianTheme.borderRadius.medium};
  margin-bottom: ${victorianTheme.spacing.lg};
`;

const StatsCard = styled(VictorianCard)`
  margin-top: ${victorianTheme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${victorianTheme.spacing.lg};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: ${victorianTheme.typography.decorativeFont};
  font-size: ${victorianTheme.typography.h3};
  font-weight: ${victorianTheme.typography.bold};
  color: ${victorianTheme.colors.accent};
  margin-bottom: ${victorianTheme.spacing.xs};
`;

const StatLabel = styled.div`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textSecondary};
  font-size: ${victorianTheme.typography.small};
`;

interface UserUpdateForm {
  full_name: string;
  email: string;
  bio: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userStats, setUserStats] = useState({
    paintingsCount: 0,
    totalRatings: 0,
    averageRating: 0
  });
  
  const [formData, setFormData] = useState<UserUpdateForm>({
    full_name: user?.full_name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  const fetchUserStats = useCallback(async () => {
    if (!user) return;
    try {
      const stats = await usersAPI.getUserStats(user.id);
      setUserStats(stats);
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        bio: user.bio || ''
      });
      
      // Fetch user statistics if they're an artist
      if (user.role === 'artist') {
        fetchUserStats();
      }
    }
  }, [user, fetchUserStats]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const updatedUser = await usersAPI.updateProfile({
        id: user.id,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        bio: formData.bio.trim()
      });
      
      updateUser(updatedUser);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      email: user?.email || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
    setError('');
    setSuccessMessage('');
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <ProfileContainer>
        <VictorianCard elevated>
          <p style={{ 
            textAlign: 'center', 
            fontFamily: victorianTheme.typography.bodyFont,
            color: victorianTheme.colors.textMuted 
          }}>
            Please log in to view your profile.
          </p>
        </VictorianCard>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <VictorianHeading level={1} decorative style={{ textAlign: 'center', marginBottom: victorianTheme.spacing.xl }}>
        My Profile
      </VictorianHeading>
      
      {successMessage && (
        <SuccessMessage>{successMessage}</SuccessMessage>
      )}
      
      <ProfileGrid>
        {/* Profile Info Card */}
        <ProfileCard elevated>
          <ProfileHeader>
            <Avatar>
              {getInitials(user.full_name || user.username)}
            </Avatar>
            <UserName>{user.full_name || user.username}</UserName>
            <UserRole>{user.role}</UserRole>
          </ProfileHeader>
          
          <InfoSection>
            <InfoRow>
              <InfoLabel>Username:</InfoLabel>
              <InfoValue>{user.username}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>{user.email}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Member since:</InfoLabel>
              <InfoValue>{formatDate(user.created_at)}</InfoValue>
            </InfoRow>
            {user.bio && (
              <InfoRow>
                <InfoLabel>Bio:</InfoLabel>
                <InfoValue style={{ fontStyle: 'italic' }}>{user.bio}</InfoValue>
              </InfoRow>
            )}
          </InfoSection>
          
          {!isEditing && (
            <VictorianButton 
              onClick={() => setIsEditing(true)}
              variant="accent"
              style={{ width: '100%' }}
            >
              Edit Profile
            </VictorianButton>
          )}
          
          {/* Stats for artists */}
          {user.role === 'artist' && (
            <StatsCard elevated>
              <VictorianHeading level={4} style={{ marginBottom: victorianTheme.spacing.md }}>
                Statistics
              </VictorianHeading>
              <StatsGrid>
                <StatItem>
                  <StatValue>{userStats.paintingsCount}</StatValue>
                  <StatLabel>Paintings</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{userStats.totalRatings}</StatValue>
                  <StatLabel>Total Ratings</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{userStats.averageRating.toFixed(1)}</StatValue>
                  <StatLabel>Avg Rating</StatLabel>
                </StatItem>
              </StatsGrid>
            </StatsCard>
          )}
        </ProfileCard>

        {/* Edit Form */}
        {isEditing && (
          <VictorianCard elevated>
            <VictorianHeading level={3} style={{ marginBottom: victorianTheme.spacing.lg }}>
              Edit Profile
            </VictorianHeading>
            
            {error && (
              <ErrorMessage style={{ marginBottom: victorianTheme.spacing.lg }}>
                {error}
              </ErrorMessage>
            )}
            
            <EditForm onSubmit={handleSubmit}>
              <InputGroup>
                <Label htmlFor="full_name">Full Name</Label>
                <VictorianInput
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="email">Email</Label>
                <VictorianInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="bio">Bio</Label>
                <VictorianTextarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </InputGroup>

              <ButtonGroup>
                <VictorianButton
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancel
                </VictorianButton>
                <VictorianButton
                  type="submit"
                  variant="accent"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </VictorianButton>
              </ButtonGroup>
            </EditForm>
          </VictorianCard>
        )}
        
        {/* Show profile info when not editing */}
        {!isEditing && (
          <VictorianCard elevated>
            <VictorianHeading level={3} style={{ marginBottom: victorianTheme.spacing.lg }}>
              About Me
            </VictorianHeading>
            
            {user.bio ? (
              <p style={{ 
                fontFamily: victorianTheme.typography.bodyFont,
                color: victorianTheme.colors.textPrimary,
                lineHeight: 1.6,
                fontStyle: 'italic'
              }}>
                "{user.bio}"
              </p>
            ) : (
              <p style={{ 
                fontFamily: victorianTheme.typography.bodyFont,
                color: victorianTheme.colors.textMuted,
                fontStyle: 'italic'
              }}>
                No bio available. Click "Edit Profile" to add one.
              </p>
            )}
          </VictorianCard>
        )}
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default Profile;
