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

export interface LoginResponseData {
    token: string;
    group: string;
    username: string;
}