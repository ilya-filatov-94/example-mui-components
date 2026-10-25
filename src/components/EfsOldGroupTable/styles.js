import styled from 'styled-components';

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

export const Blocks = styled.div`
  font-size: 15px;
`;

export const BottomActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 14px;
`;

export const BottomLine = styled.div`
  height: 14px;
  margin-top: 145px;
  background-color: #f4f4f7;
`;

export const CancelButton = styled.button`
  border: none;
  background: transparent;
  color: #db4742;
  cursor: pointer;
  font-size: 24px;
  padding: 0;
`;

export const ConfirmButton = styled.button`
  border: none;
  background: transparent;
  color: #1e9bff;
  cursor: pointer;
  font-size: 24px;
  padding: 0;
`;

export const DelayWrapper = styled.div`
  width: 180px;
`;

export const EditIconButton = styled.button`
  border: none;
  background: transparent;
  color: #1e9bff;
  cursor: pointer;
  font-size: 24px;
  padding: 0;
`;

export const EditTimeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const EmptyText = styled.div`
  padding: 20px 24px;
  color: #8a919b;
`;

export const GroupName = styled.div`
  font-size: 15px;
`;

export const ScheduledTimeText = styled.div`
  min-width: 72px;
  fonzt-size: 15px;
`;

export const ScheduledTimeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const TemplateRow = styled.div`
  display: grid;
  grid-template-columns: 280px 280px 250px 1fr;
  align-items: center;
  min-height: 54px;
  padding: 0 24px;
  border-bottom: 1px solid #e6e8eb;
`;

export const TemplateTableHeader = styled.div`
  display: grid;
  grid-template-columns: 280px 280px 250px 1fr;
  align-items: center;
  min-height: 44px;
  padding: 0 24px;
  background-color: #f3f4f7;
  color: #596579;
  font-weight: 600;
`;

export const WrapperLoader = styled.div`
  width: 100%;
  height: 100%;
  padding: 15px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
