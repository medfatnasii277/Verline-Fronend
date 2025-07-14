import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { victorianTheme } from '../theme/victorianTheme';
import { VictorianContainer, VictorianCard, VictorianHeading, VictorianButton } from '../theme/styledComponents';

const DemoContainer = styled(VictorianContainer)`
  padding: ${victorianTheme.spacing.xl} 0;
`;

const InfoCard = styled(VictorianCard)`
  margin-bottom: ${victorianTheme.spacing.lg};
  text-align: center;
`;

const RoleInfo = styled.div`
  padding: ${victorianTheme.spacing.lg};
  background: ${victorianTheme.colors.accent}20;
  border-radius: ${victorianTheme.borderRadius.medium};
  margin: ${victorianTheme.spacing.lg} 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${victorianTheme.spacing.md};
  justify-content: center;
  margin: ${victorianTheme.spacing.lg} 0;
`;

const FeatureList = styled.ul`
  text-align: left;
  margin: ${victorianTheme.spacing.md} 0;
  
  li {
    margin: ${victorianTheme.spacing.sm} 0;
    color: ${victorianTheme.colors.textPrimary};
  }
`;

const Demo: React.FC = () => {
  const { user, isArtist } = useAuth();

  return (
    <DemoContainer>
      <VictorianHeading level={1} decorative style={{ textAlign: 'center', marginBottom: victorianTheme.spacing.xl }}>
        Victorian Art Gallery Demo
      </VictorianHeading>

      <InfoCard elevated>
        <VictorianHeading level={2}>Welcome to the Gallery!</VictorianHeading>
        <p style={{ 
          fontFamily: victorianTheme.typography.bodyFont,
          color: victorianTheme.colors.textSecondary,
          margin: `${victorianTheme.spacing.md} 0`
        }}>
          Welcome to our Victorian Art Gallery platform! Your experience is tailored based on your role.
          Explore the features available to you as a {user?.role}.
        </p>

        <RoleInfo>
          <strong>Logged in as: {user?.full_name} ({user?.role})</strong>
          <br />
          <small>Username: {user?.username} | User ID: {user?.id}</small>
        </RoleInfo>
      </InfoCard>

      {isArtist && (
        <VictorianCard elevated>
          <VictorianHeading level={3}>Artist Features</VictorianHeading>
          <FeatureList>
            <li>✨ Upload and manage your artwork</li>
            <li>🎨 Create and organize art categories</li>
            <li>📊 View statistics about your paintings</li>
            <li>💬 Respond to comments on your work</li>
            <li>🎯 Access specialized artist tools</li>
          </FeatureList>
          <p style={{ 
            fontFamily: victorianTheme.typography.bodyFont,
            color: victorianTheme.colors.textMuted,
            fontStyle: 'italic'
          }}>
            In the navigation bar, you'll see "My Artwork" and "Upload Art" links.
          </p>
        </VictorianCard>
      )}

      {!isArtist && (
        <VictorianCard elevated>
          <VictorianHeading level={3}>Art Enthusiast Features</VictorianHeading>
          <FeatureList>
            <li>🖼️ Browse and discover amazing artworks</li>
            <li>⭐ Rate paintings and share your opinion</li>
            <li>💬 Leave comments and engage with artists</li>
            <li>🔍 Search and filter by categories</li>
            <li>❤️ Create a personalized art experience</li>
          </FeatureList>
          <p style={{ 
            fontFamily: victorianTheme.typography.bodyFont,
            color: victorianTheme.colors.textMuted,
            fontStyle: 'italic'
          }}>
            Explore the gallery and interact with the art community!
          </p>
        </VictorianCard>
      )}

      <VictorianCard elevated>
        <VictorianHeading level={3}>Demo Information</VictorianHeading>
        <p style={{ 
          fontFamily: victorianTheme.typography.bodyFont,
          color: victorianTheme.colors.textPrimary,
          marginBottom: victorianTheme.spacing.md
        }}>
          <strong>No Authentication Required:</strong> All API endpoints are accessible without tokens.
          User IDs are passed as parameters where needed.
        </p>
        <p style={{ 
          fontFamily: victorianTheme.typography.bodyFont,
          color: victorianTheme.colors.textPrimary,
          marginBottom: victorianTheme.spacing.md
        }}>
          <strong>Role-Based Interface:</strong> The UI adapts based on your selected role, 
          showing different features and navigation options.
        </p>
        <p style={{ 
          fontFamily: victorianTheme.typography.bodyFont,
          color: victorianTheme.colors.textMuted,
          fontSize: victorianTheme.typography.small
        }}>
          Backend running on: http://localhost:8000
          <br />
          API Documentation: http://localhost:8000/docs
        </p>
      </VictorianCard>
    </DemoContainer>
  );
};

export default Demo;
