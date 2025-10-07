import { describe, it, expect, beforeEach } from 'vitest';
import { login, logout, isAuthenticated, getCurrentUser } from '../lib/auth';

describe('Authentication', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = '';
  });

  it('should login successfully with correct credentials', () => {
    const result = login('admin', 'admin123');
    expect(result).toBeTruthy();
    expect(result).toHaveProperty('email', 'admin');
    expect(isAuthenticated()).toBe(true);
  });

  it('should fail login with empty credentials', () => {
    const result = login('', '');
    expect(result).toBeNull();
  });

  it('should logout successfully', () => {
    login('admin', 'admin123');
    expect(isAuthenticated()).toBe(true);
    logout();
    expect(isAuthenticated()).toBe(false);
  });

  it('should return current user after login', () => {
    login('admin', 'admin123');
    const user = getCurrentUser();
    expect(user).toHaveProperty('name', 'Digital Asset Administrator');
    expect(user).toHaveProperty('email', 'admin');
    expect(user).toHaveProperty('role', 'admin');
    expect(user).toHaveProperty('id');
  });

  it('should return null when not authenticated', () => {
    const user = getCurrentUser();
    expect(user).toBeNull();
  });
});
