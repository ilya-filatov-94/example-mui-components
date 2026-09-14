import styled from 'styled-components';

const Wrapper = styled.span`
  position: relative;
  display: inline-block;
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;

  & .tooltip {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s;
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    max-width: 320px;
    width: max-content;
    background: #263238;
    color: #fff;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.4;
    white-space: normal;
    z-index: 20;
    pointer-events: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  & .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 12px;
    border: 6px solid transparent;
    border-top-color: #263238;
  }

  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

export function TechInfoCell({ errorReason }: { errorReason: string | null }) {
  if (!errorReason) return <span>—</span>;
  return (
    <Wrapper>
      Подробнее
      <span className="tooltip">{errorReason}</span>
    </Wrapper>
  );
}
