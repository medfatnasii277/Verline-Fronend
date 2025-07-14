import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { paintingsAPI, categoriesAPI, type Category } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const UploadContainer = styled(VictorianContainer)`
  padding-top: ${victorianTheme.spacing.xl};
  padding-bottom: ${victorianTheme.spacing.xl};
`;

const UploadCard = styled(VictorianCard)`
  max-width: 800px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${victorianTheme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${victorianTheme.spacing.lg};
  
  @media (max-width: ${victorianTheme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
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

const Select = styled.select`
  background: ${victorianTheme.colors.cardBg};
  border: 2px solid ${victorianTheme.colors.border};
  border-radius: ${victorianTheme.borderRadius.medium};
  padding: ${victorianTheme.spacing.md};
  color: ${victorianTheme.colors.textPrimary};
  font-family: ${victorianTheme.typography.bodyFont};
  font-size: ${victorianTheme.typography.body};
  transition: all ${victorianTheme.transitions.normal};
  
  &:focus {
    outline: none;
    border-color: ${victorianTheme.colors.accent};
    box-shadow: 0 0 0 2px ${victorianTheme.colors.accent}40;
  }
  
  option {
    background: ${victorianTheme.colors.cardBg};
    color: ${victorianTheme.colors.textPrimary};
  }
`;

const FileInput = styled.input`
  background: ${victorianTheme.colors.cardBg};
  border: 2px solid ${victorianTheme.colors.border};
  border-radius: ${victorianTheme.borderRadius.medium};
  padding: ${victorianTheme.spacing.md};
  color: ${victorianTheme.colors.textPrimary};
  font-family: ${victorianTheme.typography.bodyFont};
  transition: all ${victorianTheme.transitions.normal};
  
  &:focus {
    outline: none;
    border-color: ${victorianTheme.colors.accent};
    box-shadow: 0 0 0 2px ${victorianTheme.colors.accent}40;
  }
  
  &::file-selector-button {
    background: ${victorianTheme.colors.accent};
    color: ${victorianTheme.colors.background};
    border: none;
    border-radius: ${victorianTheme.borderRadius.small};
    padding: ${victorianTheme.spacing.sm} ${victorianTheme.spacing.md};
    font-family: ${victorianTheme.typography.bodyFont};
    font-weight: ${victorianTheme.typography.semibold};
    cursor: pointer;
    margin-right: ${victorianTheme.spacing.md};
    transition: all ${victorianTheme.transitions.normal};
    
    &:hover {
      background: ${victorianTheme.colors.darkGold};
    }
  }
`;

const ImagePreview = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${victorianTheme.spacing.md};
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: ${victorianTheme.borderRadius.medium};
  box-shadow: ${victorianTheme.shadows.medium};
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

const RequiredIndicator = styled.span`
  color: ${victorianTheme.colors.error};
`;

const HelpText = styled.p`
  font-family: ${victorianTheme.typography.bodyFont};
  font-size: ${victorianTheme.typography.small};
  color: ${victorianTheme.colors.textMuted};
  font-style: italic;
  margin-top: ${victorianTheme.spacing.xs};
`;

const CategoryInputGroup = styled.div`
  display: flex;
  gap: ${victorianTheme.spacing.sm};
  align-items: flex-end;
`;

const AddCategoryButton = styled(VictorianButton)`
  flex-shrink: 0;
  height: fit-content;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalCard = styled(VictorianCard)`
  width: 100%;
  max-width: 500px;
  margin: ${victorianTheme.spacing.lg};
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${victorianTheme.spacing.lg};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${victorianTheme.colors.textMuted};
  cursor: pointer;
  padding: ${victorianTheme.spacing.xs};
  
  &:hover {
    color: ${victorianTheme.colors.textPrimary};
  }
`;

interface PaintingFormData {
  title: string;
  description: string;
  category_id: number | '';
  year: string;
  medium: string;
  dimensions: string;
  image: File | null;
}

