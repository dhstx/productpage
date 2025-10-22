# Authentication Migration Guide

**Date:** October 22, 2025  
**Status:** Ready to Deploy  
**Estimated Points:** 50 pts (Large)

---

## 🎯 Overview

This guide covers the migration from localStorage-based demo authentication to production-ready Supabase Auth with email/password, password reset, session management, and remember me functionality.

## ✅ What Was Implemented

### 1. Core Auth Service (`src/lib/auth/supabaseAuth.js`)

**Authentication:**
- ✅ `signUp()` - User registration with email/password
- ✅ `signIn()` - Login with remember me support
- ✅ `signOut()` - Logout with cleanup

**Password Management:**
- ✅ `sendPasswordResetEmail()` - Send reset link
- ✅ `updatePassword()` - Update password after reset

**Session Management:**
- ✅ `getSession()` - Get current session
- ✅ `getCurrentUser()` - Get current user
- ✅ `refreshSession()` - Refresh expired session
- ✅ `isAuthenticated()` - Check auth status
- ✅ `onAuthStateChange()` - Listen to auth events

**Profile Management:**
- ✅ `getUserProfile()` - Get user from database
- ✅ `updateUserProfile()` - Update user profile
- ✅ `updateUserMetadata()` - Update auth metadata

**Remember Me:**
- ✅ `isRememberMeEnabled()` - Check preference
- ✅ `setRememberMe()` - Set preference

**Utilities:**
- ✅ `getUserTier()` - Get subscription tier
- ✅ `hasFeature()` - Check feature access
- ✅ `getAuthErrorMessage()` - User-friendly errors
- ✅ `resendVerificationEmail()` - Resend verification

### 2. React Context (`src/contexts/AuthContext.jsx`)

- ✅ AuthProvider component
- ✅ useAuth hook
- ✅ Global auth state management
- ✅ Automatic session refresh (every 55 minutes)
- ✅ Auth state persistence
- ✅ Profile loading

### 3. UI Components

**Pages:**
- ✅ `Register.jsx` - User registration
- ✅ `Login-new.jsx` - Login with remember me
- ✅ `ForgotPassword.jsx` - Request password reset
- ✅ `ResetPassword.jsx` - Set new password
- ✅ `AuthCallback.jsx` - Email verification handler

**Components:**
- ✅ `ProtectedRoute-new.jsx` - Route protection with loading state

### 4. Features Implemented

✅ **Email/Password Authentication**
- Registration with email verification
- Login with credentials
- Email confirmation required

✅ **Password Reset Flow**
- Request reset link via email
- Secure token-based reset
- Password update with validation

✅ **Session Management**
- Automatic session refresh
- Session persistence
- Auth state listeners

✅ **Remember Me**
- Persistent login option
- Session-only mode
- Preference storage

✅ **User Profile**
- Database integration
- Profile fetching
- Metadata updates

✅ **Error Handling**
- User-friendly error messages
- Validation feedback
- Loading states

---

## 🚀 Deployment Steps

### Step 1: Update App.jsx

Replace the old auth imports and add new routes:

```jsx
// OLD - Remove these
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// NEW - Add these
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login-new';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute-new';

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap everything in AuthProvider */}
        <Analytics />
        <ScrollHistoryManager />
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          {/* ... other public routes ... */}
          
          {/* Auth Routes - ADD THESE */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes - No changes needed */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* ... other protected routes ... */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}
```

### Step 2: Update Components Using Auth

Replace old auth imports in all components:

**Before:**
```jsx
import { getCurrentUser, isAuthenticated, logout } from '../lib/auth';

const user = getCurrentUser();
const authenticated = isAuthenticated();
logout();
```

**After:**
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, profile, isAuthenticated, signOut } = useAuth();
  
  // Use user, profile, isAuthenticated, signOut
}
```

**Files to Update:**
- `src/pages/Dashboard.jsx`
- `src/pages/Settings.jsx`
- `src/pages/Billing.jsx`
- `src/pages/AgentManagement.jsx`
- `src/pages/Team.jsx`
- Any component using auth

### Step 3: Configure Supabase Auth

**In Supabase Dashboard:**

1. **Enable Email Auth**
   - Go to Authentication → Providers
   - Enable "Email" provider
   - Configure email templates (optional)

2. **Set Redirect URLs**
   - Go to Authentication → URL Configuration
   - Add Site URL: `https://dhstx.co`
   - Add Redirect URLs:
     - `https://dhstx.co/auth/callback`
     - `https://dhstx.co/auth/reset-password`
     - `http://localhost:5173/auth/callback` (for dev)
     - `http://localhost:5173/auth/reset-password` (for dev)

3. **Configure Email Templates** (Optional)
   - Go to Authentication → Email Templates
   - Customize "Confirm signup" template
   - Customize "Reset password" template
   - Customize "Magic Link" template (if using)

### Step 4: Test Authentication Flow

**Test Checklist:**

- [ ] **Registration**
  - [ ] Register new user
  - [ ] Receive verification email
  - [ ] Click verification link
  - [ ] Redirect to dashboard

