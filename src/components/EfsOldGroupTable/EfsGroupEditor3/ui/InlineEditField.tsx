import { useRef, type ReactNode } from 'react';
import { useClickAway } from '@/shared/lib/hooks/useClickAway';
import { EditFieldWrapper, IconButton } from './styles';

interface InlineEditFieldProps {
  children: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmDisabled?: boolean;
}

export function InlineEditField({
  children,
  onConfirm,
  onCancel,
  confirmDisabled,
}: InlineEditFieldProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickAway(wrapperRef, onCancel);

  return (
    <EditFieldWrapper ref={wrapperRef}>
      {children}
      <IconButton
        type="button"
        onClick={onConfirm}
        disabled={confirmDisabled}
        aria-label="Подтвердить"
      >
        ✓
      </IconButton>
      <IconButton
        type="button"
        $color="#db4742"
        onClick={onCancel}
        aria-label="Отменить"
      >
        ✕
      </IconButton>
    </EditFieldWrapper>
  );
}
