import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AutoSizer, MultiGrid } from 'react-virtualized';

export const MIN_COLUMN_WIDTH = 60;
const WIDTH_OF_SCROLL_THUMB = 10;
const HEADER_HEIGHT = 50;
const ROW_HEIGHT = 50;

// Читает модель видимости/ширины колонок из localStorage или создаёт дефолтную по columnDef
export function initVisibilityModelFromStorage(storageKey, columnDef) {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (columnDef?.length) {
    if (Object.keys(stored).length) return stored;
    return columnDef.reduce((acc, col) => {
      acc[col.field] = {
        visible: true,
        width: col?.minWidth || MIN_COLUMN_WIDTH,
      };
      return acc;
    }, {});
  }
  return {};
}

// Создаёт объект { [индекс колонки]: ширина } для рендера MultiGrid
export function getDefaultColumnWidths(columnDef, visibilityModel) {
  return (
    columnDef?.reduce((acc, col, index) => {
      const stored = visibilityModel?.[col.field];
      acc[index] = stored?.width || col?.minWidth || MIN_COLUMN_WIDTH;
      return acc;
    }, {}) || {}
  );
}

// Распределяет ширины колонок, учитывая flex = 1
export function calcArrayOfWidthsColumns(columnDef, clientWidth) {
  if (!Array.isArray(columnDef) || columnDef.length === 0) return [];

  const fixedWidths = {};
  let remainingWidth = clientWidth;
  let flexibleCount = columnDef.length;

  // Сначала фиксируем ширины колонок без flex
  if (clientWidth > 0) {
    for (const col of columnDef) {
      if (!col.flex) {
        const w = col.minWidth || MIN_COLUMN_WIDTH;
        fixedWidths[col.field] = w;
        remainingWidth -= w;
        flexibleCount--;
      }
    }
  }

  // Оставшееся пространство делим поровну между flex-колонками, но не меньше minWidth
  return columnDef.map(col => {
    const key = col.field;
    let width;
    if (fixedWidths[key] !== undefined) {
      width = fixedWidths[key];
    } else {
      width = Math.max(
        col.minWidth || MIN_COLUMN_WIDTH,
        remainingWidth / flexibleCount,
      );
    }
    return { field: key, width };
  });
}

