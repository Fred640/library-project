import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const apiService = {
  getAuthors: () => api.get('/authors/'),
  getAuthor: (id) => api.get(`/authors/${id}/`),
  createAuthor: (data) => api.post('/authors/', data),
  updateAuthor: (id, data) => api.put(`/authors/${id}/`, data),
  deleteAuthor: (id) => api.delete(`/authors/${id}/`),
  
  getBooks: () => api.get('/'),
  getBook: (slug) => api.get(`/book/${slug}/`),
  createBook: (data) => api.post('/books/', data),
  updateBook: (id, data) => api.put(`/books/${id}/`, data),
  deleteBook: (id) => api.delete(`/books/${id}/`),
  
  getBooksByAuthor: (authorId) => api.get(`/books/?author=${authorId}`),
  searchBooks: (query) => api.get(`/books/?search=${query}`),

  getAuthorById: (id) => api.get(`/author/${id}/`),
  getAuthorBySlug: (slug) => api.get(`/author/${slug}/`),
  getGenres: () => api.get('/genres/'),

  // Избранное
  toggleFavoriteBook: (bookId) => api.post(`/books/${bookId}/favorite/`),
  toggleFavoriteAuthor: (authorId) => api.post(`/authors/${authorId}/favorite/`),
  getUserFavorites: () => api.get('/user/favorites/'),
  getUserProfile: () => api.get('/auth/profile/'),
  
  checkBookFavoriteStatus: (bookId) => 
    api.get('/user/favorites/').then(response => {
      const isFavorite = response.data.favorite_books?.some(book => book.id === bookId) || false;
      return { data: { is_favorite: isFavorite } };
    }),
  
  checkAuthorFavoriteStatus: (authorId) => 
    api.get('/user/favorites/').then(response => {
      const isFavorite = response.data.favorite_authors?.some(author => author.id === authorId) || false;
      return { data: { is_favorite: isFavorite } };
    }),
  

  getFavoriteBooks: () => 
    api.get('/user/favorites/').then(response => ({
      data: response.data.favorite_books || []
    })),

  getFavoriteAuthors: () => 
    api.get('/user/favorites/').then(response => ({
      data: response.data.favorite_authors || []
    })),
  
  getFavoritesCount: () => 
    api.get('/user/favorites/').then(response => ({
      data: {
        books_count: response.data.favorite_books?.length || 0,
        authors_count: response.data.favorite_authors?.length || 0,
        total_count: (response.data.favorite_books?.length || 0) + 
                    (response.data.favorite_authors?.length || 0)
      }
    }))
};

export default apiService;
export { apiService };