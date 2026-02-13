const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://your-production-api.com/api/v1'
  : 'http://localhost:5000/api/v1';

export default API_BASE_URL;
