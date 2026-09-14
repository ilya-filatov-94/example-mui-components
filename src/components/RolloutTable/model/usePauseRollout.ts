import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Rollout, RolloutPage } from '../types';

export function usePauseRollout(queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rolloutId: number) =>
      axios
        .post<Rollout>(`/api/rollouts/${rolloutId}/pause`)
        .then(res => res.data),

    meta: {
      errorMessage: 'Не удалось приостановить тираж',
    },

    onSuccess: updated => {
      queryClient.setQueryData<RolloutPage>(queryKey, prev => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.map(r =>
            r.rolloutId === updated.rolloutId ? { ...r, ...updated } : r,
          ),
        };
      });
    },
  });
}
