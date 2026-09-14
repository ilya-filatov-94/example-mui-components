import type { Stage } from '../types';
import { formatDateTime } from '../lib/formatDate';
import { DataTable } from './DataTable';
import { type Column } from '../typesDataTable';
import { StatusBadge } from './StatusBadge';
import { TechInfoCell } from './TechInfoCell';

const columns: Column<Stage>[] = [
  {
    key: 'sequenceNo',
    title: 'Порядковый номер этапа',
    width: '14%',
    renderCell: stage => stage.sequenceNo,
  },
  {
    key: 'blockCodes',
    title: 'Состав группы',
    width: '20%',
    renderCell: stage => stage.blockCodes.join(', '),
  },
  {
    key: 'sheduledTs',
    title: 'Заданное время старта',
    width: '16%',
    renderCell: stage => formatDateTime(stage.sheduledTs),
  },
  {
    key: 'status',
    title: 'Статус',
    width: '12%',
    renderCell: stage => <StatusBadge status={stage.status} />,
  },
  {
    key: 'finishedTs',
    title: 'Время окончания',
    width: '16%',
    renderCell: stage => formatDateTime(stage.finishedTs),
  },
  {
    key: 'techInfo',
    title: 'Тех. Инфо.',
    width: '22%',
    renderCell: stage => <TechInfoCell errorReason={stage.errorReason} />,
  },
];

export function StagesTable({ stages }: { stages: Stage[] }) {
  if (!stages.length) {
    return (
      <div
        style={{
          padding: 12,
          textAlign: 'center',
          color: '#999',
          fontSize: 13,
        }}
      >
        Нет этапов
      </div>
    );
  }

  return (
    <DataTable<Stage>
      data={stages}
      columns={columns}
      getRowId={stage => stage.stageId}
      minWidth={900}
    />
  );
}
