import { useCallback } from 'react';

export function createFlatArrayForTableStatuses(statusesObj) {
  if (!Object.keys(statusesObj)?.length) {
    return '';
  }

  let resultArrayStatusesByServers = [];

  return function closureFunc() {
    if (!resultArrayStatusesByServers?.length) {
      for (const [standName, serverStatuses] of Object.entries(
        statusesObj.stands,
      )) {
        for (const [serverName, statusServerData] of Object.entries(
          serverStatuses.servers,
        )) {
          resultArrayStatusesByServers.push({
            name: `${standName}-${serverName}`,
            statusData: statusServerData,
          });
        }
      }

      resultArrayStatusesByServers = [...resultArrayStatusesByServers].sort();
    }

    return resultArrayStatusesByServers;
  };
}

const WIDTH_CELL_TABLE = 180;

function StatusesServersByStndApiMesh({ statusesObj, mapForStatusData }) {
  const resultArrayStatusesByServers = useCallback(
    createFlatArrayForTableStatuses(statusesObj),
    [],
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 0,
      }}
    >
      {resultArrayStatusesByServers?.()?.map((itemStand, indexStand) => (
        <div
          key={`${itemStand.name}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            key={`${itemStand.name}-0`}
            style={{
              padding: '5px',
              width: `${WIDTH_CELL_TABLE}px`,
              backgroundColor: '#ddd',
              color: '#000',
              borderBottom: '1px solid #000',
              borderTop: '1px solid #000',
              borderRight: '1px solid #000',
              borderLeft: indexStand === 0 ? '1px solid #000' : undefined,
            }}
          >
            <div>{mapStands?.[itemStand?.name] || '-'}</div>
          </div>
          <div
            key={`${itemStand?.name}-1`}
            style={{
              padding: '5px',
              width: `${WIDTH_CELL_TABLE}px`,
              backgroundColor: '#fff',
              color: '#000',
              borderBottom: '1px solid #000',
              borderRight: '1px solid #000',
              borderLeft: indexStand === 0 ? '1px solid #000' : undefined,
            }}
          >
            <div>
              {mapForStatusData?.[itemStand?.statusData?.status] || '-'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
