import type { ReactNode } from 'react';

export interface Column<T> {
  /** Уникальный ключ колонки */
  key: string;
  /** Заголовок (строка или JSX) */
  title: ReactNode;
  /** Ширина для <colgroup>, например '200px' или '20%' */
  width?: string;
  /** Выравнивание содержимого */
  align?: 'left' | 'center' | 'right';
  /** Рендер содержимого ячейки */
  renderCell: (row: T, rowIndex: number) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  /** Стабильный id строки — используется как key и для раскрытия */
  getRowId: (row: T) => string | number;

  /** Возвращает true, если у строки есть что раскрывать (кнопка toggle будет активна) */
  isRowExpandable?: (row: T) => boolean;
  /** Рендер содержимого раскрытой строки (обычно вложенная таблица) */
  renderExpandedRow?: (row: T) => ReactNode;

  /** Контролируемое раскрытие */
  expandedIds?: Set<string | number>;
  onToggleExpand?: (id: string | number) => void;

  /** Минимальная ширина таблицы (для горизонтального скролла на узких экранах) */
  minWidth?: number;
}