const UploadPainting: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: ''
  });
  const [addingCategory, setAddingCategory] = useState(false);
  const [formData, setFormData] = useState<PaintingFormData>({
    title: '',
    description: '',
    category_id: '',
    year: '',
    medium: '',
    dimensions: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryErrors, setNewCategoryErrors] = useState<string[]>([]);

  useEffect(() => {
    // Only show this page for artists
    if (user && user.role !== 'artist') {
      navigate('/');
      return;
    }
    
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const categories = await categoriesAPI.getCategories({ page: 1, limit: 100 });
      setCategories(categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([]); // Ensure it's always an array
      setErrors({ general: 'Failed to load categories. Please refresh the page.' });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'category_id' ? (value === '' ? '' : Number(value)) : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file.'
        }));
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image file size must be less than 10MB.'
        }));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Category is required.';
    }
    
    if (!formData.image) {
      newErrors.image = 'Image is required.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      const paintingData = new FormData();
      paintingData.append('title', formData.title.trim());
      paintingData.append('description', formData.description.trim());
      paintingData.append('category_id', formData.category_id.toString());
      
      // Add artist_id
      if (user?.id) {
        paintingData.append('artist_id', user.id.toString());
      }
      
      if (formData.year.trim()) {
        paintingData.append('year', formData.year.trim());
      }
      if (formData.medium.trim()) {
        paintingData.append('medium', formData.medium.trim());
      }
      if (formData.dimensions.trim()) {
        paintingData.append('dimensions', formData.dimensions.trim());
      }
      
      if (formData.image) {
        paintingData.append('image', formData.image);
      }
      
      const newPainting = await paintingsAPI.createPainting(paintingData);
      
      setSuccessMessage('Painting uploaded successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category_id: '',
        year: '',
        medium: '',
        dimensions: '',
        image: null
      });
      setImagePreview('');
      
      // Redirect to the new painting after a short delay
      setTimeout(() => {
        navigate(`/paintings/${newPainting.id}`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Failed to upload painting:', err);
      
      // Convert error to string to avoid React rendering objects
      let errorMessage = 'Failed to upload painting. Please try again.';
      
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          // Handle validation errors array
          errorMessage = err.response.data.detail.map((error: any) => 
            typeof error === 'string' ? error : error.msg || 'Validation error'
          ).join(', ');
        } else {
          // Handle object errors
          errorMessage = err.response.data.detail.msg || JSON.stringify(err.response.data.detail);
        }
      }
      
      setErrors({ 
        general: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCategoryName('');
    setNewCategoryErrors([]);
  };

  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(e.target.value);
    
    // Clear error on change
    if (newCategoryErrors.length > 0) {
      setNewCategoryErrors([]);
    }
  };

  const validateCategoryForm = (): boolean => {
    const errors: string[] = [];
    
    if (!newCategoryName.trim()) {
      errors.push('Category name is required.');
    }
    
    setNewCategoryErrors(errors);
    return errors.length === 0;
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCategoryForm()) {
      return;
    }
    
    setIsLoading(true);
    setNewCategoryErrors([]);
    
    try {
      // Create new category
      const newCategory = await categoriesAPI.createCategory({ name: newCategoryName.trim() });
      
      setCategories(prev => [...prev, newCategory]);
      setFormData(prev => ({ ...prev, category_id: newCategory.id }));
      setSuccessMessage('Category created successfully!');
      
      // Close modal after a short delay
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
      
    } catch (err: any) {
      console.error('Failed to create category:', err);
      
      // Convert error to string to avoid React rendering objects
      let errorMessage = 'Failed to create category. Please try again.';
      
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map((error: any) => 
            typeof error === 'string' ? error : error.msg || 'Validation error'
          ).join(', ');
        } else {
          errorMessage = err.response.data.detail.msg || JSON.stringify(err.response.data.detail);
        }
      }
      
      setNewCategoryErrors([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryData.name.trim()) {
      setErrors({ category: 'Category name is required.' });
      return;
    }
    
    setAddingCategory(true);
    
    try {
      const newCategory = await categoriesAPI.createCategory({
        name: newCategoryData.name.trim(),
        description: newCategoryData.description.trim() || undefined
      });
      
      // Add the new category to the list
      setCategories(prev => [...prev, newCategory]);
      
      // Select the new category
      setFormData(prev => ({ ...prev, category_id: newCategory.id }));
      
      // Reset and close modal
      setNewCategoryData({ name: '', description: '' });
      setShowAddCategory(false);
      
      // Clear any errors
      setErrors(prev => ({ ...prev, category: '', general: '' }));
      
    } catch (err: any) {
      console.error('Failed to create category:', err);
      
      // Convert error to string to avoid React rendering objects
      let errorMessage = 'Failed to create category. Please try again.';
      
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map((error: any) => 
            typeof error === 'string' ? error : error.msg || 'Validation error'
          ).join(', ');
        } else {
          errorMessage = err.response.data.detail.msg || JSON.stringify(err.response.data.detail);
        }
      }
      
      setErrors({ 
        category: errorMessage
      });
    } finally {
      setAddingCategory(false);
    }
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const currentYear = new Date().getFullYear();

  return (
    <UploadContainer>
      <VictorianHeading level={1} decorative style={{ textAlign: 'center', marginBottom: victorianTheme.spacing.xl }}>
        Upload Artwork
      </VictorianHeading>
      
      <UploadCard elevated>
        {successMessage && (
          <SuccessMessage>{successMessage}</SuccessMessage>
        )}
        
        {errors.general && (
          <ErrorMessage style={{ textAlign: 'center', marginBottom: victorianTheme.spacing.lg }}>
            {errors.general}
          </ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="title">
              Title <RequiredIndicator>*</RequiredIndicator>
            </Label>
            <VictorianInput
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter the painting title"
              required
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="description">
              Description <RequiredIndicator>*</RequiredIndicator>
            </Label>
            <VictorianTextarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your artwork, inspiration, technique..."
              rows={4}
              required
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </InputGroup>

          <FormRow>
            <InputGroup>
              <Label htmlFor="category_id">
                Category <RequiredIndicator>*</RequiredIndicator>
              </Label>
              <CategoryInputGroup>
                <Select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  style={{ flex: 1 }}
                >
                  <option value="">Select a category</option>
                  {categoriesLoading ? (
                    <option value="" disabled>Loading categories...</option>
                  ) : categories && categories.length > 0 ? (
                    categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No categories available</option>
                  )}
                </Select>
                <AddCategoryButton
                  type="button"
                  variant="outline"
                  size="small"
                  onClick={() => setShowAddCategory(true)}
                >
                  Add New
                </AddCategoryButton>
              </CategoryInputGroup>
              {errors.category_id && <ErrorMessage>{errors.category_id}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="year">Year</Label>
              <VictorianInput
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="e.g., 2024"
                min="1800"
                max={currentYear}
              />
              <HelpText>Year the artwork was created</HelpText>
            </InputGroup>
          </FormRow>

          <FormRow>
            <InputGroup>
              <Label htmlFor="medium">Medium</Label>
              <VictorianInput
                id="medium"
                name="medium"
                type="text"
                value={formData.medium}
                onChange={handleInputChange}
                placeholder="e.g., Oil on canvas, Watercolor, Acrylic"
              />
              <HelpText>Materials and techniques used</HelpText>
            </InputGroup>

            <InputGroup>
              <Label htmlFor="dimensions">Dimensions</Label>
              <VictorianInput
                id="dimensions"
                name="dimensions"
                type="text"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder="e.g., 24×36 inches, 60×90 cm"
              />
              <HelpText>Width × Height</HelpText>
            </InputGroup>
          </FormRow>

          <InputGroup>
            <Label htmlFor="image">
              Image <RequiredIndicator>*</RequiredIndicator>
            </Label>
            <FileInput
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            <HelpText>Upload a high-quality image of your artwork (max 10MB)</HelpText>
            {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}
            
            {imagePreview && (
              <ImagePreview>
                <PreviewImage src={imagePreview} alt="Preview" />
              </ImagePreview>
            )}
          </InputGroup>

          <VictorianButton
            type="submit"
            variant="accent"
            size="large"
            disabled={isLoading}
            style={{ marginTop: victorianTheme.spacing.lg }}
          >
            {isLoading ? 'Uploading...' : 'Upload Artwork'}
          </VictorianButton>
        </Form>

        <CategoryInputGroup>
          <VictorianButton
            variant="outline"
            onClick={handleOpenModal}
            disabled={isLoading}
          >
            + Add Category
          </VictorianButton>
        </CategoryInputGroup>
      </UploadCard>
      
      {isModalOpen && (
        <Modal>
          <ModalCard elevated>
            <ModalHeader>
              <VictorianHeading level={2} style={{ margin: 0 }}>
                Add New Category
              </VictorianHeading>
              <CloseButton onClick={handleCloseModal} aria-label="Close">
                &times;
              </CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleCategorySubmit}>
              <InputGroup>
                <Label htmlFor="new_category_name">
                  Category Name <RequiredIndicator>*</RequiredIndicator>
                </Label>
                <VictorianInput
                  id="new_category_name"
                  name="new_category_name"
                  type="text"
                  value={newCategoryName}
                  onChange={handleCategoryNameChange}
                  placeholder="Enter new category name"
                  required
                />
                {newCategoryErrors.length > 0 && (
                  <ErrorMessage>
                    {newCategoryErrors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </ErrorMessage>
                )}
              </InputGroup>

              <VictorianButton
                type="submit"
                variant="accent"
                size="large"
                disabled={isLoading}
                style={{ marginTop: victorianTheme.spacing.lg }}
              >
                {isLoading ? 'Creating...' : 'Create Category'}
              </VictorianButton>
            </Form>
          </ModalCard>
        </Modal>
      )}
    </UploadContainer>
  );
};

export default UploadPainting;
