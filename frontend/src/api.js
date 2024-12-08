import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers['x-auth-token'] = token;
  } else {
    delete api.defaults.headers['x-auth-token'];
  }
};

export default api;