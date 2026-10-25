import { TextField } from '@mui/material';
import { useEffect, useMemo } from 'react';

export function EfsGroupEditor1({ chosenSystem, chosenStand }) {
  const [groups, setGroups] = useState([]);
  const [template, setTemplate] = useState([]);

  const [isLoadingGroups, setLoadingGroups] = useState(false);
  const [isLoadingTemplate, setLoadingTemplate] = useState(false);
  const [isSavingTemplate, setSavingTemplate] = useState(false);

  const [scheduledTime, setScheduledTime] = useState('');
  const [editingScheduledTime, setEditingScheduledTime] = useState('');
  const [isEditingScheduledTIme, setEditingScheduledTimeState] =
    useState(false);

  const [delayHoursByGroupId, setDelayHoursByGroupId] = useState({});
  const [editingDelayGroupId, setEditingDelayGroupId] = useState(null);
  const [editingDelayValue, setEditingDelayValue] = useState('');

  const groupedData = useMemo(() => {
    const groupedMap = new Map();

    groups.forEach(item => {
      if (!groupedMap.has(item.groupId)) {
        groupedMap.set(item.groupId, {
          groupId: item.groupId,
          groupNm: item.groupNm,
          seq: item.seq,
          nodeCodes: [],
        });
      }

      if (item.nodeCode) {
        groupedMap.get(item.groupId).nodeCodes.push(item.nodeCode);
      }
    });

    return Array.from(groupedMap.values()).sort(
      (firstGroup, secondGroup) => firstGroup.seq - secondGroup.seq,
    );
  }, [groups]);

  const normalizeNodeCodes = nodeCode => [...nodeCodes].sort().join('|');

  const templateRows = useMemo(() => {
    if (groupedData.length === 0) {
      return [];
    }

    const rows = groupedData.map(group => {
      const templateStage = template.find(
        stage =>
          normalizeNodeCodes(stage.nodeCodes || []) ===
          normalizeNodeCodes(group.nodeCodes),
      );

      return {
        ...group,
        templateSeq: templateStage?.seq ?? group.seq,
        scheduledTime: templateStage?.scheduledTime ?? null,
        delayMinutes: templateStage?.delayMinutes ?? null,
      };
    });

    return rows.sort(
      (firstRow, secondRow) => firstRow.templateSeq - secondRow.templateSeq,
    );
  }, [groupedData, template]);

  useEffect(() => {
    if (!chosenSystem?.serviceManagerId || !chosenStand) {
      setGroups([]);
      setTemplate([]);
      setScheduledTime('');
      setEditingScheduledTime('');
      setEditingScheduledTimeState(false);
      setDelayHoursByGroupId({});
      setEditingDelayGroupId(null);
      setEditingDelayValue('');

      return;
    }

    getEfsGroups(
      chosenSystem.serviceManagerId,
      chosenStand,
      setGroups,
      setLoadingGroups,
    );
    getEfsRolloutTemplate(
      chosenSystem.serviceManagerId,
      chosenStand,
      setTemplate,
      setLoadingTemplate,
    );
  }, [chosenSystem, chosenStand]);

  useEffect(() => {
    if (templateRows.length === 0) {
      setScheduledTime('');
      setDelayHoursByGroupId({});
      setEditingDelayGroupId(null);
      setEditingDelayValue('');

      return;
    }

    const firstRow = templateRows[0];

    setScheduledTime(firstRow?.scheduledTime || '');

    const delays = {};

    templateRows.forEach((row, index) => {
      if (index > 0) {
        delays[row.groupId] =
          row.delayMinutes !== null ? row.delayMinutes / 60 : '';
      }
    });

    setDelayHoursByGroupId(delays);
    setEditingDelayGroupId(null);
    setEditingDelayValue('');
  }, [templateRows]);

  const reloadTemplate = () => {
    if (!chosenSystem?.serviceManagerId || !chosenStand) {
      return;
    }

    getEfsRolloutTemplate(
      chosenSystem.serviceManagerId,
      chosenStand,
      setTemplate,
      setLoadingTemplate,
    );
  };

  const handleStartScheduledTimeEdit = () => {
    setEditingScheduledTime(scheduledTime);
    setEditingScheduledTimeState(true);
  };

  const handleCancelScheduledTimeEdit = () => {
    setEditingScheduledTime('');
    setEditingScheduledTimeState(false);
  };

  const handleSaveScheduledTimeEdit = () => {
    if (!editingScheduledTime) {
      return;
    }

    setScheduledTime(editingScheduledTime);
    setEditingScheduledTimeState(false);
  };

  const handleStartDelayEdit = groupId => {
    setEditingDelayGroupId(groupId);
    setEditingDelayValue(delayHoursByGroupId[groupId] ?? '');
  };

  const handleCancelDelayEdit = () => {
    setEditingDelayGroupId(null);
    setEditingDelayValue('');
  };

  const handleSaveDelayEdit = groupId => {
    if (editingDelayValue === '') {
      return;
    }

    const numericValue = Number(editingDelayValue);

    if (
      Number.isNaN(numericValue) ||
      numericValue < 0 ||
      numericValue % 0.5 !== 0
    ) {
      return;
    }

    setDelayHoursByGroupId(currentValue => ({
      ...currentValue,
      [groupId]: numericValue,
    }));

    setEditingDelayGroupId(null);
    setEditingDelayValue('');
  };

  const isTemplateValid = useMemo(() => {
    if (
      templateRows.length === 0 ||
      !scheduledTime ||
      isEditingScheduledTIme ||
      editingDelayGroupId !== null
    ) {
      return false;
    }

    return templateRows.slice(1).every(row => {
      const delayHours = delayHoursByGroupId[row.groupId];
      const numericDelayHours = Number(delayHours);

      return (
        delayHours !== '' &&
        delayHours !== undefined &&
        !Number.isNaN(numericDelayHours) &&
        numericDelayHours >= 0 &&
        numericDelayHours % 0.5 === 0
      );
    });
  }, [
    delayHoursByGroupId,
    editingDelayGroupId,
    isEditingScheduledTIme,
    scheduledTime,
    templateRows,
  ]);

  const handleApplyChanges = () => {
    if (!isTemplateValid) {
      return;
    }

    const stages = templateRows.map((row, index) => {
      if (index === 0) {
        return {
          groupId: row.groupId,
          sequenceNo: index + 1,
          delayMinutes: null,
          scheduledTime,
        };
      }

      return {
        groupId: row.groupId,
        sequenceNo: index + 1,
        delayMinutes: Math.round(Number(delayHoursByGroupId[row.groupId]) * 60),
        scheduledTime: null,
      };
    });

    const request = {
      ci: chosenSystem.serviceManagerId,
      stand: chosenStand,
      stages,
    };

    saveEfsRolloutTemplate(request, setSavingTemplate, reloadTemplate);
  };

  const renderDelayCell = (row, index) => {
    if (index === 0) {
      return <span>-</span>;
    }

    if (editingDelayGroupId === row.groupId) {
      return (
        <EditingTimeWrapper>
          <TextField
            value={editingDelayValue}
            onChange={event => setEditingDelayValue(event.target.value)}
            size="small"
            type="number"
            inputProps={{
              min: 0,
              step: 0.5,
            }}
            sx={{
              width: '100px',
            }}
          />

          <ConfirmButton
            type="button"
            onClick={() => handleSaveDelayEdit(row.groupId)}
          >
            ✓
          </ConfirmButton>

          <CancelButton
            type="button"
            onClick={handleCancelDelayEdit}
          >
            ❌
          </CancelButton>
        </EditingTimeWrapper>
      );
    }

    const delayHours = delayHoursByGroupId[row.groupId];
    const delayText =
      delayHours !== '' && delayHours !== undefined ? `${delayHours} ч` : '-';

    return (
      <ScheduledTimeWrapper>
        <ScheduledTimeText>{delayText}</ScheduledTimeText>

        <EditIconButton
          type="button"
          onClick={() => handleStartDelayEdit(row.groupId)}
        >
          ✎
        </EditIconButton>
      </ScheduledTimeWrapper>
    );
  };

  const isLoading = isLoadingGroups || isLoadingTemplate;

  if (isLoading) {
    return (
      <WrapperLoader>
        <LoaderCircle />
      </WrapperLoader>
    );
  }

  if (!chosenSystem?.serviceManagerId || !chosenStand) {
    return <EmptyData label="Выберите КЭ и стенд для отображения групп" />;
  }

  return (
    <>
      <TemplateTableHeader>
        <div>Группа</div>
        <div>Блок ЕФС</div>
        <div>Время запуска тиража</div>
        <div>Задержка тиража</div>
      </TemplateTableHeader>

      {templateRows.length === 0 ? (
        <EmptyText>Группы ЕФС не найдены</EmptyText>
      ) : (
        templateRows.map((row, index) => (
          <TemplateRow key={row.groupId}>
            <GroupName>{row.groupNm}</GroupName>

            <Blocks>{row.nodeCodes.join(', ')}</Blocks>

            <ScheduledTimeWrapper>
              {index !== 0 && <ScheduledTimeText />}

              {index === 0 && isEditingScheduledTIme && (
                <EditTimeWrapper>
                  <TextField
                    type="time"
                    value={editingScheduledTime}
                    onChange={event =>
                      setEditingScheduledTime(event.target.value)
                    }
                    size="small"
                  />

                  <ConfirmButton
                    type="button"
                    onClick={handleSaveScheduledTimeEdit}
                  >
                    ✓
                  </ConfirmButton>

                  <CancelButton
                    type="button"
                    onClick={handleCancelScheduledTimeEdit}
                  >
                    ❌
                  </CancelButton>
                </EditTimeWrapper>
              )}

              {index === 0 && !isEditingScheduledTIme && (
                <>
                  <ScheduledTimeText>{scheduledTime || '-'}</ScheduledTimeText>

                  <EditIconButton
                    type="button"
                    onClick={handleStartScheduledTimeEdit}
                  >
                    ✎
                  </EditIconButton>
                </>
              )}
            </ScheduledTimeWrapper>

            <DelayWrapper>{renderDelayCell(row, index)}</DelayWrapper>
          </TemplateRow>
        ))
      )}

      <BottomActions>
        <ActionButonWrapper>
          <Button
            loading={isSavingTemplate}
            disabled={!isTemplateValid || isSavingTemplate}
            onCick={handleApplyChanges}
          >
            Применить изменения
          </Button>
        </ActionButonWrapper>
      </BottomActions>
    </>
  );
}
