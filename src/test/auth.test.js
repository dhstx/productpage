import { describe, it, expect, beforeEach, vi } from 'vitest';
import { login, logout, isAuthenticated, getCurrentUser } from '../lib/auth';

vi.mock('../lib/auth/supabaseAuth', () => {
  return {
    signIn: vi.fn(async () => ({ user: null, session: null, error: 'Supabase not configured' })),
    signOut: vi.fn(async () => ({ error: null })),
    getCurrentUser: vi.fn(async () => ({ user: null, error: null })),
  };
});

describe('Authentication', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.cookie = '';
    await logout();
  });

  it('should login successfully with correct credentials', async () => {
    const user = await login('admin', 'admin123');
    expect(user).toBeTruthy();
    expect(user).toMatchObject({ email: 'admin@dhstx.com', name: 'Administrator' });
    expect(isAuthenticated()).toBe(true);
  });

  it('should fail login with empty credentials', async () => {
    const user = await login('', '');
    expect(user).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it('should logout successfully', async () => {
    await login('admin', 'admin123');
    expect(isAuthenticated()).toBe(true);
    await logout();
    expect(isAuthenticated()).toBe(false);
  });

  it('should return current user after login', async () => {
    await login('admin', 'admin123');
    const user = getCurrentUser();
    expect(user).toMatchObject({
      name: 'Administrator',
      email: 'admin@dhstx.com',
      role: 'admin',
    });
  });

  it('should return null when not authenticated', () => {
    const user = getCurrentUser();
    expect(user).toBeNull();
  });
});
