import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { EfsGroup } from './types';

export interface NameEditingState {
  id: string | null;
  value: string;
  start: (group: EfsGroup) => void;
  change: (name: string) => void;
  save: (groupId: string) => void;
  cancel: () => void;
  cancelIfEditing: (groupId: string) => void;
  reset: () => void;
}

export function useNameEditing(
  setDraftGroups: Dispatch<SetStateAction<EfsGroup[]>>,
): NameEditingState {
  const [id, setId] = useState<string | null>(null);
  const [value, setValue] = useState('');

  const idRef = useRef(id);
  idRef.current = id;

  const start = useCallback((group: EfsGroup) => {
    setId(group.groupId);
    setValue(group.groupNm);
  }, []);

  const cancel = useCallback(() => {
    setId(null);
    setValue('');
  }, []);

  const cancelIfEditing = useCallback((groupId: string) => {
    if (idRef.current === groupId) {
      setId(null);
      setValue('');
    }
  }, []);

  const reset = useCallback(() => {
    setId(null);
    setValue('');
  }, []);

  const save = useCallback(
    (groupId: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      setDraftGroups(prev =>
        prev.map(g => (g.groupId === groupId ? { ...g, groupNm: trimmed } : g)),
      );
      setId(null);
      setValue('');
    },
    [value, setDraftGroups],
  );

  return useMemo(
    () => ({
      id,
      value,
      start,
      change: setValue,
      save,
      cancel,
      cancelIfEditing,
      reset,
    }),
    [id, value, start, save, cancel, cancelIfEditing, reset],
  );
}
