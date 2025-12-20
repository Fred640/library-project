import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


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
};


export default apiService;

export { apiService };