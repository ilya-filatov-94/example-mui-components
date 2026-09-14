import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RolloutTable } from '../ui/RolloutTable';
import type { RolloutPage } from '../types';

export function RolloutsPage() {
  const [page, setPage] = useState(0);
  const queryKey = ['rollouts', page] as const;

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      axios
        .get<RolloutPage>('/api/rollouts', { params: { page } })
        .then(r => r.data),
  });

  if (isLoading || !data) return <div>Загрузка…</div>;

  return (
    <>
      <RolloutTable
        data={data}
        queryKey={queryKey}
      />
      {/* Пагинация — отдельным компонентом */}
    </>
  );
}
