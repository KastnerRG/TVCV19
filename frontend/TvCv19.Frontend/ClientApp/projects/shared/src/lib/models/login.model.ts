export interface LoginModel {
    userName: string;
    password: string;
    rememberMe: boolean;
}

export interface LoginResult {
    isLockedOut: boolean;
    isNotAllowed: boolean;
    requiresTwoFactor: boolean;
    succeeded: boolean;
}