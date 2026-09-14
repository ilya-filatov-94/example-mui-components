import styled from 'styled-components';

const STATUS_STYLES: Record<string, { bg: string; fg: string }> = {
  CREATED: { bg: '#eceff1', fg: '#455a64' },
  RUNNING: { bg: '#e3f2fd', fg: '#0d47a1' },
  PROCESSING: { bg: '#e3f2fd', fg: '#0d47a1' },
  PAUSED: { bg: '#fff8e1', fg: '#8d6e00' },
  PENDING: { bg: '#f5f5f5', fg: '#616161' },
  FAILED: { bg: '#ffebee', fg: '#b71c1c' },
  FINISHED: { bg: '#e8f5e9', fg: '#1b5e20' },
};

const Badge = styled.span<{ $bg: string; $fg: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  background: ${p => p.$bg};
  color: ${p => p.$fg};
  white-space: nowrap;
`;

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { bg: '#eee', fg: '#333' };
  return (
    <Badge
      $bg={s.bg}
      $fg={s.fg}
    >
      {status}
    </Badge>
  );
}
