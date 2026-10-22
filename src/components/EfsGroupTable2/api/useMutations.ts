import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addNotification } from '@/shared/lib/notifications';
import { saveEfsGroups } from './api';
import { efsKeys } from './useQueries';
import type { SaveEfsGroupsPayload } from '../EfsGroupEditor';

export function useSaveEfsGroupsMutation(ci: string, stand: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveEfsGroupsPayload) => saveEfsGroups(payload),
    onSuccess: () => {
      addNotification('info', 'Группы успешно сохранены');
      queryClient.invalidateQueries({ queryKey: efsKeys.groups(ci, stand) });
    },
    onError: () => {
      addNotification('error', 'Ошибка сохранения групп');
    },
  });
}
