import { useState } from 'react';
import styled from 'styled-components';
import type { Rollout, RolloutPage } from '../types';
import { formatDateTime } from '../lib/formatDate';
import { usePauseRollout } from '../model/usePauseRollout';
import { StatusBadge } from './StatusBadge';
import { StagesTable } from './StagesTable';

/* ---------- Стили ---------- */

const Wrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  table-layout: fixed;
`;

const Th = styled.th`
  padding: 10px 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #455a64;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 10px 12px;
  font-size: 13px;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NestedCell = styled.td`
  padding: 0;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
`;

const ActionCell = styled(Td)`
  text-align: right;
`;

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

/* ---------- Кнопка раскрытия ---------- */

const ToggleButton = styled.button`
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-right: 6px;
  color: #546e7a;
  font-size: 10px;
  vertical-align: middle;
  transition: color 0.15s;

  &:hover:not(:disabled) {
    color: #1976d2;
  }
  &:disabled {
    visibility: hidden;
  }
`;

const Chevron = styled.span<{ $open: boolean }>`
  display: inline-block;
  transform: rotate(${p => (p.$open ? 90 : 0)}deg);
  transition: transform 0.15s;
`;

const IndexCell = styled(Td)`
  display: flex;
  align-items: center;
  padding-left: 12px;
`;

/* ---------- Строка тиража ---------- */

interface RowProps {
  rollout: Rollout;
  index: number;
  queryKey: readonly unknown[];
}

function RolloutRow({ rollout, index, queryKey }: RowProps) {
  const [open, setOpen] = useState(false);
  const pause = usePauseRollout(queryKey);

  const hasStages = rollout.stages.length > 0;
  const canPause = rollout.status === 'RUNNING';
  const disabled = !canPause || pause.isPending;

  return (
    <>
      <tr>
        <Td>
          <ToggleButton
            type="button"
            disabled={!hasStages}
            aria-expanded={open}
            aria-label={open ? 'Свернуть этапы' : 'Развернуть этапы'}
            onClick={() => setOpen(v => !v)}
          >
            <Chevron $open={open}>▶</Chevron>
          </ToggleButton>
          {index + 1}
        </Td>
        <Td>
          <StatusBadge status={rollout.status} />
        </Td>
        <Td>{formatDateTime(rollout.startTs)}</Td>
        <Td>{formatDateTime(rollout.endedTs)}</Td>
        <ActionCell>
          <PauseButton
            type="button"
            disabled={disabled}
            title={
              canPause ? '' : 'Тираж нельзя приостановить в текущем статусе'
            }
            onClick={() => pause.mutate(rollout.rolloutId)}
          >
            {pause.isPending ? 'Приостановка…' : 'Приостановить тираж'}
          </PauseButton>
        </ActionCell>
      </tr>

      {open && hasStages && (
        <tr>
          <NestedCell colSpan={5}>
            <StagesTable stages={rollout.stages} />
          </NestedCell>
        </tr>
      )}
    </>
  );
}

/* ---------- Публичный компонент ---------- */

interface Props {
  data: RolloutPage;
  queryKey: readonly unknown[];
}

export function RolloutTable({ data, queryKey }: Props) {
  if (!data.content.length) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>
        Нет данных
      </div>
    );
  }

  return (
    <Wrapper>
      <Table>
        <colgroup>
          <col style={{ width: '80px' }} />
          <col style={{ width: '140px' }} />
          <col style={{ width: '200px' }} />
          <col style={{ width: '200px' }} />
          <col style={{ width: '220px' }} />
        </colgroup>
        <thead>
          <tr>
            <Th>№</Th>
            <Th>Статус</Th>
            <Th>Время запуска тиража</Th>
            <Th>Время окончания тиража</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {data.content.map((rollout, index) => (
            <RolloutRow
              key={rollout.rolloutId}
              rollout={rollout}
              index={index}
              queryKey={queryKey}
            />
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
}
