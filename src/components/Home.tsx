import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  VictorianCard, 
  VictorianButton, 
  VictorianHeading,
  VictorianContainer,
  VictorianSpinner
} from '../theme/styledComponents';
import { victorianTheme } from '../theme/victorianTheme';
import { paintingsAPI, Painting } from '../services/api';

const HomeContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, ${victorianTheme.colors.background} 0%, ${victorianTheme.colors.primary} 100%);
`;

const HeroSection = styled.section`
  padding: ${victorianTheme.spacing.xxxl} 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 50%, ${victorianTheme.colors.accent}10 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, ${victorianTheme.colors.gold}10 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, ${victorianTheme.colors.secondary}10 0%, transparent 50%);
    z-index: 0;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled(VictorianHeading)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: ${victorianTheme.spacing.lg};
  background: linear-gradient(135deg, ${victorianTheme.colors.textPrimary}, ${victorianTheme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-family: ${victorianTheme.typography.bodyFont};
  font-size: ${victorianTheme.typography.h5};
  color: ${victorianTheme.colors.textMuted};
  margin-bottom: ${victorianTheme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-style: italic;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${victorianTheme.spacing.lg};
  justify-content: center;
  margin-bottom: ${victorianTheme.spacing.xxxl};
  
  @media (max-width: ${victorianTheme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const FeaturedSection = styled.section`
  padding: ${victorianTheme.spacing.xxxl} 0;
  background: linear-gradient(135deg, ${victorianTheme.colors.primary}40, ${victorianTheme.colors.secondary}20);
`;

const SectionTitle = styled(VictorianHeading)`
  text-align: center;
  margin-bottom: ${victorianTheme.spacing.xl};
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${victorianTheme.spacing.xl};
  margin-bottom: ${victorianTheme.spacing.xl};
`;

const PaintingCard = styled(VictorianCard)`
  text-align: center;
  overflow: hidden;
  transition: all ${victorianTheme.transitions.slow};
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
  }
`;

const PaintingImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: ${victorianTheme.borderRadius.medium};
  margin-bottom: ${victorianTheme.spacing.md};
  transition: all ${victorianTheme.transitions.normal};
  
  &:hover {
    transform: scale(1.05);
  }
`;

const PaintingTitle = styled.h3`
  font-family: ${victorianTheme.typography.decorativeFont};
  font-size: ${victorianTheme.typography.h5};
  color: ${victorianTheme.colors.textPrimary};
  margin-bottom: ${victorianTheme.spacing.sm};
`;

const PaintingArtist = styled.p`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.accent};
  font-style: italic;
  margin-bottom: ${victorianTheme.spacing.sm};
`;

const PaintingStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${victorianTheme.spacing.md};
  padding-top: ${victorianTheme.spacing.md};
  border-top: 1px solid ${victorianTheme.colors.border};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${victorianTheme.spacing.xs};
  font-size: ${victorianTheme.typography.small};
  color: ${victorianTheme.colors.textMuted};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: ${victorianTheme.colors.textMuted};
  font-style: italic;
  padding: ${victorianTheme.spacing.xl};
`;

const StatsSection = styled.section`
  padding: ${victorianTheme.spacing.xl} 0;
  background: ${victorianTheme.colors.surface};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${victorianTheme.spacing.lg};
`;

const StatCard = styled(VictorianCard)`
  text-align: center;
  padding: ${victorianTheme.spacing.xl};
`;

const StatNumber = styled.div`
  font-family: ${victorianTheme.typography.decorativeFont};
  font-size: ${victorianTheme.typography.h2};
  font-weight: ${victorianTheme.typography.bold};
  color: ${victorianTheme.colors.accent};
  margin-bottom: ${victorianTheme.spacing.sm};
`;

const StatLabel = styled.div`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: ${victorianTheme.typography.small};
`;

const Home: React.FC = () => {
  const [featuredPaintings, setFeaturedPaintings] = useState<Painting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFeaturedPaintings = async () => {
      try {
        setIsLoading(true);
        const paintings = await paintingsAPI.getFeaturedPaintings();
        setFeaturedPaintings(paintings);
      } catch (err: any) {
        console.error('Failed to load featured paintings:', err);
        setError('Failed to load featured artwork');
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedPaintings();
  }, []);

  return (
    <HomeContainer>
      {/* Hero Section */}
      <HeroSection>
        <VictorianContainer>
          <HeroContent>
            <HeroTitle as="h1" decorative>
              Victorian Gallery
            </HeroTitle>
            <HeroSubtitle>
              Where timeless artistry meets modern appreciation. Discover masterpieces, 
              connect with talented artists, and immerse yourself in the world of fine art.
            </HeroSubtitle>
            <HeroButtons>
              <VictorianButton as={Link} to="/gallery" variant="accent" size="large">
                Explore Gallery
              </VictorianButton>
              <VictorianButton as={Link} to="/register" variant="outline" size="large">
                Join Community
              </VictorianButton>
            </HeroButtons>
          </HeroContent>
        </VictorianContainer>
      </HeroSection>

      {/* Featured Paintings Section */}
      <FeaturedSection>
        <VictorianContainer>
          <SectionTitle level={2} decorative>
            Featured Masterpieces
          </SectionTitle>
          
          {isLoading ? (
            <LoadingContainer>
              <VictorianSpinner />
            </LoadingContainer>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : featuredPaintings.length === 0 ? (
            <ErrorMessage>No featured paintings available at the moment.</ErrorMessage>
          ) : (
            <>
              <FeaturedGrid>
                {featuredPaintings.map((painting) => (
                  <PaintingCard key={painting.id} elevated>
                    <Link to={`/paintings/${painting.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <PaintingImage
                        src={painting.image_url}
                        alt={painting.title}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/300x250?text=Image+Not+Found';
                        }}
                      />
                      <PaintingTitle>{painting.title}</PaintingTitle>
                      <PaintingArtist>by {painting.artist_name}</PaintingArtist>
                      <PaintingStats>
                        <StatItem>
                          ⭐ {painting.average_rating?.toFixed(1) || 'N/A'}
                        </StatItem>
                        <StatItem>
                          💬 {painting.comment_count || 0}
                        </StatItem>
                        <StatItem>
                          📅 {painting.year || 'Unknown'}
                        </StatItem>
                      </PaintingStats>
                    </Link>
                  </PaintingCard>
                ))}
              </FeaturedGrid>
              <div style={{ textAlign: 'center' }}>
                <VictorianButton as={Link} to="/gallery" variant="primary" size="large">
                  View All Artwork
                </VictorianButton>
              </div>
            </>
          )}
        </VictorianContainer>
      </FeaturedSection>

      {/* Statistics Section */}
      <StatsSection>
        <VictorianContainer>
          <SectionTitle level={2} decorative>
            Gallery at a Glance
          </SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>500+</StatNumber>
              <StatLabel>Masterpieces</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>150+</StatNumber>
              <StatLabel>Artists</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>2000+</StatNumber>
              <StatLabel>Art Lovers</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>50+</StatNumber>
              <StatLabel>Categories</StatLabel>
            </StatCard>
          </StatsGrid>
        </VictorianContainer>
      </StatsSection>
    </HomeContainer>
  );
};

export default Home;
