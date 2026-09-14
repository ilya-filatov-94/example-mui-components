// src/pages/rollouts/RolloutsPage.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RolloutTable } from '@/features/rollouts/ui/RolloutTable';
import type { RolloutPage } from '@/features/rollouts/types';

export function RolloutsPage() {
  const [page, setPage] = useState(0);
  const queryKey = ['rollouts', page] as const;

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      axios
        .get<RolloutPage>('/api/rollouts', { params: { page } })
        .then(r => r.data),
  });

  if (isLoading) return <div style={{ padding: 24 }}>Загрузка…</div>;
  if (isError || !data)
    return <div style={{ padding: 24 }}>Ошибка загрузки</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Тиражи</h1>
      <RolloutTable
        data={data}
        queryKey={queryKey}
      />
    </div>
  );
}
