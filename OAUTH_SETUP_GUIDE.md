# OAuth Setup Guide for Google & GitHub

This guide will walk you through creating OAuth 2.0 applications for Google and GitHub to enable social logins on your application.

## 1. Google OAuth 2.0 Setup

### Step 1: Create a Google Cloud Project

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click the project dropdown and select **New Project**.
3.  Enter a **Project name** (e.g., `DHStx Authentication`) and click **Create**.

### Step 2: Configure the OAuth Consent Screen

1.  In the Cloud Console, navigate to **APIs & Services > OAuth consent screen**.
2.  Choose **External** and click **Create**.
3.  Fill in the required information:
    *   **App name:** Your application name (e.g., `DHStx`)
    *   **User support email:** Your support email address.
    *   **Authorized domains:** Add `dhstx.co` and your Vercel deployment domain (e.g., `productpage-161n14t4i-dhstxs-projects-c47b4191.vercel.app`).
    *   **Developer contact information:** Your email address.
4.  Click **Save and Continue**.

### Step 3: Create Credentials

1.  Go to **APIs & Services > Credentials**.
2.  Click **Create Credentials > OAuth client ID**.
3.  Select **Web application** from the dropdown.
4.  Under **Authorized JavaScript origins**, add your application's URLs:
    *   `https://dhstx.co`
    *   `https://productpage-161n14t4i-dhstxs-projects-c47b4191.vercel.app`
5.  Under **Authorized redirect URIs**, add the following:
    *   `https://dhstx.co/api/auth/callback/google`
    *   `https://productpage-161n14t4i-dhstxs-projects-c47b4191.vercel.app/api/auth/callback/google`
6.  Click **Create**.
7.  Copy the **Client ID** and **Client Secret**. You will need these for your environment variables.

## 2. GitHub OAuth App Setup

### Step 1: Create a New OAuth App

1.  Go to your GitHub **Settings > Developer settings > OAuth Apps**.
2.  Click **New OAuth App**.
3.  Fill in the application details:
    *   **Application name:** Your application name (e.g., `DHStx`)
    *   **Homepage URL:** `https://dhstx.co`
    *   **Authorization callback URL:** `https://dhstx.co/api/auth/callback/github`
4.  Click **Register application**.

### Step 2: Get Client ID and Client Secret

1.  On the next page, you will see the **Client ID**.
2.  Click **Generate a new client secret**.
3.  Copy the **Client ID** and the newly generated **Client Secret**. You will need these for your environment variables.

## 3. Update Environment Variables

Add the following environment variables to your Vercel project:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

After adding these environment variables, you will need to redeploy your application for the changes to take effect.

