import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { victorianTheme } from '../theme/victorianTheme';
import { 
  VictorianContainer, 
  VictorianCard, 
  VictorianHeading, 
  VictorianButton,
  VictorianTextarea,
  VictorianSpinner
} from '../theme/styledComponents';
import { useAuth } from '../contexts/AuthContext';
import { paintingsAPI, ratingsAPI, commentsAPI, type Painting, type Comment } from '../services/api';

const DetailContainer = styled(VictorianContainer)`
  padding-top: ${victorianTheme.spacing.xl};
  padding-bottom: ${victorianTheme.spacing.xl};
`;

const BackButton = styled(VictorianButton)`
  margin-bottom: ${victorianTheme.spacing.lg};
`;

const PaintingContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${victorianTheme.spacing.xl};
  margin-bottom: ${victorianTheme.spacing.xl};
  
  @media (max-width: ${victorianTheme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ImageContainer = styled.div`
  position: relative;
`;

const PaintingImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  border-radius: ${victorianTheme.borderRadius.large};
  box-shadow: ${victorianTheme.shadows.large};
`;

const InfoContainer = styled(VictorianCard)`
  height: fit-content;
`;

const PaintingTitle = styled(VictorianHeading)`
  margin-bottom: ${victorianTheme.spacing.md};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${victorianTheme.spacing.sm};
  padding-bottom: ${victorianTheme.spacing.sm};
  border-bottom: 1px solid ${victorianTheme.colors.border};
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

const Description = styled.p`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textPrimary};
  line-height: 1.6;
  margin-top: ${victorianTheme.spacing.md};
`;

const RatingSection = styled(VictorianCard)`
  margin-bottom: ${victorianTheme.spacing.xl};
`;

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${victorianTheme.spacing.sm};
  margin-bottom: ${victorianTheme.spacing.md};
`;

const StarContainer = styled.div`
  display: flex;
  gap: ${victorianTheme.spacing.xs};
`;

const Star = styled.button<{ filled: boolean; interactive?: boolean }>`
  background: none;
  border: none;
  font-size: 1.5em;
  color: ${props => props.filled ? victorianTheme.colors.accent : victorianTheme.colors.textMuted};
  cursor: ${props => props.interactive ? 'pointer' : 'default'};
  transition: color ${victorianTheme.transitions.fast};
  
  ${props => props.interactive && `
    &:hover {
      color: ${victorianTheme.colors.accent};
    }
  `}
`;

const RatingStats = styled.div`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textSecondary};
  margin-left: auto;
`;

const CommentsSection = styled(VictorianCard)``;

const CommentForm = styled.form`
  margin-bottom: ${victorianTheme.spacing.lg};
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${victorianTheme.spacing.md};
`;

const CommentCard = styled(VictorianCard)`
  background: ${victorianTheme.colors.surface};
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${victorianTheme.spacing.sm};
`;

const CommentAuthor = styled.span`
  font-family: ${victorianTheme.typography.bodyFont};
  font-weight: ${victorianTheme.typography.semibold};
  color: ${victorianTheme.colors.textPrimary};
`;

const CommentDate = styled.span`
  font-family: ${victorianTheme.typography.bodyFont};
  font-size: ${victorianTheme.typography.small};
  color: ${victorianTheme.colors.textMuted};
`;

const CommentText = styled.p`
  font-family: ${victorianTheme.typography.bodyFont};
  color: ${victorianTheme.colors.textPrimary};
  line-height: 1.5;
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

const PaintingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [painting, setPainting] = useState<Painting | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState('');

  const fetchPaintingDetails = useCallback(async () => {
    try {
      const paintingData = await paintingsAPI.getPainting(Number(id));
      setPainting(paintingData);
    } catch (err: any) {
      setError('Failed to load painting details.');
      console.error('Failed to fetch painting:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await commentsAPI.getPaintingComments(Number(id));
      setComments(response);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  }, [id]);

  const fetchUserRating = useCallback(async () => {
    try {
      const response = await ratingsAPI.getRatings({
        painting_id: Number(id),
        user_id: user?.id,
        page: 1,
        limit: 1
      });
      if (response.items.length > 0) {
        setUserRating(response.items[0].rating);
      }
    } catch (err) {
      console.error('Failed to fetch user rating:', err);
    }
  }, [id, user?.id]);

  useEffect(() => {
    if (id) {
      fetchPaintingDetails();
      fetchComments();
      if (user) {
        fetchUserRating();
      }
    }
  }, [id, user, fetchPaintingDetails, fetchComments, fetchUserRating]);

  const handleRatingSubmit = async (rating: number) => {
    if (!user || !painting) return;
    
    setSubmittingRating(true);
    try {
      await ratingsAPI.createOrUpdateRating({
        painting_id: painting.id,
        rating: rating,
        user_id: user.id
      });
      setUserRating(rating);
      
      // Refresh painting to get updated average rating
      const updatedPainting = await paintingsAPI.getPainting(painting.id);
      setPainting(updatedPainting);
    } catch (err: any) {
      setError('Failed to submit rating. Please try again.');
      console.error('Failed to submit rating:', err);
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !painting || !newComment.trim()) return;
    
    setSubmittingComment(true);
    try {
      const comment = await commentsAPI.createComment({
        painting_id: painting.id,
        content: newComment.trim(),
        user_id: user.id
      });
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err: any) {
      setError('Failed to submit comment. Please try again.');
      console.error('Failed to submit comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        filled={interactive ? (hoverRating || userRating) > index : rating > index}
        interactive={interactive}
        onClick={interactive ? () => handleRatingSubmit(index + 1) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(index + 1) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        disabled={submittingRating}
      >
        ★
      </Star>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DetailContainer>
        <LoadingContainer>
          <VictorianSpinner />
        </LoadingContainer>
      </DetailContainer>
    );
  }

  if (error && !painting) {
    return (
      <DetailContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <div style={{ textAlign: 'center' }}>
          <VictorianButton as={Link} to="/gallery" variant="outline">
            Back to Gallery
          </VictorianButton>
        </div>
      </DetailContainer>
    );
  }

  if (!painting) {
    return (
      <DetailContainer>
        <ErrorMessage>Painting not found.</ErrorMessage>
        <div style={{ textAlign: 'center' }}>
          <VictorianButton as={Link} to="/gallery" variant="outline">
            Back to Gallery
          </VictorianButton>
        </div>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <BackButton 
        as={Link} 
        to="/gallery" 
        variant="outline"
      >
        ← Back to Gallery
      </BackButton>

      <PaintingContainer>
        <ImageContainer>
          <PaintingImage 
            src={painting.image_url} 
            alt={painting.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
            }}
          />
        </ImageContainer>

        <InfoContainer elevated>
          <PaintingTitle level={2}>{painting.title}</PaintingTitle>
          
          <InfoRow>
            <InfoLabel>Artist:</InfoLabel>
            <InfoValue>{painting.artist_name}</InfoValue>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>Category:</InfoLabel>
            <InfoValue>{painting.category_name}</InfoValue>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>Year:</InfoLabel>
            <InfoValue>{painting.year || 'Unknown'}</InfoValue>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>Medium:</InfoLabel>
            <InfoValue>{painting.medium || 'Not specified'}</InfoValue>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>Dimensions:</InfoLabel>
            <InfoValue>{painting.dimensions || 'Not specified'}</InfoValue>
          </InfoRow>

          <Description>{painting.description}</Description>
        </InfoContainer>
      </PaintingContainer>

      {/* Rating Section */}
      <RatingSection elevated>
        <VictorianHeading level={3}>Rating</VictorianHeading>
        
        <RatingDisplay>
          <StarContainer>
            {renderStars(painting.average_rating || 0)}
          </StarContainer>
          <RatingStats>
            {(painting.average_rating || 0).toFixed(1)} ({painting.rating_count || 0} rating{painting.rating_count !== 1 ? 's' : ''})
          </RatingStats>
        </RatingDisplay>

        {user && (
          <div>
            <p style={{ 
              fontFamily: victorianTheme.typography.bodyFont,
              color: victorianTheme.colors.textSecondary,
              marginBottom: victorianTheme.spacing.sm
            }}>
              Your rating:
            </p>
            <StarContainer>
              {renderStars(userRating, true)}
            </StarContainer>
          </div>
        )}

        {!user && (
          <p style={{ 
            fontFamily: victorianTheme.typography.bodyFont,
            color: victorianTheme.colors.textMuted,
            fontStyle: 'italic'
          }}>
            Switch to a user mode to rate this painting.
          </p>
        )}
      </RatingSection>

      {/* Comments Section */}
      <CommentsSection elevated>
        <VictorianHeading level={3}>Comments</VictorianHeading>

        {user && (
          <CommentForm onSubmit={handleCommentSubmit}>
            <VictorianTextarea
              placeholder="Share your thoughts about this painting..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              style={{ marginBottom: victorianTheme.spacing.md }}
            />
            <VictorianButton 
              type="submit" 
              variant="accent"
              disabled={!newComment.trim() || submittingComment}
            >
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </VictorianButton>
          </CommentForm>
        )}

        {!user && (
          <p style={{ 
            fontFamily: victorianTheme.typography.bodyFont,
            color: victorianTheme.colors.textMuted,
            fontStyle: 'italic',
            marginBottom: victorianTheme.spacing.lg
          }}>
            Switch to a user mode to add comments.
          </p>
        )}

        <CommentsList>
          {comments.map(comment => (
            <CommentCard key={comment.id}>
              <CommentHeader>
                <CommentAuthor>{comment.user_name}</CommentAuthor>
                <CommentDate>{formatDate(comment.created_at)}</CommentDate>
              </CommentHeader>
              <CommentText>{comment.content}</CommentText>
            </CommentCard>
          ))}
          
          {comments.length === 0 && (
            <p style={{ 
              fontFamily: victorianTheme.typography.bodyFont,
              color: victorianTheme.colors.textMuted,
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </CommentsList>
      </CommentsSection>

      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
    </DetailContainer>
  );
};

export default PaintingDetail;
