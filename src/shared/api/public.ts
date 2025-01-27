import baseApi, { ApiResponse } from './config';
import type { RegisterData, LoginData, iForgotData, LoginResponseData, Statistics } from '../../types';

export const PublicApi = {
    // 注册
    register: (data: RegisterData) => {
        return baseApi.post<ApiResponse<void>>('/public/register', data);
    },

    // 获取注册邮箱验证码
    getRegisterEmailCode: (email: string) => {
        return baseApi.post<ApiResponse<void>>('/public/register/emailCode', { email });
    },

    // 登录
    login: (data: LoginData) => {
        return baseApi.post<ApiResponse<LoginResponseData>>('/public/login', data);
    },

    // 忘记密码
    iForgot: (data: iForgotData) => {
        return baseApi.post<ApiResponse<void>>('/public/iforgot', data);
    },

    // 获取忘记密码邮箱验证码
    getIForgotEmailCode: (email: string) => {
        return baseApi.post<ApiResponse<void>>('/public/iforgot/emailCode', { email });
    },

    // 获取系统统计信息
    getStatistics: () => {
        return baseApi.get<ApiResponse<Statistics>>('/public/statistics');
    }
};

export default PublicApi; 