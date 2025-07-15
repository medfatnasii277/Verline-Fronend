import React, { useState, useEffect, useCallback } from 'react';
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
import { paintingsAPI, categoriesAPI, type Painting, type Category } from '../services/api';

const GalleryContainer = styled(VictorianContainer)`
  padding-top: ${victorianTheme.spacing.xl};
  padding-bottom: ${victorianTheme.spacing.xl};
`;

const GalleryHeader = styled.div`
  text-align: center;
  margin-bottom: ${victorianTheme.spacing.xxl};
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: ${victorianTheme.spacing.md};
  margin-bottom: ${victorianTheme.spacing.xl};
  flex-wrap: wrap;
  align-items: center;
`;

const FilterSelect = styled.select`
  background: ${victorianTheme.colors.cardBg};
  border: 2px solid ${victorianTheme.colors.border};
  border-radius: ${victorianTheme.borderRadius.medium};
  padding: ${victorianTheme.spacing.sm} ${victorianTheme.spacing.md};
  color: ${victorianTheme.colors.textPrimary};
  font-family: ${victorianTheme.typography.bodyFont};
  
  &:focus {
    outline: none;
    border-color: ${victorianTheme.colors.accent};
    box-shadow: 0 0 0 2px ${victorianTheme.colors.accent}40;
  }
`;

const SearchInput = styled.input`
  background: ${victorianTheme.colors.cardBg};
  border: 2px solid ${victorianTheme.colors.border};
  border-radius: ${victorianTheme.borderRadius.medium};
  padding: ${victorianTheme.spacing.sm} ${victorianTheme.spacing.md};
  color: ${victorianTheme.colors.textPrimary};
  font-family: ${victorianTheme.typography.bodyFont};
  flex: 1;
  max-width: 300px;
  
  &::placeholder {
    color: ${victorianTheme.colors.textMuted};
  }
  
  &:focus {
    outline: none;
    border-color: ${victorianTheme.colors.accent};
    box-shadow: 0 0 0 2px ${victorianTheme.colors.accent}40;
  }
`;

const PaintingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${victorianTheme.spacing.lg};
  margin-bottom: ${victorianTheme.spacing.xl};
`;

const PaintingCard = styled(VictorianCard)`
  cursor: pointer;
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

const ArtistName = styled.span`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textSecondary};
  font-style: italic;
`;

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${victorianTheme.spacing.xs};
  color: ${victorianTheme.colors.accent};
`;

const Star = styled.span<{ filled: boolean }>`
  color: ${props => props.filled ? victorianTheme.colors.accent : victorianTheme.colors.textMuted};
  font-size: 1.2em;
`;

const PaintingDescription = styled.p`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textMuted};
  font-size: ${victorianTheme.typography.small};
  line-height: 1.5;
  margin-bottom: ${victorianTheme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${victorianTheme.spacing.sm};
  margin-top: ${victorianTheme.spacing.xl};
`;

const Gallery: React.FC = () => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPaintings();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      const categories = await categoriesAPI.getCategories({ page: 1, limit: 50 });
      setCategories(categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchPaintings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await paintingsAPI.getPaintings({
        page: currentPage,
        limit: 12,
        category_id: selectedCategory || undefined,
        search: searchTerm || undefined,
      });
      setPaintings(response.items);
      setTotalPages(response.pages);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch paintings. Please try again.');
      console.error('Failed to fetch paintings:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value === '' ? '' : Number(e.target.value));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} filled={index < Math.round(rating)}>
        ★
      </Star>
    ));
  };

  if (loading && paintings.length === 0) {
    return (
      <GalleryContainer>
        <LoadingContainer>
          <VictorianSpinner />
        </LoadingContainer>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <GalleryHeader>
        <VictorianHeading level={1} decorative>
          Art Gallery
        </VictorianHeading>
        <p style={{ 
          fontFamily: victorianTheme.typography.bodyFont,
          color: victorianTheme.colors.textMuted,
          fontStyle: 'italic'
        }}>
          Discover masterpieces from our talented artists
        </p>
      </GalleryHeader>

      <FiltersContainer>
        <SearchInput
          type="text"
          placeholder="Search paintings..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        <FilterSelect value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </FilterSelect>
      </FiltersContainer>

      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}

      <PaintingsGrid>
        {paintings.map(painting => (
          <PaintingCard key={painting.id} elevated>
            <Link to={`/paintings/${painting.id}`} style={{ textDecoration: 'none' }}>
              <PaintingImage 
                src={painting.image_url} 
                alt={painting.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x250?text=Image+Not+Found';
                }}
              />
              <PaintingTitle>{painting.title}</PaintingTitle>
              <PaintingInfo>
                <ArtistName>by {painting.artist_name}</ArtistName>
                <RatingDisplay>
                  {renderStars(painting.average_rating || 0)}
                  <span>({painting.rating_count || 0})</span>
                </RatingDisplay>
              </PaintingInfo>
              <PaintingDescription>{painting.description}</PaintingDescription>
            </Link>
          </PaintingCard>
        ))}
      </PaintingsGrid>

      {paintings.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: victorianTheme.spacing.xl }}>
          <p style={{ 
            fontFamily: victorianTheme.typography.bodyFont,
            color: victorianTheme.colors.textMuted 
          }}>
            No paintings found. {searchTerm || selectedCategory ? 'Try adjusting your filters.' : ''}
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <PaginationContainer>
          <VictorianButton 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </VictorianButton>
          
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: `0 ${victorianTheme.spacing.md}`,
            color: victorianTheme.colors.textPrimary,
            fontFamily: victorianTheme.typography.bodyFont
          }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <VictorianButton 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </VictorianButton>
        </PaginationContainer>
      )}
    </GalleryContainer>
  );
};

export default Gallery;
