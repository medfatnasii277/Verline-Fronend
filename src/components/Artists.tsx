import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { victorianTheme } from '../theme/victorianTheme';
import { 
  VictorianContainer, 
  VictorianCard, 
  VictorianHeading, 
  VictorianSpinner
} from '../theme/styledComponents';
import { usersAPI, paintingsAPI, type User, type Painting } from '../services/api';

const ArtistsContainer = styled(VictorianContainer)`
  padding-top: ${victorianTheme.spacing.xl};
  padding-bottom: ${victorianTheme.spacing.xl};
`;

const ArtistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${victorianTheme.spacing.lg};
`;

const ArtistCard = styled(VictorianCard)`
  text-align: center;
  transition: all ${victorianTheme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: ${victorianTheme.borderRadius.round};
  background: linear-gradient(135deg, ${victorianTheme.colors.accent}, ${victorianTheme.colors.gold});
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${victorianTheme.typography.decorativeFont};
  font-size: 2.5rem;
  font-weight: ${victorianTheme.typography.bold};
  color: ${victorianTheme.colors.background};
  margin: 0 auto ${victorianTheme.spacing.md};
  box-shadow: ${victorianTheme.shadows.medium};
`;

const ArtistName = styled.h3`
  font-family: ${victorianTheme.typography.decorativeFont};
  font-size: ${victorianTheme.typography.h5};
  color: ${victorianTheme.colors.textPrimary};
  margin-bottom: ${victorianTheme.spacing.sm};
`;

const ArtistBio = styled.p`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textMuted};
  font-size: ${victorianTheme.typography.small};
  line-height: 1.5;
  margin-bottom: ${victorianTheme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-style: italic;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${victorianTheme.spacing.md};
  padding: ${victorianTheme.spacing.md} 0;
  border-top: 1px solid ${victorianTheme.colors.border};
  border-bottom: 1px solid ${victorianTheme.colors.border};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: ${victorianTheme.typography.decorativeFont};
  font-size: ${victorianTheme.typography.h6};
  font-weight: ${victorianTheme.typography.bold};
  color: ${victorianTheme.colors.accent};
`;

const StatLabel = styled.div`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textSecondary};
  font-size: ${victorianTheme.typography.tiny};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ArtworkPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${victorianTheme.spacing.xs};
  margin-bottom: ${victorianTheme.spacing.md};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 60px;
  object-fit: cover;
  border-radius: ${victorianTheme.borderRadius.small};
  cursor: pointer;
  transition: transform ${victorianTheme.transitions.fast};
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ViewProfileLink = styled(Link)`
  display: inline-block;
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.accent};
  text-decoration: none;
  font-weight: ${victorianTheme.typography.semibold};
  padding: ${victorianTheme.spacing.sm} ${victorianTheme.spacing.md};
  border: 2px solid ${victorianTheme.colors.accent};
  border-radius: ${victorianTheme.borderRadius.medium};
  transition: all ${victorianTheme.transitions.normal};
  
  &:hover {
    background: ${victorianTheme.colors.accent};
    color: ${victorianTheme.colors.background};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${victorianTheme.spacing.xxxl};
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: ${victorianTheme.colors.error};
  font-family: ${victorianTheme.typography.bodyFont};
  padding: ${victorianTheme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${victorianTheme.spacing.xxxl};
`;

const EmptyStateText = styled.p`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textMuted};
  font-size: ${victorianTheme.typography.h6};
  font-style: italic;
`;

interface ArtistWithStats extends User {
  paintingsCount: number;
  averageRating: number;
  totalRatings: number;
  recentPaintings: Painting[];
}

