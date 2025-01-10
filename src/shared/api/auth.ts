import baseApi from './config';
import type { ApiResponse } from './public';
import type { UserInfo } from '../../types';


export const AuthApi = {
    getUserInfo: () => {
        return baseApi.post<ApiResponse<UserInfo>>('/auth/user/info');
    },
    
    // 获取签到状态
    getSignStatus: () => {
        return baseApi.get<ApiResponse<{ available: boolean }>>('/auth/user/sign/status');
    },

    // 执行签到
    sign: () => {
        return baseApi.post<ApiResponse<{ extraTraffic: number }>>('/auth/user/sign');
    },

    // 重置访问密钥
    tokenReset: () => {
        return baseApi.get<ApiResponse<{ newToken: string }>>('/auth/user/tokenReset');
    },

    // 重置密码
    passwordReset: (data: { oldPassword: string; newPassword: string }) => {
        return baseApi.post<ApiResponse<void>>('/auth/user/passwordReset', data);
    }
};

export default AuthApi;