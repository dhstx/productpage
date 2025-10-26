"use client";
import React from "react";

export default function BackButton() {
  function handleClick() {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Go back"
      className="back-btn"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
