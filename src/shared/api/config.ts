import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Window } from '../../types';

// 声明window类型
declare const window: Window;

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

// 错误响应类型
interface ErrorResponse {
    message?: string;
    [key: string]: any;
}

let baseURL: string;
switch (process.env.NODE_ENV) {
    case 'development':
        baseURL = "http://localhost:8080/api";
        break;
    case 'production':
        baseURL = "https://api.mefrp.com/api";
        break;
}
// 创建axios实例
const baseApi = axios.create({
    baseURL: baseURL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});
// 请求拦截器
baseApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 显示加载进度条
        if (window.$loadingBar) {
            window.$loadingBar.start();
        }
        
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        // 请求错误时结束进度条
        if (window.$loadingBar) {
            window.$loadingBar.error();
        }
        return Promise.reject(error);
    }
);

// 响应拦截器
baseApi.interceptors.response.use(
    (response: AxiosResponse) => {
        // 请求成功时结束进度条
        if (window.$loadingBar) {
            window.$loadingBar.finish();
        }
        return response;
    },
    (error: AxiosError) => {
        // 请求失败时结束进度条
        if (window.$loadingBar) {
            window.$loadingBar.error();
        }
        
        if (error.response) {
            // 处理错误响应
            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('token');
                    window.location.href = '/auth/login';
                    break;
                default:
                    console.error('API Error:', error.response.data);
                    // 显示错误消息
                    if (window.$message) {
                        let errorMessage = '未知错误';
                        const errorData = error.response.data;
                        
                        // 安全地检查错误消息
                        if (errorData && typeof errorData === 'object' && 'message' in errorData) {
                            errorMessage = String(errorData.message);
                        }
                        
                        window.$message.error('请求失败：' + errorMessage);
                    }
            }
        }
        return Promise.reject(error);
    }
);

export default baseApi; 