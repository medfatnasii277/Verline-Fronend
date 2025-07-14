import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { victorianTheme } from '../theme/victorianTheme';
import { 
  VictorianContainer, 
  VictorianCard, 
  VictorianHeading, 
  VictorianButton,
  VictorianSpinner
} from '../theme/styledComponents';
import { useAuth } from '../contexts/AuthContext';
import { paintingsAPI, type Painting } from '../services/api';

const MyPaintingsContainer = styled(VictorianContainer)`
  padding-top: ${victorianTheme.spacing.xl};
  padding-bottom: ${victorianTheme.spacing.xl};
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${victorianTheme.spacing.xl};
  
  @media (max-width: ${victorianTheme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${victorianTheme.spacing.lg};
    text-align: center;
  }
`;

const PaintingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${victorianTheme.spacing.lg};
  margin-bottom: ${victorianTheme.spacing.xl};
`;

const PaintingCard = styled(VictorianCard)`
  position: relative;
  transition: all ${victorianTheme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const PaintingImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: ${victorianTheme.borderRadius.medium};
  margin-bottom: ${victorianTheme.spacing.md};
`;

const PaintingTitle = styled.h3`
  font-family: ${victorianTheme.typography.decorativeFont};
  font-size: ${victorianTheme.typography.h5};
  color: ${victorianTheme.colors.textPrimary};
  margin-bottom: ${victorianTheme.spacing.sm};
`;

const PaintingInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${victorianTheme.spacing.sm};
`;

const CategoryBadge = styled.span`
  background: ${victorianTheme.colors.accent};
  color: ${victorianTheme.colors.background};
  padding: ${victorianTheme.spacing.xs} ${victorianTheme.spacing.sm};
  border-radius: ${victorianTheme.borderRadius.small};
  font-family: ${victorianTheme.typography.bodyFont};
  font-size: ${victorianTheme.typography.small};
  font-weight: ${victorianTheme.typography.semibold};
`;

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${victorianTheme.spacing.xs};
  color: ${victorianTheme.colors.accent};
`;

const Star = styled.span<{ filled: boolean }>`
  color: ${props => props.filled ? victorianTheme.colors.accent : victorianTheme.colors.textMuted};
  font-size: 1.1em;
`;

const PaintingDescription = styled.p`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textMuted};
  font-size: ${victorianTheme.typography.small};
  line-height: 1.5;
  margin-bottom: ${victorianTheme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${victorianTheme.spacing.sm};
  justify-content: flex-end;
`;

const StatusIndicator = styled.div<{ status: 'active' | 'pending' | 'rejected' }>`
  position: absolute;
  top: ${victorianTheme.spacing.sm};
  right: ${victorianTheme.spacing.sm};
  padding: ${victorianTheme.spacing.xs} ${victorianTheme.spacing.sm};
  border-radius: ${victorianTheme.borderRadius.small};
  font-family: ${victorianTheme.typography.bodyFont};
  font-size: ${victorianTheme.typography.tiny};
  font-weight: ${victorianTheme.typography.semibold};
  text-transform: uppercase;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: ${victorianTheme.colors.success};
          color: white;
        `;
      case 'pending':
        return `
          background: ${victorianTheme.colors.warning};
          color: white;
        `;
      case 'rejected':
        return `
          background: ${victorianTheme.colors.error};
          color: white;
        `;
      default:
        return `
          background: ${victorianTheme.colors.textMuted};
          color: white;
        `;
    }
  }}
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${victorianTheme.spacing.xxxl};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${victorianTheme.spacing.xxxl};
`;

const EmptyStateText = styled.p`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textMuted};
  font-size: ${victorianTheme.typography.h6};
  margin-bottom: ${victorianTheme.spacing.lg};
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: ${victorianTheme.colors.error};
  font-family: ${victorianTheme.typography.bodyFont};
  padding: ${victorianTheme.spacing.lg};
`;

const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${victorianTheme.spacing.lg};
  margin-bottom: ${victorianTheme.spacing.xl};
`;

const StatCard = styled(VictorianCard)`
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

const MyPaintings: React.FC = () => {
  const { user } = useAuth();
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    totalRatings: 0,
    totalComments: 0
  });

  useEffect(() => {
    fetchMyPaintings();
  }, [user?.id]); // Re-fetch when user changes

  const fetchMyPaintings = async () => {
    if (!user?.id) {
      setError('You must be logged in to view your paintings.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await paintingsAPI.getMyPaintings({
        page: 1,
        limit: 50, // Respect backend limit constraint
        artist_id: user.id
      });
      setPaintings(response.items);
      
      // Calculate stats
      const total = response.items.length;
      const totalRatings = response.items.reduce((sum, p) => sum + (p.rating_count || 0), 0);
      const totalComments = response.items.reduce((sum, p) => sum + (p.comment_count || 0), 0);
      const weightedSum = response.items.reduce((sum, p) => 
        sum + (p.average_rating || 0) * (p.rating_count || 0), 0
      );
      const averageRating = totalRatings > 0 ? weightedSum / totalRatings : 0;
      
      setStats({
        total,
        averageRating,
        totalRatings,
        totalComments
      });
      
      setError('');
    } catch (err: any) {
      setError('Failed to fetch your paintings. Please try again.');
      console.error('Failed to fetch paintings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePainting = async (paintingId: number) => {
    if (!window.confirm('Are you sure you want to delete this painting? This action cannot be undone.')) {
      return;
    }
    
    try {
      await paintingsAPI.deletePainting(paintingId);
      setPaintings(prev => prev.filter(p => p.id !== paintingId));
      
      // Update stats
      const deletedPainting = paintings.find(p => p.id === paintingId);
      if (deletedPainting) {
        setStats(prev => ({
          total: prev.total - 1,
          totalRatings: prev.totalRatings - (deletedPainting.rating_count || 0),
          totalComments: prev.totalComments - (deletedPainting.comment_count || 0),
          averageRating: prev.totalRatings > (deletedPainting.rating_count || 0) 
            ? ((prev.averageRating * prev.totalRatings) - (deletedPainting.average_rating || 0) * (deletedPainting.rating_count || 0)) / (prev.totalRatings - (deletedPainting.rating_count || 0))
            : 0
        }));
      }
    } catch (err: any) {
      setError('Failed to delete painting. Please try again.');
      console.error('Failed to delete painting:', err);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} filled={index < Math.round(rating)}>
        ★
      </Star>
    ));
  };

  if (loading) {
    return (
      <MyPaintingsContainer>
        <LoadingContainer>
          <VictorianSpinner />
        </LoadingContainer>
      </MyPaintingsContainer>
    );
  }

  return (
    <MyPaintingsContainer>
      <HeaderSection>
        <VictorianHeading level={1} decorative>
          My Paintings
        </VictorianHeading>
        <VictorianButton as={Link} to="/upload" variant="accent" size="large">
          Upload New Painting
        </VictorianButton>
      </HeaderSection>

      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}

      {/* Statistics */}
      {paintings.length > 0 && (
        <StatsCards>
          <StatCard elevated>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Paintings</StatLabel>
          </StatCard>
          <StatCard elevated>
            <StatValue>{stats.averageRating.toFixed(1)}</StatValue>
            <StatLabel>Average Rating</StatLabel>
          </StatCard>
          <StatCard elevated>
            <StatValue>{stats.totalRatings}</StatValue>
            <StatLabel>Total Ratings</StatLabel>
          </StatCard>
          <StatCard elevated>
            <StatValue>{stats.totalComments}</StatValue>
            <StatLabel>Total Comments</StatLabel>
          </StatCard>
        </StatsCards>
      )}

      {/* Paintings Grid */}
      {paintings.length > 0 ? (
        <PaintingsGrid>
          {paintings.map(painting => (
            <PaintingCard key={painting.id} elevated>
              <StatusIndicator status="active">Published</StatusIndicator>
              
              <PaintingImage 
                src={painting.image_url} 
                alt={painting.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x250?text=Image+Not+Found';
                }}
              />
              
              <PaintingTitle>{painting.title}</PaintingTitle>
              
              <PaintingInfo>
                <CategoryBadge>{painting.category_name}</CategoryBadge>
                <RatingDisplay>
                  {renderStars(painting.average_rating || 0)}
                  <span>({painting.rating_count || 0})</span>
                </RatingDisplay>
              </PaintingInfo>
              
              <PaintingDescription>{painting.description}</PaintingDescription>
              
              <ActionButtons>
                <VictorianButton 
                  as={Link} 
                  to={`/paintings/${painting.id}`}
                  variant="outline"
                  size="small"
                >
                  View
                </VictorianButton>
                <VictorianButton 
                  onClick={() => handleDeletePainting(painting.id)}
                  variant="outline"
                  size="small"
                  style={{ 
                    borderColor: victorianTheme.colors.error,
                    color: victorianTheme.colors.error 
                  }}
                >
                  Delete
                </VictorianButton>
              </ActionButtons>
            </PaintingCard>
          ))}
        </PaintingsGrid>
      ) : (
        <EmptyState>
          <EmptyStateText>
            You haven't uploaded any paintings yet.
          </EmptyStateText>
          <VictorianButton as={Link} to="/upload" variant="accent" size="large">
            Upload Your First Painting
          </VictorianButton>
        </EmptyState>
      )}
    </MyPaintingsContainer>
  );
};

export default MyPaintings;
