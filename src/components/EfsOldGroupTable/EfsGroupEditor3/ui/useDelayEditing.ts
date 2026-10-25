import { useCallback, useMemo, useState } from 'react';
import { isValidDelay } from './rollout-template.utils';

export interface DelayEditing {
  editingId: string | null;
  draft: string;
  start: (groupId: string) => void;
  change: (value: string) => void;
  save: () => void;
  cancel: () => void;
  reset: () => void;
}

export function useDelayEditing(
  delayHoursByGroupId: Record<string, number | ''>,
  onSave: (groupId: string, hours: number) => void,
): DelayEditing {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const start = useCallback(
    (groupId: string) => {
      const current = delayHoursByGroupId[groupId];
      setDraft(current !== undefined && current !== '' ? String(current) : '');
      setEditingId(groupId);
    },
    [delayHoursByGroupId],
  );

  const cancel = useCallback(() => {
    setEditingId(null);
    setDraft('');
  }, []);

  const reset = useCallback(() => {
    setEditingId(null);
    setDraft('');
  }, []);

  const save = useCallback(() => {
    if (editingId === null || !isValidDelay(draft)) return;
    onSave(editingId, Number(draft));
    setEditingId(null);
    setDraft('');
  }, [editingId, draft, onSave]);

  return useMemo(
    () => ({ editingId, draft, start, change: setDraft, save, cancel, reset }),
    [editingId, draft, start, save, cancel, reset],
  );
}
