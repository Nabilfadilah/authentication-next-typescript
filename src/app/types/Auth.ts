// user
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
  // tambah properti lain sesuai API
}

// login
export interface LoginData {
  email: string;
  password: string;
}

// register 
export interface RegisterData {
  name: string;
  email: string;
  role: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}
