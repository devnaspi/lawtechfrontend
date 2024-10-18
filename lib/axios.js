import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {        
        const auth = localStorage.getItem('token');
        if (auth) {
            config.headers.Authorization = `Token ${auth}`;
        }
        
        NProgress.start();
        return config;
    },
    (error) => {
        NProgress.done();
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        NProgress.done();
        return response;
    },
    (error) => {
        NProgress.done();
        return Promise.reject(error);
    }
);

export default axiosInstance;
