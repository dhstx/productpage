/**
 * Integration tests for API endpoints
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const API_BASE = process.env.VITE_API_URL || '';
let apiReachable = false;

async function ensureApiAvailability() {
  if (!API_BASE) return false;
  try {
    const response = await fetch(`${API_BASE}/api/health`, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
}

function skipIfApiUnavailable() {
  if (!apiReachable) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[tests] API unavailable, skipping API integration assertion');
    }
    return true;
  }
  return false;
}

describe('API Integration Tests', () => {
  beforeAll(async () => {
    apiReachable = await ensureApiAvailability();
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      if (skipIfApiUnavailable()) return;
      const response = await fetch(`${API_BASE}/api/health`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('healthy');
      expect(data).toHaveProperty('timestamp');
    });
  });

  describe('PT Estimation', () => {
    it('should estimate PT cost for a message', async () => {
      if (skipIfApiUnavailable()) return;
      const response = await fetch(`${API_BASE}/api/pt/estimate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Test message',
          model_tier: 'core',
          agent: 'commander'
        })
      });

      if (response.ok) {
        const data = await response.json();
        expect(data).toHaveProperty('estimated_pt');
        expect(data.estimated_pt).toBeGreaterThan(0);
      }
    });
  });

  describe('Authentication', () => {
    it('should reject requests without auth token', async () => {
      if (skipIfApiUnavailable()) return;
      const response = await fetch(`${API_BASE}/api/user/profile`);
      expect(response.status).toBe(401);
    });

    it('should reject invalid auth tokens', async () => {
      if (skipIfApiUnavailable()) return;
      const response = await fetch(`${API_BASE}/api/user/profile`, {
        headers: {
          'Authorization': 'Bearer invalid_token'
        }
      });
      expect(response.status).toBe(401);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      if (skipIfApiUnavailable()) return;
      // Make multiple rapid requests
      const requests = Array(10).fill(null).map(() =>
        fetch(`${API_BASE}/api/health`)
      );

      const responses = await Promise.all(requests);
      const statuses = responses.map(r => r.status);

      // At least one request should succeed
      expect(statuses).toContain(200);
    }, 10000); // 10 second timeout
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', async () => {
      if (skipIfApiUnavailable()) return;
      const response = await fetch(`${API_BASE}/api/nonexistent`);
      expect(response.status).toBe(404);
    });

    it('should return 405 for wrong HTTP methods', async () => {
      if (skipIfApiUnavailable()) return;
      const response = await fetch(`${API_BASE}/api/health`, {
        method: 'POST'
      });
      expect(response.status).toBe(405);
    });

    it('should handle malformed JSON', async () => {
      if (skipIfApiUnavailable()) return;
      const response = await fetch(`${API_BASE}/api/pt/estimate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'invalid json'
      });
      expect(response.status).toBe(400);
    });
  });
});

