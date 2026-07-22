export const MIN_COLUMN_WIDTH = 60;

// Читает данные о колонках таблицы из localStorage по ключу, если они там есть, то парсит и возвращает их, если нет, то строит объект такого же формата на основании columnDefinition
export function initVisibilityModelFromStorage(storageKey, columnDef) {
  const columnModelFromStorage = JSON.parse(
    localStorage.getItem(storageKey) || '{}',
  );

  if (columnDef?.length) {
    if (Object.keys(columnModelFromStorage).length) {
      return columnModelFromStorage;
    }

    return columnDef?.reduce((result, column) => {
      result[column.field] = {
        visible: true,
        width: column?.minWidth || MIN_COLUMN_WIDTH,
      };
      return result;
    }, {});
  }

  return {};
}

// Создаёт объект с ширинами колонки для рендера, т.к. в рендере используются индексы колонок
export function getDefaultColumnWidths(columnDef, initVisibilityModel) {
  return columnDef?.reduce((resultObjWidths, current, index) => {
    const dataColumnFromStorage = initVisibilityModel?.[current?.field];
    resultObjWidths[index] =
      dataColumnFromStorage?.width || current?.minWidth || MIN_COLUMN_WIDTH;
    return resultObjWidths;
  }, {});
}

// Проверка на существование данными колонки по ключу в localStorage
export function isExistObjectInLocalStorage(storageKey) {
  const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
  return !!Object.keys(data)?.length;
}

// Распределяет ширины колонок с flex = 1, если данные колонок ещё не были сохранены в localStorage
export function calcArrayOfWidthsColumns(columnDef, clientWidth) {
  if (!Array.isArray(columnDef) || columnDef?.length === 0) {
    return [];
  }

  const widthOfColumns = [];
  let newClientWidth = clientWidth;
  let newNumberVisibleColumns = columnDef?.length || 0;
  const objWidth = {};

  if (clientWidth > 0) {
    for (let i = 0; i < columnDef.length; i++) {
      if (!columnDef[i]?.flex) {
        const key = columnDef[i].field;
        objWidth[key] = columnDef[i].minWidth;
        newClientWidth -= columnDef[i].minWidth;
        newNumberVisibleColumns -= 1;
      }
    }
  }

  for (let i = 0; i < columnDef.length; i++) {
    const key = columnDef[i].field;
    let defWidth;

    if (!objWidth[key]) {
      defWidth = Math.max(
        columnDef[i].minWidth,
        newClientWidth / newNumberVisibleColumns,
      );
    } else {
      defWidth = objWidth[key];
    }

    widthOfColumns.push({ field: key, width: defWidth });
  }

  return widthOfColumns;
}

export const decoratorCalcWidthColumnsTable = toolbarStorageKey => {
  let calcWidths;

  return function closureFunc(
    index,
    currentWidthsModel,
    columns,
    clientWidth,
    isCalculatedWidthsColumns,
  ) {
    if (!isCalculatedWidthsColumns.current?.isCompleted) {
      if (!calcWidths) {
        const newColumnDef = calcArrayOfWidthsColumns(columns, clientWidth);

        const columnWidths = newColumnDef?.reduce((result, column) => {
          result[column.field] = {
            width: column?.width || MIN_COLUMN_WIDTH,
            visible: true,
          };
          return result;
        }, {});

        calcWidths = getDefaultColumnWidths(columns, columnWidths);

        if (!isCalculatedWidthsColumns.current?.isCompleted) {
          isCalculatedWidthsColumns.current = {
            isCompleted: false,
            model: { ...calcWidths },
            forStorage: { ...columnWidths },
          };
        }
        localStorage.setItem(toolbarStorageKey, JSON.stringify(columnWidths));
      }
      return calcWidths?.[index];
    }
    return currentWidthsModel[index] || MIN_COLUMN_WIDTH;
  };
};
