'use client';

import { ReactNode, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/config/react-query.config';

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [client] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
}
