// import { FC } from 'react';
import { useCallback } from 'react';

const WITH_HORIZONTAL_HEADER_TABLE = 185;
const WIDH_CELL_TABLE = 110;

function getAllPosibleStands(statusesObj) {
  if (!Object.keys(statusesObj || {})?.length) {
    return '';
  }

  let allPossibleStands;

  return function closureFunc() {
    if (!allPossibleStands) {
      allPossibleStands = ['-', ...Object.keys(statusesObj.stands)];
    }

    return allPossibleStands;
  };
}

function getAllPossibleServers(statusesObj) {
  if (!Object.keys(statusesObj || {})?.length) {
    return '';
  }

  let allPossibleServers;

  return function closureFunc() {
    if (!allPossibleServers?.length) {
      const servers = [];

      for (const nameStand of arrayOfStandsPpd) {
        const dataServers = Object.keys(
          statusesObj?.stands?.[nameStand]?.servers || {},
        );

        if (Array.isArray(dataServers) && dataServers?.length) {
          servers.push(...dataServers);
        }
      }

      const uniqServersList = new Set(servers);

      allPossibleServers = ['-', ...Array.from(uniqServersList)];
    }

    return allPossibleServers;
  };
}

const statusesObjs1 = {
  stands: {
    PROM: {
      servers: {
        FL: {
          status: 'CREATED',
          errorMessage: null,
        },
        SIGMA: {
          status: 'RELEASED',
          errorMessage: null,
        },
      },
    },
    PSI: {
      servers: {
        FL: {
          status: 'CREATED',
          errorMessage: null,
        },
        SIGMA: {
          status: 'RELEASED',
          errorMessage: null,
        },
        ESRT: {
          status: 'CREATED',
          errorMessage: null,
        },
      },
    },
    IFT: {
      servers: {
        FL: {
          status: 'CREATED',
          errorMessage: null,
        },
        SIGMA: {
          status: 'RELEASED',
          errorMessage: null,
        },
      },
    },
    NT: {
      servers: {
        FL: {
          status: 'CREATED',
          errorMessage: null,
        },
        SIGMA: {
          status: 'RELEASED',
          errorMessage: null,
        },
        ESRT: {
          status: 'CREATED',
          errorMessage: null,
        },
      },
    },
  },
};

const OttStatusPpdTable = ({
  statusesObjs,
  mapForStatusData,
  mapServers = mapPpdServers,
  minHeightConrnerElem = 0,
}) => {
  const arrayOfStandsPpdForTableStatuses = useCallback(
    getAllPosibleStands(statusesObjs),
    [],
  );
  const arrayOfServersPpdForTableStatuses = useCallback(
    getAllPossibleServers(statusesObjs),
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
      {arrayOfStandsPpdForTableStatuses()?.map((itemStand, columnIndex) => (
        <div
          key={`itemStand-${columnIndex}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            flexDirection: 'column',
          }}
        >
          {arrayOfServersPpdForTableStatuses()?.map((itemServer, rowIndex) => {
            if (rowIndex === 0 && columnIndex === 0) {
              return (
                <div
                  key={`itemServer-${columnIndex}-${rowIndex}`}
                  style={{
                    width: `${WITH_HORIZONTAL_HEADER_TABLE}px`,
                    backgroundColor: '#ddd',
                    color: '#000',
                    padding: '5px',
                    minHeight:
                      minHeightConrnerElem && `${minHeightConrnerElem}px`,
                  }}
                >
                  <div> </div>
                </div>
              );
            }
            if (rowIndex === 0) {
              return (
                <div
                  key={`itemServer-${columnIndex}-${rowIndex}`}
                  style={{
                    padding: '5px',
                    width: `${WIDH_CELL_TABLE}px`,
                    backgroundColor: '#ddd',
                    color: '#000',
                    borderBottom: '1px solid #000',
                    borderTop: '1px solid #000',
                    boderRight: '1px solid #000',
                  }}
                >
                  <div>{mapStands?.[itemStand] || '-'}</div>
                </div>
              );
            }

            if (columnIndex === 0) {
              return (
                <div
                  key={`itemServer-${columnIndex}-${rowIndex}`}
                  style={{
                    padding: '5px',
                    width: `${WITH_HORIZONTAL_HEADER_TABLE}px`,
                    backgroundColor: '#ddd',
                    color: '#000',
                    borderBottom: '1px solid #000',
                    borderTop: '1px solid #000',
                    boderRight: '1px solid #000',
                  }}
                >
                  <div>{mapServers?.[itemServer] || '-'}</div>
                </div>
              );
            }

            return (
              <div
                key={`itemServer-${columnIndex}-${rowIndex}`}
                style={{
                  padding: '5px',
                  width: `${WIDH_CELL_TABLE}px`,
                  backgroundColor: '#ddd',
                  color: '#000',
                  borderBottom: '1px solid #000',
                  boderRight: '1px solid #000',
                }}
              >
                <div>
                  {mapForStatusData?.[
                    statusesObjs?.stands?.[itemStand]?.servers?.[itemServer]
                      ?.status
                  ] || '-'}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default OttStatusPpdTable;
