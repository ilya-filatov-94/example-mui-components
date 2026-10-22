import type { ReactNode } from 'react';

export type CellAlign = 'left' | 'center' | 'right';

export interface DataTableColumn<T> {
  key: string;
  title: ReactNode;
  width?: string;
  align?: CellAlign;
  renderCell: (row: T, rowIndex: number) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string | number;
  minWidth?: number;
  emptyText?: string;
  isRowExpandable?: (row: T) => boolean;
  renderExpandedRow?: (row: T) => ReactNode;
  expandedIds?: Set<string | number>;
  onToggleExpand?: (id: string | number) => void;
}
