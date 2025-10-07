export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  icon?: string;
}

export interface Purchase {
  id: string;
  productId: string;
  userId: string;
  purchaseDate: Date;
  status: 'active' | 'cancelled' | 'expired';
  accessUrl: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password?: string, name?: string) => Promise<void>;
}
