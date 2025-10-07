use client;

import { login, isAuthenticated } from "../lib/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  function handleLogin() {
    login();
    router.replace("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="text-text-secondary text-sm">
        Mock login only. Replace with a real auth flow.
      </p>
      <button
        onClick={handleLogin}
        className="rounded bg-accent px-4 py-2 text-sm font-medium text-black hover:opacity-90"
      >
        Sign In
      </button>
    </div>
  );
}