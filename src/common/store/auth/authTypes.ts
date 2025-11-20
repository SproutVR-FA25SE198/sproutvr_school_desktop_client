export interface User {
  sub: string;
  email: string;
  family_name: string;
  given_name: string;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
