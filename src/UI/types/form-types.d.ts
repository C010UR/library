export interface LoginForm {
  username: string;
  password: string;
  _remember_me: boolean;
}

export interface PasswordResetRequestForm {
  email: string;
  hook: string;
}

export interface PasswordResetForm {
  password: string,
}