const Artists: React.FC = () => {
  const [artists, setArtists] = useState<ArtistWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      // Fetch all artists using the direct API call
      const response = await usersAPI.getUsers({
        page: 1,
        limit: 50,
        role: 'artist'
      });
      
      // The API returns an array directly
      const artists: User[] = response;
      
      // Fetch additional data for each artist
      const artistsWithStats = await Promise.all(
        artists.map(async (artist: User) => {
          try {
            // Get artist's paintings
            const paintingsResponse = await paintingsAPI.getPaintings({
              page: 1,
              limit: 3, // Get only recent paintings for preview
              artist_id: artist.id
            });
            
            // Get artist stats
            const stats = await usersAPI.getUserStats(artist.id);
            
            return {
              ...artist,
              paintingsCount: stats.paintingsCount,
              averageRating: stats.averageRating,
              totalRatings: stats.totalRatings,
              recentPaintings: paintingsResponse.items
            };
          } catch (err) {
            console.error(`Failed to fetch data for artist ${artist.id}:`, err);
            return {
              ...artist,
              paintingsCount: 0,
              averageRating: 0,
              totalRatings: 0,
              recentPaintings: []
            };
          }
        })
      );
      
      // Sort by number of paintings (most active first)
      artistsWithStats.sort((a, b) => b.paintingsCount - a.paintingsCount);
      
      setArtists(artistsWithStats);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch artists. Please try again.');
      console.error('Failed to fetch artists:', err);
    } finally {
      setLoading(false);
    }
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
      month: 'long'
    });
  };

  if (loading) {
    return (
      <ArtistsContainer>
        <LoadingContainer>
          <VictorianSpinner />
        </LoadingContainer>
      </ArtistsContainer>
    );
  }

  return (
    <ArtistsContainer>
      <VictorianHeading level={1} decorative style={{ textAlign: 'center', marginBottom: victorianTheme.spacing.xl }}>
        Featured Artists
      </VictorianHeading>
      
      <p style={{ 
        textAlign: 'center',
        fontFamily: victorianTheme.typography.bodyFont,
        color: victorianTheme.colors.textMuted,
        fontStyle: 'italic',
        marginBottom: victorianTheme.spacing.xl
      }}>
        Discover the talented painters who bring our gallery to life
      </p>

      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}

      {artists.length > 0 ? (
        <ArtistsGrid>
          {artists.map(artist => (
            <ArtistCard key={artist.id} elevated>
              <Avatar>
                {getInitials(artist.full_name || artist.username)}
              </Avatar>
              
              <ArtistName>{artist.full_name || artist.username}</ArtistName>
              
              {artist.bio && (
                <ArtistBio>"{artist.bio}"</ArtistBio>
              )}
              
              <StatsContainer>
                <StatItem>
                  <StatValue>{artist.paintingsCount}</StatValue>
                  <StatLabel>Paintings</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{artist.averageRating.toFixed(1)}</StatValue>
                  <StatLabel>Avg Rating</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{artist.totalRatings}</StatValue>
                  <StatLabel>Reviews</StatLabel>
                </StatItem>
              </StatsContainer>
              
              {artist.recentPaintings.length > 0 && (
                <ArtworkPreview>
                  {artist.recentPaintings.map(painting => (
                    <Link key={painting.id} to={`/paintings/${painting.id}`}>
                      <PreviewImage 
                        src={painting.image_url} 
                        alt={painting.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60x60?text=?';
                        }}
                      />
                    </Link>
                  ))}
                  {/* Fill empty slots if less than 3 paintings */}
                  {Array.from({ length: 3 - artist.recentPaintings.length }, (_, index) => (
                    <div 
                      key={`empty-${index}`}
                      style={{
                        width: '100%',
                        height: '60px',
                        background: victorianTheme.colors.border,
                        borderRadius: victorianTheme.borderRadius.small,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: victorianTheme.colors.textMuted,
                        fontSize: '24px'
                      }}
                    >
                      ?
                    </div>
                  ))}
                </ArtworkPreview>
              )}
              
              <p style={{ 
                fontFamily: victorianTheme.typography.bodyFont,
                color: victorianTheme.colors.textSecondary,
                fontSize: victorianTheme.typography.small,
                marginBottom: victorianTheme.spacing.md
              }}>
                Member since {formatDate(artist.created_at)}
              </p>
              
              <ViewProfileLink to={`/gallery?artist=${artist.id}`}>
                View Artworks
              </ViewProfileLink>
            </ArtistCard>
          ))}
        </ArtistsGrid>
      ) : (
        <EmptyState>
          <EmptyStateText>
            No artists found. Be the first to join our community!
          </EmptyStateText>
        </EmptyState>
      )}
    </ArtistsContainer>
  );
};

export default Artists;
