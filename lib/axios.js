import axios from 'axios';

// Create an instance of axios with default settings
const axiosInstance = axios.create({
    baseURL: process.env.PUBLIC_API_BASE_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
