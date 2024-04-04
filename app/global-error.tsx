'use client';

import { useEffect } from 'react';

/**
 * global-error.tsx catches any errors that weren’t caught by other nested error.tsx boundaries.
 * It replaces the root layout when active and so must define its own <html> and <body> tags.
 * Even if a global-error.tsx is defined, it is still recommended to define a root error.tsx whose fallback component 
 * will be rendered within the root layout, which includes globally shared UI and branding.
 */
const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <main className='flex h-full flex-col items-center justify-center'>
          <h2 className='text-center text-red-500'><b>Oh noes!</b></h2>
          <p>{error.message || 'An error has occurred'}</p>
          <button
            className='mt-4 rounded-md bg-amber-700 px-4 py-2 text-sm text-white transition-colors hover:bg-amber-600'
            onClick={
              // Attempt to recover by trying to re-render the route
              () => reset()
            }
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
};

export default Error;