- [ ] **Login**
  - [ ] Login with correct credentials
  - [ ] Login with wrong credentials (should fail)
  - [ ] Test "Remember me" checkbox
  - [ ] Verify session persists after page reload

- [ ] **Password Reset**
  - [ ] Request password reset
  - [ ] Receive reset email
  - [ ] Click reset link
  - [ ] Set new password
  - [ ] Login with new password

- [ ] **Session Management**
  - [ ] Session persists across page reloads (with remember me)
  - [ ] Session expires without remember me
  - [ ] Automatic session refresh works
  - [ ] Logout clears session

- [ ] **Protected Routes**
  - [ ] Cannot access /dashboard without login
  - [ ] Redirect to login when not authenticated
  - [ ] Redirect back to original page after login

---

## 📁 File Structure

```
src/
├── lib/
│   └── auth/
│       └── supabaseAuth.js          ← Core auth service
├── contexts/
│   └── AuthContext.jsx              ← React context
├── components/
│   └── ProtectedRoute-new.jsx       ← Updated route protection
├── pages/
│   ├── Login-new.jsx                ← Updated login
│   ├── Register.jsx                 ← NEW
│   ├── ForgotPassword.jsx           ← NEW
│   ├── ResetPassword.jsx            ← NEW
│   └── AuthCallback.jsx             ← NEW
└── App.jsx                          ← Update with new routes
```

---

## 🔄 Migration Checklist

### Phase 1: Setup (5 pts)
- [x] Create `supabaseAuth.js` service
- [x] Create `AuthContext.jsx`
- [x] Create new pages (Register, ForgotPassword, etc.)
- [x] Create updated ProtectedRoute

### Phase 2: Integration (20 pts)
- [ ] Update `App.jsx` with AuthProvider and new routes
- [ ] Update all components using old auth
- [ ] Test all auth flows
- [ ] Fix any bugs

### Phase 3: Cleanup (10 pts)
- [ ] Remove old `src/lib/auth.js`
- [ ] Remove old `Login.jsx`
- [ ] Remove old `ProtectedRoute.jsx`
- [ ] Update documentation

### Phase 4: Testing (15 pts)
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test password reset
- [ ] Test remember me
- [ ] Test session refresh
- [ ] Test protected routes
- [ ] Test logout

**Total: 50 points**

---

## 🐛 Troubleshooting

### Issue: "Email not confirmed" error

**Solution:**
- Check Supabase dashboard → Authentication → Users
- Manually confirm user email if needed
- Or disable email confirmation in Auth settings (not recommended for production)

### Issue: Redirect not working after email verification

**Solution:**
- Verify redirect URLs are configured in Supabase
- Check browser console for errors
- Ensure `AuthCallback.jsx` is handling the callback correctly

### Issue: Session not persisting

**Solution:**
- Check if "Remember me" is enabled
- Verify Supabase client has `persistSession: true`
- Check browser localStorage for session data

### Issue: Password reset link not working

**Solution:**
- Verify redirect URL is configured in Supabase
- Check email template has correct redirect URL
- Ensure `ResetPassword.jsx` is checking for valid session

---

## 🔐 Security Considerations

### Implemented Security Features

✅ **Password Requirements**
- Minimum 6 characters (enforced by Supabase)
- Can be increased in Supabase settings

✅ **Email Verification**
- Users must verify email before full access
- Can be disabled for testing (not recommended)

✅ **Session Security**
- Tokens expire after 60 minutes
- Automatic refresh every 55 minutes
- Secure token storage

✅ **Password Reset Security**
- Time-limited reset tokens
- One-time use tokens
- Secure email delivery

### Additional Security Recommendations

🔒 **Add Rate Limiting**
- Limit login attempts
- Limit password reset requests
- Implement CAPTCHA for registration

🔒 **Add Two-Factor Authentication**
- Use Supabase 2FA (coming soon)
- Or integrate third-party 2FA

🔒 **Add Account Recovery**
- Security questions
- Backup email
- Phone verification

---

## 📊 Testing Script

```bash
# Test registration
curl -X POST https://dhstx.co/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'

# Test login
curl -X POST https://dhstx.co/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'

# Test password reset
curl -X POST https://dhstx.co/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

---

## 🎯 Next Steps

After deploying authentication:

1. **Add OAuth Providers** (Google, GitHub)
   - Configure OAuth apps
   - Add OAuth buttons to login page
   - Test OAuth flows

2. **Add Two-Factor Authentication**
   - Implement 2FA setup page
   - Add 2FA verification
   - Add backup codes

3. **Add Account Management**
   - Email change
   - Password change (in settings)
   - Account deletion
   - Export user data

4. **Add Session Management**
   - View active sessions
   - Revoke sessions
   - Session history

5. **Add Security Features**
   - Login history
   - Security alerts
   - Suspicious activity detection

---

## 📚 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [React Auth Best Practices](https://react.dev/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

---

**Status:** ✅ Ready to deploy  
**Points:** 50 pts (Large)  
**Estimated Time:** 2-3 hours to integrate and test

