'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function RefCapture() {
  const params = useSearchParams();
  useEffect(() => {
    const ref = params.get('ref');
    if (ref) sessionStorage.setItem('lx_ref', ref);
  }, [params]);
  return null;
}
