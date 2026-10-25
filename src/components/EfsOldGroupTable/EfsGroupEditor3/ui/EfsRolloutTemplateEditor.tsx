import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { Loader } from '@/shared/ui/Loader';
import { EmptyData } from '@/shared/ui/EmptyData';
import { DataTable } from '@/shared/ui/DataTable';
import { useEfsGroupsQuery, groupRawToGroups } from '@/entities/efs-group';
import {
  useEfsRolloutTemplateQuery,
  useSaveEfsRolloutTemplateMutation,
} from '../api';
import {
  buildTemplateRows,
  isValidDelay,
  toSavePayload,
} from '../model/rollout-template.utils';
import { useScheduledTimeEditing } from '../model/useScheduledTimeEditing';
import { useDelayEditing } from '../model/useDelayEditing';
import type {
  EfsRolloutTemplateEditorProps,
  TemplateRow,
} from '../model/types';
import { useTemplateColumns } from './columns';
import {
  ActionButtonWrapper,
  BottomActions,
  EmptyText,
  LoaderWrapper,
} from './styles';

export const ScrollableTableWrapper = styled.div`
  max-height: min(520px, 60vh);
  overflow-y: auto;
  overflow-x: hidden;

  thead th {
    position: sticky;
    top: 0;
    z-index: 2;
  }
`;

export function EfsRolloutTemplateEditor({
  chosenSystem,
  chosenStand,
}: EfsRolloutTemplateEditorProps) {
  const ci = chosenSystem?.serviceManagerId;
  const stand = chosenStand ?? undefined;

  const groupsQuery = useEfsGroupsQuery(ci, stand);
  const templateQuery = useEfsRolloutTemplateQuery(ci, stand);
  const saveMutation = useSaveEfsRolloutTemplateMutation(ci ?? '', stand ?? '');

  const groups = useMemo(
    () => (groupsQuery.data ? groupRawToGroups(groupsQuery.data) : []),
    [groupsQuery.data],
  );

  const templateRows = useMemo(
    () => buildTemplateRows(groups, templateQuery.data ?? []),
    [groups, templateQuery.data],
  );

  // ── Draft-стейт (рабочая копия поверх query-данных) ────
  const [scheduledTime, setScheduledTime] = useState('');
  const [delayHoursByGroupId, setDelayHoursByGroupId] = useState<
    Record<string, number | ''>
  >({});

  useEffect(() => {
    if (templateRows.length === 0) {
      setScheduledTime('');
      setDelayHoursByGroupId({});
      return;
    }
    const firstRow = templateRows[0];
    setScheduledTime(firstRow?.scheduledTime ?? '');

    const delays: Record<string, number | ''> = {};
    templateRows.forEach((row, index) => {
      if (index > 0) {
        delays[row.groupId] =
          row.delayMinutes !== null ? row.delayMinutes / 60 : '';
      }
    });
    setDelayHoursByGroupId(delays);
  }, [templateRows]);

  // ── Хуки редактирования ────────────────────────────────
  const handleScheduledTimeSave = useCallback((value: string) => {
    setScheduledTime(value);
  }, []);

  const handleDelaySave = useCallback((groupId: string, hours: number) => {
    setDelayHoursByGroupId(prev => ({ ...prev, [groupId]: hours }));
  }, []);

  const scheduledTimeEditing = useScheduledTimeEditing(
    scheduledTime,
    handleScheduledTimeSave,
  );
  const delayEditing = useDelayEditing(delayHoursByGroupId, handleDelaySave);

  // Сбрасываем открытые редакторы при изменении набора строк
  const resetScheduledTime = scheduledTimeEditing.reset;
  const resetDelay = delayEditing.reset;
  useEffect(() => {
    resetScheduledTime();
    resetDelay();
  }, [templateRows, resetScheduledTime, resetDelay]);

  // ── Валидация формы ────────────────────────────────────
  const isTemplateValid = useMemo(() => {
    if (
      templateRows.length === 0 ||
      !scheduledTime ||
      scheduledTimeEditing.isEditing ||
      delayEditing.editingId !== null
    ) {
      return false;
    }
    return templateRows
      .slice(1)
      .every(row =>
        isValidDelay(String(delayHoursByGroupId[row.groupId] ?? '')),
      );
  }, [
    templateRows,
    scheduledTime,
    scheduledTimeEditing.isEditing,
    delayEditing.editingId,
    delayHoursByGroupId,
  ]);

  // ── Колонки ────────────────────────────────────────────
  const columns = useTemplateColumns({
    scheduledTime,
    scheduledTimeEditing,
    delayEditing,
    delayHoursByGroupId,
  });

  // ── Действия ───────────────────────────────────────────
  const handleApply = useCallback(() => {
    if (!isTemplateValid || !ci || !stand) return;
    saveMutation.mutate(
      toSavePayload(
        ci,
        stand,
        templateRows,
        scheduledTime,
        delayHoursByGroupId,
      ),
    );
  }, [
    isTemplateValid,
    ci,
    stand,
    templateRows,
    scheduledTime,
    delayHoursByGroupId,
    saveMutation,
  ]);

  const isLoading = groupsQuery.isLoading || templateQuery.isLoading;
  const isSaving = saveMutation.isPending;

  if (!ci || !stand) {
    return (
      <EmptyData label="Выберите КЭ и стенд для отображения шаблона тиража" />
    );
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
      {templateRows.length === 0 ? (
        <EmptyText>Группы ЕФС не найдены</EmptyText>
      ) : (
        <ScrollableTableWrapper>
          <DataTable<TemplateRow>
            data={templateRows}
            columns={columns}
            getRowId={row => row.groupId}
            minWidth={900}
          />
        </ScrollableTableWrapper>
      )}

      <BottomActions>
        <ActionButtonWrapper>
          <Button
            loading={isSaving}
            disabled={!isTemplateValid || isSaving}
            onClick={handleApply}
          >
            Применить изменения
          </Button>
        </ActionButtonWrapper>
      </BottomActions>
    </>
  );
}
