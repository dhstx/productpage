const LS_KEY = "productpage_user";

export function login(user = { name: "Admin User", role: "Admin" }) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LS_KEY, JSON.stringify(user));
    document.cookie = "auth=1; path=/";
  }
  return user;
}

export function logout() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LS_KEY);
    document.cookie = "auth=; Max-Age=0; path=/";
  }
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LS_KEY);
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function isAuthenticated() { return !!getCurrentUser(); }
