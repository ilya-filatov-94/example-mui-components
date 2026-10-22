import { useMemo } from 'react';
import { Button, TextField } from '@mui/material';
import type { DataTableColumn } from '../../DataTable2';
import {
  EfsGroup,
  EditingIds,
  NameEditingState,
  CompositionEditingState,
  getBlockedByOthers,
} from '../EfsGroupEditor';
import { InlineEditField } from './InlineEditField';
import { CompositionMultiSelect } from './CompositionMultiSelect';
import {
  ActionsRow,
  BlockChip,
  ChipsWrapper,
  GroupNameText,
  GroupNameWrapper,
  IconButton,
  MoveButton,
} from './styles';

export interface GroupsColumnsParams {
  groups: EfsGroup[];
  allBlocks: string[];
  editingName: NameEditingState;
  editingNodeCodes: CompositionEditingState;
  editingIds: EditingIds;
  onMove: (groupId: string, direction: 'up' | 'down') => void;
  onDisband: (groupId: string) => void;
}

/* ─────────── Чистые фабрики (для тестов) ─────────── */

export function createSeqColumn(): DataTableColumn<EfsGroup> {
  return {
    key: 'seq',
    title: 'Очередность',
    width: '100px',
    renderCell: row => <span>{row.seq}</span>,
  };
}

export function createNameColumn(
  editing: NameEditingState,
  isEditingId: string | null,
): DataTableColumn<EfsGroup> {
  return {
    key: 'name',
    title: 'Наименование группы',
    width: '240px',
    renderCell: row => {
      if (isEditingId === row.groupId) {
        return (
          <InlineEditField
            onConfirm={() => editing.save(row.groupId)}
            onCancel={editing.cancel}
          >
            <TextField
              autoFocus
              size="small"
              value={editing.value}
              onChange={e => editing.change(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') editing.save(row.groupId);
              }}
              sx={{ width: 160 }}
            />
          </InlineEditField>
        );
      }
      return (
        <GroupNameWrapper>
          <GroupNameText>{row.groupNm}</GroupNameText>
          <IconButton
            type="button"
            onClick={() => editing.start(row)}
          >
            ✎
          </IconButton>
        </GroupNameWrapper>
      );
    },
  };
}

export function createCompositionColumn(
  editing: CompositionEditingState,
  isEditingId: string | null,
  groups: EfsGroup[],
  allBlocks: string[],
): DataTableColumn<EfsGroup> {
  return {
    key: 'composition',
    title: 'Состав группы',
    renderCell: row => {
      if (isEditingId === row.groupId) {
        return (
          <CompositionMultiSelect
            value={editing.value}
            onChange={editing.change}
            options={allBlocks}
            disabledOptions={getBlockedByOthers(groups, row.groupId)}
          />
        );
      }
      return (
        <ChipsWrapper>
          {row.nodeCodes.map(code => (
            <BlockChip key={code}>{code}</BlockChip>
          ))}
          <IconButton
            type="button"
            onClick={() => editing.start(row)}
          >
            ✎
          </IconButton>
        </ChipsWrapper>
      );
    },
  };
}

export function createActionsColumn(
  editing: CompositionEditingState,
  isEditingId: string | null,
  groups: EfsGroup[],
  onMove: GroupsColumnsParams['onMove'],
  onDisband: GroupsColumnsParams['onDisband'],
): DataTableColumn<EfsGroup> {
  return {
    key: 'actions',
    title: '',
    width: '430px',
    renderCell: (row, rowIndex) => {
      if (isEditingId === row.groupId) {
        return (
          <ActionsRow>
            <Button
              disabled={editing.value.length === 0}
              onClick={() => editing.save(row.groupId)}
            >
              Сохранить
            </Button>
            <Button onClick={editing.cancel}>Отмена</Button>
          </ActionsRow>
        );
      }
      return (
        <ActionsRow>
          <Button onClick={() => onDisband(row.groupId)}>Расформировать</Button>
          <MoveButton
            type="button"
            disabled={rowIndex === 0}
            onClick={() => onMove(row.groupId, 'up')}
          >
            ↑
          </MoveButton>
          <MoveButton
            type="button"
            disabled={rowIndex === groups.length - 1}
            onClick={() => onMove(row.groupId, 'down')}
          >
            ⬇
          </MoveButton>
        </ActionsRow>
      );
    },
  };
}

/* ─────────── Хук с мемоизацией по колонкам ─────────── */

export function useGroupsColumns(
  params: GroupsColumnsParams,
): DataTableColumn<EfsGroup>[] {
  const {
    groups,
    allBlocks,
    editingName,
    editingNodeCodes,
    editingIds,
    onMove,
    onDisband,
  } = params;

  // seq — никогда не пересоздаётся
  const seqColumn = useMemo(() => createSeqColumn(), []);

  // name — пересоздаётся только при вводе имени (или смене id)
  const nameColumn = useMemo(
    () => createNameColumn(editingName, editingIds.editingNameId),
    [editingName, editingIds.editingNameId],
  );

  // composition — только при toggle чекбоксов / start-stop / смене данных
  const compositionColumn = useMemo(
    () =>
      createCompositionColumn(
        editingNodeCodes,
        editingIds.editingGroupId,
        groups,
        allBlocks,
      ),
    [editingNodeCodes, editingIds.editingGroupId, groups, allBlocks],
  );

  // actions — то же, что composition (Save/Cancel зависят от composition edit)
  const actionsColumn = useMemo(
    () =>
      createActionsColumn(
        editingNodeCodes,
        editingIds.editingGroupId,
        groups,
        onMove,
        onDisband,
      ),
    [editingNodeCodes, editingIds.editingGroupId, groups, onMove, onDisband],
  );

  return useMemo(
    () => [seqColumn, nameColumn, compositionColumn, actionsColumn],
    [seqColumn, nameColumn, compositionColumn, actionsColumn],
  );
}
