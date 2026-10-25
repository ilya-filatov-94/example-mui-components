import { useCallback, useMemo, useState } from 'react';

export interface ScheduledTimeEditing {
  isEditing: boolean;
  draft: string;
  start: () => void;
  change: (value: string) => void;
  save: () => void;
  cancel: () => void;
  reset: () => void;
}

/**
 * Состояние редактирования единственной ячейки scheduledTime.
 * @param savedValue — текущее сохранённое значение (из локального draft-стейта)
 * @param onSave — колбэк с валидным новым значением
 */
export function useScheduledTimeEditing(
  savedValue: string,
  onSave: (value: string) => void,
): ScheduledTimeEditing {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const start = useCallback(() => {
    setDraft(savedValue);
    setIsEditing(true);
  }, [savedValue]);

  const cancel = useCallback(() => {
    setDraft('');
    setIsEditing(false);
  }, []);

  const reset = useCallback(() => {
    setDraft('');
    setIsEditing(false);
  }, []);

  const save = useCallback(() => {
    if (!draft) return;
    onSave(draft);
    setDraft('');
    setIsEditing(false);
  }, [draft, onSave]);

  return useMemo(
    () => ({ isEditing, draft, start, change: setDraft, save, cancel, reset }),
    [isEditing, draft, start, save, cancel, reset],
  );
}
