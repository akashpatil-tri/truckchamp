"use client";

import Button from "@common/Button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="content-wrapper">
      <div className="content">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 text-center mt-8">
          {/* <div className="mb-4">
                        <svg
                            className="mx-auto h-12 w-12 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div> */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dashboard Error
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message || "An error occurred while loading the dashboard"}
          </p>
          <div className="space-y-3">
            <Button onClick={reset} variant="filled" fullWidth>
              Try again
            </Button>
            <Button as="link" href="/login" variant="outline" fullWidth>
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
