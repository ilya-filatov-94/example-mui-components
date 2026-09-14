import { useCallback, useState } from 'react';
import styled from 'styled-components';
import type { Rollout, RolloutPage } from '../types';
import { formatDateTime } from '../lib/formatDate';
import { usePauseRollout } from '../model/usePauseRollout';
import { DataTable } from './DataTable';
import { type Column } from '../typesDataTable';
import { StatusBadge } from './StatusBadge';
import { StagesTable } from './StagesTable';

/* ---------- Кнопка паузы (используется внутри renderCell) ---------- */

const PauseButton = styled.button`
  background: #d32f2f;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #b71c1c;
  }
  &:disabled {
    background: #e0e0e0;
    color: #999;
    cursor: not-allowed;
  }
`;

/* ---------- Компонент ---------- */

interface Props {
  data: RolloutPage;
  queryKey: readonly unknown[];
}

export function RolloutTable({ data, queryKey }: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const pause = usePauseRollout(queryKey);

  const handleToggle = useCallback((id: string | number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      const numId = id as number;
      next.has(numId) ? next.delete(numId) : next.add(numId);
      return next;
    });
  }, []);

  const columns: Column<Rollout>[] = [
    {
      key: 'index',
      title: '№',
      width: '80px',
      renderCell: (_row, rowIndex) => rowIndex + 1,
    },
    {
      key: 'status',
      title: 'Статус',
      width: '140px',
      renderCell: rollout => <StatusBadge status={rollout.status} />,
    },
    {
      key: 'startTs',
      title: 'Время запуска тиража',
      width: '200px',
      renderCell: rollout => formatDateTime(rollout.startTs),
    },
    {
      key: 'endedTs',
      title: 'Время окончания тиража',
      width: '200px',
      renderCell: rollout => formatDateTime(rollout.endedTs),
    },
    {
      key: 'actions',
      title: '',
      width: '220px',
      align: 'right',
      renderCell: rollout => {
        const canPause = rollout.status === 'RUNNING';
        const isPending =
          pause.isPending && pause.variables === rollout.rolloutId;
        const disabled = !canPause || isPending;

        return (
          <PauseButton
            type="button"
            disabled={disabled}
            title={
              canPause ? '' : 'Тираж нельзя приостановить в текущем статусе'
            }
            onClick={() => pause.mutate(rollout.rolloutId)}
          >
            {isPending ? 'Приостановка…' : 'Приостановить тираж'}
          </PauseButton>
        );
      },
    },
  ];

  return (
    <DataTable<Rollout>
      data={data.content}
      columns={columns}
      getRowId={rollout => rollout.rolloutId}
      minWidth={900}
      isRowExpandable={rollout => rollout.stages.length > 0}
      renderExpandedRow={rollout => <StagesTable stages={rollout.stages} />}
      expandedIds={expandedIds}
      onToggleExpand={handleToggle}
    />
  );
}
