// src/services/apiService.ts

import axios from 'axios';

const API_BASE_URL =  "https://lms-backend-main.onrender.com/api";

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiService;