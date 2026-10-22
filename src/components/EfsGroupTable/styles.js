import styled from 'styled-components';

export const GroupsTableHeader = styled.div`
  display: grid;
  grid-template-columns: 120px 240px 1fr 430px;
  align-items: center;
  min-height: 44px;
  padding: 0 12px;
  background-color: #f3f4f7;
  color: #596579;
  font-weight: 600;
`;

export const GroupRow = styled.div`
  display: grid;
  grid-template-columns: 120px 240px 1fr 430px;
  align-items: center;
  min-height: 54px;
  padding: 0 12px;
  border-bottom: 1px solid #e6e8eb;
`;

export const GroupSequence = styled.div`
  font-size: 15px;
`;

export const GroupName = styled.div`
  font-size: 15px;
`;

export const GroupNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const GroupNameEditWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const GroupBlocks = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding-right: 16px;
`;

export const EditCompositionWrapper = styled.div`
  width: 100%;
  max-width: 420px;
`;

export const GroupActions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
`;

export const ActrionButtonWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;

  button {
    width: auto;
    min-width: max-content;
    white-space: nowrap;
  }
`;

export const MoveButton = styled.div`
  min-width: 34px;
  border: none;
  border-radius: 6px;
  padding: 7px 10px;
  background-color: #eef1f4;
  color: #596579;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: #e1e5e9;
  }

  &:disabled {
    cursor: default;
    opacity: 0.45;
  }
`;

export const EditIconButton = styled.button`
  border: none;
  background: transparent;
  color: #1e9bff;
  cursor: pointer;
  font-size: 24px;
  padding: 0;
`;

export const ConfirmNameButton = styled.button`
  border: none;
  background: transparent;
  color: #1e9bff;
  cursor: pointer;
  font-size: 24px;
  padding: 0;
`;

export const CancelNameButton = styled.button`
  border: none;
  background: transparent;
  color: #db4742;
  cursor: pointer;
  font-size: 24px;
  padding: 0;
`;

export const CreationBlock = styled.div`
  padding: 16px 0 10px 0;
`;

export const CreationTitle = styled.div`
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
`;

export const CreationControls = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
`;

export const CreationField = styled.div`
  width: 300px;
`;

export const CreationsBlocksField = styled.div`
  width: 420px;
`;

export const FieldLabel = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
`;

export const FreeBlocksWrapper = styled.div`
  margin-top: 20px;
`;

export const FreeBlocksTitle = styled.div`
  margin-bottom: 10px;
  font-weight: 600;
`;

export const FreeBlocksList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const BlockChip = styled.div`
  padding: 4px 8px;
  border-radius: 12px;
  background-color: #f0f2f5;
`;

export const BottomActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-top: 20px;
`;

export const EmptyText = styled.div`
  color: #8a919b;
`;

export const LoaderWrapper = styled.div`
  padding: 0 20px;
`;
