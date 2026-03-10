import { FC, useRef, useState, useCallback, useEffect } from 'react';
import styles from './ResizePanel.module.css';

const ResizePanel: FC = () => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(268);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        setSidebarWidth(prev => {
            if (sidebarRef.current) {
                return mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left
            }
            return prev;
        }

        );
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className={styles['app-container']}>
      <div
        ref={sidebarRef}
        className={styles['app-sidebar']}
        style={{ width: sidebarWidth }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className={styles['app-sidebar-content']} />
        <div className={styles['app-sidebar-resizer']} onMouseDown={startResizing} />
      </div>
      <div className={styles['app-frame']} />
    </div>
  );
}

export default ResizePanel;
