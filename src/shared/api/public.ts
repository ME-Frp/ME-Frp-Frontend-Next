import baseApi from './config';

export interface RegisterData {
    email: string;
    password: string;
    emailCode: string;
    username: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface iForgotData {
    username: string;
    email: string;
    password: string;
    emailCode: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    code: number;
}

export interface LoginResponseData {
    token: string;
    group: string;
    username: string;
}

export const PublicApi = {
    register: (data: RegisterData) => {
        return baseApi.post<ApiResponse<void>>('/public/register', data);
    },

    getRegisterEmailCode: (email: string) => {
        return baseApi.post<ApiResponse<void>>('/public/register/emailCode', { email });
    },

    login: (data: LoginData) => {
        return baseApi.post<ApiResponse<LoginResponseData>>('/public/login', data);
    },

    iForgot: (data: iForgotData) => {
        return baseApi.post<ApiResponse<void>>('/public/iforgot', data);
    },

    getIForgotEmailCode: (email: string) => {
        return baseApi.post<ApiResponse<void>>('/public/iforgot/emailCode', { email });
    }
};

export default PublicApi; 