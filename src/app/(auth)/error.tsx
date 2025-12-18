"use client";

import Button from "@common/Button";

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 text-center">
                {/* Icon */}
                {/* <div className="mb-3">
          <svg
            className="mx-auto h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div> */}

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    Authentication Error
                </h2>

                {/* Message */}
                <p className="text-sm text-gray-600 mb-6">
                    {error.message || "An error occurred during authentication"}
                </p>

                {/* Actions */}
                <div className="space-y-3">
                    <Button onClick={reset} variant="filled" fullWidth>
                        Try again
                    </Button>

                    <Button as="link" href="/" variant="outline" fullWidth>
                        Go to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
