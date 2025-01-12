import baseApi, { ApiResponse } from './config';
import type { RegisterData, LoginData, iForgotData, LoginResponseData } from '../../types';

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