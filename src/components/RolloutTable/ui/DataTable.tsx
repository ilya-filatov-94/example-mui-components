import { Fragment } from 'react';
import styled from 'styled-components';
import type { DataTableProps } from '../typesDataTable';

/* ---------- Стили ---------- */

const Wrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table<{ $minWidth: number }>`
  width: 100%;
  min-width: ${p => p.$minWidth}px;
  border-collapse: collapse;
  table-layout: fixed;
`;

const Th = styled.th<{ $align: 'left' | 'center' | 'right' }>`
  padding: 10px 12px;
  text-align: ${p => p.$align};
  font-size: 13px;
  font-weight: 600;
  color: #455a64;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;

  /* Заголовки переносятся по строкам */
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
  line-height: 1.3;
  vertical-align: middle;
`;

const Td = styled.td<{ $align: 'left' | 'center' | 'right' }>`
  padding: 10px 12px;
  text-align: ${p => p.$align};
  font-size: 13px;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: middle;

  /* Ячейки — одна строка с троеточием */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ExpandCell = styled.td`
  padding: 0 8px;
  border-bottom: 1px solid #e0e0e0;
  width: 40px;
  text-align: center;
  vertical-align: middle;
`;

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
  color: #546e7a;
  font-size: 10px;
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

const NestedCell = styled.td<{ $colSpan: number }>`
  padding: 0;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
`;

const Empty = styled.div`
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: #999;
`;

/* ---------- Компонент ---------- */

export function DataTable<T>({
  data,
  columns,
  getRowId,
  isRowExpandable,
  renderExpandedRow,
  expandedIds,
  onToggleExpand,
  minWidth = 600,
}: DataTableProps<T>) {
  if (!data.length) return <Empty>Нет данных</Empty>;

  const hasExpansion = Boolean(renderExpandedRow);
  const totalCols = columns.length + (hasExpansion ? 1 : 0);

  return (
    <Wrapper>
      <Table $minWidth={minWidth}>
        <colgroup>
          {hasExpansion && <col style={{ width: '40px' }} />}
          {columns.map(col => (
            <col
              key={col.key}
              style={col.width ? { width: col.width } : undefined}
            />
          ))}
        </colgroup>

        <thead>
          <tr>
            {hasExpansion && <Th $align="center" />}
            {columns.map(col => (
              <Th
                key={col.key}
                $align={col.align ?? 'left'}
              >
                {col.title}
              </Th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => {
            const id = getRowId(row);
            const isExpandable = isRowExpandable ? isRowExpandable(row) : true;
            const isExpanded = expandedIds?.has(id) ?? false;

            return (
              <Fragment key={id}>
                <tr>
                  {hasExpansion && (
                    <ExpandCell>
                      <ToggleButton
                        type="button"
                        disabled={!isExpandable}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
                        onClick={() => onToggleExpand?.(id)}
                      >
                        <Chevron $open={isExpanded}>▶</Chevron>
                      </ToggleButton>
                    </ExpandCell>
                  )}

                  {columns.map(col => (
                    <Td
                      key={col.key}
                      $align={col.align ?? 'left'}
                    >
                      {col.renderCell(row, rowIndex)}
                    </Td>
                  ))}
                </tr>

                {hasExpansion && isExpanded && isExpandable && (
                  <tr>
                    <NestedCell
                      $colSpan={totalCols}
                      colSpan={totalCols}
                    >
                      {renderExpandedRow!(row)}
                    </NestedCell>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </Table>
    </Wrapper>
  );
}
