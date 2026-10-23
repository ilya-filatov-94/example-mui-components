import { memo, useEffect, useRef, useState } from 'react';
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

const OPEN_DELAY = 150;
const CLOSE_DELAY = 200;

function ChipsCellInner({ items, maxVisible = 2, onEdit }: ChipsCellProps) {
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
          onClick={() => setOpen(true)}
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
        keepMounted
        hideBackdrop
        disableScrollLock
        transitionDuration={0}
        disableAutoFocus
        disableRestoreFocus
        disableEnforceFocus
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            style: {
              marginTop: 4, // ← тот самый зазор между кнопкой и поповером
            },
            onMouseEnter: clearTimers,
            onMouseLeave: scheduleClose,
          },
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

export const ChipsCell = memo(ChipsCellInner, (prev, next) => {
  // items — массив; сравниваем по содержимому (ссылка может меняться при map/filter)
  if (prev.items === next.items && prev.maxVisible === next.maxVisible)
    return true;
  if (prev.items.length !== next.items.length) return false;
  for (let i = 0; i < prev.items.length; i++) {
    if (prev.items[i] !== next.items[i]) return false;
  }
  // onEdit НЕ сравниваем — он новый каждый рендер, и это ок
  return true;
});
