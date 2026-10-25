import styled from 'styled-components';

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

  &:hover:not(:disabled) {
    opacity: 0.7;
  }
  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const InlineDisplayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InlineDisplayText = styled.span`
  font-size: 15px;
`;

export const BottomActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 14px;
`;

export const ActionButtonWrapper = styled.div`
  display: inline-flex;
  align-items: center;

  button {
    width: auto;
    min-width: max-content;
    white-space: nowrap;
  }
`;

export const EmptyText = styled.div`
  padding: 20px 24px;
  color: #8a919b;
`;

export const LoaderWrapper = styled.div`
  padding: 15px;
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;
