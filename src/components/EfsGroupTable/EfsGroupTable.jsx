import {
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useState, useEffect, useMemo } from 'react';

export function EfsGroupTable({ chosenSystem, chosenStand }) {
  const [groups, setGroups] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [isLoadingGroups, setLoadingGroups] = useState(false);
  const [isSavingGroups, setSavingGroups] = useState(false);

  const [ediingGroupId, setEditingGroupId] = useState(null);
  const [editingNodeCodes, setEditingNodeCodes] = useState([]);

  const [editiongGroupNameId, setEditingGroupNameId] = useState(null);
  const [editingGroupName, setEditingGroupName] = useState('');

  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupNodeCodes, setNewGroupNodeCodes] = useState([]);

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

  const freeBlocks = useMemo(() => {
    const usedNodeCodes = new Set(
      groupedData.flatMap(group => group.nodeCodes),
    );

    return blocks.filter(nodeCode => !usedNodeCodes.has(nodeCode));
  }, []);

  const canApplyChanges =
    (groupedData.length > 0 || freeBlocks.length > 0) &&
    editingGroupId === null &&
    editingGroupNameId === null;

  const resetEditingState = () => {
    setEditingGroupId(null);
    setEditingNodeCodes([]);
    setEditingGroupNameId(null);
    setEditingGroupName('');
    setNewGroupName('');
    setNewGroupNodeCodes([]);
  };

  useEffect(() => {
    if (!chosenSystem?.serviceManagerId || !chosenStand) {
      setGroups([]);
      setBlocks([]);
      resetEditingState();

      return;
    }

    getEfsGroups(
      chosenSystem.serviceManagerId,
      chosenStand,
      setGroups,
      setLoadingGroups,
    );
    getEfsBlocks(chosenSystem.serviceManagerId, chosenStand, setBlocks);

    resetEditingState();
  }, [chosenSystem, chosenStand]);

  const flattenGroups = groupList => {
    return groupList.flatMap(group => {
      return group.nodeCodes.map(nodeCode => ({
        groupId: group.groupId,
        groupNm: group.groupNm,
        seq: group.seq,
        nodeCode,
      }));
    });
  };

  const normalizeSequence = groupList => {
    return groupList.map((group, index) => ({
      ...group,
      seq: index + 1,
    }));
  };

  const reloadGroups = () => {
    if (!chosenSystem?.serviceManagerId || !chosenStand) {
      return;
    }
    getEfsGroups(
      chosenSystem.serviceManagerId,
      chosenStand,
      setGroups,
      setLoadingGroups,
    );
    resetEditingState();
  };

  const handleStartEdit = group => {
    setEditingGroupId(group.groupId);
    setEditingNodeCodes(group.nodeCodes);
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setEditingNodeCodes([]);
  };

  const handleSaveEdit = groupId => {
    if (editingNodeCodes.length === 0) {
      return;
    }

    const updatedGroupedData = groupedData.map(group => {
      if (group.groupId !== groupId) {
        return group;
      }

      return {
        ...group,
        nodeCodes: editingNodeCodes,
      };
    });

    setGroups(flattenGroups(updatedGroupedData));
    setEditingGroupId(null);
    setEditingNodeCodes([]);
  };

  const handleStartNameEdit = group => {
    setEditingGroupNameId(group.groupId);
    setEditingGroupName(group.groupNm);
  };

  const handleCancelNameEdit = () => {
    setEditingGroupNameId(null);
    setEditingGroupName('');
  };

  const handleSaveNameEdit = groupId => {
    if (!editingGroupName.trim()) {
      return;
    }

    const updatedGroupedData = groupedData.map(group => {
      if (group.groupId !== groupId) {
        return group;
      }

      return {
        ...group,
        groupNm: editingGroupName.trim(),
      };
    });

    setGroups(flattenGroups(updatedGroupedData));
    setEditingGroupNameId(null);
    setEditingGroupName('');
  };

  const handleDisbandGroup = groupId => {
    const remainingGroups = groupedData.filter(
      group => group.groupId !== groupId,
    );
    const normalizedGroups = normalizeSequence(remainingGroups);

    setGroups(flattenGroups(normalizedGroups));

    if (editingGroupId === groupId) {
      setEditingGroupId(null);
      setEditingNodeCodes([]);
    }

    if (editiongGroupNameId === groupId) {
      setEditingGroupNameId(null);
      setEditingGroupName('');
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || newGroupNodeCodes.length === 0) {
      return;
    }

    const newGroup = {
      groupId: `new-${Date.now()}`,
      groupNm: newGroupName.trim(),
      seq: groupedData.length + 1,
      nodeCodes: newGroupNodeCodes,
    };

    setGroups(flattenGroups([...groupedData, newGroup]));
    setNewGroupName('');
    setNewGroupNodeCodes([]);
  };

  const handleMoveGroup = (groupId, directon) => {
    const currentIndex = groupedData.findIndex(
      group => group.groupId === groupId,
    );

    if (currentIndex === -1) {
      return;
    }

    const targetIndex =
      direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= groupedData.length) {
      return;
    }

    const reorderedGroups = [...groupedData];

    const [movedGroup] = reorderedGroups.splice(currentIndex, 1);

    reorderedGroups.splice(targetIndex, 0, movedGroup);

    const normalizedGroups = normalizeSequence(reorderedGroups);

    setGroups(flattenGroups(normalizedGroups));
  };

  const handleApplyChanges = () => {
    if (!canApplyChanges) {
      return;
    }

    const existingGroups = groupedData.map(group => ({
      name: group.groupNm,
      sequenceNo: group.seq,
      nodeCodes: group.nodeCodes,
    }));

    const singletonGroups = freeBlocks.map((nodeCode, index) => ({
      name: nodeCode,
      sequenceNo: groupedData.length + index + 1,
      nodeCodes: [nodeCode],
    }));

    const request = {
      ci: chosenSystem.serviceManagerId,
      stand: chosenStand,
      groups: [...existingGroups, ...singletonGroups],
    };

    saveEfsGroups(request, setSavingGroups, reloadGroups);
  };

  if (isLoadingGroups) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!chosenSystem?.serviceManagerId || !chosenStand) {
    return <EmptyData label="Выберите КЭ и стенд для отображения групп" />;
  }

  return (
    <>
      <GroupsTableHeader>
        <div>Очередность</div>
        <div>Наименование группы</div>
        <div>Состав группы</div>
        <div />
      </GroupsTableHeader>

      {groupedData.map((group, index) => {
        const isEditing = editingGroupId === group.groupId;
        const isEditingName = editingGroupNameId === group.groupId;

        const blockUsedByOtherGroups = groupedData
          .filter(item => item.groupId !== group.groupId)
          .flatMap(item => item.nodeCodes);

        return (
          <GroupRow key={group.groupId}>
            <GroupSequence>{group.seq}</GroupSequence>

            <GroupName>
              {isEditingName ? (
                <GroupNameEditWrapper>
                  <TextField
                    value={editingGroupName}
                    onChange={e => setEditingGroupName(e.target.value)}
                    size="small"
                    sx={{ width: '160px ' }}
                  />

                  <ConfirmNameButton
                    type="button"
                    onClick={() => handleSaveEdit(group.groupId)}
                  >
                    ✓
                  </ConfirmNameButton>

                  <CancelNameButton
                    type="button"
                    onClick={handleCancelNameEdit}
                  >
                    ❌
                  </CancelNameButton>
                </GroupNameEditWrapper>
              ) : (
                <GroupNameWrapper>
                  <span>{group.groupNm}</span>

                  <EditIconButton
                    type="button"
                    onClick={() => handleStartNameEdit(group)}
                  >
                    ✎
                  </EditIconButton>
                </GroupNameWrapper>
              )}
            </GroupName>

            <GroupBlocks>
              {isEditing ? (
                <EditCompositionWrapper>
                  <Select
                    multiple
                    value={editingNodeCodes}
                    onChange={e => setEditingNodeCodes(event.target.value)}
                    size="small"
                    fullWidth
                    renderValue={selected => selected.join(', ')}
                  >
                    {blocks.map(nodeCode => {
                      const isUsedByOtherGroup =
                        blocksUsedByOtherGroups.includes(nodeCode);

                      return (
                        <MenuItem
                          key={nodeCode}
                          value={nodeCode}
                          disabled={isUsedByOtherGroup}
                        >
                          <Checkbox
                            checked={editingNodeCodes.includes(nodeCode)}
                          />
                          <ListItemText primary={nodeCode} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </EditCompositionWrapper>
              ) : (
                group.nodeCodes.map(nodeCode => (
                  <BlockChip key={nodeCode}>{nodeCode}</BlockChip>
                ))
              )}
            </GroupBlocks>

            <GroupActions>
              {isEditing ? (
                <>
                  <ActionButonWrapper>
                    <Button
                      disabled={editingNodeCodes.length === 0}
                      onCick={() => handleSaveEdit(group.groupId)}
                    >
                      Сохранить
                    </Button>
                  </ActionButonWrapper>
                  <ActionButonWrapper>
                    <Button
                      disabled={editingNodeCodes.length === 0}
                      onCick={handleCancelEdit}
                    >
                      Отмена
                    </Button>
                  </ActionButonWrapper>
                </>
              ) : (
                <>
                  <ActionButonWrapper>
                    <Button
                      disabled={editingNodeCodes.length === 0}
                      onCick={() => handleDisbandGroup(group.groupId)}
                    >
                      Расформировать
                    </Button>
                  </ActionButonWrapper>

                  <MoveButton
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveGroup(group.groupId, 'up')}
                  >
                    ↑
                  </MoveButton>

                  <MoveButton
                    type="button"
                    disabled={index === groupedData.length - 1}
                    onClick={() => handleMoveGroup(group.groupId, 'down')}
                  >
                    ⬇
                  </MoveButton>
                </>
              )}
            </GroupActions>
          </GroupRow>
        );
      })}

      <CreationBlock>
        <CreationTitle>{`Создание группы для ${chosenSystem.serviceManagerId}`}</CreationTitle>

        <CreationControls>
          <CreationField>
            <FieldLabel>Наименование группы</FieldLabel>

            <TextField
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Наименование группы"
              size="small"
              fullWidth
            />
          </CreationField>

          <CreationBlocksField>
            <FieldLabel>Состав группы</FieldLabel>

            <Select
              multiple
              value={newGroupNodeCodes}
              onChange={e => setNewGroupNodeCodes(e.target.value)}
              size="small"
              fullWidth
              displayEmpty
              renderValue={selected =>
                selected.length === 0 ? 'Состав группы' : selected.join(', ')
              }
            >
              {freeBlocks.map(nodeCode => (
                <MenuItem
                  key={nodeCode}
                  value={nodeCode}
                >
                  <Checkbox checked={newGroupNodeCodes.includes(nodeCode)} />
                  <ListItemText primary={nodeCode} />
                </MenuItem>
              ))}
            </Select>

            <ActionButonWrapper>
              <Button
                disabled={
                  !newGroupName.trim() || newGroupNodeCodes.length === 0
                }
                onCick={handleCreateGroup}
              >
                Добавить группу
              </Button>
            </ActionButonWrapper>
          </CreationBlocksField>
        </CreationControls>

        <FreeBlocksWrapper>
          <FreeBlocksTitle>Неназначенные блоки</FreeBlocksTitle>

          {freeBlocks.length === 0 ? (
            <EmptyText>Неназначенных блоков нет</EmptyText>
          ) : (
            <FreeBlocksList>
              {freeBlocks.map(nodeCode => (
                <BlockChip key={nodeCode}>{nodeCode}</BlockChip>
              ))}
            </FreeBlocksList>
          )}
        </FreeBlocksWrapper>
      </CreationBlock>

      <BottomActions>
        <ActionButonWrapper>
          <Button
            disabled={isSavingGroups}
            onCick={reloadGroups}
          >
            Отменить изменения
          </Button>
        </ActionButonWrapper>

        <ActionButonWrapper>
          <Button
            loading={isSavingGroups}
            disabled={!canApplyChanges || isSavingGroups}
            onCick={handleApplyChanges}
          >
            Применить изменения
          </Button>
        </ActionButonWrapper>
      </BottomActions>
    </>
  );
}
