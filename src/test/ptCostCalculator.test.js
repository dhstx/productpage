/**
 * Unit tests for PT Cost Calculator
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock PT cost calculator functions
const calculatePTCost = (modelTier, responseLength) => {
  const baseCosts = {
    'core-short': 1,
    'core-medium': 3,
    'core-long': 6,
    'advanced-short': 3,
    'advanced-medium': 7,
    'advanced-long': 14
  };

  const key = `${modelTier}-${responseLength}`;
  return baseCosts[key] || 1;
};

const checkPTAvailability = (userPT, requiredPT) => {
  return userPT >= requiredPT;
};

const checkThrottles = (usage, limits) => {
  const warnings = [];
  
  // Check 40%/72h throttle
  if (usage.pt_used_72h / limits.pt_monthly > 0.4) {
    warnings.push({
      type: 'burn_rate',
      message: 'You are using PT too quickly'
    });
  }
  
  // Check Advanced PT cap
  if (usage.advanced_pt_used / limits.advanced_pt_limit > 0.2) {
    warnings.push({
      type: 'advanced_cap',
      message: 'Approaching Advanced PT soft cap'
    });
  }
  
  return warnings;
};

describe('PT Cost Calculator', () => {
  describe('calculatePTCost', () => {
    it('should calculate correct PT cost for core-short', () => {
      expect(calculatePTCost('core', 'short')).toBe(1);
    });

    it('should calculate correct PT cost for core-medium', () => {
      expect(calculatePTCost('core', 'medium')).toBe(3);
    });

    it('should calculate correct PT cost for core-long', () => {
      expect(calculatePTCost('core', 'long')).toBe(6);
    });

    it('should calculate correct PT cost for advanced-short', () => {
      expect(calculatePTCost('advanced', 'short')).toBe(3);
    });

    it('should calculate correct PT cost for advanced-medium', () => {
      expect(calculatePTCost('advanced', 'medium')).toBe(7);
    });

    it('should calculate correct PT cost for advanced-long', () => {
      expect(calculatePTCost('advanced', 'long')).toBe(14);
    });

    it('should return default cost for unknown model', () => {
      expect(calculatePTCost('unknown', 'short')).toBe(1);
    });
  });

  describe('checkPTAvailability', () => {
    it('should return true when user has enough PT', () => {
      expect(checkPTAvailability(100, 50)).toBe(true);
    });

    it('should return false when user does not have enough PT', () => {
      expect(checkPTAvailability(30, 50)).toBe(false);
    });

    it('should return true when PT exactly matches requirement', () => {
      expect(checkPTAvailability(50, 50)).toBe(true);
    });

    it('should handle zero PT correctly', () => {
      expect(checkPTAvailability(0, 1)).toBe(false);
    });
  });

  describe('checkThrottles', () => {
    it('should warn when burn rate exceeds 40% in 72h', () => {
      const usage = {
        pt_used_72h: 450,
        advanced_pt_used: 10
      };
      const limits = {
        pt_monthly: 1000,
        advanced_pt_limit: 100
      };

      const warnings = checkThrottles(usage, limits);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].type).toBe('burn_rate');
    });

    it('should warn when Advanced PT exceeds 20% soft cap', () => {
      const usage = {
        pt_used_72h: 100,
        advanced_pt_used: 25
      };
      const limits = {
        pt_monthly: 1000,
        advanced_pt_limit: 100
      };

      const warnings = checkThrottles(usage, limits);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].type).toBe('advanced_cap');
    });

    it('should return multiple warnings when both thresholds exceeded', () => {
      const usage = {
        pt_used_72h: 450,
        advanced_pt_used: 25
      };
      const limits = {
        pt_monthly: 1000,
        advanced_pt_limit: 100
      };

      const warnings = checkThrottles(usage, limits);
      expect(warnings).toHaveLength(2);
    });

    it('should return no warnings when usage is normal', () => {
      const usage = {
        pt_used_72h: 100,
        advanced_pt_used: 10
      };
      const limits = {
        pt_monthly: 1000,
        advanced_pt_limit: 100
      };

      const warnings = checkThrottles(usage, limits);
      expect(warnings).toHaveLength(0);
    });
  });
});

