import { useEffect, useRef, useState } from 'react';
import { Popover } from '@mui/material';
import {
  BlockChip,
  ChipsPopoverContent,
  ChipsWrapper,
  IconButton,
  MoreChipsButton,
} from './styles';

interface ChipsCellProps {
  items: string[];
  maxVisible?: number;
  onEdit: () => void;
}

export const ChipsWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap; /* всё в одну строку — высота стабильна */
  align-items: center;
  gap: 6px;
  min-width: 0; /* разрешаем flex-детям сжиматься */
`;

export const BlockChip = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  background-color: #f0f2f5;
  font-size: 13px;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const MoreChipsButton = styled.button`
  flex-shrink: 0;
  border: none;
  border-radius: 12px;
  padding: 3px 8px;
  background: #eef1f4;
  color: #596579;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #e1e5e9;
  }
`;

export const ChipsPopoverContent = styled.div`
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 360px;
  max-height: 280px;
  overflow-y: auto;

  /* внутри попапа полное имя чипа — без обрезки */
  ${BlockChip} {
    max-width: none;
  }
`;

const OPEN_DELAY = 150; // мс — чтобы не мигать при проходе мимо
const CLOSE_DELAY = 200; // мс — чтобы успеть перевести курсор на popover

export function ChipsCell({ items, maxVisible = 2, onEdit }: ChipsCellProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleOpen = () => {
    clearTimers();
    openTimerRef.current = setTimeout(() => setOpen(true), OPEN_DELAY);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimerRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  // очистка при unmount
  useEffect(() => clearTimers, []);

  const visible = items.slice(0, maxVisible);
  const hiddenCount = items.length - visible.length;

  return (
    <ChipsWrapper>
      {visible.map(code => (
        <BlockChip
          key={code}
          title={code}
        >
          {code}
        </BlockChip>
      ))}

      {hiddenCount > 0 && (
        <MoreChipsButton
          ref={triggerRef}
          type="button"
          onMouseEnter={scheduleOpen}
          onMouseLeave={scheduleClose}
          onClick={() => setOpen(true)} // fallback для клавиатуры
          aria-label={`Показать ещё ${hiddenCount}`}
        >
          +{hiddenCount}
        </MoreChipsButton>
      )}

      <IconButton
        type="button"
        onClick={onEdit}
        aria-label="Редактировать состав"
      >
        ✎
      </IconButton>

      <Popover
        open={open}
        anchorEl={triggerRef.current}
        onClose={() => setOpen(false)}
        disableAutoFocus
        disableRestoreFocus
        disableEnforceFocus
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          onMouseEnter: clearTimers, // курсор на popover — не закрываем
          onMouseLeave: scheduleClose,
        }}
      >
        <ChipsPopoverContent>
          {items.map(code => (
            <BlockChip key={code}>{code}</BlockChip>
          ))}
        </ChipsPopoverContent>
      </Popover>
    </ChipsWrapper>
  );
}

// if (isEditingId === row.groupId) { /* CompositionMultiSelect */ }
// return (
//   <ChipsCell
//     items={row.nodeCodes}
//     maxVisible={2}
//     onEdit={() => editing.start(row)}
//   />
// );
