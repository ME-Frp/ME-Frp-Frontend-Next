import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 创建axios实例
const baseApi = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT + "/api",
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});
// 请求拦截器
baseApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
baseApi.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            // 处理错误响应
            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                default:
                    console.error('API Error:', error.response.data);
            }
        }
        return Promise.reject(error);
    }
);

export default baseApi; 