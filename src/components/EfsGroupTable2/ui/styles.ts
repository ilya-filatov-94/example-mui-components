import styled from 'styled-components';

export const GroupNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const GroupNameText = styled.span`
  font-size: 15px;
`;

export const EditFieldWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const IconButton = styled.button<{ $color?: string }>`
  border: none;
  background: transparent;
  color: ${p => p.$color ?? '#1e9bff'};
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  padding: 0 4px;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.7;
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionButtonWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;

  button {
    width: auto;
    min-width: max-content;
    white-space: nowrap;
  }
`;

export const MoveButton = styled.button`
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

export const ChipsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  white-space: normal;
`;

export const BlockChip = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  background-color: #f0f2f5;
  font-size: 13px;
`;

export const CreationBlock = styled.div`
  padding: 16px 0 10px;
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
  flex-wrap: wrap;
`;

export const CreationField = styled.div`
  width: 300px;
`;

export const CreationBlocksField = styled.div`
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

export const EmptyText = styled.div`
  color: #8a919b;
`;

export const BottomActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-top: 20px;
`;

export const LoaderWrapper = styled.div`
  padding: 0 20px;
`;
