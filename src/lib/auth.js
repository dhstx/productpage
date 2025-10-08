// Authentication utilities
const AUTH_KEY = 'dhstx_auth';

export const login = (email, password) => {
  // Simple demo authentication
  if (email && password) {
    const user = {
      email,
      name: 'Administrator',
      role: 'admin',
      id: Date.now().toString()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};
