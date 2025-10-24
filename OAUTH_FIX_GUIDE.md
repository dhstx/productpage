# OAuth Redirect URI Fix Guide

## Issue

Google OAuth is returning a `redirect_uri_mismatch` error because the authorized redirect URIs don't include the Supabase Auth callback URL.

**Error Message:**
```
Error 400: redirect_uri_mismatch
```

**Actual Redirect URI Being Used:**
```
https://zhxkbnmtwqipgavmjymi.supabase.co/auth/v1/callback
```

---

## Fix for Google OAuth

### Step 1: Open Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your project
3. Click on your OAuth 2.0 Client ID (the one starting with `1027274888681-...`)

### Step 2: Add Supabase Callback URL

1. Scroll to **Authorized redirect URIs**
2. Click **+ ADD URI**
3. Add this exact URL:
   ```
   https://zhxkbnmtwqipgavmjymi.supabase.co/auth/v1/callback
   ```
4. Click **SAVE**

### Step 3: Test Google Login

1. Go to https://dhstx.co/login
2. Click the "Google" button
3. You should be redirected to Google's login page
4. After successful login, you'll be redirected back to your app

---

## Fix for GitHub OAuth

GitHub OAuth likely has the same issue. Here's how to fix it:

### Step 1: Open GitHub OAuth Settings

1. Go to: https://github.com/settings/developers
2. Click on your OAuth App
3. Find the **Authorization callback URL** field

### Step 2: Update Callback URL

1. Change the callback URL to:
   ```
   https://zhxkbnmtwqipgavmjymi.supabase.co/auth/v1/callback
   ```
2. Click **Update application**

### Step 3: Test GitHub Login

1. Go to https://dhstx.co/login
2. Click the "GitHub" button
3. You should be redirected to GitHub's authorization page
4. After authorization, you'll be redirected back to your app

---

## Why This Happened

Supabase Auth handles OAuth callbacks automatically. When you use `supabase.auth.signInWithOAuth()`, Supabase redirects to the OAuth provider (Google/GitHub) with its own callback URL:

```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

This is different from the application callback URL (`/api/auth/callback/google`) that you might use in a custom OAuth implementation.

---

## Summary

**For Google OAuth:**
- Add: `https://zhxkbnmtwqipgavmjymi.supabase.co/auth/v1/callback`

**For GitHub OAuth:**
- Change to: `https://zhxkbnmtwqipgavmjymi.supabase.co/auth/v1/callback`

After making these changes, both Google and GitHub OAuth login will work correctly!

