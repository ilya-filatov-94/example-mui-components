import { useRef, type ReactNode } from 'react';
import { useClickAway } from '../EfsGroupEditor/useClickAway';
import { EditFieldWrapper, IconButton } from './styles';

interface InlineEditFieldProps {
  children: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export function InlineEditField({
  children,
  onConfirm,
  onCancel,
}: InlineEditFieldProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickAway(wrapperRef, onCancel);

  return (
    <EditFieldWrapper ref={wrapperRef}>
      {children}
      <IconButton
        type="button"
        onClick={onConfirm}
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
