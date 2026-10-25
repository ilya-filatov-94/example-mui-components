import { useMemo } from 'react';
import { TextField } from '@mui/material';
import type { DataTableColumn } from '@/shared/ui/DataTable';
import { InlineEditField } from '@/shared/ui/InlineEditField';
import { IconButton } from '@/shared/ui/IconButton';
import { TimePicker } from '@/shared/ui/TimePicker';
import type { TemplateRow } from '../model/types';
import type { ScheduledTimeEditing } from '../model/useScheduledTimeEditing';
import type { DelayEditing } from '../model/useDelayEditing';
import { isValidDelay } from '../model/rollout-template.utils';
import { InlineDisplayRow, InlineDisplayText } from './styles';

interface DisplayWithEditProps {
  text: string;
  onEdit: () => void;
}

function DisplayWithEdit({ text, onEdit }: DisplayWithEditProps) {
  return (
    <InlineDisplayRow>
      <InlineDisplayText>{text}</InlineDisplayText>
      <IconButton
        type="button"
        onClick={onEdit}
        aria-label="Редактировать"
      >
        ✎
      </IconButton>
    </InlineDisplayRow>
  );
}

/* ─────────── Фабрики колонок ─────────── */

export function createGroupNameColumn(): DataTableColumn<TemplateRow> {
  return {
    key: 'groupName',
    title: 'Группа',
    width: '280px',
    renderCell: row => <span>{row.groupNm}</span>,
  };
}

export function createBlocksColumn(): DataTableColumn<TemplateRow> {
  return {
    key: 'blocks',
    title: 'Блок ЕФС',
    width: '280px',
    renderCell: row => {
      if (row.nodeCodes.length === 0) return <span>-</span>;
      return (
        <ChipsCell
          items={row.nodeCodes}
          availableWidth={256} // 280 - padding ячейки
        />
      );
    },
  };
}

export function createScheduledTimeColumn(
  editing: ScheduledTimeEditing,
  scheduledTime: string,
): DataTableColumn<TemplateRow> {
  return {
    key: 'scheduledTime',
    title: 'Время запуска тиража',
    width: '250px',
    renderCell: (_row, rowIndex) => {
      if (rowIndex !== 0) return <span>-</span>;

      if (editing.isEditing) {
        return (
          <InlineEditField
            onConfirm={editing.save}
            onCancel={editing.cancel}
            confirmDisabled={!editing.draft}
          >
            <TimePicker
              value={editing.draft}
              onChange={editing.change}
              autoFocus
              autoBlur={false}
              minWidth={180}
              onEnter={editing.save}
            />
          </InlineEditField>
        );
      }

      return (
        <DisplayWithEdit
          text={scheduledTime || '-'}
          onEdit={editing.start}
        />
      );
    },
  };
}

export function createDelayColumn(
  editing: DelayEditing,
  delayHoursByGroupId: Record<string, number | ''>,
): DataTableColumn<TemplateRow> {
  return {
    key: 'delay',
    title: 'Задержка тиража',
    renderCell: (row, rowIndex) => {
      if (rowIndex === 0) return <span>-</span>;

      if (editing.editingId === row.groupId) {
        return (
          <InlineEditField
            onConfirm={editing.save}
            onCancel={editing.cancel}
            confirmDisabled={!isValidDelay(editing.draft)}
          >
            <TextField
              type="number"
              size="small"
              autoFocus
              value={editing.draft}
              onChange={e => editing.change(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') editing.save();
              }}
              inputProps={{ min: 0, step: 0.5 }}
              sx={{ width: 100 }}
            />
          </InlineEditField>
        );
      }

      const hours = delayHoursByGroupId[row.groupId];
      const text = hours !== '' && hours !== undefined ? `${hours} ч` : '-';
      return (
        <DisplayWithEdit
          text={text}
          onEdit={() => editing.start(row.groupId)}
        />
      );
    },
  };
}

/* ─────────── Хук с мемоизацией ─────────── */

interface UseTemplateColumnsParams {
  scheduledTime: string;
  scheduledTimeEditing: ScheduledTimeEditing;
  delayEditing: DelayEditing;
  delayHoursByGroupId: Record<string, number | ''>;
}

export function useTemplateColumns({
  scheduledTime,
  scheduledTimeEditing,
  delayEditing,
  delayHoursByGroupId,
}: UseTemplateColumnsParams): DataTableColumn<TemplateRow>[] {
  const groupNameColumn = useMemo(() => createGroupNameColumn(), []);
  const blocksColumn = useMemo(() => createBlocksColumn(), []);

  const scheduledTimeColumn = useMemo(
    () => createScheduledTimeColumn(scheduledTimeEditing, scheduledTime),
    [scheduledTimeEditing, scheduledTime],
  );

  const delayColumn = useMemo(
    () => createDelayColumn(delayEditing, delayHoursByGroupId),
    [delayEditing, delayHoursByGroupId],
  );

  return useMemo(
    () => [groupNameColumn, blocksColumn, scheduledTimeColumn, delayColumn],
    [groupNameColumn, blocksColumn, scheduledTimeColumn, delayColumn],
  );
}
