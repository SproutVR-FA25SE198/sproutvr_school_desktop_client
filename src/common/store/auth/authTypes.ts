export interface User {
  userId: string;
  email: string;
  fullName: string;
  status: {
    key: number;
    name: string;
  };
  roles: string[];
  dateOfBirth: string | null;
  joinedAtUtc: string;
  joinedAtVietNam: string;
  organizationId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
