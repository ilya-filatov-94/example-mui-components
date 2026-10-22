import { useQuery } from '@tanstack/react-query';
import { addNotification } from '@/shared/lib/notifications';
import { fetchEfsBlocks, fetchEfsGroups } from './api';

export const efsKeys = {
  all: ['efs'] as const,
  blocks: (ci: string, stand: string) =>
    [...efsKeys.all, 'blocks', ci, stand] as const,
  groups: (ci: string, stand: string) =>
    [...efsKeys.all, 'groups', ci, stand] as const,
};

export function useEfsBlocksQuery(ci?: string, stand?: string) {
  return useQuery({
    queryKey: efsKeys.blocks(ci ?? '', stand ?? ''),
    enabled: Boolean(ci && stand),
    staleTime: 5 * 60_000,
    queryFn: async () => {
      try {
        return await fetchEfsBlocks(ci!, stand!);
      } catch (error) {
        addNotification('error', 'Ошибка получения блоков ЕФС');
        throw error;
      }
    },
  });
}

export function useEfsGroupsQuery(ci?: string, stand?: string) {
  return useQuery({
    queryKey: efsKeys.groups(ci ?? '', stand ?? ''),
    enabled: Boolean(ci && stand),
    queryFn: async () => {
      try {
        return await fetchEfsGroups(ci!, stand!);
      } catch (error) {
        addNotification('error', 'Ошибка получения групп');
        throw error;
      }
    },
  });
}
