export interface AuthFormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export interface AuthFormData {
    email: string;
    password: string;
    confirmPassword: string;
}
