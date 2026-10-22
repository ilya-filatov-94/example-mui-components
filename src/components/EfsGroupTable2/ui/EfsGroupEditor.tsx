import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { Loader } from '@/shared/ui/Loader';
import { EmptyData } from '@/shared/ui/EmptyData';
import {
  useEfsBlocksQuery,
  useEfsGroupsQuery,
  useSaveEfsGroupsMutation,
} from '../api';
import {
  getFreeBlocks,
  groupRawToGroups,
  normalizeSequence,
  toSavePayload,
} from '../EfsGroupEditor';
import { useNameEditing } from '../EfsGroupEditor';
import { useCompositionEditing } from '../EfsGroupEditor';
import type { EfsGroup, EfsGroupEditorProps } from '../EfsGroupEditor';
import { GroupsTable } from './GroupsTable';
import { CreateGroupForm } from './CreateGroupForm';
import { ActionButtonWrapper, BottomActions, LoaderWrapper } from './styles';

export function EfsGroupEditor({
  chosenSystem,
  chosenStand,
}: EfsGroupEditorProps) {
  const ci = chosenSystem?.serviceManagerId;
  const stand = chosenStand ?? undefined;

  const blocksQuery = useEfsBlocksQuery(ci, stand);
  const groupsQuery = useEfsGroupsQuery(ci, stand);
  const saveMutation = useSaveEfsGroupsMutation(ci ?? '', stand ?? '');

  const [draftGroups, setDraftGroups] = useState<EfsGroup[]>([]);

  const editingName = useNameEditing(setDraftGroups);
  const editingNodeCodes = useCompositionEditing(setDraftGroups);

  const editingIds = useMemo(
    () => ({
      editingNameId: editingName.id,
      editingGroupId: editingNodeCodes.id,
    }),
    [editingName.id, editingNodeCodes.id],
  );

  const isEditing =
    editingIds.editingNameId !== null || editingIds.editingGroupId !== null;

  // стабильные reset-функции (useCallback([])) — эффект не перезапустится лишний раз
  const resetNameEditing = editingName.reset;
  const resetCompositionEditing = editingNodeCodes.reset;

  // sync query → draft
  useEffect(() => {
    setDraftGroups(groupsQuery.data ? groupRawToGroups(groupsQuery.data) : []);
    resetNameEditing();
    resetCompositionEditing();
  }, [groupsQuery.data, resetNameEditing, resetCompositionEditing]);

  const blocks = blocksQuery.data ?? [];
  const freeBlocks = useMemo(
    () => getFreeBlocks(blocks, draftGroups),
    [blocks, draftGroups],
  );

  const isSaving = saveMutation.isPending;
  const isLoading = blocksQuery.isLoading || groupsQuery.isLoading;

  const handleMove = useCallback(
    (groupId: string, direction: 'up' | 'down') => {
      setDraftGroups(prev => {
        const idx = prev.findIndex(g => g.groupId === groupId);
        if (idx === -1) return prev;
        const target = direction === 'up' ? idx - 1 : idx + 1;
        if (target < 0 || target >= prev.length) return prev;
        const next = [...prev];
        const [moved] = next.splice(idx, 1);
        next.splice(target, 0, moved);
        return normalizeSequence(next);
      });
    },
    [],
  );

  const { cancelIfEditing: cancelNameIfEditing } = editingName;
  const { cancelIfEditing: cancelCompositionIfEditing } = editingNodeCodes;

  const handleDisband = useCallback(
    (groupId: string) => {
      setDraftGroups(prev =>
        normalizeSequence(prev.filter(g => g.groupId !== groupId)),
      );
      cancelNameIfEditing(groupId);
      cancelCompositionIfEditing(groupId);
    },
    [cancelNameIfEditing, cancelCompositionIfEditing],
  );

  const handleCreate = useCallback((name: string, nodeCodes: string[]) => {
    setDraftGroups(prev => [
      ...prev,
      {
        groupId: `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        groupNm: name,
        seq: prev.length + 1,
        nodeCodes,
      },
    ]);
  }, []);

  const handleApply = useCallback(() => {
    if (!ci || !stand) return;
    saveMutation.mutate({
      ci,
      stand,
      groups: toSavePayload(draftGroups, freeBlocks),
    });
  }, [ci, stand, draftGroups, freeBlocks, saveMutation]);

  const handleCancel = useCallback(() => {
    if (groupsQuery.data) {
      setDraftGroups(groupRawToGroups(groupsQuery.data));
    }
    resetNameEditing();
    resetCompositionEditing();
  }, [groupsQuery.data, resetNameEditing, resetCompositionEditing]);

  const canApply =
    !isEditing &&
    !isSaving &&
    (draftGroups.length > 0 || freeBlocks.length > 0);

  if (!ci || !stand) {
    return <EmptyData label="Выберите КЭ и стенд для отображения групп" />;
  }

  if (isLoading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  return (
    <>
      <GroupsTable
        groups={draftGroups}
        allBlocks={blocks}
        editingName={editingName}
        editingNodeCodes={editingNodeCodes}
        editingIds={editingIds}
        onMove={handleMove}
        onDisband={handleDisband}
      />

      <CreateGroupForm
        freeBlocks={freeBlocks}
        systemName={ci}
        onCreate={handleCreate}
      />

      <BottomActions>
        <ActionButtonWrapper>
          <Button
            disabled={isSaving}
            onClick={handleCancel}
          >
            Отменить изменения
          </Button>
        </ActionButtonWrapper>
        <ActionButtonWrapper>
          <Button
            loading={isSaving}
            disabled={!canApply}
            onClick={handleApply}
          >
            Применить изменения
          </Button>
        </ActionButtonWrapper>
      </BottomActions>
    </>
  );
}
