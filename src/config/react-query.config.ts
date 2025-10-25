'use client';

import { QueryClient } from '@tanstack/react-query';

export const getQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1, // retry once on failure
        refetchOnWindowFocus: false, // don’t auto refetch when switching tabs
        staleTime: 1000 * 60, // 1 minute cache
      },
      mutations: {
        retry: 0, // usually don’t retry mutations
      },
    },
  });
