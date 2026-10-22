import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import {
  ActionButtonWrapper,
  BlockChip,
  CreationBlock,
  CreationBlocksField,
  CreationControls,
  CreationField,
  CreationTitle,
  EmptyText,
  FieldLabel,
  FreeBlocksList,
  FreeBlocksTitle,
  FreeBlocksWrapper,
} from './styles';
import { CompositionMultiSelect } from './CompositionMultiSelect';

interface CreateGroupFormProps {
  freeBlocks: string[];
  systemName: string;
  onCreate: (name: string, nodeCodes: string[]) => void;
}

export function CreateGroupForm({
  freeBlocks,
  systemName,
  onCreate,
}: CreateGroupFormProps) {
  const [name, setName] = useState('');
  const [nodeCodes, setNodeCodes] = useState<string[]>([]);

  const canCreate = name.trim().length > 0 && nodeCodes.length > 0;

  const handleSubmit = () => {
    if (!canCreate) return;
    onCreate(name.trim(), nodeCodes);
    setName('');
    setNodeCodes([]);
  };

  return (
    <CreationBlock>
      <CreationTitle>{`Создание группы для ${systemName}`}</CreationTitle>

      <CreationControls>
        <CreationField>
          <FieldLabel>Наименование группы</FieldLabel>
          <TextField
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Наименование группы"
            size="small"
            fullWidth
          />
        </CreationField>

        <CreationBlocksField>
          <FieldLabel>Состав группы</FieldLabel>
          <CompositionMultiSelect
            value={nodeCodes}
            onChange={setNodeCodes}
            options={freeBlocks}
            placeholder="Состав группы"
          />
          <ActionButtonWrapper style={{ marginTop: 8 }}>
            <Button
              disabled={!canCreate}
              onClick={handleSubmit}
            >
              Добавить группу
            </Button>
          </ActionButtonWrapper>
        </CreationBlocksField>
      </CreationControls>

      <FreeBlocksWrapper>
        <FreeBlocksTitle>Неназначенные блоки</FreeBlocksTitle>
        {freeBlocks.length === 0 ? (
          <EmptyText>Неназначенных блоков нет</EmptyText>
        ) : (
          <FreeBlocksList>
            {freeBlocks.map(code => (
              <BlockChip key={code}>{code}</BlockChip>
            ))}
          </FreeBlocksList>
        )}
      </FreeBlocksWrapper>
    </CreationBlock>
  );
}
