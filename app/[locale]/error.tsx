"use client";

import { useEffect } from "react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="subpage page-gutter flex flex-col items-center justify-center gap-6 min-h-[50vh] text-center">
      <h1 style={{ fontFamily: "var(--display)", fontSize: "clamp(32px, 5vw, 56px)" }}>
        Something went wrong
      </h1>
      <p style={{ color: "var(--ink-soft)" }}>
        We couldn&apos;t load this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="button button-dark"
      >
        Try again
      </button>
    </div>
  );
}