import Home from '@/components/HomePage';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