export const CustomDataGrid = ({
  rows,
  columns,
  toolbarStorageColumnKey,
  isLoading = false,
  fetchDataOnScroll = undefined,
  retryLoadData = false,
  noRowsOverlayText = undefined,
  offsetWidth = 0,
  disableLoadingLastRow = false,
  customHeightOfRow = undefined,
  heightOfTopToolbar = 0,
  onRowClick = undefined,
  onRowDoubleClick = undefined,
}) => {
  // -------------------------------------------
  // Инициализация модели (поля -> { visible, width })
  const initialModel = useMemo(
    () => initVisibilityModelFromStorage(toolbarStorageColumnKey, columns),
    [columns, toolbarStorageColumnKey],
  );
  const [visibilityModel, setVisibilityModel] = useState(initialModel);

  // Ширины для рендера: индекс -> px
  const [widths, setWidths] = useState(() =>
    getDefaultColumnWidths(columns, initialModel),
  );

  // Флаг, были ли данные в localStorage на момент монтирования
  const hasStorageData = useRef(
    Object.keys(
      JSON.parse(localStorage.getItem(toolbarStorageColumnKey) || '{}'),
    ).length > 0,
  );
  const initializedRef = useRef(hasStorageData.current);

  // Текущая ширина контейнера (из AutoSizer)
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  // Состояние перетаскивания
  const [dragState, setDragState] = useState({
    draggingColumn: null,
    dragStart: 0,
    dragStartWidths: {},
  });
  const lastDraggedColumnRef = useRef(null);

  const isEmptyData = rows?.length === 0;

  // -------------------------------------------
  // Сохранение ширины конкретной колонки после перетаскивания
  const saveColumnWidth = useCallback(
    (colIndex, newWidth) => {
      const field = columns[colIndex]?.field;
      if (!field) return;

      setVisibilityModel(prev => {
        const updated = {
          ...prev,
          [field]: {
            visible: prev[field]?.visible ?? true,
            width: Math.max(
              newWidth,
              columns[colIndex]?.minWidth || MIN_COLUMN_WIDTH,
            ),
          },
        };
        localStorage.setItem(toolbarStorageColumnKey, JSON.stringify(updated));
        return updated;
      });
    },
    [columns, toolbarStorageColumnKey],
  );

  // -------------------------------------------
  // Пересчёт ширин и модели при изменении размера контейнера или состава колонок
  const recalcWidths = useCallback(
    (cols, clientWidth, saveToStorage = false) => {
      const effectiveWidth = clientWidth - WIDTH_OF_SCROLL_THUMB - offsetWidth;
      if (effectiveWidth <= 0 || !cols.length) return;

      const newWidthsArr = calcArrayOfWidthsColumns(cols, effectiveWidth);
      const newVisibilityModel = {};

      const newWidths = {};
      cols.forEach((col, index) => {
        const w =
          newWidthsArr.find(item => item.field === col.field)?.width ||
          MIN_COLUMN_WIDTH;
        newWidths[index] = w;
        newVisibilityModel[col.field] = {
          visible: true, // здесь можно учесть видимость из текущей модели, если нужно
          width: w,
        };
      });

      setWidths(newWidths);
      setVisibilityModel(prev => {
        const merged = { ...prev };
        Object.keys(newVisibilityModel).forEach(field => {
          if (merged[field]) {
            merged[field] = {
              ...merged[field],
              width: newVisibilityModel[field].width,
            };
          } else {
            merged[field] = newVisibilityModel[field];
          }
        });
        if (saveToStorage) {
          localStorage.setItem(toolbarStorageColumnKey, JSON.stringify(merged));
        }
        return merged;
      });
    },
    [WIDTH_OF_SCROLL_THUMB, offsetWidth, toolbarStorageColumnKey],
  );

  // Первичный расчёт при отсутствии данных в localStorage
  useEffect(() => {
    if (!initializedRef.current && containerWidth > 0 && columns.length > 0) {
      recalcWidths(columns, containerWidth, true); // сохраняем в localStorage
      initializedRef.current = true;
    }
  }, [containerWidth, columns, recalcWidths]);

  // Реакция на изменение видимости колонок (изменение columns)
  useEffect(() => {
    const currentWidthScreen = containerRef.current?.clientWidth;
    if (initializedRef.current && currentWidthScreen > 0) {
      recalcWidths(columns, currentWidthScreen, true);
    }
  }, [columns, recalcWidths]);

  // -------------------------------------------
  // Обработчики перетаскивания
  const handleMouseDown = useCallback(
    (columnIndex, e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragState({
        draggingColumn: columnIndex,
        dragStart: e.clientX,
        dragStartWidths: { ...widths },
      });
      lastDraggedColumnRef.current = columnIndex;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    },
    [widths],
  );

  const handleMouseMove = useCallback(
    e => {
      const { draggingColumn, dragStart, dragStartWidths } = dragState;
      if (draggingColumn === null) return;

      requestAnimationFrame(() => {
        const deltaX = e.clientX - dragStart;
        const minW = columns[draggingColumn]?.minWidth || MIN_COLUMN_WIDTH;
        const newWidth = Math.max(
          minW,
          dragStartWidths[draggingColumn] + deltaX,
        );
        setWidths(prev => ({ ...prev, [draggingColumn]: newWidth }));
      });
    },
    [dragState, columns],
  );

  const handleMouseUp = useCallback(() => {
    const { draggingColumn } = dragState;
    if (draggingColumn !== null) {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';

      // Сохраняем итоговую ширину
      saveColumnWidth(draggingColumn, widths[draggingColumn]);

      setDragState(prev => ({ ...prev, draggingColumn: null }));
    }
  }, [dragState, widths, saveColumnWidth]);

  // Глобальные слушатели
  useEffect(() => {
    const onMove = e => handleMouseMove(e);
    const onUp = () => handleMouseUp();
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // -------------------------------------------
  // Рендер ячейки
  const cellRenderer = useCallback(
    props => {
      const { rowIndex, key, style } = props;
      // Заголовок
      if (rowIndex === 0) {
        return (
          <HeaderGridCell
            key={`header-${key}`}
            {...props}
            draggingColumn={dragState.draggingColumn}
            handleMouseDown={handleMouseDown}
          />
        );
      }

      // Строка данных
      const dataRow = rows[rowIndex - 1];
      const isLastRow = rowIndex === rows.length;
      return (
        <GridCell
          key={`row-${key}`}
          {...props}
          data={dataRow}
          loading={isLoading && isLastRow && !disableLoadingLastRow}
          onRowClick={
            onRowClick ? () => onRowClick(dataRow, rowIndex - 1) : undefined
          }
          onRowDoubleClick={
            onRowDoubleClick
              ? () => onRowDoubleClick(dataRow, rowIndex - 1)
              : undefined
          }
        />
      );
    },
    [
      rows,
      isLoading,
      disableLoadingLastRow,
      dragState.draggingColumn,
      handleMouseDown,
      onRowClick,
      onRowDoubleClick,
    ],
  );

  // -------------------------------------------
  // Обработчик скролла для подгрузки
  const onSectionRendered = useCallback(
    ({ rowStopIndex }) => {
      if (fetchDataOnScroll && retryLoadData && rowStopIndex === rows.length) {
        fetchDataOnScroll();
      }
    },
    [fetchDataOnScroll, retryLoadData, rows.length],
  );

  // Реакция на ресайз контейнера
  const handleResize = useCallback(() => {
    if (!containerRef.current) return;
    const fullWidth =
      containerRef.current.clientWidth - WIDTH_OF_SCROLL_THUMB - offsetWidth;
    const currentTotalWidth = Object.values(widths).reduce(
      (sum, w) => sum + w,
      0,
    );

    if (fullWidth > currentTotalWidth) {
      recalcWidths(columns, containerRef.current.clientWidth, false);
    }

    gridRef.current?.recomputeGridSize();
  }, [widths, columns, offsetWidth, recalcWidths]);

  // Мемоизированная функция ширины колонки
  const columnWidth = useCallback(
    ({ index }) => widths[index] || MIN_COLUMN_WIDTH,
    [widths],
  );

  const rowHeight = useCallback(
    ({ index }) =>
      index === 0 ? HEADER_HEIGHT : customHeightOfRow || ROW_HEIGHT,
    [customHeightOfRow],
  );

  // -------------------------------------------
  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        cursor: dragState.draggingColumn !== null ? 'col-resize' : 'default',
        userSelect: dragState.draggingColumn !== null ? 'none' : 'auto',
        height: `calc(100% - ${heightOfTopToolbar}px)`,
        width: '100%',
      }}
    >
      <AutoSizer onResize={handleResize}>
        {({ width, height }) => {
          // Сохраняем актуальную ширину для эффектов
          if (width !== containerWidth) {
            setContainerWidth(width);
          }

          return (
            <>
              <MultiGrid
                ref={gridRef}
                overscanColumnCount={5}
                overscanRowCount={5}
                cellRenderer={cellRenderer}
                fixedRowCount={1}
                height={isEmptyData ? HEADER_HEIGHT : height}
                width={width - offsetWidth}
                columnCount={columns.length}
                columnWidth={columnWidth}
                rowCount={rows.length + 1}
                rowHeight={rowHeight}
                onSectionRendered={onSectionRendered}
                scrollToColumn={dragState.draggingColumn ?? undefined}
                style={{ outline: 'none' }}
              />
              {isLoading && isEmptyData && <Loader />}
              {!isLoading && isEmptyData && <EmptyDataIcon />}
              {isLoading && !isEmptyData && <Loader />}
            </>
          );
        }}
      </AutoSizer>
    </div>
  );
};
