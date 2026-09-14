import styled from 'styled-components';
import type { Stage } from '../types';
import { formatDateTime } from '../lib/formatDate';
import { StatusBadge } from './StatusBadge';
import { TechInfoCell } from './TechInfoCell';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const Th = styled.th`
  padding: 8px 12px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #455a64;
  background: #fafafa;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 8px 12px;
  font-size: 13px;
  color: #333;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Empty = styled.div`
  padding: 12px;
  text-align: center;
  font-size: 13px;
  color: #999;
  background: #fafafa;
  border-bottom: 1px solid #eee;
`;

export function StagesTable({ stages }: { stages: Stage[] }) {
  if (!stages.length) return <Empty>Нет этапов</Empty>;

  return (
    <Table>
      <colgroup>
        <col style={{ width: '14%' }} />
        <col style={{ width: '20%' }} />
        <col style={{ width: '16%' }} />
        <col style={{ width: '12%' }} />
        <col style={{ width: '16%' }} />
        <col style={{ width: '22%' }} />
      </colgroup>
      <thead>
        <tr>
          <Th>Порядковый номер этапа</Th>
          <Th>Состав группы</Th>
          <Th>Заданное время старта</Th>
          <Th>Статус</Th>
          <Th>Время окончания</Th>
          <Th>Тех. Инфо.</Th>
        </tr>
      </thead>
      <tbody>
        {stages.map(stage => (
          <tr key={stage.stageId}>
            <Td>{stage.sequenceNo}</Td>
            <Td title={stage.blockCodes.join(', ')}>
              {stage.blockCodes.join(', ')}
            </Td>
            <Td>{formatDateTime(stage.sheduledTs)}</Td>
            <Td>
              <StatusBadge status={stage.status} />
            </Td>
            <Td>{formatDateTime(stage.finishedTs)}</Td>
            <Td>
              <TechInfoCell errorReason={stage.errorReason} />
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
