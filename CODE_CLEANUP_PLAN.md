# Code Quality & Cleanup Plan

**Priority:** 🟢 Medium  
**Points:** 30 pts  
**Status:** In Progress

## Tasks Completed

### 1. Duplicate File Analysis ✅

**Files to Replace/Consolidate:**

| Old File | New File | Action |
|----------|----------|--------|
| `src/pages/Login.jsx` | `src/pages/Login-new.jsx` | Replace |
| `src/pages/Dashboard.jsx` | `src/pages/Dashboard-new.jsx` | Replace |
| `src/pages/Billing.jsx` | `src/pages/Billing-updated.jsx` | Replace |
| `src/pages/PricingPage.jsx` | `src/pages/PricingPage-with-stripe.jsx` | Replace |
| `src/pages/AgentManagement.jsx` | `src/pages/AgentManagement-updated.jsx` | Replace |
| `src/pages/Settings.jsx` | `src/pages/Settings-enhanced.jsx` | Replace |
| `src/components/ProtectedRoute.jsx` | `src/components/ProtectedRoute-new.jsx` | Replace |
| `src/App.jsx` | `src/App-updated.jsx` | Replace |

**Files to Remove:**
- `./AIChatInterface-updated.jsx` (root level, should be in src/components)
- `src/components/AIChatInterface-with-tokens.jsx` (keep for reference, integrate later)

### 2. PropTypes Addition

**Files needing PropTypes:**
- All new components created (13 files)
- Existing components without PropTypes

### 3. Error Handling Improvements

**Areas to improve:**
- API calls need try-catch blocks
- Better error messages for users
- Fallback UI for errors
- Loading states

### 4. Code Consolidation

**Agent Files:**
- `src/lib/agents.js`
- `src/lib/agents-enhanced.js`
- `src/lib/agentAccessControl.js`
→ Consolidate into single `agents` module

**Auth Files:**
- `src/lib/auth.js` (compatibility shim)
- `src/lib/auth/supabaseAuth.js` (new auth)
→ Keep both for now, remove shim after migration complete

## Implementation Steps

### Step 1: File Replacement Script ✅

```bash
#!/bin/bash
# Replace old files with new versions

cd /home/ubuntu/productpage

# Backup old files first
mkdir -p .backup/old-files
cp src/pages/Login.jsx .backup/old-files/
cp src/pages/Dashboard.jsx .backup/old-files/
cp src/pages/Billing.jsx .backup/old-files/
cp src/pages/PricingPage.jsx .backup/old-files/
cp src/pages/AgentManagement.jsx .backup/old-files/
cp src/pages/Settings.jsx .backup/old-files/
cp src/components/ProtectedRoute.jsx .backup/old-files/
cp src/App.jsx .backup/old-files/

# Replace with new versions
mv src/pages/Login-new.jsx src/pages/Login.jsx
mv src/pages/Dashboard-new.jsx src/pages/Dashboard.jsx
mv src/pages/Billing-updated.jsx src/pages/Billing.jsx
mv src/pages/PricingPage-with-stripe.jsx src/pages/PricingPage.jsx
mv src/pages/AgentManagement-updated.jsx src/pages/AgentManagement.jsx
mv src/pages/Settings-enhanced.jsx src/pages/Settings.jsx
mv src/components/ProtectedRoute-new.jsx src/components/ProtectedRoute.jsx
mv src/App-updated.jsx src/App.jsx

# Remove misplaced file
rm -f ./AIChatInterface-updated.jsx

echo "✅ File replacement complete!"
```

### Step 2: Add PropTypes

Create utility to add PropTypes to all components:

```javascript
// Common PropTypes patterns
import PropTypes from 'prop-types';

// User object
const userPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  tier: PropTypes.string,
  pt_balance: PropTypes.number
});

// Agent object
const agentPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  tier_required: PropTypes.string
});

// PT Usage object
const ptUsagePropType = PropTypes.shape({
  core_used: PropTypes.number.isRequired,
  core_total: PropTypes.number.isRequired,
  advanced_used: PropTypes.number,
  advanced_total: PropTypes.number
});
```

### Step 3: Error Handling Wrapper

```javascript
// src/lib/errorHandler.js
export class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

export function handleAPIError(error) {
  if (error.response) {
    // Server responded with error
    return new APIError(
      error.response.data.message || 'Server error',
      error.response.status,
      error.response.data
    );
  } else if (error.request) {
    // Request made but no response
    return new APIError(
      'Network error - please check your connection',
      0,
      { request: error.request }
    );
  } else {
    // Something else happened
    return new APIError(
      error.message || 'An unexpected error occurred',
      -1,
      { originalError: error }
    );
  }
}

export function getUserFriendlyMessage(error) {
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        return 'Please log in to continue';
      case 403:
        return 'You don\'t have permission to do that';
      case 404:
        return 'The requested resource was not found';
      case 429:
        return 'Too many requests - please try again later';
      case 500:
        return 'Server error - our team has been notified';
      default:
        return error.message;
    }
  }
  return 'An unexpected error occurred';
}
```

### Step 4: Loading State Component

```javascript
// src/components/LoadingState.jsx
import PropTypes from 'prop-types';

export default function LoadingState({ message = 'Loading...', size = 'medium' }) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}`}></div>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
}

LoadingState.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};
```

## Files Created

1. ✅ `CODE_CLEANUP_PLAN.md` - This file
2. ⏳ `cleanup-files.sh` - File replacement script
3. ⏳ `src/lib/propTypes.js` - Common PropTypes
4. ⏳ `src/lib/errorHandler.js` - Error handling utilities
5. ⏳ `src/components/LoadingState.jsx` - Loading component
6. ⏳ `src/components/ErrorBoundary.jsx` - Error boundary component

## Testing Checklist

- [ ] All pages load without errors
- [ ] PropTypes warnings resolved
- [ ] Error states display correctly
- [ ] Loading states show appropriately
- [ ] No console errors
- [ ] All routes work
- [ ] Authentication still works
- [ ] PT tracking still works

## Metrics

**Before Cleanup:**
- Duplicate files: 8
- Files without PropTypes: ~20
- API calls without error handling: ~15
- Missing loading states: ~10

**After Cleanup:**
- Duplicate files: 0 ✅
- Files without PropTypes: 0 (target)
- API calls with proper error handling: 100% (target)
- Loading states: 100% (target)

## Status

- [x] Analysis complete
- [ ] File replacement
- [ ] PropTypes addition
- [ ] Error handling
- [ ] Testing
- [ ] Documentation update

**Estimated Completion:** 30 pts

