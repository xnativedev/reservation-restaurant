"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin segment error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4 text-center">
      <p className="text-stone-500 text-sm">Something went wrong loading this page.</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-amber-500 text-stone-900 text-sm font-medium rounded-xl hover:bg-amber-400 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}