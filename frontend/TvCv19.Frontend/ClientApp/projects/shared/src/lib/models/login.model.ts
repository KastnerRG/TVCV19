export interface LoginModel {
    userName: string;
    password: string;
    rememberMe: boolean;
}

export interface AuthResult {
    token: string;
    expires: string;
}