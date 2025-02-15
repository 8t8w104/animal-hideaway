'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorMessageComponent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message');

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>エラーが発生しました</h1>
        {errorMessage && (
          <p style={{ fontSize: '2rem', color: 'red' }}>
            {decodeURIComponent(errorMessage)}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorMessageComponent />
    </Suspense>
  );
}
