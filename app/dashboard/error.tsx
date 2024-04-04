'use client';
import { useEffect } from 'react';
 
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
  );
};

export default Error;