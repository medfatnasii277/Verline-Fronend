import axios, { AxiosInstance } from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default configuration (NO AUTH)
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple response interceptor for error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Types for API responses
export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: 'enthusiast' | 'artist';
  bio?: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  role?: 'enthusiast' | 'artist';
  bio?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface Painting {
  id: number;
  title: string;
  description: string;
  price?: number;
  year?: number;
  medium?: string;
  dimensions?: string;
  image_url: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  artist_id: number;
  artist_name: string;
  category_id: number;
  category_name: string;
  average_rating?: number;
  rating_count?: number;
  comment_count?: number;
}

export interface Rating {
  id: number;
  painting_id: number;
  user_id: number;
  score: number;
  created_at: string;
  user_name?: string;
}

export interface Comment {
  id: number;
  painting_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_name: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Authentication API (disabled for no-auth mode)
export const authAPI = {
  // No authentication required - all endpoints are public
};

// Users API
export const usersAPI = {
  getProfile: async (userId: number): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/users/me`, data);
    return response.data;
  },

  getUsers: async (params: {
    page: number;
    limit: number;
    role?: string;
  }): Promise<User[]> => {
    const searchParams = new URLSearchParams();
    
    if (params.role) {
      searchParams.append('role', params.role);
    }

    const response = await apiClient.get(`/users/?${searchParams}`);
    return response.data; // API returns array directly, not paginated
  },

  getUserStats: async (userId: number): Promise<{
    paintingsCount: number;
    averageRating: number;
    totalRatings: number;
  }> => {
    // Since there's no stats endpoint, we'll calculate from paintings
    try {
      const response = await apiClient.get(`/paintings/?artist_id=${userId}&page=1&limit=1000`);
      const paintings: Painting[] = response.data.items;
      
      const paintingsCount = paintings.length;
      const totalRatings = paintings.reduce((sum, p) => sum + (p.rating_count || 0), 0);
      const weightedSum = paintings.reduce((sum, p) => 
        sum + (p.average_rating || 0) * (p.rating_count || 0), 0
      );
      const averageRating = totalRatings > 0 ? weightedSum / totalRatings : 0;
      
      return {
        paintingsCount,
        averageRating,
        totalRatings,
      };
    } catch (err) {
      return {
        paintingsCount: 0,
        averageRating: 0,
        totalRatings: 0,
      };
    }
  },
};

// Categories API
export const categoriesAPI = {
  getCategories: async (params: {
    page: number;
    limit: number;
  }): Promise<Category[]> => {
    // Backend returns array directly, not paginated
    const response = await apiClient.get(`/categories/`);
    return response.data;
  },

  getCategory: async (categoryId: number): Promise<Category> => {
    const response = await apiClient.get(`/categories/${categoryId}`);
    return response.data;
  },

  createCategory: async (data: Omit<Category, 'id' | 'created_at'>): Promise<Category> => {
    const response = await apiClient.post('/categories/', data);
    return response.data;
  },

  updateCategory: async (categoryId: number, data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.put(`/categories/${categoryId}`, data);
    return response.data;
  },

  deleteCategory: async (categoryId: number): Promise<void> => {
    await apiClient.delete(`/categories/${categoryId}`);
  },
};

// Paintings API
export const paintingsAPI = {
  getPaintings: async (params: {
    page: number;
    limit: number;
    category_id?: number;
    artist_id?: number;
    search?: string;
  }): Promise<PaginatedResponse<Painting>> => {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });
    
    if (params.category_id) searchParams.append('category_id', params.category_id.toString());
    if (params.artist_id) searchParams.append('artist_id', params.artist_id.toString());
    if (params.search) searchParams.append('search', params.search);

    const response = await apiClient.get(`/paintings/?${searchParams}`);
    return response.data;
  },

  getPainting: async (paintingId: number): Promise<Painting> => {
    const response = await apiClient.get(`/paintings/${paintingId}`);
    return response.data;
  },

  createPainting: async (data: FormData): Promise<Painting> => {
    const response = await apiClient.post('/paintings/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePainting: async (paintingId: number, data: FormData): Promise<Painting> => {
    const response = await apiClient.put(`/paintings/${paintingId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletePainting: async (paintingId: number): Promise<void> => {
    await apiClient.delete(`/paintings/${paintingId}`);
  },

  getMyPaintings: async (params: {
    page: number;
    limit: number;
    artist_id: number;  // Add artist_id parameter
  }): Promise<PaginatedResponse<Painting>> => {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    const response = await apiClient.get(`/paintings/my-paintings/${params.artist_id}?${searchParams}`);
    return response.data;
  },

  getFeaturedPaintings: async (limit: number = 6): Promise<Painting[]> => {
    const response = await apiClient.get(`/paintings/?featured=true&limit=${limit}`);
    return response.data.items;
  },
};

// Ratings API
export const ratingsAPI = {
  getRatings: async (params: {
    painting_id?: number;
    user_id?: number;
    page: number;
    limit: number;
  }): Promise<PaginatedResponse<Rating>> => {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });
    
    if (params.painting_id) searchParams.append('painting_id', params.painting_id.toString());
    if (params.user_id) searchParams.append('user_id', params.user_id.toString());

    const response = await apiClient.get(`/ratings/?${searchParams}`);
    return response.data;
  },

  createOrUpdateRating: async (data: {
    painting_id: number;
    score: number;
  }): Promise<Rating> => {
    const response = await apiClient.post('/ratings/', data);
    return response.data;
  },

  deleteRating: async (ratingId: number): Promise<void> => {
    await apiClient.delete(`/ratings/${ratingId}`);
  },
};

// Comments API
export const commentsAPI = {
  getComments: async (params: {
    painting_id?: number;
    user_id?: number;
    page: number;
    limit: number;
  }): Promise<PaginatedResponse<Comment>> => {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });
    
    if (params.painting_id) searchParams.append('painting_id', params.painting_id.toString());
    if (params.user_id) searchParams.append('user_id', params.user_id.toString());

    const response = await apiClient.get(`/comments/?${searchParams}`);
    return response.data;
  },

  createComment: async (data: {
    painting_id: number;
    content: string;
  }): Promise<Comment> => {
    const response = await apiClient.post('/comments/', data);
    return response.data;
  },

  updateComment: async (commentId: number, content: string): Promise<Comment> => {
    const response = await apiClient.put(`/comments/${commentId}`, { content });
    return response.data;
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await apiClient.delete(`/comments/${commentId}`);
  },
};

// Utility functions
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  
  return formData;
};

export const getImageUrl = (path?: string): string => {
  if (!path) return '/placeholder-painting.jpg';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

export default apiClient;
