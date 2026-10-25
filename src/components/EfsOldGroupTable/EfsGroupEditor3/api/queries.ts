import { useQuery } from '@tanstack/react-query';
import { addNotification } from '@/shared/lib/notifications';
import { fetchEfsGroups } from './efs-groups.api';

export const efsGroupsKeys = {
  all: ['efs', 'groups'] as const,
  list: (ci: string, stand: string) =>
    [...efsGroupsKeys.all, ci, stand] as const,
};

export function useEfsGroupsQuery(ci?: string, stand?: string) {
  return useQuery({
    queryKey: efsGroupsKeys.list(ci ?? '', stand ?? ''),
    enabled: Boolean(ci && stand),
    staleTime: 5 * 60_000,
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

export const efsTemplateKeys = {
  all: ['efs', 'rollout-template'] as const,
  list: (ci: string, stand: string) =>
    [...efsTemplateKeys.all, ci, stand] as const,
};

export function useEfsRolloutTemplateQuery(ci?: string, stand?: string) {
  return useQuery({
    queryKey: efsTemplateKeys.list(ci ?? '', stand ?? ''),
    enabled: Boolean(ci && stand),
    queryFn: async () => {
      try {
        return await fetchEfsRolloutTemplate(ci!, stand!);
      } catch (error) {
        addNotification('error', 'Ошибка получения шаблона тиража ЕФС');
        throw error;
      }
    },
  });
}

export function useSaveEfsRolloutTemplateMutation(ci: string, stand: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveTemplatePayload) =>
      saveEfsRolloutTemplate(payload),
    onSuccess: () => {
      addNotification('success', 'Шаблон тиража ЕФС успешно сохранён');
      // Единственный источник серверного состояния — query cache
      queryClient.invalidateQueries({
        queryKey: efsTemplateKeys.list(ci, stand),
      });
    },
    onError: () => {
      addNotification('error', 'Ошибка сохранения шаблона тиража ЕФС');
    },
  });
}
